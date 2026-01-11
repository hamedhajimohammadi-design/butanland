import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'butanland.com', // 👈 دامنه سایت وردپرسی تو
      },
      {
        protocol: 'https', // برای اطمینان (اگر www دارد)
        hostname: 'www.butanland.com',
      }
    ],
  },
};

export default nextConfig;