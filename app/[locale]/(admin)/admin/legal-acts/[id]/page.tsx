// app/[locale]/admin/legal-acts/[id]/page.tsx
import LegalActDetailClient from './LegalActDetailClient'

export default async function LegalActDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <LegalActDetailClient actId={id} locale={locale} />
    </div>
  )
}
