import os
import re
import json
import torch
import torch.nn.functional as F
from ml_models.lstm.lstm_architecture import FarmerQueryLSTM

class LSTMPredictor:
    """
    Inference Engine for Farmer Query Intent Classification using trained Bidirectional LSTM.
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(LSTMPredictor, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml_models", "lstm"))
        model_path = os.path.join(base_dir, "lstm_model.pt")
        vocab_path = os.path.join(base_dir, "vocab.json")
        classes_path = os.path.join(base_dir, "intent_classes.json")

        if not os.path.exists(model_path) or not os.path.exists(vocab_path) or not os.path.exists(classes_path):
            raise FileNotFoundError(f"Trained LSTM artifacts missing in {base_dir}. Run training/train_lstm.py first.")

        with open(vocab_path, "r", encoding="utf-8") as f:
            self.vocab = json.load(f)

        with open(classes_path, "r", encoding="utf-8") as f:
            self.classes = json.load(f)

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = FarmerQueryLSTM(
            vocab_size=len(self.vocab),
            embedding_dim=48,
            hidden_dim=64,
            num_classes=len(self.classes),
            padding_idx=self.vocab.get("<PAD>", 0),
            dropout=0.0
        ).to(self.device)

        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval()
        self.max_len = 24
        self._initialized = True
        print(f"[LSTMPredictor] Initialized with {len(self.classes)} intents and vocabulary size {len(self.vocab)}.")

    def clean_and_tokenize(self, text: str):
        text = text.lower().strip()
        text = re.sub(r'[?!.,;:()"\']', ' ', text)
        return [t for t in text.split() if t]

    def predict(self, text: str) -> dict:
        tokens = self.clean_and_tokenize(text)
        if not tokens:
            return {
                "intent": "general_greeting",
                "confidence": 0.50,
                "probabilities": {cls: 0.10 for cls in self.classes},
                "tokens": []
            }

        # Sequence conversion + padding
        seq = [self.vocab.get(tok, self.vocab.get("<UNK>", 1)) for tok in tokens][:self.max_len]
        seq += [self.vocab.get("<PAD>", 0)] * (self.max_len - len(seq))

        input_tensor = torch.tensor([seq], dtype=torch.long, device=self.device)

        with torch.no_grad():
            logits = self.model(input_tensor)
            probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()

        pred_idx = int(probs.argmax())
        pred_intent = self.classes[pred_idx]
        confidence = round(float(probs[pred_idx]), 4)

        prob_dict = {self.classes[i]: round(float(probs[i]), 4) for i in range(len(self.classes))}

        return {
            "intent": pred_intent,
            "confidence": confidence,
            "probabilities": prob_dict,
            "tokens": tokens
        }

# Global helper function
_predictor = None

def predict_query_intent(text: str) -> dict:
    global _predictor
    if _predictor is None:
        _predictor = LSTMPredictor()
    return _predictor.predict(text)
