// app/[locale]/dashboard/medical/MedicalClient.tsx
// M3 Medicina Muncii — CRUD complet + Programări + Alerte
// EXTENDED: API routes, tabs (records/appointments/alerts), new tracking fields
// Folosește Component Kit: DataTable, FormModal, StatusBadge, EmptyState, ConfirmDialog
// RBAC: Verificare permisiuni pentru butoane CRUD

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { FormModal } from '@/components/ui/FormModal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  ArrowLeft,
  Stethoscope,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
} from 'lucide-react'
import { useHasPermission } from '@/hooks/usePermission'
import type { MedicalExamination, MedicalAppointment } from '@/lib/types'

// ========== TYPES ==========

interface Employee {
  id: string
  full_name: string
  job_title: string | null
  organization_id: string
}

interface Organization {
  id: string
  name: string
  cui: string
}

interface AlertRecord {
  id: string
  employee_name: string
  full_name: string | null
  job_title: string | null
  examination_type: string
  expiry_date: string
  days_until_expiry: number | null
  alert_level: 'urgent' | 'expirat' | 'atentie' | 'ok' | 'nedefinit'
  organization_id: string
}

interface Props {
  user: { id: string; email: string }
  medicalExams: MedicalExamination[]
  employees: Employee[]
  organizations: Organization[]
  selectedOrgId?: string
}

type TabType = 'records' | 'appointments' | 'alerts'

// ========== CONSTANTS ==========

const emptyRecordForm = {
  organization_id: '',
  employee_id: '',
  employee_name: '',
  job_title: '',
  examination_type: 'periodic',
  examination_date: '',
  expiry_date: '',
  result: 'apt',
  restrictions: '',
  doctor_name: '',
  clinic_name: '',
  notes: '',
  risk_factors: '',
  document_number: '',
  validity_months: 12,
}

const emptyAppointmentForm = {
  organization_id: '',
  employee_id: '',
  appointment_date: '',
  appointment_time: '',
  clinic_name: '',
  clinic_address: '',
  examination_type: 'periodic',
  status: 'programat',
  notes: '',
}

// ========== COMPONENT ==========
// Note: examTypes, resultTypes, appointmentStatuses moved inside component (use t())

