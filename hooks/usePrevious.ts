import { useEffect, useRef } from 'react';

/**
 * Hook that returns the previous value of a state or prop
 * @param value - The current value to track
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
