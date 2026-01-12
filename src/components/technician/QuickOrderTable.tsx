'use client';

import React, { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { Search, ShoppingCart, Loader2, Package, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const GET_B2B_PRODUCTS = `
  query GetB2BProducts($search: String, $first: Int) {
    products(first: $first, where: { search: $search, stockStatus: IN_STOCK, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        databaseId
        sku
        name
        slug
        stockStatus
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
      }
    }
  }
`;

interface Product {
  id: string;
  databaseId: number;
  sku: string;
  name: string;
  slug: string;
  stockStatus: string;
  price: string;
  image: {
    sourceUrl: string;
    altText: string;
  } | null;
}

interface OrderRow {
  product: Product;
  quantity: number;
  isSelected: boolean;
}

export default function QuickOrderTable() {
  const { addItem, toggleCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async (query: string) => {
    setLoading(true);
    try {
      const data = await fetchAPI(GET_B2B_PRODUCTS, {
        variables: {
          search: query || '',
          first: 50
        }
      });
      
      const newProducts = data?.products?.nodes || [];
      setProducts(newProducts);
      
      // Preserve existing quantities if product is re-fetched
      setRows(prevRows => {
        return newProducts.map((p: Product) => {
          const existing = prevRows.find(r => r.product.id === p.id);
          return existing ? { ...existing, product: p } : { product: p, quantity: 0, isSelected: false };
        });
      });

    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Quantity Change
  const handleQuantityChange = (id: string, val: string) => {
    const qty = parseInt(val) || 0;
    
    setRows(prev => prev.map(row => {
      if (row.product.id === id) {
        // Auto-select if quantity > 0
        const shouldSelect = qty > 0;
        return { ...row, quantity: qty, isSelected: shouldSelect };
      }
      return row;
    }));
  };

  // Handle Checkbox Change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setRows(prev => prev.map(row => {
      if (row.product.id === id) {
        return { ...row, isSelected: checked, quantity: checked ? (row.quantity || 1) : 0 };
      }
      return row;
    }));
  };

  // Calculations
  const selectedRows = rows.filter(r => r.isSelected && r.quantity > 0);
  const totalItems = selectedRows.reduce((acc, r) => acc + r.quantity, 0);
  
  const calculateTotal = () => {
    return selectedRows.reduce((acc, row) => {
      const priceParams = row.product.price?.replace(/[^\d]/g, '') || '0';
      const price = parseInt(priceParams);
      return acc + (price * row.quantity);
    }, 0);
  };

  const handleBulkAdd = async () => {
    if (selectedRows.length === 0) return;
    
    setProcessing(true);
    
    // Simulate network delay for "processing" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    selectedRows.forEach(row => {
      const priceParams = row.product.price?.replace(/[^\d]/g, '') || '0';
      const price = parseInt(priceParams);

      addItem({
        id: row.product.databaseId?.toString() || row.product.id,
        name: row.product.name,
        price: price,
        image: row.product.image?.sourceUrl || '',
        quantity: row.quantity
      });
    });

    setProcessing(false);
    alert('محصولات با موفقیت به سبد خرید اضافه شدند!');
    toggleCart();
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px] md:h-[800px]">
      
      {/* 1. Header & Search */}
      <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Package className="text-orange-600" /> سفارش سریع (همکار)
          </h2>
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="جستجو بر اساس نام یا کد کالا..." 
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            {loading && <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 animate-spin" size={18} />}
          </div>
        </div>
      </div>

      {/* 2. Table */}
      <div className="flex-1 overflow-auto relative">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50 text-gray-500 font-bold sticky top-0 z-10">
            <tr>
              <th className="p-4 w-16 text-center">#</th>
              <th className="p-4 text-right">محصول</th>
              <th className="p-4 text-center w-32 hidden md:table-cell">کد (SKU)</th>
              <th className="p-4 text-center w-32 hidden md:table-cell">وضعیت</th>
              <th className="p-4 text-center w-40">قیمت (واحد)</th>
              <th className="p-4 text-center w-32">تعداد</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr 
                key={row.product.id} 
                className={`group transition-colors ${row.isSelected ? 'bg-orange-50/30' : 'hover:bg-gray-50'}`}
              >
                {/* Checkbox */}
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center">
                     <input 
                       type="checkbox" 
                       checked={row.isSelected}
                       onChange={(e) => handleCheckboxChange(row.product.id, e.target.checked)}
                       className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                     />
                  </div>
                </td>

                {/* Product Name & Image */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                      {row.product.image ? (
                        <Image src={row.product.image.sourceUrl} alt={row.product.name} fill className="object-contain" />
                      ) : (
                        <Package className="p-2 text-gray-400 w-full h-full" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 line-clamp-1">{row.product.name}</div>
                      <div className="md:hidden text-xs text-gray-400 mt-1 flex gap-2">
                        <span>{row.product.sku || '---'}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* SKU */}
                <td className="p-4 text-center font-mono text-gray-500 hidden md:table-cell">
                  {row.product.sku || '---'}
                </td>

                {/* Status */}
                <td className="p-4 text-center hidden md:table-cell">
                  {row.product.stockStatus === 'IN_STOCK' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      <Check size={12} /> موجود
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-full">
                      <AlertCircle size={12} /> ناموجود
                    </span>
                  )}
                </td>

                {/* Price */}
                <td className="p-4 text-center font-bold text-gray-900">
                  {row.product.price ? (
                    <span dangerouslySetInnerHTML={{ __html: row.product.price }} />
                  ) : '---'}
                </td>

                {/* Quantity Input */}
                <td className="p-4 text-center">
                  <input
                    type="number"
                    min="0"
                    value={row.quantity || ''}
                    onChange={(e) => handleQuantityChange(row.product.id, e.target.value)}
                    className={`w-20 h-10 text-center border-2 rounded-xl outline-none transition font-bold ${
                      row.quantity > 0 ? 'border-orange-500 bg-white shadow-sm' : 'border-gray-200 bg-gray-50 focus:border-gray-400'
                    }`}
                    disabled={row.product.stockStatus !== 'IN_STOCK'}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                    }}
                  />
                </td>
              </tr>
            ))}
            
            {!loading && rows.length === 0 && (
              <tr>
                 <td colSpan={6} className="p-10 text-center text-gray-400">
                    محصولی یافت نشد.
                 </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Sticky Footer */}
      <div className="p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
             <div className="flex flex-col">
               <span className="text-gray-500">تعداد اقلام</span>
               <span className="font-black text-xl text-gray-900">{totalItems} <span className="text-xs font-normal text-gray-400">عدد</span></span>
             </div>
             <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>
             <div className="flex flex-col">
               <span className="text-gray-500">مبلغ کل</span>
               <span className="font-black text-xl text-orange-600">{calculateTotal().toLocaleString()} <span className="text-xs font-normal text-gray-400">تومان</span></span>
             </div>
          </div>
          
          <button 
            disabled={totalItems === 0 || processing}
            onClick={handleBulkAdd}
            className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 disabled:shadow-none transition flex items-center justify-center gap-2"
          >
            {processing ? (
                <>
                  <Loader2 className="animate-spin" /> در حال پردازش...
                </>
            ) : (
                <>
                  <ShoppingCart /> افزودن به سبد خرید
                </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
