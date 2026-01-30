import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Navigation, Locate } from 'lucide-react';
import { getProductById, categories } from '@/data/products';
import { useLanguage, translations } from '@/contexts/LanguageContext';

const NavigationPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const product = getProductById(id || '');
  const category = categories.find(c => c.id === product?.category);

  if (!product) return <div className="p-6">Product not found</div>;

  const directions = [
    { icon: '➡️', text: language === 'en' ? 'Enter from main entrance' : language === 'hi' ? 'मुख्य प्रवेश द्वार से प्रवेश करें' : 'ప్రధాన ప్రవేశద్వారం నుండి ప్రవేశించండి' },
    { icon: '⬆️', text: language === 'en' ? `Go straight to Division ${product.location.division}` : language === 'hi' ? `विभाग ${product.location.division} तक सीधे जाएं` : `డివిజన్ ${product.location.division} వరకు నేరుగా వెళ్ళండి` },
    { icon: '↩️', text: language === 'en' ? `Turn left at Aisle ${product.location.aisle}` : language === 'hi' ? `गलियारा ${product.location.aisle} पर बाएं मुड़ें` : `ఐల్ ${product.location.aisle} వద్ద ఎడమకు తిరగండి` },
    { icon: '📍', text: language === 'en' ? `Find item on ${product.location.shelf} shelf` : language === 'hi' ? `${product.location.shelf} शेल्फ पर सामान खोजें` : `${product.location.shelf} షెల్ఫ్‌లో వస్తువు కనుగొనండి` },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`bg-gradient-to-br ${category?.gradient || 'from-primary to-teal'} text-white p-6 rounded-b-3xl`}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{t(translations.navigateTo)}</h1>
        </div>
        <div className="bg-white/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{product.image}</span>
            <div>
              <h2 className="font-semibold text-lg">{product.name[language]}</h2>
              <p className="text-white/80">{product.specs}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Store Map */}
      <div className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin size={20} className="text-primary" />
          {language === 'en' ? 'Store Map' : language === 'hi' ? 'स्टोर मैप' : 'స్టోర్ మ్యాప్'}
        </h3>
        <div className="map-container p-4 h-64 relative">
          {/* Grid Lines */}
          <div className="absolute inset-4 grid grid-cols-6 grid-rows-4 gap-0.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-primary/5 rounded" />
            ))}
          </div>
          
          {/* Division Labels */}
          {['A', 'B', 'C', 'D', 'E', 'F'].map((div, i) => (
            <div
              key={div}
              className="absolute text-xs font-medium text-muted-foreground"
              style={{ left: `${15 + i * 14}%`, top: '4px' }}
            >
              {div}
            </div>
          ))}

          {/* Product Location Marker */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute"
            style={{ left: `${product.location.x}%`, top: `${product.location.y}%` }}
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-primary/30 rounded-full"
              />
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-glow">
                <Locate size={16} />
              </div>
            </div>
          </motion.div>

          {/* Entrance */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-muted-foreground">
            <span>🚪</span>
            {language === 'en' ? 'Entrance' : language === 'hi' ? 'प्रवेश' : 'ప్రవేశం'}
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="px-4 pb-4">
        <div className="bg-card rounded-2xl p-4 shadow-fresh">
          <h3 className="font-semibold mb-3">{t(translations.location)}</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{t(translations.division)}</p>
              <p className="text-2xl font-bold text-primary">{product.location.division}</p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{t(translations.aisle)}</p>
              <p className="text-2xl font-bold text-primary">{product.location.aisle}</p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{t(translations.shelf)}</p>
              <p className="text-lg font-bold text-primary">{product.location.shelf}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Directions */}
      <div className="px-4 pb-8">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Navigation size={20} className="text-primary" />
          {language === 'en' ? 'Directions' : language === 'hi' ? 'दिशा-निर्देश' : 'దిశలు'}
        </h3>
        <div className="space-y-3">
          {directions.map((dir, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-fresh"
            >
              <span className="text-2xl">{dir.icon}</span>
              <p className="text-sm">{dir.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;
