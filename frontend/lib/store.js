import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(persist((set, get) => ({
  items: [],
  addItem: (product, size, color, quantity = 1) => {
    const key = `${product._id}-${size}-${color}`;
    const existing = get().items.find(i => i.key === key);
    if (existing) set({ items: get().items.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i) });
    else set({ items: [...get().items, { key, product, size, color, quantity }] });
  },
  removeItem: (key) => set({ items: get().items.filter(i => i.key !== key) }),
  updateQuantity: (key, quantity) => {
    if (quantity < 1) { get().removeItem(key); return; }
    set({ items: get().items.map(i => i.key === key ? { ...i, quantity } : i) });
  },
  clearCart: () => set({ items: [] }),
}), { name: 'sivakasi-cart' }));

export const useAuthStore = create(persist((set) => ({
  user: null, token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}), { name: 'sivakasi-auth' }));

export const useWishlistStore = create(persist((set, get) => ({
  items: [],
  toggle: (product) => { const items = get().items; const exists = items.find(i => i._id === product._id); set({ items: exists ? items.filter(i => i._id !== product._id) : [...items, product] }); },
  has: (id) => get().items.some(i => i._id === id),
}), { name: 'sivakasi-wishlist' }));
