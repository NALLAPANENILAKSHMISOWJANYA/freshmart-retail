import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { cartCount } = useCart();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-[1500px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">

                {/* Logo & Mobile Menu */}
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link to="/home" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <span className="text-2xl">🥦</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
                            Fresh<span className="text-primary">Mart</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Search */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="relative w-full group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={language === 'en' ? "Search for fresh groceries..." : "ताजा किराने का सामान खोजें..."}
                            className="w-full bg-gray-100/50 border border-gray-200 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all group-hover:bg-white"
                        />
                        <button type="submit" className="absolute right-1 top-1 p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                            <Search size={18} />
                        </button>
                    </form>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-full transition-colors text-sm font-medium text-gray-700">
                        <User size={20} />
                        <span>Account</span>
                    </button>

                    <div className="relative">
                        <button className="p-3 hover:bg-primary/5 rounded-full transition-colors relative group">
                            <ShoppingCart size={24} className="text-gray-700 group-hover:text-primary transition-colors" />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search & Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    autoFocus
                                />
                                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-lg">
                                    <Search size={18} />
                                </button>
                            </form>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="p-3 bg-gray-50 rounded-xl text-sm font-medium hover:bg-gray-100 text-left">Account</button>
                                <button className="p-3 bg-gray-50 rounded-xl text-sm font-medium hover:bg-gray-100 text-left">Orders</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
