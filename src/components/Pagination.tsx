import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  page: number;      // شماره صفحه فعلی
  hasMore: boolean;  // آیا صفحه بعدی وجود دارد؟
  basePath: string;  // آدرس پایه (مثلاً /blog یا /blog/category/news)
}

export default function Pagination({ page, hasMore, basePath }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-4 mt-16">
      {/* دکمه صفحه قبل (فقط اگر در صفحه ۲ به بعد باشیم) */}
      {page > 1 && (
        <Link 
          href={`${basePath}?page=${page - 1}`}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition shadow-sm"
        >
          <ChevronRight size={20} />
          صفحه قبل
        </Link>
      )}

      {/* نمایش شماره صفحه فعلی */}
      <span className="text-gray-400 font-medium text-sm">
        صفحه {page}
      </span>

      {/* دکمه صفحه بعد (اگر پست‌های بیشتری باشد) */}
      {hasMore && (
        <Link 
          href={`${basePath}?page=${page + 1}`}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition shadow-sm"
        >
          صفحه بعد
          <ChevronLeft size={20} />
        </Link>
      )}
    </div>
  );
}