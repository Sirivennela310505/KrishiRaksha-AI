'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Volume2,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Clock,
  Languages,
  CheckCircle2,
  X,
  Share2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';
import { VideoTip } from '@/types';

const INITIAL_FALLBACK_VIDEOS: VideoTip[] = [
  {
    id: 1,
    title: 'How to Identify and Treat Rice Blast in 5 Steps',
    topic: 'Disease Management',
    crop: 'Paddy / Rice',
    duration: '04:25',
    thumbnail_url: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    video_url: 'https://www.youtube.com',
    expert_name: 'Dr. K. Ramana Rao',
    institution: 'PJTSAU Telangana Agricultural University',
    language: 'Hindi & Telugu'
  },
  {
    id: 2,
    title: 'Pink Bollworm Pheromone Trap Installation Demonstration',
    topic: 'Pest Management',
    crop: 'Cotton',
    duration: '06:10',
    thumbnail_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80',
    video_url: 'https://www.youtube.com',
    expert_name: 'Dr. V. Blaise',
    institution: 'ICAR - Central Institute for Cotton Research',
    language: 'Hindi & English'
  },
  {
    id: 3,
    title: 'Applying for 50% Subsidy on Farm Machinery via SMAM Portal',
    topic: 'Government Schemes',
    crop: 'General',
    duration: '08:45',
    thumbnail_url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
    video_url: 'https://www.youtube.com',
    expert_name: 'Er. S. Patel',
    institution: 'Department of Agriculture Mechanization',
    language: 'Hindi'
  },
  {
    id: 4,
    title: 'Drip Irrigation Maintenance: Acid Treatment for Dripper Clogging',
    topic: 'Water Management',
    crop: 'Tomato & Chilli',
    duration: '05:30',
    thumbnail_url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    video_url: 'https://www.youtube.com',
    expert_name: 'Er. M. Venkatesh',
    institution: 'PMKSY Micro-Irrigation Division',
    language: 'Telugu & Tamil'
  },
  {
    id: 5,
    title: 'Organic Jeevamrutha Preparation for Natural Pest Resistance',
    topic: 'Organic Farming',
    crop: 'All Crops',
    duration: '07:15',
    thumbnail_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    video_url: 'https://www.youtube.com',
    expert_name: 'Shri Subhash Palekar Certified Trainer',
    institution: 'National Centre for Organic Farming',
    language: 'Telugu, Kannada & Hindi'
  },
  {
    id: 6,
    title: 'High-Yield Wheat Sowing Techniques & Fertilizer Broadcasting',
    topic: 'Crop Nutrition',
    crop: 'Wheat',
    duration: '05:50',
    thumbnail_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    video_url: 'https://www.youtube.com',
    expert_name: 'Dr. H. S. Dhaliwal',
    institution: 'Punjab Agricultural University (PAU)',
    language: 'Punjabi & Hindi'
  }
];

const TOPIC_FILTERS = [
  'All',
  'Disease Management',
  'Pest Management',
  'Government Schemes',
  'Water Management',
  'Organic Farming',
  'Crop Nutrition'
];

