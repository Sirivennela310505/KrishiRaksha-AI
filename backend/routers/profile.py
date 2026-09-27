from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/profile", tags=["Farmer Profile"])

@router.get("", response_model=schemas.ProfileResponse)
def get_farmer_profile(db: Session = Depends(get_db)):
    profile = db.query(models.FarmerProfile).first()
    if not profile:
        profile = models.FarmerProfile(
            preferred_language="te-IN",
            state="Telangana",
            district="Warangal",
            sub_district="Hanamkonda",
            village="Rampur",
            farm_size_acres=4.5,
            crops_grown=["Paddy", "Cotton", "Chilli"],
            soil_type="Black Cotton Soil",
            irrigation_source="Borewell & Canal"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("", response_model=schemas.ProfileResponse)
def update_farmer_profile(payload: schemas.ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(models.FarmerProfile).first()
    if not profile:
        profile = models.FarmerProfile()
        db.add(profile)

    profile.preferred_language = payload.preferred_language or profile.preferred_language
    profile.state = payload.state or profile.state
    profile.district = payload.district or profile.district
    profile.sub_district = payload.sub_district or profile.sub_district
    profile.village = payload.village or profile.village
    profile.farm_size_acres = payload.farm_size_acres or profile.farm_size_acres
    if payload.crops_grown is not None:
        profile.crops_grown = payload.crops_grown
    profile.soil_type = payload.soil_type or profile.soil_type
    profile.irrigation_source = payload.irrigation_source or profile.irrigation_source
    profile.sms_alerts_enabled = payload.sms_alerts_enabled if payload.sms_alerts_enabled is not None else profile.sms_alerts_enabled
    profile.voice_alerts_enabled = payload.voice_alerts_enabled if payload.voice_alerts_enabled is not None else profile.voice_alerts_enabled

    db.commit()
    db.refresh(profile)
    return profile
