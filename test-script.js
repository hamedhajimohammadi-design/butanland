
const { searchProducts, fetchAPI } = require('./src/lib/api');

async function testProductFetch() {
    const slug = 'ki-display-board-connection-cable';
    console.log(`Testing fetch for slug: ${slug}`);

    const GET_PRODUCT_QUERY = `
    query GetProduct($slug: ID!) {
        product(id: $slug, idType: SLUG) {
        id
        name
        slug
        }
    }
    `;

    try {
        // Load env manually since we are running via node directly
        // We can't easily access .env.local without dotenv package
        // Let's assume the user has the env setup or I can try to read it
        console.log('Note: This script assumes NEXT_PUBLIC_WORDPRESS_API_URL is available in process.env or hardcoded.');
        // I'll hardcode it just for this test script based on what I assume or read from file
        // Wait, I can't read .env.local easily in raw node without parsing.
        
        // I'll try to run this via 'ts-node' or similar if available, or just create a Next.js API route? 
        // No, creating a separate test file is risky if env vars aren't loaded.
        
        // Better idea: Create a temporary page or simply modify the product page to log heavily.
    } catch (e) {
        console.error(e);
    }
}
