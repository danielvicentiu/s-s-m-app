/**
 * SSR-safe localStorage utility with TypeScript generics and optional TTL support
 *
 * Features:
 * - Safe to use in Next.js server components (checks typeof window)
 * - TypeScript generics for type-safe operations
 * - Optional TTL (time-to-live) for cached values
 * - JSON serialization/deserialization helpers
 * - Error handling with fallback to default values
 */

interface StorageItem<T> {
  value: T;
  expiresAt?: number;
}

/**
 * Check if we're in a browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

/**
 * Check if a stored item has expired
 */
const isExpired = (expiresAt?: number): boolean => {
  if (!expiresAt) return false;
  return Date.now() > expiresAt;
};

/**
 * Get item from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist or is expired
 * @returns The stored value or default value
 */
export const getItem = (key: string, defaultValue: string = ''): string => {
  if (!isBrowser()) return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 * @param key - Storage key
 * @param value - Value to store
 * @param ttl - Optional time-to-live in milliseconds
 * @returns Success status
 */
export const setItem = (key: string, value: string, ttl?: number): boolean => {
  if (!isBrowser()) return false;

  try {
    if (ttl) {
      const expiresAt = Date.now() + ttl;
      const wrappedValue: StorageItem<string> = { value, expiresAt };
      window.localStorage.setItem(key, JSON.stringify(wrappedValue));
    } else {
      window.localStorage.setItem(key, value);
    }
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param key - Storage key
 * @returns Success status
 */
export const removeItem = (key: string): boolean => {
  if (!isBrowser()) return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 * @returns Success status
 */
export const clear = (): boolean => {
  if (!isBrowser()) return false;

  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get JSON object from localStorage with type safety
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist, is invalid, or is expired
 * @returns The parsed object or default value
 */
export const getJSON = <T>(key: string, defaultValue?: T): T | undefined => {
  if (!isBrowser()) return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;

    const parsed = JSON.parse(item);

    // Check if it's a wrapped value with TTL
    if (parsed && typeof parsed === 'object' && 'value' in parsed) {
      const wrappedItem = parsed as StorageItem<T>;
      if (isExpired(wrappedItem.expiresAt)) {
        // Remove expired item
        removeItem(key);
        return defaultValue;
      }
      return wrappedItem.value;
    }

    // Return unwrapped value
    return parsed as T;
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set JSON object in localStorage with type safety
 * @param key - Storage key
 * @param obj - Object to store
 * @param ttl - Optional time-to-live in milliseconds
 * @returns Success status
 */
export const setJSON = <T>(key: string, obj: T, ttl?: number): boolean => {
  if (!isBrowser()) return false;

  try {
    if (ttl) {
      const expiresAt = Date.now() + ttl;
      const wrappedValue: StorageItem<T> = { value: obj, expiresAt };
      window.localStorage.setItem(key, JSON.stringify(wrappedValue));
    } else {
      window.localStorage.setItem(key, JSON.stringify(obj));
    }
    return true;
  } catch (error) {
    console.error(`Error setting JSON to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Get all keys from localStorage
 * @returns Array of keys
 */
export const getAllKeys = (): string[] => {
  if (!isBrowser()) return [];

  try {
    return Object.keys(window.localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

/**
 * Check if a key exists in localStorage
 * @param key - Storage key
 * @returns Whether the key exists
 */
export const hasKey = (key: string): boolean => {
  if (!isBrowser()) return false;

  try {
    return window.localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage key "${key}":`, error);
    return false;
  }
};
