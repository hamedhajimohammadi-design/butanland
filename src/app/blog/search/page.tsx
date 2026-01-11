import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  Search, 
  Calendar, 
  ArrowRight, 
  ChevronLeft, 
  FileQuestion,
  Tag
} from 'lucide-react';

// 1. کوئری جستجو در وردپرس
const SEARCH_QUERY = `
  query SearchPosts($search: String!) {
    posts(first: 20, where: { search: $search }) {
      nodes {
        databaseId
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const metadata: Metadata = {
  title: 'نتایج جستجو | بوتان لند',
  description: 'جستجو در مقالات و آموزش‌های فنی',
  robots: {
    index: false, // معمولاً صفحات سرچ را نوایندکس می‌کنند تا سئو خراب نشود
    follow: true,
  },
};

// 2. کامپوننت صفحه جستجو
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q; // دریافت کلمه سرچ شده از URL
  
  // اگر کلمه‌ای سرچ نشده بود
  const searchTerm = typeof query === 'string' ? query : '';

  let posts = [];
  
  if (searchTerm) {
    const data = await fetchAPI(SEARCH_QUERY, { variables: { search: searchTerm } });
    posts = data?.posts?.nodes || [];
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      {/* --- Header & Search Bar --- */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-orange-600 transition">خانه</Link> 
            <ChevronLeft size={14} />
            <Link href="/blog" className="hover:text-orange-600 transition">بلاگ</Link> 
            <ChevronLeft size={14} />
            <span className="text-gray-900 font-bold">جستجو</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">
            {searchTerm ? `نتایج برای: "${searchTerm}"` : 'جستجو در مقالات'}
          </h1>

          {/* فرم جستجو مجدد */}
          <form action="/blog/search" method="GET" className="relative max-w-xl">
            <input 
              type="text" 
              name="q"
              defaultValue={searchTerm}
              placeholder="جستجو کنید (مثلاً: ارور پکیج...)" 
              className="w-full h-14 bg-gray-100 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl pr-12 pl-4 outline-none transition text-gray-900 font-medium"
            />
            <Search className="absolute right-4 top-4 text-gray-400" size={24} />
          </form>
        </div>
      </div>

      {/* --- Results Grid --- */}
      <main className="container mx-auto px-4 max-w-7xl mt-10">
        
        {searchTerm && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link key={post.databaseId} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col h-full">
                {/* Image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                  {post.featuredImage?.node ? (
                    <Image 
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <Tag size={40} />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                     <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.date).toLocaleDateString('fa-IR')}</span>
                     {post.categories?.nodes[0] && (
                       <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                         {post.categories.nodes[0].name}
                       </span>
                     )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition">
                    {post.title}
                  </h3>
                  
                  <div 
                    className="text-gray-500 text-xs leading-6 line-clamp-2 mb-4 flex-grow"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">{post.author?.node?.name}</span>
                    <span className="text-orange-600 bg-orange-50 p-2 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // --- Empty State ---
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center px-4">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <FileQuestion size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'نتیجه‌ای یافت نشد' : 'لطفا عبارتی را جستجو کنید'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md">
              {searchTerm 
                ? `متاسفانه مقاله‌ای برای "${searchTerm}" پیدا نکردیم. لطفاً با کلمات دیگری تلاش کنید.`
                : 'برای دسترسی به مقالات آموزشی، موضوع مورد نظر خود را در کادر بالا بنویسید.'}
            </p>
            <Link href="/blog" className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition">
              مشاهده آخرین مقالات
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}