'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, X, List, ChevronDown, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ShopMobileFiltersProps {
  categories: any[];
}

export default function ShopMobileFilters({ categories }: ShopMobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer when URL changes (user selected a category)
  useEffect(() => {
    setIsOpen(false);
  }, [currentCategory]);

  const isActive = (slug: string) => currentCategory === slug;

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-orange-100 hover:text-orange-600 transition"
      >
        <Filter size={14} /> فیلتر
      </button>

      {/* Drawer */}
      {mounted && createPortal(
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className={`fixed inset-y-0 right-0 w-80 max-w-[80%] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Filter size={18} className="text-orange-600" /> فیلتر محصولات
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
               <div className="mb-6">
                 <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                   <List size={16} /> دسته‌بندی‌ها
                 </h4>
                 
                 <ul className="space-y-1">
                    <li>
                      <Link 
                        href="/shop" 
                        className={`flex items-center justify-between p-2 rounded-lg text-sm transition ${!currentCategory ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                         <span>همه محصولات</span>
                         {!currentCategory && <Check size={14} />}
                      </Link>
                    </li>
                    {categories.map((cat: any) => (
                      <div key={cat.slug} className="mb-1">
                        <li>
                          <Link 
                            href={`/shop?category=${cat.slug}`} 
                            className={`flex items-center justify-between p-2 rounded-lg text-sm transition ${isActive(cat.slug) ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            <span>{cat.name}</span>
                            {isActive(cat.slug) && <Check size={14} />}
                          </Link>
                        </li>
                        {/* Subcategories */}
                        {cat.children?.nodes?.length > 0 && (
                           <ul className="mr-4 space-y-1 border-r border-gray-100 pr-2 my-1">
                              {cat.children.nodes.map((sub: any) => (
                                <li key={sub.slug}>
                                  <Link 
                                    href={`/shop?category=${sub.slug}`} 
                                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition ${isActive(sub.slug) ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                  >
                                    <span>{sub.name}</span>
                                    {isActive(sub.slug) && <Check size={12} />}
                                  </Link>
                                </li>
                              ))}
                           </ul>
                        )}
                      </div>
                    ))}
                 </ul>
               </div>
            </div>

            <div className="p-5 border-t border-gray-100">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition"
                >
                  مشاهده نتایج
                </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
