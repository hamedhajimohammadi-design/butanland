'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Filter, ChevronDown, Plus, LayoutGrid, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { loadMoreProducts } from '@/app/actions/product-actions';

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface CategoryClientProps {
  categoryName: string;
  description?: string;
  subcategories: any[];
  initialProducts: any[];
  initialPageInfo: PageInfo;
  slug: string;
}

export default function CategoryClient({ 
  categoryName, 
  description, 
  subcategories, 
  initialProducts, 
  initialPageInfo,
  slug 
}: CategoryClientProps) {
  const { addItem, toggleCart } = useCartStore();
  
  // State for products list and pagination
  const [products, setProducts] = useState(initialProducts);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [loading, setLoading] = useState(false);

  console.log("CategoryClient - Page Info:", pageInfo);
  console.log("CategoryClient - Has Next Page:", pageInfo?.hasNextPage);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    const numericPrice = product.price ? parseInt(product.price.replace(/\D/g, '')) : 0;
    
    addItem({
      id: product.id,
      name: product.name,
      price: numericPrice,
      image: product.image?.sourceUrl || '',
      quantity: 1,
    });
    toggleCart();
  };

  const handleLoadMore = async () => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor || loading) return;

    setLoading(true);
    try {
      const result = await loadMoreProducts(slug, pageInfo.endCursor);
      
      if (result.success) {
        setProducts((prev) => [...prev, ...result.products]);
        setPageInfo(result.pageInfo);
      }
    } catch (error) {
      console.error('Failed to load more products', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Header Section */}
      <div className="bg-white border-b border-gray-100 px-4 py-6 md:py-10">
        <div className="container mx-auto">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{categoryName}</h1>
            {description && (
                <div 
                    className="text-sm text-gray-500 max-w-2xl leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: description }} 
                />
            )}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        
        {/* 2. Subcategories Grid (Show ONLY if they exist) */}
        {subcategories.length > 0 && (
            <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <LayoutGrid size={20} className="text-orange-500"/>
                    دسته بندی‌های {categoryName}
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {subcategories.map((sub: any) => (
                        <Link href={`/product-category/${sub.slug}`} key={sub.id} className="group">
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-3 transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                                <div className="w-12 h-12 md:w-16 md:h-16 relative bg-gray-50 rounded-xl overflow-hidden">
                                   {sub.image?.sourceUrl ? (
                                     <Image src={sub.image.sourceUrl} alt={sub.name} fill className="object-contain p-2" />
                                   ) : (
                                     <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <LayoutGrid size={24} />
                                     </div>
                                   )}
                                </div>
                                <span className="text-xs md:text-sm font-bold text-gray-700 text-center">{sub.name}</span>
                                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{sub.count} کالا</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

        {/* 3. Toolbar (Filter & Sort) */}
        <div className="flex items-center justify-between mb-6 sticky top-20 z-30 bg-gray-50/95 backdrop-blur py-2">
            <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:border-orange-500 transition-colors">
                    <Filter size={18} />
                    <span>فیلترها</span>
                </button>
                <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700">
                    <span>مرتب‌سازی:</span>
                    <span className="text-orange-600 cursor-pointer">جدیدترین</span>
                    <ChevronDown size={14} />
                </div>
            </div>
            <span className="text-sm text-gray-500 font-medium">{products.length} کالا</span>
        </div>

        {/* 4. Products Grid */}
        {products.length > 0 ? (
            <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.map((product: any) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            key={product.id}
                            className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-xl transition-shadow relative group"
                        >
                            <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden">
                            {product.image?.sourceUrl ? (
                                <Image
                                src={product.image.sourceUrl}
                                alt={product.name}
                                fill
                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                    <ShoppingBag size={32} opacity={0.5} />
                                </div>
                            )}
                            {product.stockStatus !== 'IN_STOCK' && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                    <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">ناموجود</span>
                                </div>
                            )}
                            </Link>
                            
                            <div className="flex-1 flex flex-col">
                                <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 mb-2 leading-relaxed min-h-[40px]">
                                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                                </h4>
                                <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900">
                                            {product.price ? product.price : 'تماس بگیرید'}
                                        </span>
                                    </div>
                                    {product.stockStatus === 'IN_STOCK' && (
                                        <button 
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Load More Button */}
                {pageInfo.hasNextPage && (
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-white border border-orange-200 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                            {loading ? 'در حال دریافت...' : 'مشاهده بیشتر'}
                        </button>
                    </div>
                )}
            </>
        ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">محصولی در این دسته یافت نشد</h3>
                <p className="text-gray-500 text-sm mt-2">لطفاً دسته‌بندی‌های دیگر را بررسی کنید.</p>
            </div>
        )}

      </div>
    </div>
  );
}
