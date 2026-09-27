import torch
import torch.nn as nn

class FarmerQueryLSTM(nn.Module):
    """
    Bidirectional LSTM Classifier for Multilingual Agricultural Farmer Queries.
    Architecture:
    Input tokens -> Embedding -> Bidirectional LSTM -> Max Pooling -> Dense -> ReLU -> Dropout -> Linear -> Logits
    """
    def __init__(self, vocab_size: int, embedding_dim: int = 64, hidden_dim: int = 128, num_classes: int = 10, padding_idx: int = 0, dropout: float = 0.3):
        super(FarmerQueryLSTM, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=padding_idx)
        self.lstm = nn.LSTM(
            input_size=embedding_dim,
            hidden_size=hidden_dim,
            num_layers=1,
            batch_first=True,
            bidirectional=True
        )
        self.dropout = nn.Dropout(dropout)
        self.fc1 = nn.Linear(hidden_dim * 2, 64)
        self.relu = nn.ReLU()
        self.fc_out = nn.Linear(64, num_classes)

    def forward(self, x):
        embedded = self.embedding(x)
        lstm_out, _ = self.lstm(embedded)
        pooled = torch.max(lstm_out, dim=1)[0]
        out = self.dropout(pooled)
        out = self.relu(self.fc1(out))
        logits = self.fc_out(out)
        return logits
