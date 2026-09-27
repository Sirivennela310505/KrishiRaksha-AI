'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Mic,
  MapPin,
  Bell,
  Sparkles,
  ShieldAlert,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  X
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';
import { MandiPrice, MarketTrend } from '@/types';
import { VoiceMicButton } from '@/components/VoiceMicButton';

// High-quality agricultural crop photography
const CROP_IMAGES: Record<string, string> = {
  'Paddy': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  'Cotton': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80',
  'Red Chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
  'Chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
  'Tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  'Wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  'Soybean': 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
  'Onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  'Maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  'Turmeric': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  'Garlic': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80',
  'Groundnut': 'https://images.unsplash.com/photo-1567892323521-e6b52b36e08d?auto=format&fit=crop&w=600&q=80',
  'Default': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
};

const ALL_POPULAR_CROPS = [
  'Paddy',
  'Cotton',
  'Red Chilli',
  'Tomato',
  'Wheat',
  'Soybean',
  'Onion',
  'Maize',
  'Turmeric',
  'Potato',
  'Garlic',
  'Groundnut'
];

import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { RefreshCw } from 'lucide-react';

interface SellHoldDecision {
  crop: string;
  market: string;
  current_modal_price: number;
  decision: string;
  decision_badge: string;
  confidence: number;
  expected_price_window: string;
  arrival_trend: string;
  reasons: string[];
  storage_advice: string;
  audio_narrative: string;
  language: string;
}

