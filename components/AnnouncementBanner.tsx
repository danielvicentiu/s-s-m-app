'use client'

import { useState, useEffect } from 'react'
import { X, Info, AlertTriangle, XCircle } from 'lucide-react'
import { Announcement, AnnouncementType } from '@/lib/types'
import { createSupabaseBrowser } from '@/lib/supabase/client'

const ANNOUNCEMENT_TYPE_CONFIG = {
  info: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-900',
    icon: Info,
    iconColor: 'text-blue-600'
  },
  warning: {
    bg: 'bg-orange-50 border-orange-200',
    text: 'text-orange-900',
    icon: AlertTriangle,
    iconColor: 'text-orange-600'
  },
  critical: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-900',
    icon: XCircle,
    iconColor: 'text-red-600'
  }
}

interface AnnouncementBannerProps {
  userId: string
}

export function AnnouncementBanner({ userId }: AnnouncementBannerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    // Load dismissed announcements from localStorage
    const dismissed = localStorage.getItem('dismissedAnnouncements')
    if (dismissed) {
      try {
        setDismissedIds(new Set(JSON.parse(dismissed)))
      } catch (e) {
        console.error('Error parsing dismissed announcements:', e)
      }
    }

    // Fetch active announcements
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString())
      .order('type', { ascending: false }) // critical > warning > info

    if (error) {
      console.error('Error fetching announcements:', error)
      return
    }

    setAnnouncements(data || [])
  }

  const handleDismiss = (id: string) => {
    const newDismissed = new Set(dismissedIds)
    newDismissed.add(id)
    setDismissedIds(newDismissed)
    localStorage.setItem('dismissedAnnouncements', JSON.stringify([...newDismissed]))
  }

  const visibleAnnouncements = announcements.filter(a => !dismissedIds.has(a.id))

  if (visibleAnnouncements.length === 0) return null

  return (
    <div className="space-y-3">
      {visibleAnnouncements.map(announcement => {
        const config = ANNOUNCEMENT_TYPE_CONFIG[announcement.type]
        const Icon = config.icon

        return (
          <div
            key={announcement.id}
            className={`flex items-start gap-4 rounded-lg border-l-4 p-4 shadow-sm ${config.bg}`}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
            <div className="flex-1">
              <h3 className={`font-semibold ${config.text}`}>{announcement.title}</h3>
              <p className={`mt-1 text-sm ${config.text}`}>{announcement.message}</p>
            </div>
            <button
              onClick={() => handleDismiss(announcement.id)}
              className={`rounded p-1 hover:bg-white/50 ${config.iconColor}`}
              aria-label="Închide anunțul"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
