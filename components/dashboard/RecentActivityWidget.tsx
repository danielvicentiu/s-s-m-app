'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import {
  UserPlus,
  GraduationCap,
  FileText,
  CheckCircle,
  Settings,
  Activity,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ro } from 'date-fns/locale'

interface AuditLogEntry {
  id: string
  organization_id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  old_value: any
  new_value: any
  metadata: Record<string, any>
  ip_address: string | null
  user_agent: string | null
  created_at: string
  // Joined data
  profiles?: {
    full_name: string
    avatar_url: string | null
  }
}

interface ActivityItem {
  id: string
  userId: string | null
  userName: string
  userAvatar: string | null
  actionText: string
  resourceLink: string | null
  resourceText: string | null
  timestamp: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
}

const ACTION_CONFIGS: Record<string, {
  getText: (metadata: any) => string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  getLink?: (entityId: string | null, metadata: any) => string | null
  getLinkText?: (metadata: any) => string | null
}> = {
  employee_added: {
    getText: (_metadata) => `a adăugat angajatul`,
    icon: UserPlus,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    getLink: (entityId) => entityId ? `/dashboard/employees/${entityId}` : null,
    getLinkText: (metadata) => metadata?.employee_name || 'Vezi detalii',
  },
  training_completed: {
    getText: (_metadata) => `a finalizat instruirea`,
    icon: GraduationCap,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
    getLink: (entityId) => entityId ? `/dashboard/trainings/${entityId}` : null,
    getLinkText: (metadata) => metadata?.training_name || 'Vezi certificat',
  },
  document_generated: {
    getText: (_metadata) => `a generat document`,
    icon: FileText,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    getLink: (entityId) => entityId ? `/dashboard/documents/${entityId}` : null,
    getLinkText: (metadata) => metadata?.document_type || 'Vezi document',
  },
  alert_resolved: {
    getText: (_metadata) => `a rezolvat alerta`,
    icon: CheckCircle,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    getLink: (entityId) => entityId ? `/dashboard/alerts/${entityId}` : null,
    getLinkText: (metadata) => metadata?.alert_type || 'Vezi alertă',
  },
  settings_changed: {
    getText: (_metadata) => `a modificat setările`,
    icon: Settings,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    getLink: () => '/dashboard/settings',
    getLinkText: (metadata) => metadata?.setting_name || 'Vezi setări',
  },
}

const DEFAULT_ACTION = {
  getText: (metadata: any) => metadata?.action_description || 'a efectuat o acțiune',
  icon: Activity,
  iconColor: 'text-gray-600',
  iconBg: 'bg-gray-50',
  getLink: (): null => null,
  getLinkText: (): null => null,
}

function transformAuditLogToActivity(entry: AuditLogEntry): ActivityItem {
  const config = ACTION_CONFIGS[entry.action] || DEFAULT_ACTION

  return {
    id: entry.id,
    userId: entry.user_id,
    userName: entry.profiles?.full_name || 'Utilizator necunoscut',
    userAvatar: entry.profiles?.avatar_url || null,
    actionText: config.getText(entry.metadata),
    resourceLink: config.getLink?.(entry.entity_id, entry.metadata) || null,
    resourceText: config.getLinkText?.(entry.metadata) || null,
    timestamp: entry.created_at,
    icon: config.icon,
    iconColor: config.iconColor,
    iconBg: config.iconBg,
  }
}

export function RecentActivityWidget() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function loadActivities() {
      try {
        setIsLoading(true)
        setError(null)

        // Get current user's organization
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('Nu ești autentificat')
          return
        }

        const { data: membership } = await supabase
          .from('memberships')
          .select('organization_id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single()

        if (!membership) {
          setError('Nu ai o organizație activă')
          return
        }

        // Fetch recent activities
        const { data, error: fetchError } = await supabase
          .from('audit_log')
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .eq('organization_id', membership.organization_id)
          .in('action', [
            'employee_added',
            'training_completed',
            'document_generated',
            'alert_resolved',
            'settings_changed'
          ])
          .order('created_at', { ascending: false })
          .limit(10)

        if (fetchError) throw fetchError

        const transformedActivities = (data || []).map(transformAuditLogToActivity)
        setActivities(transformedActivities)

        // Setup real-time subscription
        channel = supabase
          .channel('audit-log-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'audit_log',
              filter: `organization_id=eq.${membership.organization_id}`,
            },
            async (payload) => {
              const newEntry = payload.new as AuditLogEntry

              // Only process tracked action types
              if (!ACTION_CONFIGS[newEntry.action]) return

              // Fetch profile data for the new entry
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', newEntry.user_id)
                .single()

              const entryWithProfile = {
                ...newEntry,
                profiles: profile || undefined,
              }

              const newActivity = transformAuditLogToActivity(entryWithProfile)

              setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
            }
          )
          .subscribe()
      } catch (err) {
        console.error('Error loading activities:', err)
        setError('Eroare la încărcarea activităților')
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Activitate recentă
        </h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Activitate recentă
        </h2>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Activitate recentă
        </h2>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Nu există activități recente
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Activitate recentă
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 group"
            >
              {/* User Avatar or Icon */}
              <div className="flex-shrink-0">
                {activity.userAvatar ? (
                  <img
                    src={activity.userAvatar}
                    alt={activity.userName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full ${activity.iconBg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.userName}</span>
                  {' '}
                  <span className="text-gray-600">{activity.actionText}</span>
                  {activity.resourceLink && activity.resourceText && (
                    <>
                      {' '}
                      <Link
                        href={activity.resourceLink}
                        className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                      >
                        {activity.resourceText}
                      </Link>
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    locale: ro,
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
