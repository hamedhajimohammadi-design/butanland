import React from 'react';
import ServiceFinderClient from '@/components/technician/ServiceFinderClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'یافتن سرویس‌کار مجاز | بوتان لند',
  description: 'لیست تکنسین‌ها و سرویس‌کاران مجاز بوتان در سراسر ایران',
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-20"> 
         {/* pt-20 to account for fixed header height approx */}
         <ServiceFinderClient />
      </main>
    </div>
  )
}
