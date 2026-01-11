'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, MessageSquare, Plus, Search, Paperclip, X, Send } from 'lucide-react';

export default function SupportPage() {
  const [showModal, setShowModal] = useState(false);
  
  // دیتای ساختگی تیکت‌ها
  const [tickets, setTickets] = useState([
    { id: '9821', title: 'سوال در مورد پمپ ویلو', dept: 'فنی', date: '۱۴۰۲/۱۰/۲۰', status: 'answered', lastMsg: 'سلام، بله این مدل به دستگاه شما می‌خورد...' },
    { id: '9810', title: 'پیگیری سفارش ۱۸۹۲', dept: 'فروش', date: '۱۴۰۲/۱۰/۱۸', status: 'closed', lastMsg: 'سفارش شما تحویل تیپاکس شد.' },
    { id: '9750', title: 'درخواست مرجوعی مبدل', dept: 'گارانتی', date: '۱۴۰۲/۱۰/۱۵', status: 'pending', lastMsg: 'لطفاً عکس قطعه را ارسال کنید.' },
  ]);

  const [formData, setFormData] = useState({ title: '', dept: 'technical', message: '' });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'answered': return <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold">پاسخ داده شده</span>;
      case 'pending': return <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold">در انتظار پاسخ</span>;
      case 'closed': return <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold">بسته شده</span>;
      default: return null;
    }
  };

  const handleNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = {
      id: Math.floor(Math.random() * 10000).toString(),
      title: formData.title,
      dept: formData.dept === 'technical' ? 'فنی' : 'فروش',
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'pending',
      lastMsg: formData.message
    };
    setTickets([newTicket, ...tickets]);
    setShowModal(false);
    setFormData({ title: '', dept: 'technical', message: '' });
    alert('تیکت شما با موفقیت ثبت شد.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-[family-name:var(--font-vazir)]">
      <div className="container mx-auto max-w-4xl">
        
        {/* هدر */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:text-orange-500 shadow-sm transition-colors">
                    <ChevronLeft className="rotate-180" size={20} />
                </Link>
                <h1 className="text-2xl font-black text-gray-900">پشتیبانی</h1>
            </div>
            <button 
                onClick={() => setShowModal(true)} 
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
                <Plus size={20} />
                <span className="hidden md:inline">تیکت جدید</span>
            </button>
        </div>

        {/* لیست تیکت‌ها */}
        <div className="space-y-4">
            {tickets.map((ticket) => (
                <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`} className="block bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{ticket.title}</h3>
                                <span className="text-xs text-gray-400">تیکت #{ticket.id} | دپارتمان {ticket.dept}</span>
                            </div>
                        </div>
                        {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mr-14 pl-4">
                        {ticket.lastMsg}
                    </p>
                    <div className="text-xs text-gray-400 text-left mt-2 pl-2">
                        {ticket.date}
                    </div>
                </Link>
            ))}
        </div>

        {/* مودال تیکت جدید */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
                    
                    <button onClick={() => setShowModal(false)} className="absolute left-6 top-6 text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>

                    <h2 className="text-xl font-black text-gray-900 mb-6">ارسال تیکت جدید</h2>

                    <form onSubmit={handleNewTicket} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">دپارتمان مربوطه</label>
                            <select 
                                value={formData.dept}
                                onChange={e => setFormData({...formData, dept: e.target.value})}
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:border-blue-500 outline-none appearance-none"
                            >
                                <option value="technical">پشتیبانی فنی و قطعات</option>
                                <option value="sales">پیگیری سفارش و فروش</option>
                                <option value="warranty">گارانتی و مرجوعی</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">موضوع</label>
                            <input 
                                required
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                placeholder="مثلاً: خرابی پمپ بعد از نصب"
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">پیام شما</label>
                            <textarea 
                                required
                                rows={5}
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                                placeholder="متن پیام خود را بنویسید..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:border-blue-500 outline-none resize-none"
                            ></textarea>
                        </div>

                        {/* دکمه آپلود فرضی */}
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <Paperclip size={24} />
                                <span className="text-xs">افزودن تصویر یا فایل ضمیمه (اختیاری)</span>
                            </div>
                        </div>

                        <button className="w-full h-14 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                            <span>ارسال تیکت</span>
                            <Send size={18} className="rotate-180" />
                        </button>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
