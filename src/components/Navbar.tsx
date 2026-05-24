import { useState } from 'react';
import { Heart, ShoppingBag, User, Search, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function Navbar({ currentPage, onNavigate, showToast }: NavbarProps) {
  const { user, isAuthenticated, logout, cart, wishlist, searchQuery, setSearchQuery } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Explore', page: 'explore' },
    { name: 'Fashion', page: 'explore-fashion' },
    { name: 'Kecantikan', page: 'explore-beauty' },
    { name: 'Parfum', page: 'explore-perfume' },
  ];

  const handleNavClick = (page: string) => {
    if (page.startsWith('explore-')) {
      const cat = page.replace('explore-', '');
      useStore.getState().setSelectedCategory(cat);
      onNavigate('explore');
    } else {
      onNavigate(page);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-dusty-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 flex-shrink-0">
            <img src="/images/logo.png" alt="Tere Aesthetics" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shadow-md" />
            <span className="text-base sm:text-xl font-bold text-dusty-700 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Tere<span className="text-sage-600 hidden xs:inline"> Aesthetics</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentPage === link.page || (currentPage === 'explore' && link.page === 'explore')
                    ? 'bg-dusty-100 text-dusty-700'
                    : 'text-gray-600 hover:text-dusty-600 hover:bg-dusty-50'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <div className="hidden sm:flex items-center">
              {searchOpen ? (
                <div className="flex items-center bg-dusty-50 rounded-full px-3 py-1.5 border border-dusty-200">
                  <Search size={16} className="text-dusty-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { onNavigate('explore'); setSearchOpen(false); } }}
                    placeholder="Cari produk..."
                    className="bg-transparent border-none outline-none ml-2 text-sm w-32 md:w-40 text-gray-700 placeholder-dusty-300"
                    autoFocus
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                    <X size={14} className="text-dusty-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-dusty-50 text-gray-600 hover:text-dusty-600 transition-colors"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('explore')}
              className="relative p-2 rounded-full hover:bg-dusty-50 text-gray-600 hover:text-dusty-600 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} className="sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-dusty-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 rounded-full hover:bg-dusty-50 text-gray-600 hover:text-dusty-600 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-sage-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 sm:gap-2 pl-2 pr-1 sm:pl-3 sm:pr-2 py-1.5 rounded-full hover:bg-dusty-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-dusty-400 to-sage-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[80px] truncate">{user?.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-dusty-100 py-2 z-20 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-dusty-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { onNavigate('dashboard'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-dusty-50 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => { onNavigate('admin'); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-dusty-50 transition-colors"
                        >
                          <User size={16} />
                          Admin Panel
                        </button>
                      )}
                      <hr className="my-1 border-dusty-50" />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); onNavigate('landing'); showToast('Berhasil keluar', 'info'); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-dusty-500 hover:bg-dusty-600 text-white rounded-full text-xs sm:text-sm font-medium transition-colors shadow-md shadow-dusty-200"
              >
                <User size={14} />
                <span>Masuk</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-dusty-50 text-gray-600"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-dusty-100 mt-2 pt-3 animate-fadeIn">
            <div className="flex items-center bg-dusty-50 rounded-full px-4 py-2.5 mb-3">
              <Search size={16} className="text-dusty-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { onNavigate('explore'); setMobileMenuOpen(false); } }}
                placeholder="Cari produk..."
                className="bg-transparent border-none outline-none ml-2 text-sm w-full text-gray-700 placeholder-dusty-300"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={14} className="text-dusty-400" />
                </button>
              )}
            </div>
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => { handleNavClick(link.page); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-dusty-50 rounded-xl transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
