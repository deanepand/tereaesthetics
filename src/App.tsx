import { useState, useCallback } from 'react';
import { Product } from './store/useStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast, { ToastData } from './components/Toast';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

type Page = 'landing' | 'home' | 'explore' | 'login' | 'register' | 'dashboard' | 'admin' | 'product-detail' | 'cart';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hideNavbar = ['login', 'register', 'admin'].includes(currentPage);
  const hideFooter = ['login', 'register', 'admin'].includes(currentPage);

  return (
    <div className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
      <Toast toasts={toasts} onRemove={removeToast} />

      {!hideNavbar && (
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} showToast={showToast} />
      )}

      <main className="w-full max-w-full">
        {currentPage === 'landing' && (
          <LandingPage onNavigate={handleNavigate} onViewProduct={handleViewProduct} showToast={showToast} />
        )}
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />
        )}
        {currentPage === 'explore' && (
          <ExplorePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />
        )}
        {currentPage === 'login' && (
          <AuthPage mode="login" onNavigate={handleNavigate} showToast={showToast} />
        )}
        {currentPage === 'register' && (
          <AuthPage mode="register" onNavigate={handleNavigate} showToast={showToast} />
        )}
        {currentPage === 'dashboard' && (
          <DashboardPage onNavigate={handleNavigate} showToast={showToast} />
        )}
        {currentPage === 'admin' && (
          <AdminPage onNavigate={handleNavigate} showToast={showToast} />
        )}
        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
            showToast={showToast}
          />
        )}
        {currentPage === 'cart' && (
          <CartPage onNavigate={handleNavigate} showToast={showToast} />
        )}
      </main>

      {!hideFooter && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}
