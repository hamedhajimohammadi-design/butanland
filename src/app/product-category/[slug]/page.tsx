import { fetchAPI } from '@/lib/api';
import CategoryClient from '@/components/category/CategoryClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// ۱. کوئری اصلاح شده بر اساس ساختار Rank Math برای دسته‌بندی‌ها
const GET_CATEGORY_DATA = `
  query GetCategoryData($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      name
      description
      # 👇 فیلدهای اصلاح شده مخصوص دسته‌بندی
      seo {
        title
        description   # جایگزین metaDesc شد
        canonicalUrl  # جایگزین canonical شد
        openGraph {   # ساختار آبشاری برای تصویر
          image {
            url
          }
        }
      }
      children(first: 20) {
        nodes {
          id
          name
          slug
          count
          image {
            sourceUrl
            altText
          }
        }
      }
      products(first: 50) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          slug
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
    }
  }
`;

// ۲. تابع متادیتا با فیلدهای جدید
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const data = await fetchAPI(GET_CATEGORY_DATA, { 
      variables: { slug: decodedSlug } 
    });

    const category = data?.productCategory;
    const seo = category?.seo;

    if (!category) {
      return { title: 'محصولات بوتان لند' };
    }

    return {
      title: seo?.title || `خرید ${category.name} | بهترین قیمت ${category.name}`,
      // اولویت با توضیحات سئو است، اگر نبود توضیحات خود دسته
      description: seo?.description || category.description || `خرید اینترنتی ${category.name} با گارانتی`,
      alternates: {
        canonical: seo?.canonicalUrl || `https://butanland.com/product-category/${decodedSlug}`,
      },
      openGraph: {
        title: seo?.title || category.name,
        description: seo?.description,
        // دریافت تصویر از ساختار جدید
        images: seo?.openGraph?.image?.url ? [seo.openGraph.image.url] : [],
        type: 'website',
      },
    };
  } catch (e) {
    return { title: 'محصولات | بوتان لند' };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  console.log("--------------------------------------");
  console.log("🔍 در حال دریافت دسته:", decodedSlug);
  
  try {
    const data = await fetchAPI(GET_CATEGORY_DATA, { 
      variables: { slug: decodedSlug } 
    });
    
    if (!data?.productCategory) {
      console.warn("⚠️ دسته در وردپرس پیدا نشد (404).");
      notFound();
    }

    console.log("✅ دسته دریافت شد:", data.productCategory.name);
    console.log("--------------------------------------");

    const category = data.productCategory;

    // ۳. اسکیمای گوگل
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": category.name,
      "description": category.description || `خرید انواع ${category.name}`,
      "url": `https://butanland.com/product-category/${decodedSlug}`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "خانه",
            "item": "https://butanland.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": category.name,
            "item": `https://butanland.com/product-category/${decodedSlug}`
          }
        ]
      }
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <CategoryClient 
          categoryName={category.name}
          description={category.description}
          subcategories={category.children.nodes}
          initialProducts={category.products.nodes}
          initialPageInfo={category.products.pageInfo}
          slug={decodedSlug}
        />
      </>
    );
  } catch (err) {
    console.error("❌ خطا در اجرای کوئری:", err);
    notFound(); 
  }
}