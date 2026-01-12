'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { 
  Package, MapPin, LogOut, 
  Settings, Phone, ChevronLeft, Wallet, FileText, Loader2 
} from 'lucide-react';
import UpgradeToPartner from '@/components/dashboard/UpgradeToPartner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, logout, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  
  // States برای دیتای واقعی
  const [realUserData, setRealUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // دریافت اطلاعات جامع کاربر از وردپرس
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('https://www.butanland.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query GetDashboardData {
                viewer {
                  firstName
                  lastName
                  databaseId
                  description
                  orders(first: 5) {
                    nodes {
                      databaseId
                      date
                      status
                      total
                    }
                  }
                  # اگر کد PHP مربوط به کیف پول را اضافه کرده باشید:
                  # walletBalance 
                }
              }
            `,
          }),
        });

        const result = await response.json();
        if (result.data?.viewer) {
          setRealUserData(result.data.viewer);
        }
      } catch (error) {
        console.error("خطا در بارگذاری داده‌های داشبورد:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isLoggedIn, router, token]);

  if (!mounted || !isLoggedIn) return null;

  // تابع کمکی برای تبدیل وضعیت سفارش به فارسی
  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'PROCESSING': return { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-600' };
      case 'COMPLETED': return { label: 'تکمیل شده', color: 'bg-green-50 text-green-600' };
      case 'CANCELLED': return { label: 'لغو شده', color: 'bg-red-50 text-red-600' };
      case 'PENDING': return { label: 'در انتظار پرداخت', color: 'bg-orange-50 text-orange-600' };
      default: return { label: status, color: 'bg-gray-50 text-gray-600' };
    }
  };

  const menuItems = [
    { icon: Package, title: 'سفارش‌های من', href: '/dashboard/orders' },
    { icon: MapPin, title: 'آدرس‌ها', href: '/dashboard/addresses' },
    { icon: Wallet, title: 'کیف پول و تراکنش‌ها', href: '/dashboard/wallet' },
    { icon: Phone, title: 'پشتیبانی', href: '/dashboard/support' },
    { icon: Settings, title: 'اطلاعات حساب', href: '/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-[family-name:var(--font-vazir)]">
      <div className="container mx-auto max-w-5xl">
        
        {/* هدر و خوش‌آمدگویی */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-black text-gray-900">داشبورد کاربری</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {loading ? 'در حال دریافت اطلاعات...' : `خوش آمدی، ${realUserData?.firstName || user?.firstName || 'کاربر'} عزیز 👋`}
                </p>
            </div>
            <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition">
                <LogOut size={18} />
                <span>خروج</span>
            </button>
        </div>

        {/* --- بنر ارتقاء حساب همکار (فقط برای مشتریان عادی) --- */}
        {user?.role !== 'technician' && user?.role !== 'administrator' && (
           <div id="upgrade-section">
             <UpgradeToPartner />
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* سایدبار */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4 text-2xl font-black">
                        {loading ? <Loader2 className="animate-spin" /> : (realUserData?.firstName?.charAt(0) || user?.firstName?.charAt(0))}
                    </div>
                    <h2 className="font-bold text-gray-900">
                      {realUserData ? `${realUserData.firstName} ${realUserData.lastName}` : `${user?.firstName} ${user?.lastName}`}
                    </h2>
                    <span className="text-gray-400 text-sm mb-4" dir="ltr">{user?.phone}</span>
                    
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 mb-6">
                        {user?.role === 'customer' ? 'کاربر عادی' : 'همکار / تعمیرکار'}
                    </div>

                    <div className="w-full h-px bg-gray-100 mb-6"></div>

                    <nav className="w-full space-y-2">
                        {menuItems.map((item, idx) => (
                            <Link key={idx} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-orange-500 transition-colors group">
                                <item.icon size={20} className="group-hover:scale-110 transition-transform"/>
                                <span className="text-sm font-bold">{item.title}</span>
                            </Link>
                        ))}
                        
                        {/* لینک ارتقاء حساب همکار در منو */}
                        {user?.role !== 'technician' && user?.role !== 'administrator' && (
                           <button onClick={() => document.getElementById('upgrade-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors group w-full text-right mt-2 border-t pt-4">
                               <FileText size={20} className="group-hover:scale-110 transition-transform"/>
                               <span className="text-sm font-bold">ارتقاء به حساب همکار</span>
                           </button>
                        )}
                    </nav>
                </div>
            </div>

            {/* محتوای اصلی */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* آمار و کیف پول */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* کارت کیف پول (واقعی) */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-8 opacity-80">
                                <Wallet size={20} />
                                <span className="text-sm font-bold">موجودی کیف پول</span>
                            </div>
                            <div className="text-3xl font-black mb-1">
                              {realUserData?.walletBalance ? Number(realUserData.walletBalance).toLocaleString() : '۰'} 
                              <span className="text-sm font-normal opacity-60 mr-1">تومان</span>
                            </div>
                            <Link href="/dashboard/wallet" className="text-[10px] text-orange-400 mt-2 flex items-center gap-1 hover:underline">
                                افزایش موجودی و تاریخچه
                                <ChevronLeft size={12} />
                            </Link>
                        </div>
                    </div>

                    {/* سفارشات جاری (واقعی) */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-orange-200 transition-colors group">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                <Package size={22} />
                            </div>
                            <span className="text-2xl font-black text-gray-900">
                              {realUserData?.orders?.nodes?.filter((o:any) => o.status === 'PROCESSING').length || 0}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-700">سفارشات جاری</h3>
                            <p className="text-xs text-gray-400 mt-1 text-justify">موارد در حال آماده‌سازی</p>
                        </div>
                    </div>

                    {/* امتیاز (فعلاً ثابت) */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-orange-200 transition-colors group">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                                <FileText size={22} />
                            </div>
                            <span className="text-2xl font-black text-gray-900">۱۲۵</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-700">امتیاز بوتان‌لند</h3>
                            <p className="text-xs text-gray-400 mt-1">باشگاه مشتریان همکار</p>
                        </div>
                    </div>
                </div>

                {/* لیست سفارشات اخیر (واقعی) */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Package size={20} className="text-orange-500"/>
                            آخرین سفارشات ثبت شده
                        </h3>
                        <Link href="/dashboard/orders" className="text-xs text-blue-500 font-bold hover:underline">مشاهده همه</Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="p-4">شماره</th>
                                    <th className="p-4">تاریخ</th>
                                    <th className="p-4">مبلغ کل</th>
                                    <th className="p-4">وضعیت</th>
                                    <th className="p-4 text-left">جزئیات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                  <tr><td colSpan={5} className="p-10 text-center text-gray-400">در حال بارگذاری اطلاعات...</td></tr>
                                ) : (realUserData?.orders?.nodes?.length > 0 ? (
                                  realUserData.orders.nodes.map((order: any) => {
                                    const status = getStatusInfo(order.status);
                                    return (
                                      <tr key={order.databaseId} className="hover:bg-gray-50 transition-colors">
                                          <td className="p-4 font-bold text-gray-900">#{order.databaseId}</td>
                                          <td className="p-4 text-gray-500">{new Date(order.date).toLocaleDateString('fa-IR')}</td>
                                          <td className="p-4 font-bold text-gray-700">{order.total}</td>
                                          <td className="p-4">
                                            <span className={`${status.color} px-2 py-1 rounded-lg text-xs font-bold`}>
                                              {status.label}
                                            </span>
                                          </td>
                                          <td className="p-4 text-left">
                                              <Link href={`/dashboard/orders/${order.databaseId}`} className="text-orange-500 hover:bg-orange-50 p-2 rounded-lg inline-block">
                                                  <ChevronLeft size={20} />
                                              </Link>
                                          </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr><td colSpan={5} className="p-10 text-center text-gray-400">هنوز سفارشی ثبت نکرده‌اید.</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}