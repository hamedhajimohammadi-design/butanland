import { Metadata } from 'next';
import QuickOrderTable from '@/components/b2b/QuickOrderTable';

export const metadata: Metadata = {
  title: 'سفارش سریع (عمده) | بوتان لند',
  description: 'پنل سفارش سریع مخصوص همکاران و خریداران عمده',
};

export default function QuickOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 md:pt-32">
       <div className="container mx-auto px-4">
          
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">پنل سفارش سریع</h1>
            <p className="text-gray-500">لیست محصولات را جستجو کنید و تعداد مورد نظر را وارد نمایید.</p>
          </div>

          <QuickOrderTable />
          
       </div>
    </div>
  );
}
