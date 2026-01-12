import React from 'react';
import QuickOrderTable from '@/components/technician/QuickOrderTable';

export const metadata = {
  title: 'سفارش سریع همکار | بوتان لند',
};

export default function TechnicianQuickOrderPage() {
  return (
    <div className="h-full flex flex-col">
       <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">پنل سفارش سریع</h1>
          <p className="text-gray-500 text-sm mt-1">لیست محصولات را مرور کنید و به سرعت سفارش دهید.</p>
       </div>
       <QuickOrderTable />
    </div>
  );
}
