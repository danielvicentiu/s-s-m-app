'use client'

import { ReactNode } from 'react'

export interface TimelineEvent {
  date: Date | string
  title: string
  description: string
  type: 'success' | 'warning' | 'error' | 'info' | 'default'
  icon?: ReactNode
}

interface TimelineProps {
  events: TimelineEvent[]
}

const typeColors = {
  success: 'bg-green-500 ring-green-500/20',
  warning: 'bg-yellow-500 ring-yellow-500/20',
  error: 'bg-red-500 ring-red-500/20',
  info: 'bg-blue-500 ring-blue-500/20',
  default: 'bg-gray-400 ring-gray-400/20'
}

const formatDateRomanian = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date

  const months = [
    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
  ]

  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()

  return `${day} ${month} ${year}`
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative py-8">
      {/* Vertical line - hidden on mobile, visible on desktop */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 md:left-1/2 md:-translate-x-px" />

      <div className="space-y-12">
        {events.map((event, index) => {
          const isEven = index % 2 === 0
          const colorClass = typeColors[event.type] || typeColors.default

          return (
            <div
              key={index}
              className="relative animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'backwards'
              }}
            >
              {/* Mobile & Tablet: all left */}
              <div className="md:hidden">
                <div className="flex gap-4">
                  {/* Dot */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full ${colorClass} ring-8 ring-white shadow-lg flex items-center justify-center text-white`}
                    >
                      {event.icon || (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <time className="text-sm font-medium text-gray-500 mb-1 block">
                      {formatDateRomanian(event.date)}
                    </time>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop: alternating left/right */}
              <div className="hidden md:block">
                <div className="flex items-center">
                  {/* Left side content (for even indices) */}
                  <div className={`w-1/2 ${isEven ? 'pr-12 text-right' : ''}`}>
                    {isEven && (
                      <div>
                        <time className="text-sm font-medium text-gray-500 mb-1 block">
                          {formatDateRomanian(event.date)}
                        </time>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="relative flex-shrink-0 z-10">
                    <div
                      className={`w-12 h-12 rounded-full ${colorClass} ring-8 ring-white shadow-lg flex items-center justify-center text-white`}
                    >
                      {event.icon || (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Right side content (for odd indices) */}
                  <div className={`w-1/2 ${!isEven ? 'pl-12' : ''}`}>
                    {!isEven && (
                      <div>
                        <time className="text-sm font-medium text-gray-500 mb-1 block">
                          {formatDateRomanian(event.date)}
                        </time>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
