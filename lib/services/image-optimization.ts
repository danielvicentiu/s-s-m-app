/**
 * Image Optimization Service
 * Client-side image processing utilities for resizing, compression, and format conversion
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
  quality?: number;
}

export interface CompressionOptions {
  quality?: number; // 0.0 - 1.0
  maxSizeMB?: number;
}

/**
 * Get dimensions of an image file
 */
export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number
): ImageDimensions {
  let width = originalWidth;
  let height = originalHeight;

  // If no constraints, return original dimensions
  if (!maxWidth && !maxHeight) {
    return { width, height };
  }

  // Calculate scaling factors
  const widthScale = maxWidth ? maxWidth / originalWidth : Infinity;
  const heightScale = maxHeight ? maxHeight / originalHeight : Infinity;
  const scale = Math.min(widthScale, heightScale, 1); // Don't upscale

  width = Math.round(originalWidth * scale);
  height = Math.round(originalHeight * scale);

  return { width, height };
}

/**
 * Resize an image file using Canvas API
 * @param file - Image file to resize
 * @param maxWidth - Maximum width (optional)
 * @param maxHeight - Maximum height (optional)
 * @param quality - JPEG quality 0-1, default 0.9
 * @returns Resized image as File
 */
export async function resizeImage(
  file: File,
  maxWidth?: number,
  maxHeight?: number,
  quality: number = 0.9
): Promise<File> {
  // Get original dimensions
  const originalDimensions = await getImageDimensions(file);

  // Calculate new dimensions
  const newDimensions = calculateDimensions(
    originalDimensions.width,
    originalDimensions.height,
    maxWidth,
    maxHeight
  );

  // If no resize needed, return original
  if (
    newDimensions.width === originalDimensions.width &&
    newDimensions.height === originalDimensions.height
  ) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = newDimensions.width;
        canvas.height = newDimensions.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Draw resized image
        ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);

            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            // Create new file
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(resizedFile);
          },
          file.type,
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Compress an image file
 * @param file - Image file to compress
 * @param quality - Compression quality 0-1, default 0.8
 * @returns Compressed image as File
 */
export async function compressImage(
  file: File,
  quality: number = 0.8
): Promise<File> {
  // Ensure quality is within bounds
  quality = Math.max(0, Math.min(1, quality));

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // Create canvas with original dimensions
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);

            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            // Create new file
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          file.type,
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Generate a thumbnail from an image file
 * @param file - Image file
 * @param size - Thumbnail size (square), default 150px
 * @param quality - JPEG quality 0-1, default 0.85
 * @returns Thumbnail as File
 */
export async function generateThumbnail(
  file: File,
  size: number = 150,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // Create square canvas
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Calculate crop to center square
        const minDimension = Math.min(img.width, img.height);
        const sx = (img.width - minDimension) / 2;
        const sy = (img.height - minDimension) / 2;

        // Draw cropped and resized image
        ctx.drawImage(
          img,
          sx,
          sy,
          minDimension,
          minDimension,
          0,
          0,
          size,
          size
        );

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);

            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            // Create thumbnail file
            const thumbnailFile = new File(
              [blob],
              `thumb_${file.name}`,
              {
                type: file.type,
                lastModified: Date.now(),
              }
            );

            resolve(thumbnailFile);
          },
          file.type,
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Convert an image file to WebP format
 * @param file - Image file to convert
 * @param quality - WebP quality 0-1, default 0.9
 * @returns WebP image as File
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.9
): Promise<File> {
  // Check if browser supports WebP
  const canvas = document.createElement('canvas');
  const supportsWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp');

  if (!supportsWebP) {
    throw new Error('Browser does not support WebP format');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // Create canvas with original dimensions
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);

            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            // Create new file with .webp extension
            const fileName = file.name.replace(/\.[^.]+$/, '.webp');
            const webpFile = new File([blob], fileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Optimize image for upload (resize + compress)
 * @param file - Image file to optimize
 * @param options - Optimization options
 * @returns Optimized image as File
 */
export async function optimizeImageForUpload(
  file: File,
  options: ResizeOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
  } = options;

  // First resize if needed
  let optimizedFile = await resizeImage(file, maxWidth, maxHeight, quality);

  // Check file size and compress more if needed
  const maxSizeMB = 2;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (optimizedFile.size > maxSizeBytes) {
    // Compress further with lower quality
    optimizedFile = await compressImage(optimizedFile, quality * 0.8);
  }

  return optimizedFile;
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB, default 10
 * @returns true if valid, throws error otherwise
 */
export function validateImageFile(file: File, maxSizeMB: number = 10): boolean {
  // Check if file exists
  if (!file) {
    throw new Error('Nu a fost selectat niciun fișier');
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Tip de fișier invalid. Folosiți JPG, PNG, WebP sau GIF');
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`Fișierul este prea mare. Mărime maximă: ${maxSizeMB}MB`);
  }

  return true;
}
