'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { SidebarNav } from '@/components/SidebarNav';
import { BottomNav } from '@/components/BottomNav';
import { NotificationsModal } from '@/components/NotificationsModal';
import { ProfileModal } from '@/components/ProfileModal';
import { AdminModal } from '@/components/AdminModal';
import { LanguageSelectorModal } from '@/components/LanguageSelectorModal';
import { HomeView } from '@/views/HomeView';
import { CropDoctorView } from '@/views/CropDoctorView';
import { MandiView } from '@/views/MandiView';
import { SchemesView } from '@/views/SchemesView';
import { SoilAdvisorView } from '@/views/SoilAdvisorView';
import { WeatherView } from '@/views/WeatherView';
import { ChatView } from '@/views/ChatView';
import { LandingPage } from '@/views/LandingPage';
import { useVoice } from '@/context/VoiceContext';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  // Show landing page until farmer completes onboarding
  const [showDashboard, setShowDashboard] = useState(false);
  const [farmerName, setFarmerName] = useState('');

  const [activeTab, setActiveTab] = useState<string>('home');
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState('');

  const { startListening } = useVoice();
  const { openLanguageModal, selectLanguage } = useLanguage();

  const handleEnterDashboard = (name: string, lang: string) => {
    setFarmerName(name);
    // Map short lang codes to full codes and set in context
    const langMap: Record<string, string> = { te: 'te-IN', hi: 'hi-IN', en: 'en-IN' };
    selectLanguage(langMap[lang] || 'te-IN');
    // Save to localStorage so the auto-modal doesn't re-open
    localStorage.setItem('krishi_raksha_lang', langMap[lang] || 'te-IN');
    setShowDashboard(true);
  };

  const handleVoiceTrigger = () => {
    setActiveTab('chat');
    startListening();
  };

  const handleNavigateToChatWithQuery = (query?: string) => {
    if (query) setChatInitialQuery(query);
    setActiveTab('chat');
  };

  // ── Landing Page ─────────────────────────────────────────────────────────
  if (!showDashboard) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35 }}
        >
          <LandingPage onEnterDashboard={handleEnterDashboard} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen flex flex-col bg-[#fbf9f4] text-stone-900"
      >
        {/* Universal Header */}
        <Header
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
          onOpenAdmin={() => setAdminOpen(true)}
          onToggleSidebar={() => setSidebarMobileOpen((prev) => !prev)}
          onVoiceTrigger={handleVoiceTrigger}
        />

        {/* Responsive Enterprise Layout with Sidebar */}
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
          {/* Persistent Enterprise Sidebar */}
          <SidebarNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpenMobile={sidebarMobileOpen}
            onCloseMobile={() => setSidebarMobileOpen(false)}
            onOpenLanguageModal={openLanguageModal}
          />

          {/* Main Content Workspace */}
          <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 pt-4 pb-24 sm:pb-12 overflow-y-auto">
            {activeTab === 'home' && (
              <HomeView
                onNavigate={(tab) => setActiveTab(tab)}
                onVoiceTrigger={handleVoiceTrigger}
              />
            )}

            {activeTab === 'crop-doctor' && (
              <CropDoctorView onNavigateToChat={handleNavigateToChatWithQuery} />
            )}

            {activeTab === 'mandi' && <MandiView />}

            {activeTab === 'schemes' && <SchemesView />}

            {activeTab === 'soil-advisor' && <SoilAdvisorView />}

            {activeTab === 'weather' && <WeatherView />}

            {activeTab === 'chat' && (
              <ChatView
                initialMessage={chatInitialQuery}
                onNavigateToCropDoctor={() => setActiveTab('crop-doctor')}
                onNavigateToMandi={() => setActiveTab('mandi')}
                onNavigateToSchemes={() => setActiveTab('schemes')}
              />
            )}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onVoiceTrigger={handleVoiceTrigger}
        />

        {/* Language Selector Modal */}
        <LanguageSelectorModal />

        {/* Modals */}
        <NotificationsModal
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />

        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />

        <AdminModal
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
}
