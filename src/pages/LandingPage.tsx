import { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Truck, Star, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onViewProduct: (product: any) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function LandingPage({ onNavigate, onViewProduct, showToast }: LandingPageProps) {
  const { products } = useStore();
  const featuredProducts = products.filter(p => p.featured && p.published).slice(0, 4);
  const [subEmail, setSubEmail] = useState('');

  const categories = [
    { name: 'Fashion', key: 'fashion', icon: '👗', desc: 'Koleksi pakaian elegan', color: 'from-dusty-100 to-dusty-200' },
    { name: 'Underwear', key: 'underwear', icon: '🩱', desc: 'Nyaman & berkualitas', color: 'from-champagne-100 to-champagne-200' },
    { name: 'Parfum', key: 'perfume', icon: '🌸', desc: 'Wangi yang memikat', color: 'from-sage-100 to-sage-200' },
    { name: 'Kecantikan', key: 'beauty', icon: '✨', desc: 'Perawatan premium', color: 'from-pink-100 to-pink-200' },
  ];

  const handleSubscribe = () => {
    if (!subEmail || !subEmail.includes('@')) {
      showToast('Masukkan email yang valid', 'error');
      return;
    }
    showToast('Berhasil subscribe! Terima kasih 🎉', 'success');
    setSubEmail('');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dusty-50 via-white to-sage-50" />
        <div className="absolute top-20 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-dusty-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-sage-200/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-slideUp">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-dusty-100 rounded-full mb-4 sm:mb-6">
                <Sparkles size={12} className="text-dusty-500" />
                <span className="text-[10px] sm:text-xs font-semibold text-dusty-600 tracking-wide uppercase">New Collection 2024</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                Temukan <span className="text-dusty-500">Keindahan</span> dalam Setiap{' '}
                <span className="text-sage-600">Detail</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                Marketplace eksklusif untuk produk fashion, kecantikan, parfum, dan underwear premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => onNavigate('explore')}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-dusty-500 hover:bg-dusty-600 text-white rounded-2xl font-semibold shadow-lg shadow-dusty-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Jelajahi Produk
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-dusty-50 text-dusty-600 rounded-2xl font-semibold border-2 border-dusty-200 transition-all duration-300 text-sm sm:text-base"
                >
                  Daftar Sekarang
                </button>
              </div>
              {/* Stats */}
              <div className="flex gap-6 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-dusty-100">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">10K+</p>
                  <p className="text-xs sm:text-sm text-gray-500">Produk</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">50K+</p>
                  <p className="text-xs sm:text-sm text-gray-500">Pelanggan</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">4.9</p>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-champagne-400 fill-champagne-400" />
                    <p className="text-xs sm:text-sm text-gray-500">Rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image Grid - hidden on mobile, shown on lg */}
            <div className="relative hidden lg:block animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden shadow-2xl shadow-dusty-200/50 aspect-[3/4]">
                    <img src="/images/fashion1.jpg" alt="Fashion" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-xl shadow-sage-200/50 aspect-square">
                    <img src="/images/beauty1.jpg" alt="Beauty" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-3xl overflow-hidden shadow-xl shadow-champagne-200/50 aspect-square">
                    <img src="/images/perfume1.jpg" alt="Perfume" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-2xl shadow-dusty-200/50 aspect-[3/4]">
                    <img src="/images/underwear1.jpg" alt="Underwear" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-3 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sage-100 flex items-center justify-center">
                    <Sparkles size={16} className="text-sage-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Best Seller</p>
                    <p className="text-xs text-gray-500">500+ terjual</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile hero image */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mt-2">
              <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                <img src="/images/fashion1.jpg" alt="Fashion" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                <img src="/images/perfume1.jpg" alt="Perfume" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Jelajahi Kategori
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Temukan produk impianmu dari berbagai kategori pilihan
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  useStore.getState().setSelectedCategory(cat.key);
                  onNavigate('explore');
                }}
                className={`group relative p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${cat.color} hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-left`}
              >
                <span className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 block">{cat.icon}</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-0.5 sm:mb-1">{cat.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">{cat.desc}</p>
                <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-dusty-600">
                  Lihat <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-dusty-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                Produk Unggulan
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Pilihan terbaik dari koleksi kami</p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 border-2 border-dusty-200 hover:border-dusty-300 rounded-2xl text-dusty-600 font-medium hover:bg-dusty-50 transition-all text-sm"
            >
              Lihat Semua <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onView={onViewProduct} />
            ))}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 bg-dusty-500 text-white rounded-2xl font-medium text-sm"
            >
              Lihat Semua Produk
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: Truck, title: 'Gratis Ongkir', desc: 'Pembelian di atas Rp500.000' },
              { icon: Shield, title: 'Garansi Keaslian', desc: '100% original dan premium' },
              { icon: Sparkles, title: 'Layanan Premium', desc: 'Customer service 24/7' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl hover:bg-dusty-50/50 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-dusty-100 to-sage-100 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={18} className="sm:w-[22px] sm:h-[22px] text-dusty-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-0.5">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-dusty-500 via-dusty-400 to-sage-400">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Bergabunglah dengan Komunitas Kami
          </h2>
          <p className="text-dusty-100 text-sm sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Dapatkan akses eksklusif ke koleksi terbaru dan promo spesial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan email kamu"
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubscribe(); }}
              className="flex-1 px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 outline-none focus:bg-white/30 transition-colors text-sm"
            />
            <button
              onClick={handleSubscribe}
              className="px-6 py-3 sm:py-3.5 bg-white text-dusty-600 rounded-xl sm:rounded-2xl font-semibold hover:bg-dusty-50 transition-colors shadow-lg text-sm"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
