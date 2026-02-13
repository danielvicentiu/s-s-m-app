/**
 * Placeholder Image Generator
 *
 * Utility functions for generating placeholder images as inline SVG or data URLs.
 * Used for avatars, company logos, icons, and charts when real images are not available.
 */

/**
 * Generates a color based on a string (for consistent avatar colors)
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

/**
 * Gets initials from a name (max 2 characters)
 */
function getInitials(name: string): string {
  if (!name || name.trim() === '') return '?';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates an avatar placeholder with initials
 *
 * @param name - User's name (e.g., "John Doe")
 * @param size - Size in pixels (default: 40)
 * @param format - Return format: 'svg' for inline SVG string, 'dataurl' for base64 data URL
 * @returns SVG string or data URL
 *
 * @example
 * ```tsx
 * <img src={avatarPlaceholder('John Doe', 64, 'dataurl')} alt="User avatar" />
 * <div dangerouslySetInnerHTML={{ __html: avatarPlaceholder('John Doe', 64, 'svg') }} />
 * ```
 */
export function avatarPlaceholder(
  name: string,
  size: number = 40,
  format: 'svg' | 'dataurl' = 'dataurl'
): string {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);
  const fontSize = Math.round(size * 0.4);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size / 2}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="600">${initials}</text>
</svg>`;

  if (format === 'svg') {
    return svg;
  }

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generates a company logo placeholder with company initials
 *
 * @param name - Company name (e.g., "Acme Corporation")
 * @param size - Size in pixels (default: 80)
 * @param format - Return format: 'svg' or 'dataurl'
 * @returns SVG string or data URL
 *
 * @example
 * ```tsx
 * <img src={companyLogoPlaceholder('Acme Corp', 120)} alt="Company logo" />
 * ```
 */
export function companyLogoPlaceholder(
  name: string,
  size: number = 80,
  format: 'svg' | 'dataurl' = 'dataurl'
): string {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);
  const fontSize = Math.round(size * 0.35);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size * 0.15}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700">${initials}</text>
</svg>`;

  if (format === 'svg') {
    return svg;
  }

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generates a feature icon placeholder
 *
 * @param icon - Icon character/emoji or letter (e.g., "📊", "A")
 * @param color - Background color (hex or CSS color, default: "#3b82f6" - blue-600)
 * @param size - Size in pixels (default: 48)
 * @param format - Return format: 'svg' or 'dataurl'
 * @returns SVG string or data URL
 *
 * @example
 * ```tsx
 * <img src={featureIconPlaceholder('📊', '#10b981', 64)} alt="Chart icon" />
 * <img src={featureIconPlaceholder('M', '#ef4444', 48)} alt="Medical icon" />
 * ```
 */
