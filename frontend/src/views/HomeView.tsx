'use client';

import React from 'react';
import {
  Camera,
  TrendingUp,
  FlaskConical,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CloudSun,
  Mic,
  Calendar,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';

interface HomeViewProps {
  onNavigate: (tabId: string) => void;
  onVoiceTrigger: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onVoiceTrigger }) => {
  const { t, currentLanguage, selectLanguage, openLanguageModal } = useLanguage();
  const { speak } = useVoice();

  const isTelugu = currentLanguage.short === 'te';
  const isHindi = currentLanguage.short === 'hi';

  const todayDate = new Intl.DateTimeFormat(
    isTelugu ? 'te-IN' : isHindi ? 'hi-IN' : 'en-IN',
    { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }
  ).format(new Date());

  const handleAudioIntro = () => {
    const introText = isTelugu
      ? 'కృషి రక్షా AI కి స్వాగతం. సైడ్‌బార్‌లో పంట డాక్టర్, మండీ అమ్మాలా ఆగాలా సలహా, మరియు ఎరువుల మోతాదు కాలిక్యులేటర్ అందుబాటులో ఉన్నాయి. ఏదైనా ప్రశ్న అడగడానికి మైక్రోఫోన్ నొక్కండి.'
      : isHindi
      ? 'कृषि रक्षा AI में आपका स्वागत है। फसल डॉक्टर, मंडी भाव, और खाद कैलकुलेटर बाईं ओर उपलब्ध हैं। बोलकर पूछने के लिए माइक दबाएं।'
      : 'Welcome to Krishi Raksha AI. Access the Crop Doctor, Mandi Sell-Hold Advisory, and Fertilizer Calculator from the sidebar navigation. Tap the microphone anytime to speak in your language.';
    speak(introText);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* ── TOP WELCOME & DAILY DASHBOARD BANNER ── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 shadow-sm border border-stone-800">
        {/* Subtle, refined agricultural overlay photo */}
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isTelugu
                  ? 'కృషి రక్షా AI • అధికారిక ప్లాట్‌ఫారమ్'
                  : isHindi
                  ? 'कृषि रक्षा AI • आधिकारिक किसान प्लेटफॉर्म'
                  : 'Krishi Raksha AI • Enterprise Agritech Platform'}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {isTelugu
                ? 'నమస్కారం! మీ పొలం నేటి నివేదిక'
                : isHindi
                ? 'नमस्ते! आपके खेत की आज की रिपोर्ट'
                : 'Welcome! Today\'s Farm Intelligence'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              {isTelugu
                ? 'పంట తెగుళ్ల గుర్తింపు, ఖచ్చితమైన ఎరువుల మోతాదు మరియు మండీలో అమ్మాలా ఆగాలా అనే నిర్ణయాల కోసం సైడ్‌బార్‌ను ఉపయోగించండి.'
                : isHindi
                ? 'फसल रोग पहचान, खाद की सही मात्रा और मंडी में बेचने या रुकने के सटीक सुझाव के लिए साइडबार का उपयोग करें।'
                : 'Empowering farmers with AI vision crop diagnostics, ICAR fertilizer schedules, and APMC sell-versus-hold market intelligence.'}
            </p>

            {/* Audio narration button */}
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={handleAudioIntro}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-all active:scale-95"
              >
                <span>🔊</span>
                <span>{isTelugu ? 'సారాంశం వినండి' : isHindi ? 'सारांश सुनें' : 'Listen to Briefing'}</span>
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{todayDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Language Switcher Card on Right */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:w-72 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                {t('select_lang_title')}
              </span>
              <button
                onClick={openLanguageModal}
                className="text-[10px] text-amber-400 hover:underline font-semibold"
              >
                All 12 Langs
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { code: 'te-IN', native: 'తెలుగు', name: 'Telugu' },
                { code: 'en-IN', native: 'English', name: 'English' },
                { code: 'hi-IN', native: 'हिन्दी', name: 'Hindi' },
                { code: 'ta-IN', native: 'தமிழ்', name: 'Tamil' },
              ].map((lang) => {
                const isSelected = currentLanguage.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.code)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white/10 hover:bg-white/15 text-stone-200'
                    }`}
                  >
                    {lang.native}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── TODAY'S 3 KEY SIGNALS (Weather, Mandi Ticker, Soil Health) ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Signal 1: Weather & Spray Advisory */}
        <div
          onClick={() => onNavigate('weather')}
          className="bg-white border border-stone-200 rounded-xl p-4.5 hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <CloudSun className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {isTelugu ? 'స్ప్రే చేయవచ్చు' : isHindi ? 'छिड़काव अनुकूल' : 'Safe to Spray'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
            {isTelugu ? 'వాతావరణం & పిచికారీ సమయం' : isHindi ? 'मौसम व छिड़काव' : 'Weather & Spray Window'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {isTelugu
              ? '28°C, తేమ 62% • ఉదయం 7:30 - 10:30 మధ్య స్ప్రే చేయడానికి అనుకూలం.'
              : isHindi
              ? '28°C, नमी 62% • सुबह 7:30 से 10:30 छिड़काव के लिए अनुकूल समय।'
              : '28°C, Humidity 62% • Optimal spray window: 7:30 AM - 10:30 AM.'}
          </p>
        </div>

        {/* Signal 2: Live APMC Mandi Ticker */}
        <div
          onClick={() => onNavigate('mandi')}
          className="bg-white border border-stone-200 rounded-xl p-4.5 hover:border-amber-500 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
              {isTelugu ? 'ఆగండి (HOLD) సలహా' : isHindi ? 'रुकें (HOLD)' : 'HOLD Active'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
            {isTelugu ? 'మండీ ధరలు & తాజా స్థితి' : isHindi ? 'मंडी भाव व निर्णय' : 'Live Mandi Sell/Hold'}
          </h3>
          <div className="mt-2 space-y-1 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>{isTelugu ? 'వరి (Paddy)' : isHindi ? 'धान' : 'Paddy'}:</span>
              <span className="font-bold text-stone-900">₹2,320/q <span className="text-emerald-600">(+₹35)</span></span>
            </div>
            <div className="flex justify-between">
              <span>{isTelugu ? 'ప్రత్తి (Cotton)' : isHindi ? 'कपास' : 'Cotton'}:</span>
              <span className="font-bold text-stone-900">₹7,480/q <span className="text-emerald-600">(+₹110)</span></span>
            </div>
          </div>
        </div>

        {/* Signal 3: Fertilizer & Soil Health */}
        <div
          onClick={() => onNavigate('soil-advisor')}
          className="bg-white border border-stone-200 rounded-xl p-4.5 hover:border-lime-600 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-lime-50 text-lime-800 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-lime-800 bg-lime-50 px-2 py-0.5 rounded-md">
              {isTelugu ? '₹3,400 ఆదా' : isHindi ? '₹3,400 बचत' : '₹3,400/acre saved'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-lime-800 transition-colors">
            {isTelugu ? 'సమతుల్య ఎరువుల మోతాదు' : isHindi ? 'संतुलित खाद कैलकुलेटर' : 'NPK Fertilizer Calculator'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {isTelugu
              ? 'యూరియా, డీఏపీ సరైన బస్తాల సంఖ్యను లెక్కించి నేల ఆరోగ్యాన్ని కాపాడుకోండి.'
              : isHindi
              ? 'यूरिया और डीएपी की सटीक बोरी संख्या जानकर अनावश्यक खर्च रोकें।'
              : 'Calculate precise bags of Urea and DAP per acre to prevent dealer overselling.'}
          </p>
        </div>
      </section>

      {/* ── 2 PRIMARY ACTION HUBS (Compact & Refined) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hub 1: AI Camera Crop Doctor */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-800">
              <Camera className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isTelugu ? 'పంట తెగుళ్ల స్కాన్' : isHindi ? 'फसल जांच' : 'AI Crop Doctor'}
              </span>
            </div>
            <h2 className="text-base font-bold text-stone-900">
              {isTelugu
                ? 'ఆకు ఫోటో తీయండి — వ్యాధి నిర్ధారణ పొందండి'
                : isHindi
                ? 'पत्ती की फोटो खींचें — तुरंत समाधान पाएं'
                : 'Take a photo of diseased leaf for instant AI analysis'}
            </h2>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              {isTelugu
                ? 'ఏమి జరిగింది, ఎందుకు జరిగింది, నివారణకు ఏ మందు ఎంత మోతాదులో పిచికారీ చేయాలో స్పష్టమైన నివేదిక లభిస్తుంది.'
                : isHindi
                ? 'रोग का नाम, कारण और उपचार की सही मात्रा तुरंत अपनी भाषा में देखें।'
                : 'Identifies condition, pathogen cause, and exact chemical/organic remedy with native audio readout.'}
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('crop-doctor')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>{isTelugu ? 'పంట డాక్టర్ తెరవండి' : isHindi ? 'फसल डॉक्टर खोलें' : 'Open Crop Doctor'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

        {/* Hub 2: Voice NLP Assistant */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-stone-800">
              <Mic className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isTelugu ? 'వాయిస్ అసిస్టెంట్' : isHindi ? 'आवाज सहायक' : 'Rythu Voice Assistant'}
              </span>
            </div>
            <h2 className="text-base font-bold text-stone-900">
              {isTelugu
                ? 'టైప్ చేయనక్కర్లేదు — నోటితో మాట్లాడి అడగండి'
                : isHindi
                ? 'टाइप करने की जरूरत नहीं — बोलकर पूछें'
                : 'Zero typing required — Speak freely in your native language'}
            </h2>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              {isTelugu
                ? 'వరి, ప్రత్తి, మిర్చి తెగుళ్లు, సబ్సిడీ పథకాలు లేదా మార్కెట్ ధరలపై మీ ప్రశ్నలను నేరుగా మాట్లాడి తెలుసుకోండి.'
                : isHindi
                ? 'फसल की बीमारी, सरकारी सब्सिडी या मंडी भाव से जुड़े कोई भी सवाल बोलकर पूछें।'
                : 'Ask questions about crop diseases, subsidies, or mandi rates in Telugu or English.'}
            </p>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={onVoiceTrigger}
              className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs flex items-center gap-2 transition-all active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>{isTelugu ? 'మైక్రోఫోన్ నొక్కి మాట్లాడండి' : isHindi ? 'माइक दबाकर बोलें' : 'Start Voice Chat'}</span>
            </button>
            <span className="text-[11px] text-stone-500">
              {isTelugu ? 'తెలుగు వాయిస్ సిద్ధంగా ఉంది' : isHindi ? 'हिन्दी आवाज तैयार' : 'Natural Audio Ready'}
            </span>
          </div>
        </div>
      </section>

      {/* ── SEASONAL ADVISORY ALERT (ICAR / PJTSAU COMPLIANT) ── */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-stone-700 space-y-1">
          <p className="font-bold text-amber-900">
            {isTelugu
              ? 'ఈ వారపు కీలక వ్యవసాయ హెచ్చరిక (ICAR & వ్యవసాయ విశ్వవిద్యాలయం)'
              : isHindi
              ? 'इस सप्ताह की महत्वपूर्ण कृषि चेतावनी'
              : 'Weekly Field Advisory Notice (ICAR & State Agri University)'}
          </p>
          <p className="leading-relaxed">
            {isTelugu
              ? 'రాత్రి పూట తేమ 85% పైగా నమోదవుతున్నందున వరి పంటలో అగ్గి తెగులు (Rice Blast) వ్యాపించే అవకాశం ఉంది. నత్రజని (యూరియా) మోతాదు తగ్గించి సిఫార్సు చేసిన ట్రైసైక్లాజోల్ 0.6 గ్రా/లీ పిచికారీ చేయండి.'
              : isHindi
              ? 'रात में अधिक नमी के कारण धान में ब्लास्ट रोग का जोखिम है। यूरिया की अधिक मात्रा न दें और सुझाए गए कवकनाशी का समय पर छिड़काव करें।'
              : 'High night humidity detected across central and southern zones. Monitor paddy for blast lesions. Avoid excess split nitrogen; apply recommended fungicides if lesions appear.'}
          </p>
        </div>
      </section>
    </div>
  );
};
