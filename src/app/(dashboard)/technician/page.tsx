import React from 'react';
import { Package, TrendingUp, Users, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function TechnicianDashboardPage() {
  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-black text-gray-900">داشبورد همکاران</h1>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-gray-500 text-sm mb-1">سفارشات این ماه</p>
                  <p className="text-3xl font-black text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package size={24} />
              </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-gray-500 text-sm mb-1">گردش مالی</p>
                  <p className="text-3xl font-black text-gray-900">45<span className="text-sm text-gray-400 font-normal mr-1">ملیون</span></p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Wallet size={24} />
              </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-gray-500 text-sm mb-1">امتیاز شما</p>
                  <p className="text-3xl font-black text-gray-900">4.8</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                  <TrendingUp size={24} />
              </div>
          </div>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Link href="/technician/quick-order" className="group bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-3xl shadow-lg shadow-orange-200 relative overflow-hidden">
               <div className="relative z-10">
                   <h3 className="font-bold text-xl mb-2">سفارش سریع محصولات</h3>
                   <p className="opacity-90 text-sm mb-6">دسترسی به لیست قیمت همکاری و ثبت سفارش آنی</p>
                   <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg font-bold text-sm group-hover:bg-white group-hover:text-orange-600 transition">شروع خرید →</span>
               </div>
               <Package className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-white opacity-10 rotate-12" />
           </Link>

           <Link href="/technician/profile" className="group bg-gray-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                   <h3 className="font-bold text-xl mb-2">تکمیل پروفایل کاری</h3>
                   <p className="opacity-70 text-sm mb-6">مدریت تخصص‌ها و وضعیت نمایش در سرویس یاب</p>
                   <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg font-bold text-sm group-hover:bg-white group-hover:text-black transition">ویرایش پروفایل →</span>
               </div>
               <Users className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-white opacity-5 rotate-12" />
           </Link>
       </div>
    </div>
  )
}
