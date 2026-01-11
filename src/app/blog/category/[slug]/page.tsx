import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Pagination from '@/components/Pagination'; // اضافه شد
import { 
  Calendar, 
  ArrowRight, 
  ChevronLeft, 
  FolderOpen,
  Tag,
  AlertCircle
} from 'lucide-react';

// 1. کوئری دریافت اطلاعات دسته‌بندی + صفحه‌بندی (Offset)
const GET_CATEGORY_DATA = `
  query GetCategoryData($slug: ID!, $offset: Int!) {
    category(id: $slug, idType: SLUG) {
      databaseId
      name
      description
      slug
      seo {
        title
        description
        canonicalUrl
      }
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
          author {
            node {
              name
            }
          }
        }
      }
    }
  }
`;

// 2. تولید متادیتای سئو
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  try {
    // برای متادیتا فقط اطلاعات دسته مهم است، آفست 0 می‌فرستیم
    const data = await fetchAPI(GET_CATEGORY_DATA, { variables: { slug: decodedSlug, offset: 0 } });
    const category = data?.category;

    if (!category) return { title: 'دسته‌بندی یافت نشد' };

    return {
      title: category.seo?.title || `${category.name} | آرشیو مقالات`,
      description: category.seo?.description || category.description || `مشاهده تمام مقالات مربوط به ${category.name}`,
      alternates: {
        canonical: category.seo?.canonicalUrl,
      }
    };
  } catch (error) {
    return { title: 'آرشیو بلاگ' };
  }
}

// 3. کامپوننت اصلی صفحه
export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // محاسبه شماره صفحه و آفست
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const offset = (page - 1) * 10;

  const data = await fetchAPI(GET_CATEGORY_DATA, { variables: { slug: decodedSlug, offset } });
  
  if (!data?.category) {
    notFound();
  }

  const { name, description, posts } = data.category;
  const postList = posts?.nodes || [];
  
  // اگر ۱۰ تا مقاله گرفتیم، یعنی احتمالاً صفحه بعد هم وجود دارد
  const hasMore = postList.length === 10;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      {/* --- A. HEADER SECTION --- */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-orange-600 transition">خانه</Link> 
            <ChevronLeft size={14} />
            <Link href="/blog" className="hover:text-orange-600 transition">بلاگ</Link> 
            <ChevronLeft size={14} />
            <span className="text-gray-900 font-bold bg-gray-100 px-2 py-1 rounded-md">{name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
                  <FolderOpen size={28} />
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                  {name}
                </h1>
              </div>
              <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                {description || `مجموعه مقالات، آموزش‌ها و راهنمایی‌های مرتبط با ${name}`}
              </p>
            </div>

            {/* Stats Badge */}
            {/* نکته: اینجا تعداد کل پست‌های دسته را دقیق نداریم مگر اینکه از pageInfo استفاده کنیم، اما فعلاً تعداد پست‌های لود شده در صفحه را نشان می‌دهیم یا می‌توان حذف کرد */}
          </div>

        </div>
      </div>

      {/* --- B. POSTS GRID --- */}
      <main className="container mx-auto px-4 max-w-7xl mt-12">
        
        {postList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postList.map((post: any) => (
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

            {/* --- PAGINATION --- */}
            <Pagination 
              page={page} 
              hasMore={hasMore} 
              basePath={`/blog/category/${decodedSlug}`} 
            />
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <AlertCircle size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">هنوز مقاله‌ای در این بخش نیست</h3>
            <p className="text-gray-500 mb-8">به زودی مقالات جدیدی در دسته‌ی {name} منتشر خواهیم کرد.</p>
            <Link href="/blog" className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition">
              بازگشت به بلاگ
            </Link>
          </div>
        )}

        {/* --- C. CATEGORY CTA (تبدیل) --- */}
        {postList.length > 0 && (
          <div className="mt-16 bg-gray-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">
                آیا قطعات مربوط به {name} را نیاز دارید؟
              </h3>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                ما تمام قطعات یدکی اورجینال را با ضمانت و ارسال فوری برای شما فراهم کرده‌ایم.
              </p>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-orange-900/20">
                مشاهده محصولات مرتبط
              </Link>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
          </div>
        )}

      </main>
    </div>
  );
}