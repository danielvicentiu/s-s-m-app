'use client'

// components/alerts/AlertBadge.tsx
// Badge cu numărul de alerte pending — afișat în Topbar lângă NotificationBell
// Se actualizează în timp real via Supabase Realtime

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import { useOrg } from '@/lib/contexts/OrgContext'

export default function AlertBadge() {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const { currentOrg } = useOrg()
  const pathname = usePathname()

  const isActive = pathname?.includes('/dashboard/alerts')

  useEffect(() => {
    if (!currentOrg || currentOrg === 'all') {
      setLoading(false)
      return
    }

    const supabase = createSupabaseBrowser()

    async function fetchCount() {
      const { count: n } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', currentOrg as string)
        .eq('status', 'pending')

      setCount(n ?? 0)
      setLoading(false)
    }

    fetchCount()

    // Supabase Realtime — actualizare automată la modificări
    const channel = supabase
      .channel(`alerts-badge-${currentOrg}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `organization_id=eq.${currentOrg}`,
        },
        () => {
          fetchCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentOrg])

  if (loading || count === 0) {
    return (
      <Link
        href={pathname?.includes('/ro/') ? '/ro/dashboard/alerts' :
              pathname?.includes('/en/') ? '/en/dashboard/alerts' :
              '/dashboard/alerts'}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
          isActive ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }`}
        title="Alerte"
      >
        <Bell className="h-5 w-5" />
      </Link>
    )
  }

  // Extrage locale din pathname (ex: /ro/dashboard/...)
  const localeMatch = pathname?.match(/^\/([a-z]{2})\//)
  const locale = localeMatch ? localeMatch[1] : 'ro'

  return (
    <Link
      href={`/${locale}/dashboard/alerts`}
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
        isActive ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      }`}
      title={`${count} alertă${count !== 1 ? 'e' : ''} pending`}
    >
      <Bell className="h-5 w-5" />
      <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground leading-none">
        {count > 99 ? '99+' : count}
      </span>
    </Link>
  )
}
