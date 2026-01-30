import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MapPin } from 'lucide-react';
import { searchProducts } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);

  const results = searchProducts(searchQuery, language);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-fresh text-white p-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">
            {language === 'en' ? 'Search Results' : language === 'hi' ? 'खोज परिणाम' : 'శోధన ఫలితాలు'}
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input pl-12"
          />
        </div>
      </header>

      <div className="p-4">
        <p className="text-muted-foreground mb-4">{results.length} items found</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {results.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => navigate(`/navigate/${product.id}`)}
              className="product-card cursor-pointer"
            >
              <div className="text-4xl mb-2 text-center">{product.image}</div>
              <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name[language]}</h3>
              <p className="text-xs text-muted-foreground">{product.specs}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                <MapPin size={12} />
                <span>Div {product.location.division}, Aisle {product.location.aisle}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
