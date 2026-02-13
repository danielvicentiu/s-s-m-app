/**
 * Utility functions for array and object manipulation
 */

/**
 * Groups an array of objects by a specific key
 * @param arr - Array to group
 * @param key - Key to group by
 * @returns Object with grouped items
 */
export function groupBy<T extends Record<string, any>>(
  arr: T[],
  key: keyof T
): Record<string, T[]> {
  return arr.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sorts an array of objects by a specific key
 * @param arr - Array to sort
 * @param key - Key to sort by
 * @param dir - Sort direction ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortBy<T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  dir: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;

    const comparison = aVal < bVal ? -1 : 1;
    return dir === 'asc' ? comparison : -comparison;
  });
}

/**
 * Returns unique values from an array
 * @param arr - Array to filter
 * @returns Array with unique values
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Splits an array into chunks of specified size
 * @param arr - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Flattens a nested array by one level
 * @param arr - Array to flatten
 * @returns Flattened array
 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>((result, item) => {
    if (Array.isArray(item)) {
      return result.concat(item);
    }
    return result.concat([item]);
  }, []);
}

/**
 * Creates a new object with only the specified keys
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with picked keys
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Creates a new object without the specified keys
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without omitted keys
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * Creates a debounced function that delays execution until after wait milliseconds
 * @param fn - Function to debounce
 * @param ms - Milliseconds to wait
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}

/**
 * Creates a throttled function that only executes once per wait period
 * @param fn - Function to throttle
 * @param ms - Milliseconds to wait between executions
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Creates a deep clone of an object or array
 * @param obj - Object to clone
 * @returns Deep cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    const clonedArr: any[] = [];
    obj.forEach((item) => {
      clonedArr.push(deepClone(item));
    });
    return clonedArr as T;
  }

  if (obj instanceof Object) {
    const clonedObj: any = {};
    Object.keys(obj).forEach((key) => {
      clonedObj[key] = deepClone((obj as any)[key]);
    });
    return clonedObj as T;
  }

  return obj;
}
