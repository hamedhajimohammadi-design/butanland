'use server';

import { fetchAPI } from '@/lib/api';

const LOAD_MORE_PRODUCTS_QUERY = `
  query LoadMoreProducts($slug: String!, $cursor: String!) {
    productCategory(id: $slug, idType: SLUG) {
      products(first: 10, after: $cursor) {
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

export async function loadMoreProducts(slug: string, cursor: string) {
  try {
    const data = await fetchAPI(LOAD_MORE_PRODUCTS_QUERY, {
      variables: { slug, cursor },
    });

    return {
      success: true,
      products: data?.productCategory?.products?.nodes || [],
      pageInfo: data?.productCategory?.products?.pageInfo || { hasNextPage: false, endCursor: null },
    };
  } catch (error) {
    console.error('Error loading more products:', error);
    return { success: false, error: 'Failed to load products' };
  }
}

const LOAD_MORE_SHOP_PRODUCTS_QUERY = `
  query LoadMoreShopProducts($category: String, $search: String, $cursor: String!) {
    products(
      first: 12, 
      after: $cursor, 
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
  }
`;

export async function loadMoreShopProducts(cursor: string, category?: string | null, search?: string | null) {
  try {
    const data = await fetchAPI(LOAD_MORE_SHOP_PRODUCTS_QUERY, {
      variables: { cursor, category, search },
    });

    return {
      success: true,
      products: data?.products?.nodes || [],
      pageInfo: data?.products?.pageInfo || { hasNextPage: false, endCursor: null },
    };
  } catch (error) {
    console.error('Error loading more shop products:', error);
    return { success: false, error: 'Failed to load products' };
  }
}
