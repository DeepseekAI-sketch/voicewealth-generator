import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { VoiceControls } from '@/components/VoiceControls';
import { MessageCard } from '@/components/MessageCard';
import { getRandomMessage, Message } from '@/data/messages';

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [speed, setSpeed] = useState(1.0);
  const [language, setLanguage] = useState('en-US');
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    generateNewMessage();
  }, [language]);
  
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const generateNewMessage = () => {
    const newMessage = getRandomMessage(language);
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
    
    speechSynthesisRef.current = utterance;
    
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
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} setTheme={setTheme} />
      
      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 container mx-auto max-w-5xl">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="text-gradient">VoiceWealth</span> Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform powerful energy commands into voice messages to attract wealth and abundance. Based on Newton's concept of Condescension.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-8">
            {currentMessage && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Current Affirmation</h2>
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
            
            <div className="flex justify-center gap-4">
              <button
                onClick={generateNewMessage}
                className="premium-btn bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium shadow-md"
              >
                Generate New Affirmation
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Voice Settings</h2>
            <VoiceControls
              volume={volume}
              setVolume={setVolume}
              speed={speed}
              setSpeed={setSpeed}
              autoRepeat={autoRepeat}
              setAutoRepeat={setAutoRepeat}
              language={language}
              setLanguage={handleLanguageChange}
              isPlaying={isPlaying}
            />
          </div>
        </div>
        
        {recentMessages.length > 1 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Recent Affirmations</h2>
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
          <p>VoiceWealth © {new Date().getFullYear()} • Inspiré par les principes de condescension de Newton</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
