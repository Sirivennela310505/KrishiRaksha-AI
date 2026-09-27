import torch
import torch.nn as nn

class CropDiseaseCNN(nn.Module):
    """
    Convolutional Neural Network (CNN) for Crop Leaf Disease Identification.
    Architecture:
    Input: [B, 3, 128, 128]
    -> Conv2D (3 -> 32, 3x3) + BatchNorm + ReLU + MaxPool(2x2) [B, 32, 64, 64]
    -> Conv2D (32 -> 64, 3x3) + BatchNorm + ReLU + MaxPool(2x2) [B, 64, 32, 32]
    -> Conv2D (64 -> 128, 3x3) + BatchNorm + ReLU + MaxPool(2x2) [B, 128, 16, 16]
    -> AdaptiveAvgPool2D(4x4) -> Flatten (2048)
    -> Linear (2048 -> 128) + ReLU + Dropout(0.4)
    -> Linear (128 -> num_classes)
    """
    def __init__(self, num_classes: int = 6):
        super(CropDiseaseCNN, self).__init__()
        
        self.features = nn.Sequential(
            # Block 1
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            
            # Block 2
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            
            # Block 3
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2)
        )
        
        self.avgpool = nn.AdaptiveAvgPool2d((4, 4))
        
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.4),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        logits = self.classifier(x)
        return logits
