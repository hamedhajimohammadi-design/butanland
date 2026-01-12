'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle, Smartphone, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function TechnicianProfilePage() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState<'available' | 'busy'>('available');
  const [city, setCity] = useState('تهران');
  const [isVerified, setIsVerified] = useState(false); // Mock

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-8">تنظیمات پروفایل و تخصص</h1>

      {/* Verification Status */}
      <div className={`mb-8 p-6 rounded-2xl border ${isVerified ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
         <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${isVerified ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                {isVerified ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div>
                <h3 className={`font-bold text-lg ${isVerified ? 'text-green-800' : 'text-orange-800'}`}>
                    {isVerified ? 'حساب کاربری شما تایید شده است' : 'حساب شما هنوز تایید نشده است'}
                </h3>
                <p className={`mt-1 text-sm ${isVerified ? 'text-green-600' : 'text-orange-700'}`}>
                    {isVerified 
                        ? 'شما به تمام امکانات همکاری و سفارش B2B دسترسی دارید.' 
                        : 'برای دسترسی به قیمت‌های همکاری و لیست سفارشات سریع، لطفا مدارک فنی خود را بارگذاری کنید.'}
                </p>
                
                {!isVerified && (
                    <button className="mt-4 flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-700 transition shadow-lg shadow-orange-200">
                        <Upload size={16} /> بارگذاری مدارک فنی
                    </button>
                )}
            </div>
         </div>
      </div>

      {/* Status Toggle */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between">
              <div>
                  <h3 className="font-bold text-gray-900">وضعیت فعلی</h3>
                  <p className="text-gray-500 text-xs mt-1">آیا برای دریافت کار جدید در "سرویس یاب" در دسترس هستید؟</p>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setStatus('available')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${status === 'available' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      در دسترس
                  </button>
                  <button 
                    onClick={() => setStatus('busy')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${status === 'busy' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      مشغول
                  </button>
              </div>
          </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">اطلاعات فعالیت</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">شهر محل فعالیت</label>
                  <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-orange-500 outline-none bg-gray-50 focus:bg-white transition"
                  >
                      {['تهران', 'کرج', 'مشهد', 'اصفهان', 'شیراز'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
              </div>
              
              <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-700">تخصص‌ها (چند انتخاب)</label>
                   <div className="p-3 border border-gray-200 rounded-xl bg-gray-50 h-32 overflow-y-auto space-y-2">
                       {['نصب پکیج', 'تعمیرات شوفاژ', 'لوله کشی', 'نصب رادیاتور', 'سرویس دوره ای'].map(exp => (
                           <label key={exp} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                               <input type="checkbox" className="rounded text-orange-600 focus:ring-orange-500" />
                               {exp}
                           </label>
                       ))}
                   </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-bold text-gray-700">شماره تماس (جهت نمایش به مشتری)</label>
                 <div className="relative">
                     <input 
                       type="tel" 
                       defaultValue={user?.phone} 
                       className="w-full h-12 pl-4 pr-12 rounded-xl border border-gray-200 focus:border-orange-500 outline-none bg-gray-50/50"
                       disabled
                     />
                     <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 </div>
                 <p className="text-xs text-gray-400">شماره موبایل حساب کاربری. غیر قابل تغییر در این بخش.</p>
              </div>
          </div>
          
          <div className="mt-8 flex justify-end">
              <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg shadow-gray-200">
                  ذخیره تغییرات
              </button>
          </div>
      </div>
    </div>
  );
}
