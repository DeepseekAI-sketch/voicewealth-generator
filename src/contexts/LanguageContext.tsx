
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define all the translations for the app
export const translations = {
  'en-US': {
    appTitle: 'Energy Voice',
    appDescription: 'Transform powerful energy commands into voice messages to attract wealth and abundance. Based on Newton\'s concept of Condescension.',
    currentAffirmation: 'Current Affirmation',
    generateNew: 'Generate New Affirmation',
    voiceSettings: 'Voice Settings',
    recentAffirmations: 'Recent Affirmations',
    voiceLanguage: 'Voice Language',
    volume: 'Volume',
    speed: 'Speed',
    autoRepeat: 'Auto Repeat',
    on: 'On',
    off: 'Off',
    play: 'Play',
    pause: 'Pause',
    voiceGender: 'Voice Gender',
    male: 'Male',
    female: 'Female',
    footer: 'Energy Voice © {year} • Inspired by Newton\'s principles of condescension',
  },
  'ar-SA': {
    appTitle: 'صوت الطاقة',
    appDescription: 'حول أوامر الطاقة القوية إلى رسائل صوتية لجذب الثروة والوفرة. استنادًا إلى مفهوم تنازل نيوتن.',
    currentAffirmation: 'التأكيد الحالي',
    generateNew: 'إنشاء تأكيد جديد',
    voiceSettings: 'إعدادات الصوت',
    recentAffirmations: 'التأكيدات الأخيرة',
    voiceLanguage: 'لغة الصوت',
    volume: 'مستوى الصوت',
    speed: 'السرعة',
    autoRepeat: 'تكرار تلقائي',
    on: 'تشغيل',
    off: 'إيقاف',
    play: 'تشغيل',
    pause: 'إيقاف مؤقت',
    voiceGender: 'جنس الصوت',
    male: 'ذكر',
    female: 'أنثى',
    footer: 'صوت الطاقة © {year} • مستوحاة من مبادئ تنازل نيوتن',
  },
  'fr-FR': {
    appTitle: 'Voix Énergétique',
    appDescription: 'Transformez des commandes d\'énergie puissantes en messages vocaux pour attirer richesse et abondance. Basé sur le concept de Condescension de Newton.',
    currentAffirmation: 'Affirmation Actuelle',
    generateNew: 'Générer Nouvelle Affirmation',
    voiceSettings: 'Paramètres Vocaux',
    recentAffirmations: 'Affirmations Récentes',
    voiceLanguage: 'Langue Vocale',
    volume: 'Volume',
    speed: 'Vitesse',
    autoRepeat: 'Répétition Auto',
    on: 'Activé',
    off: 'Désactivé',
    play: 'Lire',
    pause: 'Pause',
    voiceGender: 'Genre de Voix',
    male: 'Masculin',
    female: 'Féminin',
    footer: 'Voix Énergétique © {year} • Inspiré par les principes de condescension de Newton',
  }
};

export type LanguageCode = 'en-US' | 'ar-SA' | 'fr-FR';
type TranslationsType = typeof translations;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: keyof TranslationsType[LanguageCode]) => string;
  getTextDirection: () => 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en-US');

  // Function to get translations
  const t = (key: keyof TranslationsType[LanguageCode]): string => {
    const translationsForLang = translations[language];
    const translation = translationsForLang[key];
    
    if (typeof translation === 'string') {
      // Replace variables in the string
      return translation.replace('{year}', new Date().getFullYear().toString());
    }
    
    return key as string;
  };

  // Function to get text direction based on language
  const getTextDirection = (): 'ltr' | 'rtl' => {
    return language === 'ar-SA' ? 'rtl' : 'ltr';
  };

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = getTextDirection();
    document.documentElement.lang = language.split('-')[0];
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getTextDirection }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
