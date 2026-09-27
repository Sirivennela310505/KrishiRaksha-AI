'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sprout
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { WeatherData } from '@/types';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';

export const WeatherView: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/weather/forecast')
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !weather) {
    return (
      <div className="py-20 text-center text-stone-500">
        <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm font-semibold">Fetching IMD agricultural weather forecast…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center text-xl shadow-md shadow-cyan-700/20">
            🌤️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                {t('nav_weather')} (వాతావరణ సమాచారం)
              </h1>
              <span className="text-xs bg-cyan-100 text-cyan-900 font-bold px-2 py-0.5 rounded-full border border-cyan-300">
                IMD Agromet Advisory
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Weather for {weather.location}, {weather.state} with practical farm guidelines
            </p>
          </div>
        </div>

        <AudioPlayerButton
          textToSpeak={`Current temperature in ${weather.location} is ${weather.temperature} degrees Celsius. ${weather.advisory_summary}`}
          size="sm"
        />
      </div>

      {/* Hero Weather Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-700 via-sky-800 to-blue-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Temperature & Conditions */}
          <div>
            <span className="text-xs font-bold tracking-wider text-cyan-200 uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              Current Conditions
            </span>
            <div className="flex items-baseline gap-3 my-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tighter">
                {weather.temperature}°C
              </span>
              <div className="text-xs text-cyan-100 font-semibold">
                <span className="block">H: {weather.temp_max}°C</span>
                <span className="block">L: {weather.temp_min}°C</span>
              </div>
            </div>
            <p className="text-base sm:text-lg font-bold text-white mb-4">
              {weather.condition}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 bg-black/20 p-3 rounded-2xl backdrop-blur-md border border-white/10 text-xs">
              <div>
                <span className="text-cyan-200 text-[10px] block">Rain Chance</span>
                <span className="font-extrabold text-sm">{weather.rain_probability}%</span>
              </div>
              <div>
                <span className="text-cyan-200 text-[10px] block">Humidity</span>
                <span className="font-extrabold text-sm">{weather.humidity}%</span>
              </div>
              <div>
                <span className="text-cyan-200 text-[10px] block">Wind Speed</span>
                <span className="font-extrabold text-sm">{weather.wind_speed_kmh} km/h</span>
              </div>
            </div>
          </div>

          {/* Right: Agricultural Advice Highlight */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-sm text-white">Daily Farm Advisory</h3>
            </div>
            <p className="text-xs sm:text-sm text-cyan-50 leading-relaxed font-normal">
              {weather.advisory_summary}
            </p>

            <div className="pt-2 border-t border-white/15 space-y-1.5 text-xs">
              <p className="text-cyan-100">
                <strong className="text-white">Spraying suitability:</strong> {weather.spray_conditions}
              </p>
              <p className="text-cyan-100">
                <strong className="text-white">Irrigation guideline:</strong> {weather.irrigation_advice}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Farmer-Oriented Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rainfall Alert */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <CloudRain className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm text-stone-900">Heavy Rainfall Advisory</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Moderate thunder showers forecasted for tomorrow afternoon. Keep drainage furrows open to avoid root waterlogging in cotton.
          </p>
        </div>

        {/* Spray & Chemical Alert */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Wind className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm text-stone-900">Spraying & Wind Drift</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Wind speed is gentle (14 km/h) today morning. Safe for spraying until 11 AM; suspend tomorrow due to anticipated gusty winds.
          </p>
        </div>

        {/* Field Operation Feasibility */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm text-stone-900">Field Operations Feasible</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Tractor weeding and intercultural operations are favorable today before soil becomes overly wet from tomorrow&apos;s rain.
          </p>
        </div>
      </div>

      {/* 7-Day Agricultural Forecast Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-stone-900">
            7-Day Agricultural Forecast (7 రోజుల వాతావరణ అంచనా)
          </h3>
          <span className="text-xs text-stone-500">Updated hourly from IMD station</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {weather.forecast_7d.map((day, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-stone-900">{day.day}</span>
                  <span className="text-[11px] font-bold text-stone-400">{day.date}</span>
                </div>

                <div className="flex items-center justify-between my-2">
                  <div>
                    <span className="text-lg font-black text-stone-900">{day.temp_max}°</span>
                    <span className="text-xs text-stone-400 font-semibold ml-1">/ {day.temp_min}°</span>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    🌧️ {day.rain_probability}%
                  </span>
                </div>

                <p className="text-xs font-semibold text-stone-700 mb-2">{day.condition}</p>
                <p className="text-[11px] text-stone-500 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {day.field_advisory}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-stone-100 flex justify-end">
                <AudioPlayerButton
                  textToSpeak={`${day.day}: ${day.condition}, rain chance ${day.rain_probability} percent. ${day.field_advisory}`}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
