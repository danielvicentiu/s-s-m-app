/**
 * URL utility functions for query string manipulation, path handling, and URL validation
 */

/**
 * Build a query string from an object of parameters
 * @param params - Object with key-value pairs
 * @returns Query string without leading '?'
 * @example buildQueryString({ page: 1, sort: 'name' }) => "page=1&sort=name"
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const entries = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });

  return entries.join('&');
}

/**
 * Parse a query string into an object
 * @param str - Query string (with or without leading '?')
 * @returns Object with parsed key-value pairs
 * @example parseQueryString("?page=1&sort=name") => { page: "1", sort: "name" }
 */
export function parseQueryString(str: string): Record<string, string> {
  const cleanStr = str.startsWith('?') ? str.slice(1) : str;

  if (!cleanStr) {
    return {};
  }

  const params: Record<string, string> = {};

  cleanStr.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = value
        ? decodeURIComponent(value)
        : '';
    }
  });

  return params;
}

/**
 * Add or update a query parameter in a URL
 * @param url - The URL string
 * @param key - Parameter key
 * @param value - Parameter value
 * @returns Updated URL with the new parameter
 * @example addQueryParam("/dashboard?page=1", "sort", "name") => "/dashboard?page=1&sort=name"
 */
export function addQueryParam(
  url: string,
  key: string,
  value: string | number | boolean
): string {
  const [baseUrl, queryString] = url.split('?');
  const params = parseQueryString(queryString || '');

  params[key] = String(value);

  const newQueryString = buildQueryString(params);

  return newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl;
}

/**
 * Remove a query parameter from a URL
 * @param url - The URL string
 * @param key - Parameter key to remove
 * @returns Updated URL without the parameter
 * @example removeQueryParam("/dashboard?page=1&sort=name", "sort") => "/dashboard?page=1"
 */
export function removeQueryParam(url: string, key: string): string {
  const [baseUrl, queryString] = url.split('?');

  if (!queryString) {
    return url;
  }

  const params = parseQueryString(queryString);
  delete params[key];

  const newQueryString = buildQueryString(params);

  return newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl;
}

/**
 * Check if a URL is external (different origin)
 * @param url - The URL to check
 * @returns True if the URL is external
 * @example isExternalUrl("https://google.com") => true
 * @example isExternalUrl("/dashboard") => false
 */
export function isExternalUrl(url: string): boolean {
  // Relative URLs are not external
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return false;
  }

  // Check if it has a protocol
  if (!url.includes('://')) {
    return false;
  }

  try {
    const urlObj = new URL(url);

    // In browser environment, compare with current origin
    if (typeof window !== 'undefined') {
      return urlObj.origin !== window.location.origin;
    }

    // In server environment, consider all absolute URLs as potentially external
    return true;
  } catch {
    // Invalid URL format, treat as relative/internal
    return false;
  }
}

/**
 * Split a path into segments
 * @param path - The path string
 * @returns Array of path segments
 * @example getPathSegments("/dashboard/admin/users") => ["dashboard", "admin", "users"]
 */
export function getPathSegments(path: string): string[] {
  // Remove query string and hash
  const cleanPath = path.split('?')[0].split('#')[0];

  return cleanPath
    .split('/')
    .filter((segment) => segment.length > 0);
}

/**
 * Join path parts into a single path
 * @param parts - Array of path parts
 * @returns Joined path with leading slash
 * @example joinPaths(["dashboard", "admin", "users"]) => "/dashboard/admin/users"
 */
export function joinPaths(...parts: string[]): string {
  const cleanParts = parts
    .flatMap((part) => {
      // Handle parts that might already have slashes
      return part.split('/').filter((p) => p.length > 0);
    });

  return cleanParts.length > 0 ? `/${cleanParts.join('/')}` : '/';
}
