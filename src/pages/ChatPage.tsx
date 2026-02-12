import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { searchService, SearchResult } from '@/data/searchService';
import { askGemini } from '@/lib/gemini';

/* ================= TYPES ================= */
interface Message {
    id: number;
    type: 'bot' | 'user';
    content: string;
    results?: SearchResult[];
}

/* ================= HELPER FUNCTIONS ================= */
const getContextualReply = (text: string): string | null => {
    const normalized = text.toLowerCase().trim();

    // Greetings - only match if it's the main intent of the message
    const greetings = ['hi', 'hello', 'hey', 'hii', 'hola', 'namaste'];
    const isGreeting = greetings.some(g => {
        // Match if greeting is at start, is standalone, or is the whole message
        return normalized === g ||
            normalized.startsWith(g + ' ') ||
            normalized.startsWith(g + ',') ||
            normalized.endsWith(' ' + g) ||
            normalized.endsWith(',' + g);
    });

    if (isGreeting && normalized.length < 20) { // Short greeting-focused messages
        return '👋 Hi there! How can I assist you today?\n\nYou can ask me about:\n• Product locations\n• Store hours\n• Payment options\n• Return policy\n• And more!';
    }

    // Store Opening Time
    if ((normalized.includes('open') || normalized.includes('start')) && (normalized.includes('time') || normalized.includes('when') || normalized.includes('hour'))) {
        return '🌅 We open at **9:00 AM** every day. Looking forward to seeing you!';
    }

    // Store Closing Time
    if ((normalized.includes('close') || normalized.includes('shut')) && (normalized.includes('time') || normalized.includes('when') || normalized.includes('hour'))) {
        return '🌙 We close at **10:00 PM** every day. Make sure to visit us before then!';
    }

    // General Store Timings
    if (normalized.includes('timing') || normalized.includes('hour') || normalized.includes('schedule') ||
        (normalized.includes('time') && !normalized.includes('what'))) {
        return '🕘 **FreshMart Store Hours**\n\n📅 Open 7 days a week\n⏰ 9:00 AM - 10:00 PM\n\nCome visit us anytime!';
    }

    // Weekend hours
    if ((normalized.includes('weekend') || normalized.includes('sunday') || normalized.includes('saturday')) &&
        (normalized.includes('open') || normalized.includes('timing') || normalized.includes('hour'))) {
        return '📅 Yes! We are open on weekends too!\n\n⏰ Saturday & Sunday: 9:00 AM - 10:00 PM';
    }

    // Payment - specific methods
    if (normalized.includes('upi') || normalized.includes('google pay') || normalized.includes('phonepe') || normalized.includes('paytm')) {
        return '📱 Yes! We accept all UPI payments:\n• Google Pay ✅\n• PhonePe ✅\n• Paytm ✅\n• BHIM ✅';
    }

    if (normalized.includes('card') || normalized.includes('credit') || normalized.includes('debit')) {
        return '💳 Yes! We accept both:\n• Credit Cards (Visa, Mastercard, RuPay) ✅\n• Debit Cards ✅';
    }

    if (normalized.includes('cash')) {
        return '💵 Yes, we accept cash payments at all counters!';
    }

    // General Payment
    if (normalized.includes('payment') || normalized.includes('pay')) {
        return '💰 **Payment Options**\n\nWe accept:\n• Cash 💵\n• UPI (Google Pay, PhonePe, Paytm) 📱\n• Credit/Debit Cards 💳\n\nChoose what\'s convenient for you!';
    }

    // Parking
    if (normalized.includes('parking') || normalized.includes('park')) {
        return '🚗 **Free Parking Available!**\n\nParking space near the main entrance for:\n• Cars 🚗\n• Bikes 🏍️\n• Bicycles 🚲';
    }

    // Delivery
    if (normalized.includes('deliver') || normalized.includes('home delivery') || normalized.includes('shipping')) {
        return '🚚 **Yes! We offer Home Delivery**\n\n📍 Within 5 km radius\n⏱️ Same-day delivery available\n💰 Free delivery on orders above ₹500';
    }

    // Return Policy
    if (normalized.includes('return') || normalized.includes('refund') || normalized.includes('exchange')) {
        return '↩️ **Easy Returns & Exchanges**\n\n✅ 7-day return policy\n📋 Keep your original bill\n📦 Items should be in original condition\n🔄 Easy exchange available';
    }

    // Customer support/help
    if (normalized.includes('help') || normalized.includes('support') || normalized.includes('staff') || normalized.includes('desk') || normalized.includes('contact')) {
        return '🧑‍💼 **Need Help?**\n\n📍 Our support desk is near the billing counter\n👥 Friendly staff ready to assist\n📞 You can also call us for queries';
    }

    return null;
};

