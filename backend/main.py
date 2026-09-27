import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
import models
from seed_data import seed_database

# Routers
from routers import (
    crop_doctor,
    market,
    schemes,
    weather,
    chat,
    voice,
    videos,
    notifications,
    profile,
    admin,
    soil_advisor,
    nlp
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Seed realistic initial data
seed_database()

app = FastAPI(
    title="Krishi Raksha AI - Multilingual Agricultural Assistant API",
    description="Full-stack AI assistant for farmers in India: Crop Doctor, Mandi Prices, Govt Schemes, Weather Alerts, Soil & Fertilizer Advisor, and Krishi Mitra conversational intelligence.",
    version="1.0.0"
)

# CORS middleware for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if not exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mount API Routers
app.include_router(crop_doctor.router)
app.include_router(market.router)
app.include_router(schemes.router)
app.include_router(weather.router)
app.include_router(chat.router)
app.include_router(voice.router)
app.include_router(soil_advisor.router)
app.include_router(videos.router)
app.include_router(notifications.router)
app.include_router(profile.router)
app.include_router(admin.router)
app.include_router(nlp.router)

@app.get("/")
def root():
    return {
        "app": "Krishi Raksha AI",
        "tagline": "Your Farm. Your Language. Your AI Assistant.",
        "status": "online",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
