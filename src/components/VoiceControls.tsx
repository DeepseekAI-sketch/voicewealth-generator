
import { useState } from 'react';
import { Volume2, Volume1, VolumeX, Repeat, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceControlsProps {
  volume: number;
  setVolume: (volume: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  autoRepeat: boolean;
  setAutoRepeat: (autoRepeat: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
  isPlaying: boolean;
  voiceGender: string;
  setVoiceGender: (gender: string) => void;
}

const LANGUAGES = [
  { value: 'en-US', label: 'English' },
  { value: 'ar-SA', label: 'العربية' },
  { value: 'fr-FR', label: 'Français' },
];

const VOICE_GENDERS = [
  { value: 'male', labelKey: 'male' },
  { value: 'female', labelKey: 'female' },
];

export function VoiceControls({ 
  volume, 
  setVolume, 
  speed, 
  setSpeed, 
  autoRepeat, 
  setAutoRepeat,
  language,
  setLanguage,
  isPlaying,
  voiceGender,
  setVoiceGender
}: VoiceControlsProps) {
  
  const { t, getTextDirection } = useLanguage();
  const isRTL = getTextDirection() === 'rtl';
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="w-full animate-fade-in">
      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium opacity-80 ${isRTL ? 'ms-auto' : ''}`}>{t('voiceLanguage')}</label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border border-border rounded-lg px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
              dir={getTextDirection()}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 pointer-events-none`}>
              <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium opacity-80 ${isRTL ? 'ms-auto' : ''}`}>{t('voiceGender')}</label>
          <div className="relative">
            <select
              value={voiceGender}
              onChange={(e) => setVoiceGender(e.target.value)}
              className="bg-transparent border border-border rounded-lg px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
              dir={getTextDirection()}
            >
              {VOICE_GENDERS.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {t(gender.labelKey)}
                </option>
              ))}
            </select>
            <div className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 pointer-events-none`}>
              <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium opacity-80 ${isRTL ? 'ms-auto' : ''}`}>{t('volume')}</label>
            <div className="flex items-center">
              <VolumeIcon size={16} className={`${isRTL ? 'ml-2' : 'mr-2'} opacity-70`} />
              <span className="text-xs opacity-70">{Math.round(volume * 100)}%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer focus:outline-none focus:ring focus:ring-primary/30"
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium opacity-80 ${isRTL ? 'ms-auto' : ''}`}>{t('speed')}</label>
            <span className="text-xs opacity-70">{speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer focus:outline-none focus:ring focus:ring-primary/30"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium opacity-80 ${isRTL ? 'ms-auto' : ''}`}>{t('autoRepeat')}</label>
          <button
            onClick={() => setAutoRepeat(!autoRepeat)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              autoRepeat 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <Repeat size={14} />
            {autoRepeat ? t('on') : t('off')}
          </button>
        </div>

        {isPlaying && (
          <div className="pt-2">
            <div className="waveform mx-auto justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`waveform-bar animate-waveform-${i+1}`} 
                  style={{ height: '30%' }}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
