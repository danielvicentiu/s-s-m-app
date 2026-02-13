'use client'

import { useState } from 'react'
import { Plus, Building2, FileText, Calendar, AlertCircle, Phone, Mail, MapPin } from 'lucide-react'
import { EmptyState, StatusBadge, FormModal } from '@/components/ui'
import { createSupabaseBrowser } from '@/lib/supabase/client'

type ProviderType = 'firma_ssm' | 'clinica_medicina_muncii' | 'firma_psi' | 'iscir' | 'firma_verificare' | 'altul'

const PROVIDER_TYPES: Record<ProviderType, string> = {
  firma_ssm: 'Firmă SSM',
  clinica_medicina_muncii: 'Clinică Medicina Muncii',
  firma_psi: 'Firmă PSI',
  iscir: 'ISCIR',
  firma_verificare: 'Firmă Verificare',
  altul: 'Altul',
}

interface Provider {
  id: string
  organization_id: string
  provider_type: ProviderType
  name: string
  cui: string | null
  address: string | null
  contact_person: string | null
  contact_email: string | null
  contact_phone: string | null
  contract_number: string | null
  contract_start_date: string | null
  contract_end_date: string | null
  alert_days_before: number
  notes: string | null
  is_active: boolean
  created_at: string
  organizations?: { name: string; cui: string }
}

interface ProvidersClientProps {
  user: { email: string }
  organizations: Array<{ id: string; name: string; cui: string }>
  providers: Provider[]
}

function getContractStatus(endDate: string | null): 'valid' | 'expiring' | 'expired' | 'incomplete' {
  if (!endDate) return 'incomplete'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  const daysUntil = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntil < 0) return 'expired'
  if (daysUntil <= 30) return 'expiring'
  return 'valid'
}