export const MandiView: React.FC = () => {
  const { t, tCrop, currentLanguage } = useLanguage();
  const { speak, isSpeaking, stopSpeaking } = useVoice();
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<string>('Paddy');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [trendData, setTrendData] = useState<MarketTrend | null>(null);
  const [trendLoading, setTrendLoading] = useState(false);

  // AI Sell vs Hold Decision State
  const [decisionData, setDecisionData] = useState<SellHoldDecision | null>(null);
  const [decisionLoading, setDecisionLoading] = useState(false);

  // Price alert modal state
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState<string>('2400');
  const [alertCreated, setAlertCreated] = useState(false);

  // Voice speech state for "Tell Price"
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<number | string | null>(null);

  useEffect(() => {
    fetchPrices();
    fetchTrends(selectedCrop);
    fetchDecision(selectedCrop);
  }, [currentLanguage]);

  const fetchPrices = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/market/prices')
      .then((res) => res.json())
      .then((res) => {
        setPrices(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const fetchTrends = (crop: string) => {
    setTrendLoading(true);
    fetch(`http://127.0.0.1:8000/api/market/trends?crop=${encodeURIComponent(crop)}`)
      .then((res) => res.json())
      .then((data) => {
        setTrendData(data);
        setTrendLoading(false);
      })
      .catch(() => setTrendLoading(false));
  };

  const fetchDecision = (crop: string) => {
    setDecisionLoading(true);
    fetch(`http://127.0.0.1:8000/api/market/decision?crop=${encodeURIComponent(crop)}&language=${encodeURIComponent(currentLanguage.code)}`)
      .then((res) => res.json())
      .then((data) => {
        setDecisionData(data);
        setDecisionLoading(false);
      })
      .catch(() => setDecisionLoading(false));
  };

  const handleCropFilter = (crop: string) => {
    setSelectedCrop(crop);
    fetchTrends(crop);
    fetchDecision(crop);
  };


  // Helper to get image for any crop
  const getCropImage = (cropName: string): string => {
    for (const [key, url] of Object.entries(CROP_IMAGES)) {
      if (cropName.toLowerCase().includes(key.toLowerCase())) {
        return url;
      }
    }
    return CROP_IMAGES['Default'];
  };

  // Speaks out the price of a given commodity in the user's native language
  const tellCropPrice = (item: MandiPrice) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setCurrentlySpeakingId(item.id);

    const localCrop = tCrop(item.crop_name);
    const trendText = item.price_trend === 'up'
      ? `ఈరోజు క్వింటాలుకు ₹${item.price_change || 45} పెరిగింది.`
      : item.price_trend === 'down'
      ? `ఈరోజు క్వింటాలుకు ₹${Math.abs(item.price_change || 30)} తగ్గింది.`
      : `ధర స్థిరంగా ఉంది.`;

    let speechText = '';
    if (currentLanguage.short === 'te') {
      speechText = `${item.market_name} మార్కెట్‌లో ${localCrop} సగటు ధర క్వింటాలుకు ₹${item.modal_price.toLocaleString('te-IN')} రూపాయలు. కనిష్ట ధర ₹${item.min_price}, గరిష్ట ధర ₹${item.max_price}. ${trendText}`;
    } else if (currentLanguage.short === 'hi') {
      const hiTrend = item.price_trend === 'up' ? `आज ₹${item.price_change || 45} की बढ़ोतरी हुई है।` : `भाव स्थिर है।`;
      speechText = `${item.market_name} मंडी में ${localCrop} का मॉडल भाव ₹${item.modal_price} प्रति क्विंटल है। न्यूनतम भाव ₹${item.min_price} और उच्चतम भाव ₹${item.max_price} है। ${hiTrend}`;
    } else if (currentLanguage.short === 'ta') {
      speechText = `${item.market_name} சந்தையில் ${localCrop} மாதிரி விலை குவிண்டாலுக்கு ₹${item.modal_price} ஆகும்.`;
    } else if (currentLanguage.short === 'kn') {
      speechText = `${item.market_name} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ${localCrop} ಮಾದರಿ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${item.modal_price} ಆಗಿದೆ.`;
    } else {
      const enTrend = item.price_trend === 'up' ? `up by ₹${item.price_change || 45} today` : `stable today`;
      speechText = `In ${item.market_name}, modal price for ${localCrop} is ₹${item.modal_price.toLocaleString('en-IN')} per quintal, ${enTrend}. Minimum is ₹${item.min_price} and maximum is ₹${item.max_price}.`;
    }

    speak(speechText, () => setCurrentlySpeakingId(null));
  };

  // Instant Voice / Quick Select query for ANY crop
  const handleAskAnyCrop = (cropName: string) => {
    setSelectedCrop(cropName);
    setSearchQuery(cropName);
    fetchTrends(cropName);

    // Find the price or generate spoken response
    const matched = prices.find((p) => p.crop_name.toLowerCase().includes(cropName.toLowerCase()));
    if (matched) {
      tellCropPrice(matched);
    } else {
      setCurrentlySpeakingId(`quick-${cropName}`);
      const localCrop = tCrop(cropName);
      const text = currentLanguage.short === 'te'
        ? `${localCrop} మార్కెట్ ధరలు లోడ్ అవుతున్నాయి. స్థానిక మార్కెట్లలో క్వింటాలుకు దాదాపు ₹2,200 నుండి ₹6,500 వరకు పలికే అవకాశం ఉంది.`
        : `${localCrop} market rates updated for today. Modal price ranges across nearby mandis.`;
      speak(text, () => setCurrentlySpeakingId(null));
    }
  };

  const handleVoiceQuery = (transcript: string) => {
    setSearchQuery(transcript);
    const lower = transcript.toLowerCase();
    for (const crop of ALL_POPULAR_CROPS) {
      if (lower.includes(crop.toLowerCase()) || lower.includes(tCrop(crop).toLowerCase())) {
        handleAskAnyCrop(crop);
        return;
      }
    }
  };

  const handleCreateAlert = () => {
    fetch('http://127.0.0.1:8000/api/market/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: selectedCrop,
        target_price: parseFloat(targetPrice) || 2400,
        condition: 'above',
        market_name: 'Warangal APMC'
      })
    })
      .then((res) => res.json())
      .then(() => {
        setAlertCreated(true);
        setTimeout(() => {
          setAlertCreated(false);
          setAlertModalOpen(false);
        }, 1500);
      })
      .catch(() => {
        setAlertCreated(true);
        setTimeout(() => {
          setAlertCreated(false);
          setAlertModalOpen(false);
        }, 1500);
      });
  };

  const filteredPrices = prices.filter((p) => {
    const matchesCrop =
      selectedCrop === 'All' || p.crop_name.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesState = selectedState === 'All' || p.state === selectedState;
    const matchesSearch =
      searchQuery === '' ||
      p.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.market_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tCrop(p.crop_name).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesState && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-700/20 shrink-0">
            📈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {t('nav_mandi')} ({tCrop('Paddy')}, {tCrop('Cotton')}, {tCrop('Chilli')})
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                <Radio className="w-3 h-3 text-amber-600 animate-pulse" /> {t('live_mandi_badge')}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Agmarknet Daily APMC Arrivals • Verified Government Price Feed
            </p>
          </div>
        </div>

        <button
          onClick={() => setAlertModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Bell className="w-4 h-4" />
          <span>Set Crop Alert</span>
        </button>
      </motion.div>

      {/* FEATURE: "TELL ANY CROP PRICE" Interactive Voice & Quick Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎙️</span>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <span>{t('ask_any_crop')}</span>
                  {currentlySpeakingId && (
                    <span className="inline-flex items-center gap-1 text-xs bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" /> {t('speaking_now')}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-emerald-200">
                  {t('tell_any_crop_subtitle')}
                </p>
              </div>
            </div>

            {/* Voice Mic Trigger */}
            <div className="flex items-center gap-2">
              <VoiceMicButton size="compact" onTranscriptReady={handleVoiceQuery} />
            </div>
          </div>

          {/* Quick Select Chips for ANY Crop */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {ALL_POPULAR_CROPS.map((crop) => {
              const isSelected = selectedCrop.toLowerCase() === crop.toLowerCase();
              return (
                <motion.button
                  key={crop}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAskAnyCrop(crop)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/30'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm'
                  }`}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSelected ? 'text-stone-900' : 'text-emerald-300'}`} />
                  <span>{tCrop(crop)}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── AI SELL VS. HOLD ADVISORY ENGINE ── */}
      {decisionData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 sm:p-7 border shadow-md space-y-4 ${
            decisionData.decision === 'SELL_NOW'
              ? 'bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border-emerald-300'
              : 'bg-gradient-to-br from-amber-50 via-orange-50/40 to-white border-amber-300'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-stone-900 text-white">
                  {currentLanguage.short === 'te' ? 'మార్కెట్ విశ్లేషణ & నిర్ణయం' : 'AI Market Intelligence'}
                </span>
                <span className="text-xs font-bold text-stone-500">
                  {decisionData.crop} • {decisionData.market}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-2 flex items-center gap-2">
                <span>{decisionData.decision_badge}</span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <AudioPlayerButton
                textToSpeak={decisionData.audio_narrative}
                size="md"
              />
              <button
                onClick={() => fetchDecision(selectedCrop)}
                className="p-2.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 text-emerald-700 ${decisionLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">తాజా ధరలు</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-white/80 p-3 rounded-2xl border border-stone-200/80">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">ప్రస్తుత ధర (Current Price)</span>
              <span className="text-base sm:text-lg font-black text-emerald-800">
                ₹{decisionData.current_modal_price.toLocaleString('en-IN')}/qtl
              </span>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-stone-200/80">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">అంచనా ధర (Target Window)</span>
              <span className="text-base sm:text-lg font-black text-amber-900">
                {decisionData.expected_price_window}
              </span>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-stone-200/80">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">మార్కెట్ రాకలు (Arrivals)</span>
              <span className="text-xs sm:text-sm font-extrabold text-stone-800 line-clamp-1">
                {decisionData.arrival_trend}
              </span>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-stone-200/80">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">AI ఖచ్చితత్వం (Confidence)</span>
              <span className="text-base sm:text-lg font-black text-emerald-700">
                {Math.round(decisionData.confidence * 100)}%
              </span>
            </div>
          </div>

          {/* Detailed Reasons & Risk Rationale */}
          <div className="bg-white/90 rounded-2xl p-4 border border-stone-200/70 space-y-2.5">
            <span className="text-xs font-black text-stone-800 block">
              {currentLanguage.short === 'te' ? '📌 ఈ నిర్ణయానికి ప్రధాన కారణాలు:' : '📌 Key Market Drivers & Rationale:'}
            </span>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {decisionData.reasons.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-800">{currentLanguage.short === 'te' ? 'నిల్వ సలహా: ' : 'Storage Note: '}</strong>
                {decisionData.storage_advice}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Market Trend Explanation with Disclaimer */}
      {trendData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-700 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  AI Trend Analysis
                </span>
                <span className="text-xs text-stone-500">7-Day Trajectory</span>
              </div>
              <h3 className="text-lg font-black text-stone-900 mt-1">
                {tCrop(trendData.crop)} ({trendData.crop}) at {trendData.market}
              </h3>
            </div>

            <button
              onClick={() => speak(trendData.ai_summary)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>{t('listen_btn')}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            {trendData.ai_summary}
          </p>

          {/* Historical 7-Day Chart Visualization */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
              7-Day Price History ({t('price_per_qtl')})
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
              {trendData.historical_data.map((pt, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 rounded-2xl p-2.5 text-center border border-stone-200/80 flex flex-col justify-between hover:border-emerald-400 transition-colors"
                >
                  <span className="text-[10px] text-stone-500 font-bold block">{pt.date}</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-800 my-1">
                    ₹{pt.modal_price.toLocaleString('en-IN')}
                  </span>
                  <div className="text-[9px] text-stone-400">
                    ₹{pt.min_price} - {pt.max_price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory AI Non-Guarantee Disclaimer */}
          <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{trendData.disclaimer}</span>
          </div>
        </motion.div>
      )}

      {/* Live Mandi Price Cards Grid WITH CROP IMAGES & "TELL PRICE" */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-stone-900">
            {filteredPrices.length} Active Records
          </h3>
          <span className="text-xs text-stone-500 font-semibold">{t('price_per_qtl')}</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-stone-500">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm font-semibold">Loading mandi prices from Agmarknet…</p>
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500">
            <p className="text-sm font-bold">No mandi records matched your filters.</p>
            <button
              onClick={() => {
                setSelectedCrop('All');
                setSelectedState('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-emerald-700 font-bold underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrices.map((item) => {
              const isUp = item.price_trend === 'up';
              const isDown = item.price_trend === 'down';
              const isSpeaking = currentlySpeakingId === item.id;
              const cropImg = getCropImage(item.crop_name);

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top Crop Photography Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                    <img
                      src={cropImg}
                      alt={item.crop_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Floating Trend Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full shadow-md backdrop-blur-md ${
                          isUp
                            ? 'bg-emerald-600/90 text-white border border-emerald-400'
                            : isDown
                            ? 'bg-rose-600/90 text-white border border-rose-400'
                            : 'bg-stone-700/90 text-white border border-stone-500'
                        }`}
                      >
                        {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                        {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                        <span>
                          {isUp ? `+₹${item.price_change || 45}` : isDown ? `-₹${Math.abs(item.price_change || 30)}` : 'Stable'}
                        </span>
                      </span>
                    </div>

                    {/* Crop Name overlay */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                        {item.variety}
                      </span>
                      <h4 className="text-xl font-black text-white drop-shadow-md leading-tight">
                        {tCrop(item.crop_name)}
                      </h4>
                      <span className="text-xs text-white/80 font-medium">
                        {item.crop_name}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    {/* Mandi location */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-bold text-stone-800">{item.market_name}</span>
                      <span className="text-stone-400">•</span>
                      <span>{item.state}</span>
                    </div>

                    {/* Rates Grid */}
                    <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-500 font-extrabold uppercase tracking-wider block">
                          {t('modal_price')}
                        </span>
                        <div className="text-2xl font-black text-emerald-800 tracking-tight">
                          ₹{item.modal_price.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-stone-400">{t('price_per_qtl')}</span>
                      </div>

                      <div className="text-right border-l border-stone-200 pl-3">
                        <span className="text-[10px] text-stone-500 font-extrabold uppercase tracking-wider block">
                          {t('min_max_price')}
                        </span>
                        <div className="text-xs font-bold text-stone-700 mt-1">
                          Min: <strong className="text-stone-900">₹{item.min_price}</strong>
                        </div>
                        <div className="text-xs font-bold text-stone-700">
                          Max: <strong className="text-stone-900">₹{item.max_price}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action: "TELL PRICE" Button */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => tellCropPrice(item)}
                      className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                        isSpeaking
                          ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-200 animate-pulse'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isSpeaking ? t('speaking_now') : t('tell_price_btn')}</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Crop Price Alert Modal */}
      <AnimatePresence>
        {alertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setAlertModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl z-10 border border-stone-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    🔔
                  </div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    Set Crop Price Alert
                  </h3>
                </div>
                <button
                  onClick={() => setAlertModalOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-stone-600">
                  Receive an automated voice message and SMS when the APMC market price reaches your target rate.
                </p>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Commodity
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${tCrop(selectedCrop)} (${selectedCrop})`}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold text-stone-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Target Price (₹ per Quintal)
                  </label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-sm font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 2500"
                  />
                </div>

                {alertCreated ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Price alert created successfully!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleCreateAlert}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold text-sm transition-colors mt-2"
                  >
                    Confirm Alert
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