export const VideosView: React.FC = () => {
  const { t, tCrop, currentLanguage } = useLanguage();
  const { speak, stopSpeaking } = useVoice();
  const [videos, setVideos] = useState<VideoTip[]>(INITIAL_FALLBACK_VIDEOS);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState<VideoTip | null>(null);
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/videos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with rich initial list
          setVideos([...data, ...INITIAL_FALLBACK_VIDEOS.slice(2)]);
        }
      })
      .catch(() => {});
  }, []);

  const filteredVideos = videos.filter((v) => {
    if (selectedTopic === 'All') return true;
    return v.topic.toLowerCase().includes(selectedTopic.toLowerCase());
  });

  const handleListenTip = (video: VideoTip) => {
    setSpeakingId(video.id);

    let summary = '';
    if (currentLanguage.short === 'te') {
      summary = `వ్యవసాయ వీడియో సారాంశం: ${video.title}. పరిశోధకుడు ${video.expert_name}, ${video.institution} వారు ఈ పద్ధతిని సిఫార్సు చేస్తున్నారు. పంట సంరక్షణ కోసం సరైన సమయంలో మందులు వాడండి.`;
    } else if (currentLanguage.short === 'hi') {
      summary = `कृषि वीडियो सलाह: ${video.title}। विशेषज्ञ ${video.expert_name}, ${video.institution} ने यह महत्वपूर्ण सुझाव दिए हैं। समय पर रोग नियंत्रण करें।`;
    } else {
      summary = `Farming Advisory Tip: ${video.title}. Recommended by ${video.expert_name} from ${video.institution}. Follow these scientific field steps for maximum crop health.`;
    }

    // Ensure any previous speech is stopped before playing new tip.
    stopSpeaking();
    // Use VoiceContext's speak method with fallback handling.
    speak(summary, () => setSpeakingId(null));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center text-2xl shadow-md shadow-red-700/20 shrink-0">
            🎬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {t('nav_videos')}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] bg-red-100 text-red-900 font-extrabold px-2.5 py-0.5 rounded-full border border-red-300">
                <Sparkles className="w-3 h-3 text-red-600" /> ICAR & KVK Verified
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Practical Video Guides by Agricultural Scientists & Extension Officers
            </p>
          </div>
        </div>
      </motion.div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TOPIC_FILTERS.map((topic) => {
          const isSelected = selectedTopic === topic;
          return (
            <motion.button
              key={topic}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-rose-700 text-white shadow-md shadow-rose-800/20 scale-105'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {topic}
            </motion.button>
          );
        })}
      </div>

      {/* Neat Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => {
          const isSpeaking = speakingId === video.id;

          return (
            <motion.div
              key={video.id}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Thumbnail with Play Glow Overlay */}
              <div
                onClick={() => setActiveVideoModal(video)}
                className="relative h-48 w-full overflow-hidden bg-stone-900 cursor-pointer"
              >
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Duration badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20">
                    <Clock className="w-3 h-3 text-amber-400" /> {video.duration}
                  </span>
                </div>

                {/* Crop tag */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white backdrop-blur-md shadow-sm">
                    {tCrop(video.crop || 'Farming')}
                  </span>
                </div>

                {/* Central Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-rose-600/90 group-hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-700/50 backdrop-blur-sm transition-all"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </motion.div>
                </div>

                {/* Topic line */}
                <div className="absolute bottom-2.5 left-3 right-3 text-xs text-amber-200 font-extrabold truncate">
                  {video.topic}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-black text-base text-stone-900 leading-snug line-clamp-2">
                    {video.title}
                  </h3>

                  {/* Expert & Institution */}
                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5 font-bold text-stone-800">
                      <GraduationCap className="w-4 h-4 text-rose-700 shrink-0" />
                      <span>{video.expert_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{video.institution}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <Languages className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{video.language}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setActiveVideoModal(video)}
                    className="py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{t('watch_video_btn')}</span>
                  </button>

                  <button
                    onClick={() => handleListenTip(video)}
                    className={`py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      isSpeaking
                        ? 'bg-amber-400 text-stone-950 border-amber-500 ring-2 ring-amber-300 animate-pulse'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isSpeaking ? t('speaking_now') : t('listen_audio_tip')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
              onClick={() => setActiveVideoModal(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-3xl bg-stone-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-white/10"
            >
              {/* Header */}
              <div className="p-4 bg-stone-950 flex items-center justify-between text-white border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
                  <span className="font-extrabold text-sm truncate max-w-md">
                    {activeVideoModal.title}
                  </span>
                </div>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Simulation / Presentation */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeVideoModal.thumbnail_url}
                  alt={activeVideoModal.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-rose-600/50 mb-3 animate-pulse">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <h4 className="text-lg font-black max-w-md">
                    {activeVideoModal.title}
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 max-w-md">
                    Verified ICAR / KVK Masterclass by {activeVideoModal.expert_name} ({activeVideoModal.institution})
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                      Duration: {activeVideoModal.duration}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-600 text-white">
                      HD 1080p
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Details Footer */}
              <div className="p-5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-stone-400">Presented by:</p>
                  <p className="text-sm font-bold text-white">
                    {activeVideoModal.expert_name} • {activeVideoModal.institution}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleListenTip(activeVideoModal)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('listen_audio_tip')}</span>
                  </button>

                  <button
                    onClick={() => setActiveVideoModal(null)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                  >
                    Close Player
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
