from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Profile schemas
class ProfileUpdate(BaseModel):
    preferred_language: Optional[str] = "te-IN"
    state: Optional[str] = "Telangana"
    district: Optional[str] = "Warangal"
    sub_district: Optional[str] = "Hanamkonda"
    village: Optional[str] = "Rampur"
    farm_size_acres: Optional[float] = 4.5
    crops_grown: Optional[List[str]] = ["Paddy", "Cotton", "Chilli"]
    soil_type: Optional[str] = "Black Cotton Soil"
    irrigation_source: Optional[str] = "Borewell & Canal"
    sms_alerts_enabled: Optional[bool] = True
    voice_alerts_enabled: Optional[bool] = True

class ProfileResponse(ProfileUpdate):
    id: int
    user_id: Optional[int] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Crop Doctor schemas
class CropScanAnalysisResponse(BaseModel):
    scan_id: int
    crop: str
    condition: str
    confidence: float
    pathogen_type: str
    symptoms: List[str]
    causes: List[str]
    organic_remedies: List[str]
    chemical_remedies: List[str]
    precautions: List[str]
    expert_consultation_trigger: str
    requires_expert_review: bool
    image_url: str
    audio_narrative: str
    language: str
    disclaimer: str

class SampleCropRequest(BaseModel):
    sample_id: str
    farmer_query: Optional[str] = None
    language: Optional[str] = "te-IN"

# Mandi schemas
class MandiPriceItem(BaseModel):
    id: int
    crop_name: str
    variety: str
    market_name: str
    state: str
    district: str
    min_price: float
    max_price: float
    modal_price: float
    price_unit: str
    arrival_volume: float
    price_change: float
    price_trend: str
    date: str

class MarketTrendPoint(BaseModel):
    date: str
    modal_price: float
    min_price: float
    max_price: float

class MarketTrendResponse(BaseModel):
    crop: str
    market: str
    current_modal_price: float
    change_7d_percent: float
    trend_direction: str
    ai_summary: str
    disclaimer: str
    historical_data: List[MarketTrendPoint]
    nearby_markets: List[Dict[str, Any]]

class PriceAlertCreate(BaseModel):
    crop: str
    target_price: float
    condition: str  # "above" or "below"
    market_name: Optional[str] = "Warangal APMC"

class SellHoldDecisionResponse(BaseModel):
    crop: str
    market: str
    current_modal_price: float
    decision: str  # "SELL_NOW" or "HOLD"
    decision_badge: str
    confidence: float
    expected_price_window: str
    arrival_trend: str
    reasons: List[str]
    storage_advice: str
    audio_narrative: str
    language: str


# Schemes schemas
class SchemeResponse(BaseModel):
    id: int
    title: str
    short_code: str
    category: str
    short_description: str
    who_can_benefit: str
    eligibility_criteria: List[str]
    financial_benefits: str
    required_documents: List[str]
    application_steps: List[str]
    official_portal_url: str
    official_source: str
    state_applicability: str
    last_verified_date: str

# Weather schemas
class WeatherForecastDay(BaseModel):
    day: str
    date: str
    temp_max: float
    temp_min: float
    rain_probability: int
    condition: str
    icon: str
    field_advisory: str

class WeatherResponse(BaseModel):
    location: str
    state: str
    temperature: float
    temp_min: float
    temp_max: float
    humidity: int
    wind_speed_kmh: float
    rain_probability: int
    condition: str
    condition_icon: str
    advisory_summary: str
    spray_conditions: str
    irrigation_advice: str
    field_work_feasible: bool
    forecast_7d: List[WeatherForecastDay]

# Chat schemas
class ChatMessageRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    language: Optional[str] = "te-IN"
    image_base64: Optional[str] = None

class ChatMessageResponse(BaseModel):
    session_id: str
    reply: str
    audio_narrative: str
    intent: str
    lstm_confidence: Optional[float] = None   # Confidence from Bidirectional LSTM model
    cited_sources: List[str]
    suggested_actions: List[str]
    timestamp: str

# Voice schemas
class SpeechTranscriptionRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "te-IN"

class SpeechTranscriptionResponse(BaseModel):
    text: str
    language: str
    confidence: float

class SpeechSynthesisRequest(BaseModel):
    text: str
    language: Optional[str] = "te-IN"

class SpeechSynthesisResponse(BaseModel):
    audio_url: Optional[str] = None
    phonetic_text: str
    language: str
