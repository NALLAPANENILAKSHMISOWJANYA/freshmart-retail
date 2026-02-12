import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Navigation, Info } from 'lucide-react';
import { getProductById, categories } from '@/data/products';
import { useLanguage, translations } from '@/contexts/LanguageContext';

const DIVISIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const AISLES = [1, 2, 3, 4, 5];

const NavigationPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const product = getProductById(id || '');
  const category = categories.find(c => c.id === product?.category);

  if (!product) return <div className="p-10 text-center text-xl font-bold">Product not found</div>;

  const directions = [
    `Enter from the main entrance`,
    `Go to Division ${product.location.division}`,
    `Move to Aisle ${product.location.aisle}`,
    `Find the item on the ${product.location.shelf} shelf`,
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header
        className={`relative bg-gradient-to-br ${category?.gradient || 'from-primary to-teal-600'
          } text-white pt-10 pb-20 px-6 rounded-b-[2.5rem] shadow-lg overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition text-white border border-white/10"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">
            {t(translations.navigateTo)}
          </h1>
        </div>

        {/* Product Card Overlay */}
        <div className="relative z-20 bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg flex items-center gap-4">
          <div className="bg-white/90 w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-sm">
            {product.image}
          </div>
          <div>
            <h2 className="font-bold text-xl leading-tight">
              {product.name[language]}
            </h2>
            <p className="text-white/80 text-sm font-medium">{product.specs}</p>
          </div>
        </div>
      </header>

      {/* Map Section */}
      <div className="px-6 -mt-10 relative z-20">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-white">
              <MapPin size={20} className="text-primary fill-primary/20" />
              Store Map
            </h3>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
              Div {product.location.division} • Aisle {product.location.aisle}
            </span>
          </div>

          <div className="overflow-x-auto pb-2 no-scrollbar">
            <div className="min-w-[300px]">
              {/* Aisle Header */}
              <div className="grid grid-cols-6 gap-2 mb-2 px-1">
                <div />
                {AISLES.map(aisle => (
                  <div key={aisle} className="text-center text-xs font-bold text-gray-400">
                    A{aisle}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="space-y-2">
                {DIVISIONS.map(division => (
                  <div key={division} className="grid grid-cols-6 gap-2">
                    {/* Division Label */}
                    <div className="flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      {division}
                    </div>

                    {AISLES.map(aisle => {
                      const isTarget =
                        product.location.division === division &&
                        Number(product.location.aisle) === aisle;

                      return (
                        <div key={aisle} className="relative">
                          <motion.div
                            initial={false}
                            animate={isTarget ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: isTarget ? Infinity : 0, duration: 2 }}
                            className={`h-12 rounded-xl flex items-center justify-center text-lg shadow-sm border
                              ${isTarget
                                ? 'bg-primary text-white border-primary shadow-md z-10'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-300 border-transparent'
                              }`}
                          >
                            {isTarget ? '📍' : ''}
                          </motion.div>
                          {isTarget && (
                            <div className="absolute inset-0 bg-primary/30 rounded-xl animate-ping opacity-75 -z-10"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Target Location</div>
            <div className="flex items-center gap-1.5">🚪 Main Entrance</div>
            <div className="flex items-center gap-1.5">💳 Billing</div>
          </div>
        </div>
      </div>

      {/* Location Details Cards */}
      <div className="px-6 py-6">
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Location Details</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t(translations.division), value: product.location.division, bg: 'bg-blue-50 text-blue-600' },
            { label: t(translations.aisle), value: product.location.aisle, bg: 'bg-purple-50 text-purple-600' },
            { label: t(translations.shelf), value: product.location.shelf, bg: 'bg-orange-50 text-orange-600' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className={`${item.bg} dark:bg-gray-800 dark:text-gray-200 rounded-2xl p-4 text-center border border-transparent dark:border-gray-700 shadow-sm`}
            >
              <p className="text-xs font-medium opacity-70 mb-1 uppercase tracking-wide">{item.label}</p>
              <p className="text-2xl font-black">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Directions Timeline */}
      <div className="px-6 pb-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
          <Navigation size={20} className="text-primary" />
          Path to Product
        </h3>

        <div className="space-y-0 relative">
          <div className="absolute left-[1.3rem] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          {directions.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="relative flex items-center gap-4 mb-6 last:mb-0"
            >
              <div className={`
                w-11 h-11 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-gray-900 shadow-sm
                ${i === directions.length - 1 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}
              `}>
                <span className="font-bold text-sm">{i + 1}</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="px-6 pb-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 flex gap-3 items-start border border-primary/10">
          <Info size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-primary/80 leading-relaxed font-medium">
            <strong>Pro Tip:</strong> Check the "Best Before" date on the packaging before adding it to your cart.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;
