// app/[locale]/(worker)/portal/documents/page.tsx
import Link from 'next/link'

export default function PortalDocumentsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Documente</h1>
      <div className="bg-white rounded-2xl p-6 text-center">
        <p className="text-gray-500">Coming soon</p>
      </div>
      <Link href="/portal" className="mt-4 inline-block text-blue-600 text-sm">
        ← Inapoi
      </Link>
    </div>
  )
}
