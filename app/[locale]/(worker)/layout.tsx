// app/[locale]/(worker)/layout.tsx
// Layout mobile-first pentru portalul angajatilor
// Bottom navigation: Tasks | Instruire | Raportare | Profil
// Auth check server-side (acelasi pattern ca dashboard)

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ClipboardList, BookOpen, AlertTriangle, User } from 'lucide-react'

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <span className="font-semibold text-gray-900 text-sm">Portal Angajat</span>
        <span className="text-xs text-gray-500">s-s-m.ro</span>
      </header>

      {/* Continut principal — padding bottom pentru bottom nav */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          <Link
            href="/portal"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-blue-600 active:text-blue-700 transition-colors"
          >
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs font-medium">Tasks</span>
          </Link>
          <Link
            href="/portal/training"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-blue-600 active:text-blue-700 transition-colors"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Instruire</span>
          </Link>
          <Link
            href="/portal/incidents/new"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-blue-600 active:text-blue-700 transition-colors"
          >
            <AlertTriangle className="w-6 h-6" />
            <span className="text-xs font-medium">Raportare</span>
          </Link>
          <Link
            href="/portal/profile"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-blue-600 active:text-blue-700 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
