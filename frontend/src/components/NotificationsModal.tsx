'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CloudRain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { FarmAlert } from '@/types';
import { AudioPlayerButton } from './AudioPlayerButton';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch('http://127.0.0.1:8000/api/notifications')
        .then((res) => res.json())
        .then((data) => {
          setAlerts(data);
          setLoading(false);
        })
        .catch(() => {
          // Fallback alerts
          setAlerts([
            {
              id: 1,
              type: 'weather',
              severity: 'warning',
              title: 'Heavy Rain Forecasted for Tomorrow',
              message: 'Thunderstorms and heavy rainfall expected in Warangal district. Postpone foliar spraying and fertilizer application.',
              location: 'Warangal, Telangana',
              crop: 'Paddy & Cotton',
              audio_text: 'Weather alert: Heavy rain and thunderstorms expected tomorrow. Do not spray chemicals or fertilizers.',
              created_at: '24 Sep, 18:30'
            },
            {
              id: 2,
              type: 'mandi_spike',
              severity: 'info',
              title: 'Paddy Price Rose to ₹2,380/Quintal',
              message: 'Grade A paddy prices increased by ₹45/qtl at Warangal APMC due to steady mill procurement.',
              location: 'Warangal APMC',
              crop: 'Paddy',
              audio_text: 'Market update: Paddy price reached two thousand three hundred eighty rupees at Warangal market yard.',
              created_at: '24 Sep, 14:15'
            },
            {
              id: 3,
              type: 'pest_outbreak',
              severity: 'critical',
              title: 'KVK Alert: Pink Bollworm Monitoring',
              message: 'Pheromone trap catches in adjoining areas crossed threshold. Inspect your cotton field for rosette flowers.',
              location: 'Telangana Region',
              crop: 'Cotton',
              audio_text: 'Pest alert: Pink bollworm detected in nearby cotton fields. Check your plants and install traps.',
              created_at: '24 Sep, 10:00'
            }
          ]);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getAlertIcon = (type: string, severity: string) => {
    if (type === 'weather') return <CloudRain className="w-5 h-5 text-blue-600" />;
    if (type === 'mandi_spike') return <TrendingUp className="w-5 h-5 text-emerald-600" />;
    return <AlertTriangle className="w-5 h-5 text-amber-600" />;
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'critical') return 'bg-rose-100 text-rose-800 border-rose-300';
    if (severity === 'warning') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-emerald-900/10"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-[#fbf9f4]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">Farm Alerts & Advisories</h3>
                <p className="text-xs text-stone-500">Live notifications for your village and crops</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alert List */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {loading ? (
              <div className="py-12 text-center text-stone-500">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm">Fetching latest agricultural advisories…</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="py-12 text-center text-stone-500">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold">No active warnings</p>
                <p className="text-xs text-stone-400">All weather & pest indicators are normal for your area.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-stone-50 hover:bg-emerald-50/40 rounded-2xl p-4 border border-stone-200/80 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-white shadow-xs">
                        {getAlertIcon(alert.type, alert.severity)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{alert.title}</h4>
                        <span className="text-[11px] text-stone-500">{alert.created_at} • {alert.location}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed my-2">{alert.message}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 mt-2">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Crop: {alert.crop || 'All Crops'}
                    </span>
                    <AudioPlayerButton textToSpeak={alert.audio_text || alert.message} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
