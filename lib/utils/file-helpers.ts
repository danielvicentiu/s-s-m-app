/**
 * File utility functions for handling file operations
 */

/**
 * Format file size from bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "256 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Extract file extension from filename
 * @param name - File name
 * @returns File extension without dot (e.g., "pdf", "jpg")
 */
export function getFileExtension(name: string): string {
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1) return '';

  return name.substring(lastDot + 1).toLowerCase();
}

/**
 * Check if file type is allowed
 * @param name - File name
 * @param allowedTypes - Array of allowed extensions (e.g., ['pdf', 'jpg', 'png'])
 * @returns True if file type is allowed
 */
export function isAllowedFileType(name: string, allowedTypes: string[]): boolean {
  const extension = getFileExtension(name);
  if (!extension) return false;

  return allowedTypes.map(type => type.toLowerCase()).includes(extension);
}

/**
 * Generate unique filename with timestamp
 * @param prefix - Filename prefix (e.g., "avatar", "document")
 * @param extension - File extension without dot (e.g., "pdf", "jpg")
 * @returns Generated filename (e.g., "avatar_1708012345678.jpg")
 */
export function generateFileName(prefix: string, extension: string): string {
  const timestamp = Date.now();
  const cleanExtension = extension.startsWith('.') ? extension.substring(1) : extension;

  return `${prefix}_${timestamp}.${cleanExtension}`;
}

/**
 * Get MIME type from file extension
 * @param extension - File extension without dot (e.g., "pdf", "jpg")
 * @returns MIME type string (e.g., "application/pdf", "image/jpeg")
 */
export function getMimeType(extension: string): string {
  const cleanExtension = extension.toLowerCase().startsWith('.')
    ? extension.substring(1).toLowerCase()
    : extension.toLowerCase();

  const mimeTypes: Record<string, string> = {
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',

    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',

    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',

    // Other
    'json': 'application/json',
    'xml': 'application/xml',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'ts': 'application/typescript',
  };

  return mimeTypes[cleanExtension] || 'application/octet-stream';
}
