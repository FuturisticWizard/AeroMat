"use client";
import { useEffect } from "react";

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const metrics: PerformanceMetrics = {};

    // Measure Core Web Vitals
    const measureWebVitals = () => {
      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        metrics.TTFB = navigation.responseStart - navigation.requestStart;
      }

      // Observe paint timing
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
        }
      });

      // Use PerformanceObserver for other metrics
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.LCP = lastEntry.startTime;
        });
        
        try {
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          console.warn('LCP observation not supported');
        }

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-input') {
              metrics.FID = (entry as any).processingStart - entry.startTime;
            }
          });
        });
        
        try {
          fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) {
          console.warn('FID observation not supported');
        }

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metrics.CLS = clsValue;
        });
        
        try {
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.warn('CLS observation not supported');
        }

        // Report metrics after page load
        setTimeout(() => {
          reportMetrics(metrics);
        }, 5000);
      }
    };

    // Report metrics function
    const reportMetrics = (metrics: PerformanceMetrics) => {
      if (process.env.NODE_ENV === 'development') {
        console.group('🚀 Performance Metrics');
        console.log('First Contentful Paint (FCP):', metrics.FCP ? `${Math.round(metrics.FCP)}ms` : 'N/A');
        console.log('Largest Contentful Paint (LCP):', metrics.LCP ? `${Math.round(metrics.LCP)}ms` : 'N/A');
        console.log('First Input Delay (FID):', metrics.FID ? `${Math.round(metrics.FID)}ms` : 'N/A');
        console.log('Cumulative Layout Shift (CLS):', metrics.CLS ? metrics.CLS.toFixed(3) : 'N/A');
        console.log('Time to First Byte (TTFB):', metrics.TTFB ? `${Math.round(metrics.TTFB)}ms` : 'N/A');
        
        // Performance assessment
        const assessment = assessPerformance(metrics);
        console.log('📊 Performance Assessment:', assessment);
        console.groupEnd();
      }

      // In production, you might want to send this data to your analytics service
      if (process.env.NODE_ENV === 'production' && window.gtag) {
        // Example: Send to Google Analytics
        Object.entries(metrics).forEach(([name, value]) => {
          if (value !== undefined) {
            window.gtag('event', name, {
              value: Math.round(value),
              metric_id: name,
              custom_parameter: 'core_web_vital'
            });
          }
        });
      }
    };

    // Assess performance based on Core Web Vitals thresholds
    const assessPerformance = (metrics: PerformanceMetrics) => {
      const issues = [];
      
      if (metrics.FCP && metrics.FCP > 1800) issues.push('Slow First Contentful Paint');
      if (metrics.LCP && metrics.LCP > 2500) issues.push('Slow Largest Contentful Paint');
      if (metrics.FID && metrics.FID > 100) issues.push('Poor First Input Delay');
      if (metrics.CLS && metrics.CLS > 0.1) issues.push('Poor Cumulative Layout Shift');
      if (metrics.TTFB && metrics.TTFB > 600) issues.push('Slow Time to First Byte');

      return issues.length === 0 ? '✅ Good performance' : `⚠️ Issues: ${issues.join(', ')}`;
    };

    // Measure bundle size
    const measureBundleSize = () => {
      if ('navigator' in window && 'connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          console.log('📶 Network Info:', {
            effectiveType: connection.effectiveType,
            downlink: `${connection.downlink}Mbps`,
            rtt: `${connection.rtt}ms`
          });
        }
      }

      // Get resource timing
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const scripts = resources.filter(r => r.name.includes('.js'));
      const styles = resources.filter(r => r.name.includes('.css'));
      
      const totalScriptSize = scripts.reduce((acc, script) => acc + (script.transferSize || 0), 0);
      const totalStyleSize = styles.reduce((acc, style) => acc + (style.transferSize || 0), 0);
      
      if (process.env.NODE_ENV === 'development') {
        console.group('📦 Bundle Analysis');
        console.log('Scripts size:', formatBytes(totalScriptSize));
        console.log('Styles size:', formatBytes(totalStyleSize));
        console.log('Total resources:', resources.length);
        console.groupEnd();
      }
    };

    // Format bytes helper
    const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Start monitoring
    if (document.readyState === 'complete') {
      measureWebVitals();
      measureBundleSize();
    } else {
      window.addEventListener('load', () => {
        measureWebVitals();
        measureBundleSize();
      });
    }

    // Memory monitoring
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (process.env.NODE_ENV === 'development') {
          console.group('🧠 Memory Usage');
          console.log('Used JS heap:', formatBytes(memory.usedJSHeapSize));
          console.log('Total JS heap:', formatBytes(memory.totalJSHeapSize));
          console.log('Heap limit:', formatBytes(memory.jsHeapSizeLimit));
          console.groupEnd();
        }
      }
    };

    // Monitor memory every 30 seconds in development
    if (process.env.NODE_ENV === 'development') {
      const memoryInterval = setInterval(monitorMemory, 30000);
      return () => clearInterval(memoryInterval);
    }
  }, []);

  return null;
}

// Type augmentation for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}