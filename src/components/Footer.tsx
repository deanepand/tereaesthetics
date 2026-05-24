import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Footer({ onNavigate }: { onNavigate: (page: string) => void }) {
  const categoryMap: Record<string, string> = {
    Fashion: 'fashion',
    Underwear: 'underwear',
    Parfum: 'perfume',
    Kecantikan: 'beauty',
  };

  return (
    <footer className="bg-gradient-to-b from-dusty-50 to-dusty-100 border-t border-dusty-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="Tere Aesthetics" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover" />
              <h3 className="text-lg sm:text-xl font-bold text-dusty-700" style={{ fontFamily: 'Georgia, serif' }}>
                Tere <span className="text-sage-600">Aesthetics</span>
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Marketplace eksklusif untuk produk fashion, kecantikan, dan parfum terbaik.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-dusty-200 hover:bg-dusty-300 flex items-center justify-center text-dusty-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dusty-200 hover:bg-dusty-300 flex items-center justify-center text-dusty-600 transition-colors">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Kategori</h4>
            <ul className="space-y-2">
              {Object.entries(categoryMap).map(([label, key]) => (
                <li key={key}>
                  <button
                    onClick={() => {
                      useStore.getState().setSelectedCategory(key);
                      onNavigate('explore');
                    }}
                    className="text-sm text-gray-600 hover:text-dusty-600 transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Bantuan</h4>
            <ul className="space-y-2">
              {['FAQ', 'Kebijakan Pengembalian', 'Cara Pemesanan', 'Syarat & Ketentuan'].map(item => (
                <li key={item}>
                  <button onClick={() => {}} className="text-sm text-gray-600 hover:text-dusty-600 transition-colors text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Kontak</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-dusty-400 flex-shrink-0 mt-0.5" />
                <span>Jakarta, Indonesia</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-dusty-400 flex-shrink-0 mt-0.5" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-dusty-400 flex-shrink-0 mt-0.5" />
                <span className="break-all">hello@tereaesthetics.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-dusty-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-500">© 2024 Tere Aesthetics. All rights reserved.</p>
          <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-dusty-400 fill-dusty-400" /> in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
