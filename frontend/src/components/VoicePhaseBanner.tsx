'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice, VoicePhase } from '@/context/VoiceContext';
import { useLanguage } from '@/context/LanguageContext';
import { Mic, Brain, Sparkles, Volume2, CheckCircle2, Search } from 'lucide-react';

export const VoicePhaseBanner: React.FC = () => {
  const { voicePhase, isSpeaking, stopSpeaking, transcript } = useVoice();
  const { t } = useLanguage();

  if (voicePhase === 'idle' && !isSpeaking) return null;

  const phaseConfig: Record<VoicePhase, { icon: any; title: string; color: string; desc: string }> = {
    idle: { icon: CheckCircle2, title: 'Ready', color: 'bg-emerald-600', desc: '' },
    listening: {
      icon: Mic,
      title: t('voice_listening') || '🎙️ Listening to your voice…',
      color: 'bg-emerald-600 text-white',
      desc: 'Speak freely in your native language',
    },
    understanding: {
      icon: Brain,
      title: t('voice_understanding') || '🧠 Understanding your question…',
      color: 'bg-amber-600 text-white',
      desc: transcript ? `"${transcript}"` : 'Processing speech tokens…',
    },
    analyzing: {
      icon: Search,
      title: '🔍 Analyzing crop leaf and symptoms…',
      color: 'bg-blue-600 text-white',
      desc: 'Running computer vision disease identification',
    },
    preparing: {
      icon: Sparkles,
      title: t('voice_preparing') || '🔊 Preparing agricultural recommendation…',
      color: 'bg-emerald-700 text-white',
      desc: 'Checking ICAR & agricultural university recommendations',
    },
    speaking: {
      icon: Volume2,
      title: '🔊 Krishi Mitra is speaking…',
      color: 'bg-emerald-800 text-white',
      desc: 'Tap stop button to silence',
    },
  };

  const current = phaseConfig[voicePhase] || phaseConfig['idle'];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-16 left-0 right-0 z-50 px-4 max-w-xl mx-auto pointer-events-none"
      >
        <div
          className={`pointer-events-auto rounded-2xl shadow-xl p-4 border border-white/20 backdrop-blur-md ${current.color} transition-colors duration-300 flex items-center justify-between gap-4`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base leading-tight">{current.title}</p>
              {current.desc && (
                <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{current.desc}</p>
              )}
            </div>
          </div>

          {/* Sound wave visualizer */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-1 h-4 bg-white/90 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-6 bg-white/90 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-3 bg-white/90 rounded-full animate-bounce"></span>
            <span className="w-1 h-5 bg-white/90 rounded-full animate-bounce [animation-delay:-0.25s]"></span>
          </div>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="bg-white/20 hover:bg-white/30 text-xs px-2.5 py-1 rounded-lg shrink-0 border border-white/30"
            >
              Stop
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
