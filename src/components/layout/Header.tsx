'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { Menu, X, ShoppingCart, Search, User, Phone } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const { items, toggleCart } = useCartStore();
  
  // Hydration handling
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // افکت اسکرول برای تغییر رنگ هدر
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // لینک‌های منو
  const navLinks = [
    { name: 'خانه', href: '/' },
    { name: 'فروشگاه', href: '/shop' },
    { name: 'بلاگ آموزش', href: '/blog' },
    { name: 'جستجوی تعمیرکار', href: '/services' },
    { name: 'تماس با ما', href: '/contact' },
  ];

  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* 1. Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 z-50 backdrop-blur rounded-lg ${isTransparent ? 'text-white bg-white/10' : 'text-gray-700 bg-white/20'}`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* 2. Logo */}
          <Link href="/" className={`text-xl md:text-2xl font-black flex items-center gap-1 z-50 ${isTransparent ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-orange-600">بوتان</span>لند
          </Link>

          {/* 3. Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-bold transition hover:text-orange-600 ${
                  pathname === link.href ? 'text-orange-600' : (isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700')
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 4. Actions (Cart, Search) */}
          <div className="flex items-center gap-3">
             <Link href="/shop" className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full transition ${isTransparent ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
               <Search size={20} />
             </Link>
             
             <button 
               onClick={toggleCart} 
               className={`relative flex items-center justify-center w-10 h-10 rounded-full transition ${isTransparent ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
             >
               <ShoppingCart size={20} />
               {cartCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                   {cartCount}
                 </span>
               )}
             </button>

             <Link href="/login" className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${isTransparent ? 'bg-white text-gray-900 hover:bg-orange-600 hover:text-white' : 'bg-gray-900 text-white hover:bg-orange-600'}`}>
                <User size={16} />
                ورود / ثبت‌نام
             </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)} />
      
      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white z-[70] shadow-2xl p-6 transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
           <span className="text-xl font-black">منو</span>
           <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500"><X size={24} /></button>
        </div>
        <nav className="flex flex-col gap-4">
          {navLinks.map((link) => (
             <Link 
               key={link.href} 
               href={link.href} 
               onClick={() => setMobileMenuOpen(false)}
               className={`text-sm font-bold p-2 rounded-lg ${pathname === link.href ? 'bg-orange-50 text-orange-600' : 'text-gray-600'}`}
             >
               {link.name}
             </Link>
          ))}
          <div className="border-t border-gray-100 my-2"></div>
          <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-gray-600 p-2">
             <User size={18} /> ورود به حساب
          </Link>
          <a href="tel:02112345678" className="flex items-center gap-2 text-sm font-bold text-gray-600 p-2">
             <Phone size={18} /> تماس با پشتیبانی
          </a>
        </nav>
      </div>
    </>
  );
}
