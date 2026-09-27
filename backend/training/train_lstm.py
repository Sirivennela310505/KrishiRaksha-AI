import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import json
import re
import random
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

from ml_models.lstm.lstm_architecture import FarmerQueryLSTM

# Set random seeds for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

MAX_SEQ_LEN = 24
EMBEDDING_DIM = 48
HIDDEN_DIM = 64
BATCH_SIZE = 16
EPOCHS = 40
LEARNING_RATE = 0.002

def clean_and_tokenize(text: str):
    text = text.lower().strip()
    text = re.sub(r'[?!.,;:()"\']', ' ', text)
    tokens = [t for t in text.split() if t]
    return tokens

class IntentDataset(Dataset):
    def __init__(self, sequences, labels, is_train=False):
        self.sequences = sequences
        self.labels = labels
        self.is_train = is_train

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        seq = list(self.sequences[idx])
        # Word dropout during training to prevent overfitting to specific single words
        if self.is_train:
            seq = [tok if random.random() > 0.12 else 1 for tok in seq]
        return torch.tensor(seq, dtype=torch.long), torch.tensor(self.labels[idx], dtype=torch.long)

def train_lstm_pipeline():
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "data", "nlp", "agricultural_intents.json")
    output_dir = os.path.join(os.path.dirname(__file__), "..", "ml_models", "lstm")
    os.makedirs(output_dir, exist_ok=True)

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Collect all examples and build vocab
    raw_texts = []
    raw_labels = []
    classes = []

    for item in data:
        intent = item["intent"]
        if intent not in classes:
            classes.append(intent)
        for example in item["examples"]:
            raw_texts.append(example)
            raw_labels.append(classes.index(intent))

    print(f"[LSTM Training] Loaded {len(raw_texts)} farmer queries across {len(classes)} classes.")

    # 2. Build Vocabulary
    vocab = {"<PAD>": 0, "<UNK>": 1}
    for text in raw_texts:
        for token in clean_and_tokenize(text):
            if token not in vocab:
                vocab[token] = len(vocab)

    print(f"[LSTM Training] Vocabulary size: {len(vocab)} unique tokens.")

    # 3. Convert texts to padded sequences
    def text_to_sequence(text):
        tokens = clean_and_tokenize(text)
        seq = [vocab.get(tok, vocab["<UNK>"]) for tok in tokens][:MAX_SEQ_LEN]
        # Pad with 0s
        seq += [vocab["<PAD>"]] * (MAX_SEQ_LEN - len(seq))
        return seq

    sequences = [text_to_sequence(t) for t in raw_texts]

    # 4. Train/Validation Split (80% train, 20% validation, stratified)
    X_train, X_val, y_train, y_val = train_test_split(
        sequences, raw_labels, test_size=0.20, random_state=SEED, stratify=raw_labels
    )

    train_dataset = IntentDataset(X_train, y_train, is_train=True)
    val_dataset = IntentDataset(X_val, y_val, is_train=False)

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)

    # 5. Initialize Model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = FarmerQueryLSTM(
        vocab_size=len(vocab),
        embedding_dim=EMBEDDING_DIM,
        hidden_dim=HIDDEN_DIM,
        num_classes=len(classes),
        padding_idx=vocab["<PAD>"],
        dropout=0.3
    ).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE, weight_decay=1e-4)

    # 6. Training Loop
    best_val_acc = 0.0
    training_history = []

    print("[LSTM Training] Commencing training epochs...")
    for epoch in range(1, EPOCHS + 1):
        model.train()
        total_loss = 0.0
        correct = 0
        total = 0

        for seqs, labels in train_loader:
            seqs, labels = seqs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(seqs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            total_loss += loss.item() * seqs.size(0)
            preds = torch.argmax(outputs, dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_loss = total_loss / total
        train_acc = correct / total

        # Validation phase
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        all_preds = []
        all_labels = []

        with torch.no_grad():
            for seqs, labels in val_loader:
                seqs, labels = seqs.to(device), labels.to(device)
                outputs = model(seqs)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * seqs.size(0)
                preds = torch.argmax(outputs, dim=1)
                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)
                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())

        val_loss = val_loss / val_total
        val_acc = val_correct / val_total

        training_history.append({
            "epoch": epoch,
            "train_loss": round(train_loss, 4),
            "train_accuracy": round(train_acc, 4),
            "val_loss": round(val_loss, 4),
            "val_accuracy": round(val_acc, 4)
        })

        if epoch % 5 == 0 or epoch == EPOCHS:
            print(f"Epoch [{epoch}/{EPOCHS}] | Train Loss: {train_loss:.4f} Acc: {train_acc*100:.1f}% | Val Loss: {val_loss:.4f} Val Acc: {val_acc*100:.1f}%")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), os.path.join(output_dir, "lstm_model.pt"))

    # 7. Final Model Evaluation & Artifact Saving
    # Load best weights
    model.load_state_dict(torch.load(os.path.join(output_dir, "lstm_model.pt")))
    model.eval()

    all_preds = []
    all_labels = []
    with torch.no_grad():
        for seqs, labels in val_loader:
            seqs = seqs.to(device)
            outputs = model(seqs)
            preds = torch.argmax(outputs, dim=1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())

    final_val_acc = accuracy_score(all_labels, all_preds)
    report = classification_report(all_labels, all_preds, target_names=classes, output_dict=True, zero_division=0)

    # Save artifacts
    with open(os.path.join(output_dir, "vocab.json"), "w", encoding="utf-8") as f:
        json.dump(vocab, f, indent=2, ensure_ascii=False)

    with open(os.path.join(output_dir, "intent_classes.json"), "w", encoding="utf-8") as f:
        json.dump(classes, f, indent=2)

    eval_results = {
        "model": "Bidirectional LSTM",
        "num_classes": len(classes),
        "total_dataset_size": len(raw_texts),
        "train_size": len(X_train),
        "val_size": len(X_val),
        "vocabulary_size": len(vocab),
        "max_seq_length": MAX_SEQ_LEN,
        "embedding_dim": EMBEDDING_DIM,
        "hidden_dim": HIDDEN_DIM,
        "epochs_trained": EPOCHS,
        "best_validation_accuracy": round(final_val_acc, 4),
        "final_classification_report": report,
        "training_history": training_history
    }

    with open(os.path.join(output_dir, "eval_metrics.json"), "w", encoding="utf-8") as f:
        json.dump(eval_results, f, indent=2)

    print(f"\n[LSTM Training Completed Successfully!]")
    print(f"Best Validation Accuracy: {final_val_acc*100:.2f}%")
    print(f"Artifacts saved to: {output_dir}")

if __name__ == "__main__":
    train_lstm_pipeline()
