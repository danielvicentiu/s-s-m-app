'use client'

import { useState } from 'react'
import { Plus, AlertTriangle, Building2, Filter, Calendar, User, CheckCircle2, Clock } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  RiskAssessment,
  RiskProbability,
  RiskSeverity,
  RiskLevel,
  RiskStatus,
  calculateRiskLevel,
  RISK_LEVEL_COLORS,
  RISK_STATUS_LABELS,
} from '@/lib/types'

interface RiskAssessmentClientProps {
  user: { id: string; email: string }
  risks: RiskAssessment[]
  organizations: Array<{ id: string; name: string; cui: string | null }>
}

export default function RiskAssessmentClient({
  user,
  risks: initialRisks,
  organizations,
}: RiskAssessmentClientProps) {
  const [risks, setRisks] = useState<RiskAssessment[]>(initialRisks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<string>('all')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Filtrare riscuri
  const filteredRisks = risks.filter((risk) => {
    if (selectedOrg !== 'all' && risk.organization_id !== selectedOrg) return false
    if (selectedRiskLevel !== 'all' && risk.risk_level !== selectedRiskLevel) return false
    if (selectedStatus !== 'all' && risk.status !== selectedStatus) return false
    return true
  })

  // Statistici pentru matrice
  const riskStats = {
    total: filteredRisks.length,
    scazut: filteredRisks.filter((r) => r.risk_level === 'scazut').length,
    mediu: filteredRisks.filter((r) => r.risk_level === 'mediu').length,
    ridicat: filteredRisks.filter((r) => r.risk_level === 'ridicat').length,
    critic: filteredRisks.filter((r) => r.risk_level === 'critic').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evaluare Riscuri</h1>
            <p className="text-sm text-gray-500 mt-1">
              Matrice de risc și măsuri de prevenție SSM
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Adaugă Risc
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Matrice de Risc */}
        <RiskMatrix risks={filteredRisks} stats={riskStats} />

        {/* Filtre */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtrează:</span>
            </div>

            {/* Filtru Organizație */}
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toate organizațiile</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>

            {/* Filtru Nivel Risc */}
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toate nivelurile</option>
              <option value="scazut">Risc scăzut</option>
              <option value="mediu">Risc mediu</option>
              <option value="ridicat">Risc ridicat</option>
              <option value="critic">Risc critic</option>
            </select>

            {/* Filtru Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toate statusurile</option>
              <option value="identificat">Identificat</option>
              <option value="in_analiza">În analiză</option>
              <option value="masuri_planificate">Măsuri planificate</option>
              <option value="masuri_implementate">Măsuri implementate</option>
              <option value="rezolvat">Rezolvat</option>
            </select>
          </div>
        </div>

        {/* Lista Riscuri */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Riscuri Identificate ({filteredRisks.length})
            </h2>
          </div>

          {filteredRisks.length === 0 ? (
            <EmptyState
              icon={AlertTriangle}
              title="Nu există riscuri identificate"
              description="Adăugați primul risc pentru a începe evaluarea"
              actionLabel="Adaugă Risc"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRisks.map((risk) => (
                <RiskCard key={risk.id} risk={risk} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Adaugă Risc */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adaugă Risc Nou" size="xl">
        <AddRiskForm
          organizations={organizations}
          onSubmit={(newRisk) => {
            setRisks([...risks, newRisk])
            setIsModalOpen(false)
          }}
          onCancel={() => setIsModalOpen(false)}
          userId={user.id}
        />
      </Modal>
    </div>
  )
}

// Componenta Matrice de Risc
function RiskMatrix({ risks, stats }: { risks: RiskAssessment[]; stats: any }) {
  // Construim matricea 5x5
  const matrix: number[][] = Array(5)
    .fill(0)
    .map(() => Array(5).fill(0))

  risks.forEach((risk) => {
    const row = 5 - risk.severity // Inversăm pentru ca 5 să fie sus
    const col = risk.probability - 1
    matrix[row][col]++
  })

  const getCellColor = (severity: number, probability: number): string => {
    const level = calculateRiskLevel(probability as RiskProbability, severity as RiskSeverity)
    const colors = RISK_LEVEL_COLORS[level]
    return colors.bg.replace('bg-', '')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Matrice de Risc</h2>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Scăzut: {stats.scazut}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Mediu: {stats.mediu}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Ridicat: {stats.ridicat}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Critic: {stats.critic}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Axa Y - Gravitate */}
        <div className="flex flex-col justify-between text-sm font-medium text-gray-700 py-2">
          <div>5 - Catastrofală</div>
          <div>4 - Majoră</div>
          <div>3 - Moderată</div>
          <div>2 - Minorină</div>
          <div>1 - Neglijabilă</div>
        </div>

        {/* Matricea */}
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-2 mb-2">
            {matrix.map((row, rowIdx) =>
              row.map((count, colIdx) => {
                const severity = 5 - rowIdx
                const probability = colIdx + 1
                const bgColor = getCellColor(severity, probability)
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`h-16 rounded-lg border-2 border-gray-200 flex items-center justify-center text-lg font-bold ${bgColor} transition-all hover:scale-105 cursor-pointer`}
                  >
                    {count > 0 ? count : ''}
                  </div>
                )
              })
            )}
          </div>

          {/* Axa X - Probabilitate */}
          <div className="grid grid-cols-5 gap-2 text-center text-sm font-medium text-gray-700 mt-2">
            <div>1<br />Rară</div>
            <div>2<br />Puțin probabilă</div>
            <div>3<br />Posibilă</div>
            <div>4<br />Probabilă</div>
            <div>5<br />Foarte probabilă</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componenta Card Risc
function RiskCard({ risk }: { risk: RiskAssessment }) {
  const colors = RISK_LEVEL_COLORS[risk.risk_level]
  const statusLabel = RISK_STATUS_LABELS[risk.status]

  const getStatusIcon = (status: RiskStatus) => {
    if (status === 'rezolvat') return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (status === 'masuri_implementate') return <CheckCircle2 className="h-4 w-4 text-blue-600" />
    return <Clock className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-semibold text-gray-900">{risk.workplace}</h3>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
              Risc {risk.risk_level}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{risk.activity_description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertTriangle className="h-4 w-4" />
            <span>{risk.risk_description}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getStatusIcon(risk.status)}
          <span>{statusLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Măsuri Curente</p>
          <p className="text-sm text-gray-700">{risk.current_measures || 'Niciuna'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Măsuri Propuse</p>
          <p className="text-sm text-gray-700">{risk.proposed_measures || 'În evaluare'}</p>
        </div>
      </div>

      {risk.responsible_person && (
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{risk.responsible_person}</span>
          </div>
          {risk.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Termen: {new Date(risk.deadline).toLocaleDateString('ro-RO')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Formular Adaugă Risc
function AddRiskForm({
  organizations,
  onSubmit,
  onCancel,
  userId,
}: {
  organizations: Array<{ id: string; name: string; cui: string | null }>
  onSubmit: (risk: RiskAssessment) => void
  onCancel: () => void
  userId: string
}) {
  const [formData, setFormData] = useState({
    organization_id: organizations[0]?.id || '',
    workplace: '',
    activity_description: '',
    risk_description: '',
    probability: 3 as RiskProbability,
    severity: 3 as RiskSeverity,
    current_measures: '',
    proposed_measures: '',
    responsible_person: '',
    deadline: '',
    status: 'identificat' as RiskStatus,
  })

  const riskLevel = calculateRiskLevel(formData.probability, formData.severity)
  const colors = RISK_LEVEL_COLORS[riskLevel]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRisk: RiskAssessment = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      risk_level: riskLevel,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onSubmit(newRisk)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Organizație */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Organizație <span className="text-red-500">*</span>
        </label>
        <select
          required
          value={formData.organization_id}
          onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loc de muncă */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Loc de muncă <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.workplace}
          onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
          placeholder="ex. Atelier producție, Depozit, Birouri"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Activitate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descriere activitate <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.activity_description}
          onChange={(e) => setFormData({ ...formData, activity_description: e.target.value })}
          placeholder="ex. Operare mașini, Manipulare chimicale"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Risc */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descriere risc <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          value={formData.risk_description}
          onChange={(e) => setFormData({ ...formData, risk_description: e.target.value })}
          placeholder="Descrieți riscul identificat..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Probabilitate și Gravitate */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Probabilitate (1-5) <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.probability}
            onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) as RiskProbability })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>1 - Rară</option>
            <option value={2}>2 - Puțin probabilă</option>
            <option value={3}>3 - Posibilă</option>
            <option value={4}>4 - Probabilă</option>
            <option value={5}>5 - Foarte probabilă</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gravitate (1-5) <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: Number(e.target.value) as RiskSeverity })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>1 - Neglijabilă</option>
            <option value={2}>2 - Minorină</option>
            <option value={3}>3 - Moderată</option>
            <option value={4}>4 - Majoră</option>
            <option value={5}>5 - Catastrofală</option>
          </select>
        </div>
      </div>

      {/* Nivel Risc Calculat */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Nivel risc calculat:</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
            Risc {riskLevel}
          </span>
        </div>
      </div>

      {/* Măsuri curente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Măsuri de control curente</label>
        <textarea
          value={formData.current_measures}
          onChange={(e) => setFormData({ ...formData, current_measures: e.target.value })}
          placeholder="Măsurile de protecție deja implementate..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Măsuri propuse */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Măsuri propuse</label>
        <textarea
          value={formData.proposed_measures}
          onChange={(e) => setFormData({ ...formData, proposed_measures: e.target.value })}
          placeholder="Măsurile suplimentare recomandate..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Responsabil și Termen */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Persoană responsabilă</label>
          <input
            type="text"
            value={formData.responsible_person}
            onChange={(e) => setFormData({ ...formData, responsible_person: e.target.value })}
            placeholder="ex. Ion Popescu - Șef producție"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Termen limită</label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as RiskStatus })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="identificat">Identificat</option>
          <option value="in_analiza">În analiză</option>
          <option value="masuri_planificate">Măsuri planificate</option>
          <option value="masuri_implementate">Măsuri implementate</option>
          <option value="rezolvat">Rezolvat</option>
        </select>
      </div>

      {/* Butoane */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Anulează
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Salvează Risc
        </button>
      </div>
    </form>
  )
}
