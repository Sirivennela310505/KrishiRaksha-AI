import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import json
import random
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.metrics import classification_report, accuracy_score

from ml_models.cnn.cnn_architecture import CropDiseaseCNN

SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

IMAGE_SIZE = (128, 128)
BATCH_SIZE = 8
EPOCHS = 20
LEARNING_RATE = 0.001

# Standard ImageNet channel normalization constants
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

class CropImageDataset(Dataset):
    def __init__(self, root_dir, classes):
        self.samples = []
        self.classes = classes
        
        for class_idx, class_name in enumerate(classes):
            class_folder = os.path.join(root_dir, class_name)
            if not os.path.isdir(class_folder):
                continue
            for fname in os.listdir(class_folder):
                if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
                    self.samples.append((os.path.join(class_folder, fname), class_idx))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        with Image.open(path) as img:
            img = img.convert('RGB')
            img = img.resize(IMAGE_SIZE)
            arr = np.array(img, dtype=np.float32) / 255.0
            # Standardize
            arr = (arr - MEAN) / STD
            # HWC -> CHW
            tensor = torch.tensor(arr, dtype=torch.float32).permute(2, 0, 1)
        return tensor, torch.tensor(label, dtype=torch.long)

def train_cnn_pipeline():
    base_data = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "crop_disease"))
    train_dir = os.path.join(base_data, "train")
    val_dir = os.path.join(base_data, "val")
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml_models", "cnn"))
    os.makedirs(output_dir, exist_ok=True)

    classes = sorted([d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))])
    print(f"[CNN Training] Target disease classes ({len(classes)}): {classes}")

    train_dataset = CropImageDataset(train_dir, classes)
    val_dataset = CropImageDataset(val_dir, classes)

    print(f"[CNN Training] Train set size: {len(train_dataset)}, Validation set size: {len(val_dataset)}")

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = CropDiseaseCNN(num_classes=len(classes)).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE, weight_decay=1e-4)

    best_val_acc = 0.0
    training_history = []

    print("[CNN Training] Starting CNN training epochs...")
    for epoch in range(1, EPOCHS + 1):
        model.train()
        total_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            total_loss += loss.item() * images.size(0)
            preds = torch.argmax(outputs, dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_loss = total_loss / total
        train_acc = correct / total

        # Validation
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * images.size(0)
                preds = torch.argmax(outputs, dim=1)
                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)

        val_loss = val_loss / val_total
        val_acc = val_correct / val_total

        training_history.append({
            "epoch": epoch,
            "train_loss": round(train_loss, 4),
            "train_accuracy": round(train_acc, 4),
            "val_loss": round(val_loss, 4),
            "val_accuracy": round(val_acc, 4)
        })

        if epoch % 2 == 0 or epoch == EPOCHS:
            print(f"Epoch [{epoch:02d}/{EPOCHS}] | Train Loss: {train_loss:.4f} Acc: {train_acc*100:.1f}% | Val Loss: {val_loss:.4f} Val Acc: {val_acc*100:.1f}%")

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), os.path.join(output_dir, "cnn_crop_model.pt"))

    # Load best checkpoint and compute full classification metrics
    model.load_state_dict(torch.load(os.path.join(output_dir, "cnn_crop_model.pt")))
    model.eval()

    all_preds = []
    all_labels = []
    with torch.no_grad():
        for images, labels in val_loader:
            images = images.to(device)
            outputs = model(images)
            preds = torch.argmax(outputs, dim=1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())

    final_val_acc = accuracy_score(all_labels, all_preds)
    report = classification_report(all_labels, all_preds, target_names=classes, output_dict=True, zero_division=0)

    # Save class mapping
    class_mapping = {i: cls for i, cls in enumerate(classes)}
    with open(os.path.join(output_dir, "class_mapping.json"), "w", encoding="utf-8") as f:
        json.dump(class_mapping, f, indent=2)

    eval_results = {
        "model": "CropDiseaseCNN (3-Block Deep Convolutional Network)",
        "input_dimensions": "3x128x128",
        "num_classes": len(classes),
        "classes": classes,
        "total_train_images": len(train_dataset),
        "total_val_images": len(val_dataset),
        "epochs_trained": EPOCHS,
        "best_validation_accuracy": round(final_val_acc, 4),
        "final_classification_report": report,
        "training_history": training_history
    }

    with open(os.path.join(output_dir, "eval_metrics.json"), "w", encoding="utf-8") as f:
        json.dump(eval_results, f, indent=2)

    print(f"\n[CNN Training Completed Successfully!]")
    print(f"Best Validation Accuracy: {final_val_acc*100:.2f}%")
    print(f"Model saved to: {os.path.join(output_dir, 'cnn_crop_model.pt')}")

if __name__ == "__main__":
    train_cnn_pipeline()
