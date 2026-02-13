/**
 * Google Analytics 4 utility functions
 * Privacy-compliant tracking with cookie consent support
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Check if user has given consent for analytics cookies
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for cookie consent
  // You can integrate with your cookie consent solution here
  // For now, checking if consent cookie exists
  const consent = document.cookie
    .split('; ')
    .find(row => row.startsWith('analytics_consent='));

  return consent ? consent.split('=')[1] === 'true' : false;
}

/**
 * Initialize Google Analytics
 */
export function initGA(measurementId: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
    cookie_flags: 'SameSite=None;Secure',
    anonymize_ip: true, // Privacy feature
  });
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string): void {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === 'undefined' || !window.gtag) return;

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  window.gtag('config', measurementId, {
    page_path: url,
    page_title: title,
  });
}

/**
 * Track custom event
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

/**
 * Set user properties (after consent)
 */
export function setUserProperties(properties: Record<string, any>): void {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
}

/**
 * Grant or revoke analytics consent
 */
export function updateAnalyticsConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;

  // Set consent cookie (expires in 1 year)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `analytics_consent=${granted}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`;

  // Update gtag consent
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }
}
