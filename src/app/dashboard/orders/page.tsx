'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Package, Search, ChevronLeft, RefreshCw, Filter } from 'lucide-react';

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  // دیتای ساختگی (Mock) - شبیه‌سازی دیتابیس
  const orders = [
    { id: '1892', date: '۱۴۰۲/۱۰/۱۵', status: 'processing', total: '۱۲,۵۰۰,۰۰۰', items: 3, productName: 'پکیج بیتا 22000' },
    { id: '1750', date: '۱۴۰۲/۰۹/۲۸', status: 'completed', total: '۴,۲۰۰,۰۰۰', items: 1, productName: 'مبدل حرارتی اصلی' },
    { id: '1620', date: '۱۴۰۲/۰۹/۱۰', status: 'cancelled', total: '۸۵۰,۰۰۰', items: 2, productName: 'شیر سه طرفه' },
    { id: '1540', date: '۱۴۰۲/۰۸/۰۵', status: 'completed', total: '۱,۲۰۰,۰۰۰', items: 5, productName: 'سنسور NTC' },
  ];

  // فیلتر کردن سفارشات
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.id.includes(search) || order.productName.includes(search);
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'processing': return <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">در حال پردازش</span>;
      case 'completed': return <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">تکمیل شده</span>;
      case 'cancelled': return <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">لغو شده</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-[family-name:var(--font-vazir)]">
      <div className="container mx-auto max-w-4xl">
        
        {/* هدر صفحه */}
        <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:text-orange-500 shadow-sm transition-colors">
                <ChevronLeft className="rotate-180" size={20} />
            </Link>
            <h1 className="text-2xl font-black text-gray-900">سفارش‌های من</h1>
        </div>

        {/* فیلتر و جستجو */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* تب‌ها */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                {['all', 'processing', 'completed', 'cancelled'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab 
                            ? 'bg-white text-gray-800 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab === 'all' && 'همه'}
                        {tab === 'processing' && 'جاری'}
                        {tab === 'completed' && 'تکمیل شده'}
                        {tab === 'cancelled' && 'لغو شده'}
                    </button>
                ))}
            </div>

            {/* جستجو */}
            <div className="relative w-full md:w-64">
                <input 
                    type="text" 
                    placeholder="جستجو در سفارشات..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl pr-10 pl-4 text-sm focus:border-orange-500 outline-none"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
        </div>

        {/* لیست سفارشات */}
        <div className="space-y-4">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors group">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        
                        {/* اطلاعات اصلی */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                                <Package size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-gray-900">سفارش #{order.id}</span>
                                    {getStatusBadge(order.status)}
                                </div>
                                <div className="text-xs text-gray-500 flex flex-col md:flex-row gap-2 md:gap-4">
                                    <span>📅 {order.date}</span>
                                    <span>📦 {order.items} محصول</span>
                                    <span>💰 {order.total} تومان</span>
                                </div>
                            </div>
                        </div>

                        {/* دکمه‌ها */}
                        <div className="flex items-center gap-3 self-end md:self-center">
                            {/* دکمه خرید مجدد (ویژه همکاران) */}
                            <button className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors">
                                <RefreshCw size={14} />
                                سفارش مجدد
                            </button>
                            
                            <Link href={`/dashboard/orders/${order.id}`} className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                <span>جزئیات</span>
                                <ChevronLeft size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-10 text-gray-400">
                    <Package size={48} className="mx-auto mb-2 opacity-50" />
                    <p>هیچ سفارشی پیدا نشد.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
