'use client';

import React from 'react';
import { Home, Stethoscope, TrendingUp, MessageSquare, Mic } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onVoiceTrigger: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onVoiceTrigger,
}) => {
  const { t } = useLanguage();
  const { isListening } = useVoice();

  // Only 4 core items + central mic button for mobile — sidebar handles the full list
  const navItems = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'crop-doctor', label: t('nav_crop'), icon: Stethoscope },
    { id: 'mandi', label: t('nav_mandi'), icon: TrendingUp },
    { id: 'chat', label: t('nav_chat'), icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-2 py-1.5 sm:hidden">
      <div className="flex items-center justify-around relative">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
                isActive
                  ? 'text-stone-900 font-bold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-stone-900' : ''}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-[56px]">{item.label}</span>
            </button>
          );
        })}

        {/* Central Voice Button */}
        <div className="relative -mt-5">
          <button
            onClick={onVoiceTrigger}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all active:scale-95 ${
              isListening
                ? 'bg-red-500 text-white ring-4 ring-red-200 animate-pulse'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
            aria-label="Activate Voice Assistant"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
                isActive
                  ? 'text-stone-900 font-bold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-stone-900' : ''}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-[56px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