export default function MedicalClient({
  user,
  medicalExams,
  employees,
  organizations,
  selectedOrgId,
}: Props) {
  const router = useRouter()
  const t = useTranslations('medical')

  const examTypes: Record<string, string> = {
    periodic: t('examType.periodic'),
    angajare: t('examType.angajare'),
    reluare: t('examType.reluare'),
    la_cerere: t('examType.laCerere'),
    control_periodic: t('examType.controlPeriodic'),
    control_angajare: t('examType.controlAngajare'),
    fisa_aptitudine: t('examType.fisaAptitudine'),
    fisa_psihologica: t('examType.fisaPsihologica'),
  }

  const resultTypes: Record<string, string> = {
    apt: t('result.apt'),
    apt_conditionat: t('result.aptConditionat'),
    inapt_temporar: t('result.inaptTemporar'),
    inapt: t('result.inapt'),
    in_asteptare: t('result.inAsteptare'),
  }

  const appointmentStatuses: Record<string, string> = {
    programat: t('appointmentStatus.programat'),
    confirmat: t('appointmentStatus.confirmat'),
    efectuat: t('appointmentStatus.efectuat'),
    anulat: t('appointmentStatus.anulat'),
    reprogramat: t('appointmentStatus.reprogramat'),
  }

  // RBAC permissions
  const canCreate = useHasPermission('medical', 'create')
  const canUpdate = useHasPermission('medical', 'update')
  const canDelete = useHasPermission('medical', 'delete')

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('records')

  // Records state
  const [filterOrg, setFilterOrg] = useState<string>(selectedOrgId || 'all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [recordFormLoading, setRecordFormLoading] = useState(false)
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
  const [recordForm, setRecordForm] = useState(emptyRecordForm)
  const [deleteRecordTarget, setDeleteRecordTarget] = useState<MedicalExamination | null>(null)
  const [deleteRecordLoading, setDeleteRecordLoading] = useState(false)

  // Appointments state
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [appointmentFormLoading, setAppointmentFormLoading] = useState(false)
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null)
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointmentForm)
  const [deleteAppointmentTarget, setDeleteAppointmentTarget] = useState<MedicalAppointment | null>(null)
  const [deleteAppointmentLoading, setDeleteAppointmentLoading] = useState(false)

  // Alerts state
  const [alerts, setAlerts] = useState<AlertRecord[]>([])
  const [alertsLoading, setAlertsLoading] = useState(false)

  // ========== HELPERS ==========

  const now = new Date()

  function getStatus(expiryDate: string): 'valid' | 'expiring' | 'expired' {
    const expiry = new Date(expiryDate)
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return 'expired'
    if (diffDays <= 30) return 'expiring'
    return 'valid'
  }

  function getDaysText(expiryDate: string): string {
    const expiry = new Date(expiryDate)
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return t('daysText.expired', { days: Math.abs(diffDays) })
    if (diffDays <= 30) return t('daysText.expiring', { days: diffDays })
    return t('daysText.valid', { days: diffDays })
  }

  function fmtDate(d: string | null | undefined): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  function fmtTime(t: string | null | undefined): string {
    if (!t) return '—'
    return t.slice(0, 5) // HH:MM
  }

  // ========== FETCH APPOINTMENTS ==========

  async function fetchAppointments() {
    if (activeTab !== 'appointments') return
    try {
      setAppointmentsLoading(true)
      const params = new URLSearchParams()
      if (filterOrg !== 'all') params.append('organization_id', filterOrg)

      const res = await fetch(`/api/medical/appointments?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch appointments')

      const data = await res.json()
      setAppointments(data.appointments || [])
    } catch (err) {
      console.error('[MEDICAL] Fetch appointments error:', err)
    } finally {
      setAppointmentsLoading(false)
    }
  }

  // ========== FETCH ALERTS ==========

  async function fetchAlerts() {
    if (activeTab !== 'alerts') return
    try {
      setAlertsLoading(true)
      // Use v_medical_expiring view via a simple endpoint or direct query
      // For now, calculate alerts client-side from medicalExams
      const alertRecords: AlertRecord[] = medicalExams
        .filter((exam) => {
          if (filterOrg !== 'all' && exam.organization_id !== filterOrg) return false
          if (!exam.expiry_date) return false
          const days = Math.ceil(
            (new Date(exam.expiry_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )
          return days <= 60 // Show records expiring in 60 days or already expired
        })
        .map((exam) => {
          const daysUntilExpiry = Math.ceil(
            (new Date(exam.expiry_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )
          let alertLevel: 'urgent' | 'expirat' | 'atentie' | 'ok' | 'nedefinit'

          if (!exam.expiry_date) {
            alertLevel = 'nedefinit'
          } else if (daysUntilExpiry < 0) {
            alertLevel = 'expirat'
          } else if (daysUntilExpiry <= 30) {
            alertLevel = 'urgent'
          } else {
            alertLevel = 'atentie'
          }

          return {
            id: exam.id,
            employee_name: exam.employee_name,
            full_name: exam.employees?.full_name || exam.employee_name,
            job_title: exam.job_title,
            examination_type: exam.examination_type,
            expiry_date: exam.expiry_date,
            days_until_expiry: daysUntilExpiry,
            alert_level: alertLevel,
            organization_id: exam.organization_id,
          }
        })
        .sort((a, b) => {
          // Sort by urgency: expired first, then by days ascending
          if (a.alert_level === 'expirat' && b.alert_level !== 'expirat') return -1
          if (a.alert_level !== 'expirat' && b.alert_level === 'expirat') return 1
          return (a.days_until_expiry || 0) - (b.days_until_expiry || 0)
        })

      setAlerts(alertRecords)
    } catch (err) {
      console.error('[MEDICAL] Fetch alerts error:', err)
    } finally {
      setAlertsLoading(false)
    }
  }

  // ========== EFFECTS ==========

  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments()
    } else if (activeTab === 'alerts') {
      fetchAlerts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filterOrg])

  // ========== RECORDS FILTERING ==========

  const filteredRecords = medicalExams.filter((m) => {
    if (filterOrg !== 'all' && m.organization_id !== filterOrg) return false
    if (filterStatus !== 'all' && getStatus(m.expiry_date) !== filterStatus) return false
    return true
  })

  // ========== RECORDS STATS ==========

  const recordsStats = {
    total: medicalExams.length,
    expired: medicalExams.filter((m) => getStatus(m.expiry_date) === 'expired').length,
    expiring: medicalExams.filter((m) => getStatus(m.expiry_date) === 'expiring').length,
    valid: medicalExams.filter((m) => getStatus(m.expiry_date) === 'valid').length,
  }

  const appointmentsStats = {
    total: appointments.length,
    programat: appointments.filter((a) => a.status === 'programat').length,
    confirmat: appointments.filter((a) => a.status === 'confirmat').length,
    efectuat: appointments.filter((a) => a.status === 'efectuat').length,
  }

  // ========== RECORDS FORM HANDLERS ==========

  function openAddRecord() {
    setEditingRecordId(null)
    setRecordForm(emptyRecordForm)
    setShowRecordForm(true)
  }

  function openEditRecord(exam: MedicalExamination) {
    setEditingRecordId(exam.id)
    setRecordForm({
      organization_id: exam.organization_id,
      employee_id: exam.employee_id || '',
      employee_name: exam.employee_name || '',
      job_title: exam.job_title || '',
      examination_type: exam.examination_type,
      examination_date: exam.examination_date || '',
      expiry_date: exam.expiry_date || '',
      result: exam.result || 'apt',
      restrictions: exam.restrictions || '',
      doctor_name: exam.doctor_name || '',
      clinic_name: exam.clinic_name || '',
      notes: exam.notes || '',
      risk_factors: exam.risk_factors?.join(', ') || '',
      document_number: exam.document_number || '',
      validity_months: exam.validity_months || 12,
    })
    setShowRecordForm(true)
  }

  function handleEmployeeSelect(employeeId: string) {
    const emp = employees.find((e) => e.id === employeeId)
    if (emp) {
      setRecordForm((f) => ({
        ...f,
        employee_id: employeeId,
        employee_name: emp.full_name,
        job_title: emp.job_title || f.job_title,
        organization_id: emp.organization_id || f.organization_id,
      }))
    } else {
      setRecordForm((f) => ({ ...f, employee_id: employeeId }))
    }
  }

  async function handleRecordSubmit() {
    try {
      setRecordFormLoading(true)

      const payload = {
        organization_id: recordForm.organization_id,
        employee_id: recordForm.employee_id || null,
        employee_name: recordForm.employee_name,
        job_title: recordForm.job_title || null,
        examination_type: recordForm.examination_type,
        examination_date: recordForm.examination_date,
        expiry_date: recordForm.expiry_date,
        result: recordForm.result,
        restrictions: recordForm.restrictions || null,
        doctor_name: recordForm.doctor_name || null,
        clinic_name: recordForm.clinic_name || null,
        notes: recordForm.notes || null,
        validity_months: recordForm.validity_months || 12,
        risk_factors: recordForm.risk_factors
          ? recordForm.risk_factors.split(',').map((s) => s.trim()).filter(Boolean)
          : null,
        document_number: recordForm.document_number || null,
        next_examination_date: recordForm.expiry_date,
      }

      if (editingRecordId) {
        const res = await fetch(`/api/medical/records/${editingRecordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Update failed')
      } else {
        const res = await fetch('/api/medical/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Create failed')
      }

      setShowRecordForm(false)
      setEditingRecordId(null)
      setRecordForm(emptyRecordForm)
      router.refresh()
    } catch (err) {
      console.error('[MEDICAL] Record save error:', err)
      alert(t('errors.saveRecord'))
    } finally {
      setRecordFormLoading(false)
    }
  }

  async function handleRecordDelete() {
    if (!deleteRecordTarget) return
    try {
      setDeleteRecordLoading(true)
      const res = await fetch(`/api/medical/records/${deleteRecordTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')

      setDeleteRecordTarget(null)
      router.refresh()
    } catch (err) {
      console.error('[MEDICAL] Record delete error:', err)
      alert(t('errors.deleteRecord'))
    } finally {
      setDeleteRecordLoading(false)
    }
  }

  // ========== APPOINTMENTS FORM HANDLERS ==========

  function openAddAppointment() {
    setEditingAppointmentId(null)
    setAppointmentForm({ ...emptyAppointmentForm, organization_id: filterOrg !== 'all' ? filterOrg : '' })
    setShowAppointmentForm(true)
  }

  function openEditAppointment(appt: MedicalAppointment) {
    setEditingAppointmentId(appt.id)
    setAppointmentForm({
      organization_id: appt.organization_id,
      employee_id: appt.employee_id,
      appointment_date: appt.appointment_date,
      appointment_time: appt.appointment_time || '',
      clinic_name: appt.clinic_name || '',
      clinic_address: appt.clinic_address || '',
      examination_type: appt.examination_type,
      status: appt.status,
      notes: appt.notes || '',
    })
    setShowAppointmentForm(true)
  }

  async function handleAppointmentSubmit() {
    try {
      setAppointmentFormLoading(true)

      const payload = {
        organization_id: appointmentForm.organization_id,
        employee_id: appointmentForm.employee_id,
        appointment_date: appointmentForm.appointment_date,
        appointment_time: appointmentForm.appointment_time || null,
        clinic_name: appointmentForm.clinic_name || null,
        clinic_address: appointmentForm.clinic_address || null,
        examination_type: appointmentForm.examination_type,
        status: appointmentForm.status,
        notes: appointmentForm.notes || null,
      }

      if (editingAppointmentId) {
        const res = await fetch(`/api/medical/appointments/${editingAppointmentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Update failed')
      } else {
        const res = await fetch('/api/medical/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Create failed')
      }

      setShowAppointmentForm(false)
      setEditingAppointmentId(null)
      setAppointmentForm(emptyAppointmentForm)
      fetchAppointments()
    } catch (err) {
      console.error('[MEDICAL] Appointment save error:', err)
      alert(t('errors.saveAppointment'))
    } finally {
      setAppointmentFormLoading(false)
    }
  }

  async function handleAppointmentDelete() {
    if (!deleteAppointmentTarget) return
    try {
      setDeleteAppointmentLoading(true)
      const res = await fetch(`/api/medical/appointments/${deleteAppointmentTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')

      setDeleteAppointmentTarget(null)
      fetchAppointments()
    } catch (err) {
      console.error('[MEDICAL] Appointment delete error:', err)
      alert(t('errors.deleteAppointment'))
    } finally {
      setDeleteAppointmentLoading(false)
    }
  }

  // ========== RECORDS TABLE COLUMNS ==========

  const recordsColumns: DataTableColumn<MedicalExamination>[] = [
    {
      key: 'employee_name',
      label: t('col.employee'),
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.employee_name || '—'}</div>
          <div className="text-xs text-gray-400">{row.organizations?.name || ''}</div>
        </div>
      ),
    },
    {
      key: 'job_title',
      label: t('col.jobTitle'),
      render: (row) => <span className="text-sm text-gray-600">{row.job_title || '—'}</span>,
    },
    {
      key: 'examination_type',
      label: t('col.type'),
      render: (row) => (
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
          {examTypes[row.examination_type] || row.examination_type}
        </span>
      ),
    },
    {
      key: 'examination_date',
      label: t('col.examDate'),
      render: (row) => <span className="text-sm text-gray-600">{fmtDate(row.examination_date)}</span>,
    },
    {
      key: 'expiry_date',
      label: t('col.expires'),
      render: (row) => <span className="text-sm text-gray-600">{fmtDate(row.expiry_date)}</span>,
    },
    {
      key: 'result',
      label: t('col.result'),
      render: (row) => {
        const colors: Record<string, string> = {
          apt: 'bg-green-50 text-green-700',
          apt_conditionat: 'bg-yellow-50 text-yellow-700',
          inapt_temporar: 'bg-orange-50 text-orange-700',
          inapt: 'bg-red-50 text-red-700',
          in_asteptare: 'bg-gray-50 text-gray-700',
        }
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[row.result] || 'bg-gray-50 text-gray-700'}`}>
            {resultTypes[row.result] || row.result}
          </span>
        )
      },
    },
    {
      key: 'status',
      label: t('col.status'),
      sortable: false,
      render: (row) => (
        <StatusBadge
          status={getStatus(row.expiry_date)}
          label={getDaysText(row.expiry_date)}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          {canUpdate && (
            <button
              onClick={() => openEditRecord(row)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"
              title="Editează"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setDeleteRecordTarget(row)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"
              title="Șterge"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  // ========== APPOINTMENTS TABLE COLUMNS ==========

  const appointmentsColumns: DataTableColumn<MedicalAppointment>[] = [
    {
      key: 'appointment_date',
      label: t('col.date'),
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{fmtDate(row.appointment_date)}</div>
          <div className="text-xs text-gray-400">{fmtTime(row.appointment_time)}</div>
        </div>
      ),
    },
    {
      key: 'employee',
      label: t('col.employee'),
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.employees?.full_name || '—'}</div>
          <div className="text-xs text-gray-400">{row.employees?.job_title || ''}</div>
        </div>
      ),
    },
    {
      key: 'examination_type',
      label: t('col.type'),
      render: (row) => (
        <span className="text-sm text-gray-600">
          {examTypes[row.examination_type] || row.examination_type}
        </span>
      ),
    },
    {
      key: 'clinic_name',
      label: t('col.clinic'),
      render: (row) => <span className="text-sm text-gray-600">{row.clinic_name || '—'}</span>,
    },
    {
      key: 'status',
      label: t('col.status'),
      render: (row) => {
        const colors: Record<string, string> = {
          programat: 'bg-blue-50 text-blue-700',
          confirmat: 'bg-green-50 text-green-700',
          efectuat: 'bg-gray-50 text-gray-700',
          anulat: 'bg-red-50 text-red-700',
          reprogramat: 'bg-yellow-50 text-yellow-700',
        }
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[row.status]}`}>
            {appointmentStatuses[row.status] || row.status}
          </span>
        )
      },
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          {canUpdate && (
            <button
              onClick={() => openEditAppointment(row)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"
              title="Editează"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setDeleteAppointmentTarget(row)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"
              title="Șterge"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  // ========== ALERTS TABLE COLUMNS ==========

  const alertsColumns: DataTableColumn<AlertRecord>[] = [
    {
      key: 'employee_name',
      label: t('col.employee'),
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.full_name || row.employee_name}</div>
          <div className="text-xs text-gray-400">{row.job_title || '—'}</div>
        </div>
      ),
    },
    {
      key: 'examination_type',
      label: t('col.type'),
      render: (row) => (
        <span className="text-sm text-gray-600">
          {examTypes[row.examination_type] || row.examination_type}
        </span>
      ),
    },
    {
      key: 'expiry_date',
      label: t('col.expiryDate'),
      render: (row) => <span className="text-sm text-gray-600">{fmtDate(row.expiry_date)}</span>,
    },
    {
      key: 'days_until_expiry',
      label: t('col.daysLeft'),
      render: (row) => {
        const days = row.days_until_expiry || 0
        const color = days < 0 ? 'text-red-600' : days <= 30 ? 'text-orange-500' : 'text-yellow-600'
        return (
          <span className={`font-semibold ${color}`}>
            {days < 0 ? t('daysText.expiredShort', { days: Math.abs(days) }) : `${days}z`}
          </span>
        )
      },
    },
    {
      key: 'alert_level',
      label: t('col.priority'),
      render: (row) => {
        const colors: Record<string, string> = {
          expirat: 'bg-red-50 text-red-700',
          urgent: 'bg-orange-50 text-orange-700',
          atentie: 'bg-yellow-50 text-yellow-700',
          ok: 'bg-green-50 text-green-700',
          nedefinit: 'bg-gray-50 text-gray-700',
        }
        const labels: Record<string, string> = {
          expirat: t('alertLevel.expirat'),
          urgent: t('alertLevel.urgent'),
          atentie: t('alertLevel.atentie'),
          ok: t('alertLevel.ok'),
          nedefinit: t('alertLevel.nedefinit'),
        }
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[row.alert_level]}`}>
            {labels[row.alert_level]}
          </span>
        )
      },
    },
  ]

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                {t('title')}
              </h1>
              <p className="text-sm text-gray-400">
                {activeTab === 'records' && t('subtitle.records')}
                {activeTab === 'appointments' && t('subtitle.appointments')}
                {activeTab === 'alerts' && t('subtitle.alerts')}
              </p>
            </div>
          </div>
          {canCreate && (
            <button
              onClick={activeTab === 'records' ? openAddRecord : openAddAppointment}
              className="bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {activeTab === 'records' && t('btn.addRecord')}
              {activeTab === 'appointments' && t('btn.schedule')}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 space-y-5">
        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 transition ${
              activeTab === 'records'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-1.5" />
            {t('tab.records')}
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 transition ${
              activeTab === 'appointments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-1.5" />
            {t('tab.appointments')}
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 transition ${
              activeTab === 'alerts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <AlertTriangle className="h-4 w-4 inline mr-1.5" />
            {t('tab.alerts')}
            {alerts.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                {alerts.length}
              </span>
            )}
          </button>
        </div>

        {/* STAT CARDS */}
        {activeTab === 'records' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-3xl font-black text-gray-900">{recordsStats.total}</div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                {t('stats.totalRecords')}
              </div>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
              <div className="text-3xl font-black text-red-600">{recordsStats.expired}</div>
              <div className="text-xs font-semibold text-red-500 uppercase tracking-widest mt-1">
                {t('stats.expired')}
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 text-center">
              <div className="text-3xl font-black text-orange-500">{recordsStats.expiring}</div>
              <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mt-1">
                {t('stats.expiring30')}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
              <div className="text-3xl font-black text-green-600">{recordsStats.valid}</div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                {t('stats.valid')}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-3xl font-black text-gray-900">{appointmentsStats.total}</div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                {t('stats.totalAppointments')}
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
              <div className="text-3xl font-black text-blue-600">{appointmentsStats.programat}</div>
              <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mt-1">
                {t('stats.scheduled')}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
              <div className="text-3xl font-black text-green-600">{appointmentsStats.confirmat}</div>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                {t('stats.confirmed')}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-3xl font-black text-gray-600">{appointmentsStats.efectuat}</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
                {t('stats.done')}
              </div>
            </div>
          </div>
        )}

        {/* FILTERS */}
        {(activeTab === 'records' || activeTab === 'alerts') && (
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterOrg}
              onChange={(e) => setFilterOrg(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">{t('filter.allOrgs')}</option>
              {organizations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.cui})
                </option>
              ))}
            </select>
            {activeTab === 'records' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="all">{t('filter.allStatuses')}</option>
                <option value="expired">{t('filter.expired')}</option>
                <option value="expiring">{t('filter.expiringSoon')}</option>
                <option value="valid">{t('filter.valid')}</option>
              </select>
            )}
          </div>
        )}

        {/* CONTENT BY TAB */}
        {activeTab === 'records' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filteredRecords.length === 0 && medicalExams.length === 0 ? (
              <EmptyState
                icon={Stethoscope}
                title={t('empty.noRecords')}
                description={t('empty.noRecordsDesc')}
                actionLabel={t('btn.addRecord')}
                onAction={openAddRecord}
              />
            ) : (
              <DataTable
                columns={recordsColumns}
                data={filteredRecords}
                emptyMessage={t('empty.noRecordsFilter')}
              />
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {appointmentsLoading ? (
              <div className="p-8 text-center text-gray-500">
                <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
                {t('loading.appointments')}
              </div>
            ) : appointments.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title={t('empty.noAppointments')}
                description={t('empty.noAppointmentsDesc')}
                actionLabel={t('btn.schedule')}
                onAction={openAddAppointment}
              />
            ) : (
              <DataTable
                columns={appointmentsColumns}
                data={appointments}
                emptyMessage={t('empty.noAppointmentsFilter')}
              />
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {alertsLoading ? (
              <div className="p-8 text-center text-gray-500">
                <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
                {t('loading.alerts')}
              </div>
            ) : alerts.length === 0 ? (
              <EmptyState
                icon={AlertTriangle}
                title={t('empty.noAlerts')}
                description={t('empty.noAlertsDesc')}
              />
            ) : (
              <>
                <div className="p-4 bg-red-50 border-b border-red-100">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-900">{t('alerts.warning')}</h3>
                      <p className="text-sm text-red-700 mt-0.5">
                        {t('alerts.warningMessage', { count: alerts.length })}
                      </p>
                    </div>
                  </div>
                </div>
                <DataTable
                  columns={alertsColumns}
                  data={alerts}
                  emptyMessage={t('empty.noAlertsFilter')}
                />
              </>
            )}
          </div>
        )}
      </main>

      {/* ========== RECORDS FORM MODAL ========== */}
      <FormModal
        title={editingRecordId ? t('form.editRecord') : t('form.addRecord')}
        isOpen={showRecordForm}
        onClose={() => {
          setShowRecordForm(false)
          setEditingRecordId(null)
          setRecordForm(emptyRecordForm)
        }}
        onSubmit={handleRecordSubmit}
        loading={recordFormLoading}
        submitLabel={editingRecordId ? t('form.saveChanges') : t('form.addRecordBtn')}
      >
        {/* Organizație */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.organization')}</label>
          <select
            value={recordForm.organization_id}
            onChange={(e) => setRecordForm((f) => ({ ...f, organization_id: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">{t('form.selectOrg')}</option>
            {organizations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.cui})
              </option>
            ))}
          </select>
        </div>

        {/* Angajat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.employee')}</label>
          <select
            value={recordForm.employee_id}
            onChange={(e) => handleEmployeeSelect(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <option value="">{t('form.selectEmployeeManual')}</option>
            {employees
              .filter((e) => !recordForm.organization_id || e.organization_id === recordForm.organization_id)
              .map((e) => (
                <option key={e.id} value={e.id}>
                  {e.full_name} — {e.job_title || 'fără funcție'}
                </option>
              ))}
          </select>
        </div>

        {/* Nume angajat + Funcție */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.employeeName')}</label>
            <input
              type="text"
              value={recordForm.employee_name}
              onChange={(e) => setRecordForm((f) => ({ ...f, employee_name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Popescu Ion"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.jobTitle')}</label>
            <input
              type="text"
              value={recordForm.job_title}
              onChange={(e) => setRecordForm((f) => ({ ...f, job_title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Operator CNC"
            />
          </div>
        </div>

        {/* Tip + Rezultat */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.examType')}</label>
            <select
              value={recordForm.examination_type}
              onChange={(e) => setRecordForm((f) => ({ ...f, examination_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              {Object.entries(examTypes).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.result')}</label>
            <select
              value={recordForm.result}
              onChange={(e) => setRecordForm((f) => ({ ...f, result: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              {Object.entries(resultTypes).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.examDate')}</label>
            <input
              type="date"
              value={recordForm.examination_date}
              onChange={(e) => setRecordForm((f) => ({ ...f, examination_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.expiryDate')}</label>
            <input
              type="date"
              value={recordForm.expiry_date}
              onChange={(e) => setRecordForm((f) => ({ ...f, expiry_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
        </div>

        {/* Doctor + Clinică */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.doctor')}</label>
            <input
              type="text"
              value={recordForm.doctor_name}
              onChange={(e) => setRecordForm((f) => ({ ...f, doctor_name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Dr. Ionescu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.clinic')}</label>
            <input
              type="text"
              value={recordForm.clinic_name}
              onChange={(e) => setRecordForm((f) => ({ ...f, clinic_name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Policlinica Sănătatea"
            />
          </div>
        </div>

        {/* Restricții */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.restrictions')}</label>
          <input
            type="text"
            value={recordForm.restrictions}
            onChange={(e) => setRecordForm((f) => ({ ...f, restrictions: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            placeholder="Ex: fără efort fizic intens"
          />
        </div>

        {/* M3 NEW FIELDS */}
        <div className="border-t border-gray-200 pt-3">
          <div className="text-sm font-semibold text-gray-700 mb-2">{t('form.extraDetails')}</div>

          {/* Factori risc */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.riskFactors')}
            </label>
            <input
              type="text"
              value={recordForm.risk_factors}
              onChange={(e) => setRecordForm((f) => ({ ...f, risk_factors: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Ex: zgomot, chimice, efort fizic"
            />
          </div>

          {/* Document number + Validitate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.documentNumber')}</label>
              <input
                type="text"
                value={recordForm.document_number}
                onChange={(e) => setRecordForm((f) => ({ ...f, document_number: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Ex: FA-2024-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.validityMonths')}</label>
              <input
                type="number"
                value={recordForm.validity_months}
                onChange={(e) => setRecordForm((f) => ({ ...f, validity_months: parseInt(e.target.value) || 12 }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="12"
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.notes')}</label>
          <textarea
            value={recordForm.notes}
            onChange={(e) => setRecordForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
            placeholder="Note suplimentare..."
          />
        </div>
      </FormModal>

      {/* ========== APPOINTMENTS FORM MODAL ========== */}
      <FormModal
        title={editingAppointmentId ? t('form.editAppointment') : t('form.scheduleExam')}
        isOpen={showAppointmentForm}
        onClose={() => {
          setShowAppointmentForm(false)
          setEditingAppointmentId(null)
          setAppointmentForm(emptyAppointmentForm)
        }}
        onSubmit={handleAppointmentSubmit}
        loading={appointmentFormLoading}
        submitLabel={editingAppointmentId ? t('form.save') : t('btn.schedule')}
      >
        {/* Organizație */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.organization')}</label>
          <select
            value={appointmentForm.organization_id}
            onChange={(e) => setAppointmentForm((f) => ({ ...f, organization_id: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">{t('form.selectOrg')}</option>
            {organizations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.cui})
              </option>
            ))}
          </select>
        </div>

        {/* Angajat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.employee')}</label>
          <select
            value={appointmentForm.employee_id}
            onChange={(e) => setAppointmentForm((f) => ({ ...f, employee_id: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">{t('form.selectEmployee')}</option>
            {employees
              .filter((e) => !appointmentForm.organization_id || e.organization_id === appointmentForm.organization_id)
              .map((e) => (
                <option key={e.id} value={e.id}>
                  {e.full_name} — {e.job_title || 'fără funcție'}
                </option>
              ))}
          </select>
        </div>

        {/* Data + Ora */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.date')}</label>
            <input
              type="date"
              value={appointmentForm.appointment_date}
              onChange={(e) => setAppointmentForm((f) => ({ ...f, appointment_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.time')}</label>
            <input
              type="time"
              value={appointmentForm.appointment_time}
              onChange={(e) => setAppointmentForm((f) => ({ ...f, appointment_time: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
        </div>

        {/* Tip + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.examType')}</label>
            <select
              value={appointmentForm.examination_type}
              onChange={(e) => setAppointmentForm((f) => ({ ...f, examination_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              {Object.entries(examTypes).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('col.status')}</label>
            <select
              value={appointmentForm.status}
              onChange={(e) => setAppointmentForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              {Object.entries(appointmentStatuses).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clinică + Adresă */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.clinic')}</label>
          <input
            type="text"
            value={appointmentForm.clinic_name}
            onChange={(e) => setAppointmentForm((f) => ({ ...f, clinic_name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            placeholder="Policlinica Sănătatea"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.clinicAddress')}</label>
          <input
            type="text"
            value={appointmentForm.clinic_address}
            onChange={(e) => setAppointmentForm((f) => ({ ...f, clinic_address: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            placeholder="Str. Sănătății nr. 10, Cluj-Napoca"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.notes')}</label>
          <textarea
            value={appointmentForm.notes}
            onChange={(e) => setAppointmentForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
            placeholder="Note programare..."
          />
        </div>
      </FormModal>

      {/* ========== DELETE RECORD CONFIRM ========== */}
      <ConfirmDialog
        title={t('confirm.deleteRecord')}
        message={t('confirm.deleteRecordMsg', { name: deleteRecordTarget?.employee_name || '' })}
        confirmLabel={t('confirm.deleteForever')}
        isOpen={deleteRecordTarget !== null}
        onConfirm={handleRecordDelete}
        onCancel={() => setDeleteRecordTarget(null)}
        isDestructive={true}
        loading={deleteRecordLoading}
      />

      {/* ========== DELETE APPOINTMENT CONFIRM ========== */}
      <ConfirmDialog
        title={t('confirm.deleteAppointment')}
        message={t('confirm.deleteAppointmentMsg')}
        confirmLabel={t('confirm.delete')}
        isOpen={deleteAppointmentTarget !== null}
        onConfirm={handleAppointmentDelete}
        onCancel={() => setDeleteAppointmentTarget(null)}
        isDestructive={true}
        loading={deleteAppointmentLoading}
      />
    </div>
  )
}
