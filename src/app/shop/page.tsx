import { fetchAPI } from '@/lib/api';
import ShopClient from '@/components/shop/ShopClient';
import ShopMobileFilters from '@/components/shop/ShopMobileFilters';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Filter, 
  LayoutGrid, 
  List,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'فروشگاه قطعات | بوتان لند',
  description: 'خرید آنلاین قطعات پکیج، رادیاتور و آبگرمکن با بهترین قیمت و ضمانت اصالت.',
};

// 1. کوئری دریافت محصولات با فیلتر
const GET_SHOP_PRODUCTS = `
  query GetShopProducts($category: String, $search: String, $first: Int!, $after: String) {
    products(
      first: $first, 
      after: $after, 
      where: { 
        category: $category, 
        search: $search,
        stockStatus: IN_STOCK,
        orderby: { field: DATE, order: DESC } 
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      found
      nodes {
        id
        databaseId
        name
        slug
        shortDescription
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          stockStatus
        }
        ... on VariableProduct {
          price
          regularPrice
          stockStatus
        }
      }
    }
    # دریافت لیست دسته‌بندی‌ها برای سایدبار
    productCategories(where: { hideEmpty: true, parent: 0 }) {
      nodes {
        name
        slug
        count
        children {
          nodes {
            name
            slug
            count
          }
        }
      }
    }
  }
`;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categorySlug = typeof params.category === 'string' ? params.category : null;
  const searchQuery = typeof params.q === 'string' ? params.q : null;
  
  // دریافت دیتا از وردپرس
  const data = await fetchAPI(GET_SHOP_PRODUCTS, {
    variables: {
      category: categorySlug, // اگر نال باشد، همه را می‌آورد
      search: searchQuery,
      first: 12,
    }
  });

  const products = data?.products?.nodes || [];
  const categories = data?.productCategories?.nodes || [];
  const totalFound = data?.products?.found || 0;

  // تابع کمکی برای تشخیص اکتیو بودن لینک
  const isActive = (slug: string) => categorySlug === slug;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20 pt-24 md:pt-28">
      
      {/* Header Strip */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-30 shadow-sm transition-all">
        <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
           <h1 className="text-sm md:text-lg font-black text-gray-800 flex items-center gap-2 overflow-hidden">
             <LayoutGrid className="text-orange-500 shrink-0" size={20} />
             <span className="truncate">
               {searchQuery ? `جستجو: "${searchQuery}"` : (categorySlug ? `دسته: ${categorySlug.replace('-', ' ')}` : 'فروشگاه محصولات')}
             </span>
             <span className="hidden sm:inline-block text-[10px] md:text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mr-2 whitespace-nowrap">{totalFound} کالا</span>
           </h1>
           
           {/* Mobile Filter Button (Visible only on mobile) */}
           <ShopMobileFilters categories={categories} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* --- SIDEBAR (Desktop) --- */}
        <aside className="hidden md:block col-span-1 space-y-8">
          
          {/* Categories */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3">
              <List size={18} /> دسته‌بندی‌ها
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className={`block px-3 py-2 rounded-lg text-sm transition ${!categorySlug ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  همه محصولات
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat.slug}>
                  <Link 
                    href={`/shop?category=${cat.slug}`} 
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${isActive(cat.slug) ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{cat.count}</span>
                  </Link>
                  {/* Subcategories */}
                  {cat.children?.nodes?.length > 0 && (
                    <ul className="mr-4 mt-1 space-y-1 border-r border-gray-100 pr-2">
                       {cat.children.nodes.map((sub: any) => (
                         <li key={sub.slug}>
                           <Link href={`/shop?category=${sub.slug}`} className={`block text-xs py-1 transition ${isActive(sub.slug) ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}>
                             {sub.name}
                           </Link>
                         </li>
                       ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Banner */}
          <div className="bg-blue-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="font-black text-lg mb-2">مشاوره رایگان</h4>
               <p className="text-xs text-blue-200 mb-4">نمی‌دانید کدام قطعه مناسب دستگاه شماست؟</p>
               <Link href="/contact" className="inline-block bg-white text-blue-900 text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition">تماس با کارشناس</Link>
             </div>
             <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500 rounded-full blur-[40px] opacity-30"></div>
          </div>

        </aside>

        {/* --- PRODUCT GRID --- */}
        <main className="col-span-1 md:col-span-3">
          
          {products.length > 0 ? (
            <ShopClient 
              initialProducts={products}
              initialPageInfo={data?.products?.pageInfo}
              categorySlug={categorySlug}
              searchQuery={searchQuery}
            />
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
               <div className="bg-gray-50 p-6 rounded-full mb-4">
                 <Filter size={40} className="text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">محصولی یافت نشد!</h3>
               <p className="text-gray-500 text-sm mb-6">متاسفانه با فیلترهای انتخاب شده محصولی پیدا نشد.</p>
               <Link href="/shop" className="text-orange-600 font-bold text-sm hover:underline">
                 پاک کردن تمام فیلترها
               </Link>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}