'use client';

import { useCartStore } from '@/store/cart-store';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, isOpen, toggleCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // محاسبه قیمت کل
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // برای جلوگیری از ارور هیدریشن در Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay (پس‌زمینه تیره) */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleCart}
      />

      {/* Drawer (پنل کشویی) */}
      <div className={`fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <ShoppingBag className="text-orange-600" /> سبد خرید
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
          </h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <ShoppingBag size={64} className="text-gray-300" />
              <p className="text-gray-500 font-bold">سبد خرید شما خالی است</p>
              <button onClick={toggleCart} className="text-orange-600 font-bold text-sm hover:underline">بازگشت به فروشگاه</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {/* Image */}
                <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100"><ShoppingBag size={20} className="text-gray-400"/></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-green-600 hover:bg-green-50 rounded"><Plus size={14} /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-red-500 hover:bg-red-50 rounded"><Minus size={14} /></button>
                    </div>
                    <div className="text-right">
                       <span className="block text-sm font-black text-gray-900">{item.price > 0 ? (item.price * item.quantity).toLocaleString() : 'تماس'}</span>
                       {item.price > 0 && <span className="text-[10px] text-gray-400">تومان</span>}
                    </div>
                  </div>
                </div>
                
                {/* Remove */}
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 self-start p-1">
                   <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer (Checkout) */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">مبلغ قابل پرداخت:</span>
              <div className="text-xl font-black text-gray-900">
                {totalPrice.toLocaleString()} <span className="text-xs text-gray-400 font-normal">تومان</span>
              </div>
            </div>
            <Link 
              href="/checkout" 
              onClick={toggleCart}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-orange-200"
            >
              تسویه حساب <ArrowLeft size={18} />
            </Link>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
