import { useSearchParams } from 'react-router-dom';
import { PackageX } from 'lucide-react';
import { searchProducts } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const query = searchParams.get('q') || '';
  const results = searchProducts(query, language);

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">
      <Header />

      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-500 mb-6">Found {results.length} items for <span className="text-primary font-bold">"{query}"</span></p>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <PackageX size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No items found</h3>
            <p className="text-gray-400">Try searching for something else</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} language={language} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
