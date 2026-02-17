// app/[locale]/upload/[token]/page.tsx
// Public page — no authentication required
// Validates token server-side and renders the upload portal

import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import UploadPortalClient from './UploadPortalClient'

interface Props {
  params: Promise<{ locale: string; token: string }>
}

export const metadata: Metadata = {
  title: 'Trimite documente — s-s-m.ro',
  description: 'Portal securizat pentru trimiterea documentelor',
  robots: 'noindex, nofollow',
}

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export default async function UploadPortalPage({ params }: Props) {
  const { token } = await params
  const supabase = createServiceRoleClient()

  // Validate token server-side
  const { data: link, error } = await supabase
    .from('upload_links')
    .select(`
      id,
      label,
      is_active,
      expires_at,
      organization:organizations (
        id,
        name
      )
    `)
    .eq('token', token)
    .single()

  const isExpired = link?.expires_at && new Date(link.expires_at) < new Date()
  const isInvalid = error || !link || !link.is_active || isExpired

  if (isInvalid) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <div className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm tracking-wide">
              s-s-m.ro
            </div>
            <span className="text-gray-500 text-sm">Platformă SSM &amp; PSI</span>
          </div>
        </header>

        {/* Error content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {isExpired ? 'Link expirat' : 'Link invalid'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isExpired
                ? 'Acest link de upload a expirat.'
                : 'Acest link este invalid sau nu mai este activ.'}
            </p>
            <p className="text-gray-400 text-xs mt-4">
              Contactați consultantul SSM pentru un link nou.
            </p>
          </div>
        </main>

        <footer className="py-4 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2026 s-s-m.ro &mdash; Platformă SSM &amp; PSI
          </p>
        </footer>
      </div>
    )
  }

  const org = link.organization as { id: string; name: string } | null

  return (
    <UploadPortalClient
      token={token}
      label={link.label || 'Trimite documente'}
      organizationName={org?.name || ''}
    />
  )
}
