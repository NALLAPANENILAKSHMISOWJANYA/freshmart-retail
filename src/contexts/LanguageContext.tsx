import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '@/data/products';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (translations: Record<Language, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (translations: Record<Language, string>) => translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const translations = {
  welcome: { en: 'Welcome to', hi: 'में आपका स्वागत है', te: 'కు స్వాగతం' },
  findItems: { en: 'Find Your Items Easily', hi: 'अपने सामान आसानी से खोजें', te: 'మీ వస్తువులను సులభంగా కనుగొనండి' },
  search: { en: 'Search for items...', hi: 'सामान खोजें...', te: 'వస్తువులను వెతకండి...' },
  categories: { en: 'Categories', hi: 'श्रेणियाँ', te: 'వర్గాలు' },
  navigateTo: { en: 'Navigate to Item', hi: 'सामान तक जाएं', te: 'వస్తువుకు నావిగేట్ చేయండి' },
  location: { en: 'Location', hi: 'स्थान', te: 'స్థానం' },
  division: { en: 'Division', hi: 'विभाग', te: 'విభాగం' },
  aisle: { en: 'Aisle', hi: 'गलियारा', te: 'ఐల్' },
  shelf: { en: 'Shelf', hi: 'शेल्फ', te: 'షెల్ఫ్' },
  back: { en: 'Back', hi: 'वापस', te: 'వెనుకకు' },
  chatbot: { en: 'Need Help?', hi: 'मदद चाहिए?', te: 'సహాయం కావాలా?' },
  askMe: { en: 'Ask me anything!', hi: 'मुझसे कुछ भी पूछें!', te: 'నన్ను ఏదైనా అడగండి!' },
};
