'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronLeft, 
  Plus, 
  ShoppingBag, 
  ArrowLeft,
  Wrench,
  ShieldCheck,
  Truck,
  PhoneCall
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// --- Types ---
interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  stockStatus: string;
  image: {
    sourceUrl: string;
    altText: string;
  } | null;
}

interface Post {
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    }
  } | null;
}

interface HomePageClientProps {
  products: Product[];
  posts: Post[];
}

// ✅ تنظیم دقیق نام فایل‌ها و لینک‌ها بر اساس تصاویر ارسالی شما
const QUICK_ACCESS = [
  // 1. خرید پکیج -> نامک طبق تصویر: wall-mounted-gas-boiler
  { id: 1, label: 'خرید پکیج', icon: '/icons/boiler.png', href: '/shop?category=wall-mounted-gas-boiler' },
  
  // 2. قطعات یدکی -> (فرض بر این است که نامک spare-parts باشد، اگر چیز دیگری است تغییر دهید)
  { id: 2, label: 'قطعات یدکی', icon: '/icons/spare-parts.png', href: '/shop?category=spare-parts' },
  
  // 3. رادیاتور
  { id: 3, label: 'رادیاتور', icon: '/icons/radiator.png', href: '/shop?category=radiator' },
  
  // 4. آبگرمکن -> نامک طبق تصویر: water-heaters
  { id: 4, label: 'آبگرمکن', icon: '/icons/water-heater.png', href: '/shop?category=water-heaters' },
  
  // 5. تصفیه آب
  { id: 5, label: 'تصفیه آب', icon: '/icons/purifier.png', href: '/shop?category=water-purifier' },
  
  // 6. ابزار کار
  { id: 6, label: 'ابزار کار', icon: '/icons/tools.png', href: '/shop?category=tools' },
  
  // 7. لیست خطاها -> لینک به بلاگ
  { id: 7, label: 'لیست خطاها', icon: '/icons/error-codes.png', href: '/blog/category/error-codes' },
  
  // 8. درخواست سرویس -> لینک به صفحه خدمات
  { id: 8, label: 'درخواست سرویس', icon: '/icons/onlineservice.png', href: '/service' },
];

