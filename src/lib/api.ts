const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

interface FetchAPIParams {
  query: string;
  variables?: Record<string, any>;
  revalidate?: number;
}

export async function fetchAPI<T = any>(
  query: string,
  { variables, revalidate = 3600 }: { variables?: Record<string, any>; revalidate?: number } = {}
): Promise<T> {
  const headers = { 'Content-Type': 'application/json' };

  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL is not defined in environment variables');
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    next: {
      revalidate,
    },
  });

  const json = await res.json();

  if (json.errors) {
    console.error("❌ WP Error:", JSON.stringify(json.errors, null, 2));
    throw new Error(json.errors[0]?.message || 'Failed to fetch API');
  }

  return json.data;
}

export async function searchProducts(query: string) {
  const SEARCH_QUERY = `
    query SearchProducts($search: String!) {
      products(where: { search: $search }, first: 6) {
        nodes {
          id
          name
          slug
          sku
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
  `;

  const data = await fetchAPI(SEARCH_QUERY, {
    variables: { search: query },
  });

  return data?.products?.nodes || [];
}
