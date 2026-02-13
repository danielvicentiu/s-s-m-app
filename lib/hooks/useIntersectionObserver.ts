import { useEffect, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook for observing element visibility using Intersection Observer API
 *
 * @param elementRef - React ref object pointing to the element to observe
 * @param options - IntersectionObserver options with optional freezeOnceVisible flag
 * @returns isIntersecting - boolean indicating if element is currently intersecting
 *
 * @example
 * // Basic usage for lazy loading
 * const ref = useRef<HTMLDivElement>(null);
 * const isVisible = useIntersectionObserver(ref, { threshold: 0.5 });
 *
 * @example
 * // Trigger animation once when visible
 * const ref = useRef<HTMLDivElement>(null);
 * const isVisible = useIntersectionObserver(ref, {
 *   threshold: 0.3,
 *   freezeOnceVisible: true
 * });
 *
 * @example
 * // Infinite scroll detection
 * const loadMoreRef = useRef<HTMLDivElement>(null);
 * const shouldLoadMore = useIntersectionObserver(loadMoreRef, {
 *   rootMargin: '100px'
 * });
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    // Don't observe if element doesn't exist or if frozen after becoming visible
    if (!element || (freezeOnceVisible && isIntersecting)) {
      return;
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver is not supported in this browser');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, isIntersecting]);

  return isIntersecting;
}
