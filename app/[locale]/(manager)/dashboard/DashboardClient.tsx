// app/dashboard/DashboardClient.tsx
// Design PIXEL-PERFECT identic cu versiunea aprobată de 9 clienți
// Layout: Header → Risc ITM → VALUE PREVIEW → Tabs → Counters → Tabel → Notificări → MODULE ACTIVE → Features → Butoane
// + Toggle-uri panou risc (salvate în DB)
// 🆕 OP-LEGO Sprint 4.7: ActiveModulesCard integrat

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { createSupabaseBrowser as createClient } from '@/lib/supabase/client'
import { ValuePreview } from '@/components/ui/ValuePreview'
import Link from 'next/link'
import { UserPlus, FileText } from 'lucide-react'
import LanguageSelector from '@/components/LanguageSelector'
import ActiveModulesCard from '@/components/ActiveModulesCard'  // 🆕 OP-LEGO
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { OrgProvider, useOrg, type OrgOption } from '@/lib/contexts/OrgContext'
import OrgSelector from '@/components/dashboard/OrgSelector'
import DashboardOverview from './DashboardOverview'
import { StatCards } from '@/components/dashboard-v0/StatCards'
import { ComplianceChart } from '@/components/dashboard-v0/ComplianceChart'
import { ActiveModulesWidget } from '@/components/dashboard-v0/ActiveModules'
import { UrgentActions } from '@/components/dashboard-v0/UrgentActions'
import { ActivityTimeline } from '@/components/dashboard-v0/ActivityTimeline'

interface Props {
  user: { email: string; id: string }
  overview: any[]
  alerts: any[]
  medicalExams: any[]
  equipment: any[]
  employees: any[]
  valuePreviewMap?: Record<string, any>
  isConsultant?: boolean
  initialPrefs?: Record<string, any>
  organizations: OrgOption[]
  savedSelectedOrg?: string
}

export default function DashboardClient({
  user, overview, alerts, medicalExams, equipment, employees,
  valuePreviewMap = {}, isConsultant = false, initialPrefs = {},
  organizations, savedSelectedOrg = 'all'
}: Props) {
  return (
    <OrgProvider
      initialOrgs={organizations}
      initialSelectedOrg={savedSelectedOrg}
      userId={user.id}
    >
      <DashboardContent
        user={user}
        overview={overview}
        alerts={alerts}
        medicalExams={medicalExams}
        equipment={equipment}
        employees={employees}
        valuePreviewMap={valuePreviewMap}
        isConsultant={isConsultant}
        initialPrefs={initialPrefs}
        organizations={organizations}
      />
    </OrgProvider>
  )
}

