from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models

router = APIRouter(prefix="/api/videos", tags=["Farming Videos & Tips"])

@router.get("")
def get_videos(topic: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(models.AgriculturalVideo)
    if topic:
        query = query.filter(models.AgriculturalVideo.topic.ilike(f"%{topic}%"))
    videos = query.all()
    return [
        {
            "id": v.id,
            "title": v.title,
            "topic": v.topic,
            "crop": v.crop,
            "duration": v.duration,
            "thumbnail_url": v.thumbnail_url,
            "video_url": v.video_url,
            "expert_name": v.expert_name,
            "institution": v.institution,
            "language": v.language
        }
        for v in videos
    ]
