// next.config.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ensure alias exists for non-TS assets (like CSS)
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@styles': path.resolve(__dirname, 'src/styles'),
    };
    return config;
  },
  // optional but nice to have
  experimental: { typedRoutes: true },
  reactStrictMode: true,
};

export default nextConfig;
