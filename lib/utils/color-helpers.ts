/**
 * Color manipulation utilities
 * Provides functions for hex/rgb conversion, lightening/darkening, contrast, and palette generation
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts a hex color to RGB object
 * @param hex - Hex color string (with or without #)
 * @returns RGB object with r, g, b values (0-255) or null if invalid
 */
export function hexToRgb(hex: string): RGB | null {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Validate hex format
  if (!isValidHex(hex)) {
    return null;
  }

  // Handle 3-digit hex (e.g., #fff)
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Converts RGB values to hex color string
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string with # prefix
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number): string => {
    const clamped = Math.max(0, Math.min(255, Math.round(value)));
    const hex = clamped.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Lightens a hex color by a given percentage
 * @param hex - Hex color string
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened hex color string
 */
export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const amount = Math.max(0, Math.min(100, percent)) / 100;

  const r = rgb.r + (255 - rgb.r) * amount;
  const g = rgb.g + (255 - rgb.g) * amount;
  const b = rgb.b + (255 - rgb.b) * amount;

  return rgbToHex(r, g, b);
}

/**
 * Darkens a hex color by a given percentage
 * @param hex - Hex color string
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened hex color string
 */
export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const amount = Math.max(0, Math.min(100, percent)) / 100;

  const r = rgb.r * (1 - amount);
  const g = rgb.g * (1 - amount);
  const b = rgb.b * (1 - amount);

  return rgbToHex(r, g, b);
}

/**
 * Determines if a color should use black or white text for optimal contrast
 * Uses the W3C relative luminance formula
 * @param hex - Hex color string
 * @returns '#000000' for black or '#ffffff' for white
 */
export function getContrastColor(hex: string): '#000000' | '#ffffff' {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  // Calculate relative luminance using sRGB formula
  const toLuminance = (value: number): number => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const r = toLuminance(rgb.r);
  const g = toLuminance(rgb.g);
  const b = toLuminance(rgb.b);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return white text for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Generates a color palette with 5 shades from a base hex color
 * @param baseHex - Base hex color string
 * @returns Array of 5 hex colors [darkest, dark, base, light, lightest]
 */
export function generateColorPalette(baseHex: string): [string, string, string, string, string] {
  if (!isValidHex(baseHex)) {
    throw new Error(`Invalid hex color: ${baseHex}`);
  }

  const darkest = darken(baseHex, 40);
  const dark = darken(baseHex, 20);
  const base = baseHex;
  const light = lighten(baseHex, 20);
  const lightest = lighten(baseHex, 40);

  return [darkest, dark, base, light, lightest];
}

/**
 * Validates if a string is a valid hex color
 * @param hex - String to validate
 * @returns True if valid hex color, false otherwise
 */
export function isValidHex(hex: string): boolean {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Valid formats: 3 or 6 character hex
  const hexRegex = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/;

  return hexRegex.test(cleanHex);
}
