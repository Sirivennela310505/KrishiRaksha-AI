'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  Scale,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Layers,
  Leaf,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';

interface ScheduleItem {
  stage_name: string;
  timing_days: string;
  urea_bags: number;
  dap_bags: number;
  mop_bags: number;
  instructions: string;
}

interface SoilFertilizerData {
  crop: string;
  acres: number;
  soil_type: string;
  total_urea_bags: number;
  total_dap_bags: number;
  total_mop_bags: number;
  zinc_kg: number;
  estimated_standard_cost: number;
  balanced_ai_cost: number;
  total_money_saved: number;
  soil_health_rating: string;
  soil_advisory: string;
  schedule: ScheduleItem[];
  audio_narrative: string;
  language: string;
}

export const SoilAdvisorView: React.FC = () => {
  const { t, currentLanguage, tCrop } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState('Paddy');
  const [acres, setAcres] = useState<number>(2.5);
  const [soilType, setSoilType] = useState('Black Cotton Soil');
  const [data, setData] = useState<SoilFertilizerData | null>(null);
  const [loading, setLoading] = useState(false);

  const isTelugu = currentLanguage.short === 'te';

  const crops = [
    { id: 'Paddy', label: isTelugu ? 'వరి ధాన్యం' : 'Paddy / Rice', icon: '🌾' },
    { id: 'Cotton', label: isTelugu ? 'ప్రత్తి (పత్తి)' : 'Cotton', icon: '🌱' },
    { id: 'Chilli', label: isTelugu ? 'మిరపకాయ' : 'Chilli', icon: '🌶️' },
  ];

  const soils = [
    { id: 'Black Cotton Soil', label: isTelugu ? 'నల్లరేగడి నేల' : 'Black Clay Soil', desc: isTelugu ? 'తేమను బాగా పట్టి ఉంచుతుంది' : 'High nutrient retention' },
    { id: 'Red Loam Soil', label: isTelugu ? 'ఎర్ర నేల' : 'Red Loam Soil', desc: isTelugu ? 'భాస్వరం గ్రహణశక్తి తక్కువ' : 'Needs deep P incorporation' },
    { id: 'Sandy Loam Soil', label: isTelugu ? 'ఇసుక నేల' : 'Sandy Loam Soil', desc: isTelugu ? 'నత్రజని వేగంగా కొట్టుకుపోతుంది' : 'Rapid N leaching risk' },
  ];

  const fetchAdvice = (cropName: string, acreVal: number, soilVal: string) => {
    setLoading(true);
    fetch(
      `http://127.0.0.1:8000/api/soil-advisor/calculate?crop=${encodeURIComponent(
        cropName
      )}&acres=${acreVal}&soil_type=${encodeURIComponent(soilVal)}&language=${encodeURIComponent(
        currentLanguage.code
      )}`
    )
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdvice(selectedCrop, acres, soilType);
  }, [selectedCrop, acres, soilType, currentLanguage]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ── Header Title Banner ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-600 to-green-800 text-white flex items-center justify-center text-2xl shadow-md shadow-lime-700/20 shrink-0">
            🧪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {isTelugu ? 'భూసార & సమతుల్య ఎరువుల మోతాదు కాలిక్యులేటర్' : 'Smart Soil & Balanced Fertilizer Advisor'}
              </h1>
              <span className="text-[10px] font-extrabold bg-lime-100 text-lime-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ICAR Standards
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {isTelugu
                ? 'అనవసరమైన రసాయన ఖర్చులను నివారించి ఎకరానికి ₹3,400 వరకు ఆదా చేసుకోండి'
                : 'Scientific N-P-K recommendation per acre to stop pesticide dealer overselling and cut input costs.'}
            </p>
          </div>
        </div>

        {data && (
          <AudioPlayerButton
            textToSpeak={data.audio_narrative}
            size="md"
          />
        )}
      </div>

      {/* ── Input Controls: Crop, Acres, Soil Type ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Crop Picker */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
          <label className="text-xs font-black text-stone-700 uppercase tracking-wider block">
            {isTelugu ? '1. పంటను ఎంచుకోండి:' : '1. Select Crop:'}
          </label>
          <div className="space-y-2">
            {crops.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCrop(c.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                  selectedCrop === c.id
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.icon}</span>
                  <span>{c.label}</span>
                </div>
                {selectedCrop === c.id && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Acres Counter / Slider */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <label className="text-xs font-black text-stone-700 uppercase tracking-wider block">
              {isTelugu ? '2. భూమి పరిమాణం (ఎకరాలు):' : '2. Land Size in Acres:'}
            </label>
            <div className="text-center py-4">
              <span className="text-4xl sm:text-5xl font-black text-emerald-800 tracking-tight">
                {acres}
              </span>
              <span className="text-xs text-stone-400 font-bold block mt-1">
                {isTelugu ? 'మొత్తం ఎకరాలు' : 'Total Acres'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-2">
            {[1, 2.5, 4, 6].map((ac) => (
              <button
                key={ac}
                onClick={() => setAcres(ac)}
                className={`py-2 rounded-xl text-xs font-black transition-all ${
                  acres === ac
                    ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {ac} Ac
              </button>
            ))}
          </div>
        </div>

        {/* 3. Soil Type Selection */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
          <label className="text-xs font-black text-stone-700 uppercase tracking-wider block">
            {isTelugu ? '3. నేల రకం (భూసార స్థితి):' : '3. Soil Texture Type:'}
          </label>
          <div className="space-y-2">
            {soils.map((s) => (
              <button
                key={s.id}
                onClick={() => setSoilType(s.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all border ${
                  soilType === s.id
                    ? 'bg-lime-50 border-lime-500 ring-2 ring-lime-200'
                    : 'bg-stone-50 border-transparent hover:bg-stone-100'
                }`}
              >
                <div className="text-xs sm:text-sm font-extrabold text-stone-900">{s.label}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Recommendation Output ── */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Total Bags Required Strip */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {isTelugu ? 'శాస్త్రీయ సమతుల్య మోతాదు' : 'Exact Balanced Requirement'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-2">
                  {isTelugu
                    ? `${acres} ఎకరాల ${data.crop} పంటకు అవసరమైన మొత్తం ఎరువులు:`
                    : `Total Fertilizer Bags Required for ${acres} Acres:`}
                </h3>
              </div>

              {/* Net Money Saved Box */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-md text-right">
                <span className="text-[10px] font-bold text-emerald-100 uppercase block">
                  {isTelugu ? 'మీరు ఆదా చేసుకునే ఖర్చు' : 'Estimated Cost Savings'}
                </span>
                <span className="text-2xl font-black">
                  ₹{data.total_money_saved.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-200 block">
                  {isTelugu ? 'దుకాణదారుల అధిక మోతాదుతో పోల్చితే' : 'vs Dealer Overselling'}
                </span>
              </div>
            </div>

            {/* 4 Essential Fertilizer Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {/* Urea */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200">
                <span className="text-xs font-bold text-blue-900 block">యూరియా (Urea 46% N)</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-950 my-1">
                  {data.total_urea_bags}{' '}
                  <span className="text-xs font-bold text-stone-500">బస్తాలు (Bags)</span>
                </div>
                <span className="text-[11px] text-blue-700">నత్రజని పెరుగుదల</span>
              </div>

              {/* DAP */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-200">
                <span className="text-xs font-bold text-amber-900 block">డీఏపీ (DAP 18:46:0)</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-950 my-1">
                  {data.total_dap_bags}{' '}
                  <span className="text-xs font-bold text-stone-500">బస్తాలు (Bags)</span>
                </div>
                <span className="text-[11px] text-amber-700">వేరు వ్యవస్థ బలం</span>
              </div>

              {/* MOP Potash */}
              <div className="bg-gradient-to-br from-rose-50 to-red-50/50 p-4 rounded-2xl border border-rose-200">
                <span className="text-xs font-bold text-rose-900 block">పొటాష్ (MOP 60% K)</span>
                <div className="text-2xl sm:text-3xl font-black text-rose-950 my-1">
                  {data.total_mop_bags}{' '}
                  <span className="text-xs font-bold text-stone-500">బస్తాలు (Bags)</span>
                </div>
                <span className="text-[11px] text-rose-700">రోగనిరోధక శక్తి & గింజ బరువు</span>
              </div>

              {/* Zinc Sulphate */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 block">జింక్ సల్ఫేట్ (Zinc)</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-950 my-1">
                  {data.zinc_kg}{' '}
                  <span className="text-xs font-bold text-stone-500">కిలోలు (kg)</span>
                </div>
                <span className="text-[11px] text-emerald-700">సూక్ష్మ పోషక లోపం నివారణ</span>
              </div>
            </div>

            {/* Soil Health Advice Banner */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex items-start gap-2.5 text-xs text-stone-700">
              <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">
                  {isTelugu ? 'భూసార సూచన: ' : 'Soil Advisory: '}
                </strong>
                {data.soil_advisory}
              </div>
            </div>
          </div>

          {/* Stage-by-Stage Split Application Schedule */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base sm:text-lg font-black text-stone-900">
                {isTelugu
                  ? 'విడతల వారీగా ఎరువులు వేసే సరైన సమయాలు (Split Schedule)'
                  : 'Stage-by-Stage Application Schedule:'}
              </h3>
            </div>

            <div className="space-y-3">
              {data.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-black text-stone-900">{item.stage_name}</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        {item.timing_days}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 pl-8 leading-relaxed">
                      {item.instructions}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pl-8 md:pl-0 shrink-0">
                    <div className="text-center px-3 py-1.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[9px] text-stone-400 font-bold block">యూరియా</span>
                      <span className="text-xs font-black text-stone-800">{item.urea_bags} బస్తా</span>
                    </div>
                    <div className="text-center px-3 py-1.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[9px] text-stone-400 font-bold block">డీఏపీ</span>
                      <span className="text-xs font-black text-stone-800">{item.dap_bags} బస్తా</span>
                    </div>
                    <div className="text-center px-3 py-1.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[9px] text-stone-400 font-bold block">పొటాష్</span>
                      <span className="text-xs font-black text-stone-800">{item.mop_bags} బస్తా</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
