import { MetadataRoute } from 'next';

const WP_URL = "https://www.butanland.com/graphql";
const SITE_URL = "http://localhost:3000"; // بعداً به آدرس اصلی تغییر میدهیم

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ۱. دریافت لیست تمام محصولات از وردپرس
  const response = await fetch(WP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetSitemapData {
          products(first: 100) {
            nodes {
              slug
              date
            }
          }
          posts(first: 100) {
            nodes {
              slug
              date
            }
          }
        }
      `,
    }),
  });

  const { data } = await response.json();

  // ۲. ساخت لینک‌های محصولات
  const productEntries = data.products.nodes.map((product: any) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    lastModified: new Date(product.date),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // ۳. ساخت لینک‌های مقالات
  const postEntries = data.posts.nodes.map((post: any) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // ۴. لینک‌های ثابت (صفحه اصلی، تماس و...)
  const staticEntries = [
    { url: `${SITE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  return [...staticEntries, ...productEntries, ...postEntries];
}