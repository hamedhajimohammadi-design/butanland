import React from 'react';
import { Clock, Calendar, User, ChevronRight, ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';

const BlogPostLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* 1. STICKY MOBILE CTA (فقط در موبایل دیده می‌شود) */}
      {/* هدف: وقتی کاربر در موبایل اسکرول می‌کند، دکمه خرید همیشه در دسترس باشد */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 p-4 shadow-2xl flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">محصول مرتبط با این آموزش</span>
          <span className="font-bold text-sm text-gray-900">پمپ سیرکولاتور ویلو اصلی</span>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
          خرید / استعلام
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 lg:pb-12">
        
        {/* 2. HEADER SECTION (ایجاد اعتماد اولیه) */}
        <header className="mb-10 max-w-4xl">
          {/* Breadcrumbs for SEO */}
          <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <span>خانه</span> <ChevronRight size={14} />
            <span>مقالات فنی</span> <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">آموزش تعویض پمپ پکیج</span>
          </nav>

          <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            راهنمای جامع عیب‌یابی و تعویض پمپ پکیج (به همراه معرفی قطعات اصلی)
          </h1>

          {/* Author & Meta Data - حیاتی برای E-E-A-T گوگل */}
          <div className="flex items-center gap-6 border-b pb-8">
            <div className="flex items-center gap-3">
              <img src="/api/placeholder/48/48" alt="Author" className="w-12 h-12 rounded-full border-2 border-blue-100" />
              <div>
                <p className="font-bold text-gray-900">حامد حاجی‌محمدی</p>
                <p className="text-xs text-gray-500">کارشناس ارشد فنی</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1"><Calendar size={16}/> بروزرسانی: ۱۴ دی ۱۴۰۴</div>
              <div className="flex items-center gap-1"><Clock size={16}/> ۷ دقیقه مطالعه</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 3. MAIN CONTENT (محتوای اصلی) */}
          <article className="lg:col-span-8">
            
            {/* TL;DR Box (خلاصه مدیریتی برای پاسخ سریع) */}
            <div className="bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-blue-900 mb-2 text-lg">پاسخ سریع</h3>
              <p className="text-blue-800 leading-relaxed">
                در ۹۰٪ مواقع، صدای ناهنجار پکیج ناشی از گریپاژ پمپ است. اگر با باز کردن پیچ دو‌سو مشکل حل نشد، نیاز به تعویض روتور یا کل پمپ دارید. مدل‌های "ویلو" و "گراندفوس" تفاوت ساختاری دارند که در ادامه بررسی می‌کنیم.
              </p>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg prose-blue max-w-none">
              <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ...</p>
              
              <h2>علائم خرابی پمپ چیست؟</h2>
              <p>توضیحات فنی در مورد علائم خرابی...</p>
              
              {/* 4. CONTEXTUAL PRODUCT CARD (تزریق محصول داخل متن) */}
              {/* این کامپوننت دقیقاً بعد از پاراگراف تشخیص خرابی قرار می‌گیرد */}
              <div className="my-10 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transform transition hover:scale-[1.01]">
                <div className="bg-gray-900 text-white text-xs py-1 px-3 font-bold uppercase tracking-wide text-center">
                  پیشنهاد کارشناس برای این مشکل
                </div>
                <div className="p-5 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-full sm:w-1/3">
                    <img src="/api/placeholder/200/200" alt="Product" className="w-full h-auto rounded-lg object-cover" />
                  </div>
                  <div className="w-full sm:w-2/3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">موجود در انبار</span>
                      <span className="flex items-center text-xs text-gray-500"><CheckCircle size={12} className="mr-1"/> ضمانت اصالت</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">پمپ پکیج ویلو (Wilo) مدل اصلی</h3>
                    <p className="text-sm text-gray-600 mb-4">مناسب برای پکیج‌های ایران رادیاتور و بوتان. با سیم‌پیچ مسی تقویت شده.</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold text-gray-900">۳,۵۰۰,۰۰۰ <span className="text-sm font-normal text-gray-500">تومان</span></span>
                      <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-blue-200 shadow-lg">
                        <ShoppingCart size={18} />
                        خرید آنلاین
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h2>آموزش تعویض گام به گام</h2>
              <p>توضیحات مراحل تعویض...</p>
              
              {/* Warning Box */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex gap-3 my-6">
                <AlertTriangle className="text-red-500 shrink-0" />
                <p className="text-red-700 text-sm">
                  <strong>هشدار ایمنی:</strong> حتماً قبل از باز کردن پمپ، برق دستگاه را قطع کنید و آب مدار را تخلیه نمایید.
                </p>
              </div>

            </div>
          </article>

          {/* 5. STICKY SIDEBAR (ستون کناری هوشمند) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* Table of Contents */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">در این صفحه می‌خوانید:</h4>
                <nav className="flex flex-col gap-3 text-sm text-gray-600">
                  <a href="#" className="hover:text-blue-600 hover:translate-x-1 transition flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> علائم خرابی پمپ
                  </a>
                  <a href="#" className="text-blue-600 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> معرفی قطعه مناسب (ویژه)
                  </a>
                  <a href="#" className="hover:text-blue-600 hover:translate-x-1 transition flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> مراحل تعویض
                  </a>
                  <a href="#" className="hover:text-blue-600 hover:translate-x-1 transition flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> ویدیو آموزشی
                  </a>
                </nav>
              </div>

              {/* Sidebar Product/Service Promo */}
              <div className="bg-gray-900 text-white p-6 rounded-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-20 -mr-10 -mt-10"></div>
                <h4 className="font-bold text-lg mb-2 relative z-10">نیاز به تعمیرکار دارید؟</h4>
                <p className="text-gray-300 text-sm mb-6 relative z-10">اگر ابزار کافی ندارید، کارشناسان ما در تهران و کرج آماده اعزام هستند.</p>
                <button className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-100 transition relative z-10">
                  درخواست تعمیرکار در محل
                </button>
              </div>

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default BlogPostLayout;