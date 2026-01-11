'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle, Home, ShoppingBag, Truck, Calendar, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // هندل کردن احتمالی آرایه بودن پارامترها
  const orderNumber = Array.isArray(params.id) ? params.id[0] : params.id;
  const total = searchParams.get('total') || '0';
  
  // تاریخ به فرمت فارسی
  const date = new Date().toLocaleDateString('fa-IR');

  useEffect(() => {
    setMounted(true);
    
    // اجرای افکت کاغذ رنگی
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);

  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 relative">
        
        {/* هدر سبز رنگ */}
        <div className="bg-green-500 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle size={40} className="text-white" strokeWidth={3} />
                </div>
                <h1 className="text-2xl font-black mb-2">سفارش موفق!</h1>
                <p className="text-green-100 text-sm font-medium">از اعتماد شما به بوتان‌لند سپاسگزاریم</p>
            </div>
        </div>

        {/* بدنه کارت */}
        <div className="p-6 md:p-8 space-y-6">
            
            {/* شماره سفارش */}
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center border border-dashed border-gray-200 group relative">
                <span className="text-gray-400 text-xs font-bold mb-1">کد پیگیری سفارش</span>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-gray-800 tracking-widest font-mono">{orderNumber}</span>
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(orderNumber as string);
                            alert('کد کپی شد!');
                        }} 
                        className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                        title="کپی کد سفارش"
                    >
                        <Copy size={18} />
                    </button>
                </div>
            </div>

            {/* جزئیات کلیدی */}
            <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                        <Calendar size={18} className="text-orange-500" />
                        <span>تاریخ ثبت</span>
                    </div>
                    <span className="font-bold text-gray-800">{date}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                        <Truck size={18} className="text-blue-500" />
                        <span>روش ارسال</span>
                    </div>
                    <span className="font-bold text-gray-800 text-sm">پس‌کرایه (تیپاکس/باربری)</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                        <ShoppingBag size={18} className="text-green-500" />
                        <span>مبلغ نهایی</span>
                    </div>
                    <span className="font-black text-xl text-gray-900">{Number(total).toLocaleString()} <span className="text-xs text-gray-400 font-normal">تومان</span></span>
                </div>
            </div>

            {/* دکمه‌ها */}
            <div className="space-y-3 pt-2">
                <Link href="/shop" className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                    <ShoppingBag size={20} />
                    ادامه خرید از فروشگاه
                </Link>
                <Link href="/" className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                    <Home size={20} />
                    بازگشت به صفحه اصلی
                </Link>
            </div>
            
        </div>
      </div>

      <p className="text-gray-400 text-xs mt-8 text-center max-w-md leading-5">
        یک نسخه از فاکتور به ایمیل شما ارسال شد. <br/>
        پشتیبانی: <span className="font-bold text-gray-600 dir-ltr">021-12345678</span>
      </p>

    </div>
  );
}
