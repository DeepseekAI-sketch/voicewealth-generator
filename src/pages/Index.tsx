import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { VoiceControls } from '@/components/VoiceControls';
import { MessageCard } from '@/components/MessageCard';
import { getRandomMessage, Message } from '@/data/messages';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [speed, setSpeed] = useState(1.0);
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  const [voiceGender, setVoiceGender] = useState('female');
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { t, language, setLanguage, getTextDirection } = useLanguage();
  const isRTL = getTextDirection() === 'rtl';
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    // When interface language changes, also update voice language
    setVoiceLanguage(language);
    generateNewMessage();
  }, [language]);
  
  useEffect(() => {
    generateNewMessage();
  }, [voiceLanguage]);
  
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const generateNewMessage = () => {
    const newMessage = getRandomMessage(voiceLanguage);
    setCurrentMessage(newMessage);
    
    setRecentMessages(prev => {
      const updatedMessages = [newMessage, ...prev].filter(
        (msg, index, self) => index === self.findIndex(m => m.id === msg.id)
      ).slice(0, 5);
      return updatedMessages;
    });
  };
  
  const playMessage = () => {
    if (!currentMessage) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(currentMessage.text);
    utterance.lang = currentMessage.language;
    utterance.volume = volume;
    utterance.rate = speed;
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Make sure voices are loaded, especially important for Arabic
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoiceAndSpeak(utterance, availableVoices);
      };
    } else {
      setVoiceAndSpeak(utterance, voices);
    }
    
    speechSynthesisRef.current = utterance;
  };
  
  const setVoiceAndSpeak = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) => {
    // Filter voices by language
    const langPrefix = utterance.lang.split('-')[0];
    const languageVoices = voices.filter(voice => voice.lang.includes(langPrefix));
    
    if (languageVoices.length > 0) {
      // Try to find a voice matching the gender preference
      const genderVoices = languageVoices.filter(voice => {
        const voiceName = voice.name.toLowerCase();
        if (voiceGender === 'male') {
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
      } else {
        // If no matching gender voice, use any voice for that language
        utterance.voice = languageVoices[0];
      }
    } else {
      // If no matching language voice found, try to find a more general match
      // For Arabic, sometimes 'ar' isn't directly matched
      if (langPrefix === 'ar') {
        const arabicVoice = voices.find(v => v.lang.includes('ar'));
        if (arabicVoice) utterance.voice = arabicVoice;
      }
    }
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      if (autoRepeat) {
        setTimeout(() => playMessage(), 1000);
      }
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      toast.error("Error playing voice message");
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const pauseMessage = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };
  
  const handleLanguageChange = (newLanguage: string) => {
    pauseMessage();
    setVoiceLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen flex flex-col" dir={getTextDirection()}>
      <Header theme={theme} setTheme={setTheme} />
      
      <main className={`flex-1 pt-24 pb-16 px-4 md:px-6 container mx-auto max-w-5xl ${isRTL ? 'text-right' : ''}`}>
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="text-gradient">{t('appTitle')}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('appDescription')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-8 order-1 md:order-1">
            {currentMessage && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">{t('currentAffirmation')}</h2>
                <MessageCard
                  message={currentMessage.text}
                  language={currentMessage.language}
                  isCurrentMessage={true}
                  isPlaying={isPlaying}
                  onPlay={playMessage}
                  onPause={pauseMessage}
                />
              </div>
            )}
            
            <div className={`flex ${isRTL ? 'justify-center' : 'justify-center'} gap-4`}>
              <button
                onClick={generateNewMessage}
                className="premium-btn bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium shadow-md"
              >
                {t('generateNew')}
              </button>
            </div>
          </div>
          
          <div className="order-2 md:order-2">
            <h2 className="text-xl font-semibold mb-4">{t('voiceSettings')}</h2>
            <VoiceControls
              volume={volume}
              setVolume={setVolume}
              speed={speed}
              setSpeed={setSpeed}
              autoRepeat={autoRepeat}
              setAutoRepeat={setAutoRepeat}
              language={voiceLanguage}
              setLanguage={handleLanguageChange}
              isPlaying={isPlaying}
              voiceGender={voiceGender}
              setVoiceGender={setVoiceGender}
            />
          </div>
        </div>
        
        {recentMessages.length > 1 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">{t('recentAffirmations')}</h2>
            <div className="grid gap-4">
              {recentMessages.slice(1).map((message) => (
                <MessageCard
                  key={message.id}
                  message={message.text}
                  language={message.language}
                  isCurrentMessage={false}
                  isPlaying={false}
                  onPlay={() => {
                    setCurrentMessage(message);
                    setTimeout(playMessage, 100);
                  }}
                  onPause={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t('footer')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
