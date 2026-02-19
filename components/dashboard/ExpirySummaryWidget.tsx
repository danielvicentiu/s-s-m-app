'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { AlertCircle, Clock, Info, ChevronRight } from 'lucide-react'

interface ExpiringItem {
  id: string
  type: 'training' | 'medical' | 'equipment' | 'document'
  title: string
  subtitle: string | null
  expiryDate: string
  daysRemaining: number
  link: string
}

interface ExpirySectionData {
  count: number
  items: ExpiringItem[]
}

interface WidgetData {
  critical: ExpirySectionData // 0-7 days
  warning: ExpirySectionData // 8-30 days
  info: ExpirySectionData // 31-90 days
}

export function ExpirySummaryWidget() {
  const [data, setData] = useState<WidgetData>({
    critical: { count: 0, items: [] },
    warning: { count: 0, items: [] },
    info: { count: 0, items: [] },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadExpiringItems() {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = createSupabaseBrowser()

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

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const date7 = new Date(today)
        date7.setDate(date7.getDate() + 7)

        const date30 = new Date(today)
        date30.setDate(date30.getDate() + 30)

        const date90 = new Date(today)
        date90.setDate(date90.getDate() + 90)

        const allItems: ExpiringItem[] = []

        // Fetch trainings (assuming they have expiry_date or valid_until)
        // Note: trainings table structure is inferred from context
        const { data: trainings } = await supabase
          .from('trainings')
          .select('id, training_name, employee_name, valid_until, expiry_date')
          .eq('organization_id', membership.organization_id)
          .or(`valid_until.lte.${date90.toISOString()},expiry_date.lte.${date90.toISOString()}`)
          .order('valid_until', { ascending: true })

        if (trainings) {
          trainings.forEach((t: any) => {
            const expiryDate = new Date(t.valid_until || t.expiry_date)
            const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            if (daysRemaining >= 0 && daysRemaining <= 90) {
              allItems.push({
                id: t.id,
                type: 'training',
                title: t.training_name || 'Instruire',
                subtitle: t.employee_name,
                expiryDate: t.valid_until || t.expiry_date,
                daysRemaining,
                link: `/dashboard/trainings/${t.id}`,
              })
            }
          })
        }

        // Fetch medical examinations
        const { data: medical } = await supabase
          .from('medical_examinations')
          .select('id, employee_name, examination_type, expiry_date, clinic_name')
          .eq('organization_id', membership.organization_id)
          .lte('expiry_date', date90.toISOString())
          .order('expiry_date', { ascending: true })

        if (medical) {
          medical.forEach((m: any) => {
            const expiryDate = new Date(m.expiry_date)
            const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            if (daysRemaining >= 0 && daysRemaining <= 90) {
              allItems.push({
                id: m.id,
                type: 'medical',
                title: `Fișă medicală - ${m.employee_name}`,
                subtitle: m.clinic_name,
                expiryDate: m.expiry_date,
                daysRemaining,
                link: `/dashboard/medical/${m.id}`,
              })
            }
          })
        }

        // Fetch equipment
        const { data: equipment } = await supabase
          .from('safety_equipment')
          .select('id, equipment_type, description, location, expiry_date, inspector_name')
          .eq('organization_id', membership.organization_id)
          .lte('expiry_date', date90.toISOString())
          .order('expiry_date', { ascending: true })

        if (equipment) {
          equipment.forEach((e: any) => {
            const expiryDate = new Date(e.expiry_date)
            const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            if (daysRemaining >= 0 && daysRemaining <= 90) {
              allItems.push({
                id: e.id,
                type: 'equipment',
                title: e.description || e.equipment_type,
                subtitle: e.location,
                expiryDate: e.expiry_date,
                daysRemaining,
                link: `/dashboard/equipment/${e.id}`,
              })
            }
          })
        }

        // Fetch documents (assuming they have expiry or validity fields)
        const { data: documents } = await supabase
          .from('generated_documents')
          .select('id, document_type, file_name, created_at')
          .eq('organization_id', membership.organization_id)
          .order('created_at', { ascending: false })
          .limit(100)

        if (documents) {
          documents.forEach((d: any) => {
            // Assuming documents expire 1 year after creation
            const createdDate = new Date(d.created_at)
            const expiryDate = new Date(createdDate)
            expiryDate.setFullYear(expiryDate.getFullYear() + 1)

            const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            if (daysRemaining >= 0 && daysRemaining <= 90) {
              allItems.push({
                id: d.id,
                type: 'document',
                title: d.document_type,
                subtitle: d.file_name,
                expiryDate: expiryDate.toISOString(),
                daysRemaining,
                link: `/dashboard/documents/${d.id}`,
              })
            }
          })
        }

        // Sort by days remaining
        allItems.sort((a, b) => a.daysRemaining - b.daysRemaining)

        // Categorize items
        const critical = allItems.filter(item => item.daysRemaining <= 7)
        const warning = allItems.filter(item => item.daysRemaining > 7 && item.daysRemaining <= 30)
        const info = allItems.filter(item => item.daysRemaining > 30 && item.daysRemaining <= 90)

        setData({
          critical: { count: critical.length, items: critical.slice(0, 3) },
          warning: { count: warning.length, items: warning.slice(0, 3) },
          info: { count: info.length, items: info.slice(0, 3) },
        })
      } catch (err) {
        console.error('Error loading expiring items:', err)
        setError('Eroare la încărcarea datelor')
      } finally {
        setIsLoading(false)
      }
    }

    loadExpiringItems()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Expirări iminente
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="space-y-2">
                <div className="h-12 bg-gray-100 rounded" />
                <div className="h-12 bg-gray-100 rounded" />
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
          Expirări iminente
        </h2>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  const totalCount = data.critical.count + data.warning.count + data.info.count

  if (totalCount === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Expirări iminente
        </h2>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Nu există elemente care expiră în următoarele 90 de zile
          </p>
        </div>
      </div>
    )
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'training': return 'Instruire'
      case 'medical': return 'Medical'
      case 'equipment': return 'Echipament'
      case 'document': return 'Document'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'training': return 'text-green-600 bg-green-50'
      case 'medical': return 'text-blue-600 bg-blue-50'
      case 'equipment': return 'text-orange-600 bg-orange-50'
      case 'document': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Expirări iminente
      </h2>

      <div className="space-y-6">
        {/* CRITICAL: 0-7 days */}
        {data.critical.count > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Următoarele 7 zile
                </h3>
                <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-2 text-xs font-semibold text-white bg-red-600 rounded-full">
                  {data.critical.count}
                </span>
              </div>
              {data.critical.count > 3 && (
                <Link
                  href="/dashboard/alerts?range=7d"
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  Vezi toate
                  <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            <div className="space-y-2">
              {data.critical.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="block p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                          {getTypeLabel(item.type)}
                        </span>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-gray-600 truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-red-700">
                        {item.daysRemaining === 0 ? 'Astăzi' : `${item.daysRemaining}z`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.expiryDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* WARNING: 8-30 days */}
        {data.warning.count > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Următoarele 8-30 zile
                </h3>
                <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-2 text-xs font-semibold text-white bg-amber-600 rounded-full">
                  {data.warning.count}
                </span>
              </div>
              {data.warning.count > 3 && (
                <Link
                  href="/dashboard/alerts?range=30d"
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                >
                  Vezi toate
                  <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            <div className="space-y-2">
              {data.warning.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="block p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                          {getTypeLabel(item.type)}
                        </span>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-gray-600 truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-amber-700">
                        {item.daysRemaining}z
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.expiryDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* INFO: 31-90 days */}
        {data.info.count > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Următoarele 31-90 zile
                </h3>
                <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-2 text-xs font-semibold text-white bg-blue-600 rounded-full">
                  {data.info.count}
                </span>
              </div>
              {data.info.count > 3 && (
                <Link
                  href="/dashboard/alerts?range=90d"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  Vezi toate
                  <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            <div className="space-y-2">
              {data.info.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="block p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                          {getTypeLabel(item.type)}
                        </span>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-gray-600 truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-blue-700">
                        {item.daysRemaining}z
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.expiryDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
