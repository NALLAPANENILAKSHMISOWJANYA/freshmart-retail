import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MapPin } from 'lucide-react';
import { categories, getProductsByCategory, Product } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const category = categories.find(c => c.id === id);
  const products = getProductsByCategory(id || '');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specs.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubcategory = !selectedSubcategory || p.subcategory === selectedSubcategory;
    return matchesSearch && matchesSubcategory;
  });

  if (!category) return <div>Category not found</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`bg-gradient-to-br ${category.gradient} text-white p-6 pb-8 rounded-b-3xl`}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-2xl font-bold">{category.name[language]}</h1>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search in ' + category.name.en : 'खोजें...'}
            className="search-input pl-12"
          />
        </div>
      </header>

      {/* Subcategories */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              !selectedSubcategory ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            {language === 'en' ? 'All' : language === 'hi' ? 'सभी' : 'అన్నీ'}
          </button>
          {category.subcategories.map((sub, i) => (
            <button
              key={i}
              onClick={() => setSelectedSubcategory(sub.en)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedSubcategory === sub.en ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {sub[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-8">
        <p className="text-muted-foreground mb-4">{filteredProducts.length} items</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
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

export default CategoryPage;
