import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// تعریف ساختار محصول در سبد
export interface CartItem {
  id: string; // Slug یا DatabaseId
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // وضعیت باز/بسته بودن منوی کشویی سبد
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void; // برای باز و بسته کردن کشوی سبد
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.id === newItem.id);
        const qtyToAdd = newItem.quantity > 0 ? newItem.quantity : 1;
        
        if (existingItem) {
          // اگر محصول قبلاً بود، تعدادش را زیاد کن
          return {
            items: state.items.map(item => 
              item.id === newItem.id 
                ? { ...item, quantity: item.quantity + qtyToAdd }
                : item
            )
          };
        }
        
        // اگر جدید بود، اضافه‌اش کن
        return { items: [...state.items, { ...newItem, quantity: qtyToAdd }] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter(i => i.quantity > 0) // اگر صفر شد حذفش کن
      })),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'butan-cart-storage', // اسم کلید در LocalStorage مرورگر
    }
  )
);
