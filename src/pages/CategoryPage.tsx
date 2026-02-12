import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { categories, getProductsByCategory } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const category = categories.find(c => c.id === id);
  const products = getProductsByCategory(id || '');

  const filteredProducts = products.filter(p =>
    !selectedSubcategory || p.subcategory === selectedSubcategory
  );

  if (!category) return <div className="p-10 text-center text-xl font-bold">Category not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">
      <Header />

      {/* Category Header */}
      <div className={`relative pt-12 pb-24 px-6 overflow-hidden bg-gradient-to-br ${category.gradient}`}>
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="max-w-[1500px] mx-auto relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors inline-block"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-4 text-white">
            <span className="text-6xl drop-shadow-md">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.name[language]}</h1>
              <p className="opacity-90 font-medium">{products.length} Products Available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 md:px-6 -mt-12 relative z-20">
        {/* Filter Pills */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-4 mb-2">
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all shadow-sm ${!selectedSubcategory
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            All Items
          </button>
          {category.subcategories.map((sub, i) => (
            <button
              key={i}
              onClick={() => setSelectedSubcategory(sub.en)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all shadow-sm ${selectedSubcategory === sub.en
                  ? 'bg-primary text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              {sub[language]}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500 font-medium">Showing {filteredProducts.length} results</span>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} language={language} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
