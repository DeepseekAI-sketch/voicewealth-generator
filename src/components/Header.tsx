
import { useState, useEffect } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage, LanguageCode } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  setTheme: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
}

export function Header({ setTheme, theme }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, getTextDirection } = useLanguage();
  const isRTL = getTextDirection() === 'rtl';
  
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

  const languageOptions = [
    { code: 'en-US', label: 'English' },
    { code: 'ar-SA', label: 'العربية' },
    { code: 'fr-FR', label: 'Français' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-8",
        scrolled ? "glass shadow-md" : "bg-transparent"
      )}
      dir={getTextDirection()}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-white"></div>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Energy Voice</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Change language"
              >
                <Globe size={20} className="text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"}>
              {languageOptions.map((option) => (
                <DropdownMenuItem
                  key={option.code}
                  onClick={() => setLanguage(option.code as LanguageCode)}
                  className={language === option.code ? "bg-secondary/60" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
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
