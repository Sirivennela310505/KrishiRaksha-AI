import os
import sys
import time
import io
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from PIL import Image

from database import get_db
import models
import schemas
from services.cv_service import CropVisionService
from services.translator_service import translate_crop_doctor_result

# Try to load the real CNN inference engine (trained model must exist)
try:
    from inference.cnn_predict import predict_crop_disease_bytes, predict_crop_disease_pil
    CNN_AVAILABLE = True
    print("[crop_doctor] Real CNN inference engine loaded successfully.")
except Exception as e:
    CNN_AVAILABLE = False
    print(f"[crop_doctor] CNN model not available ({e}), using fallback lookup.")

router = APIRouter(prefix="/api/crop-doctor", tags=["Crop Doctor"])

# Maps CNN class names (trained labels) to domain disease profile keys in cv_service
CNN_CLASS_TO_SAMPLE_KEY = {
    "rice_blast":          "rice_blast",
    "tomato_early_blight": "tomato_blight",
    "cotton_pink_bollworm":"cotton_bollworm",
    "wheat_yellow_rust":   "wheat_rust",
    "chilli_leaf_curl":    "chilli_leaf_curl",
    "healthy_crop":        "healthy_crop"
}

@router.get("/samples")
def get_sample_crops():
    """Return pre-loaded crop disease samples for the Quick Demo section."""
    return CropVisionService.get_available_samples()

@router.post("/analyze", response_model=schemas.CropScanAnalysisResponse)
async def analyze_crop_image(
    image: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    farmer_query: Optional[str] = Form(None),
    language: Optional[str] = Form("te-IN"),
    db: Session = Depends(get_db)
):
    """
    CNN Crop Disease Detection Pipeline:
    1. Reads uploaded image or sample image URL
    2. Runs CropDiseaseCNN inference for real disease classification
    3. Looks up detailed symptom/cause/remedy profile for the predicted class
    4. Translates result to farmer's selected language
    5. Saves scan record and returns structured advisory with voice narrative
    """
    image_bytes = None
    image_name = "upload.jpg"
    image_url = "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80"

    # ── Step 1: Read image bytes ───────────────────────────────────────────────
    if image:
        image_bytes = await image.read()
        image_name = image.filename or "upload.jpg"
        safe_name = f"{int(time.time())}_{os.path.basename(image_name)}"
        file_path = os.path.join("uploads", safe_name)
        with open(file_path, "wb") as f:
            f.write(image_bytes)
        image_url = f"/uploads/{safe_name}"
    elif sample_id:
        samples = {s["id"]: s["image_preview"] for s in CropVisionService.get_available_samples()}
        image_url = samples.get(sample_id, image_url)

    # ── Step 2: CNN Inference ──────────────────────────────────────────────────
    cnn_prediction = None
    cnn_class = None

    if CNN_AVAILABLE and image_bytes:
        try:
            cnn_prediction = predict_crop_disease_bytes(image_bytes)
            cnn_class = cnn_prediction["predicted_class"]
        except Exception as e:
            print(f"[crop_doctor] CNN inference error: {e}, falling back to keyword lookup.")

    elif CNN_AVAILABLE and sample_id:
        # For sample images, load the sample from the dataset directory
        sample_path = os.path.join(
            os.path.dirname(__file__), "..", "data", "crop_disease",
            "train", CNN_CLASS_TO_SAMPLE_KEY.get(sample_id, sample_id)
        )
        if os.path.isdir(sample_path):
            imgs = [f for f in os.listdir(sample_path) if f.endswith('.jpg')]
            if imgs:
                try:
                    img_path = os.path.join(sample_path, imgs[0])
                    with Image.open(img_path) as pil_img:
                        cnn_prediction = predict_crop_disease_pil(pil_img)
                        cnn_class = cnn_prediction["predicted_class"]
                except Exception as e:
                    print(f"[crop_doctor] Sample CNN inference error: {e}")

    # ── Step 3: Map CNN class → detailed disease profile ──────────────────────
    if cnn_class:
        sample_key = CNN_CLASS_TO_SAMPLE_KEY.get(cnn_class, cnn_class)
        confidence = cnn_prediction["confidence"]
    else:
        sample_key = sample_id if sample_id else None
        confidence = None

    diag = CropVisionService.analyze_image(
        image_bytes=image_bytes,
        image_name=image_name,
        sample_key=sample_key,
        farmer_query=farmer_query,
        language=language
    )

    # Inject real CNN confidence if available; otherwise keep the cv_service value
    if confidence is not None:
        diag["confidence"] = round(confidence, 4)
        diag["cnn_class"] = cnn_class
        diag["cnn_probabilities"] = cnn_prediction.get("probabilities", {})

    # ── Step 4: Localize result ────────────────────────────────────────────────
    diag = translate_crop_doctor_result(diag, target_lang=language)

    # ── Step 5: Persist to database ────────────────────────────────────────────
    scan = models.CropScan(
        image_url=image_url,
        detected_crop=diag["crop"],
        detected_condition=diag["condition"],
        confidence=diag["confidence"],
        farmer_voice_query=farmer_query,
        farmer_language=language,
        is_uncertain=diag["confidence"] < 0.70
    )
    db.add(scan)
    db.flush()

    pred = models.DiseasePrediction(
        scan_id=scan.id,
        disease_name=diag["condition"],
        pathogen_type=diag["pathogen_type"],
        symptoms=diag["symptoms"],
        causes=diag["causes"],
        organic_remedies=diag["organic_remedies"],
        chemical_remedies=diag["chemical_remedies"],
        precautions=diag["precautions"],
        expert_consultation_trigger=diag["expert_consultation_trigger"],
        confidence=diag["confidence"]
    )
    db.add(pred)
    db.commit()

    return schemas.CropScanAnalysisResponse(
        scan_id=scan.id,
        crop=diag["crop"],
        condition=diag["condition"],
        confidence=diag["confidence"],
        pathogen_type=diag["pathogen_type"],
        symptoms=diag["symptoms"],
        causes=diag["causes"],
        organic_remedies=diag["organic_remedies"],
        chemical_remedies=diag["chemical_remedies"],
        precautions=diag["precautions"],
        expert_consultation_trigger=diag["expert_consultation_trigger"],
        requires_expert_review=diag["requires_expert_review"],
        image_url=image_url,
        audio_narrative=diag["audio_narrative"],
        language=language,
        disclaimer=diag["disclaimer"]
    )

@router.get("/history")
def get_scan_history(limit: int = 10, db: Session = Depends(get_db)):
    scans = db.query(models.CropScan).order_by(models.CropScan.scan_timestamp.desc()).limit(limit).all()
    return scans

@router.get("/model-info")
def get_model_info():
    """Returns information about the deployed CNN model for academic documentation."""
    import json
    metrics_path = os.path.join(os.path.dirname(__file__), "..", "ml_models", "cnn", "eval_metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path) as f:
            return json.load(f)
    return {"error": "Model metrics not found. Run train_cnn.py first."}
