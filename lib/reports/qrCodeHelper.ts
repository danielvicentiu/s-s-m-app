// lib/reports/qrCodeHelper.ts
// QR Code generation helper using CDN-based service
// Data: 17 Februarie 2026

/**
 * Returns a QR code image URL for the given data string.
 * Uses api.qrserver.com CDN — no package install required.
 */
export async function generateQRCodeDataURL(url: string): Promise<string> {
  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=1&data=${encodeURIComponent(url)}`
}
