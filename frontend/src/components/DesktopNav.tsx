'use client';

import React from 'react';
import { Home, Stethoscope, TrendingUp, Landmark, CloudSun, Video, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DesktopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'crop-doctor', label: t('nav_crop'), icon: Stethoscope },
    { id: 'mandi', label: t('nav_mandi'), icon: TrendingUp },
    { id: 'schemes', label: t('nav_schemes'), icon: Landmark },
    { id: 'weather', label: t('nav_weather'), icon: CloudSun },
    { id: 'videos', label: t('nav_videos'), icon: Video },
    { id: 'chat', label: t('nav_chat'), icon: MessageSquare },
  ];

  return (
    <div className="hidden sm:flex items-center justify-center gap-1.5 py-3 border-b border-emerald-900/10 bg-[#f8f6f0]/80">
      <div className="bg-white/90 p-1.5 rounded-2xl shadow-sm border border-emerald-950/10 flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-black transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-800/20'
                  : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
