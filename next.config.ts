/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.butanland.com', // دامنه جدید وردپرس
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'butanland.com', // دامنه قبلی که هنوز در لینک‌ها وجود دارد
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;