function getDaysUntilExpiry(endDate: string | null): number | null {
  if (!endDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(date: string | null): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ProvidersClient({ user, organizations, providers: initialProviders }: ProvidersClientProps) {
  const [providers, setProviders] = useState(initialProviders)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSave = async (formData: Record<string, any>) => {
    setLoading(true)
    const supabase = createSupabaseBrowser()

    try {
      const payload = {
        organization_id: formData.organization_id,
        provider_type: formData.provider_type,
        name: formData.name,
        cui: formData.cui || null,
        address: formData.address || null,
        contact_person: formData.contact_person || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        contract_number: formData.contract_number || null,
        contract_start_date: formData.contract_start_date || null,
        contract_end_date: formData.contract_end_date || null,
        alert_days_before: parseInt(formData.alert_days_before) || 30,
        notes: formData.notes || null,
        is_active: formData.is_active !== false,
      }

      if (editingProvider) {
        const { error } = await supabase
          .from('providers')
          .update(payload)
          .eq('id', editingProvider.id)

        if (error) throw error

        setProviders((prev) =>
          prev.map((p) => (p.id === editingProvider.id ? { ...p, ...payload } : p))
        )
      } else {
        const { data, error } = await supabase
          .from('providers')
          .insert(payload)
          .select('*, organizations(name, cui)')
          .single()

        if (error) throw error
        if (data) setProviders((prev) => [...prev, data])
      }

      setIsModalOpen(false)
      setEditingProvider(null)
    } catch (err) {
      console.error('Error saving provider:', err)
      alert('Eroare la salvare. Verificați datele și încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur doriți să ștergeți acest furnizor?')) return

    const supabase = createSupabaseBrowser()
    const { error } = await supabase.from('providers').delete().eq('id', id)

    if (error) {
      console.error('Error deleting provider:', error)
      alert('Eroare la ștergere')
      return
    }

    setProviders((prev) => prev.filter((p) => p.id !== id))
  }

  const fields = [
    {
      name: 'organization_id',
      label: 'Organizație',
      type: 'select' as const,
      required: true,
      options: organizations.map((o) => ({ value: o.id, label: `${o.name} (${o.cui})` })),
    },
    {
      name: 'provider_type',
      label: 'Tip furnizor',
      type: 'select' as const,
      required: true,
      options: Object.entries(PROVIDER_TYPES).map(([value, label]) => ({ value, label })),
    },
    { name: 'name', label: 'Nume furnizor', type: 'text' as const, required: true },
    { name: 'cui', label: 'CUI/CIF', type: 'text' as const },
    { name: 'address', label: 'Adresă', type: 'text' as const },
    { name: 'contact_person', label: 'Persoană contact', type: 'text' as const },
    { name: 'contact_email', label: 'Email contact', type: 'email' as const },
    { name: 'contact_phone', label: 'Telefon contact', type: 'tel' as const },
    { name: 'contract_number', label: 'Număr contract', type: 'text' as const },
    { name: 'contract_start_date', label: 'Data început contract', type: 'date' as const },
    { name: 'contract_end_date', label: 'Data sfârșit contract', type: 'date' as const },
    { name: 'alert_days_before', label: 'Alertă cu X zile înainte', type: 'number' as const, defaultValue: 30 },
    { name: 'notes', label: 'Observații', type: 'textarea' as const },
    { name: 'is_active', label: 'Activ', type: 'checkbox' as const, defaultValue: true },
  ]

  const expiringProviders = providers.filter(
    (p) => p.is_active && ['expiring', 'expired'].includes(getContractStatus(p.contract_end_date))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Furnizori servicii externe</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestionează furnizorii de servicii SSM, PSI, ISCIR și verificări
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProvider(null)
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Adaugă furnizor
        </button>
      </div>

      {/* Alertă contracte expirând */}
      {expiringProviders.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">Atenție! Contracte expirând</h3>
              <p className="text-sm text-orange-700 mt-1">
                {expiringProviders.length} {expiringProviders.length === 1 ? 'contract expiră' : 'contracte expiră'} în
                următoarele 30 de zile sau au expirat deja.
              </p>
              <ul className="mt-2 space-y-1">
                {expiringProviders.slice(0, 3).map((p) => {
                  const days = getDaysUntilExpiry(p.contract_end_date)
                  return (
                    <li key={p.id} className="text-sm text-orange-800">
                      <strong>{p.name}</strong> ({PROVIDER_TYPES[p.provider_type]}) —{' '}
                      {days !== null && days < 0
                        ? `expirat cu ${Math.abs(days)} zile`
                        : days !== null
                        ? `expiră în ${days} zile`
                        : 'fără dată'}
                    </li>
                  )
                })}
              </ul>
              {expiringProviders.length > 3 && (
                <p className="text-sm text-orange-700 mt-1">și încă {expiringProviders.length - 3} contracte...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista furnizori */}
      {providers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <EmptyState
            icon={Building2}
            title="Niciun furnizor"
            description="Adaugă furnizori de servicii externe pentru a gestiona contractele și contactele"
            actionLabel="Adaugă primul furnizor"
            onAction={() => setIsModalOpen(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {providers.map((provider) => {
            const status = getContractStatus(provider.contract_end_date)
            const daysUntil = getDaysUntilExpiry(provider.contract_end_date)

            return (
              <div
                key={provider.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                      {!provider.is_active && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Inactiv</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{PROVIDER_TYPES[provider.provider_type]}</p>
                    {provider.cui && <p className="text-xs text-gray-400 mt-1">CUI: {provider.cui}</p>}
                  </div>
                  <StatusBadge status={status} />
                </div>

                {/* Contract info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  {provider.contract_number && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">Contract nr.</p>
                        <p className="text-gray-900 font-medium">{provider.contract_number}</p>
                      </div>
                    </div>
                  )}
                  {provider.contract_end_date && (
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">Valabil până la</p>
                        <p className="text-gray-900 font-medium">{formatDate(provider.contract_end_date)}</p>
                        {daysUntil !== null && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {daysUntil < 0
                              ? `Expirat cu ${Math.abs(daysUntil)} zile`
                              : `Expiră în ${daysUntil} zile`}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {provider.contract_start_date && (
                    <div className="text-xs text-gray-500 ml-6">
                      Început: {formatDate(provider.contract_start_date)}
                    </div>
                  )}
                </div>

                {/* Contact info */}
                <div className="space-y-2 mb-4">
                  {provider.contact_person && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Contact:</span> {provider.contact_person}
                    </p>
                  )}
                  {provider.contact_email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${provider.contact_email}`} className="text-blue-600 hover:underline">
                        {provider.contact_email}
                      </a>
                    </div>
                  )}
                  {provider.contact_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${provider.contact_phone}`} className="text-blue-600 hover:underline">
                        {provider.contact_phone}
                      </a>
                    </div>
                  )}
                  {provider.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">{provider.address}</p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {provider.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{provider.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(provider)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Modifică
                  </button>
                  <button
                    onClick={() => handleDelete(provider.id)}
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProvider(null)
        }}
        onSave={handleSave}
        title={editingProvider ? 'Modifică furnizor' : 'Adaugă furnizor'}
        fields={fields}
        initialData={editingProvider || undefined}
        loading={loading}
      />
    </div>
  )
}
