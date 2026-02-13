'use client'

import { useMemo } from 'react'

export interface ExpiringItem {
  id: string
  type: 'medical' | 'equipment' | 'training'
  title: string
  employeeName?: string
  expiryDate: string
  status: 'expired' | 'critical' | 'warning'
}

interface ExpiringTimelineProps {
  items: ExpiringItem[]
  className?: string
}

interface TimelineDay {
  date: Date
  dateStr: string
  items: ExpiringItem[]
  isToday: boolean
}

const STATUS_CONFIG = {
  expired: {
    bg: 'bg-red-500',
    ring: 'ring-red-500',
    text: 'text-red-700',
    label: 'Expirat',
  },
  critical: {
    bg: 'bg-orange-500',
    ring: 'ring-orange-500',
    text: 'text-orange-700',
    label: 'Urgent (7 zile)',
  },
  warning: {
    bg: 'bg-yellow-500',
    ring: 'ring-yellow-500',
    text: 'text-yellow-700',
    label: 'Atenție (30 zile)',
  },
}

const TYPE_LABELS = {
  medical: 'Examen Medical',
  equipment: 'Echipament',
  training: 'Instruire',
}

function getExpiryStatus(expiryDate: string): 'expired' | 'critical' | 'warning' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 7) return 'critical'
  return 'warning'
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })
}

export function ExpiringTimeline({ items, className = '' }: ExpiringTimelineProps) {
  const timelineDays = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Generate 30 days from today
    const days: TimelineDay[] = []
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      days.push({
        date,
        dateStr,
        items: [],
        isToday: i === 0,
      })
    }

    // Assign items to their expiry dates
    items.forEach((item) => {
      const itemDate = new Date(item.expiryDate)
      itemDate.setHours(0, 0, 0, 0)
      const itemDateStr = itemDate.toISOString().split('T')[0]

      const dayIndex = days.findIndex((d) => d.dateStr === itemDateStr)
      if (dayIndex !== -1) {
        days[dayIndex].items.push({
          ...item,
          status: getExpiryStatus(item.expiryDate),
        })
      }
    })

    return days
  }, [items])

  const hasItems = items.length > 0

  if (!hasItems) {
    return (
      <div className={`rounded-2xl bg-white border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Timeline Expirări - Următoarele 30 Zile
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>Nu există elemente care expiră în următoarele 30 de zile</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl bg-white border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Timeline Expirări - Următoarele 30 Zile
        </h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">Expirat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-600">Urgent (≤7 zile)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Atenție (≤30 zile)</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-4">
        <div className="flex gap-2 min-w-max">
          {timelineDays.map((day, index) => {
            const hasItemsOnDay = day.items.length > 0
            const itemCount = day.items.length

            return (
              <div
                key={day.dateStr}
                className="relative flex flex-col items-center"
                style={{ minWidth: '60px' }}
              >
                {/* Date label */}
                <div
                  className={`text-xs mb-2 text-center ${
                    day.isToday
                      ? 'font-semibold text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {formatDate(day.date)}
                </div>

                {/* Timeline point */}
                <div className="relative flex items-center justify-center">
                  {/* Connecting line */}
                  {index > 0 && (
                    <div
                      className="absolute right-full w-2 h-0.5 bg-gray-300"
                      style={{ marginRight: '-0.25rem' }}
                    />
                  )}

                  {/* Point with tooltip */}
                  {hasItemsOnDay ? (
                    <div className="group relative">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          day.items[0].status === 'expired'
                            ? 'bg-red-500 ring-4 ring-red-100'
                            : day.items[0].status === 'critical'
                            ? 'bg-orange-500 ring-4 ring-orange-100'
                            : 'bg-yellow-500 ring-4 ring-yellow-100'
                        } cursor-pointer transition-transform hover:scale-125`}
                      />

                      {/* Item count badge */}
                      {itemCount > 1 && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-semibold">
                          {itemCount}
                        </div>
                      )}

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                        <div className="bg-gray-900 text-white rounded-lg shadow-lg p-3 min-w-[200px] max-w-[300px]">
                          <div className="text-xs font-semibold mb-2 border-b border-gray-700 pb-2">
                            {formatDate(day.date)} — {itemCount} {itemCount === 1 ? 'element' : 'elemente'}
                          </div>
                          <div className="space-y-2">
                            {day.items.map((item) => (
                              <div key={item.id} className="text-xs">
                                <div className="font-medium">
                                  {TYPE_LABELS[item.type]}: {item.title}
                                </div>
                                {item.employeeName && (
                                  <div className="text-gray-400">
                                    {item.employeeName}
                                  </div>
                                )}
                                <div
                                  className={`mt-0.5 text-xs ${
                                    item.status === 'expired'
                                      ? 'text-red-400'
                                      : item.status === 'critical'
                                      ? 'text-orange-400'
                                      : 'text-yellow-400'
                                  }`}
                                >
                                  {STATUS_CONFIG[item.status].label}
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Tooltip arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-gray-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          day.isToday ? 'bg-blue-400' : 'bg-gray-300'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Today indicator */}
                {day.isToday && (
                  <div className="mt-2 text-xs font-medium text-blue-600">
                    Astăzi
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile-friendly scroll hint */}
      <div className="text-xs text-gray-400 text-center mt-2">
        ← Scroll orizontal pentru a vedea toate zilele →
      </div>
    </div>
  )
}
