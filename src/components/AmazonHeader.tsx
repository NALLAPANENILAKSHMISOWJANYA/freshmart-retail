import { Search, ShoppingCart, MapPin, Menu, ChevronDown, User } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AmazonHeader = () => {
    const { language, setLanguage, t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="flex flex-col w-full z-50">
            {/* Top Header - Dark Blue */}
            <div className="bg-[#131921] text-white flex items-center p-2 gap-2 h-[60px]">
                {/* Logo */}
                <Link to="/home" className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer mr-1">
                    <span className="text-2xl font-bold tracking-tight">ShopFindMate</span>
                    {/* <span className="text-xs text-orange-400 self-start ml-0.5">.in</span> */}
                </Link>

                {/* Location Picker (Desktop) */}
                <div className="hidden md:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer leading-tight min-w-[80px]">
                    <span className="text-[#ccc] text-xs font-normal ml-3">Deliver to</span>
                    <div className="flex items-center font-bold text-sm">
                        <MapPin size={15} className="mr-0.5" />
                        <span>Hyderabad 500081</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1 flex h-[40px] rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#febd69]">
                    <button className="bg-[#f3f3f3] text-[#555] px-3 text-xs border-r border-[#cdcdcd] hover:bg-[#dadada] hover:text-black flex items-center transition-colors">
                        All <ChevronDown size={10} className="ml-1 fill-current opacity-70" />
                    </button>
                    <form onSubmit={handleSearch} className="flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-full text-black px-3 outline-none text-[15px]"
                            placeholder={t(translations.search)}
                        />
                    </form>
                    <button
                        onClick={handleSearch}
                        className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center transition-colors"
                    >
                        <Search size={22} className="text-[#131921]" />
                    </button>
                </div>

                {/* Language & Account */}
                <div className="flex items-end px-2 py-2 border border-transparent hover:border-white rounded-sm cursor-pointer">
                    <span className="text-sm font-bold flex items-center uppercase">
                        {language === 'en' ? '🇺🇸 EN' : language === 'hi' ? '🇮🇳 HI' : '🇮🇳 TE'}
                        <ChevronDown size={11} className="ml-1 mt-1 text-gray-400" />
                    </span>
                </div>

                <div className="hidden md:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer leading-tight">
                    <span className="text-xs font-normal">Hello, Sign in</span>
                    <span className="text-sm font-bold flex items-center">Account & Lists <ChevronDown size={11} className="ml-1 mt-1 text-gray-400" /></span>
                </div>

                <div className="hidden md:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer leading-tight">
                    <span className="text-xs font-normal">Returns</span>
                    <span className="text-sm font-bold">& Orders</span>
                </div>

                {/* Cart */}
                <div className="flex items-end px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer relative">
                    <div className="relative">
                        <ShoppingCart size={30} />
                        <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-[#f08804] font-bold text-base">0</span>
                    </div>
                    <span className="font-bold text-sm hidden md:inline mb-1">Cart</span>
                </div>
            </div>

            {/* Sub-Header (Navigation) */}
            <div className="bg-[#232f3e] text-white flex items-center px-4 py-1.5 gap-4 overflow-x-auto text-sm font-medium">
                <div className="flex items-center gap-1 cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm whitespace-nowrap">
                    <Menu size={20} /> <span className="font-bold">All</span>
                </div>
                {['Fresh', 'Amazon miniTV', 'Sell', 'Best Sellers', 'Mobiles', 'Today\'s Deals', 'Customer Service', 'Electronics', 'Prime'].map(item => (
                    <span key={item} className="cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm whitespace-nowrap">{item}</span>
                ))}
                {/* Shopping List Integration Placeholder */}
                <div className="ml-auto hidden md:flex items-center text-xs font-normal text-gray-300 hover:text-white cursor-pointer hover:underline">
                    <span>Shopping List configured from ShopFindMate</span>
                </div>
            </div>
        </div>
    );
};

export default AmazonHeader;
