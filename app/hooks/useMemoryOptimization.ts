import { useEffect, useCallback, useRef } from 'react';

// Debounce hook for performance
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Throttle hook for performance
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
}

// Memory cleanup hook
export function useMemoryCleanup(cleanupFns: (() => void)[] = []) {
  useEffect(() => {
    return () => {
      cleanupFns.forEach(fn => {
        try {
          fn();
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      });
    };
  }, []);
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  targetRef: React.RefObject<Element>,
  onIntersect: () => void,
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options,
      }
    );

    observerRef.current.observe(targetRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [targetRef, onIntersect, options]);
}

// Image preloader hook
export function useImagePreloader(imageSrcs: string[]) {
  useEffect(() => {
    const preloadImages = () => {
      imageSrcs.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    // Preload images after a small delay to not block initial render
    const timeoutId = setTimeout(preloadImages, 1000);

    return () => clearTimeout(timeoutId);
  }, [imageSrcs]);
}

// Resource cleanup for heavy components
export function useResourceCleanup() {
  const resourcesRef = useRef<Set<() => void>>(new Set());

  const addCleanup = useCallback((cleanupFn: () => void) => {
    resourcesRef.current.add(cleanupFn);
  }, []);

  const removeCleanup = useCallback((cleanupFn: () => void) => {
    resourcesRef.current.delete(cleanupFn);
  }, []);

  useEffect(() => {
    return () => {
      resourcesRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn('Resource cleanup error:', error);
        }
      });
      resourcesRef.current.clear();
    };
  }, []);

  return { addCleanup, removeCleanup };
}

// Animation frame hook for smooth animations
export function useAnimationFrame(callback: (time: number) => void, deps: any[] = []) {
  const requestRef = useRef<number>();

  useEffect(() => {
    const animate = (time: number) => {
      callback(time);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, deps);
}

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    const updateConnectionType = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
      }
    };

    updateOnlineStatus();
    updateConnectionType();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionType);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (connection) {
        connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  return { isOnline, connectionType };
}

// Import useState for network status hook
import { useState } from 'react';