export default function HomePageClient({ products = [], posts = [] }: HomePageClientProps) {
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const rawPrice = product.price?.replace(/[^\d]/g, '') || '0';
    const numericPrice = parseInt(rawPrice, 10);

    addItem({
      id: product.id,
      name: product.name,
      price: isNaN(numericPrice) ? 0 : numericPrice,
      image: product.image?.sourceUrl || '',
      quantity: 1,
    });
    toggleCart(); 
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans text-gray-800" dir="rtl">
      
      {/* 1. HERO SECTION & SEARCH */}
      <section className="relative bg-slate-900 text-white pt-12 pb-32 px-4 rounded-b-[3rem] shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-2xl md:text-5xl font-black mb-6 leading-tight">
            مرجع تخصصی <span className="text-orange-500">قطعات پکیج</span> و تاسیسات
          </h1>
          <p className="text-gray-300 text-sm md:text-lg mb-8 max-w-2xl mx-auto opacity-90">
            تامین قطعات اورجینال بوتان و ایران رادیاتور | ارسال فوری به سراسر کشور
          </p>

          <form action="/shop" className="bg-white p-2 rounded-2xl shadow-2xl max-w-2xl mx-auto flex items-center group focus-within:ring-4 ring-orange-500/30 transition">
            <div className="p-3 text-gray-400"><Search size={24} /></div>
            <input 
              type="text" 
              name="q"
              placeholder="جستجوی قطعه، کد ارور یا نام محصول..." 
              className="w-full h-12 outline-none text-gray-900 placeholder-gray-400 text-right px-2 bg-transparent"
            />
            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 text-sm md:text-base whitespace-nowrap">
              جستجو
            </button>
          </form>
        </div>
      </section>

      {/* 2. QUICK ACCESS ICONS (بزرگ‌تر شده + اسکرول) */}
      <section className="container mx-auto px-4 -mt-20 relative z-20 mb-16">
        <div className="flex md:grid md:grid-cols-8 gap-5 overflow-x-auto pb-8 md:pb-0 no-scrollbar px-2" style={{ scrollSnapType: 'x mandatory' }}>
          {QUICK_ACCESS.map((item) => (
            <Link key={item.id} href={item.href} className="flex flex-col items-center gap-3 group min-w-[110px] snap-start">
              
              <div className="relative w-28 h-28 md:w-32 md:h-32 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-gray-200/50 border border-white group-hover:-translate-y-2 transition-all duration-300">
                <div className="relative w-16 h-16 md:w-20 md:h-20 transition-transform group-hover:scale-110 duration-300">
                  <Image 
                    src={item.icon} 
                    alt={item.label}
                    fill
                    className="object-contain drop-shadow-sm"
                    sizes="(max-width: 768px) 64px, 80px"
                  />
                </div>
              </div>
              
              <span className="text-sm font-bold text-gray-800 text-center leading-tight group-hover:text-orange-600 transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PROMOTIONAL BANNERS */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-800 to-slate-800 rounded-3xl p-8 relative overflow-hidden text-white flex flex-col justify-center min-h-[220px] shadow-lg group cursor-pointer hover:shadow-2xl transition duration-300">
            <div className="relative z-10 max-w-[65%]">
              <span className="bg-orange-500 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-lg shadow-orange-500/30">فروش ویژه</span>
              <h3 className="text-2xl md:text-3xl font-black mb-2">پکیج‌های دیواری</h3>
              <p className="text-sm text-gray-300 mb-6">نمایندگی رسمی فروش و خدمات پس از فروش</p>
              <Link href="/shop?category=wall-mounted-gas-boiler" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10">
                مشاهده محصولات <ArrowLeft size={16} />
              </Link>
            </div>
            {/* تصویر پس‌زمینه بنر */}
            <div className="absolute left-4 bottom-4 w-36 h-36 opacity-90 group-hover:scale-110 transition duration-500 rotate-12 group-hover:rotate-0">
               <Image src="/icons/boiler.png" alt="Package" fill className="object-contain" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-rose-600 rounded-3xl p-8 relative overflow-hidden text-white flex flex-col justify-center min-h-[220px] shadow-lg group cursor-pointer hover:shadow-2xl transition duration-300">
            <div className="relative z-10 max-w-[65%]">
              <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block border border-white/20">قطعات نایاب</span>
              <h3 className="text-2xl md:text-3xl font-black mb-2">برد و قطعات خاص</h3>
              <p className="text-sm text-orange-100 mb-6">تضمین اصالت برد با گارانتی تعویض بی قید و شرط</p>
              <Link href="/shop?category=spare-parts" className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-lg">
                خرید قطعه <ArrowLeft size={16} />
              </Link>
            </div>
             <div className="absolute left-4 bottom-4 w-36 h-36 opacity-90 group-hover:scale-110 transition duration-500 -rotate-12 group-hover:rotate-0">
               <Image src="/icons/spare-parts.png" alt="Parts" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT SLIDER */}
      <section className="container mx-auto px-4 mb-20 pl-0">
        <div className="flex items-center justify-between mb-8 pl-4">
          <h3 className="text-xl md:text-3xl font-black text-gray-900 border-r-4 border-orange-500 pr-4">
            پرفروش‌ترین‌های هفته
          </h3>
          <Link href="/shop" className="text-blue-600 text-sm font-bold flex items-center hover:text-blue-700 hover:gap-1 transition-all bg-blue-50 px-4 py-2 rounded-xl">
            مشاهده همه <ChevronLeft size={18} />
          </Link>
        </div>

        {products && products.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.3}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              480: { slidesPerView: 2.2 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4.5 },
              1280: { slidesPerView: 5.2 },
            }}
            className="!pb-12 !pl-4 products-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-orange-100 transition-all duration-300 flex flex-col h-full group relative">
                  
                  <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden p-6 group-hover:bg-orange-50/30 transition-colors">
                    {product.image?.sourceUrl ? (
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                         <ShoppingBag size={40} opacity={0.3} />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 leading-6 min-h-[48px] group-hover:text-orange-600 transition-colors">
                      <Link href={`/product/${product.slug}`}>{product.name}</Link>
                    </h4>
                    
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-gray-900">
                          {product.price ? (
                            <span dangerouslySetInnerHTML={{ __html: product.price }} />
                          ) : (
                            <span className="text-gray-400 text-xs font-bold">تماس بگیرید</span>
                          )}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-11 h-11 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg shadow-gray-200 hover:bg-orange-600 hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300"
                      >
                        <Plus size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 mx-4">
             <ShoppingBag className="mx-auto text-gray-300 mb-3" size={48} />
             <p className="text-gray-400 text-sm">محصولی برای نمایش یافت نشد</p>
          </div>
        )}
      </section>

      {/* 5. TECHNICIAN CTA */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl shadow-slate-900/20">
          <div className="relative z-10 flex-1 text-center md:text-right">
             <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-blue-500/30 backdrop-blur-sm">
                <Wrench size={14} />
                <span>باشگاه متخصصین بوتان‌لند</span>
             </div>
             <h3 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">همکار یا سرویس‌کار هستید؟</h3>
             <p className="text-gray-400 mb-8 text-sm md:text-lg leading-relaxed max-w-2xl">
               با عضویت در باشگاه متخصصین، قطعات را با <strong>قیمت عمده (همکاری)</strong> بخرید، به بانک اطلاعاتی ارورها دسترسی داشته باشید و سفارشات خود را با اولویت ارسال دریافت کنید.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
               <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/50 hover:-translate-y-1">
                 ثبت نام همکاران
               </button>
               <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">
                 ورود به پنل
               </button>
             </div>
          </div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none -ml-20 -mt-20" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-600 rounded-full blur-[150px] opacity-10 pointer-events-none -mr-20 -mb-20" />
        </div>
      </section>

      {/* 6. LATEST BLOG POSTS */}
      <section className="container mx-auto px-4 mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 border-r-4 border-blue-600 pr-4">آخرین دانستنی‌ها</h2>
          <Link href="/blog" className="text-gray-500 text-sm font-bold hover:text-orange-600 transition bg-gray-100 px-4 py-2 rounded-xl">
            ورود به بلاگ
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
             <Link key={post.databaseId} href={`/blog/${post.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1">
                <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                  {post.featuredImage?.node && (
                    <Image 
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-700"
                    />
                  )}
                  {/* تاریخ */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-lg">
                    {new Date(post.date).toLocaleDateString('fa-IR')}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                   <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-orange-600 transition-colors">
                     {post.title}
                   </h3>
                   <div 
                      className="text-gray-500 text-sm leading-6 line-clamp-2 mt-auto"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                   />
                </div>
             </Link>
          ))}
        </div>
      </section>

      {/* 7. TRUST BADGES */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
           {[
              { title: "ضمانت اصالت", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
              { title: "ارسال فوری", icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "مشاوره رایگان", icon: PhoneCall, color: "text-purple-600", bg: "bg-purple-50" },
              { title: "تضمین قیمت", icon: Wrench, color: "text-orange-600", bg: "bg-orange-50" },
           ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 text-center group">
                 <div className={`p-5 rounded-[1.5rem] ${badge.bg} mb-1 group-hover:scale-110 transition-transform duration-300`}>
                    <badge.icon size={32} className={badge.color} />
                 </div>
                 <span className="text-sm md:text-base font-bold text-gray-700">{badge.title}</span>
              </div>
           ))}
        </div>
      </section>

    </div>
  );
}