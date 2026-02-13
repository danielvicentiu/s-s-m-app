/**
 * Color utility functions for hex/rgb conversion and manipulation
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts a hex color to RGB object
 * @param hex - Hex color string (with or without #)
 * @returns RGB object with r, g, b values (0-255)
 * @throws Error if hex format is invalid
 */
export function hexToRgb(hex: string): RGB {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex) && !/^[0-9A-Fa-f]{3}$/.test(cleanHex)) {
    throw new Error(`Invalid hex color format: ${hex}`);
  }

  // Handle 3-digit hex (e.g., #fff -> #ffffff)
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;

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
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

  const toHex = (value: number) => {
    const hex = clamp(value).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Lightens a hex color by a percentage
 * @param hex - Hex color string
 * @param amount - Amount to lighten (0-1, where 0.1 = 10% lighter)
 * @returns Lightened hex color string
 */
export function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clampedAmount = Math.max(0, Math.min(1, amount));

  const newR = r + (255 - r) * clampedAmount;
  const newG = g + (255 - g) * clampedAmount;
  const newB = b + (255 - b) * clampedAmount;

  return rgbToHex(newR, newG, newB);
}

/**
 * Darkens a hex color by a percentage
 * @param hex - Hex color string
 * @param amount - Amount to darken (0-1, where 0.1 = 10% darker)
 * @returns Darkened hex color string
 */
export function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clampedAmount = Math.max(0, Math.min(1, amount));

  const newR = r * (1 - clampedAmount);
  const newG = g * (1 - clampedAmount);
  const newB = b * (1 - clampedAmount);

  return rgbToHex(newR, newG, newB);
}

/**
 * Determines the best contrast color (black or white) for a given background color
 * Uses relative luminance formula (WCAG 2.0)
 * @param bgHex - Background hex color string
 * @returns '#000000' for black or '#ffffff' for white
 */
export function getContrastColor(bgHex: string): '#000000' | '#ffffff' {
  const { r, g, b } = hexToRgb(bgHex);

  // Convert RGB to relative luminance (WCAG 2.0 formula)
  const toLuminance = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const rLum = toLuminance(r);
  const gLum = toLuminance(g);
  const bLum = toLuminance(b);

  // Calculate relative luminance
  const luminance = 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Generates a color palette based on a base color
 * @param baseHex - Base hex color string
 * @param steps - Number of steps in the palette (default: 9)
 * @returns Array of hex color strings from darkest to lightest
 */
export function generatePalette(baseHex: string, steps: number = 9): string[] {
  if (steps < 1) {
    throw new Error('Steps must be at least 1');
  }

  const palette: string[] = [];
  const middleIndex = Math.floor(steps / 2);

  // Generate palette with base color in the middle
  for (let i = 0; i < steps; i++) {
    if (i === middleIndex) {
      // Middle step is the base color
      palette.push(baseHex);
    } else if (i < middleIndex) {
      // Darker shades
      const darkenAmount = ((middleIndex - i) / middleIndex) * 0.6;
      palette.push(darken(baseHex, darkenAmount));
    } else {
      // Lighter shades
      const lightenAmount = ((i - middleIndex) / (steps - middleIndex - 1)) * 0.8;
      palette.push(lighten(baseHex, lightenAmount));
    }
  }

  return palette;
}
