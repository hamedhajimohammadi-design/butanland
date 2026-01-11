import { fetchAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronLeft, 
  ShoppingCart, 
  Phone,
  CheckCircle,
  Menu,
  ArrowRight,
  Layers
} from 'lucide-react';

// --- 1. کوئری دریافت مقاله اصلی ---
const GET_POST_QUERY = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      title
      content
      date
      excerpt
      slug
      featuredImage {
        node {
          sourceUrl
          altText
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
      categories {
        nodes {
          name
          slug
        }
      }
      seo {
        title
        description
        canonicalUrl
        openGraph {
          image {
            url
          }
        }
      }
      blogSettings {
        relatedproduct {
          nodes {
            ... on Product {
              id
              databaseId
              name
              slug
              image {
                sourceUrl
              }
              ... on SimpleProduct {
                price
                regularPrice
              }
              ... on VariableProduct {
                price
                regularPrice
              }
            }
          }
        }
      }
    }
  }
`;

// --- 2. کوئری دریافت مقالات مرتبط (جدید) ---
const GET_RELATED_POSTS = `
  query GetRelatedPosts($categorySlug: String, $excludeId: ID!) {
    posts(first: 3, where: { categoryName: $categorySlug, notIn: [$excludeId] }) {
      nodes {
        databaseId
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

// --- توابع کمکی ---
function extractHeadings(content: string) {
  if (!content) return [];
  const regex = /<h2[^>]*>(.*?)<\/h2>/g;
  const headings = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const cleanText = match[1].replace(/<[^>]*>?/gm, '');
    headings.push(cleanText);
  }
  return headings;
}

function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const text = content.replace(/<[^>]+>/g, '');
  const wordCount = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

// --- متادیتای سئو ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const data = await fetchAPI(GET_POST_QUERY, { variables: { slug: decodedSlug } });
    const post = data?.post;
    const seo = post?.seo;

    if (!post) return { title: 'مقاله یافت نشد | بوتان لند' };

    return {
      title: seo?.title || post.title,
      description: seo?.description || post.excerpt?.replace(/<[^>]*>?/gm, '') || '',
      alternates: {
        canonical: seo?.canonicalUrl || `https://butanland.com/blog/${decodedSlug}`,
      },
      openGraph: {
        title: seo?.title || post.title,
        description: seo?.description,
        images: seo?.openGraph?.image?.url ? [seo.openGraph.image.url] : (post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : []),
        type: 'article',
        publishedTime: post.date,
        authors: [post.author?.node?.name || 'بوتان لند'],
      },
    };
  } catch (error) {
    return { title: 'بلاگ | بوتان لند' };
  }
}

