import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Image optimization for Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uhccxfyvhjeudkexcgiq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Redirects for legacy URLs
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/ro/login",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/ro/register",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/ro/dashboard",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/ro/admin",
        permanent: false,
      },
    ];
  },

  // API rewrites for cleaner URLs
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "/api/v1/:path*",
      },
    ];
  },

  // i18n configuration
  // Note: next-intl handles routing, this is for metadata
  reactStrictMode: true,

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optional: Webpack Bundle Analyzer
    // Uncomment to enable bundle analysis
    // if (process.env.ANALYZE === 'true') {
    //   const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    //   config.plugins.push(
    //     new BundleAnalyzerPlugin({
    //       analyzerMode: 'static',
    //       reportFilename: isServer
    //         ? '../analyze/server.html'
    //         : './analyze/client.html',
    //       openAnalyzer: false,
    //     })
    //   );
    // }

    return config;
  },

  // Standalone output for optimal Docker/Vercel deployment
  output: "standalone",

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@/components", "@/lib"],
  },

  // Production optimization
  poweredByHeader: false,
  compress: true,

  // TypeScript during build
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);
