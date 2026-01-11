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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <Link key={product.id || product.databaseId} href={`/product/${product.slug}`} className="group bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-xl hover:border-orange-200 transition duration-300 flex flex-col h-full relative">
              
              {/* Badge موجودی */}
              {product.stockStatus === 'IN_STOCK' ? (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
                  <CheckCircle size={10} /> موجود
                </div>
              ) : (
                <div className="absolute top-3 left-3 z-10 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full">
                  ناموجود
                </div>
              )}

              <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden p-4">
                {product.image?.sourceUrl ? (
                  <Image 
                    src={product.image.sourceUrl} 
                    alt={product.image.altText || product.name} 
                    fill 
                    className="object-contain group-hover:scale-105 transition duration-500" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300"><ShoppingCart size={32} /></div>
                )}
              </div>

              <div className="flex flex-col flex-grow">
                <h2 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 leading-6 group-hover:text-orange-600 transition">
                  {product.name}
                </h2>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-gray-900 font-black text-sm">
                    {product.price ? (
                      <span dangerouslySetInnerHTML={{ __html: product.price }} />
                    ) : (
                      <span className="text-xs text-gray-400">تماس بگیرید</span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition z-20"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
          </Link>
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
