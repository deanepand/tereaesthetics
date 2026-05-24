import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useStore, Product } from '../store/useStore';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
}

export default function ProductCard({ product, onView }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `Rp${(price / 1000000).toFixed(1)}jt`;
    if (price >= 1000) return `Rp${(price / 1000).toFixed(0)}rb`;
    return `Rp${price}`;
  };

  const formatPriceFull = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const categoryLabel: Record<string, string> = {
    fashion: 'Fashion',
    underwear: 'Underwear',
    perfume: 'Parfum',
    beauty: 'Kecantikan',
  };

  const categoryColor: Record<string, string> = {
    fashion: 'bg-dusty-100 text-dusty-700',
    underwear: 'bg-champagne-100 text-champagne-700',
    perfume: 'bg-sage-100 text-sage-700',
    beauty: 'bg-pink-100 text-pink-700',
  };

  return (
    <div
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-dusty-100 hover:border-dusty-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
      onClick={() => onView(product)}
    >
      {/* Image */}
      <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-dusty-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent sm:bg-transparent" />
        
        {/* Wishlist - always visible */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            isWishlisted
              ? 'bg-dusty-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-dusty-500 hover:text-white'
          }`}
        >
          <Heart size={14} className="sm:w-4 sm:h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Category Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold ${categoryColor[product.category]}`}>
            {categoryLabel[product.category]}
          </span>
        </div>

        {/* Mobile: Cart button always visible at bottom */}
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="sm:hidden absolute bottom-2 right-2 w-8 h-8 rounded-full bg-dusty-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <ShoppingBag size={14} />
        </button>

        {/* Desktop: Hover actions */}
        <div className="absolute bottom-3 left-3 right-3 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onView(product); }}
            className="flex-1 py-2.5 bg-white/95 backdrop-blur-sm text-gray-800 rounded-xl text-sm font-medium hover:bg-white transition-colors flex items-center justify-center gap-1.5"
          >
            Lihat
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="flex-1 py-2.5 bg-dusty-500/95 backdrop-blur-sm text-white rounded-xl text-sm font-medium hover:bg-dusty-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={14} />
            Beli
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-dusty-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3">{product.description}</p>
        <div className="flex items-center justify-between gap-1">
          {/* Mobile: shorter price */}
          <p className="text-sm sm:text-base font-bold text-dusty-600 sm:hidden">{formatPrice(product.price)}</p>
          {/* Desktop: full price */}
          <p className="hidden sm:block text-base font-bold text-dusty-600">{formatPriceFull(product.price)}</p>
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Star size={11} className="sm:w-[13px] sm:h-[13px] text-champagne-400 fill-champagne-400" />
            <span className="text-[10px] sm:text-xs font-medium text-gray-600">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
