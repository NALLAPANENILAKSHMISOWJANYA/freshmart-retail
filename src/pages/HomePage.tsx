import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Globe } from 'lucide-react';
import { categories } from '@/data/products';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import Chatbot from '@/components/Chatbot';

const HomePage = () => {
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-fresh text-white p-6 pb-20 rounded-b-[3rem]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛒</span>
            <h1 className="text-2xl font-bold">FreshMart</h1>
          </div>
          <div className="flex gap-1 bg-white/20 rounded-full p-1">
            {(['en', 'hi', 'te'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`lang-toggle ${language === lang ? 'active' : 'text-white/80'}`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : 'తె'}
              </button>
            ))}
          </div>
        </div>
        <h2 className="text-xl mb-4">{t(translations.findItems)}</h2>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(translations.search)}
              className="search-input pl-12"
            />
          </div>
        </form>
      </header>

      {/* Categories Grid */}
      <div className="px-4 -mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/category/${category.id}`)}
              className={`category-card bg-gradient-to-br ${category.gradient} text-white`}
            >
              <span className="text-4xl mb-3 block">{category.icon}</span>
              <h3 className="font-semibold text-lg">{category.name[language]}</h3>
              <p className="text-sm text-white/80 mt-1">
                {category.subcategories.length} {language === 'en' ? 'items' : language === 'hi' ? 'आइटम' : 'వస్తువులు'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-fresh rounded-full shadow-glow flex items-center justify-center text-white"
      >
        <MessageCircle size={28} />
      </motion.button>

      {/* Chatbot */}
      {showChat && <Chatbot onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default HomePage;
