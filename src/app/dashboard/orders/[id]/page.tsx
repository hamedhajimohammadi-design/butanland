'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Package, Truck, MapPin, Printer, CheckCircle, Clock } from 'lucide-react';

export default function OrderDetailsPage() {
  const { id } = useParams();

  // دیتای ساختگی (Mock) - شبیه‌سازی دریافت از سرور
  const order = {
    id: id,
    date: '۱۴۰۲/۱۰/۱۵ - ۱۴:۳۰',
    status: 'processing', // status: processing, sent, delivered, cancelled
    total: '۱۲,۵۰۰,۰۰۰',
    paymentMethod: 'پرداخت در محل (COD)',
    shippingMethod: 'تیپاکس (پس‌کرایه)',
    trackingCode: '192837465', // کد رهگیری فرضی
    address: {
      name: 'حامد حاجی‌محمدی',
      phone: '09126882366',
      fullAddress: 'تهران، خیابان آزادی، خیابان جیحون، پلاک ۱۱۰، واحد ۵',
      postalCode: '1345678901'
    },
    items: [
      { id: 1, name: 'پکیج بیتا 22000 (بدون فن)', price: '۱۱,۰۰۰,۰۰۰', quantity: 1, sku: 'BITA-22' },
      { id: 2, name: 'مبدل حرارتی ثانویه 12 صفحه', price: '۱,۵۰۰,۰۰۰', quantity: 1, sku: 'HEX-12' },
    ]
  };

  // وضعیت‌های سفارش برای تایم‌لاین
  const steps = [
    { key: 'pending', label: 'ثبت سفارش', icon: Clock },
    { key: 'processing', label: 'در حال پردازش', icon: Package },
    { key: 'sent', label: 'تحویل به پست', icon: Truck },
    { key: 'delivered', label: 'تحویل شده', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status) + 1; // +1 برای تست گرافیکی

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-[family-name:var(--font-vazir)]">
      <div className="container mx-auto max-w-4xl">
        
        {/* نویگیشن */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <Link href="/dashboard" className="hover:text-orange-500">داشبورد</Link>
            <ChevronRight size={14} />
            <Link href="/dashboard/orders" className="hover:text-orange-500">سفارش‌ها</Link>
            <ChevronRight size={14} />
            <span className="font-bold text-gray-900">سفارش #{id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ستون اصلی (چپ) */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. وضعیت سفارش (Timeline) */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-bold text-gray-900">وضعیت سفارش</h2>
                        {order.trackingCode && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                                کد رهگیری: {order.trackingCode}
                            </span>
                        )}
                    </div>
                    
                    {/* گرافیک مراحل */}
                    <div className="relative flex justify-between items-center px-2">
                        {/* خط اتصال */}
                        <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                        <div 
                            className="absolute top-5 right-0 h-1 bg-green-500 -z-0 transition-all duration-1000"
                            style={{ width: '40%' }} // درصد پیشرفت (باید داینامیک باشد)
                        ></div>

                        {steps.map((step, index) => {
                            const isCompleted = index <= 1; // لاجیک فرضی برای فعال بودن
                            return (
                                <div key={step.key} className="flex flex-col items-center gap-3 relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${
                                        isCompleted ? 'bg-green-500 border-green-200 text-white' : 'bg-white border-gray-100 text-gray-300'
                                    }`}>
                                        <step.icon size={18} />
                                    </div>
                                    <span className={`text-xs font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 2. لیست اقلام */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Package size={20} className="text-orange-500"/>
                        اقلام سفارش
                    </h2>
                    <div className="divide-y divide-gray-50">
                        {order.items.map((item) => (
                            <div key={item.id} className="py-4 flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl shrink-0">
                                    {/* جای عکس محصول */}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-gray-800 mb-1">{item.name}</h3>
                                    <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">
                                        {item.sku}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-gray-900">{item.price}</div>
                                    <div className="text-xs text-gray-400">{item.quantity} عدد</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ستون کناری (اطلاعات و فاکتور) */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* اطلاعات گیرنده */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="font-bold text-gray-900 mb-4 text-sm">اطلاعات تحویل</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-gray-400 shrink-0 mt-1"/>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {order.address.fullAddress}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl space-y-2 text-xs text-gray-600">
                            <div className="flex justify-between">
                                <span>گیرنده:</span>
                                <span className="font-bold">{order.address.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>تلفن:</span>
                                <span className="font-bold">{order.address.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* خلاصه مالی */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="font-bold text-gray-900 mb-4 text-sm">جزئیات پرداخت</h2>
                    
                    <div className="space-y-3 text-sm border-b border-gray-50 pb-4 mb-4">
                        <div className="flex justify-between text-gray-500">
                            <span>روش پرداخت</span>
                            <span className="text-gray-900">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>هزینه ارسال</span>
                            <span className="text-gray-900">پس‌کرایه</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-gray-700">مبلغ کل</span>
                        <div className="text-xl font-black text-gray-900">
                            {order.total} <span className="text-xs font-normal text-gray-400">تومان</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => window.print()} 
                        className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Printer size={18} />
                        چاپ فاکتور
                    </button>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}