// --- کامپوننت اصلی ---
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 1. دریافت مقاله اصلی
  const data = await fetchAPI(GET_POST_QUERY, { variables: { slug: decodedSlug } });

  if (!data?.post) {
    notFound();
  }

  const post = data.post;
  const headings = extractHeadings(post.content); 
  const readingTime = calculateReadingTime(post.content);
  const relatedProduct = post.blogSettings?.relatedproduct?.nodes?.[0];

  // 2. دریافت مقالات مرتبط (اگر دسته‌بندی دارد)
  let relatedPosts = [];
  const mainCategory = post.categories?.nodes?.[0]; // اولین دسته‌بندی را به عنوان اصلی می‌گیریم

  if (mainCategory) {
    const relatedData = await fetchAPI(GET_RELATED_POSTS, {
      variables: {
        categorySlug: mainCategory.slug,
        excludeId: post.databaseId.toString() // ID مقاله فعلی را حذف می‌کنیم تا دوباره پیشنهاد نشود
      }
    });
    relatedPosts = relatedData?.posts?.nodes || [];
  }

  // اسکیما
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.featuredImage?.node?.sourceUrl || "",
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author?.node?.name || "بوتان لند"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ButanLand",
      "logo": {
        "@type": "ImageObject",
        "url": "https://butanland.com/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-24 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- Mobile Sticky CTA --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500">
            {relatedProduct ? 'محصول مرتبط موجود است' : 'نیاز به مشاوره دارید؟'}
          </span>
          <span className="font-bold text-sm text-gray-900 truncate max-w-[200px]">
            {relatedProduct ? relatedProduct.name : 'تماس با کارشناس'}
          </span>
        </div>
        <Link 
          href={relatedProduct ? `/product/${relatedProduct.slug}` : "/contact"} 
          className="bg-orange-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-orange-700 transition flex items-center gap-2"
        >
          {relatedProduct ? <ShoppingCart size={16} /> : <Phone size={16} />}
          {relatedProduct ? 'خرید' : 'تماس'}
        </Link>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        
        {/* --- Header --- */}
        <header className="max-w-5xl mx-auto mb-10">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-orange-600 transition">خانه</Link> 
            <ChevronLeft size={14} />
            <Link href="/blog" className="hover:text-orange-600 transition">بلاگ</Link> 
            {mainCategory && (
              <>
                <ChevronLeft size={14} />
                <Link href={`/blog/category/${mainCategory.slug}`} className="hover:text-orange-600 transition">{mainCategory.name}</Link>
              </>
            )}
            <ChevronLeft size={14} />
            <span className="text-gray-900 font-medium">{post.title}</span>
          </nav>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 pb-8">
            <div className="flex items-center gap-3">
              {post.author?.node?.avatar?.url ? (
                <img src={post.author.node.avatar.url} alt={post.author.node.name} className="w-10 h-10 rounded-full border border-gray-200" />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><User size={20}/></div>
              )}
              <div>
                <p className="text-sm font-bold text-gray-900">{post.author?.node?.name}</p>
                <p className="text-[10px] text-gray-500">نویسنده فنی</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 border-r border-gray-200 pr-4 mr-2">
              <div className="flex items-center gap-1"><Calendar size={14}/> {new Date(post.date).toLocaleDateString('fa-IR')}</div>
              <div className="flex items-center gap-1"><Clock size={14}/> {readingTime} دقیقه مطالعه</div>
            </div>
          </div>
        </header>

        {/* --- Main Grid --- */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Content */}
          <article className="lg:col-span-8">
            {post.featuredImage?.node && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-md">
                <Image 
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-lg prose-orange max-w-none text-justify text-gray-800 leading-9">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {post.categories?.nodes?.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.categories.nodes.map((cat: any) => (
                  <Link 
                    key={cat.slug} 
                    href={`/blog/category/${cat.slug}`}
                    className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-100 hover:text-orange-700 transition"
                  >
                    #{cat.name}
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-6">
              
              {headings.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold border-b pb-2">
                    <Menu size={18} />
                    <span>فهرست مطالب:</span>
                  </div>
                  <nav className="flex flex-col gap-3 text-sm text-gray-600 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {headings.map((head, index) => (
                      <div key={index} className="flex items-start gap-2 hover:text-orange-600 transition cursor-default">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                        {head}
                      </div>
                    ))}
                  </nav>
                </div>
              )}

              {/* Product Widget */}
              {relatedProduct ? (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden transform transition hover:-translate-y-1 duration-300">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                       <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded inline-block shadow-md">
                        پیشنهاد کارشناس
                      </span>
                      {relatedProduct.price && (
                        <span className="text-orange-300 font-bold text-sm bg-white/10 px-2 py-1 rounded">
                          {relatedProduct.price}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-4 mb-4 items-center">
                      {relatedProduct.image?.sourceUrl && (
                        <div className="w-20 h-20 bg-white rounded-xl p-1 shrink-0 overflow-hidden shadow-sm">
                          <img 
                            src={relatedProduct.image.sourceUrl} 
                            alt={relatedProduct.name}
                            className="w-full h-full object-contain hover:scale-110 transition duration-500" 
                          />
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-bold text-sm mb-1 leading-6 line-clamp-2">
                          {relatedProduct.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-green-400">
                           <CheckCircle size={10} />
                           <span>موجود و آماده ارسال</span>
                        </div>
                      </div>
                    </div>

                    <Link 
                      href={`/product/${relatedProduct.slug}`} 
                      className="block w-full text-center bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-orange-50 transition shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      خرید قطعه
                    </Link>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 animate-pulse"></div>
                </div>
              ) : (
                <div className="bg-gray-100 border border-gray-200 p-6 rounded-2xl text-center">
                   <h4 className="font-bold text-gray-900 mb-2">قطعات یدکی اورجینال</h4>
                   <Link href="/shop" className="text-white bg-gray-900 py-2.5 px-4 rounded-xl font-bold text-sm hover:bg-orange-600 transition flex items-center justify-center gap-2 shadow-lg">
                     <ShoppingCart size={16} />
                     ورود به فروشگاه
                   </Link>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* --- RELATED POSTS SECTION (بخش جدید) --- */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 pt-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                <Layers size={24} />
              </span>
              <h3 className="text-2xl font-black text-gray-900">مطالب مرتبط پیشنهادی</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost: any) => (
                <Link key={rPost.databaseId} href={`/blog/${rPost.slug}`} className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition">
                  <div className="relative w-full aspect-[16/10] bg-gray-100">
                    {rPost.featuredImage?.node && (
                      <Image 
                        src={rPost.featuredImage.node.sourceUrl}
                        alt={rPost.featuredImage.node.altText || rPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] text-gray-400 mb-2 block">{new Date(rPost.date).toLocaleDateString('fa-IR')}</span>
                    <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-orange-600 transition">
                      {rPost.title}
                    </h4>
                    <div className="mt-4 flex items-center text-xs font-bold text-orange-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      بخوانید <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}