'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Plus, Edit2, Trash2, ChevronLeft, X, CheckCircle } from 'lucide-react';

export default function AddressesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // دیتای ساختگی (Mock)
  const [addresses, setAddresses] = useState([
    { 
      id: '1', 
      title: 'منزل', 
      name: 'حامد حاجی‌محمدی', 
      phone: '09126882366', 
      city: 'تهران', 
      address: 'خیابان آزادی، خیابان جیحون، پلاک ۱۱۰، واحد ۵', 
      postalCode: '1345678901',
      isDefault: true 
    },
    { 
      id: '2', 
      title: 'محل کار (کارگاه)', 
      name: 'علی کریمی', 
      phone: '09121111111', 
      city: 'کرج', 
      address: 'جاده ملارد، انبار نفت، پلاک ۲۰', 
      postalCode: '3111111111',
      isDefault: false 
    },
  ]);

  // استیت فرم
  const [formData, setFormData] = useState({
    title: '', name: '', phone: '', city: '', address: '', postalCode: ''
  });

  const handleOpenModal = (addr?: any) => {
    if (addr) {
      setEditingId(addr.id);
      setFormData(addr);
    } else {
      setEditingId(null);
      setFormData({ title: '', name: '', phone: '', city: '', address: '', postalCode: '' });
    }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // ویرایش
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, ...formData } : a));
    } else {
      // افزودن جدید
      const newAddr = { ...formData, id: Date.now().toString(), isDefault: false };
      setAddresses(prev => [...prev, newAddr]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این آدرس مطمئن هستید؟')) {
      setAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
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
                <h1 className="text-2xl font-black text-gray-900">آدرس‌های من</h1>
            </div>
            <button 
                onClick={() => handleOpenModal()} 
                className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
            >
                <Plus size={20} />
                <span className="hidden md:inline">افزودن آدرس جدید</span>
            </button>
        </div>

        {/* لیست آدرس‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
                <div key={addr.id} className={`bg-white p-6 rounded-3xl border transition-all relative group ${addr.isDefault ? 'border-orange-500 shadow-md' : 'border-gray-100 shadow-sm hover:border-orange-200'}`}>
                    
                    {/* نشان پیش‌فرض */}
                    {addr.isDefault && (
                        <div className="absolute top-4 left-4 text-orange-500 flex items-center gap-1 text-xs font-bold bg-orange-50 px-2 py-1 rounded-lg">
                            <CheckCircle size={14} />
                            پیش‌فرض
                        </div>
                    )}

                    <div className="flex items-start gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${addr.isDefault ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{addr.title}</h3>
                            <span className="text-xs text-gray-400">{addr.city}</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 leading-relaxed min-h-[40px]">
                        {addr.address}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm">
                        <div className="text-gray-500">
                            <span className="block text-xs text-gray-400">گیرنده:</span>
                            <span className="font-bold">{addr.name}</span>
                        </div>
                        <div className="flex gap-2">
                            {!addr.isDefault && (
                                <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-gray-400 hover:text-orange-500 px-2 py-1">
                                    پیش‌فرض شود
                                </button>
                            )}
                            <button onClick={() => handleOpenModal(addr)} className="w-8 h-8 bg-gray-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(addr.id)} className="w-8 h-8 bg-gray-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* مودال افزودن/ویرایش */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{editingId ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}</h2>
                        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">عنوان آدرس (مثال: خانه، محل کار)</label>
                            <input 
                                required
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:border-orange-500 outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">نام گیرنده</label>
                                <input 
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:border-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">شماره تماس</label>
                                <input 
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:border-orange-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                             <div className="col-span-1">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">شهر</label>
                                <input 
                                    required
                                    value={formData.city}
                                    onChange={e => setFormData({...formData, city: e.target.value})}
                                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:border-orange-500 outline-none"
                                />
                             </div>
                             <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">کد پستی</label>
                                <input 
                                    required
                                    value={formData.postalCode}
                                    onChange={e => setFormData({...formData, postalCode: e.target.value})}
                                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:border-orange-500 outline-none"
                                />
                             </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">آدرس دقیق پستی</label>
                            <textarea 
                                required
                                rows={3}
                                value={formData.address}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-orange-500 outline-none resize-none"
                            ></textarea>
                        </div>

                        <button className="w-full h-12 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 mt-2">
                            {editingId ? 'ویرایش و ذخیره' : 'ثبت آدرس'}
                        </button>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
