'use client'

import { useState, useEffect } from 'react'
import { FileText, Building2, Calendar, Users, AlertCircle, FileDown, Eye } from 'lucide-react'

interface Organization {
  id: string
  name: string
  cui: string | null
}

interface DocumentType {
  value: string
  label: string
  description: string
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    value: 'evaluare_risc',
    label: 'Evaluare de risc',
    description: 'Document evaluare riscuri profesionale conform legislației SSM'
  },
  {
    value: 'plan_prevenire',
    label: 'Plan de prevenire și protecție',
    description: 'Plan anual de prevenire și protecție a lucrătorilor'
  },
  {
    value: 'fisa_instruire',
    label: 'Fișă instruire SSM',
    description: 'Fișă individuală de instruire în domeniul securității și sănătății în muncă'
  },
  {
    value: 'decizie',
    label: 'Decizie numire responsabil SSM',
    description: 'Decizie de numire a responsabilului cu protecția muncii'
  },
  {
    value: 'proces_verbal',
    label: 'Proces-verbal',
    description: 'Proces-verbal constatare nereguli sau verificare conformitate'
  }
]

interface FormData {
  documentType: string
  organizationId: string
  // Parametri comuni
  documentDate: string
  validUntil: string
  generatedBy: string
  // Parametri specifici evaluare risc
  evaluationPeriod?: string
  evaluatedBy?: string
  riskLevel?: 'scazut' | 'mediu' | 'ridicat'
  // Parametri specifici plan prevenire
  planYear?: string
  responsiblePerson?: string
  budget?: string
  // Parametri specifici fișă instruire
  employeeName?: string
  instructionDate?: string
  instructorName?: string
  instructionType?: 'initiere' | 'periodic' | 'la_loc' | 'extraordinar'
  // Parametri specifici decizie
  decisionNumber?: string
  appointedPerson?: string
  appointmentDate?: string
  // Parametri specifici PV
  pvNumber?: string
  inspectionDate?: string
  inspectorName?: string
  findings?: string
}