export function featureIconPlaceholder(
  icon: string,
  color: string = '#3b82f6',
  size: number = 48,
  format: 'svg' | 'dataurl' = 'dataurl'
): string {
  const fontSize = Math.round(size * 0.5);
  const isEmoji = icon.length > 1 || /\p{Emoji}/u.test(icon);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${color}" rx="${size * 0.2}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="${isEmoji ? 'system-ui' : 'system-ui, -apple-system, sans-serif'}" font-size="${fontSize}" font-weight="${isEmoji ? '400' : '600'}">${icon}</text>
</svg>`;

  if (format === 'svg') {
    return svg;
  }

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generates a chart placeholder with visual representation
 *
 * @param type - Chart type: 'bar', 'line', 'pie', 'area'
 * @param width - Width in pixels (default: 300)
 * @param height - Height in pixels (default: 200)
 * @param color - Primary color (hex or CSS color, default: "#3b82f6" - blue-600)
 * @param format - Return format: 'svg' or 'dataurl'
 * @returns SVG string or data URL
 *
 * @example
 * ```tsx
 * <img src={chartPlaceholder('bar', 400, 250)} alt="Chart placeholder" />
 * <img src={chartPlaceholder('line', 500, 300, '#10b981')} alt="Line chart" />
 * ```
 */
export function chartPlaceholder(
  type: 'bar' | 'line' | 'pie' | 'area' = 'bar',
  width: number = 300,
  height: number = 200,
  color: string = '#3b82f6',
  format: 'svg' | 'dataurl' = 'dataurl'
): string {
  const bgColor = '#f9fafb'; // gray-50
  const gridColor = '#e5e7eb'; // gray-200
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  let chartContent = '';

  switch (type) {
    case 'bar': {
      const bars = 5;
      const barWidth = chartWidth / bars * 0.6;
      const gap = chartWidth / bars * 0.4;

      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * chartHeight * 0.7 + chartHeight * 0.2;
        const x = padding + i * (barWidth + gap) + gap / 2;
        const y = height - padding - barHeight;

        chartContent += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="2"/>`;
      }
      break;
    }

    case 'line': {
      const points = 6;
      const pathPoints = [];

      for (let i = 0; i < points; i++) {
        const x = padding + (i / (points - 1)) * chartWidth;
        const y = padding + Math.random() * chartHeight * 0.7 + chartHeight * 0.15;
        pathPoints.push(`${x},${y}`);
      }

      chartContent += `<polyline points="${pathPoints.join(' ')}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

      // Add dots
      for (const point of pathPoints) {
        const [x, y] = point.split(',');
        chartContent += `<circle cx="${x}" cy="${y}" r="4" fill="${color}"/>`;
      }
      break;
    }

    case 'pie': {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2;

      const slices = [30, 25, 20, 15, 10]; // percentages
      let currentAngle = -90;

      const colors = [
        color,
        `${color}cc`, // 80% opacity
        `${color}99`, // 60% opacity
        `${color}66`, // 40% opacity
        `${color}33`, // 20% opacity
      ];

      for (let i = 0; i < slices.length; i++) {
        const angle = (slices[i] / 100) * 360;
        const startAngle = currentAngle * Math.PI / 180;
        const endAngle = (currentAngle + angle) * Math.PI / 180;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const largeArc = angle > 180 ? 1 : 0;

        chartContent += `<path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${colors[i]}" stroke="white" stroke-width="2"/>`;

        currentAngle += angle;
      }
      break;
    }

    case 'area': {
      const points = 8;
      const pathPoints = [];

      for (let i = 0; i < points; i++) {
        const x = padding + (i / (points - 1)) * chartWidth;
        const y = padding + Math.random() * chartHeight * 0.6 + chartHeight * 0.2;
        pathPoints.push({ x, y });
      }

      // Create area path
      let areaPath = `M ${padding} ${height - padding} `;
      areaPath += pathPoints.map(p => `L ${p.x} ${p.y}`).join(' ');
      areaPath += ` L ${padding + chartWidth} ${height - padding} Z`;

      chartContent += `<path d="${areaPath}" fill="${color}33" stroke="none"/>`;

      // Create line path
      const linePath = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      chartContent += `<path d="${linePath}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      break;
    }
  }

  // Grid lines
  const gridLines = type !== 'pie' ? `
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="${gridColor}" stroke-width="1"/>
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="${gridColor}" stroke-width="1"/>
  ` : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}" rx="8"/>
  ${gridLines}
  ${chartContent}
</svg>`;

  if (format === 'svg') {
    return svg;
  }

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generates a document icon placeholder
 *
 * @param extension - File extension (e.g., "PDF", "DOC", "XLS")
 * @param size - Size in pixels (default: 48)
 * @param format - Return format: 'svg' or 'dataurl'
 * @returns SVG string or data URL
 *
 * @example
 * ```tsx
 * <img src={documentPlaceholder('PDF', 64)} alt="PDF document" />
 * ```
 */
export function documentPlaceholder(
  extension: string = 'DOC',
  size: number = 48,
  format: 'svg' | 'dataurl' = 'dataurl'
): string {
  const colors: Record<string, string> = {
    PDF: '#dc2626', // red-600
    DOC: '#2563eb', // blue-600
    DOCX: '#2563eb',
    XLS: '#059669', // green-600
    XLSX: '#059669',
    PPT: '#ea580c', // orange-600
    PPTX: '#ea580c',
    TXT: '#6b7280', // gray-500
    ZIP: '#7c3aed', // violet-600
    default: '#6b7280',
  };

  const ext = extension.toUpperCase().substring(0, 4);
  const color = colors[ext] || colors.default;
  const fontSize = Math.round(size * 0.25);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <path d="M ${size * 0.2} ${size * 0.1} L ${size * 0.6} ${size * 0.1} L ${size * 0.8} ${size * 0.3} L ${size * 0.8} ${size * 0.9} L ${size * 0.2} ${size * 0.9} Z" fill="${color}" stroke="white" stroke-width="1"/>
  <path d="M ${size * 0.6} ${size * 0.1} L ${size * 0.6} ${size * 0.3} L ${size * 0.8} ${size * 0.3}" fill="none" stroke="white" stroke-width="1"/>
  <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700">${ext}</text>
</svg>`;

  if (format === 'svg') {
    return svg;
  }

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
