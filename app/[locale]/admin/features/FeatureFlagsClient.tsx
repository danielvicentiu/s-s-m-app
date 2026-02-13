'use client'

import { useState } from 'react'
import { Flag, Save, AlertCircle, CheckCircle, Target, Percent, Users, Settings } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { createSupabaseBrowser } from '@/lib/supabase/client'

interface FeatureFlag {
  id: string
  feature_key: string
  feature_name: string
  description: string | null
  is_enabled: boolean
  rollout_percentage: number
  target_organizations: string[] | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

interface Organization {
  id: string
  name: string
  cui: string | null
}

interface Props {
  initialFeatures: FeatureFlag[]
  organizations: Organization[]
}

export default function FeatureFlagsClient({ initialFeatures, organizations }: Props) {
  const [features, setFeatures] = useState<FeatureFlag[]>(initialFeatures)
  const [editingFeature, setEditingFeature] = useState<FeatureFlag | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // State pentru feature în edit
  const [formData, setFormData] = useState<{
    is_enabled: boolean
    rollout_percentage: number
    target_organizations: string[]
  }>({
    is_enabled: false,
    rollout_percentage: 0,
    target_organizations: [],
  })

  const handleEdit = (feature: FeatureFlag) => {
    setEditingFeature(feature)
    setFormData({
      is_enabled: feature.is_enabled,
      rollout_percentage: feature.rollout_percentage,
      target_organizations: feature.target_organizations || [],
    })
    setIsModalOpen(true)
    setSaveStatus(null)
  }

  const handleToggle = async (feature: FeatureFlag) => {
    const supabase = createSupabaseBrowser()
    const newValue = !feature.is_enabled

    const { error } = await supabase
      .from('feature_flags')
      .update({ is_enabled: newValue })
      .eq('id', feature.id)

    if (error) {
      console.error('Error toggling feature:', error)
      setSaveStatus({ type: 'error', message: 'Eroare la salvare' })
      return
    }

    // Update local state
    setFeatures(features.map(f =>
      f.id === feature.id ? { ...f, is_enabled: newValue } : f
    ))

    setSaveStatus({ type: 'success', message: `${feature.feature_name} ${newValue ? 'activat' : 'dezactivat'}` })
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleSave = async () => {
    if (!editingFeature) return

    setIsSaving(true)
    setSaveStatus(null)

    const supabase = createSupabaseBrowser()

    const { error } = await supabase
      .from('feature_flags')
      .update({
        is_enabled: formData.is_enabled,
        rollout_percentage: formData.rollout_percentage,
        target_organizations: formData.target_organizations,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingFeature.id)

    setIsSaving(false)

    if (error) {
      console.error('Error saving feature:', error)
      setSaveStatus({ type: 'error', message: 'Eroare la salvare. Încearcă din nou.' })
      return
    }

    // Update local state
    setFeatures(features.map(f =>
      f.id === editingFeature.id
        ? { ...f, ...formData, updated_at: new Date().toISOString() }
        : f
    ))

    setSaveStatus({ type: 'success', message: 'Salvat cu succes!' })
    setTimeout(() => {
      setIsModalOpen(false)
      setSaveStatus(null)
    }, 1500)
  }

  const handleOrgToggle = (orgId: string) => {
    setFormData(prev => ({
      ...prev,
      target_organizations: prev.target_organizations.includes(orgId)
        ? prev.target_organizations.filter(id => id !== orgId)
        : [...prev.target_organizations, orgId]
    }))
  }

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      target_organizations: prev.target_organizations.length === organizations.length
        ? []
        : organizations.map(org => org.id)
    }))
  }

  return (
    <>
      {/* STATUS MESSAGE */}
      {saveStatus && (
        <div className={`mb-6 rounded-xl border p-4 flex items-center gap-3 ${
          saveStatus.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {saveStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span className="font-medium">{saveStatus.message}</span>
        </div>
      )}

      {/* FEATURES LIST */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rollout %
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Target Orgs
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {features.map((feature) => (
                <tr key={feature.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Flag className={`h-5 w-5 ${feature.is_enabled ? 'text-green-500' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-semibold text-gray-900">{feature.feature_name}</div>
                        <div className="text-sm text-gray-500 font-mono text-xs">{feature.feature_key}</div>
                        {feature.description && (
                          <div className="text-xs text-gray-400 mt-1 max-w-md">
                            {feature.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(feature)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        feature.is_enabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          feature.is_enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`ml-3 text-sm font-medium ${
                      feature.is_enabled ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {feature.is_enabled ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-gray-400" />
                      <div className="flex-1 max-w-[120px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-700">
                            {feature.rollout_percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${feature.rollout_percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {feature.target_organizations && feature.target_organizations.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium">
                        <Target className="h-3.5 w-3.5" />
                        {feature.target_organizations.length} org
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Toate</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(feature)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 ml-auto"
                    >
                      <Settings className="h-4 w-4" />
                      Configurare
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {features.length === 0 && (
          <div className="text-center py-12">
            <Flag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Niciun feature flag găsit</p>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFeature ? `Configurare: ${editingFeature.feature_name}` : 'Configurare Feature'}
        size="lg"
      >
        {editingFeature && (
          <div className="space-y-6">
            {/* Description */}
            {editingFeature.description && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800">{editingFeature.description}</p>
              </div>
            )}

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-semibold text-gray-900">Status Feature</label>
                <p className="text-xs text-gray-500 mt-1">Activează sau dezactivează această funcționalitate</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, is_enabled: !formData.is_enabled })}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  formData.is_enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    formData.is_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Rollout Percentage Slider */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Percent className="h-4 w-4 text-gray-500" />
                Rollout Percentage
              </label>
              <p className="text-xs text-gray-500">
                Controlează rollout-ul gradual. 0% = nimeni, 100% = toți utilizatorii eligibili
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.rollout_percentage}
                  onChange={(e) => setFormData({ ...formData, rollout_percentage: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="min-w-[60px] text-right">
                  <span className="text-2xl font-black text-blue-600">{formData.rollout_percentage}</span>
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${formData.rollout_percentage}%` }}
                />
              </div>
            </div>

            {/* Target Organizations Multi-Select */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  Target Organizații
                </label>
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  {formData.target_organizations.length === organizations.length ? 'Deselectează tot' : 'Selectează tot'}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Lasă necompletat pentru a include toate organizațiile. Selectează specific pentru targeting.
              </p>

              <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                {organizations.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Nicio organizație găsită
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {organizations.map((org) => (
                      <label
                        key={org.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.target_organizations.includes(org.id)}
                          onChange={() => handleOrgToggle(org.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{org.name}</div>
                          {org.cui && (
                            <div className="text-xs text-gray-500">CUI: {org.cui}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {formData.target_organizations.length > 0 && (
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    <strong>{formData.target_organizations.length}</strong> {formData.target_organizations.length === 1 ? 'organizație selectată' : 'organizații selectate'}
                  </p>
                </div>
              )}
            </div>

            {/* Save Status in Modal */}
            {saveStatus && (
              <div className={`rounded-lg border p-3 flex items-center gap-2 ${
                saveStatus.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {saveStatus.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{saveStatus.message}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
                disabled={isSaving}
              >
                Anulează
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Se salvează...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvează
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
