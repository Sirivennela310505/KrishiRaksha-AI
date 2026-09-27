'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, MessageSquare, CloudSun, ShoppingCart,
  Landmark, FlaskConical, ArrowRight, X, ChevronRight, Check,
  Sparkles, ShieldCheck, Zap
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: (farmerName: string, language: string) => void;
}

const FEATURES = [
  {
    icon: Leaf,
    title: 'Crop Doctor',
    desc: 'Upload a leaf photo for instant CNN-based disease diagnosis, confidence score, and tailored organic treatment.',
    color: '#2d6a4f',
    bg: '#f0faf4',
    badge: 'CNN Model',
  },
  {
    icon: MessageSquare,
    title: 'Krishi Mitra AI',
    desc: 'Interactive multi-lingual voice & text assistant powered by a deep LSTM intent engine for instant advice.',
    color: '#1d5c8a',
    bg: '#f0f6ff',
    badge: 'LSTM Voice',
  },
  {
    icon: CloudSun,
    title: 'Smart Weather',
    desc: 'Live hyperlocal rainfall forecast, temperature, humidity and actionable farming task recommendations.',
    color: '#7a5c00',
    bg: '#fffbf0',
    badge: 'Live Data',
  },
  {
    icon: ShoppingCart,
    title: 'Mandi Prices',
    desc: 'Real-time Agmarknet market commodity rates with price trend indicators across all regional mandis.',
    color: '#8b3a00',
    bg: '#fff5f0',
    badge: 'Real-Time',
  },
  {
    icon: Landmark,
    title: 'Government Schemes',
    desc: 'Direct access to PM-Kisan, Rythu Bandhu, crop insurance and subsidy eligibility checkers.',
    color: '#4a2d8a',
    bg: '#f5f0ff',
    badge: 'Official',
  },
  {
    icon: FlaskConical,
    title: 'Soil & NPK Advisor',
    desc: 'Customized NPK fertilizer dosage calculation based on soil health test parameters.',
    color: '#2d5a1d',
    bg: '#f0fff4',
    badge: 'Precision',
  },
];

const STEPS = [
  { num: '01', title: 'Choose your language', desc: 'Select Telugu, Hindi, or English for a localized experience.' },
  { num: '02', title: 'Add your farm profile', desc: 'Enter your name, main crop type, and land acres.' },
  { num: '03', title: 'Access AI Smart Tools', desc: 'Get instant crop diagnosis, chat with voice AI, and check live mandi rates.' },
];

