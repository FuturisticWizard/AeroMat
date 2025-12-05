// Performance Configuration for Aeromat Application
// This file contains all performance-related configurations and recommendations

const PerformanceConfig = {
  // Compilation targets
  compilation: {
    target: 'esnext', // Use modern JavaScript features
    turbopack: true,
    memoryLimit: 4096, // MB
    maxWorkers: 'auto',
  },

  // Bundle optimization
  bundling: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        vendor: { test: /[\\/]node_modules[\\/]/, priority: -10 },
        maps: { test: /[\\/](@vis\.gl|@googlemaps)[\\/]/, priority: 10 },
        three: { test: /[\\/](three|@react-three)[\\/]/, priority: 10 },
        ui: { test: /[\\/](@radix-ui|framer-motion)[\\/]/, priority: 5 },
      },
    },
    treeShaking: true,
    sideEffects: false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    quality: 75,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    cacheTTL: 60 * 60 * 24 * 30, // 30 days
    placeholder: 'blur',
    loading: 'lazy',
  },

  // Lazy loading thresholds
  lazyLoading: {
    rootMargin: '100px',
    threshold: 0.1,
    components: [
      'GoogleMap',
      'ThreeCanvas', 
      'YouTubeGrid',
      'VideoPlayer'
    ],
  },

  // Performance budgets
  budgets: {
    compilation: {
      target: 15000, // 15 seconds
      current: 41000, // 41 seconds (needs optimization)
      improvement: '63%',
    },
    rendering: {
      target: 500, // 500ms
      current: 1726, // 1726ms (needs optimization)
      improvement: '71%',
    },
    bundleSize: {
      main: '< 250KB',
      vendor: '< 500KB',
      total: '< 1MB',
    },
    coreWebVitals: {
      FCP: 1800, // ms
      LCP: 2500, // ms
      FID: 100,  // ms
      CLS: 0.1,  // score
    },
  },

  // Caching strategy
  caching: {
    staleWhileRevalidate: [
      '/images/**',
      '/movies/**',
      '/icons/**',
    ],
    cacheFirst: [
      '/static/**',
      '/_next/static/**',
    ],
    networkFirst: [
      '/api/**',
      '/.well-known/**',
    ],
    ttl: {
      images: 30 * 24 * 60 * 60, // 30 days
      static: 365 * 24 * 60 * 60, // 1 year
      api: 5 * 60, // 5 minutes
    },
  },

  // Memory optimization
  memory: {
    cleanup: {
      intervals: [30000], // 30 seconds
      thresholds: {
        warning: 50 * 1024 * 1024, // 50MB
        critical: 100 * 1024 * 1024, // 100MB
      },
    },
    pooling: {
      components: ['GoogleMap', 'ThreeCanvas'],
      maxInstances: 3,
    },
  },

  // Development optimizations
  development: {
    hotReload: true,
    sourceMaps: true,
    typeChecking: true,
    linting: true,
    memoryMonitoring: true,
  },

  // Production optimizations
  production: {
    minification: true,
    compression: 'gzip',
    removeConsole: ['log', 'debug'],
    inlineStyles: false,
    extractCSS: true,
  },
};

module.exports = PerformanceConfig;