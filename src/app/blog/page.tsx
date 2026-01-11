import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import Pagination from '@/components/Pagination';
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Wrench, 
  BookOpen, 
  Tag 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'مجله فنی و آموزشی | بوتان لند',
  description: 'مرجع تخصصی آموزش تعمیرات، راهنمای خرید قطعات و اخبار دنیای تاسیسات',
};

// 1. کوئری نهایی: الان offset داخل where کار می‌کند
const GET_BLOG_DATA = `
  query GetBlogData($offset: Int!) {
    posts(first: 10, where: { offset: $offset, orderby: { field: DATE, order: DESC } }) {
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
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      }
    }
    categories(first: 5, where: { hideEmpty: true, exclude: [1] }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 2. محاسبه شماره صفحه و آفست
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const offset = (page - 1) * 10;

  // 3. دریافت دیتا
  const data = await fetchAPI(GET_BLOG_DATA, { variables: { offset } });
  
  const allPosts = data?.posts?.nodes || [];
  const categories = data?.categories?.nodes || [];

  // لاجیک نمایش: پست ویژه فقط در صفحه ۱ جدا می‌شود
  let featuredPost = null;
  let otherPosts = allPosts;

  if (page === 1 && allPosts.length > 0) {
    featuredPost = allPosts[0];
    otherPosts = allPosts.slice(1);
  }

  // بررسی وجود صفحه بعد
  const hasMore = allPosts.length === 10;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      {/* --- A. HERO SECTION --- */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -ml-10 -mb-10 pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            مرجع تخصصی <span className="text-orange-500">تعمیرات و قطعات</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            جستجو کنید، یاد بگیرید و خودتان تعمیر کنید. دسترسی به صدها مقاله آموزشی.
          </p>

          <form 
            action="/blog/search" 
            method="GET" 
            className="bg-white p-2 rounded-2xl shadow-2xl max-w-xl mx-auto flex items-center transform transition-transform hover:scale-[1.01]"
          >
            <div className="p-3 text-gray-400"><Search size={24} /></div>
            <input 
              type="text" 
              name="q" 
              placeholder="جستجو کنید (مثلاً: ارور E1 پکیج...)" 
              className="w-full h-12 outline-none text-gray-900 placeholder-gray-400 text-right px-2"
              required 
            />
            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition">
              بیابید
            </button>
          </form>
        </div>
      </div>

      {/* --- B. CATEGORIES --- */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-16">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-wrap justify-center gap-4 md:gap-8">
          {categories.map((cat: any) => (
            <Link 
              key={cat.slug} 
              href={`/blog/category/${cat.slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition font-medium text-sm group"
            >
              <span className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-orange-500 transition"></span>
              {cat.name}
              <span className="bg-gray-100 text-gray-400 text-[10px] px-2 py-0.5 rounded-full group-hover:bg-orange-100 group-hover:text-orange-600">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-7xl">
        
        {/* --- C. FEATURED POST (فقط صفحه ۱) --- */}
        {featuredPost && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-orange-600" size={20} />
              <h2 className="text-2xl font-bold text-gray-900">جدیدترین مقاله</h2>
            </div>
            
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl p-4 lg:p-6 shadow-sm hover:shadow-xl transition border border-gray-100 items-center">
                <div className="relative w-full aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden">
                  {featuredPost.featuredImage?.node && (
                    <Image 
                      src={featuredPost.featuredImage.node.sourceUrl}
                      alt={featuredPost.featuredImage.node.altText || featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">ویژه</div>
                </div>

                <div className="flex flex-col justify-center lg:pr-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    {featuredPost.categories?.nodes[0] && (
                      <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-lg">
                        {featuredPost.categories.nodes[0].name}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(featuredPost.date).toLocaleDateString('fa-IR')}</span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 leading-tight group-hover:text-orange-600 transition">
                    {featuredPost.title}
                  </h3>
                  
                  <div className="text-gray-500 mb-6 line-clamp-3 leading-7 text-sm" dangerouslySetInnerHTML={{ __html: featuredPost.excerpt }} />
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold text-gray-700">{featuredPost.author?.node?.name}</span>
                    <span className="flex items-center gap-2 text-sm font-bold text-orange-600 group-hover:gap-3 transition-all">
                      ادامه مطلب <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* --- D. CTA BANNER (فقط صفحه ۱) --- */}
        {page === 1 && (
          <section className="bg-gray-900 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
            <div className="relative z-10 text-center md:text-right">
              <h3 className="text-2xl font-bold text-white mb-2">مشکل فنی دارید؟</h3>
              <p className="text-gray-400">با کارشناسان ما تماس بگیرید یا قطعه مورد نظر خود را آنلاین سفارش دهید.</p>
            </div>
            <div className="flex gap-4 relative z-10">
              <Link href="/shop" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
                <Wrench size={18} /> خرید قطعات
              </Link>
            </div>
          </section>
        )}

        {/* --- E. POSTS GRID --- */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Tag className="text-orange-600" size={20} />
            <h2 className="text-2xl font-bold text-gray-900">
              {page === 1 ? 'سایر مقالات آموزشی' : `مقالات صفحه ${page}`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post: any) => (
              <Link key={post.databaseId} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col h-full">
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                  {post.featuredImage?.node ? (
                    <Image src={post.featuredImage.node.sourceUrl} alt={post.title} fill className="object-cover group-hover:scale-110 transition duration-700" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300"><BookOpen size={40} /></div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                     <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.date).toLocaleDateString('fa-IR')}</span>
                     <span>•</span>
                     <span className="flex items-center gap-1"><Clock size={12}/> ۵ دقیقه</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition">{post.title}</h3>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-500 font-medium">{post.author?.node?.name}</span>
                    <span className="text-orange-600 bg-orange-50 p-2 rounded-lg"><ArrowRight size={16} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* --- F. PAGINATION --- */}
          <Pagination page={page} hasMore={hasMore} basePath="/blog" />

        </section>

      </main>
    </div>
  );
}