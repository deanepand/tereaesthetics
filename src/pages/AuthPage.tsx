import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

interface AuthPageProps {
  mode: 'login' | 'register';
  onNavigate: (page: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function AuthPage({ mode, onNavigate, showToast }: AuthPageProps) {
  const { login, register } = useStore();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        const success = login(email, password);
        if (success) {
          showToast('Berhasil masuk! Selamat datang 👋', 'success');
          onNavigate('home');
        } else {
          setError('Email atau password salah. Coba: admin@tere.com / admin123');
        }
      } else {
        if (!name || !email || !password) {
          setError('Semua field harus diisi');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password minimal 6 karakter');
          setLoading(false);
          return;
        }
        const success = register(name, email, password);
        if (success) {
          showToast('Akun berhasil dibuat! 🎉', 'success');
          onNavigate('home');
        } else {
          setError('Email sudah terdaftar');
        }
      }
      setLoading(false);
    }, 800);
  };

  const handleForgotPassword = () => {
    showToast('Link reset password telah dikirim ke email Anda', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dusty-50 via-white to-sage-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-10 right-10 w-40 sm:w-64 h-40 sm:h-64 bg-dusty-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 sm:w-72 h-40 sm:h-72 bg-sage-200/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-gray-600 hover:text-dusty-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Kembali</span>
        </button>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl shadow-dusty-100/50 border border-dusty-100 p-6 sm:p-8 animate-slideUp">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-dusty-400 to-sage-400 mb-4 shadow-lg shadow-dusty-200">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              {isLogin ? 'Masuk ke akun Tere Aesthetics kamu' : 'Daftar untuk mulai berbelanja'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs sm:text-sm text-red-600 animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Nama Lengkap</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dusty-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-dusty-200 bg-white focus:border-dusty-400 focus:ring-2 focus:ring-dusty-100 outline-none transition-all text-sm text-gray-700"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dusty-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-dusty-200 bg-white focus:border-dusty-400 focus:ring-2 focus:ring-dusty-100 outline-none transition-all text-sm text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dusty-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-dusty-200 bg-white focus:border-dusty-400 focus:ring-2 focus:ring-dusty-100 outline-none transition-all text-sm text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-dusty-300 accent-dusty-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs sm:text-sm text-dusty-600 hover:text-dusty-700 font-medium"
                >
                  Lupa password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-dusty-500 to-dusty-400 hover:from-dusty-600 hover:to-dusty-500 text-white rounded-xl font-semibold shadow-lg shadow-dusty-200 transition-all duration-300 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </span>
              ) : isLogin ? 'Masuk' : 'Daftar'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-dusty-600 hover:text-dusty-700 font-semibold"
              >
                {isLogin ? 'Daftar sekarang' : 'Masuk'}
              </button>
            </p>
          </div>

          <div className="mt-5 pt-5 border-t border-dusty-100">
            <p className="text-[10px] sm:text-xs text-gray-400 text-center mb-2">Demo Akun:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setEmail('admin@tere.com'); setPassword('admin123'); setIsLogin(true); }}
                className="px-3 py-2 bg-dusty-50 rounded-lg text-xs text-dusty-600 font-medium hover:bg-dusty-100 transition-colors"
              >
                👑 Admin
              </button>
              <button
                onClick={() => { setEmail('user@tere.com'); setPassword('user123'); setIsLogin(true); }}
                className="px-3 py-2 bg-sage-50 rounded-lg text-xs text-sage-600 font-medium hover:bg-sage-100 transition-colors"
              >
                👤 User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
