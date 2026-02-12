import { Star, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductProps {
    product: any;
    language: 'en' | 'hi' | 'te';
}

const AmazonProductCard = ({ product, language }: ProductProps) => {
    const navigate = useNavigate();

    return (
        <div
            className="flex gap-4 border border-gray-200 rounded-sm p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/navigate/${product.id}`)}
        >
            {/* Image Container */}
            <div className="w-[180px] h-[180px] flex-shrink-0 bg-gray-100 flex items-center justify-center rounded-sm relative">
                <span className="text-6xl">{product.image}</span>
                {/* Best Seller Badge Simulation */}
                {Math.random() > 0.7 && (
                    <span className="absolute top-0 left-0 bg-[#c45500] text-white text-xs font-bold px-2 py-1 shadow-sm clip-path-badge">
                        Best Seller
                    </span>
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-lg font-medium text-[#0F1111] leading-snug hover:text-[#c7511f] hover:underline mb-1">
                    {product.name[language]} - {product.specs}
                </h3>

                {/* Ratings */}
                <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-[#fea620]">
                        {[1, 2, 3, 4].map(i => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                        <Star size={16} fill="currentColor" strokeWidth={0} className="text-gray-300" />
                    </div>
                    <span className="text-[#007185] text-sm hover:text-[#c7511f] hover:underline cursor-pointer">
                        {Math.floor(Math.random() * 5000) + 100} ratings
                    </span>
                </div>

                {/* Price */}
                <div className="mb-1">
                    <span className="text-xs align-top">₹</span>
                    <span className="text-[28px] font-medium leading-none">499</span>
                    <span className="text-[13px] align-top">00</span>
                    <span className="text-gray-500 text-sm line-through ml-2">M.R.P.: ₹999</span>
                    <span className="text-sm text-[#0F1111] block">({Math.floor(Math.random() * 50) + 10}% off)</span>
                </div>

                {/* Prime / Delivery */}
                <div className="text-sm text-[#565959] mb-1">
                    <span className="text-[#007185] font-bold text-xs flex items-center gap-1">
                        <Check size={12} strokeWidth={4} className="text-[#f90]" />
                        <span className="text-[#00a8e1]">prime</span>
                    </span>
                    <span>Get it by <span className="font-bold text-[#0F1111]">Tomorrow, Feb 10</span></span>
                </div>
                <span className="text-sm text-[#565959]">FREE Delivery by Amazon</span>

                {/* Location Info (Existing App Feature Integration) */}
                <div className="mt-auto pt-2">
                    <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded-md text-gray-700 font-medium border border-gray-300">
                        Aisle {product.location.aisle} • Shelf {product.location.shelf}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AmazonProductCard;
