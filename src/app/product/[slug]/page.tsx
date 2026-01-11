import { fetchAPI, searchProducts } from '@/lib/api';
import ProductClient from '@/components/product/ProductClient';
import CommentSection from '@/components/CommentSection'; // ✅ اضافه شد
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// =============================
// Helpers
// =============================
function stripHtml(html?: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function toSchemaAvailability(stockStatus?: string) {
  return stockStatus === 'IN_STOCK'
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';
}

function extractNumericPrice(priceHtml?: string | null): number | null {
  if (!priceHtml) return null;
  const text = stripHtml(priceHtml);
  const digits = text.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

// =============================
// GraphQL Queries (Updated with Reviews)
// =============================

const GET_PRODUCT_BY_SLUG = `
  query GetProductBySlug($id: ID!) {
    product(id: $id, idType: SLUG) {
      id
      databaseId
      name
      slug
      sku
      description
      shortDescription
      reviewCount # تعداد نظرات
      productCategories {
        nodes {
          name
          slug
        }
      }
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      seo {
        title
        canonicalUrl
        description
      }
      # 👇 دریافت لیست نظرات محصول
      reviews(first: 20, where: { orderby: COMMENT_DATE, order: DESC }) {
        nodes {
          databaseId
          content
          date
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
      ... on SimpleProduct {
        price
        regularPrice
        stockStatus
        attributes {
          nodes {
            name
            options
          }
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        stockStatus
        attributes {
          nodes {
            name
            options
          }
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_ID = `
  query GetProductById($id: ID!) {
    product(id: $id, idType: ID) {
      id
      databaseId
      name
      slug
      sku
      description
      shortDescription
      reviewCount
      productCategories {
        nodes {
          name
          slug
        }
      }
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      seo {
        title
        canonicalUrl
        description
      }
      # 👇 دریافت لیست نظرات محصول
      reviews(first: 20, where: { orderby: COMMENT_DATE, order: DESC }) {
        nodes {
          databaseId
          content
          date
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
      ... on SimpleProduct {
        price
        regularPrice
        stockStatus
        attributes {
          nodes {
            name
            options
          }
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        stockStatus
        attributes {
          nodes {
            name
            options
          }
        }
      }
    }
  }
`;

// =============================
// Robust Fetch Logic
// =============================
async function findProductSmart(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  
  // 1. تلاش اول: با اسلاگ دیکود شده
  let data = await fetchAPI(GET_PRODUCT_BY_SLUG, { variables: { id: decodedSlug } }).catch(() => null);
  if (data?.product) return data.product;

  // 2. تلاش دوم: با اسلاگ اینکود شده
  if (slug !== decodedSlug) {
    data = await fetchAPI(GET_PRODUCT_BY_SLUG, { variables: { id: slug } }).catch(() => null);
    if (data?.product) return data.product;
  }

  // 3. تلاش سوم: جستجو
  const searchResults = await searchProducts(decodedSlug).catch(() => []);
  
  if (searchResults && searchResults.length > 0) {
    const match = searchResults.find((p: any) => 
      p.slug === decodedSlug || p.slug === slug || p.name === decodedSlug
    ) || searchResults[0];

    if (match?.id) {
      const dataById = await fetchAPI(GET_PRODUCT_BY_ID, { variables: { id: match.id } }).catch(() => null);
      if (dataById?.product) return dataById.product;
    }
  }

  return null;
}

// =============================
// Metadata
// =============================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProductSmart(slug);

  if (!product) {
    return { title: 'محصول یافت نشد | بوتان لند' };
  }

  const seo = product.seo;
  const title = seo?.title || `${product.name} | بوتان لند`;
  const desc = seo?.description || stripHtml(product.shortDescription).slice(0, 160);
  const image = product.image?.sourceUrl ? [product.image.sourceUrl] : [];

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: image,
    }
  };
}

// =============================
// Page Component
// =============================
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const product = await findProductSmart(slug);

  if (!product) {
    notFound();
  }

  // استخراج نظرات
  const reviews = product.reviews?.nodes || [];

  const priceValue = extractNumericPrice(product.price || product.regularPrice);
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: stripHtml(product.shortDescription || product.description),
    image: product.image?.sourceUrl ? [product.image.sourceUrl] : [],
    sku: product.sku,
    aggregateRating: product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: '5', // فعلا پیش فرض چون میانگین را نگرفتیم
      reviewCount: product.reviewCount
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: priceValue,
      priceCurrency: 'IRR',
      availability: toSchemaAvailability(product.stockStatus),
      url: `https://butanland.com/product/${product.slug}`,
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* 1. کلاینت ساید محصول (گالری، قیمت، افزودن به سبد) */}
      <ProductClient product={product} />

      {/* 2. بخش نظرات (اضافه شده در پایین صفحه) */}
      <div className="container mx-auto px-4 max-w-7xl mt-12 mb-20">
        <CommentSection comments={reviews} postId={product.databaseId} />
      </div>
    </>
  );
}