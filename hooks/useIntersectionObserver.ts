import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Whether to freeze the observer once the element has intersected
   * Useful for one-time animations
   * @default false
   */
  freezeOnceVisible?: boolean;
  /**
   * Initial state of intersection
   * @default false
   */
  initialIsIntersecting?: boolean;
}

interface UseIntersectionObserverReturn {
  /**
   * Whether the element is currently intersecting
   */
  isIntersecting: boolean;
  /**
   * The current IntersectionObserverEntry
   */
  entry: IntersectionObserverEntry | undefined;
}

/**
 * Custom hook for using the Intersection Observer API
 *
 * Use cases:
 * - Lazy loading images/components
 * - Infinite scroll pagination
 * - Animate elements on scroll
 * - Track element visibility
 *
 * @example
 * // Basic usage - animate on scroll
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   freezeOnceVisible: true
 * });
 *
 * @example
 * // Infinite scroll
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0,
 *   rootMargin: '100px'
 * });
 *
 * useEffect(() => {
 *   if (isIntersecting) {
 *     loadMore();
 *   }
 * }, [isIntersecting]);
 */
export function useIntersectionObserver<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn & { ref: React.RefObject<T> } {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    initialIsIntersecting = false,
  } = options;

  const elementRef = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);

  const frozen = freezeOnceVisible && isIntersecting;

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !element || frozen) {
      return;
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const [observerEntry] = entries;
      setEntry(observerEntry);
      setIsIntersecting(observerEntry.isIntersecting);
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen, elementRef.current]);

  return {
    ref: elementRef,
    isIntersecting,
    entry,
  };
}

export default useIntersectionObserver;
