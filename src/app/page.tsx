import { fetchAPI } from '@/lib/api';
import HomePageClient from './HomePageClient';

export const metadata = {
  title: 'بوتان لند | فروش قطعات پکیج و آموزش',
  description: 'فروش آنلاین قطعات یدکی پکیج بوتان و ایران رادیاتور، بانک ارورها و آموزش تعمیرات.',
};

const GET_HOMEPAGE_DATA = `
  query GetHomepageData {
    # دریافت 8 محصول جدید
    products(first: 8, where: { stockStatus: IN_STOCK, orderby: { field: DATE, order: DESC } }) {
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
           stockStatus
        }
        ... on VariableProduct {
           price
           stockStatus
        }
      }
    }
    # دریافت 3 مقاله جدید
    posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        title
        slug
        date
        excerpt
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

export default async function Home() {
  let products = [];
  let posts = [];
  
  try {
    const data = await fetchAPI(GET_HOMEPAGE_DATA);
    products = data?.products?.nodes || [];
    posts = data?.posts?.nodes || [];
  } catch (error) {
    console.error("Error fetching homepage data:", error);
  }

  // ارسال دیتا به کامپوننت کلاینت
  return <HomePageClient products={products} posts={posts} />;
}