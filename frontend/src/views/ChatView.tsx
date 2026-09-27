'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  Image as ImageIcon,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Camera
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';
import { ChatMessage } from '@/types';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { VoiceMicButton } from '@/components/VoiceMicButton';

interface ChatViewProps {
  initialMessage?: string;
  onNavigateToCropDoctor?: () => void;
  onNavigateToMandi?: () => void;
  onNavigateToSchemes?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  initialMessage = '',
  onNavigateToCropDoctor,
  onNavigateToMandi,
  onNavigateToSchemes
}) => {
  const { t, currentLanguage } = useLanguage();
  const { setVoicePhase, speak } = useVoice();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate session ID
    const newSession = 'session_' + Math.random().toString(36).substring(2, 9);
    setSessionId(newSession);

    // Initial greeting from Krishi Mitra
    const greetings: Record<string, string> = {
      te: 'నమస్కారం రైతు సోదరులారా! నేను కృషి మిత్రను. మీ పంట వ్యాధులు, నేటి మార్కెట్ ధరలు, ప్రభుత్వ సబ్సిడీలు మరియు వాతావరణం గురించి ఏదైనా అడగవచ్చు. మాట్లాడండి లేదా టైప్ చేయండి!',
      hi: 'नमस्ते किसान भाई! मैं कृषि मित्र हूँ। अपनी फसलों के रोग, आज का मंडी भाव, सरकारी योजनाएं और मौसम से जुड़ी कोई भी जानकारी मुझसे पूछें।',
      ta: 'வணக்கம் விவசாய நண்பரே! நான் கிருஷி மித்ரா. உங்கள் பயிர் நோய்கள், சந்தை விலைகள் மற்றும் அரசு திட்டங்கள் குறித்து என்னிடம் கேட்கலாம்.',
      en: 'Namaste! I am Krishi Mitra, your agricultural guide. You can ask me about crop diseases, today’s mandi prices, government subsidies, or field preparation.'
    };

    const initialGreeting = greetings[currentLanguage.short] || greetings['en'];
    setMessages([
      {
        id: 'msg-init',
        sender: 'krishi_mitra',
        text: initialGreeting,
        timestamp: 'Just now',
        audioNarrative: initialGreeting,
        citedSources: ['Krishi Raksha Agricultural Assistant'],
        suggestedActions: [
          '🌾 Paddy Leaf Disease',
          '📈 Today Mandi Price',
          '🏛️ 50% Machinery Subsidy',
          '🌧️ Tomorrow Rain Forecast'
        ]
      }
    ]);

    if (initialMessage) {
      sendMessage(initialMessage, newSession);
    }
  }, [currentLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string, activeSession?: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'farmer',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);
    setVoicePhase('understanding');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession || sessionId,
          message: text.trim(),
          language: currentLanguage.code
        })
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'krishi_mitra',
        text: data.reply,
        timestamp: data.timestamp || 'Just now',
        audioNarrative: data.audio_narrative,
        intent: data.intent,
        citedSources: data.cited_sources,
        suggestedActions: data.suggested_actions
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
      setVoicePhase('idle');

      // Auto speak for voice convenience if voice input was used
      speak(data.audio_narrative || data.reply);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setVoicePhase('idle');
    }
  };

  const handleSuggestedAction = (actionText: string) => {
    if (actionText.includes('Crop Doctor') && onNavigateToCropDoctor) {
      onNavigateToCropDoctor();
    } else if (actionText.includes('Mandi') && onNavigateToMandi) {
      onNavigateToMandi();
    } else if (actionText.includes('Subsidy') && onNavigateToSchemes) {
      onNavigateToSchemes();
    } else {
      sendMessage(actionText);
    }
  };

  const quickPrompts = [
    'My rice leaves are turning yellow.',
    'What is today’s paddy mandi price?',
    'Which scheme helps buy farm machinery?',
    'What should I know about tomorrow’s weather?'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto pb-4">
      {/* Assistant Header */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-purple-600/20">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-stone-900 text-base">
                Krishi Mitra AI (కృషి మిత్ర)
              </h2>
              <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                Multilingual AI Guide
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Cross-module intelligence • Speaks {currentLanguage.native}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            const newSession = 'session_' + Math.random().toString(36).substring(2, 9);
            setSessionId(newSession);
          }}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 p-2 rounded-xl hover:bg-stone-100 flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 py-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'farmer';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm shrink-0 shadow-xs mt-1">
                  🌱
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-lg rounded-3xl p-4 shadow-sm space-y-2 ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-xs'
                    : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs'
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                  {msg.text}
                </p>

                {/* Sources Citation Pill */}
                {msg.citedSources && msg.citedSources.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[10px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Source: {msg.citedSources.join(', ')}</span>
                  </div>
                )}

                {/* Audio Readout Button */}
                {!isUser && msg.audioNarrative && (
                  <div className="pt-1 flex items-center justify-between">
                    <AudioPlayerButton textToSpeak={msg.audioNarrative} size="sm" />
                    <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedAction(act)}
                        className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[11px] font-bold transition-colors"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-1">
                  👨‍🌾
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs py-2 px-4 bg-white/70 rounded-2xl w-fit border border-stone-200">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
            <span>Krishi Mitra is thinking and checking ICAR knowledge…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q)}
            className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 text-xs font-semibold rounded-2xl whitespace-nowrap shadow-xs transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Composer with Voice, Camera, and Send */}
      <div className="bg-white rounded-3xl p-2.5 border border-stone-200/90 shadow-lg flex items-center gap-2">
        <button
          onClick={onNavigateToCropDoctor}
          className="p-2.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl transition-colors shrink-0"
          title="Attach Crop Leaf Photo"
        >
          <Camera className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
          placeholder={`Speak or type in ${currentLanguage.native}…`}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none"
        />

        {/* Big pulsing voice mic button */}
        <VoiceMicButton
          size="compact"
          onTranscriptReady={(transcript) => sendMessage(transcript)}
        />

        <button
          onClick={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-2xl transition-all shadow-md shadow-emerald-700/20 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
