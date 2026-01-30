import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';
import { categories, searchProducts, Product } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { askGemini } from '@/lib/gemini';
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
  products?: Product[];
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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! 👋 I'm your FreshMart AI assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addMessage = (msg: Omit<Message, 'id'>) =>
    setMessages(prev => [...prev, { ...msg, id: Date.now() }]);

  const handleSend = async () => {
  if (!input.trim()) return;

  const userText = input;
  const normalized = normalize(userText);

  setInput('');
  addMessage({ type: 'user', content: userText });

  /* 1️⃣ GREETING / SUPPORT FIRST */
  const intent = detectSupportIntent(userText);
  if (intent) {
    const reply = getSupportReply(intent);
    if (reply) {
      addMessage({ type: 'bot', content: reply });
      return; // ⛔ STOP HERE
    }
  }

  /* 2️⃣ IGNORE MEANINGLESS SHORT INPUTS */
  if (normalized.length <= 2) {
    addMessage({
      type: 'bot',
      content: "Could you please tell me what you're looking for? 😊",
    });
    return;
  }

  /* 3️⃣ PRODUCT SEARCH (ONLY NOW) */
  const results = searchProducts(userText, language).slice(0, 5);
  if (results.length > 0) {
    addMessage({
      type: 'bot',
      content: `I found ${results.length} items related to "${userText}":`,
      products: results,
    });
    return;
  }

  /* 4️⃣ GEMINI — LAST RESORT ONLY */
  addMessage({ type: 'bot', content: '🤖 Let me think…' });

  const aiReply = await askGemini(`
You are a customer support assistant for a supermarket named FreshMart.
If the user greets, greet back.
If unsure, suggest asking about products or store timings.
Keep replies short.

User: "${userText}"
`);

  addMessage({
    type: 'bot',
    content: aiReply || "I'm here to help! Try asking about products or store info.",
  });
};


  return (
    <motion.div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-fresh text-white p-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Bot /> <span className="font-semibold">FreshMart AI Assistant</span>
        </div>
        <button onClick={onClose}><X /></button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="bg-card rounded-xl p-3 max-w-[75%]">
                <p>{msg.content}</p>

                {msg.products && (
                  <div className="mt-2 space-y-2">
                    {msg.products.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { navigate(`/navigate/${p.id}`); onClose(); }}
                        className="block text-left w-full bg-white rounded p-2"
                      >
                        <b>{p.name[language]}</b> — Aisle {p.location.aisle}
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
      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything..."
          className="flex-1 px-4 py-3 rounded-full bg-muted"
        />
        <button
          onClick={handleSend}
          className="w-12 h-12 bg-primary rounded-full text-white flex items-center justify-center"
        >
          <Send />
        </button>
      </div>
    </motion.div>
  );
};

export default Chatbot;
