import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductProps {
    product: any;
    language: 'en' | 'hi' | 'te';
}

const ProductCard = ({ product, language }: ProductProps) => {
    const { addToCart, cart } = useCart();
    const navigate = useNavigate();

    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name[language],
            price: 499, // Static price for now
            image: product.image,
            quantity: 1
        });
        toast.success(`${product.name[language]} added to cart!`);
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-[1.5rem] border border-gray-100 p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
            onClick={() => navigate(`/navigate/${product.id}`)}
        >
            {/* Image Area */}
            <div className="relative bg-gray-50 rounded-2xl aspect-square flex items-center justify-center mb-4 overflow-hidden group-hover:bg-primary/5 transition-colors">
                <motion.span
                    className="text-6xl drop-shadow-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {product.image}
                </motion.span>

                {/* Floating Action Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddToCart}
                    className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg transition-all ${quantity > 0
                        ? 'bg-primary text-white'
                        : 'bg-white text-primary hover:bg-primary hover:text-white translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0'
                        }`}
                >
                    {quantity > 0 ? (
                        <div className="flex items-center gap-1 font-bold text-sm px-1">
                            <span>{quantity}</span>
                        </div>
                    ) : (
                        <Plus size={20} />
                    )}
                </motion.button>
            </div>

            {/* Content */}
            <div className="mt-auto">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name[language]}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-md">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-700">4.8</span>
                    </div>
                </div>

                <p className="text-sm text-gray-400 font-medium mb-3">{product.specs}</p>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through">₹999</span>
                        <span className="text-lg font-bold text-gray-900">₹499</span>
                    </div>

                    <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        Fresh
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
