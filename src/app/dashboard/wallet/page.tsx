'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Wallet, ArrowUpCircle, ArrowDownCircle, Plus, History, X, CreditCard, CheckCircle } from 'lucide-react';

export default function WalletPage() {
  const [balance, setBalance] = useState(2500000); 
  const [showModal, setShowModal] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState(''); // مبلغی که کاربر تایپ میکند

  // دیتای ساختگی تراکنش‌ها
  const transactions = [
    { id: 1, type: 'deposit', title: 'شارژ کیف پول', amount: 5000000, date: '۱۴۰۲/۱۰/۲۰ - ۱۰:۳۰', status: 'success' },
    { id: 2, type: 'purchase', title: 'خرید سفارش #1892', amount: 12500000, date: '۱۴۰۲/۱۰/۱۵ - ۱۴:۴۵', status: 'success' },
    { id: 3, type: 'refund', title: 'مرجوعی سفارش #1620', amount: 850000, date: '۱۴۰۲/۰۹/۱۰ - ۰۹:۰۰', status: 'success' },
    { id: 4, type: 'withdraw', title: 'برداشت وجه', amount: 2000000, date: '۱۴۰۲/۰۸/۲۵ - ۱۸:۲۰', status: 'pending' },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowUpCircle className="text-green-500" size={24} />;
      case 'refund': return <ArrowUpCircle className="text-blue-500" size={24} />;
      case 'purchase': return <ArrowDownCircle className="text-red-500" size={24} />;
      case 'withdraw': return <ArrowDownCircle className="text-orange-500" size={24} />;
      default: return <History className="text-gray-500" size={24} />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'افزایش موجودی';
      case 'refund': return 'بازگشت وجه (مرجوعی)';
      case 'purchase': return 'پرداخت بابت خرید';
      case 'withdraw': return 'درخواست برداشت';
      default: return 'تراکنش';
    }
  };

  // فرمت کردن عدد با جداکننده هزارگان (1,000,000)
  const formatNumber = (num: string) => {
    return num.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(rawValue))) {
        setAmountToAdd(rawValue);
    }
  };

  const handleQuickAmount = (val: number) => {
    setAmountToAdd(val.toString());
  };

  const handlePayment = () => {
    if (!amountToAdd || Number(amountToAdd) < 1000) {
        alert("لطفاً مبلغ معتبری وارد کنید (حداقل ۱۰۰۰ تومان)");
        return;
    }
    // اینجا کاربر به درگاه بانکی هدایت می‌شود
    // router.push('/payment/start?amount=' + amountToAdd);
    alert(`در حال انتقال به درگاه بانکی برای مبلغ ${Number(amountToAdd).toLocaleString()} تومان...`);
    setShowModal(false);
    setAmountToAdd('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-[family-name:var(--font-vazir)]">
      <div className="container mx-auto max-w-4xl">
        
        {/* هدر */}
        <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:text-orange-500 shadow-sm transition-colors">
                <ChevronLeft className="rotate-180" size={20} />
            </Link>
            <h1 className="text-2xl font-black text-gray-900">کیف پول من</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* کارت موجودی و عملیات */}
            <div className="md:col-span-1 space-y-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden h-48 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <Wallet className="opacity-80" size={28} />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">فعال</span>
                    </div>
                    <div className="relative z-10">
                        <span className="text-sm text-gray-400 block mb-1">موجودی قابل استفاده</span>
                        <div className="text-3xl font-black tracking-tight">
                            {balance.toLocaleString()} <span className="text-sm font-normal text-gray-400">تومان</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setShowModal(true)} 
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                >
                    <Plus size={20} />
                    افزایش موجودی
                </button>
            </div>

            {/* لیست تراکنش‌ها */}
            <div className="md:col-span-2">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <History size={20} className="text-gray-400"/>
                            آخرین تراکنش‌ها
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                                        {getTransactionIcon(tx.type)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 text-sm md:text-base">{getTransactionLabel(tx.type)}</div>
                                        <div className="text-xs text-gray-400 mt-1">{tx.title} | {tx.date}</div>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className={`font-black text-sm md:text-base ${
                                        ['deposit', 'refund'].includes(tx.type) ? 'text-green-600' : 'text-gray-900'
                                    }`}>
                                        {['deposit', 'refund'].includes(tx.type) ? '+' : '-'}{tx.amount.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] mt-1 text-gray-400">
                                        {tx.status === 'success' && <span className="text-green-500">موفق</span>}
                                        {tx.status === 'pending' && <span className="text-orange-500">در حال بررسی</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

        {/* 👇 مودال افزایش موجودی */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
                    
                    <button onClick={() => setShowModal(false)} className="absolute left-6 top-6 text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>

                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard size={32} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">افزایش موجودی</h2>
                        <p className="text-sm text-gray-500 mt-1">مبلغ مورد نظر را وارد کنید</p>
                    </div>

                    <div className="space-y-6">
                        {/* ورودی مبلغ */}
                        <div className="relative">
                            <input 
                                type="text" 
                                inputMode="numeric"
                                value={formatNumber(amountToAdd)}
                                onChange={handleAmountChange}
                                placeholder="۰"
                                className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl text-center text-3xl font-black text-gray-900 outline-none transition-all placeholder:text-gray-300"
                                autoFocus
                            />
                            {amountToAdd && (
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">تومان</span>
                            )}
                        </div>

                        {/* مبالغ پیشنهادی */}
                        <div className="grid grid-cols-3 gap-3">
                            {[1000000, 2000000, 5000000].map((val) => (
                                <button 
                                    key={val}
                                    onClick={() => handleQuickAmount(val)}
                                    className="bg-gray-50 border border-gray-100 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors"
                                >
                                    {(val/1000000).toLocaleString()} میلیون
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handlePayment}
                            disabled={!amountToAdd}
                            className="w-full h-14 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>پرداخت و شارژ کیف پول</span>
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                </div>
            </div>
        )}

      </div>
    </div>
  );
}