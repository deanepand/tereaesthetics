import { ShoppingBag, Heart, Package, CreditCard, ChevronRight, Star, MapPin, Bell, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function DashboardPage({ onNavigate, showToast }: DashboardPageProps) {
  const { user, cart, wishlist, products } = useStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dusty-50 p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-sm">Silakan login untuk melihat dashboard</p>
          <button onClick={() => onNavigate('login')} className="px-6 py-3 bg-dusty-500 text-white rounded-xl font-medium text-sm">
            Login
          </button>
        </div>
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shortPrice = (price: number) => {
    if (price >= 1000000) return `Rp${(price / 1000000).toFixed(1)}jt`;
    if (price >= 1000) return `Rp${(price / 1000).toFixed(0)}rb`;
    return `Rp${price}`;
  };

  const stats = [
    { label: 'Pesanan', value: '3', icon: Package, color: 'bg-dusty-100 text-dusty-600' },
    { label: 'Keranjang', value: cart.length.toString(), icon: ShoppingBag, color: 'bg-sage-100 text-sage-600' },
    { label: 'Wishlist', value: wishlist.length.toString(), icon: Heart, color: 'bg-champagne-100 text-champagne-600' },
    { label: 'Belanja', value: shortPrice(cartTotal), icon: CreditCard, color: 'bg-pink-100 text-pink-600' },
  ];

  const orders = [
    { id: 'ORD-001', date: '15 Mar 2024', status: 'Dikirim', statusColor: 'bg-blue-100 text-blue-700', total: 1250000 },
    { id: 'ORD-002', date: '12 Mar 2024', status: 'Selesai', statusColor: 'bg-green-100 text-green-700', total: 850000 },
    { id: 'ORD-003', date: '10 Mar 2024', status: 'Diproses', statusColor: 'bg-yellow-100 text-yellow-700', total: 450000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dusty-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-dusty-400 to-sage-400 flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-lg shadow-dusty-200 flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate" style={{ fontFamily: 'Georgia, serif' }}>
                Halo, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => showToast('Tidak ada notifikasi baru', 'info')}
              className="p-2.5 rounded-xl bg-white border border-dusty-100 hover:bg-dusty-50 text-gray-600 transition-colors"
            >
              <Bell size={16} />
            </button>
            <button
              onClick={() => showToast('Pengaturan akan segera hadir', 'info')}
              className="p-2.5 rounded-xl bg-white border border-dusty-100 hover:bg-dusty-50 text-gray-600 transition-colors"
            >
              <Settings size={16} />
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-dusty-500 text-white text-xs sm:text-sm font-medium hover:bg-dusty-600 transition-colors"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-dusty-100 hover:shadow-md transition-shadow">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${stat.color} flex items-center justify-center mb-2 sm:mb-3`}>
                <stat.icon size={16} className="sm:w-5 sm:h-5" />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Orders */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-dusty-50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm sm:text-base">Riwayat Pesanan</h2>
                <button
                  onClick={() => showToast('Menampilkan semua pesanan', 'info')}
                  className="text-xs sm:text-sm text-dusty-600 font-medium flex items-center gap-1"
                >
                  Semua <ChevronRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-dusty-50">
                {orders.map(order => (
                  <div key={order.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-dusty-50/30 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-xs sm:text-sm">{order.id}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{order.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${order.statusColor}`}>
                          {order.status}
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-1">{shortPrice(order.total)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Preview */}
            {cart.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-dusty-50 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">Keranjang</h2>
                  <button
                    onClick={() => onNavigate('cart')}
                    className="text-xs text-dusty-600 font-medium flex items-center gap-1"
                  >
                    Lihat <ChevronRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-dusty-50">
                  {cart.slice(0, 3).map(item => (
                    <div key={item.product.id} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{item.product.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-dusty-600 flex-shrink-0">{shortPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-dusty-50/50 flex items-center justify-between">
                  <p className="font-semibold text-gray-700 text-sm">Total</p>
                  <p className="text-base sm:text-lg font-bold text-dusty-600">{shortPrice(cartTotal)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 p-4 sm:p-6">
              <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Profil Saya</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                  <MapPin size={14} className="text-dusty-400 flex-shrink-0" />
                  <span className="text-gray-600">Jakarta, Indonesia</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                  <Star size={14} className="text-champagne-400 flex-shrink-0" />
                  <span className="text-gray-600">{user.role === 'admin' ? 'Gold Member' : 'Silver Member'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                  <Package size={14} className="text-sage-400 flex-shrink-0" />
                  <span className="text-gray-600">3 pesanan selesai</span>
                </div>
              </div>
            </div>

            {wishlist.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Wishlist</h3>
                <div className="space-y-2.5">
                  {wishlist.slice(0, 3).map(id => {
                    const product = products.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={id} className="flex items-center gap-2.5">
                        <img src={product.image} alt={product.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                          <p className="text-[10px] text-dusty-600">{shortPrice(product.price)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-dusty-500 to-sage-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Mulai Belanja!</h3>
              <p className="text-xs sm:text-sm text-white/80 mb-3 sm:mb-4">Jelajahi koleksi terbaru</p>
              <button
                onClick={() => onNavigate('explore')}
                className="w-full py-2.5 bg-white text-dusty-600 rounded-xl font-medium text-xs sm:text-sm hover:bg-dusty-50 transition-colors"
              >
                Jelajahi Produk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
