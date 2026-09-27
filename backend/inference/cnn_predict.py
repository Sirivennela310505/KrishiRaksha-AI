import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import json
import numpy as np
from PIL import Image
import torch
import torch.nn.functional as F

from ml_models.cnn.cnn_architecture import CropDiseaseCNN

IMAGE_SIZE = (128, 128)
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

class CNNPredictor:
    """
    Inference Engine for Crop Leaf Disease Detection using trained CropDiseaseCNN.
    Loads the model once as a singleton and performs per-image inference.
    """
    _instance = None

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml_models", "cnn"))
        model_path  = os.path.join(base_dir, "cnn_crop_model.pt")
        mapping_path = os.path.join(base_dir, "class_mapping.json")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Trained CNN weights missing: {model_path}. Run training/train_cnn.py first.")

        with open(mapping_path, "r") as f:
            raw = json.load(f)
        # json keys are strings; convert to int
        self.class_mapping = {int(k): v for k, v in raw.items()}
        self.num_classes = len(self.class_mapping)

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = CropDiseaseCNN(num_classes=self.num_classes).to(self.device)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval()
        self._initialized = True
        print(f"[CNNPredictor] Ready with {self.num_classes} disease classes.")

    def preprocess(self, img: Image.Image) -> torch.Tensor:
        img = img.convert("RGB").resize(IMAGE_SIZE)
        arr = np.array(img, dtype=np.float32) / 255.0
        arr = (arr - MEAN) / STD
        tensor = torch.tensor(arr, dtype=torch.float32).permute(2, 0, 1).unsqueeze(0)
        return tensor.to(self.device)

    def predict_from_pil(self, img: Image.Image) -> dict:
        tensor = self.preprocess(img)
        with torch.no_grad():
            logits = self.model(tensor)
            probs  = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()

        pred_idx    = int(np.argmax(probs))
        pred_class  = self.class_mapping[pred_idx]
        confidence  = round(float(probs[pred_idx]), 4)
        prob_dict   = {self.class_mapping[i]: round(float(probs[i]), 4)
                       for i in range(self.num_classes)}

        return {
            "predicted_class": pred_class,
            "confidence": confidence,
            "probabilities": prob_dict
        }

    def predict_from_bytes(self, image_bytes: bytes) -> dict:
        import io
        img = Image.open(io.BytesIO(image_bytes))
        return self.predict_from_pil(img)

    def predict_from_path(self, path: str) -> dict:
        with Image.open(path) as img:
            return self.predict_from_pil(img)


# Global singleton helpers
_predictor: CNNPredictor | None = None

def predict_crop_disease_bytes(image_bytes: bytes) -> dict:
    global _predictor
    if _predictor is None:
        _predictor = CNNPredictor()
    return _predictor.predict_from_bytes(image_bytes)

def predict_crop_disease_pil(img: Image.Image) -> dict:
    global _predictor
    if _predictor is None:
        _predictor = CNNPredictor()
    return _predictor.predict_from_pil(img)
