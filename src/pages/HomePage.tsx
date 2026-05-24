import { ArrowRight, Clock, Star, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onViewProduct: (product: any) => void;
}

export default function HomePage({ onNavigate, onViewProduct }: HomePageProps) {
  const { products, isAuthenticated, user } = useStore();
  const publishedProducts = products.filter(p => p.published);
  const trendingProducts = [...publishedProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  const newArrivals = [...publishedProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  const topRated = [...publishedProducts].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dusty-50/30 to-white w-full overflow-x-hidden">
      {/* Welcome */}
      <section className="relative overflow-hidden bg-gradient-to-r from-dusty-100 via-champagne-50 to-sage-100">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-dusty-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {isAuthenticated ? `Selamat Datang, ${user?.name?.split(' ')[0]}! 👋` : 'Selamat Datang 🌸'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">Temukan produk terbaru dan penawaran spesial</p>
            </div>
            <button onClick={() => onNavigate('explore')} className="flex items-center gap-2 px-5 py-2.5 sm:py-3 bg-dusty-500 text-white rounded-xl sm:rounded-2xl font-medium hover:bg-dusty-600 transition-colors shadow-md text-xs sm:text-sm">
              Jelajahi <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Flash Sale 🔥', title: 'Diskon 50%', desc: 'Koleksi fashion', color: 'from-dusty-400 to-dusty-500' },
            { label: 'New Arrival ✨', title: 'Koleksi Terbaru', desc: 'Parfum terbatas', color: 'from-sage-400 to-sage-500' },
            { label: 'Bundle Deal 🎁', title: 'Beli 2 Gratis 1', desc: 'Produk kecantikan', color: 'from-champagne-400 to-champagne-500' },
          ].map((promo, i) => (
            <button key={i} onClick={() => onNavigate('explore')} className={`bg-gradient-to-br ${promo.color} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg text-left w-full`}>
              <p className="text-[10px] sm:text-sm font-medium text-white/80 mb-0.5 sm:mb-1">{promo.label}</p>
              <p className="text-base sm:text-xl font-bold mb-0.5 sm:mb-1">{promo.title}</p>
              <p className="text-[10px] sm:text-sm text-white/70">{promo.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-dusty-100 flex items-center justify-center">
              <Flame size={16} className="sm:w-5 sm:h-5 text-dusty-500" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Trending</h2>
              <p className="text-[10px] sm:text-sm text-gray-500">Paling diminati</p>
            </div>
          </div>
          <button onClick={() => onNavigate('explore')} className="text-xs sm:text-sm font-medium text-dusty-600 flex items-center gap-1">
            Semua <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} onView={onViewProduct} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sage-100 flex items-center justify-center">
              <Clock size={16} className="sm:w-5 sm:h-5 text-sage-500" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Terbaru</h2>
              <p className="text-[10px] sm:text-sm text-gray-500">Baru ditambahkan</p>
            </div>
          </div>
          <button onClick={() => onNavigate('explore')} className="text-xs sm:text-sm font-medium text-dusty-600 flex items-center gap-1">
            Semua <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} onView={onViewProduct} />
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="pb-12 sm:pb-20 bg-gradient-to-b from-white to-dusty-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-champagne-100 flex items-center justify-center">
                <Star size={16} className="sm:w-5 sm:h-5 text-champagne-500" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Rating Tertinggi</h2>
                <p className="text-[10px] sm:text-sm text-gray-500">Pilihan terbaik</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {topRated.map(product => (
              <ProductCard key={product.id} product={product} onView={onViewProduct} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
