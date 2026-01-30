import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';
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

  if (!product) return <div className="p-6">Product not found</div>;

  const directions = [
    `Enter from the main entrance`,
    `Go to Division ${product.location.division}`,
    `Move to Aisle ${product.location.aisle}`,
    `Find the item on the ${product.location.shelf} shelf`,
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`bg-gradient-to-br ${
          category?.gradient || 'from-primary to-teal'
        } text-white p-6 rounded-b-3xl`}
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">
            {t(translations.navigateTo)}
          </h1>
        </div>

        <div className="bg-white/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{product.image}</span>
            <div>
              <h2 className="font-semibold text-lg">
                {product.name[language]}
              </h2>
              <p className="text-white/80">{product.specs}</p>
            </div>
          </div>
        </div>
      </header>

      {/* GRID STORE MAP */}
      <div className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin size={20} className="text-primary" />
          Store Map
        </h3>

        <div className="bg-card rounded-2xl p-4 shadow-fresh overflow-x-auto">
          {/* Aisle Header */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div />
            {AISLES.map(aisle => (
              <div
                key={aisle}
                className="text-center text-xs font-semibold text-muted-foreground"
              >
                A{aisle}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="space-y-2">
            {DIVISIONS.map(division => (
              <div key={division} className="grid grid-cols-6 gap-2">
                {/* Division Label */}
                <div className="flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  Div {division}
                </div>

                {AISLES.map(aisle => {
                  const isTarget =
                    product.location.division === division &&
                    Number(product.location.aisle) === aisle;

                  return (
                    <motion.div
                      key={aisle}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`h-16 rounded-xl flex flex-col items-center justify-center text-xs font-medium
                        ${
                          isTarget
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-muted text-muted-foreground'
                        }`}
                    >
                      {isTarget ? (
                        <>
                          <span className="text-lg">📍</span>
                          <span>{product.location.shelf} shelf</span>
                        </>
                      ) : (
                        `Aisle ${aisle}`
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Entrance & Billing */}
          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>🚪 Main Entrance</span>
            <span>💳 Billing Counter</span>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="px-4 pb-4">
        <div className="bg-card rounded-2xl p-4 shadow-fresh">
          <h3 className="font-semibold mb-3">
            {t(translations.location)}
          </h3>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">
                {t(translations.division)}
              </p>
              <p className="text-2xl font-bold text-primary">
                {product.location.division}
              </p>
            </div>

            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">
                {t(translations.aisle)}
              </p>
              <p className="text-2xl font-bold text-primary">
                {product.location.aisle}
              </p>
            </div>

            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">
                {t(translations.shelf)}
              </p>
              <p className="text-lg font-bold text-primary">
                {product.location.shelf}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Directions */}
      <div className="px-4 pb-8">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Navigation size={20} className="text-primary" />
          Directions
        </h3>

        <div className="space-y-3">
          {directions.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-fresh"
            >
              <span className="text-2xl">➡️</span>
              <p className="text-sm">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;
