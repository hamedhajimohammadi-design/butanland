'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Share2, CheckCircle, AlertCircle, ChevronDown, Minus, Plus, Wrench } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useCartStore } from '@/store/cart-store';
import 'swiper/css';
import 'swiper/css/pagination';

interface ProductClientProps {
  product: any;
}

export default function ProductClient({ product }: ProductClientProps) {
  const { addItem, toggleCart } = useCartStore();
  const [activeTab, setActiveTab] = useState('desc');
  const [quantity, setQuantity] = useState(1);

  // محاسبه قیمت (حذف تومان و ویرگول)
  const rawPrice = product.price ? parseInt(product.price.replace(/\D/g, '')) : 0;
  const rawRegularPrice = product.regularPrice ? parseInt(product.regularPrice.replace(/\D/g, '')) : 0;
  const discount = rawRegularPrice > rawPrice ? Math.round(((rawRegularPrice - rawPrice) / rawRegularPrice) * 100) : 0;

  // لیست تصاویر (عکس اصلی + گالری)
  const images = [product.image, ...(product.galleryImages?.nodes || [])].filter(Boolean);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: rawPrice,
      image: product.image?.sourceUrl || '',
      quantity: quantity,
    });
    toggleCart();
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-24 md:pt-28 md:pb-10 font-[family-name:var(--font-vazir)]">
      
      {/* 1. Breadcrumb & Actions (Desktop) */}
      <div className="container mx-auto px-4 py-4 hidden md:flex items-center justify-between text-sm text-gray-500">
         <div className="flex items-center gap-2">
            <span>خانه</span> / <span>محصولات</span> / <span className="text-gray-900 font-bold">{product.name}</span>
         </div>
         <div className="flex gap-4">
            <button className="hover:text-red-500 transition-colors"><Heart size={20}/></button>
            <button className="hover:text-blue-500 transition-colors"><Share2 size={20}/></button>
         </div>
      </div>

      <div className="container mx-auto px-0 md:px-4">
        <div className="bg-white md:rounded-3xl shadow-sm border-b md:border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            
            {/* 2. Mobile & Desktop Gallery */}
            <div className="w-full md:w-1/3 relative bg-white">
                <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    className="w-full aspect-square md:aspect-[4/5]"
                >
                    {images.length > 0 ? images.map((img: any, idx: number) => (
                        <SwiperSlide key={idx} className="relative flex items-center justify-center p-8">
                             <Image 
                                src={img.sourceUrl} 
                                alt={img.altText || product.name} 
                                fill 
                                className="object-contain p-4"
                                priority={idx === 0}
                             />
                        </SwiperSlide>
                    )) : (
                        <SwiperSlide className="flex items-center justify-center bg-gray-50 text-gray-300">
                             <ShoppingBag size={64} />
                        </SwiperSlide>
                    )}
                </Swiper>
                
                {/* Mobile Actions Overlay */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-3 md:hidden">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-gray-600">
                        <Heart size={20} />
                    </button>
                    <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-gray-600">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* 3. Product Info */}
            <div className="flex-1 p-6 md:p-10 flex flex-col">
                <div className="mb-4">
                    {product.stockStatus === 'IN_STOCK' ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold mb-3">
                            <CheckCircle size={14} /> موجود در انبار
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold mb-3">
                            <AlertCircle size={14} /> ناموجود
                        </span>
                    )}
                    <h1 className="text-xl md:text-3xl font-black text-gray-900 leading-snug mb-2">{product.name}</h1>
                    <span className="text-gray-400 text-xs font-mono">CODE: {product.sku || 'N/A'}</span>
                </div>

                {/* ویژگی‌های کلیدی (برای تعمیرکار) */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {product.attributes?.nodes?.slice(0, 4).map((attr: any) => (
                        <div key={attr.name} className="bg-gray-50 px-3 py-2 rounded-lg text-xs flex flex-col">
                            <span className="text-gray-400 mb-1">{attr.name}</span>
                            <span className="font-bold text-gray-800 line-clamp-1">{attr.options?.[0]}</span>
                        </div>
                    ))}
                </div>

                {/* قیمت و افزودن (فقط دسکتاپ) */}
                <div className="hidden md:block mt-auto bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                             <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 py-1">
                                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-2 hover:bg-gray-100 rounded-lg"><Minus size={16}/></button>
                                <span className="w-8 text-center font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(q => q+1)} className="p-2 hover:bg-gray-100 rounded-lg"><Plus size={16}/></button>
                             </div>
                        </div>
                        <div className="text-left">
                            {discount > 0 && (
                                <div className="flex items-center gap-2 justify-end mb-1">
                                    <span className="bg-red-500 text-white text-[10px] px-1.5 rounded font-bold">%{discount}</span>
                                    <span className="text-gray-400 line-through text-sm">{product.regularPrice}</span>
                                </div>
                            )}
                            <div className="text-2xl font-black text-gray-900">
                                {product.price ? (
                                    <span dangerouslySetInnerHTML={{ __html: product.price }} />
                                ) : (
                                    <span className="text-sm font-normal text-gray-500">تماس بگیرید</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        disabled={product.stockStatus !== 'IN_STOCK'}
                        className="w-full bg-orange-500 text-white h-14 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 disabled:bg-gray-300 disabled:shadow-none"
                    >
                        {product.stockStatus === 'IN_STOCK' ? 'افزودن به سبد خرید' : 'ناموجود'}
                    </button>
                </div>
            </div>
        </div>

        {/* 4. Tabs (Description & Specs) */}
        <div className="mt-6 md:mt-10 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-4 md:p-8">
            <div className="flex items-center gap-6 border-b border-gray-100 mb-6 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('desc')}
                    className={`pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'desc' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400'}`}
                >
                    توضیحات محصول
                </button>
                <button 
                    onClick={() => setActiveTab('specs')}
                    className={`pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'specs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400'}`}
                >
                    مشخصات فنی
                </button>
            </div>

            <div className="min-h-[200px] text-sm leading-8 text-gray-600">
                {activeTab === 'desc' && (
                    <div dangerouslySetInnerHTML={{ __html: product.description || '<p>توضیحاتی ثبت نشده است.</p>' }} />
                )}
                {activeTab === 'specs' && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {product.attributes?.nodes?.map((attr: any) => (
                            <div key={attr.name} className="flex justify-between py-3 border-b border-gray-50">
                                <span className="text-gray-500">{attr.name}</span>
                                <span className="font-bold text-gray-800">{attr.options?.join('، ')}</span>
                            </div>
                        ))}
                        {(!product.attributes?.nodes || product.attributes.nodes.length === 0) && (
                            <p>مشخصات فنی ثبت نشده است.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* 5. Mobile Sticky Footer (بخش خرید چسبان موبایل) */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 pb-safe shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
             <div className="flex-1">
                 {discount > 0 && <span className="text-xs text-gray-400 line-through block" dangerouslySetInnerHTML={{ __html: product.regularPrice }} />}
                 <span className="text-lg font-black text-gray-900">
                    {product.price ? <span dangerouslySetInnerHTML={{ __html: product.price }} /> : 'تماس بگیرید'}
                 </span>
             </div>
             <button 
                onClick={handleAddToCart}
                disabled={product.stockStatus !== 'IN_STOCK'}
                className="flex-[2] bg-orange-500 text-white h-12 rounded-xl font-bold shadow-lg shadow-orange-200 disabled:bg-gray-300 disabled:shadow-none"
             >
                {product.stockStatus === 'IN_STOCK' ? 'افزودن به سبد' : 'ناموجود'}
             </button>
        </div>
      </div>

    </div>
  );
}
