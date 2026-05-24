import { useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Star, Minus, Plus, Shield, Truck, RotateCcw, Share2 } from 'lucide-react';
import { useStore, Product } from '../store/useStore';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: string) => void;
  onViewProduct: (product: Product) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function ProductDetailPage({ product, onNavigate, onViewProduct, showToast }: ProductDetailPageProps) {
  const { addToCart, wishlist, toggleWishlist, products } = useStore();
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = wishlist.includes(product.id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const categoryLabel: Record<string, string> = {
    fashion: 'Fashion', underwear: 'Underwear', perfume: 'Parfum', beauty: 'Kecantikan',
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id && p.published)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    showToast(`${product.name} ditambahkan ke keranjang (${quantity}x)`, 'success');
  };

  const handleShare = async () => {
    const text = `Lihat ${product.name} di Tere Aesthetics - ${formatPrice(product.price)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard?.writeText(text);
      showToast('Link produk disalin!', 'info');
    }
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    showToast(
      isWishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist ❤️',
      isWishlisted ? 'info' : 'success'
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <button
          onClick={() => onNavigate('explore')}
          className="flex items-center gap-2 text-gray-600 hover:text-dusty-600 mb-4 sm:mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-xs sm:text-sm font-medium">Kembali</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image */}
          <div>
            <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-dusty-50">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-dusty-100 text-dusty-700 mb-2 sm:mb-3">
                {categoryLabel[product.category]}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.round(product.rating) ? 'text-champagne-400 fill-champagne-400' : 'text-gray-200 fill-gray-200'} />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600">{product.rating}</span>
                <span className="text-xs sm:text-sm text-gray-400">({product.reviews} ulasan)</span>
              </div>
            </div>

            <div className="border-t border-b border-dusty-100 py-4 sm:py-6">
              <p className="text-2xl sm:text-3xl font-bold text-dusty-600">{formatPrice(product.price)}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Stok: <span className={product.stock > 0 ? 'text-sage-600 font-medium' : 'text-red-500'}>{product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}</span>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Deskripsi</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Jumlah</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center border border-dusty-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 sm:p-3 hover:bg-dusty-50 text-gray-600 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-10 sm:w-12 text-center font-semibold text-gray-800 text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2.5 sm:p-3 hover:bg-dusty-50 text-gray-600 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">Total: <strong className="text-dusty-600">{formatPrice(product.price * quantity)}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-dusty-500 text-white rounded-xl sm:rounded-2xl font-semibold hover:bg-dusty-600 transition-colors shadow-lg shadow-dusty-200 text-sm sm:text-base active:scale-[0.98]"
              >
                <ShoppingBag size={18} />
                <span className="hidden xs:inline">Tambah ke </span>Keranjang
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all active:scale-95 ${
                  isWishlisted ? 'bg-dusty-50 border-dusty-300 text-dusty-500' : 'border-dusty-200 text-gray-500 hover:border-dusty-300'
                }`}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-dusty-200 text-gray-500 hover:border-dusty-300 transition-all active:scale-95"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-4">
              {[
                { icon: Truck, label: 'Gratis Ongkir' },
                { icon: Shield, label: '100% Original' },
                { icon: RotateCcw, label: 'Easy Return' },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center p-2 sm:p-3 bg-dusty-50/50 rounded-lg sm:rounded-xl">
                  <f.icon size={16} className="text-dusty-400 mb-1" />
                  <span className="text-[10px] sm:text-xs font-medium text-gray-600">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 sm:mt-16 pb-6 sm:pb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Produk Serupa
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => onViewProduct(p)}
                  className="cursor-pointer group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-dusty-100 hover:shadow-lg transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-dusty-50">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-2.5 sm:p-3">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                    <p className="text-xs sm:text-sm font-bold text-dusty-600 mt-1">{formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
