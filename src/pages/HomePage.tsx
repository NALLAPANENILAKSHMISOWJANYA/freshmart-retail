import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { categories } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';

const HomePage = () => {
  const { language } = useLanguage();
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans text-gray-900">
      <Header />

      <main className="max-w-[1500px] mx-auto">
        {/* Fresh Hero Section */}
        <div className="relative mx-4 md:mx-6 mt-6 rounded-[2rem] overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80"
              alt="Fresh Vegetables"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="p-8 md:p-16 max-w-2xl text-white">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-1.5 bg-green-500/20 backdrop-blur-md rounded-full text-green-300 font-bold text-sm mb-4 border border-green-500/30"
                >
                  100% Organic & Fresh
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                >
                  Fresh Groceries <br /> Delivered to Your Doorstep
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-gray-200 mb-8 max-w-lg"
                >
                  Get farm-fresh vegetables, fruits, and daily essentials delivered in minutes. Quality you can trust.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => navigate('/category/vegetables')}
                  className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-green-600 transition-transform active:scale-95 shadow-lg shadow-green-500/30 flex items-center gap-2"
                >
                  Shop Now <ArrowRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="px-4 md:px-6 py-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Shop by Category</h2>
              <p className="text-gray-500">Explore our wide range of fresh products</p>
            </div>
            <button className="text-primary font-bold hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/category/${category.id}`)}
                className="bg-white rounded-[1.5rem] p-6 text-center shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
              >
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 bg-gradient-to-br ${category.gradient} text-4xl shadow-inner`}>
                  {category.icon}
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors">
                  {category.name[language]}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{category.subcategories.length} Items</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bestsellers / Featured */}
        <div className="px-4 md:px-6 pb-12">
          <div className="bg-primary/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-8">Weekly Best Sellers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl">
                      🍎
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Fresh Red Apple</h4>
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="fill-yellow-400 text-yellow-400" />)}
                      </div>
                      <span className="text-primary font-bold">₹120</span> <span className="text-gray-400 text-xs line-through">₹150</span>
                    </div>
                    <button className="ml-auto p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chatbot (Preserved) */}
      <AnimatePresence>
        {!showChat && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <button
              onClick={() => setShowChat(true)}
              className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center hover:scale-110 transition duration-300"
            >
              <MessageCircle size={24} fill="white" />
            </button>
          </motion.div>
        )}

        {showChat && (
          <motion.div
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            <Chatbot onClose={() => setShowChat(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note: BottomNav is already in App.tsx */}
    </div>
  );
};
import { MessageCircle } from 'lucide-react'; // Added import

export default HomePage;
