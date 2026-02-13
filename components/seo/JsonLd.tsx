/**
 * JsonLd Component
 *
 * Reusable component for inserting JSON-LD structured data into page head.
 * Handles serialization and proper script tag rendering.
 *
 * @example
 * ```tsx
 * import { JsonLd } from '@/components/seo/JsonLd';
 * import { organizationJsonLd } from '@/lib/seo/jsonld';
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <JsonLd data={organizationJsonLd('ro')} />
 *       <main>...</main>
 *     </>
 *   );
 * }
 * ```
 */

import type { WithContext } from 'schema-dts';

interface JsonLdProps {
  data: WithContext<any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
