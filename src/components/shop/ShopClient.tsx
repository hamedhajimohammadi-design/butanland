'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { loadMoreShopProducts } from '@/app/actions/product-actions';

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface ShopClientProps {
  initialProducts: any[];
  initialPageInfo: PageInfo;
  categorySlug?: string | null;
  searchQuery?: string | null;
}

export default function ShopClient({ 
  initialProducts, 
  initialPageInfo,
  categorySlug,
  searchQuery
}: ShopClientProps) {
  const { addItem, toggleCart } = useCartStore();
  
  const [products, setProducts] = useState(initialProducts);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [loading, setLoading] = useState(false);

  // Sync state with props when navigation happens
  useEffect(() => {
    setProducts(initialProducts);
    setPageInfo(initialPageInfo);
  }, [initialProducts, initialPageInfo]);

  // Debug logs
  console.log("ShopClient - Initial PageInfo:", initialPageInfo);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation(); // Stop navigation to product page
    
    const numericPrice = product.price ? parseInt(product.price.replace(/\D/g, '')) : 0;
    
    addItem({
      id: product.databaseId || product.id,
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
      const result = await loadMoreShopProducts(pageInfo.endCursor, categorySlug, searchQuery);
      
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
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {products.map((product: any) => (
          <div key={product.id || product.databaseId} className="group bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-4 hover:shadow-xl hover:border-orange-200 transition duration-300 flex flex-col h-full relative cursor-pointer">
              
              {/* لینک نامرئی روی کل کارت برای کلیک‌پذیری */}
              <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10" aria-label={product.name} />

              {/* Badge موجودی */}
              {product.stockStatus === 'IN_STOCK' ? (
                <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex items-center gap-1 bg-green-50 text-green-700 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full pointer-events-none">
                  <CheckCircle size={10} /> موجود
                </div>
              ) : (
                <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 bg-gray-100 text-gray-500 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full pointer-events-none">
                  ناموجود
                </div>
              )}

              <div className="relative aspect-square mb-3 md:mb-4 bg-gray-50 rounded-lg md:rounded-xl overflow-hidden p-2 md:p-4">
                {product.image?.sourceUrl ? (
                  <Image 
                    src={product.image.sourceUrl} 
                    alt={product.image.altText || product.name} 
                    fill 
                    className="object-contain group-hover:scale-105 transition duration-500" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300"><ShoppingCart size={24} /></div>
                )}
              </div>

              <div className="flex flex-col flex-grow">
                <h2 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 mb-2 leading-5 md:leading-6 group-hover:text-orange-600 transition z-0">
                  {product.name}
                </h2>
                
                <div className="mt-auto pt-3 md:pt-4 border-t border-gray-50 flex items-center justify-between relative z-20">
                  {/* قیمت */}
                  <div className="text-gray-900 font-black text-xs md:text-sm">
                    {product.price ? (
                      <span dangerouslySetInnerHTML={{ __html: product.price }} />
                    ) : (
                      <span className="text-[10px] text-gray-400">تماس بگیرید</span>
                    )}
                  </div>
                  {/* دکمه افزودن - Z-Index بالاتر برای کلیک */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition"
                    title="افزودن به سبد خرید"
                  >
                    <ShoppingCart size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
          </div>
        ))}
      </div>

      {/* Pagination Button */}
      {pageInfo.hasNextPage && (
          <div className="mt-12 text-center">
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2 mx-auto disabled:opacity-50"
            >
               {loading && <Loader2 className="animate-spin" size={16} />}
               {loading ? 'در حال دریافت...' : 'مشاهده بیشتر'}
            </button>
          </div>
      )}
    </>
  );
}
