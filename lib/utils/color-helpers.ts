/**
 * Color utility functions for consistent color generation and manipulation
 */

/**
 * Generates a consistent color from a string
 * Same string will always produce the same color
 * @param str - Input string to generate color from
 * @returns Hex color string (e.g., "#3b82f6")
 */
export function stringToColor(str: string): string {
  if (!str) return '#808080'; // Gray for empty strings

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Generate RGB values with good saturation and brightness
  const h = hash % 360;
  const s = 65 + (hash % 20); // 65-85% saturation
  const l = 45 + (hash % 15); // 45-60% lightness

  return hslToHex(h, s, l);
}

/**
 * Returns black or white color for optimal contrast against given background
 * @param hex - Background color in hex format (e.g., "#3b82f6")
 * @returns "#000000" or "#ffffff"
 */
export function getContrastColor(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Calculate relative luminance using WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Lightens a hex color by a given percentage
 * @param hex - Color in hex format (e.g., "#3b82f6")
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened hex color
 */
export function lighten(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex, 16);

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const amount = Math.round(2.55 * percent);

  const newR = Math.min(255, r + amount);
  const newG = Math.min(255, g + amount);
  const newB = Math.min(255, b + amount);

  return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
}

/**
 * Darkens a hex color by a given percentage
 * @param hex - Color in hex format (e.g., "#3b82f6")
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened hex color
 */
export function darken(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex, 16);

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const amount = Math.round(2.55 * percent);

  const newR = Math.max(0, r - amount);
  const newG = Math.max(0, g - amount);
  const newB = Math.max(0, b - amount);

  return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
}

/**
 * Converts HSL color values to hex
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}
