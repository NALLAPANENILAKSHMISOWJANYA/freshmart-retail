import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';
import { categories, searchProducts, Product } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { askGemini } from '@/lib/gemini';
import { searchService, SearchResult } from '@/data/searchService';
const normalize = (text: string) =>
  text.toLowerCase().replace(/[?!.,]/g, '').trim();

/* ================= STORE INFO ================= */
const storeInfo = {
  openingTime: '9:00 AM',
  closingTime: '10:00 PM',
  paymentMethods: ['Cash', 'UPI', 'Credit Card', 'Debit Card'],
  parkingAvailable: true,
  supportDesk: 'near the Billing Counter',
};

/* ================= TYPES ================= */
interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  results?: SearchResult[];
  isLoading?: boolean;
}

/* ================= SUPPORT INTENT ================= */
const detectSupportIntent = (raw: string) => {
  const text = normalize(raw);

  // Greetings
  if (['hi', 'hello', 'hey', 'hii', 'hola'].includes(text))
    return 'GREETING';

  // Store timings
  if (
    text === 'timings' ||
    text === 'timing' ||
    text.includes('open') ||
    text.includes('close') ||
    text.includes('hours')
  )
    return 'STORE_TIME';

  // Payment
  if (text.includes('payment') || text.includes('upi') || text.includes('card'))
    return 'PAYMENT';

  // Parking
  if (text.includes('parking'))
    return 'PARKING';

  // Help
  if (text.includes('help') || text.includes('support') || text.includes('staff'))
    return 'HELP';

  return null;
};


const getSupportReply = (intent: string) => {
  switch (intent) {
    case 'GREETING':
      return 'Hi! 😊 How can I help you today?';

    case 'STORE_TIME':
      return '🕘 FreshMart is open from 9:00 AM to 10:00 PM.';

    case 'PAYMENT':
      return '💳 We accept Cash, UPI, Credit Card, and Debit Card.';

    case 'PARKING':
      return '🚗 Parking is available near the entrance.';

    case 'HELP':
      return '🧑‍💼 Our support desk is near the billing counter.';

    default:
      return null;
  }
};


/* ================= COMPONENT ================= */
const Chatbot = ({ onClose }: { onClose: () => void }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Import the legacy search for compatibility or replace it? 
  // We'll use our new searchService. 
  // Note: We need to import it. I will add the import at the top of the file in a separate edit or assume I can do it here if I replace the whole component. 
  // Since I can't easily add imports with replace_file_content on a block, I should probably do a multi_replace or just replace the component and let the user/linter handle imports, OR I can use `multi_replace` to add the import too.
  // Wait, I can't use `multi_replace` effectively if I'm replacing the whole component logic.
  // I will use `replace_file_content` for the component logic.

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! 👋 I'm your FreshMart AI assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState('');

  const addMessage = (msg: Omit<Message, 'id'>) =>
    setMessages(prev => [...prev, { ...msg, id: Date.now() }]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    addMessage({ type: 'user', content: userText });

    // 1. Check intent
    const intent = detectSupportIntent(userText);
    if (intent) {
      const reply = getSupportReply(intent);
      if (reply) {
        addMessage({ type: 'bot', content: reply });
        return;
      }
    }

    // 2. Local Search Service (JSON)
    const results = searchService(userText);

    if (results.length > 0) {
      // Prioritize FAQ if any
      const faqResult = results.find(r => r.type === 'faq');
      if (faqResult) {
        addMessage({ type: 'bot', content: faqResult.content });
        return;
      }

      // Show products
      addMessage({
        type: 'bot',
        content: `I found these items for "${userText}":`,
        results: results
      });
      return;
    }

    // 3. Fallback to Gemini if no local data found (or generic response)
    // The user wants "answers for every query". If local search fails, we can use Gemini or a default.
    // Let's use Gemini as a smart fallback but explicitly mention we checked stock.
    addMessage({ type: 'bot', content: '🤔 Let me check...' });

    try {
      const aiReply = await askGemini(`
        You are a FreshMart assistant. 
        User asked: "${userText}". 
        We couldn't find exact matches in our inventory. 
        Politely suggest checking the spelling or asking about available categories (Clothing, Electronics, Grocery).
        Keep it helpful and short.
      `);

      addMessage({
        type: 'bot',
        content: aiReply || "I couldn't find that item in our store. Try checking the spelling or ask about our categories!"
      });
    } catch (e) {
      addMessage({
        type: 'bot',
        content: "I couldn't find that item. Please try searching for something else."
      });
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 bg-white text-black flex flex-col font-sans h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-primary text-white p-4 flex justify-between items-center shadow-md flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" /> <span className="font-semibold text-lg">FreshMart Assistant</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X /></button>
      </header>

      {/* Messages - scrollable area with proper flex sizing */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl p-4 max-w-[85%] shadow-sm ${msg.type === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
              >
                <p className="leading-relaxed">{msg.content}</p>

                {msg.results && msg.results.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.results.filter(r => r.type === 'product').map((r, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {/* We cast data to any because we know it's JsonProduct but TS might complain if strict */}
                        {r.data && (r.data as any).name ? (
                          <>
                            <div className="font-bold text-primary">{(r.data as any).name}</div>
                            <div className="text-sm text-gray-600">
                              Price: ₹{(r.data as any).price} | Aisle {(r.data as any).aisle} ({(r.data as any).shelf})
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{(r.data as any).description}</div>
                          </>
                        ) : (
                          <div className="text-sm">{r.content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input - pinned to bottom */}
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about products, store timings..."
          className="flex-1 px-5 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-black placeholder:text-gray-400"
        />
        <button
          onClick={handleSend}
          className="w-12 h-12 bg-primary hover:bg-green-600 rounded-full text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default Chatbot;
