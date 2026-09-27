'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Square } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { useLanguage } from '@/context/LanguageContext';

interface VoiceMicButtonProps {
  onTranscriptReady?: (transcript: string) => void;
  className?: string;
  size?: 'default' | 'large' | 'compact';
  label?: string;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  onTranscriptReady,
  className = '',
  size = 'default',
  label,
}) => {
  const { isListening, startListening, stopListening } = useVoice();
  const { t } = useLanguage();

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        if (onTranscriptReady) {
          onTranscriptReady(text);
        }
      });
    }
  };

  const isLarge = size === 'large';
  const isCompact = size === 'compact';

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Outer pulsing ring when listening */}
      {isListening && (
        <>
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.45, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-emerald-500/40 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-emerald-400/20 pointer-events-none"
          />
        </>
      )}

      <button
        onClick={handleToggle}
        type="button"
        className={`relative z-10 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xl ${
          isListening
            ? 'bg-rose-600 hover:bg-rose-700 text-white ring-8 ring-rose-200 shadow-rose-600/30'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/30 hover:scale-105'
        } ${
          isLarge
            ? 'w-20 h-20 rounded-full text-2xl'
            : isCompact
            ? 'w-11 h-11 rounded-2xl text-base'
            : 'w-14 h-14 rounded-full text-lg'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start speaking'}
      >
        {isListening ? (
          <Square className={`${isLarge ? 'w-8 h-8' : isCompact ? 'w-5 h-5' : 'w-6 h-6'} fill-current`} />
        ) : (
          <Mic className={`${isLarge ? 'w-9 h-9' : isCompact ? 'w-5 h-5' : 'w-7 h-7'}`} />
        )}
      </button>

      {/* Waveform indicator when listening */}
      {isListening && (
        <div className="flex items-center gap-1 mt-2">
          <span className="w-1.5 h-3 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-6 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-8 bg-emerald-600 rounded-full animate-bounce"></span>
          <span className="w-1.5 h-5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
          <span className="w-1.5 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.35s]"></span>
        </div>
      )}

      {label && !isListening && (
        <span className="text-xs font-semibold text-emerald-950 mt-1.5 text-center">
          {label}
        </span>
      )}
    </div>
  );
};
