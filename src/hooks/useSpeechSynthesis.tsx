
import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechSynthesisOptions {
  text: string;
  lang: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
  gender?: 'male' | 'female';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synth = window.speechSynthesis;
  
  // Initialize and load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };
    
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
    
    return () => {
      synth.cancel();
    };
  }, []);
  
  // Set up speech synthesis
  const speak = useCallback(({ 
    text, 
    lang, 
    rate = 1, 
    pitch = 1, 
    volume = 1, 
    voice,
    gender = 'female',
    onStart, 
    onEnd, 
    onError 
  }: SpeechSynthesisOptions) => {
    if (!synth) return;
    
    // Cancel any ongoing speech
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    // Set voice based on language and gender preference
    const langVoices = voices.filter(v => v.lang.includes(lang.split('-')[0]));
    
    if (langVoices.length > 0) {
      // Try to find a voice matching the gender preference
      const genderVoices = langVoices.filter(v => {
        const voiceName = v.name.toLowerCase();
        if (gender === 'male') {
          return !voiceName.includes('female') && 
                 (voiceName.includes('male') || 
                  voiceName.includes('guy') || 
                  voiceName.includes('man'));
        } else {
          return voiceName.includes('female') || 
                 voiceName.includes('woman') || 
                 voiceName.includes('girl');
        }
      });
      
      if (genderVoices.length > 0) {
        utterance.voice = genderVoices[0];
      } else if (voice) {
        // If a specific voice was requested, try to find it
        const selectedVoice = voices.find(v => v.name === voice);
        if (selectedVoice) utterance.voice = selectedVoice;
        else utterance.voice = langVoices[0];
      } else {
        // If no matching gender voice, use any voice for that language
        utterance.voice = langVoices[0];
      }
    }
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      if (onStart) onStart();
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (onEnd) onEnd();
    };
    
    utterance.onerror = (event) => {
      setIsPlaying(false);
      if (onError) onError(event);
    };
    
    utteranceRef.current = utterance;
    
    // Fix for some browsers needing a slight delay
    setTimeout(() => {
      synth.speak(utterance);
    }, 50);
    
    return utterance;
  }, [voices]);
  
  const pause = useCallback(() => {
    if (synth && isPlaying) {
      synth.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, [isPlaying]);
  
  const resume = useCallback(() => {
    if (synth && isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  }, [isPaused]);
  
  const cancel = useCallback(() => {
    if (synth) {
      synth.cancel();
      setIsPaused(false);
      setIsPlaying(false);
    }
  }, []);
  
  const getVoicesForLanguage = useCallback((lang: string) => {
    return voices.filter(voice => voice.lang.includes(lang.split('-')[0]));
  }, [voices]);
  
  return {
    voices,
    speak,
    pause,
    resume,
    cancel,
    isPlaying,
    isPaused,
    getVoicesForLanguage
  };
};
