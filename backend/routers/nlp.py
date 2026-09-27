from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from inference.lstm_predict import predict_query_intent

router = APIRouter(prefix="/api/nlp", tags=["LSTM NLP Intent Engine"])

class NLPRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

class NLPResponse(BaseModel):
    intent: str
    confidence: float
    probabilities: dict
    tokens: list
    model: str = "Bidirectional LSTM (Trained)"

@router.post("/predict", response_model=NLPResponse)
def nlp_predict_intent(req: NLPRequest):
    """
    Farmer query intent classification using trained Bidirectional LSTM.
    Accepts any farmer text query and returns predicted intent, real confidence, and class probabilities.
    """
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        result = predict_query_intent(text)
        return NLPResponse(
            intent=result["intent"],
            confidence=result["confidence"],
            probabilities=result["probabilities"],
            tokens=result["tokens"]
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=f"LSTM model not loaded: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NLP inference error: {str(e)}")
