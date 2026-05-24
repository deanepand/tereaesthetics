import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, CreditCard, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';

interface CartPageProps {
  onNavigate: (page: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function CartPage({ onNavigate, showToast }: CartPageProps) {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  const shortPrice = (price: number) => {
    if (price >= 1000000) return `Rp${(price / 1000000).toFixed(1)}jt`;
    return formatPrice(price);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 500000 ? 0 : 25000;
  const total = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'tere10') {
      setPromoApplied(true);
      showToast('Kode promo TERE10 berhasil! Diskon 10% 🎉', 'success');
    } else if (!promoCode) {
      showToast('Masukkan kode promo', 'warning');
    } else {
      showToast('Kode promo tidak valid. Coba: TERE10', 'error');
    }
  };

  const handleCheckout = () => {
    showToast('Pesanan berhasil dibuat! Terima kasih 🛍️', 'success');
    clearCart();
    setPromoApplied(false);
    setPromoCode('');
  };

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    showToast(`${name} dihapus dari keranjang`, 'info');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dusty-50/30 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-dusty-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <ShoppingBag size={32} className="text-dusty-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Keranjang Kosong
          </h2>
          <p className="text-sm text-gray-500 mb-6">Yuk mulai belanja!</p>
          <button onClick={() => onNavigate('explore')} className="px-6 py-3 bg-dusty-500 text-white rounded-2xl font-medium hover:bg-dusty-600 transition-colors shadow-md text-sm">
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dusty-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <button onClick={() => onNavigate('explore')} className="flex items-center gap-2 text-gray-600 hover:text-dusty-600 mb-4 sm:mb-6 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-xs sm:text-sm font-medium">Lanjut Belanja</span>
        </button>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Keranjang ({cart.length})
        </h1>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 p-3 sm:p-5 flex gap-3 sm:gap-4 hover:shadow-md transition-shadow">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg sm:rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.product.name}</h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 capitalize">{item.product.category}</p>
                    </div>
                    <button onClick={() => handleRemove(item.product.id, item.product.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-dusty-600 mt-1 sm:mt-2">{shortPrice(item.product.price)}</p>
                  <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
                    <div className="flex items-center border border-dusty-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1.5 sm:p-2 hover:bg-dusty-50 text-gray-600">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1.5 sm:p-2 hover:bg-dusty-50 text-gray-600">
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">{shortPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => { clearCart(); showToast('Keranjang dikosongkan', 'info'); }} className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium">
              Kosongkan Keranjang
            </button>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 p-4 sm:p-6 sticky top-20 sm:top-24">
              <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Ringkasan Pesanan</h3>
              
              <div className="flex gap-2 mb-4 sm:mb-6">
                <div className="flex-1 flex items-center bg-dusty-50 rounded-lg sm:rounded-xl px-3 py-2 border border-dusty-100">
                  <Tag size={12} className="text-dusty-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Kode promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleApplyPromo(); }}
                    className="flex-1 bg-transparent border-none outline-none ml-2 text-xs sm:text-sm min-w-0"
                  />
                </div>
                <button onClick={handleApplyPromo} className="px-3 sm:px-4 py-2 bg-dusty-100 text-dusty-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-dusty-200 transition-colors flex-shrink-0">
                  Pakai
                </button>
              </div>

              <div className="space-y-2.5 border-b border-dusty-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800 font-medium">{formatPrice(subtotal)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-sage-600">Diskon (TERE10)</span>
                    <span className="text-sage-600 font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Ongkir</span>
                  <span className={shipping === 0 ? 'text-sage-600 font-medium' : 'text-gray-800 font-medium'}>
                    {shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-[10px] sm:text-xs text-sage-600 bg-sage-50 rounded-lg px-2.5 py-1.5">
                    🎉 Gratis ongkir untuk pembelian di atas Rp500.000
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <span className="font-semibold text-gray-800 text-sm">Total</span>
                <span className="text-lg sm:text-xl font-bold text-dusty-600">{formatPrice(total)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 bg-dusty-500 text-white rounded-xl sm:rounded-2xl font-semibold hover:bg-dusty-600 transition-colors shadow-lg shadow-dusty-200 text-sm sm:text-base active:scale-[0.98]"
              >
                <CreditCard size={16} />
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
