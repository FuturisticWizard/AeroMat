/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Turbopack config (Next.js 16 default for dev + prod).
  // Alias the hardcoded Next.js polyfill bundle (Array.at, Object.fromEntries,
  // String.trimStart etc.) to an empty module — our browserslist already
  // drops Chrome <105 / Safari <15.4, all targets support these natively.
  // Saves ~14 KiB of dead polyfill code on every page.
  turbopack: {
    resolveAlias: {
      "next/dist/build/polyfills/polyfill-module": { browser: "./empty-module.js" },
    },
  },

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 828, 1080, 1200, 1920, 2560],
    imageSizes: [64, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-tabs",
      "@vis.gl/react-google-maps",
      "framer-motion",
    ],
    scrollRestoration: true,
    // useLightningcss disabled - causes issues with Vercel Linux builds
    // useLightningcss: true,
  },

  // Transpile packages dla lepszej kompatybilności
  transpilePackages: ["three", "gsap"],

  // Webpack optimizations (będą używane w production build)
  webpack: (config, { dev, isServer }) => {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // GLB/GLTF handling
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
    });

    // Video handling
    config.module.rules.push({
      test: /\.(mp4|webm)$/,
      type: "asset/resource",
    });

    if (!dev && !isServer) {
      // Production client-side optimizations
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: -10,
            reuseExistingChunk: true,
            name: "vendor",
          },
          maps: {
            test: /[\\/]node_modules[\\/](@vis\.gl[\\/]react-google-maps|@googlemaps[\\/]markerclusterer)/,
            chunks: "all",
            priority: 10,
            name: "maps",
            reuseExistingChunk: true,
          },
          three: {
            test: /[\\/]node_modules[\\/]three[\\/]/,
            chunks: "all",
            priority: 10,
            name: "three",
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui[\\/]|framer-motion)/,
            chunks: "all",
            priority: 5,
            name: "ui",
            reuseExistingChunk: true,
          },
        },
      };

      config.optimization.moduleIds = "deterministic";
      config.optimization.chunkIds = "deterministic";
    }

    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://maps.googleapis.com https://*.googleapis.com https://www.youtube.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://img.youtube.com https://maps.googleapis.com https://maps.gstatic.com https://*.ggpht.com https://www.google-analytics.com https://*.g.doubleclick.net",
              "media-src 'self' blob:",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self' https://maps.googleapis.com https://*.googleapis.com https://*.gstatic.com https://www.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net",
              "worker-src 'self' blob:",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:dir(pngs|icons|Collaborations|Portfolio|movies|Animation|logo)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