/* ================= COMPONENT ================= */
const ChatPage = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'bot',
            content: "Hello! 👋 I'm your FreshMart AI assistant. I can help you find products, answer questions about our store, and assist with any queries you have!\n\n💡 Try asking:\n• Where is Men Cotton T-Shirt?\n• Store timings?\n• Return policy?\n• What vegetables do you have?",
        },
    ]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const addMessage = (msg: Omit<Message, 'id'>) =>
        setMessages(prev => [...prev, { ...msg, id: Date.now() }]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput('');
        addMessage({ type: 'user', content: userText });

        console.log('User Query:', userText);

        try {
            // 1. Check for contextual replies (store info, greetings, etc.)
            const contextReply = getContextualReply(userText);
            console.log('Contextual Reply:', contextReply);

            if (contextReply) {
                addMessage({ type: 'bot', content: contextReply });
                return;
            }

            // 2. Check for product location queries
            const locationQuery = userText.toLowerCase();
            const isLocationQuestion =
                locationQuery.includes('where') ||
                locationQuery.includes('location') ||
                locationQuery.includes('find') ||
                locationQuery.includes('which aisle') ||
                locationQuery.includes('which floor') ||
                locationQuery.includes('which shelf');

            if (isLocationQuestion) {
                const results = searchService(userText);

                if (results.length > 0) {
                    const productResults = results.filter(r => r.type === 'product');

                    if (productResults.length > 0) {
                        const product = productResults[0].data as any;

                        // Natural language response based on question type
                        let locationResponse = `📍 **${product.name}** can be found at:\n\n`;
                        locationResponse += `🏪 **Aisle:** ${product.aisle}\n`;
                        locationResponse += `📦 **Shelf:** ${product.shelf}\n`;
                        locationResponse += `💰 **Price:** ₹${product.price}\n`;

                        if (product.discount && product.discount !== 'No discount') {
                            locationResponse += `🎉 **Discount:** ${product.discount}\n`;
                        }

                        locationResponse += `\n✅ ${product.availability}`;

                        // If multiple products found
                        if (productResults.length > 1) {
                            locationResponse += `\n\n💡 I found ${productResults.length} items matching "${userText}". Here are the others:`;
                            addMessage({ type: 'bot', content: locationResponse });

                            // Show remaining products
                            addMessage({
                                type: 'bot',
                                content: `Other matching items:`,
                                results: productResults.slice(1, 4) // Show up to 3 more
                            });
                        } else {
                            addMessage({ type: 'bot', content: locationResponse });
                        }
                        return;
                    }
                }

                // If no product found for location query
                addMessage({
                    type: 'bot',
                    content: `🔍 I couldn't find that specific item in our store.\n\nCould you try:\n• Being more specific about the product?\n• Checking the spelling?\n• Or ask me "what products do you have?"`
                });
                return;
            }

            // 3. Search local data (products.json + faqs.json) - for non-location queries
            const results = searchService(userText);

            if (results.length > 0) {
                // Prioritize FAQ
                const faqResult = results.find(r => r.type === 'faq');
                if (faqResult) {
                    addMessage({ type: 'bot', content: `✅ ${faqResult.content}` });
                    return;
                }

                // Show products
                const productResults = results.filter(r => r.type === 'product').slice(0, 5);
                if (productResults.length > 0) {
                    addMessage({
                        type: 'bot',
                        content: `I found ${productResults.length} item(s) for "${userText}":`,
                        results: productResults
                    });
                    return;
                }
            }

            // 4. Fallback to AI for any other query
            setIsLoading(true);
            addMessage({ type: 'bot', content: '🤔 Let me check that for you...' });

            try {
                const aiReply = await askGemini(`
          You are a helpful, friendly FreshMart supermarket assistant. 
          
          User asked: "${userText}"
          
          We couldn't find specific data about this in our inventory or FAQs.
          
          Please provide a helpful response. You can:
          - Suggest products we might have
          - Provide general shopping or grocery tips
          - Answer general questions about shopping
          - Suggest they visit our store for specific items
          - Be conversational and helpful
          
          Keep your response friendly, helpful, and under 80 words.
          Use emojis where appropriate to make it engaging.
        `);

                // Remove the "checking" message
                setMessages(prev => prev.slice(0, -1));

                addMessage({
                    type: 'bot',
                    content: aiReply || "I'm here to help! Try asking about specific products, store timings, or our services. 😊"
                });
            } catch (aiError) {
                console.error('AI Error:', aiError);
                // Remove the "checking" message
                setMessages(prev => prev.slice(0, -1));

                // Provide a helpful fallback even if AI fails
                addMessage({
                    type: 'bot',
                    content: `I'd be happy to help! 😊\n\nI can assist you with:\n• Product locations and prices\n• Store timings (9 AM - 10 PM)\n• Payment methods\n• Return policy\n• Delivery options\n\nWhat would you like to know about "${userText}"?`
                });
            } finally {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setIsLoading(false);
            addMessage({
                type: 'bot',
                content: "I'm here to help! Please ask me about products, store information, or any shopping queries. 🛒"
            });
        }
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col font-sans pb-20">
            {/* Header */}
            <header className="bg-primary text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Bot className="w-6 h-6" />
                    <div>
                        <span className="font-semibold text-lg">FreshMart Assistant</span>
                        <div className="text-xs text-white/80 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI-Powered
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X />
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                                        {msg.results.map((r, idx) => (
                                            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
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

            {/* Input - Fixed at bottom */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sticky bottom-0">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}
                    placeholder="Ask me anything about products, store, or shopping..."
                    disabled={isLoading}
                    className="flex-1 px-5 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-black placeholder:text-gray-400 disabled:opacity-50"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="w-12 h-12 bg-primary hover:bg-green-600 rounded-full text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