export default function DocumentGeneratorForm() {
  const [formData, setFormData] = useState<FormData>({
    documentType: '',
    organizationId: '',
    documentDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    generatedBy: ''
  })
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations')
      if (res.ok) {
        const data = await res.json()
        setOrganizations(data)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePreview = () => {
    const selectedOrg = organizations.find(org => org.id === formData.organizationId)
    const selectedDocType = DOCUMENT_TYPES.find(dt => dt.value === formData.documentType)

    setPreviewData({
      organization: selectedOrg,
      documentType: selectedDocType,
      formData
    })
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formData.documentType}_${formData.organizationId}_${formData.documentDate}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Eroare la generarea documentului')
      }
    } catch (error) {
      console.error('Error generating document:', error)
      alert('Eroare la generarea documentului')
    } finally {
      setGenerating(false)
    }
  }

  const renderDynamicFields = () => {
    switch (formData.documentType) {
      case 'evaluare_risc':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perioadă evaluare
              </label>
              <input
                type="text"
                value={formData.evaluationPeriod || ''}
                onChange={(e) => handleInputChange('evaluationPeriod', e.target.value)}
                placeholder="ex: Ianuarie - Decembrie 2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Evaluat de
              </label>
              <input
                type="text"
                value={formData.evaluatedBy || ''}
                onChange={(e) => handleInputChange('evaluatedBy', e.target.value)}
                placeholder="Nume consultant/evaluator"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel risc identificat
              </label>
              <select
                value={formData.riskLevel || ''}
                onChange={(e) => handleInputChange('riskLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selectează nivel risc</option>
                <option value="scazut">Scăzut</option>
                <option value="mediu">Mediu</option>
                <option value="ridicat">Ridicat</option>
              </select>
            </div>
          </>
        )

      case 'plan_prevenire':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                An plan
              </label>
              <input
                type="text"
                value={formData.planYear || ''}
                onChange={(e) => handleInputChange('planYear', e.target.value)}
                placeholder="2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsabil execuție
              </label>
              <input
                type="text"
                value={formData.responsiblePerson || ''}
                onChange={(e) => handleInputChange('responsiblePerson', e.target.value)}
                placeholder="Nume responsabil SSM"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buget estimat (RON)
              </label>
              <input
                type="text"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="ex: 15000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )

      case 'fisa_instruire':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nume angajat
              </label>
              <input
                type="text"
                value={formData.employeeName || ''}
                onChange={(e) => handleInputChange('employeeName', e.target.value)}
                placeholder="Nume complet angajat"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data instruirii
              </label>
              <input
                type="date"
                value={formData.instructionDate || ''}
                onChange={(e) => handleInputChange('instructionDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nume instructor
              </label>
              <input
                type="text"
                value={formData.instructorName || ''}
                onChange={(e) => handleInputChange('instructorName', e.target.value)}
                placeholder="Nume instructor autorizat"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tip instruire
              </label>
              <select
                value={formData.instructionType || ''}
                onChange={(e) => handleInputChange('instructionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selectează tip instruire</option>
                <option value="initiere">Instruire la angajare (inițiere)</option>
                <option value="periodic">Instruire periodică</option>
                <option value="la_loc">Instruire la locul de muncă</option>
                <option value="extraordinar">Instruire extraordinară</option>
              </select>
            </div>
          </>
        )

      case 'decizie':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Număr decizie
              </label>
              <input
                type="text"
                value={formData.decisionNumber || ''}
                onChange={(e) => handleInputChange('decisionNumber', e.target.value)}
                placeholder="ex: 123/2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Persoană numită
              </label>
              <input
                type="text"
                value={formData.appointedPerson || ''}
                onChange={(e) => handleInputChange('appointedPerson', e.target.value)}
                placeholder="Nume responsabil SSM numit"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data numirii
              </label>
              <input
                type="date"
                value={formData.appointmentDate || ''}
                onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )

      case 'proces_verbal':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Număr PV
              </label>
              <input
                type="text"
                value={formData.pvNumber || ''}
                onChange={(e) => handleInputChange('pvNumber', e.target.value)}
                placeholder="ex: PV-001/2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data inspecției
              </label>
              <input
                type="date"
                value={formData.inspectionDate || ''}
                onChange={(e) => handleInputChange('inspectionDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspector
              </label>
              <input
                type="text"
                value={formData.inspectorName || ''}
                onChange={(e) => handleInputChange('inspectorName', e.target.value)}
                placeholder="Nume inspector"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Constatări
              </label>
              <textarea
                value={formData.findings || ''}
                onChange={(e) => handleInputChange('findings', e.target.value)}
                placeholder="Descriere constatări sau nereguli identificate..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </>
        )

      default:
        return null
    }
  }

  const isFormValid = formData.documentType && formData.organizationId && formData.documentDate

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Generator documente SSM</h2>
            <p className="text-sm text-gray-500">Generează documente conform legislației SSM/PSI</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form className="space-y-6">
          {/* Tip document */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Tip document *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {DOCUMENT_TYPES.map((docType) => (
                <label
                  key={docType.value}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.documentType === docType.value
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="documentType"
                    value={docType.value}
                    checked={formData.documentType === docType.value}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{docType.label}</div>
                    <div className="text-sm text-gray-500">{docType.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Firmă */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Building2 className="w-4 h-4 inline mr-1" />
              Firmă *
            </label>
            {loading ? (
              <div className="text-sm text-gray-500">Se încarcă firmele...</div>
            ) : (
              <select
                value={formData.organizationId}
                onChange={(e) => handleInputChange('organizationId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selectează firma</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.cui ? `(CUI: ${org.cui})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Parametri comuni */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Data document *
              </label>
              <input
                type="date"
                value={formData.documentDate}
                onChange={(e) => handleInputChange('documentDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Valabil până la
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="w-4 h-4 inline mr-1" />
              Generat de
            </label>
            <input
              type="text"
              value={formData.generatedBy}
              onChange={(e) => handleInputChange('generatedBy', e.target.value)}
              placeholder="Nume consultant"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Parametri dinamici per tip document */}
          {formData.documentType && (
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Parametri specifici document
              </h3>
              {renderDynamicFields()}
            </div>
          )}

          {/* Preview section */}
          {previewData && (
            <div className="border border-blue-200 rounded-lg bg-blue-50 p-4">
              <div className="flex items-start gap-2 mb-3">
                <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Preview generare</h4>
                  <p className="text-sm text-gray-600">
                    {previewData.documentType?.label} pentru {previewData.organization?.name}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Data: {previewData.formData.documentDate}</div>
                {previewData.formData.validUntil && (
                  <div>Valabil până: {previewData.formData.validUntil}</div>
                )}
                {previewData.formData.generatedBy && (
                  <div>Generat de: {previewData.formData.generatedBy}</div>
                )}
              </div>
            </div>
          )}

          {/* Alert info */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Documentele generate sunt conforme cu legislația SSM/PSI în vigoare.
              Verificați corectitudinea datelor înainte de generare.
            </p>
          </div>

          {/* Acțiuni */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handlePreview}
              disabled={!isFormValid}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!isFormValid || generating}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              {generating ? 'Se generează...' : 'Generează PDF'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
