import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { VoiceProvider } from '@/context/VoiceContext';
import { VoicePhaseBanner } from '@/components/VoicePhaseBanner';

export const metadata: Metadata = {
  title: 'Krishi Raksha AI - Multilingual Digital Assistant for Farmers',
  description:
    'Voice-first, multilingual, visual AI assistant for farmers in India. Crop doctor, APMC mandi prices, government schemes, and weather alerts in your mother tongue.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#fbf9f4] text-stone-900 antialiased selection:bg-emerald-200">
        <LanguageProvider>
          <VoiceProvider>
            <VoicePhaseBanner />
            {children}
          </VoiceProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
