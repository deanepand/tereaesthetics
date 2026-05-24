import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'fashion' | 'underwear' | 'perfume' | 'beauty';
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  published: boolean;
  featured: boolean;
  createdAt: string;
  seller: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviews'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  togglePublish: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // UI
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Silk Elegance Dress',
    description: 'Gaun sutra elegan dengan potongan A-line yang sempurna untuk acara formal maupun kasual. Dibuat dari bahan sutra premium dengan detail jahitan tangan yang halus.',
    price: 1250000,
    category: 'fashion',
    image: '/images/fashion1.jpg',
    images: ['/images/fashion1.jpg'],
    stock: 25,
    rating: 4.8,
    reviews: 124,
    published: true,
    featured: true,
    createdAt: '2024-01-15',
    seller: 'Tere Aesthetics'
  },
  {
    id: '2',
    name: 'Rose Petal Eau de Parfum',
    description: 'Parfum mewah dengan aroma mawar dan vanilla yang lembut. Tahan hingga 12 jam dengan wangi yang elegan dan feminine.',
    price: 850000,
    category: 'perfume',
    image: '/images/perfume1.jpg',
    images: ['/images/perfume1.jpg'],
    stock: 50,
    rating: 4.9,
    reviews: 89,
    published: true,
    featured: true,
    createdAt: '2024-02-10',
    seller: 'Tere Aesthetics'
  },
  {
    id: '3',
    name: 'Lace Dream Bralette Set',
    description: 'Set bralette dengan detail lace yang indah dan nyaman dipakai sehari-hari. Tersedia dalam berbagai ukuran dengan bahan yang breathable.',
    price: 450000,
    category: 'underwear',
    image: '/images/underwear1.jpg',
    images: ['/images/underwear1.jpg'],
    stock: 100,
    rating: 4.7,
    reviews: 256,
    published: true,
    featured: true,
    createdAt: '2024-01-20',
    seller: 'Tere Aesthetics'
  },
  {
    id: '4',
    name: 'Glow Radiance Serum',
    description: 'Serum wajah dengan kandungan Vitamin C dan Hyaluronic Acid untuk kulit yang glowing dan sehat. Formula ringan yang cepat meresap.',
    price: 380000,
    category: 'beauty',
    image: '/images/beauty1.jpg',
    images: ['/images/beauty1.jpg'],
    stock: 75,
    rating: 4.6,
    reviews: 312,
    published: true,
    featured: true,
    createdAt: '2024-03-05',
    seller: 'Tere Aesthetics'
  },
  {
    id: '5',
    name: 'Champagne Blouse',
    description: 'Blus elegan berwarna champagne dengan detail ruffle yang feminine. Cocok untuk tampilan office-to-dinner yang stylish.',
    price: 650000,
    category: 'fashion',
    image: '/images/fashion1.jpg',
    images: ['/images/fashion1.jpg'],
    stock: 30,
    rating: 4.5,
    reviews: 67,
    published: true,
    featured: false,
    createdAt: '2024-02-28',
    seller: 'Tere Aesthetics'
  },
  {
    id: '6',
    name: 'Midnight Jasmine Perfume',
    description: 'Aroma jasmine yang memikat dengan sentuhan musk yang lembut. Parfum ini memberikan kesan misterius dan elegan.',
    price: 720000,
    category: 'perfume',
    image: '/images/perfume1.jpg',
    images: ['/images/perfume1.jpg'],
    stock: 40,
    rating: 4.8,
    reviews: 145,
    published: true,
    featured: false,
    createdAt: '2024-03-12',
    seller: 'Tere Aesthetics'
  },
  {
    id: '7',
    name: 'Silk Comfort Brief Set',
    description: 'Set celana dalam sutra premium yang ultra-lembut. Memberikan kenyamanan maksimal sepanjang hari dengan desain seamless.',
    price: 320000,
    category: 'underwear',
    image: '/images/underwear1.jpg',
    images: ['/images/underwear1.jpg'],
    stock: 150,
    rating: 4.4,
    reviews: 198,
    published: true,
    featured: false,
    createdAt: '2024-01-30',
    seller: 'Tere Aesthetics'
  },
  {
    id: '8',
    name: 'Hydra Moisture Cream',
    description: 'Krim pelembab intensif dengan formula ceramide complex untuk hidrasi yang tahan lama. Cocok untuk semua jenis kulit.',
    price: 425000,
    category: 'beauty',
    image: '/images/beauty1.jpg',
    images: ['/images/beauty1.jpg'],
    stock: 60,
    rating: 4.7,
    reviews: 178,
    published: true,
    featured: false,
    createdAt: '2024-02-15',
    seller: 'Tere Aesthetics'
  },
];

const users: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@tere.com',
    password: 'admin123',
    user: { id: '1', name: 'Admin Tere', email: 'admin@tere.com', role: 'admin' }
  },
  {
    email: 'user@tere.com',
    password: 'user123',
    user: { id: '2', name: 'Sari Dewi', email: 'user@tere.com', role: 'user' }
  }
];

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: (email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      set({ user: found.user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  register: (name: string, email: string, _password: string) => {
    const exists = users.find(u => u.email === email);
    if (exists) return false;
    const newUser: User = { id: Date.now().toString(), name, email, role: 'user' };
    users.push({ email, password: _password, user: newUser });
    set({ user: newUser, isAuthenticated: true });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),

  // Products
  products: defaultProducts,
  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      rating: 0,
      reviews: 0,
    };
    set(state => ({ products: [...state.products, newProduct] }));
  },
  updateProduct: (id, updates) => {
    set(state => ({
      products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  },
  deleteProduct: (id) => {
    set(state => ({ products: state.products.filter(p => p.id !== id) }));
  },
  togglePublish: (id) => {
    set(state => ({
      products: state.products.map(p => p.id === id ? { ...p, published: !p.published } : p)
    }));
  },

  // Cart
  cart: [],
  addToCart: (product) => {
    const { cart } = get();
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      set({
        cart: cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) => {
    set(state => ({ cart: state.cart.filter(item => item.product.id !== productId) }));
  },
  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set(state => ({
      cart: state.cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }));
  },
  clearCart: () => set({ cart: [] }),

  // Wishlist
  wishlist: [],
  toggleWishlist: (productId) => {
    set(state => ({
      wishlist: state.wishlist.includes(productId)
        ? state.wishlist.filter(id => id !== productId)
        : [...state.wishlist, productId]
    }));
  },

  // UI
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
