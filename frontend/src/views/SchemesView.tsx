'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Layers,
  Mic,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GovernmentScheme } from '@/types';
import { AudioPlayerButton } from '@/components/AudioPlayerButton';
import { VoiceMicButton } from '@/components/VoiceMicButton';

export const SchemesView: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/schemes')
      .then((res) => res.json())
      .then((data) => {
        setSchemes(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleVoiceSearch = (transcript: string) => {
    setSearchQuery(transcript);
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/schemes/search/voice?query=${encodeURIComponent(transcript)}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.schemes) {
          setSchemes(res.schemes);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const categories = [
    'All',
    'Cash Support',
    'Equipment Subsidy',
    'Crop Insurance',
    'Solar & Irrigation',
    'Soil Health'
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCat =
      selectedCategory === 'All' ||
      s.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery =
      searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.who_can_benefit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header with Verification Trust Tag */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-700/20">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                {t('nav_schemes')} (ప్రభుత్వ పథకాలు)
              </h1>
              <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full border border-blue-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-700" /> Official Sources Only
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Verified eligibility criteria and direct government application links (Central & State)
            </p>
          </div>
        </div>

        <AudioPlayerButton
          textToSpeak="Welcome to Government Schemes. Discover subsidies for tractors, drip irrigation, solar pumps, and direct income support. All application links are verified official portals."
          size="sm"
        />
      </div>

      {/* Voice Query Bar for Schemes */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-4 border border-blue-200/70 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎙️</span>
          <div>
            <p className="text-xs font-bold text-blue-950">
              Ask about any scheme (నోటితో అడగండి):
            </p>
            <p className="text-[11px] text-stone-600">
              Try: &ldquo;Which scheme helps farmers buy equipment?&rdquo; or &ldquo;How to apply for PM Kisan&rdquo;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {['Tractor Subsidy', 'PM-KISAN ₹6000', 'Solar Pump'].map((q) => (
              <button
                key={q}
                onClick={() => handleVoiceSearch(q)}
                className="px-3 py-1 bg-white hover:bg-blue-100 text-blue-900 text-xs font-semibold rounded-xl border border-blue-200 transition-colors"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
          <VoiceMicButton size="compact" onTranscriptReady={handleVoiceSearch} />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-800/20 scale-105'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Schemes Card List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-stone-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm font-semibold">Retrieving verified government schemes…</p>
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500">
            <p className="text-sm font-bold">No schemes matched your search query.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                fetchSchemes();
              }}
              className="mt-3 text-xs text-blue-700 font-bold underline"
            >
              View All Schemes
            </button>
          </div>
        ) : (
          filteredSchemes.map((scheme) => {
            const isExpanded = expandedId === scheme.id;
            return (
              <div
                key={scheme.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Main Card View */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                          {scheme.category}
                        </span>
                        <span className="text-[11px] text-stone-500 font-semibold">
                          • {scheme.state_applicability}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug">
                        {scheme.title}
                      </h3>
                    </div>

                    <AudioPlayerButton
                      textToSpeak={`${scheme.title}. ${scheme.short_description}. Benefits: ${scheme.financial_benefits}`}
                      size="sm"
                    />
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {scheme.short_description}
                  </p>

                  {/* Financial Benefit Highlight Pill */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3">
                    <span className="text-xl">💰</span>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Direct Financial Benefit
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-emerald-950">
                        {scheme.financial_benefits}
                      </p>
                    </div>
                  </div>

                  {/* Who Can Benefit */}
                  <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                    <strong className="text-stone-900">Who can benefit: </strong>
                    {scheme.who_can_benefit}
                  </div>

                  {/* Accordion Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-bold">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : scheme.id)}
                      className="text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 py-1"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Eligibility, Documents & How to Apply'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <a
                      href={scheme.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Expanded Detailed View */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-stone-200/80 bg-[#fbf9f5] p-5 sm:p-6 space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Eligibility Criteria */}
                        <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                          <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" /> Eligibility Criteria
                          </h4>
                          <ul className="space-y-1.5 text-xs text-stone-700">
                            {scheme.eligibility_criteria.map((ec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{ec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Required Documents */}
                        <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                          <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-blue-600" /> Required Documents (కావాల్సిన పత్రాలు)
                          </h4>
                          <ul className="space-y-1.5 text-xs text-stone-700">
                            {scheme.required_documents.map((doc, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Application Steps */}
                      <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                        <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">
                          How to Apply (దరఖాస్తు విధానం)
                        </h4>
                        <ol className="space-y-2 text-xs text-stone-700">
                          {scheme.application_steps.map((st, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                                {idx + 1}
                              </span>
                              <span className="leading-snug">{st}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Official Verification Footnote */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-200">
                        <span>Source: <strong className="text-stone-800">{scheme.official_source}</strong></span>
                        <span>Verified: <strong className="text-stone-800">{scheme.last_verified_date}</strong></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
