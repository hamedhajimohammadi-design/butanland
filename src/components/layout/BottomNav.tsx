'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'خانه', href: '/', icon: Home },
  { name: 'محصولات', href: '/shop', icon: LayoutGrid },
  { name: 'سبد خرید', href: '/cart', icon: ShoppingCart },
  { name: 'پروفایل', href: '/profile', icon: User },
  { name: 'تماس', href: '/contact', icon: Phone },
];

export default function BottomNav() {
  const pathname = usePathname();
  const cartStore = useCartStore();
  
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // or return a skeleton

  const cartCount = cartStore.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe md:hidden">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                
                {item.name === 'سبد خرید' && cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
                
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-8 left-1/2 w-12 h-1 -translate-x-1/2 bg-blue-600 rounded-t-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
