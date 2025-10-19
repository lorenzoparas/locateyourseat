import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.cateringconnect.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
