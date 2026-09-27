import os
import urllib.request
from PIL import Image, ImageEnhance
import random

BASE_SAMPLES = {
    "rice_blast": "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=400&q=80",
    "tomato_early_blight": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80",
    "cotton_pink_bollworm": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=400&q=80",
    "wheat_yellow_rust": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    "chilli_leaf_curl": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80",
    "healthy_crop": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80"
}

def augment_and_save(img: Image.Image, output_dir: str, prefix: str, count: int = 15):
    os.makedirs(output_dir, exist_ok=True)
    # Save original
    img.resize((128, 128)).save(os.path.join(output_dir, f"{prefix}_orig.jpg"), quality=90)
    
    for i in range(1, count + 1):
        aug = img.copy()
        
        # Random rotation
        angle = random.choice([0, 90, 180, 270, random.randint(-25, 25)])
        if angle != 0:
            aug = aug.rotate(angle, expand=False)
            
        # Random flip
        if random.random() > 0.5:
            aug = aug.transpose(Image.FLIP_LEFT_RIGHT)
        if random.random() > 0.7:
            aug = aug.transpose(Image.FLIP_TOP_BOTTOM)
            
        # Color & brightness jitter
        enhancer = ImageEnhance.Brightness(aug)
        aug = enhancer.enhance(random.uniform(0.85, 1.15))
        enhancer = ImageEnhance.Contrast(aug)
        aug = enhancer.enhance(random.uniform(0.85, 1.15))
        
        # Resize to standard CNN input dimension 128x128
        aug = aug.resize((128, 128))
        aug.save(os.path.join(output_dir, f"{prefix}_aug_{i:02d}.jpg"), quality=85)

def prepare_dataset():
    data_dir = os.path.dirname(os.path.abspath(__file__))
    train_dir = os.path.join(data_dir, "train")
    val_dir = os.path.join(data_dir, "val")
    raw_dir = os.path.join(data_dir, "raw_base")
    os.makedirs(raw_dir, exist_ok=True)
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    print("[Dataset Preparation] Fetching base reference crop disease images...")
    for class_name, url in BASE_SAMPLES.items():
        base_path = os.path.join(raw_dir, f"{class_name}.jpg")
        if not os.path.exists(base_path):
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req) as resp, open(base_path, 'wb') as out_f:
                    out_f.write(resp.read())
            except Exception as e:
                print(f"Warning: Failed to download {url}: {e}, creating synthetic base")
                img = Image.new('RGB', (200, 200), color=(random.randint(40, 120), random.randint(100, 180), random.randint(30, 80)))
                img.save(base_path)
                
        base_img = Image.open(base_path).convert('RGB')
        
        # Generate 20 train images and 5 validation images per class
        augment_and_save(base_img, os.path.join(train_dir, class_name), f"tr_{class_name}", count=20)
        augment_and_save(base_img, os.path.join(val_dir, class_name), f"val_{class_name}", count=5)
        print(f"  -> Generated dataset for class: '{class_name}'")

    print("[Dataset Preparation] Complete. Train & Val datasets ready in:", data_dir)

if __name__ == "__main__":
    prepare_dataset()
