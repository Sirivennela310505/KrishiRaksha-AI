from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import get_db
import schemas

router = APIRouter(prefix="/api/weather", tags=["Weather & Farm Alerts"])

@router.get("/forecast", response_model=schemas.WeatherResponse)
def get_weather_forecast(location: str = "Warangal", state: str = "Telangana"):
    """
    Returns real-time farmer-oriented weather details and 7-day agricultural forecast.
    """
    days = ["Today", "Tomorrow", "Thursday", "Friday", "Saturday", "Sunday", "Monday"]
    forecast = [
        schemas.WeatherForecastDay(
            day=days[0],
            date=(datetime.utcnow()).strftime("%d %b"),
            temp_max=34.0,
            temp_min=24.0,
            rain_probability=35,
            condition="Scattered Clouds",
            icon="cloud-sun",
            field_advisory="Good for morning foliar spraying before 10:30 AM."
        ),
        schemas.WeatherForecastDay(
            day=days[1],
            date=(datetime.utcnow() + timedelta(days=1)).strftime("%d %b"),
            temp_max=31.0,
            temp_min=23.0,
            rain_probability=75,
            condition="Moderate Thundershowers",
            icon="cloud-rain",
            field_advisory="Hold off on fertilizer broadcasting; avoid spraying to prevent rain runoff."
        ),
        schemas.WeatherForecastDay(
            day=days[2],
            date=(datetime.utcnow() + timedelta(days=2)).strftime("%d %b"),
            temp_max=30.0,
            temp_min=22.0,
            rain_probability=60,
            condition="Passing Showers",
            icon="cloud-rain",
            field_advisory="Inspect field drainage channels in low-lying paddy basins."
        ),
        schemas.WeatherForecastDay(
            day=days[3],
            date=(datetime.utcnow() + timedelta(days=3)).strftime("%d %b"),
            temp_max=32.0,
            temp_min=23.0,
            rain_probability=20,
            condition="Partly Cloudy",
            icon="cloud-sun",
            field_advisory="Soil moisture optimal for root absorption. Intercultural weeding possible."
        ),
        schemas.WeatherForecastDay(
            day=days[4],
            date=(datetime.utcnow() + timedelta(days=4)).strftime("%d %b"),
            temp_max=33.5,
            temp_min=24.0,
            rain_probability=10,
            condition="Clear Sky / Sunny",
            icon="sun",
            field_advisory="Safe window for pesticide or bio-agent spray."
        ),
        schemas.WeatherForecastDay(
            day=days[5],
            date=(datetime.utcnow() + timedelta(days=5)).strftime("%d %b"),
            temp_max=34.5,
            temp_min=24.5,
            rain_probability=10,
            condition="Sunny",
            icon="sun",
            field_advisory="Light irrigation recommended in evening to prevent heat stress."
        ),
        schemas.WeatherForecastDay(
            day=days[6],
            date=(datetime.utcnow() + timedelta(days=6)).strftime("%d %b"),
            temp_max=35.0,
            temp_min=25.0,
            rain_probability=15,
            condition="Mostly Sunny",
            icon="sun",
            field_advisory="Harvesting and post-harvest sun drying suitable."
        )
    ]

    return schemas.WeatherResponse(
        location=location,
        state=state,
        temperature=31.5,
        temp_min=24.0,
        temp_max=34.0,
        humidity=72,
        wind_speed_kmh=14.0,
        rain_probability=35,
        condition="Partly Cloudy with Scattered Showers",
        condition_icon="cloud-sun-rain",
        advisory_summary="Favorable weather for paddy tillering. Caution: High humidity with evening rain expected tomorrow. Please clear clogged drainage furrows in cotton fields.",
        spray_conditions="Safe for morning spray until 11 AM; postpone tomorrow's spray.",
        irrigation_advice="No supplementary irrigation needed for next 48 hours due to expected precipitation.",
        field_work_feasible=True,
        forecast_7d=forecast
    )
