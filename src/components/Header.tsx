
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  setTheme: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
}

export function Header({ setTheme, theme }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-8",
        scrolled ? "glass shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-white"></div>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">VoiceWealth</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-foreground" />
            ) : (
              <Sun size={20} className="text-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
