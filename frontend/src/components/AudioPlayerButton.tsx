'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { useLanguage } from '@/context/LanguageContext';

interface AudioPlayerButtonProps {
  textToSpeak: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  textToSpeak,
  className = '',
  size = 'md',
}) => {
  const { speak, stopSpeaking, isSpeaking } = useVoice();
  const { t } = useLanguage();
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlayingThis, setIsPlayingThis] = useState(false);

  const handleToggle = () => {
    if (isPlayingThis && isSpeaking) {
      stopSpeaking();
      setIsPlayingThis(false);
    } else {
      setIsPlayingThis(true);
      setHasPlayed(true);
      speak(textToSpeak, () => {
        setIsPlayingThis(false);
      });
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-bold',
  }[size];

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center justify-center font-medium rounded-2xl shadow-sm transition-all duration-200 active:scale-95 ${
        isPlayingThis && isSpeaking
          ? 'bg-amber-600 text-white ring-4 ring-amber-200'
          : hasPlayed
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 shadow-md'
      } ${sizeClasses} ${className}`}
      title="Listen to response"
    >
      {isPlayingThis && isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 shrink-0 animate-pulse" />
          <span>Stop</span>
          <div className="flex items-center gap-0.5 ml-1">
            <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
            <span className="w-1 h-4 bg-white rounded-full animate-bounce"></span>
            <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
          </div>
        </>
      ) : hasPlayed ? (
        <>
          <RotateCcw className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>{t('listen_again_btn')}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 shrink-0" />
          <span>{t('listen_btn')}</span>
        </>
      )}
    </button>
  );
};
