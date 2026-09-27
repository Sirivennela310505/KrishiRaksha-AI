'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  Mic,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  ShieldAlert,
  Leaf,
  Volume2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';
import { CropDiagnosis, CropSample } from '@/types';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { VoiceMicButton } from '@/components/VoiceMicButton';

interface CropDoctorViewProps {
  onNavigateToChat: (initialMsg?: string) => void;
}

export const CropDoctorView: React.FC<CropDoctorViewProps> = ({ onNavigateToChat }) => {
  const { t, currentLanguage } = useLanguage();
  const { setVoicePhase } = useVoice();
  
  const [samples, setSamples] = useState<CropSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<CropSample | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [farmerVoiceQuery, setFarmerVoiceQuery] = useState<string>('');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<CropDiagnosis | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadedFileRef = useRef<File | null>(null);  // keeps the actual File for FormData

  // Auto-speak the diagnosis when result arrives
  const speakDiagnosis = (narrative: string) => {
    if (!narrative || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(narrative);
    utterance.lang = currentLanguage.code || 'te-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/crop-doctor/samples')
      .then((res) => res.json())
      .then((data) => setSamples(data))
      .catch(() => {});
  }, []);

  const resolveImageUrl = (url?: string) => {
    if (previewImage) return previewImage;
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    if (url.startsWith('/')) {
      return `http://127.0.0.1:8000${url}`;
    }
    return url;
  };

  const handleSelectSample = (sample: CropSample) => {
    setSelectedSample(sample);
    setPreviewImage(sample.image_preview);
    setFarmerVoiceQuery(sample.sample_query);
    setResult(null);
    uploadedFileRef.current = null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadedFileRef.current = file;
      setPreviewImage(URL.createObjectURL(file));
      setSelectedSample(null);
      setResult(null);
    }
  };

  const triggerAnalysis = async (sampleId?: string) => {
    setAnalyzing(true);
    setVoicePhase('analyzing');
    setAnalysisStep(1);

    // Multi-step reassurance animations
    setTimeout(() => setAnalysisStep(2), 700);
    setTimeout(() => {
      setAnalysisStep(3);
      setVoicePhase('preparing');
    }, 1400);

    try {
      const formData = new FormData();
      // Attach actual image file if user uploaded one
      if (uploadedFileRef.current && !sampleId && !selectedSample) {
        formData.append('image', uploadedFileRef.current);
      } else if (sampleId || selectedSample) {
        formData.append('sample_id', sampleId || selectedSample?.id || 'rice_blast');
      }
      if (farmerVoiceQuery) {
        formData.append('farmer_query', farmerVoiceQuery);
      }
      formData.append('language', currentLanguage.code);

      const response = await fetch('http://127.0.0.1:8000/api/crop-doctor/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setTimeout(() => {
        setResult(data);
        setAnalyzing(false);
        setVoicePhase('idle');
        // Auto-speak the full diagnosis narrative
        setTimeout(() => speakDiagnosis(data.audio_narrative), 600);
      }, 2100);
    } catch (error) {
      console.error(error);
      setAnalyzing(false);
      setVoicePhase('idle');
    }
  };

  const resetAll = () => {
    window.speechSynthesis?.cancel();
    setResult(null);
    setPreviewImage(null);
    setSelectedSample(null);
    setFarmerVoiceQuery('');
    uploadedFileRef.current = null;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title & guidance banner */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-700/20">
            🌱
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              {t('nav_crop')} (పంట డాక్టర్)
            </h1>
            <p className="text-xs text-stone-500">
              Take a leaf photo and speak about what is happening in your native language
            </p>
          </div>
        </div>

        {/* Voice helper notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="text-base">🎙️</span>
            <span>
              Tip: Hold your leaf steady in sunlight for best accuracy. AI will speak out the treatment.
            </span>
          </div>
          <AudioPlayerButton
            textToSpeak="Welcome to Crop Doctor. Take a photo of the affected crop leaf and speak your symptoms. Our AI will analyze the disease and speak the treatment in your language."
            size="sm"
          />
        </div>
      </div>

      {/* Main Camera / Photo Capture Section */}
      {!result && !analyzing && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center relative overflow-hidden">
            {/* Image Preview if chosen */}
            {previewImage ? (
              <div className="max-w-md mx-auto mb-6">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-600/30">
                  <img
                    src={previewImage}
                    alt="Selected leaf"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setPreviewImage(null);
                      setSelectedSample(null);
                    }}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6">
                {/* Large Central "Take Crop Photo" button */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full max-w-sm mx-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-3xl p-6 shadow-xl shadow-emerald-700/30 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group mb-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Camera className="w-9 h-9" />
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-extrabold block">📷 Take Crop Photo</span>
                    <span className="text-xs text-emerald-100 font-medium">Use Phone Camera (ఫోటో తీయండి)</span>
                  </div>
                </button>

                {/* Secondary Option: Upload Photo */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Or Upload Photo from Gallery</span>
                </button>

                {/* Hidden file inputs */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={cameraInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Voice Input Section below camera */}
            <div className="mt-4 pt-6 border-t border-stone-200/80 max-w-lg mx-auto space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                🎙️ Tell us what is happening (మీ సమస్యను మాట్లాడండి)
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={farmerVoiceQuery}
                  onChange={(e) => setFarmerVoiceQuery(e.target.value)}
                  placeholder="e.g. Rice leaves have brown spots, dying from tips..."
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <VoiceMicButton
                  size="compact"
                  onTranscriptReady={(transcript) => setFarmerVoiceQuery(transcript)}
                />
              </div>

              {/* Action button if photo is selected */}
              {previewImage && (
                <button
                  onClick={() => triggerAnalysis()}
                  className="w-full mt-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Crop with AI Doctor</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick 1-Click Pre-loaded Sample Scans for Instant Evaluation */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Quick Demo: Test Common Indian Crop Diseases
                </h3>
                <p className="text-xs text-stone-500">Tap any sample to run instant diagnosis</p>
              </div>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                Preloaded Samples
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    handleSelectSample(sample);
                    triggerAnalysis(sample.id);
                  }}
                  className="p-2.5 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-stone-100">
                    <img
                      src={sample.image_preview}
                      alt={sample.crop}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block leading-tight">
                      {sample.crop}
                    </span>
                    <span className="text-[10px] text-stone-500 line-clamp-1">
                      {sample.condition}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Multi-step Progressive Scanning Animation */}
      {analyzing && (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-6">
          <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-600">
            {previewImage && (
              <img src={previewImage} alt="Scanning" className="w-full h-full object-cover" />
            )}
            {/* Animated Laser Scan Beam */}
            <motion.div
              initial={{ top: 0 }}
              animate={{ top: ['0%', '95%', '0%'] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
            />
            <div className="absolute inset-0 bg-emerald-950/20 backdrop-contrast-125 pointer-events-none" />
          </div>

          {/* Stepped UX feedback */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-lg">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping"></span>
              {analysisStep === 1 && '🔍 Analyzing crop leaf pattern & coloration…'}
              {analysisStep === 2 && '🧠 Matching symptoms with ICAR plant pathology model…'}
              {analysisStep === 3 && '🔊 Translating remedies to your selected language…'}
            </div>
            <p className="text-xs text-stone-500">
              Please wait a moment while Krishi Raksha prepares your tailored advisory
            </p>
          </div>
        </div>
      )}

      {/* Full Structured Diagnosis Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Card with Featured Photo Display */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Featured Crop Image Container */}
              <div className="md:col-span-1">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md bg-stone-100">
                  <img
                    src={resolveImageUrl(result.image_url)}
                    alt={result.crop}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (previewImage) {
                        (e.target as HTMLImageElement).src = previewImage;
                      }
                    }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center justify-between">
                    <span>📷 {result.crop}</span>
                    <span className="text-emerald-300">Scanned Photo</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis Details & Title */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      🌱 {result.crop}
                    </span>
                    <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                      {result.pathogen_type}
                    </span>
                  </div>

                  {/* Confidence Score Badge */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3.5 py-1.5 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">AI Confidence:</span>
                    <span className="text-lg font-black text-emerald-700">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                    {result.condition}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    AI diagnostic analysis performed based on ICAR plant pathology model
                  </p>
                </div>

                {/* Read Aloud Main Button */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <AudioPlayerButton
                    textToSpeak={result.audio_narrative}
                    size="lg"
                    className="w-full sm:w-auto"
                  />
                  <button
                    onClick={() => onNavigateToChat(`My ${result.crop} was diagnosed with ${result.condition}. Can you guide me on step-by-step treatment?`)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm shadow-md transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ask Krishi Mitra About This</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory AI Disclaimer Banner */}
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 mb-0.5">Important Safety Guidance</p>
              <p className="leading-relaxed">{result.disclaimer}</p>
            </div>
          </div>

          {/* Symptoms & Causes Grid: What Happened & Why it Happened */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Symptoms: What Happened */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-2">
              <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>
                  {currentLanguage.short === 'te'
                    ? '🔍 పంట ఆరోగ్యం & ఏమి జరిగింది? (What Happened)'
                    : currentLanguage.short === 'hi'
                    ? '🔍 फसल स्वास्थ्य व क्या हुआ? (What Happened)'
                    : '🔍 Crop Symptoms (What Happened)'}
                </span>
              </h3>
              <ul className="space-y-2 text-xs text-stone-700">
                {result.symptoms.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Causes: Why it Happened */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-2">
              <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>
                  {currentLanguage.short === 'te'
                    ? '❓ ఎందుకు జరిగింది? కారణాలు (Why It Happened)'
                    : currentLanguage.short === 'hi'
                    ? '❓ क्यों हुआ? कारण (Why It Happened)'
                    : '❓ Possible Causes (Why It Happened)'}
                </span>
              </h3>
              <ul className="space-y-2 text-xs text-stone-700">
                {result.causes.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Next Steps: What Precautions & Remedies to Take */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-stone-900">
              {currentLanguage.short === 'te'
                ? '🛡️ తీసుకోవలసిన నివారణ జాగ్రత్తలు (What Precautions & Remedies to Take)'
                : currentLanguage.short === 'hi'
                ? '🛡️ रोकथाम व सावधानियां (What Precautions & Remedies)'
                : '🛡️ Recommended Precautions & Remedies'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organic Remedies */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>
                    {currentLanguage.short === 'te' ? '🌿 సేంద్రీయ & సహజ నివారణ' : 'Organic & Bio-Control Steps'}
                  </span>
                </span>
                <ul className="space-y-2 text-xs text-stone-800">
                  {result.organic_remedies.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white/70 p-2 rounded-xl">
                      <span className="font-bold text-emerald-700">{idx + 1}.</span>
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical Remedies */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>
                    {currentLanguage.short === 'te' ? '🧪 రసాయన పిచికారీ మోతాదు' : 'Chemical Spray (If ETL Exceeded)'}
                  </span>
                </span>
                <ul className="space-y-2 text-xs text-stone-800">
                  {result.chemical_remedies.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-stone-200/60">
                      <span className="font-bold text-stone-600">{idx + 1}.</span>
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Precautions and Expert Escalation */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
            <h4 className="font-bold text-stone-900 text-sm">
              {currentLanguage.short === 'te' ? '⚠️ పొలంలో పాటించవలసిన ముఖ్య జాగ్రత్తలు' : 'Farm Precautions & Hygiene'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
              {result.precautions.map((p, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{p}</span>
                </div>
              ))}
            </div>


            {/* When to seek expert help */}
            <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-950">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900 mb-0.5">When to Seek KVK / Expert Help</p>
                <p className="leading-relaxed">{result.expert_consultation_trigger}</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={resetAll}
              className="px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Upload Another Photo (మరొక ఫోటో తీయండి)</span>
            </button>

            <button
              onClick={() => onNavigateToChat(`Tell me more about ${result.condition} in ${result.crop}`)}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-700/20 transition-all"
            >
              <span>Ask Krishi Mitra</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
