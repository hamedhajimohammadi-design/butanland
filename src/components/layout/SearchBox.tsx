'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Loader2, PackageX, ChevronLeft } from 'lucide-react';
import { searchProducts } from '@/lib/api';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce: جستجو با تاخیر ۵۰۰ میلی‌ثانیه بعد از توقف تایپ
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);
        setIsOpen(true);
        try {
          const products = await searchProducts(query);
          setResults(products);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // بستن پنجره وقتی بیرون کلیک شد
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      
      {/* ورودی جستجو */}
      <div className="relative">
        <input
          type="text"
          placeholder="جستجوی نام قطعه یا شناسه محصول..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          className="w-full h-12 bg-gray-100/80 border-none rounded-xl pr-12 pl-4 text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none text-gray-700"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
        </div>
        {query && (
            <button 
                onClick={() => { setQuery(''); setIsOpen(false); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
            >
                <X size={16} />
            </button>
        )}
      </div>

      {/* نتایج جستجو (Dropdown) */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          
          {results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              <div className="p-3 text-xs font-bold text-gray-400 border-b bg-gray-50 flex justify-between">
                <span>نتایج یافت شده: {results.length} مورد</span>
                <span className="text-orange-500 cursor-pointer hover:underline">مشاهده همه</span>
              </div>
              
              {results.map((product) => (
                <Link 
                    key={product.id} 
                    href={`/product/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0 group"
                >
                  {/* تصویر محصول */}
                  <div className="relative w-12 h-12 bg-white rounded-lg border border-gray-100 overflow-hidden shrink-0">
                    {product.image ? (
                        <Image src={product.image.sourceUrl} alt={product.name} fill className="object-contain p-1" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                            <PackageX size={20}/>
                        </div>
                    )}
                  </div>

                  {/* مشخصات */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {product.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                        {product.sku && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                                SKU: {product.sku}
                            </span>
                        )}
                        {product.stockStatus !== 'IN_STOCK' && (
                             <span className="text-[10px] text-red-500 font-bold">ناموجود</span>
                        )}
                    </div>
                  </div>

                  {/* قیمت و فلش */}
                  <div className="text-left">
                    <div className="text-sm font-black text-gray-900">
                        {product.price ? parseInt(product.price.replace(/\D/g, '')).toLocaleString() : ''}
                        <span className="text-[10px] font-normal text-gray-400 mr-1">ت</span>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="text-gray-300 group-hover:text-orange-500 -mr-2" />
                </Link>
              ))}
            </div>
          ) : (
            !loading && (
                <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                    <PackageX size={48} className="mb-2 opacity-50"/>
                    <p className="text-sm">محصولی با این مشخصات پیدا نشد.</p>
                </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
