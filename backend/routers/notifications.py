from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/notifications", tags=["Alerts & Notifications"])

@router.get("")
def get_alerts_and_notifications(db: Session = Depends(get_db)):
    alerts = db.query(models.Alert).filter(models.Alert.is_active == True).order_by(models.Alert.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "type": a.alert_type,
            "severity": a.severity,
            "title": a.title,
            "message": a.message,
            "location": a.location,
            "crop": a.crop,
            "audio_text": a.audio_text,
            "created_at": a.created_at.strftime("%d %b, %H:%M")
        }
        for a in alerts
    ]
