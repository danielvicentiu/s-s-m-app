/**
 * Array utility functions with TypeScript generic types
 * Provides common array manipulation helpers for the SSM platform
 */

/**
 * Groups array items by a specified key
 * @param arr - Array to group
 * @param key - Key to group by
 * @returns Object with grouped items
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
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
 * Sorts array by a specified key and direction
 * @param arr - Array to sort
 * @param key - Key to sort by
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns New sorted array
 */
export function sortBy<T>(
  arr: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;

    let comparison = 0;
    if (aVal < bVal) comparison = -1;
    if (aVal > bVal) comparison = 1;

    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Returns unique items from array
 * @param arr - Array to filter
 * @returns New array with unique items
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Splits array into chunks of specified size
 * @param arr - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }

  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flattens nested arrays by one level
 * @param arr - Array to flatten
 * @returns Flattened array
 */
export function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((result, item) => result.concat(item), []);
}

/**
 * Paginates array and returns items for specified page
 * @param arr - Array to paginate
 * @param page - Page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Object with paginated data and metadata
 */
export function paginate<T>(
  arr: T[],
  page: number,
  pageSize: number
): {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  if (page <= 0) {
    throw new Error('Page number must be greater than 0');
  }
  if (pageSize <= 0) {
    throw new Error('Page size must be greater than 0');
  }

  const totalItems = arr.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = arr.slice(startIndex, endIndex);

  return {
    data,
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
