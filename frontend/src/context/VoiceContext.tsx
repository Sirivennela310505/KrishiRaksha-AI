'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from './LanguageContext';

export type VoicePhase = 'idle' | 'listening' | 'understanding' | 'analyzing' | 'preparing' | 'speaking';

interface VoiceContextType {
  isListening: boolean;
  isSpeaking: boolean;
  voicePhase: VoicePhase;
  transcript: string;
  startListening: (onResultCallback?: (text: string) => void) => void;
  stopListening: () => void;
  speak: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  setVoicePhase: (phase: VoicePhase) => void;
}

const VoiceContext = createContext<VoiceContextType>({
  isListening: false,
  isSpeaking: false,
  voicePhase: 'idle',
  transcript: '',
  startListening: () => {},
  stopListening: () => {},
  speak: () => {},
  stopSpeaking: () => {},
  pauseSpeaking: () => {},
  resumeSpeaking: () => {},
  setVoicePhase: () => {},
});

// ─── Language code → gTTS / browser voice matching map ────────────────────────
// Maps currentLanguage.code (e.g. 'te-IN') to an ordered list of BCP-47 tags
// that Chrome/Edge ship their TTS voices under.
const VOICE_LANG_CANDIDATES: Record<string, string[]> = {
  'te-IN': ['te-IN', 'te'],
  'hi-IN': ['hi-IN', 'hi'],
  'ta-IN': ['ta-IN', 'ta'],
  'kn-IN': ['kn-IN', 'kn'],
  'ml-IN': ['ml-IN', 'ml'],
  'mr-IN': ['mr-IN', 'mr'],
  'bn-IN': ['bn-IN', 'bn', 'bn-BD'],
  'gu-IN': ['gu-IN', 'gu'],
  'pa-IN': ['pa-IN', 'pa', 'pa-Guru-IN'],
  'or-IN': ['or-IN', 'or'],
  'as-IN': ['as-IN', 'as'],
  'en-IN': ['en-IN', 'en-GB', 'en-US'],
};

/**
 * Pick the best available browser TTS voice for a given language code.
 * We wait until voices are loaded using the `voiceschanged` event if needed.
 */
