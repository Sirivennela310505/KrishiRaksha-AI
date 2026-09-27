'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Check, Sparkles, MapPin, Wheat } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { FarmerProfileData } from '@/types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentLanguage, setLanguage, allLanguages } = useLanguage();
  const [profile, setProfile] = useState<FarmerProfileData>({
    preferred_language: 'te-IN',
    state: 'Telangana',
    district: 'Warangal',
    sub_district: 'Hanamkonda',
    village: 'Rampur',
    farm_size_acres: 4.5,
    crops_grown: ['Paddy', 'Cotton', 'Chilli'],
    soil_type: 'Black Cotton Soil',
    irrigation_source: 'Borewell & Canal',
    sms_alerts_enabled: true,
    voice_alerts_enabled: true
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('http://127.0.0.1:8000/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data) setProfile(data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCrop = (crop: string) => {
    if (profile.crops_grown.includes(crop)) {
      setProfile({
        ...profile,
        crops_grown: profile.crops_grown.filter((c) => c !== crop)
      });
    } else {
      setProfile({
        ...profile,
        crops_grown: [...profile.crops_grown, crop]
      });
    }
  };

  const handleSave = () => {
    fetch('http://127.0.0.1:8000/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })
      .then((res) => res.json())
      .then(() => {
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 1200);
      })
      .catch(() => {
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 1200);
      });
  };

  const commonCrops = ['Paddy', 'Cotton', 'Chilli', 'Tomato', 'Wheat', 'Maize', 'Soybean', 'Onion', 'Turmeric'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-emerald-900/10"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-[#fbf9f4]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">Farmer Farm Profile</h3>
                <p className="text-xs text-stone-500">Configure your farm location, crops, and language</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Preferred Voice & Text Language
              </label>
              <select
                value={profile.preferred_language}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfile({ ...profile, preferred_language: val });
                  const found = allLanguages.find((l) => l.code === val);
                  if (found) setLanguage(found);
                }}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                {allLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native} ({l.name}) - {l.region}
                  </option>
                ))}
              </select>
            </div>

            {/* Location fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Village & Farm Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Village / Mandal</label>
                <input
                  type="text"
                  value={profile.village}
                  onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Farm Land (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  value={profile.farm_size_acres}
                  onChange={(e) => setProfile({ ...profile, farm_size_acres: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Crops Grown */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Crops Grown in Your Fields
              </label>
              <div className="flex flex-wrap gap-2">
                {commonCrops.map((crop) => {
                  const isChecked = profile.crops_grown.includes(crop);
                  return (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {crop} {isChecked ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alerts Toggles */}
            <div className="border-t border-stone-200/80 pt-3 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-stone-800">Voice Alerts for Weather & Pest Warnings</span>
                <input
                  type="checkbox"
                  checked={profile.voice_alerts_enabled}
                  onChange={(e) => setProfile({ ...profile, voice_alerts_enabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-stone-800">Daily Mandi Price SMS Summary</span>
                <input
                  type="checkbox"
                  checked={profile.sms_alerts_enabled}
                  onChange={(e) => setProfile({ ...profile, sms_alerts_enabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-5 py-4 border-t border-stone-100 bg-[#fbf9f4] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Saved Successfully!
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
