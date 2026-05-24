import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Grid3X3, LayoutList } from 'lucide-react';
import { useStore, Product } from '../store/useStore';
import ProductCard from '../components/ProductCard';

interface ExplorePageProps {
  onNavigate: (page: string) => void;
  onViewProduct: (product: Product) => void;
}

export default function ExplorePage({ onViewProduct }: ExplorePageProps) {
  const { products, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useStore();
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { key: 'all', label: 'Semua', icon: '🌟' },
    { key: 'fashion', label: 'Fashion', icon: '👗' },
    { key: 'underwear', label: 'Underwear', icon: '🩱' },
    { key: 'perfume', label: 'Parfum', icon: '🌸' },
    { key: 'beauty', label: 'Kecantikan', icon: '✨' },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.published);
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'popular': filtered.sort((a, b) => b.reviews - a.reviews); break;
      default: filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  const shortPrice = (price: number) => {
    if (price >= 1000000) return `Rp${(price / 1000000).toFixed(1)}jt`;
    return formatPrice(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dusty-50/30 to-white w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-dusty-100 via-white to-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Jelajahi Produk
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">Temukan produk yang sempurna untukmu</p>
          
          <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
            <div className="flex-1 flex items-center bg-white rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 shadow-sm border border-dusty-100 focus-within:border-dusty-300 transition-all min-w-0">
              <Search size={16} className="text-dusty-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="flex-1 bg-transparent border-none outline-none ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 placeholder-gray-400 min-w-0"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-1">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border font-medium transition-all flex items-center gap-1.5 flex-shrink-0 text-xs sm:text-sm ${
                showFilters ? 'bg-dusty-500 text-white border-dusty-500' : 'bg-white text-gray-700 border-dusty-100'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 sm:pb-4 mb-4 sm:mb-6 -mx-4 px-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-dusty-500 text-white shadow-md shadow-dusty-200'
                  : 'bg-white text-gray-600 border border-dusty-100 hover:border-dusty-300'
              }`}
            >
              <span className="text-sm sm:text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-dusty-100 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 block">Urutkan</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-dusty-200 bg-white text-xs sm:text-sm text-gray-700 outline-none focus:border-dusty-400">
                  <option value="newest">Terbaru</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="popular">Terpopuler</option>
                </select>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 block">Min: {shortPrice(priceRange[0])}</label>
                <input type="range" min="0" max="2000000" step="50000" value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])} className="w-full accent-dusty-500" />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 block">Max: {shortPrice(priceRange[1])}</label>
                <input type="range" min="0" max="2000000" step="50000" value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full accent-dusty-500" />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filteredProducts.length}</span> produk
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 sm:p-2 rounded-lg ${viewMode === 'grid' ? 'bg-dusty-100 text-dusty-600' : 'text-gray-400'}`}>
              <Grid3X3 size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 sm:p-2 rounded-lg ${viewMode === 'list' ? 'bg-dusty-100 text-dusty-600' : 'text-gray-400'}`}>
              <LayoutList size={16} />
            </button>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onView={onViewProduct} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map(product => (
                <div key={product.id} onClick={() => onViewProduct(product)}
                  className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 shadow-sm hover:shadow-md transition-all p-3 sm:p-4 flex gap-3 sm:gap-4 cursor-pointer">
                  <img src={product.image} alt={product.name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg sm:rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{product.name}</h3>
                    <p className="text-[10px] sm:text-sm text-gray-500 line-clamp-2 mb-1 sm:mb-2">{product.description}</p>
                    <p className="text-base sm:text-lg font-bold text-dusty-600">{shortPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-3">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Tidak ditemukan</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Coba ubah filter atau kata kunci</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-6 py-3 bg-dusty-500 text-white rounded-2xl font-medium hover:bg-dusty-600 text-sm">
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
