import { motion } from 'framer-motion';
import { Product } from '@/data/products';

interface StoreMapProps {
  product: Product;
}

const divisions = [
  'A','B','C','D','E','F',
  'G','H','I','J','K','L'
];

const StoreMap = ({ product }: StoreMapProps) => {
  return (
    <div className="relative w-full h-[420px] bg-muted rounded-2xl overflow-hidden border">

      {/* Entrance */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-semibold bg-white px-3 py-1 rounded-full shadow">
        🚪 Main Entrance
      </div>

      {/* Division Labels */}
      {divisions.map((div, i) => (
        <div
          key={div}
          className="absolute left-1 text-[10px] text-muted-foreground"
          style={{ top: `${10 + i * 7}%` }}
        >
          Division {div}
        </div>
      ))}

      {/* Aisle Lines */}
      {[1,2,3,4,5].map((aisle) => (
        <div
          key={aisle}
          className="absolute top-8 bottom-4 w-[2px] bg-border"
          style={{ left: `${aisle * 18}%` }}
        >
          <span className="absolute -top-4 -left-3 text-xs">
            A{aisle}
          </span>
        </div>
      ))}

      {/* Product Marker */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="absolute z-10"
        style={{
          left: `${product.location.x}%`,
          top: `${product.location.y}%`,
        }}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
            📍
          </div>
          <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-white text-xs px-2 py-1 rounded shadow">
            {product.name.en}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreMap;
