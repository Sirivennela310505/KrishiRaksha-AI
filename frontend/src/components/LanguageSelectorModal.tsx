'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, Check, X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage, LanguageOption, LANGUAGES } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';

export const LanguageSelectorModal: React.FC = () => {
  const { currentLanguage, setLanguage, isLanguageModalOpen, setIsLanguageModalOpen, t } = useLanguage();
  const { speak } = useVoice();
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);
  const [selectedTemp, setSelectedTemp] = useState<LanguageOption>(currentLanguage);

  if (!isLanguageModalOpen) return null;

  const playVoicePreview = (e: React.MouseEvent, lang: LanguageOption) => {
    e.stopPropagation();
    speak(lang.greeting);
  };

  const handleSelect = (lang: LanguageOption) => {
    setSelectedTemp(lang);
    setLanguage(lang);
    speak(lang.greeting);

    // React-bits style celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6']
      });
    } catch {
      // fallback safe
    }
  };

  const handleConfirm = () => {
    setIsLanguageModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Animated backdrop with glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-md"
          onClick={() => setIsLanguageModalOpen(false)}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-500/20 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Banner with glowing aura */}
          <div className="relative px-6 py-6 sm:px-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shrink-0">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl shadow-inner"
                >
                  🌾
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      {t('select_lang_title')}
                    </h2>
                    <span className="hidden sm:inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/30">
                      <Sparkles className="w-2.5 h-2.5" /> 12 Dialects
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                    {t('select_lang_subtitle')}
                  </p>
                </div>
              </div>

              {/* Close Button if already selected once */}
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Languages Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === selectedTemp.code;
              return (
                <motion.button
                  key={lang.code}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(lang)}
                  onMouseEnter={() => setHoveredLang(lang.code)}
                  onMouseLeave={() => setHoveredLang(null)}
                  className={`group relative text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50/80 border-emerald-500 shadow-md shadow-emerald-700/10 ring-2 ring-emerald-500/20'
                      : 'bg-white hover:bg-stone-50/80 border-stone-200/90 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-stone-100/80 border border-stone-200/60">
                      {lang.flagIcon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-base sm:text-lg text-stone-900 tracking-tight block">
                          {lang.native}
                        </span>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </motion.span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 block">
                        {lang.name}
                      </span>
                      <span className="text-[11px] text-stone-500 truncate block mt-0.5">
                        {lang.region}
                      </span>
                    </div>
                  </div>

                  {/* Audio preview — use div to avoid nested button hydration error */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => playVoicePreview(e, lang)}
                    onKeyDown={(e) => { if (e.key === 'Enter') playVoicePreview(e as any, lang); }}
                    title="Audio Greeting Preview"
                    className="shrink-0 p-2 rounded-xl text-stone-400 hover:text-emerald-700 hover:bg-emerald-100/60 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer with confirmation button */}
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Selected: <strong className="text-emerald-900 font-extrabold">{selectedTemp.native} ({selectedTemp.name})</strong>
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleConfirm}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 flex items-center gap-2"
            >
              <span>{t('continue_btn')}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
