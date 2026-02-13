'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView, initGA } from '@/lib/analytics';

/**
 * Google Analytics 4 component
 * Privacy-compliant analytics with cookie consent support
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Track page views on route change
  useEffect(() => {
    if (!measurementId) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams, measurementId]);

  // Don't render if no measurement ID
  if (!measurementId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default consent to denied
            gtag('consent', 'default', {
              'analytics_storage': 'denied'
            });

            // Initialize GA
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}