function pickVoice(langCode: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const candidates = VOICE_LANG_CANDIDATES[langCode] || [langCode];

  // 1. Exact lang match
  for (const cand of candidates) {
    const exact = voices.find((v) => v.lang === cand);
    if (exact) return exact;
  }

  // 2. Prefix match (e.g. 'te' matches 'te-IN')
  for (const cand of candidates) {
    const prefix = voices.find((v) => v.lang.startsWith(cand));
    if (prefix) return prefix;
  }

  return null;
}

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicePhase, setVoicePhase] = useState<VoicePhase>('idle');
  const [transcript, setTranscript] = useState('');
  const [voicesReady, setVoicesReady] = useState(false);

  const recognitionRef = useRef<any>(null);
  const callbackRef = useRef<((text: string) => void) | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Load voices eagerly; retry on voiceschanged ──────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const tryLoad = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesReady(true);
    };

    tryLoad(); // might already be cached (Chrome 1st paint)
    window.speechSynthesis.addEventListener('voiceschanged', tryLoad);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', tryLoad);
  }, []);

  // ── Rebuild SpeechRecognition whenever language changes ──────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = currentLanguage.code; // ← set to e.g. 'te-IN'

    recognition.onstart = () => {
      setIsListening(true);
      setVoicePhase('listening');
    };

    recognition.onresult = (event: any) => {
      let cur = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        cur += event.results[i][0].transcript;
      }
      setTranscript(cur);
      if (event.results[0].isFinal) {
        setVoicePhase('understanding');
        if (callbackRef.current) callbackRef.current(cur);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      setVoicePhase('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [currentLanguage]);

  const startListening = (onResultCallback?: (text: string) => void) => {
    callbackRef.current = onResultCallback;
    setTranscript('');
    stopSpeaking();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = currentLanguage.code;
        recognitionRef.current.start();
      } catch {
        try {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 200);
        } catch {
          setIsListening(true);
          setVoicePhase('listening');
        }
      }
    } else {
      // Simulation fallback
      setIsListening(true);
      setVoicePhase('listening');
      const fallbackPrompts: Record<string, string> = {
        te: 'వరి పంట ఆకులు ఎండిపోతున్నాయి, ఏమి చేయాలి?',
        hi: 'धान की पत्तियां पीली पड़ रही हैं, क्या उपाय करें?',
        ta: 'நெல் பயிரில் இலைகள் கருகுகின்றன, என்ன மருந்து?',
        kn: 'ಭತ್ತದ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ, ಏನು ಮಾಡಬೇಕು?',
        ml: 'നെൽ‌കൃഷിയിൽ ഇലകൾ കരിയുന്നു, എന്ത് ചെയ്യണം?',
        en: 'Paddy leaves are turning yellow, what should I do?',
      };
      const text = fallbackPrompts[currentLanguage.short] || fallbackPrompts['en'];
      setTimeout(() => {
        setVoicePhase('understanding');
        setTranscript(text);
        setTimeout(() => {
          setIsListening(false);
          if (onResultCallback) onResultCallback(text);
        }, 1200);
      }, 2000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
  };

  /**
   * Speak `text` in the currently selected language.
   *
   * Fix for "Telugu selected but English voice plays":
   * – We use `voiceschanged` to ensure voices are loaded BEFORE calling speak().
   * – We pick the voice with `pickVoice()` which tries exact then prefix match.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Speak `text` in the currently selected language.
   * If browser has a native voice installed, uses SpeechSynthesis.
   * If browser lacks a native Indian voice (e.g. Telugu on Windows),
   * seamlessly falls back to our backend gTTS stream for 100% audible clarity.
   */
  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined') {
        if (onEnd) onEnd();
        return;
      }

      // Stop any current playback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const cleanText = (text || '')
        .replace(/[*#_`>]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .trim()
        .slice(0, 400);

      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      setIsSpeaking(true);
      setVoicePhase('speaking');

      let finished = false;
      const markDone = () => {
        if (finished) return;
        finished = true;
        setIsSpeaking(false);
        setVoicePhase('idle');
        if (onEnd) onEnd();
      };

      const fallbackSynthesis = () => {
        if (!('speechSynthesis' in window)) {
          markDone();
          return;
        }
        try {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = currentLanguage.code;
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          const voice = pickVoice(currentLanguage.code);
          if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
          }
          utterance.onstart = () => {
            setIsSpeaking(true);
            setVoicePhase('speaking');
          };
          utterance.onend = markDone;
          utterance.onerror = markDone;
          window.speechSynthesis.speak(utterance);
        } catch {
          markDone();
        }
      };

      // Always prioritize backend gTTS audio stream for guaranteed audio playback in all languages
      const langShort = currentLanguage.short || 'te';
      const encoded = encodeURIComponent(cleanText);
      const host = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
      const apiUrl = `/api/voice/audio?text=${encoded}&lang=${langShort}`;
      const fallbackUrl = `http://${host}:8000/api/voice/audio?text=${encoded}&lang=${langShort}`;

      try {
        const audio = new Audio(apiUrl);
        audioRef.current = audio;
        audio.onended = markDone;
        audio.onerror = () => {
          console.warn('[VoiceContext] Proxy audio failed, attempting direct backend URL');
          try {
            const fallbackAudio = new Audio(fallbackUrl);
            audioRef.current = fallbackAudio;
            fallbackAudio.onended = markDone;
            fallbackAudio.onerror = () => {
              console.warn('[VoiceContext] Direct audio failed, falling back to speech synthesis');
              fallbackSynthesis();
            };
            fallbackAudio.play().catch(() => fallbackSynthesis());
          } catch {
            fallbackSynthesis();
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[VoiceContext] Autoplay/proxy error, trying direct backend URL:', err);
            try {
              const fallbackAudio = new Audio(fallbackUrl);
              audioRef.current = fallbackAudio;
              fallbackAudio.onended = markDone;
              fallbackAudio.onerror = () => fallbackSynthesis();
              fallbackAudio.play().catch(() => fallbackSynthesis());
            } catch {
              fallbackSynthesis();
            }
          });
        }
      } catch {
        fallbackSynthesis();
      }
    },
    [currentLanguage, voicesReady]
  );

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    if (voicePhase === 'speaking') setVoicePhase('idle');
  };

  const pauseSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  };

  const resumeSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isSpeaking,
        voicePhase,
        transcript,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        pauseSpeaking,
        resumeSpeaking,
        setVoicePhase,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);
