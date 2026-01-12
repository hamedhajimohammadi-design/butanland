'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, User, LogOut, Package, ClipboardList } from 'lucide-react';
import Image from 'next/image';

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Small delay to prevent flicker if state hydration is instant but we want to be safe
    const checkAuth = () => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        
        // Role cleanup: sometimes roles are stored as "customer", sometimes "technician"
        // Ensure accurate check. Assuming 'technician' is the exact string.
        // If user is admin, also allow (optional)
        if (user?.role !== 'technician' && user?.role !== 'administrator') {
            router.push('/dashboard'); // Kick non-technicians to normal dashboard
            return;
        }

        setIsAuthorized(true);
        setChecking(false);
    };

    // Need to wait for hydration? Zustand persist handles it but a small useEffect ensures we run on client.
    checkAuth();

  }, [isLoggedIn, user, router]);

  if (checking) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
          </div>
      );
  }

  if (!isAuthorized) return null;

  const links = [
      { href: '/technician', label: 'داشبورد', icon: LayoutDashboard },
      { href: '/technician/quick-order', label: 'سفارش سریع', icon: Package },
      { href: '/technician/orders', label: 'سفارش‌های من', icon: ClipboardList },
      { href: '/technician/profile', label: 'پروفایل و تخصص', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
       {/* Sidebar - Desktop */}
       <aside className="w-64 bg-white border-l border-gray-200 hidden md:flex flex-col fixed inset-y-0 right-0 z-20">
          {/* Logo area */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-center">
             <h2 className="font-black text-xl text-orange-600 tracking-tight">پنل همکاران</h2>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
             {links.map(link => {
                 const isActive = pathname === link.href;
                 return (
                     <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                         <link.icon size={20} />
                         {link.label}
                     </Link>
                 )
             })}
          </nav>
          
          <div className="p-4 border-t border-gray-100">
             <div className="flex items-center gap-3 px-4 py-3 mb-2">
                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {user?.firstName?.[0]}
                 </div>
                 <div className="text-sm">
                    <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-green-600">تکنسین مجاز</p>
                 </div>
             </div>
             <button onClick={() => { logout(); router.push('/login'); }} className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold w-full hover:bg-red-50 rounded-xl transition text-sm">
                <LogOut size={18} /> خروج از حساب
             </button>
          </div>
       </aside>
       
       {/* Mobile Header (Simplified) */}
       <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
            <span className="font-black text-lg text-orange-600">پنل همکاران</span>
            <div className="flex gap-2">
                <Link href="/technician/quick-order" className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Package size={20} /></Link>
                <Link href="/technician" className="p-2 bg-gray-100 rounded-lg"><User size={20} /></Link>
            </div>
       </div>

       {/* Main Content */}
       <main className="flex-1 p-4 md:p-8 md:mr-64 transition-all">
          {children}
       </main>
    </div>
  )
}
