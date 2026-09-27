from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(20), unique=True, index=True, nullable=True)
    full_name = Column(String(100), default="Kisan Bhai")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("FarmerProfile", back_populates="user", uselist=False)
    crop_scans = relationship("CropScan", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    preferred_language = Column(String(10), default="te-IN")  # te-IN, hi-IN, etc.
    state = Column(String(100), default="Telangana")
    district = Column(String(100), default="Warangal")
    sub_district = Column(String(100), default="Hanamkonda")
    village = Column(String(100), default="Rampur")
    farm_size_acres = Column(Float, default=4.5)
    crops_grown = Column(JSON, default=lambda: ["Paddy", "Cotton", "Chilli"])
    soil_type = Column(String(50), default="Black Cotton Soil")
    irrigation_source = Column(String(50), default="Borewell & Canal")
    sms_alerts_enabled = Column(Boolean, default=True)
    voice_alerts_enabled = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    local_name = Column(JSON, default=dict)  # {"hi": "धान", "te": "వరి"}
    category = Column(String(50), default="Cereal")
    optimal_temp_min = Column(Float, default=20.0)
    optimal_temp_max = Column(Float, default=35.0)
    water_requirement = Column(String(50), default="High")
    icon = Column(String(50), default="🌾")

class Market(Base):
    __tablename__ = "markets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), index=True)
    state = Column(String(100), index=True)
    district = Column(String(100), index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_apmc = Column(Boolean, default=True)

    prices = relationship("MarketPrice", back_populates="market")

class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    market_id = Column(Integer, ForeignKey("markets.id"), index=True)
    crop_name = Column(String(100), index=True)
    variety = Column(String(100), default="Common")
    min_price = Column(Float)
    max_price = Column(Float)
    modal_price = Column(Float)
    price_unit = Column(String(20), default="₹/Quintal")
    arrival_volume = Column(Float, default=150.0)
    price_change = Column(Float, default=0.0)  # Change compared to previous day
    price_trend = Column(String(20), default="up")  # "up", "down", "stable"
    date = Column(DateTime, default=datetime.utcnow, index=True)

    market = relationship("Market", back_populates="prices")

class CropScan(Base):
    __tablename__ = "crop_scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    image_url = Column(String(500))
    detected_crop = Column(String(100))
    detected_condition = Column(String(150))
    confidence = Column(Float)
    farmer_voice_query = Column(Text, nullable=True)
    farmer_language = Column(String(20), default="en")
    is_uncertain = Column(Boolean, default=False)
    scan_timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="crop_scans")
    predictions = relationship("DiseasePrediction", back_populates="scan")

class DiseasePrediction(Base):
    __tablename__ = "disease_predictions"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("crop_scans.id"))
    disease_name = Column(String(150))
    pathogen_type = Column(String(50))  # Fungus, Bacteria, Virus, Pest, Deficiency
    symptoms = Column(JSON)  # List of strings
    causes = Column(JSON)  # List of causes
    organic_remedies = Column(JSON)  # List of organic steps
    chemical_remedies = Column(JSON)  # List of chemical recommendations
    precautions = Column(JSON)  # Preventive actions
    expert_consultation_trigger = Column(Text)
    confidence = Column(Float)

    scan = relationship("CropScan", back_populates="predictions")

class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(250), index=True)
    short_code = Column(String(50), index=True)
    category = Column(String(100))  # Cash Support, Insurance, Equipment Subsidy, Irrigation, Solar
    short_description = Column(Text)
    who_can_benefit = Column(Text)
    eligibility_criteria = Column(JSON)  # List of criteria
    financial_benefits = Column(Text)
    required_documents = Column(JSON)  # List of documents
    application_steps = Column(JSON)  # Steps
    official_portal_url = Column(String(500))
    official_source = Column(String(250))
    state_applicability = Column(String(100), default="All India (Central)")
    last_verified_date = Column(String(50), default="September 2026")
    is_active = Column(Boolean, default=True)

class SchemeSource(Base):
    __tablename__ = "scheme_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    ministry = Column(String(200))
    portal_domain = Column(String(200))
    verification_status = Column(String(50), default="Verified Official")

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String(100), index=True)
    state = Column(String(100))
    temperature = Column(Float)
    temp_min = Column(Float)
    temp_max = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    rain_probability = Column(Float)
    condition = Column(String(50))  # Sunny, Rainy, Cloudy, Thunderstorm
    condition_icon = Column(String(50))
    advisory_summary = Column(Text)
    recorded_at = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(50))  # "weather", "mandi_spike", "pest_outbreak", "scheme_deadline"
    severity = Column(String(20))  # "critical", "warning", "info"
    title = Column(String(200))
    message = Column(Text)
    location = Column(String(100), default="All")
    crop = Column(String(100), nullable=True)
    audio_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    category = Column(String(50))
    title = Column(String(200))
    body = Column(Text)
    action_url = Column(String(200), nullable=True)
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AgriculturalVideo(Base):
    __tablename__ = "agricultural_videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(250))
    topic = Column(String(100))  # "Organic Farming", "Pest Management", "Micro-Irrigation"
    crop = Column(String(100), nullable=True)
    duration = Column(String(20))
    thumbnail_url = Column(String(500))
    video_url = Column(String(500))
    expert_name = Column(String(100))
    institution = Column(String(200))
    language = Column(String(20), default="Hindi/Telugu")

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(250))
    source_agency = Column(String(150))  # ICAR, PJTSAU, TNAU, Ministry of Ag
    category = Column(String(100))
    content = Column(Text)
    verified = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=datetime.utcnow)

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    language = Column(String(20), default="te-IN")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("chat_sessions.id"))
    sender = Column(String(20))  # "farmer" or "krishi_mitra"
    message_text = Column(Text)
    audio_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    intent = Column(String(50), nullable=True)  # "crop_doctor", "mandi", "weather", "scheme", "general"
    cited_sources = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")
