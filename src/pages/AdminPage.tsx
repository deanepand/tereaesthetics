import { useState, useRef } from 'react';
import { 
  Plus, Edit3, Trash2, Eye, EyeOff, Upload, Package, 
  BarChart3, Users, DollarSign, TrendingUp, Search, Image as ImageIcon,
  Save, ArrowLeft
} from 'lucide-react';
import { useStore, Product } from '../store/useStore';

interface AdminPageProps {
  onNavigate: (page: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

type AdminView = 'dashboard' | 'products' | 'create' | 'edit';

export default function AdminPage({ onNavigate, showToast }: AdminPageProps) {
  const { user, products, addProduct, updateProduct, deleteProduct, togglePublish } = useStore();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'fashion' as Product['category'],
    stock: '', image: '/images/fashion1.jpg', published: true, featured: false, seller: 'Tere Aesthetics',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dusty-50 p-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-xs w-full">
          <div className="text-4xl sm:text-5xl mb-4">🔒</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Akses Ditolak</h2>
          <p className="text-sm text-gray-500 mb-4">Anda tidak memiliki akses admin</p>
          <button onClick={() => onNavigate('home')} className="px-6 py-3 bg-dusty-500 text-white rounded-xl font-medium text-sm w-full">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const shortPrice = (price: number) => {
    if (price >= 1000000000) return `Rp${(price / 1000000000).toFixed(1)}M`;
    if (price >= 1000000) return `Rp${(price / 1000000).toFixed(1)}jt`;
    if (price >= 1000) return `Rp${(price / 1000).toFixed(0)}rb`;
    return `Rp${price}`;
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.price * (p.reviews || 1), 0);
  const totalProducts = products.length;
  const publishedCount = products.filter(p => p.published).length;

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const categoryImages: Record<string, string> = {
    fashion: '/images/fashion1.jpg', underwear: '/images/underwear1.jpg',
    perfume: '/images/perfume1.jpg', beauty: '/images/beauty1.jpg',
  };

  const categoryLabel: Record<string, string> = {
    fashion: 'Fashion', underwear: 'Underwear', perfume: 'Parfum', beauty: 'Kecantikan',
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setPreviewImage(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: 'fashion', stock: '', image: '/images/fashion1.jpg', published: true, featured: false, seller: 'Tere Aesthetics' });
    setPreviewImage(null);
  };

  const handleCreate = () => { resetForm(); setActiveView('create'); };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, description: product.description, price: product.price.toString(), category: product.category, stock: product.stock.toString(), image: product.image, published: product.published, featured: product.featured, seller: product.seller });
    setPreviewImage(product.image);
    setActiveView('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      showToast('Harap isi semua field yang wajib', 'error');
      return;
    }
    if (activeView === 'create') {
      addProduct({
        name: formData.name, description: formData.description,
        price: parseInt(formData.price) || 0, category: formData.category,
        stock: parseInt(formData.stock) || 0,
        image: formData.image || categoryImages[formData.category],
        images: [formData.image || categoryImages[formData.category]],
        published: formData.published, featured: formData.featured, seller: formData.seller,
      });
      showToast('Produk berhasil ditambahkan! ✨', 'success');
    } else if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name, description: formData.description,
        price: parseInt(formData.price) || 0, category: formData.category,
        stock: parseInt(formData.stock) || 0,
        image: formData.image || categoryImages[formData.category],
        images: [formData.image || categoryImages[formData.category]],
        published: formData.published, featured: formData.featured, seller: formData.seller,
      });
      showToast('Produk berhasil diperbarui!', 'success');
    }
    setActiveView('products');
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setShowDeleteConfirm(null);
    showToast('Produk berhasil dihapus', 'info');
  };

  const handleTogglePublish = (product: Product) => {
    togglePublish(product.id);
    showToast(product.published ? `${product.name} di-draft` : `${product.name} dipublish`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className="flex min-h-screen">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:flex lg:flex-col w-60 min-h-screen bg-white border-r border-dusty-100 p-5 flex-shrink-0">
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>Admin Panel</h2>
            <p className="text-xs text-gray-500 truncate">{user.name}</p>
          </div>
          <nav className="space-y-1 flex-1">
            {[
              { key: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { key: 'products', icon: Package, label: 'Produk' },
              { key: 'create', icon: Plus, label: 'Tambah Produk' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => { if (item.key === 'create') handleCreate(); else setActiveView(item.key as AdminView); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeView === item.key ? 'bg-dusty-100 text-dusty-700' : 'text-gray-600 hover:bg-dusty-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            <hr className="my-3 border-dusty-100" />
            <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-dusty-50">
              <ArrowLeft size={16} />
              Kembali ke Toko
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-8">
          {/* Mobile tabs */}
          <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { key: 'dashboard', label: '📊 Dashboard' },
              { key: 'products', label: '📦 Produk' },
              { key: 'create', label: '➕ Tambah' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => { if (item.key === 'create') handleCreate(); else setActiveView(item.key as AdminView); }}
                className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap ${
                  activeView === item.key ? 'bg-dusty-500 text-white' : 'bg-white text-gray-600 border border-dusty-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={() => onNavigate('home')} className="px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap bg-white text-gray-600 border border-dusty-100">
              🏠 Toko
            </button>
          </div>

          {/* Dashboard */}
          {activeView === 'dashboard' && (
            <div className="animate-fadeIn">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>Dashboard</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  { label: 'Total Produk', value: totalProducts.toString(), icon: Package, color: 'from-dusty-400 to-dusty-500' },
                  { label: 'Published', value: publishedCount.toString(), icon: Eye, color: 'from-sage-400 to-sage-500' },
                  { label: 'Pelanggan', value: '1.2K', icon: Users, color: 'from-champagne-400 to-champagne-500' },
                  { label: 'Revenue', value: shortPrice(totalRevenue), icon: DollarSign, color: 'from-pink-400 to-pink-500' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl p-3 sm:p-5 text-white`}>
                    <stat.icon size={18} className="mb-2 opacity-80" />
                    <p className="text-lg sm:text-2xl font-bold truncate">{stat.value}</p>
                    <p className="text-[10px] sm:text-sm text-white/80">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 p-4 sm:p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Produk per Kategori</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {(['fashion', 'underwear', 'perfume', 'beauty'] as const).map(cat => {
                    const count = products.filter(p => p.category === cat).length;
                    const percent = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
                    return (
                      <div key={cat} className="p-3 rounded-lg sm:rounded-xl bg-dusty-50/50">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">{categoryLabel[cat]}</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{count}</p>
                        <div className="mt-1.5 w-full bg-dusty-100 rounded-full h-1.5">
                          <div className="bg-dusty-400 h-1.5 rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{percent}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-dusty-50 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Produk Terbaru</h3>
                  <button onClick={() => setActiveView('products')} className="text-xs sm:text-sm text-dusty-600 font-medium">Semua</button>
                </div>
                <div className="divide-y divide-dusty-50">
                  {products.slice(0, 5).map(product => (
                    <div key={product.id} className="px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{categoryLabel[product.category]}</p>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-dusty-600 flex-shrink-0">{shortPrice(product.price)}</p>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${product.published ? 'bg-green-400' : 'bg-gray-300'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products List */}
          {activeView === 'products' && (
            <div className="animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Kelola Produk</h1>
                <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2.5 bg-dusty-500 text-white rounded-xl font-medium hover:bg-dusty-600 transition-colors shadow-md text-xs sm:text-sm w-full sm:w-auto justify-center">
                  <Plus size={16} />
                  Tambah Produk
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-2.5 border border-dusty-100">
                  <Search size={16} className="text-gray-400 flex-shrink-0" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari produk..." className="flex-1 bg-transparent border-none outline-none ml-2 text-xs sm:text-sm min-w-0" />
                </div>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2.5 bg-white rounded-xl border border-dusty-100 text-xs sm:text-sm text-gray-700 outline-none">
                  <option value="all">Semua</option>
                  <option value="fashion">Fashion</option>
                  <option value="underwear">Underwear</option>
                  <option value="perfume">Parfum</option>
                  <option value="beauty">Kecantikan</option>
                </select>
              </div>

              {/* Mobile cards / Desktop table */}
              <div className="hidden sm:block bg-white rounded-2xl border border-dusty-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-dusty-50/50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Produk</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Kategori</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Harga</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Stok</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Status</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dusty-50">
                      {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-dusty-50/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-gray-800 text-sm truncate max-w-[150px]">{product.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-dusty-100 text-dusty-700">{categoryLabel[product.category]}</span>
                          </td>
                          <td className="px-4 py-3"><p className="text-sm font-semibold text-gray-800">{shortPrice(product.price)}</p></td>
                          <td className="px-4 py-3 hidden md:table-cell"><p className="text-sm text-gray-600">{product.stock}</p></td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <button onClick={() => handleTogglePublish(product)} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${product.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {product.published ? <Eye size={11} /> : <EyeOff size={11} />}
                              {product.published ? 'Live' : 'Draft'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleEdit(product)} className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600"><Edit3 size={14} /></button>
                              <button onClick={() => setShowDeleteConfirm(product.id)} className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-10"><Package size={32} className="mx-auto text-gray-300 mb-2" /><p className="text-sm text-gray-500">Tidak ada produk</p></div>
                )}
              </div>

              {/* Mobile card list */}
              <div className="sm:hidden space-y-3">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-xl border border-dusty-100 p-3 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                      <p className="text-xs text-dusty-600 font-semibold">{shortPrice(product.price)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${product.published ? 'bg-green-400' : 'bg-gray-300'}`} />
                        <span className="text-[10px] text-gray-500">{product.published ? 'Live' : 'Draft'}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => handleTogglePublish(product)} className="p-2 rounded-lg text-gray-500 hover:bg-dusty-50">
                        {product.published ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600"><Edit3 size={14} /></button>
                      <button onClick={() => setShowDeleteConfirm(product.id)} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-10"><Package size={32} className="mx-auto text-gray-300 mb-2" /><p className="text-sm text-gray-500">Tidak ada produk</p></div>
                )}
              </div>
            </div>
          )}

          {/* Create/Edit */}
          {(activeView === 'create' || activeView === 'edit') && (
            <div className="animate-fadeIn max-w-3xl">
              <button onClick={() => setActiveView('products')} className="flex items-center gap-2 text-gray-600 hover:text-dusty-600 mb-4 sm:mb-6">
                <ArrowLeft size={16} /><span className="text-xs sm:text-sm font-medium">Kembali</span>
              </button>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                {activeView === 'create' ? '✨ Tambah Produk' : '✏️ Edit Produk'}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Image */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <ImageIcon size={16} className="text-dusty-400" /> Foto Produk
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl sm:rounded-2xl overflow-hidden bg-dusty-50 border-2 border-dashed border-dusty-200 flex-shrink-0">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-dusty-400">
                          <ImageIcon size={28} /><p className="text-[10px] mt-1">No image</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 bg-dusty-50 border border-dusty-200 rounded-xl text-xs sm:text-sm font-medium text-dusty-600 hover:bg-dusty-100">
                        <Upload size={14} /> Upload Foto
                      </button>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-2">JPG, PNG. Maks 5MB</p>
                      <div className="mt-3">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-2">Template:</p>
                        <div className="flex gap-2 flex-wrap">
                          {Object.entries(categoryImages).map(([cat, img]) => (
                            <button key={cat} type="button" onClick={() => { setPreviewImage(img); setFormData(prev => ({ ...prev, image: img })); }}
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 ${formData.image === img ? 'border-dusty-500' : 'border-dusty-100'}`}>
                              <img src={img} alt={cat} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Package size={16} className="text-dusty-400" /> Informasi Produk
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Nama Produk *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Silk Elegance Dress"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-dusty-200 bg-white focus:border-dusty-400 outline-none text-sm text-gray-700" required />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Deskripsi *</label>
                      <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Deskripsikan produk..." rows={3}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-dusty-200 bg-white focus:border-dusty-400 outline-none text-sm text-gray-700 resize-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Kategori *</label>
                        <select value={formData.category} onChange={(e) => {
                          const cat = e.target.value as Product['category'];
                          setFormData(prev => ({ ...prev, category: cat }));
                          if (!previewImage || Object.values(categoryImages).includes(previewImage)) {
                            setPreviewImage(categoryImages[cat]);
                            setFormData(prev => ({ ...prev, image: categoryImages[cat] }));
                          }
                        }} className="w-full px-3 py-2.5 sm:py-3 rounded-xl border border-dusty-200 bg-white outline-none text-sm text-gray-700">
                          <option value="fashion">Fashion</option><option value="underwear">Underwear</option>
                          <option value="perfume">Parfum</option><option value="beauty">Kecantikan</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Seller</label>
                        <input type="text" value={formData.seller} onChange={(e) => setFormData(prev => ({ ...prev, seller: e.target.value }))}
                          className="w-full px-3 py-2.5 sm:py-3 rounded-xl border border-dusty-200 bg-white outline-none text-sm text-gray-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Harga (Rp) *</label>
                        <input type="number" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} placeholder="850000"
                          className="w-full px-3 py-2.5 sm:py-3 rounded-xl border border-dusty-200 bg-white outline-none text-sm text-gray-700" required />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Stok *</label>
                        <input type="number" value={formData.stock} onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))} placeholder="100"
                          className="w-full px-3 py-2.5 sm:py-3 rounded-xl border border-dusty-200 bg-white outline-none text-sm text-gray-700" required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publish */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-dusty-100 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp size={16} className="text-dusty-400" /> Publikasi
                  </h3>
                  <div className="space-y-3">
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
                      className="w-full flex items-center justify-between p-3 sm:p-4 bg-dusty-50/50 rounded-xl">
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-medium text-gray-700">Publish Produk</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">Terlihat oleh pembeli</p>
                      </div>
                      <div className={`w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-colors relative ${formData.published ? 'bg-sage-500' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transition-all ${formData.published ? 'left-[calc(100%-18px)] sm:left-[calc(100%-22px)]' : 'left-0.5'}`} />
                      </div>
                    </button>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                      className="w-full flex items-center justify-between p-3 sm:p-4 bg-dusty-50/50 rounded-xl">
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-medium text-gray-700">Produk Unggulan</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">Tampil di halaman utama</p>
                      </div>
                      <div className={`w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-colors relative ${formData.featured ? 'bg-champagne-500' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transition-all ${formData.featured ? 'left-[calc(100%-18px)] sm:left-[calc(100%-22px)]' : 'left-0.5'}`} />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setActiveView('products')} className="px-4 sm:px-6 py-3 bg-white border border-dusty-200 text-gray-700 rounded-xl font-medium hover:bg-dusty-50 text-xs sm:text-sm">
                    Batal
                  </button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-dusty-500 text-white rounded-xl font-medium hover:bg-dusty-600 shadow-lg shadow-dusty-200 text-xs sm:text-sm active:scale-[0.98]">
                    <Save size={14} />
                    {activeView === 'create' ? 'Simpan' : 'Perbarui'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-xs w-full shadow-2xl animate-slideUp">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">Hapus Produk?</h3>
              <p className="text-xs text-gray-500 mb-5">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 text-sm">Batal</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 text-sm">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
