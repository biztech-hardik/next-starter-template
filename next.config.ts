import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

if(process.env.NODE_ENV === 'development'){
    (async () => {
      await setupDevPlatform();
    })();
}

export default nextConfig;