'use client';

import React from 'react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onToggleSidebar?: () => void;
  onVoiceTrigger?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenProfile,
  onOpenAdmin,
  onToggleSidebar,
  onVoiceTrigger,
  unreadCount = 2,
}) => {
  const { currentLanguage, selectLanguage, t } = useLanguage();
  const lang = currentLanguage.short;

  const quickLangs = [
    { code: 'te-IN', native: 'తెలుగు' },
    { code: 'hi-IN', native: 'हिन्दी' },
    { code: 'ta-IN', native: 'தமிழ்' },
    { code: 'en-IN', native: 'English' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 px-3 sm:px-5 py-2.5">
      <div className="flex items-center justify-between gap-2 max-w-full">
        {/* Left: Hamburger (mobile) + Brand — brand hidden on desktop where sidebar shows it */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSidebar}
            className="sm:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Show brand only on mobile (sidebar hides on desktop) */}
          <div className="flex items-center gap-2 sm:hidden">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white text-sm">
              🌾
            </div>
            <div>
              <span className="font-bold text-stone-900 text-sm tracking-tight">
                {lang === 'te' ? 'కృషి రక్షా AI' : lang === 'hi' ? 'कृषि रक्षा AI' : 'Krishi Raksha AI'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Language pills + actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Language Pills (desktop only) */}
          <div className="hidden sm:flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            {quickLangs.map((ql) => {
              const isSelected = currentLanguage.code === ql.code;
              return (
                <button
                  key={ql.code}
                  onClick={() => selectLanguage(ql.code)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
                  }`}
                >
                  {ql.native}
                </button>
              );
            })}
          </div>

          {/* Mobile Language (current language label) */}
          <button
            onClick={() => selectLanguage(
              currentLanguage.code === 'en-IN' ? 'te-IN' : 'en-IN'
            )}
            className="sm:hidden flex items-center gap-1 bg-stone-100 text-stone-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-stone-200"
          >
            <span>{currentLanguage.native}</span>
          </button>

          {/* Voice is only in Crop Doctor now */}

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={onOpenProfile}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Farmer Profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
