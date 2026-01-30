import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User } from 'lucide-react';
import { categories, searchProducts, Product } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  options?: { label: string; value: string }[];
  products?: Product[];
}

const Chatbot = ({ onClose }: { onClose: () => void }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: language === 'en' 
        ? "Hello! 👋 I'm your FreshMart assistant. What are you looking for today?"
        : language === 'hi' 
        ? "नमस्ते! 👋 मैं आपका FreshMart सहायक हूं। आज आप क्या खोज रहे हैं?"
        : "హలో! 👋 నేను మీ FreshMart సహాయకుడిని. మీరు ఈ రోజు ఏమి వెతుకుతున్నారు?",
      options: categories.map(c => ({ label: `${c.icon} ${c.name[language]}`, value: c.id }))
    }
  ]);
  const [input, setInput] = useState('');

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now() }]);
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    addMessage({ type: 'user', content: `${category.icon} ${category.name[language]}` });
    
    setTimeout(() => {
      addMessage({
        type: 'bot',
        content: language === 'en' 
          ? `Great choice! What type of ${category.name.en.toLowerCase()} are you looking for?`
          : language === 'hi'
          ? `बढ़िया! आप किस प्रकार के ${category.name.hi} खोज रहे हैं?`
          : `మంచి ఎంపిక! మీరు ఏ రకమైన ${category.name.te} కోసం చూస్తున్నారు?`,
        options: category.subcategories.map(sub => ({ label: sub[language], value: `${categoryId}:${sub.en}` }))
      });
    }, 500);
  };

  const handleSubcategorySelect = (value: string) => {
    const [categoryId, subcategory] = value.split(':');
    const products = searchProducts(subcategory, language).slice(0, 5);

    addMessage({ type: 'user', content: subcategory });

    setTimeout(() => {
      addMessage({
        type: 'bot',
        content: language === 'en' 
          ? `Here are some ${subcategory} items. Tap any to navigate:`
          : language === 'hi'
          ? `यहां कुछ ${subcategory} आइटम हैं। नेविगेट करने के लिए टैप करें:`
          : `ఇక్కడ కొన్ని ${subcategory} వస్తువులు ఉన్నాయి. నావిగేట్ చేయడానికి ట్యాప్ చేయండి:`,
        products
      });
    }, 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    addMessage({ type: 'user', content: input });
    const searchResults = searchProducts(input, language).slice(0, 5);
    
    setTimeout(() => {
      if (searchResults.length > 0) {
        addMessage({
          type: 'bot',
          content: language === 'en' 
            ? `Found ${searchResults.length} items matching "${input}":`
            : language === 'hi'
            ? `"${input}" से मिलते ${searchResults.length} आइटम मिले:`
            : `"${input}" కి సరిపోలే ${searchResults.length} వస్తువులు కనుగొనబడ్డాయి:`,
          products: searchResults
        });
      } else {
        addMessage({
          type: 'bot',
          content: language === 'en' 
            ? "Sorry, I couldn't find that item. Try selecting a category:"
            : language === 'hi'
            ? "क्षमा करें, वह आइटम नहीं मिला। एक श्रेणी चुनें:"
            : "క్షమించండి, ఆ వస్తువు కనుగొనబడలేదు. ఒక వర్గాన్ని ఎంచుకోండి:",
          options: categories.slice(0, 6).map(c => ({ label: `${c.icon} ${c.name[language]}`, value: c.id }))
        });
      }
    }, 500);
    
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <header className="bg-gradient-fresh text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-semibold">FreshMart Assistant</h2>
            <p className="text-sm text-white/80">
              {language === 'en' ? 'Online' : language === 'hi' ? 'ऑनलाइन' : 'ఆన్‌లైన్'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-white/20 rounded-full">
          <X size={24} />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`chat-bubble ${msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                <p>{msg.content}</p>
                
                {msg.options && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => opt.value.includes(':') ? handleSubcategorySelect(opt.value) : handleCategorySelect(opt.value)}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {msg.products && (
                  <div className="space-y-2 mt-3">
                    {msg.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => { navigate(`/navigate/${product.id}`); onClose(); }}
                        className="w-full flex items-center gap-3 p-2 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
                      >
                        <span className="text-2xl">{product.image}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name[language]}</p>
                          <p className="text-xs text-muted-foreground">{product.specs} • Aisle {product.location.aisle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'en' ? 'Type a message...' : language === 'hi' ? 'संदेश लिखें...' : 'సందేశం టైప్ చేయండి...'}
            className="flex-1 px-4 py-3 rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;
