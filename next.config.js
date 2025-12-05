/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,

  // Pusta konfiguracja Turbopack (wymagana w Next.js 16)
  turbopack: {},

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    qualities: [75, 85],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-tabs",
      "@vis.gl/react-google-maps",
      "framer-motion",
      "gsap",
    ],
    scrollRestoration: true,
    useLightningcss: true,
  },

  // Transpile packages dla lepszej kompatybilności
  transpilePackages: [
    "three",
    "webgi",
    "gsap",
    "@react-three/fiber",
    "@react-three/drei",
  ],

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
            test: /[\\/]node_modules[\\/](three|@react-three[\\/]|webgi)/,
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://maps.googleapis.com https://*.googleapis.com https://www.youtube.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "media-src 'self' blob:",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self' https://maps.googleapis.com https://*.googleapis.com https://*.gstatic.com",
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
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