const LANGUAGES = [
  { code: 'te', label: 'తెలుగు', eng: 'Telugu' },
  { code: 'hi', label: 'हिंदी', eng: 'Hindi' },
  { code: 'en', label: 'English', eng: 'English' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState('te');
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('');
  const [crop, setCrop] = useState('');
  const [acres, setAcres] = useState('');

  const handleGetStarted = () => setShowForm(true);

  const handleSubmit = () => {
    if (step === 1 && selectedLang) { setStep(2); return; }
    if (step === 2 && farmerName.trim()) {
      onEnterDashboard(farmerName, selectedLang);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden">
      {/* Background Ambient Glowing Orbs for Modern App Aesthetic */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-[30rem] h-[30rem] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[24rem] h-[24rem] bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Sticky Glassmorphism Header */}
      <header className="sticky top-0 z-40 bg-[#f7f5ef]/80 backdrop-blur-md border-b border-stone-200/60 transition-all">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#1e4d37] flex items-center justify-center text-white text-lg shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-300">
              🌾
            </div>
            <div>
              <span className="font-extrabold text-stone-900 text-lg tracking-tight block leading-tight">
                KrishiRaksha <span className="text-[#2d6a4f]">AI</span>
              </span>
              <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block">Smart Farming Suite</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGetStarted}
              className="bg-[#2d6a4f] hover:bg-[#245a42] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-md shadow-emerald-900/20"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-5 pt-12 pb-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-full px-4 py-1.5 text-xs text-stone-700 font-medium mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>తెలుగు</span>
            <span className="text-stone-300">·</span>
            <span>हिंदी</span>
            <span className="text-stone-300">·</span>
            <span>English</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-stone-900 leading-[1.15] mb-4 tracking-tight">
            Protect your crop.<br />
            <span className="text-[#2d6a4f] bg-clip-text text-transparent bg-gradient-to-r from-[#2d6a4f] to-[#1d5c8a]">
              Plan your season.
            </span>
          </h1>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-8 max-w-md font-normal">
            KrishiRaksha AI brings deep learning crop disease identification (CNN),
            multilingual voice AI assistance (LSTM), real-time weather and market pricing directly to your farm.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGetStarted}
              className="flex items-center gap-2.5 bg-gradient-to-r from-[#2d6a4f] to-[#225740] text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-emerald-900/20 group"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 bg-white/90 hover:bg-white text-stone-800 font-semibold px-6 py-3.5 rounded-2xl text-sm border border-stone-200/80 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              How it works
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Image Block - Cleaned up without small badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10 border-4 border-white/80 relative group">
            <img
              src="/hero-farmer.jpg"
              alt="Indian farmer inspecting crop with smartphone"
              className="w-full h-[360px] sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
          </div>
        </motion.div>
      </section>

      {/* Features Grid with Scroll Reveal */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-5 py-14"
      >
        <div className="text-center max-w-xl mx-auto mb-12">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-[#2d6a4f] text-xs font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Solutions
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Everything a farmer needs, in one place
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-white/90 backdrop-blur-sm border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between"
              onClick={handleGetStarted}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm"
                    style={{ backgroundColor: f.bg, color: f.color }}
                  >
                    <f.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-stone-900 text-lg mb-2 group-hover:text-[#2d6a4f] transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center text-xs font-bold text-[#2d6a4f] group-hover:translate-x-1 transition-transform">
                Explore feature <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section with Step Cards & Smooth Trigger */}
      <motion.section
        id="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-5 py-16"
      >
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-md mb-10 relative z-10">
            <motion.div variants={itemVariants} className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
              Simple 3-Step Setup
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl font-black tracking-tight text-white mb-3">
              How KrishiRaksha AI works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-stone-300 text-sm leading-relaxed">
              Get diagnostic reports, weather guidance and market insights in under a minute.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            {STEPS.map((s, idx) => (
              <motion.div
                key={s.num}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 font-black flex items-center justify-center text-sm mb-4 shadow-md">
                  {s.num}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                <p className="text-xs text-stone-300 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-white/10 flex justify-center relative z-10">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGetStarted}
              className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold px-8 py-4 rounded-2xl text-sm transition-all duration-200 shadow-xl shadow-emerald-500/20"
            >
              <span>Get Started with KrishiRaksha AI</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 py-8 text-center text-xs text-stone-500 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">KrishiRaksha AI</span>
            <span className="text-stone-300">|</span>
            <span>B.Tech Project</span>
          </div>
          <p className="text-stone-400">Deep Learning Multilingual Agricultural Assistant · CNN + Bidirectional LSTM Engine</p>
        </div>
      </footer>

      {/* Onboarding Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 relative border border-stone-100"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Step indicator progress bar */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step >= n ? 'bg-[#2d6a4f] w-10' : 'bg-stone-200 w-4'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#2d6a4f] flex items-center justify-center text-2xl mb-4 shadow-sm">
                    🌐
                  </div>
                  <h2 className="text-2xl font-black text-stone-900 mb-1">Select Language</h2>
                  <p className="text-xs text-stone-500 mb-6">We will adapt AI responses and interface in your preferred language.</p>
                  <div className="space-y-3">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLang(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 ${
                          selectedLang === lang.code
                            ? 'border-[#2d6a4f] bg-emerald-50/70 text-[#2d6a4f] font-bold shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-base">{lang.label}</span>
                          <span className="text-xs text-stone-400">({lang.eng})</span>
                        </div>
                        {selectedLang === lang.code && (
                          <div className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center text-2xl mb-4 shadow-sm">
                    🌾
                  </div>
                  <h2 className="text-2xl font-black text-stone-900 mb-1">Farmer Details</h2>
                  <p className="text-xs text-stone-500 mb-6">Help us customize recommendations for your crop and location.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {selectedLang === 'te' ? 'మీ పేరు *' : selectedLang === 'hi' ? 'आपका नाम *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        placeholder={selectedLang === 'te' ? 'రాముడు' : selectedLang === 'hi' ? 'रामू' : 'Ramu'}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {selectedLang === 'te' ? 'గ్రామం' : selectedLang === 'hi' ? 'गांव' : 'Village'}
                      </label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder={selectedLang === 'te' ? 'హన్మకొండ' : selectedLang === 'hi' ? 'हनमकोंडा' : 'Hanamkonda'}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
                          {selectedLang === 'te' ? 'పంట' : selectedLang === 'hi' ? 'फसल' : 'Main Crop'}
                        </label>
                        <select
                          value={crop}
                          onChange={(e) => setCrop(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all"
                        >
                          <option value="">Select</option>
                          <option value="Paddy">Paddy / Rice</option>
                          <option value="Cotton">Cotton</option>
                          <option value="Wheat">Wheat</option>
                          <option value="Chilli">Chilli</option>
                          <option value="Tomato">Tomato</option>
                          <option value="Maize">Maize</option>
                          <option value="Soybean">Soybean</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
                          {selectedLang === 'te' ? 'ఎకరాలు' : selectedLang === 'hi' ? 'एकड़' : 'Acres'}
                        </label>
                        <input
                          type="number"
                          value={acres}
                          onChange={(e) => setAcres(e.target.value)}
                          placeholder="2.5"
                          min="0.5"
                          max="100"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex items-center gap-3">
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={step === 2 && !farmerName.trim()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    step === 2 && !farmerName.trim()
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-[#2d6a4f] hover:bg-[#245a42] text-white shadow-md hover:shadow-lg active:scale-95'
                  }`}
                >
                  {step === 1 ? 'Continue' : 'Enter Dashboard'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
