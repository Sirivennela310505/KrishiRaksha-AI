'use client';

import React from 'react';
import {
  Home,
  Stethoscope,
  TrendingUp,
  Landmark,
  FlaskConical,
  MessageSquare,
  CloudSun,
  ChevronRight,
  Globe,
  X
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenLanguageModal?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
  onOpenLanguageModal
}) => {
  const { t, currentLanguage } = useLanguage();
  const lang = currentLanguage.short;

  const navItems = [
    {
      id: 'home',
      label: t('nav_home'),
      icon: Home,
    },
    {
      id: 'crop-doctor',
      label: t('nav_crop'),
      icon: Stethoscope,
      badge: 'AI',
    },
    {
      id: 'mandi',
      label: t('nav_mandi'),
      icon: TrendingUp,
      badge: 'Live',
    },
    {
      id: 'schemes',
      label: t('nav_schemes'),
      icon: Landmark,
    },
    {
      id: 'soil-advisor',
      label: t('nav_soil_advisor'),
      icon: FlaskConical,
    },
    {
      id: 'chat',
      label: t('nav_chat'),
      icon: MessageSquare,
      badge: 'NLP',
    },
    {
      id: 'weather',
      label: t('nav_weather'),
      icon: CloudSun,
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container — hidden on mobile by default, slides in when toggled */}
      <aside
        className={`fixed sm:static top-0 bottom-0 left-0 z-50 w-64 lg:w-72 bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        {/* Brand Header — refined, less green */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-white text-sm font-bold">
              🌾
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 tracking-tight">
                {lang === 'te' ? 'కృషి రక్షా AI' : lang === 'hi' ? 'कृषि रक्षा AI' : 'Krishi Raksha AI'}
              </span>
              <p className="text-[10px] text-stone-400 font-medium">
                {lang === 'te' ? 'వ్యవసాయ AI ప్లాట్‌ఫారమ్' : lang === 'hi' ? 'कृषि AI प्लेटफॉर्म' : 'Agritech NLP Platform'}
              </p>
            </div>
          </div>
          {/* Close button (mobile only) */}
          <button
            onClick={onCloseMobile}
            className="sm:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <div className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            {lang === 'te' ? 'సేవలు' : lang === 'hi' ? 'सेवाएं' : 'Services'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all group ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  <span className="text-[13px] font-semibold truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-white/60' : 'text-stone-300 group-hover:text-stone-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom: Language Switcher */}
        <div className="px-3 py-3 border-t border-stone-100">
          <button
            onClick={onOpenLanguageModal}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-stone-500 group-hover:text-stone-700 transition-colors" />
              <div className="text-left">
                <span className="text-[10px] text-stone-400 font-medium block leading-none">
                  {lang === 'te' ? 'భాష' : lang === 'hi' ? 'भाषा' : 'Language'}
                </span>
                <span className="text-xs font-bold text-stone-800 leading-tight">
                  {currentLanguage.flagIcon} {currentLanguage.native}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
              {lang.toUpperCase()}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