function DashboardContent({
  user, overview, alerts, medicalExams, equipment, employees,
  valuePreviewMap = {}, isConsultant = false, initialPrefs = {},
  organizations
}: Omit<Props, 'savedSelectedOrg'>) {
  const t = useTranslations('dashboardClient')
  // DEBUG: Log employees prop
  console.log('🔍 [DashboardClient] Employees prop:', {
    count: employees?.length || 0,
    data: employees,
    isArray: Array.isArray(employees)
  })

  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'equipment' | 'employees'>('overview')
  const { currentOrg: selectedOrg, setCurrentOrg: setSelectedOrg, selectedOrgData } = useOrg()
  const router = useRouter()
  const pathname = usePathname()

  // Toggle-uri panouri (din DB sau default true = vizibil)
  const [showRiskITM, setShowRiskITM] = useState(initialPrefs.show_risk_itm !== false)
  const [showValuePreview, setShowValuePreview] = useState(initialPrefs.show_value_preview !== false)

  // Salvează preferință în Supabase (for toggles only, org selection handled by context)
  async function savePreference(key: string, value: boolean) {
    const supabase = createClient()
    await supabase.from('user_preferences').upsert(
      { user_id: user.id, key, value: JSON.stringify(value), updated_at: new Date().toISOString() },
      { onConflict: 'user_id,key' }
    )
  }

  function toggleRiskITM() {
    const next = !showRiskITM
    setShowRiskITM(next)
    savePreference('show_risk_itm', next)
  }

  function toggleValuePreview() {
    const next = !showValuePreview
    setShowValuePreview(next)
    savePreference('show_value_preview', next)
  }

  // Monthly report
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [downloadingReport, setDownloadingReport] = useState(false)

  const handleDownloadMonthlyReport = async (month?: string) => {
    if (selectedOrg === 'all') {
      alert(t('selectOrgReport'))
      return
    }

    const reportMonth = month || new Date().toISOString().slice(0, 7) // YYYY-MM

    try {
      setDownloadingReport(true)
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: selectedOrg,
          month: reportMonth,
          type: 'monthly',
        }),
      })

      if (!response.ok) {
        throw new Error(t('errorGenerateReport'))
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const orgName = selectedOrgData?.name || 'Organizatie'
      a.download = `Raport_${orgName.replace(/\s+/g, '_')}_${reportMonth}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setShowMonthPicker(false)
    } catch (err) {
      alert(`${t('errorDownloadReport')}: ${err instanceof Error ? err.message : ''}`)
    } finally {
      setDownloadingReport(false)
    }
  }

  // === FILTRARE PER ORGANIZAȚIE ===
  const filteredOverview = selectedOrg === 'all' ? overview
    : overview.filter((o: any) => o.organization_id === selectedOrg)
  const filteredMedicalExams = selectedOrg === 'all' ? medicalExams
    : medicalExams.filter((m: any) => m.organization_id === selectedOrg)
  const filteredEquipment = selectedOrg === 'all' ? equipment
    : equipment.filter((e: any) => e.organization_id === selectedOrg)
  const filteredEmployees = selectedOrg === 'all' ? employees
    : employees.filter((e: any) => e.organization_id === selectedOrg)
  const filteredAlerts = selectedOrg === 'all' ? alerts
    : alerts.filter((a: any) => a.organization_id === selectedOrg)

  // DEBUG: Log filtered employees
  console.log('🔍 [DashboardClient] Filtered employees:', {
    selectedOrg,
    totalEmployees: employees?.length || 0,
    filteredCount: filteredEmployees?.length || 0,
    filteredData: filteredEmployees
  })

  const orgName = selectedOrgData?.name || filteredOverview[0]?.organization_name || t('allOrganizations')
  const orgCUI = selectedOrgData?.cui || filteredMedicalExams[0]?.organizations?.cui || ''

  const activeValuePreview = selectedOrg === 'all'
    ? Object.values(valuePreviewMap)[0] || null
    : valuePreviewMap[selectedOrg] || null

  // 🆕 OP-LEGO: orgId pentru ActiveModulesCard
  const moduleOrgId = selectedOrg !== 'all' ? selectedOrg : (organizations[0]?.id || null)

  // === DATA COMPLETENESS CALCULATION ===
  const calculateCompleteness = () => {
    if (selectedOrg === 'all') {
      const completenessScores = organizations
        .map(org => (org as any).data_completeness)
        .filter(score => typeof score === 'number')

      if (completenessScores.length > 0) {
        return Math.round(completenessScores.reduce((sum, score) => sum + score, 0) / completenessScores.length)
      }
    } else {
      const org = organizations.find(o => o.id === selectedOrg) as any
      if (org?.data_completeness && typeof org.data_completeness === 'number') {
        return org.data_completeness
      }
    }

    const hasMedicalData = filteredMedicalExams.length > 0
    const hasEquipmentData = filteredEquipment.length > 0
    const hasOrgName = !!orgName && orgName !== t('allOrganizations')
    const hasOrgCUI = !!orgCUI

    let score = 20
    if (hasMedicalData) score += 30
    if (hasEquipmentData) score += 30
    if (hasOrgName) score += 10
    if (hasOrgCUI) score += 10

    return score
  }

  const completeness = calculateCompleteness()

  const now = new Date()

  // === MEDICINA MUNCII ===
  const medWithStatus = filteredMedicalExams.map((m: any) => {
    const expiry = new Date(m.expiry_date)
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    let status: 'expired' | 'expiring' | 'valid'
    if (diffDays <= 0) status = 'expired'
    else if (diffDays <= 30) status = 'expiring'
    else status = 'valid'
    return { ...m, diffDays, status }
  }).sort((a: any, b: any) => a.diffDays - b.diffDays)

  const medExpired = medWithStatus.filter((m: any) => m.status === 'expired').length
  const medExpiring = medWithStatus.filter((m: any) => m.status === 'expiring').length
  const medValid = medWithStatus.filter((m: any) => m.status === 'valid').length

  // === ECHIPAMENTE PSI ===
  const eqWithStatus = filteredEquipment.map((e: any) => {
    const expiry = new Date(e.expiry_date)
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    let status: 'expired' | 'expiring' | 'valid'
    if (diffDays <= 0) status = 'expired'
    else if (diffDays <= 30) status = 'expiring'
    else status = 'valid'
    return { ...e, diffDays, status }
  }).sort((a: any, b: any) => a.diffDays - b.diffDays)

  const eqExpired = eqWithStatus.filter((e: any) => e.status === 'expired').length
  const eqExpiring = eqWithStatus.filter((e: any) => e.status === 'expiring').length
  const eqValid = eqWithStatus.filter((e: any) => e.status === 'valid').length

  // Tab badge counts (expirate + expiring)
  const medBadge = medExpired + medExpiring
  const eqBadge = eqExpired + eqExpiring

  // Active tab counters
  const expired = activeTab === 'medical' ? medExpired : eqExpired
  const expiring = activeTab === 'medical' ? medExpiring : eqExpiring
  const valid = activeTab === 'medical' ? medValid : eqValid

  // Active tab rows
  const activeRows = activeTab === 'medical' ? medWithStatus : eqWithStatus

  // Scor risc ITM
  const totalExpired = medExpired + eqExpired
  const riskScore = medExpired * 3 + medExpiring + eqExpired * 2
  let riskLevel = t('riskLow')
  let riskClass = 'text-green-600'
  if (riskScore > 10) { riskLevel = t('riskCritical'); riskClass = 'text-red-600' }
  else if (riskScore >= 5) { riskLevel = t('riskHigh'); riskClass = 'text-orange-600' }
  else if (riskScore >= 2) { riskLevel = t('riskMedium'); riskClass = 'text-yellow-600' }

  // Notificări — din alerts ca proxy
  const recentNotifCount = filteredAlerts.filter((a: any) => a.severity === 'expired').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* ============ HEADER ============ */}
      <header className="bg-white dark:bg-gray-800 px-8 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">s-s-m.ro</h1>
              {organizations.length <= 1 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {organizations[0]?.name || orgName}{organizations[0]?.cui ? ` · ${organizations[0].cui}` : ''}
                </p>
              )}
            </div>
            {organizations.length > 1 && (
              <div className="mt-1">
                <OrgSelector />
              </div>
            )}
          </div>
          <div className="flex items-center gap-5">
            {/* Action buttons */}
            <div className="flex items-center gap-3 border-r border-gray-200 pr-5">
              <Link
                href="/dashboard/angajat-nou"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>{t('newEmployee')}</span>
              </Link>
              <Link
                href="/ro/documents/generate"
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>{t('generateDocs')}</span>
              </Link>

              {/* Monthly Report Button */}
              <div className="relative">
                <button
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  disabled={downloadingReport || selectedOrg === 'all'}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                    selectedOrg === 'all'
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                  title={selectedOrg === 'all' ? t('selectOrgForReport') : t('downloadReport')}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{downloadingReport ? t('generating') : t('monthlyReport')}</span>
                </button>

                {/* Month picker dropdown */}
                {showMonthPicker && !downloadingReport && (
                  <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 min-w-[200px]">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      {t('selectMonth')}
                    </div>
                    {[0, 1, 2, 3, 4, 5].map((offset) => {
                      const date = new Date()
                      date.setMonth(date.getMonth() - offset)
                      const monthStr = date.toISOString().slice(0, 7)
                      const monthLabel = date.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })
                      return (
                        <button
                          key={monthStr}
                          onClick={() => handleDownloadMonthlyReport(monthStr)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                        >
                          {monthLabel}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* Toggle-uri panouri */}
            <div className="flex items-center gap-4 border-r border-gray-200 pr-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{t('riskITM')}</span>
                <button
                  onClick={toggleRiskITM}
                  className={`relative w-9 h-5 rounded-full transition-colors ${showRiskITM ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showRiskITM ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{t('riskEuro')}</span>
                <button
                  onClick={toggleValuePreview}
                  className={`relative w-9 h-5 rounded-full transition-colors ${showValuePreview ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showValuePreview ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </label>
            </div>
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* Language Selector */}
            <LanguageSelector />
            <span className="text-sm text-gray-400 dark:text-gray-500">{t('consultant')}</span>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-sm text-red-400 hover:text-red-600 font-medium">
                {t('logout')}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6 space-y-5">

        {/* ============ RISC CONTROL ITM ============ */}
        {showRiskITM && (
          <div className="rounded-2xl border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-gray-800 px-6 py-5 flex justify-between items-center">
            <div>
              <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {t('riskControlITM')}
              </div>
              <div className={`text-3xl font-black ${riskClass}`}>{riskLevel}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-gray-400 dark:text-gray-500">{t('dataCompleteness')}</div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{completeness}%</div>
            </div>
          </div>
        )}

        {/* ============ VALUE PREVIEW ============ */}
        {showValuePreview && (
          <ValuePreview
            data={activeValuePreview}
            isConsultant={isConsultant}
            showToClient={false}
          />
        )}

        {/* ============ TABS ============ */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="flex">
            {/* Tab Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3.5 text-center text-[15px] font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-b-[3px] border-blue-600'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-700'
              }`}
            >
              📊 {t('tabOverview')}
            </button>
            {/* Tab Medicina Muncii */}
            <button
              onClick={() => setActiveTab('medical')}
              className={`flex-1 py-3.5 text-center text-[15px] font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'medical'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-b-[3px] border-blue-600'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-700'
              }`}
            >
              🏥 {t('tabMedical')}
              {medBadge > 0 && (
                <span className="bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {medBadge}
                </span>
              )}
            </button>
            {/* Tab Echipamente PSI */}
            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex-1 py-3.5 text-center text-[15px] font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'equipment'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-b-[3px] border-blue-600'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-700'
              }`}
            >
              🧻 {t('tabEquipment')}
              {eqBadge > 0 && (
                <span className="bg-green-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {eqBadge}
                </span>
              )}
            </button>
            {/* Tab Angajați */}
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex-1 py-3.5 text-center text-[15px] font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'employees'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-b-[3px] border-blue-600'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-700'
              }`}
            >
              👥 {t('tabEmployees')}
              <span className="text-[11px] text-gray-400 dark:text-gray-500">({filteredEmployees.length})</span>
            </button>
          </div>

          {/* ============ COUNTER CARDS (only for medical, equipment, employees tabs) ============ */}
          {activeTab !== 'overview' && (
            <div className="grid grid-cols-3 gap-4 p-5">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl py-6 text-center">
                <div className="text-5xl font-black text-red-600 dark:text-red-400">{expired}</div>
                <div className="text-[11px] font-bold text-red-500 dark:text-red-400 uppercase tracking-widest mt-1">{t('expiredCount')}</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl py-6 text-center">
                <div className="text-5xl font-black text-orange-500 dark:text-orange-400">{expiring}</div>
                <div className="text-[11px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest mt-1">{t('expiringCount')}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl py-6 text-center">
                <div className="text-5xl font-black text-green-600 dark:text-green-400">{valid}</div>
                <div className="text-[11px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mt-1">{t('validCount')}</div>
              </div>
            </div>
          )}
        </div>

        {/* ============ OVERVIEW TAB ============ */}
        {activeTab === 'overview' && (
          <div className="py-6 space-y-6">
            {/* === v0 Visual Dashboard Widgets === */}
            <StatCards />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2" style={{ minHeight: 320 }}>
                <ComplianceChart />
              </div>
              <div style={{ minHeight: 320 }}>
                <ActiveModulesWidget />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <UrgentActions />
              <ActivityTimeline />
            </div>
            {/* === Existing Dashboard Overview (real data) === */}
            <DashboardOverview selectedOrg={selectedOrg} />
          </div>
        )}

        {/* ============ TABEL MEDICINA MUNCII ============ */}
        {activeTab === 'medical' && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('medicalTitle')}</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 dark:text-gray-500">{filteredMedicalExams.length} {t('records')}</span>
                <button onClick={() => router.push('/dashboard/medical')} className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition">
                  {t('addRecord')}
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-t border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-3">{t('colEmployee')}</th>
                  <th className="px-6 py-3">{t('colFunction')}</th>
                  <th className="px-6 py-3">{t('colType')}</th>
                  <th className="px-6 py-3">{t('colExamDate')}</th>
                  <th className="px-6 py-3">{t('colExpiry')}</th>
                  <th className="px-6 py-3">{t('colStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {medWithStatus.map((m: any) => (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{m.employee_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{m.job_title || m.notes || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {fmtExamType(m.examination_type, t)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{fmtDate(m.examination_date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{fmtDate(m.expiry_date)}</td>
                    <td className="px-6 py-4"><StatusPill status={m.status} days={m.diffDays} t={t} /></td>
                  </tr>
                ))}
                {filteredMedicalExams.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-300 dark:text-gray-600">{t('noMedical')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ============ TABEL ECHIPAMENTE PSI ============ */}
        {activeTab === 'equipment' && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('equipmentTitle')}</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 dark:text-gray-500">{filteredEquipment.length} {t('records')}</span>
                <button onClick={() => router.push('/dashboard/equipment')} className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition">
                  {t('addEquipment')}
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-t border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-3">{t('colEquipment')}</th>
                  <th className="px-6 py-3">{t('colType')}</th>
                  <th className="px-6 py-3">{t('colLocation')}</th>
                  <th className="px-6 py-3">{t('colChecked')}</th>
                  <th className="px-6 py-3">{t('colExpiry')}</th>
                  <th className="px-6 py-3">{t('colStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {eqWithStatus.map((e: any) => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{fmtEquipType(e.equipment_type, t)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {fmtEquipType(e.equipment_type, t)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{e.location || e.description || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{fmtDate(e.last_check_date || e.created_at)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{fmtDate(e.expiry_date)}</td>
                    <td className="px-6 py-4"><StatusPill status={e.status} days={e.diffDays} t={t} /></td>
                  </tr>
                ))}
                {filteredEquipment.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-300 dark:text-gray-600">{t('noEquipment')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ============ TABEL ANGAJAȚI ============ */}
        {activeTab === 'employees' && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('employeesTitle')}</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 dark:text-gray-500">{filteredEmployees.length} {t('employees')}</span>
                <button onClick={() => router.push('/dashboard/angajat-nou')} className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition">
                  {t('addEmployee')}
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-t border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-3">{t('colName')}</th>
                  <th className="px-6 py-3">{t('colFunction')}</th>
                  <th className="px-6 py-3">{t('colCOR')}</th>
                  <th className="px-6 py-3">{t('colNationality')}</th>
                  <th className="px-6 py-3">{t('colHireDate')}</th>
                  <th className="px-6 py-3">{t('colOrg')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filteredEmployees.map((emp: any) => (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{emp.full_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{emp.job_title || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {emp.cor_code || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{emp.nationality || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{fmtDate(emp.hire_date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{emp.organizations?.name || '—'}</td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-300 dark:text-gray-600">{t('noEmployees')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ============ ULTIMELE NOTIFICĂRI ============ */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              📬 <span className="font-bold">{t('recentNotifications')}</span>
            </h2>
            <span className="text-sm text-gray-400">
              {recentNotifCount > 0 ? t('recentCount', { count: recentNotifCount }) : t('recentCount', { count: 0 })}
            </span>
          </div>
          <div className="border-t border-gray-100">
            {recentNotifCount === 0 ? (
              <div className="px-6 py-6 text-center text-gray-300 text-sm">
                {t('noNotifications')}
              </div>
            ) : (
              <div className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      [SSM] {orgName} — ⚠ {totalExpired} {t('expiredLabel')}
                    </div>
                    <div className="text-xs text-gray-400">
                      Către: {user.email} · {new Date().toLocaleDateString('ro-RO')}, 08:00:00
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                    {t('expiredItems', { n: totalExpired })}
                  </span>
                  <span className="text-xs font-semibold text-green-600">✔ {t('sentLabel')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============ 🆕 MODULE ACTIVE OP-LEGO ============ */}
        <ActiveModulesCard orgId={moduleOrgId} locale="ro" />

        {/* ============ FEATURE CARDS ============ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PDF Conformitate */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">📄</div>
              <div>
                <div className="font-bold text-gray-900">{t('pdfTitle')}</div>
                <div className="text-xs text-gray-400">{t('pdfSubtitle')}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-400 flex items-center gap-1">
              🔒 {t('pdfLocked')}
            </div>
          </div>

          {/* Alerte Automate */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">🔔</div>
              <div>
                <div className="font-bold text-gray-900">{t('alertsTitle')}</div>
                <div className="text-xs text-gray-400">{t('alertsSubtitle')}</div>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl px-3 py-2 text-xs text-green-600 flex items-center gap-1">
              ✅ {t('alertsActive')}
            </div>
          </div>

          {/* Instruiri SSM & PSI */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">📚</div>
              <div>
                <div className="font-bold text-gray-900">{t('trainingsTitle')}</div>
                <div className="text-xs text-gray-400">{t('trainingsSubtitle')}</div>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl px-3 py-2 text-xs text-green-600 flex items-center gap-1">
              ✅ {t('trainingsActive')}
            </div>
          </div>
        </div>

        {/* ============ ACTION BUTTONS ============ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white rounded-2xl border border-gray-200 py-4 text-center hover:bg-gray-50 transition font-medium text-gray-600 flex items-center justify-center gap-2">
            📞 {t('contactConsultant')}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-white rounded-2xl border border-gray-200 py-4 text-center hover:bg-gray-50 transition font-medium text-gray-600 flex items-center justify-center gap-2"
          >
            🔄 {t('reloadData')}
          </button>
          <button className="bg-blue-600 rounded-2xl py-4 text-center hover:bg-blue-700 transition font-bold text-white flex items-center justify-center gap-2">
            ℹ️ {t('aboutPlatform')}
          </button>
        </div>

      </main>
    </div>
  )
}

// ========== HELPERS ==========

function StatusPill({ status, days, t }: { status: string; days: number; t: (key: string, opts?: Record<string, unknown>) => string }) {
  if (status === 'expired') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
        {t('statusExpired', { days: Math.abs(days) })}
      </span>
    )
  }
  if (status === 'expiring') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">
        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
        {t('statusExpiring', { days })}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200">
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
      {t('statusValid', { days })}
    </span>
  )
}

function fmtDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fmtExamType(type: string, tFn: (key: string) => string): string {
  const m: Record<string, string> = {
    periodic: tFn('examPeriodic'),
    angajare: tFn('examAngajare'),
    reluare: tFn('examReluare'),
    la_cerere: tFn('examLaCerere'),
  }
  return m[type] || type
}

function fmtEquipType(type: string, tFn: (key: string) => string): string {
  const m: Record<string, string> = {
    stingator: tFn('equipStingator'),
    trusa_prim_ajutor: tFn('equipTrusa'),
    hidrant: tFn('equipHidrant'),
    detector_fum: tFn('equipDetector'),
    iluminat_urgenta: tFn('equipIluminat'),
  }
  return m[type] || type
}
