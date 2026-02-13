// S-S-M.RO — Serviciu: Export raport de conformitate PDF
// Generează rapoarte PDF cu scor conformitate, status module, alerte și recomandări

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Organization,
  MedicalExamination,
  SafetyEquipment,
  InAppNotification
} from '@/lib/types'
import { getExpiryStatus, getDaysUntilExpiry } from '@/lib/types'

interface ComplianceModuleStatus {
  name: string
  score: number
  status: 'conform' | 'partial' | 'neconform'
  details: string
}

interface ComplianceReportData {
  organization: Organization
  globalScore: number
  modules: ComplianceModuleStatus[]
  activeAlerts: InAppNotification[]
  recommendations: string[]
  generatedAt: string
}

/**
 * Calculează scorul de conformitate pentru modulul medical
 */
async function calculateMedicalScore(
  supabase: SupabaseClient,
  organizationId: string
): Promise<{ score: number; status: 'conform' | 'partial' | 'neconform'; details: string }> {
  const { data: examinations, error } = await supabase
    .from('medical_examinations')
    .select('*')
    .eq('organization_id', organizationId)

  if (error || !examinations || examinations.length === 0) {
    return { score: 0, status: 'neconform', details: 'Niciun examen medical înregistrat' }
  }

  const validExams = examinations.filter((exam: MedicalExamination) =>
    getExpiryStatus(exam.expiry_date) === 'valid'
  )
  const expiringExams = examinations.filter((exam: MedicalExamination) =>
    getExpiryStatus(exam.expiry_date) === 'expiring'
  )
  const expiredExams = examinations.filter((exam: MedicalExamination) =>
    getExpiryStatus(exam.expiry_date) === 'expired'
  )

  const score = Math.round((validExams.length / examinations.length) * 100)

  let status: 'conform' | 'partial' | 'neconform' = 'conform'
  if (expiredExams.length > 0) {
    status = 'neconform'
  } else if (expiringExams.length > 0) {
    status = 'partial'
  }

  const details = `${validExams.length} valide / ${expiringExams.length} expiră curând / ${expiredExams.length} expirate`

  return { score, status, details }
}

/**
 * Calculează scorul de conformitate pentru modulul echipamente
 */
async function calculateEquipmentScore(
  supabase: SupabaseClient,
  organizationId: string
): Promise<{ score: number; status: 'conform' | 'partial' | 'neconform'; details: string }> {
  const { data: equipment, error } = await supabase
    .from('safety_equipment')
    .select('*')
    .eq('organization_id', organizationId)

  if (error || !equipment || equipment.length === 0) {
    return { score: 0, status: 'neconform', details: 'Niciun echipament înregistrat' }
  }

  const validEquipment = equipment.filter((item: SafetyEquipment) =>
    getExpiryStatus(item.expiry_date) === 'valid' && item.is_compliant
  )
  const expiringEquipment = equipment.filter((item: SafetyEquipment) =>
    getExpiryStatus(item.expiry_date) === 'expiring'
  )
  const expiredEquipment = equipment.filter((item: SafetyEquipment) =>
    getExpiryStatus(item.expiry_date) === 'expired'
  )

  const score = Math.round((validEquipment.length / equipment.length) * 100)

  let status: 'conform' | 'partial' | 'neconform' = 'conform'
  if (expiredEquipment.length > 0) {
    status = 'neconform'
  } else if (expiringEquipment.length > 0) {
    status = 'partial'
  }

  const details = `${validEquipment.length} valide / ${expiringEquipment.length} expiră curând / ${expiredEquipment.length} expirate`

  return { score, status, details }
}

/**
 * Generează recomandări bazate pe status conformitate
 */
function generateRecommendations(modules: ComplianceModuleStatus[], activeAlerts: InAppNotification[]): string[] {
  const recommendations: string[] = []

  // Recomandări pe baza scorurilor module
  modules.forEach(module => {
    if (module.status === 'neconform') {
      if (module.name === 'SSM - Medicina Muncii') {
        recommendations.push('URGENT: Programați examene medicale pentru angajații cu fișe expirate')
      } else if (module.name === 'PSI - Echipamente') {
        recommendations.push('URGENT: Revizuiți și verificați echipamentele PSI expirate')
      }
    } else if (module.status === 'partial') {
      if (module.name === 'SSM - Medicina Muncii') {
        recommendations.push('Planificați examene medicale periodice în următoarele 30 zile')
      } else if (module.name === 'PSI - Echipamente') {
        recommendations.push('Programați revizii tehnice pentru echipamentele care expiră în curând')
      }
    }
  })

  // Recomandări pe baza alertelor active
  const criticalAlerts = activeAlerts.filter(a =>
    a.notification_type.includes('expired') || a.notification_type.includes('7d')
  )

  if (criticalAlerts.length > 5) {
    recommendations.push('Număr mare de alerte critice - recomandăm o revizuire completă a conformității')
  }

  // Recomandări generale
  if (recommendations.length === 0) {
    recommendations.push('Mențineți conformitatea prin monitorizare lunară a scadențelor')
    recommendations.push('Verificați periodic actualizările legislative SSM/PSI')
  } else {
    recommendations.push('Consultați cu un specialist SSM pentru optimizarea procedurilor')
  }

  return recommendations
}

/**
 * Colectează toate datele necesare pentru raportul de conformitate
 */
async function collectComplianceData(
  supabase: SupabaseClient,
  organizationId: string
): Promise<ComplianceReportData> {
  // 1. Date organizație
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .single()

  if (orgError || !organization) {
    throw new Error('Organizație negăsită')
  }

  // 2. Calculare scoruri module
  const medicalScore = await calculateMedicalScore(supabase, organizationId)
  const equipmentScore = await calculateEquipmentScore(supabase, organizationId)

  const modules: ComplianceModuleStatus[] = [
    {
      name: 'SSM - Medicina Muncii',
      score: medicalScore.score,
      status: medicalScore.status,
      details: medicalScore.details
    },
    {
      name: 'PSI - Echipamente',
      score: equipmentScore.score,
      status: equipmentScore.status,
      details: equipmentScore.details
    },
    {
      name: 'SSM - Instruire',
      score: 0,
      status: 'neconform',
      details: 'Modul în dezvoltare'
    },
    {
      name: 'PSI - Autorizații',
      score: 0,
      status: 'neconform',
      details: 'Modul în dezvoltare'
    }
  ]

  // 3. Scor global (medie ponderată - doar module active)
  const activeModules = modules.filter(m => m.score > 0)
  const globalScore = activeModules.length > 0
    ? Math.round(activeModules.reduce((sum, m) => sum + m.score, 0) / activeModules.length)
    : 0

  // 4. Alerte active
  const { data: alerts } = await supabase
    .from('in_app_notifications')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(20)

  const activeAlerts = (alerts || []) as InAppNotification[]

  // 5. Generare recomandări
  const recommendations = generateRecommendations(modules, activeAlerts)

  return {
    organization: organization as Organization,
    globalScore,
    modules,
    activeAlerts,
    recommendations,
    generatedAt: new Date().toISOString()
  }
}

/**
 * Generează PDF cu raport de conformitate
 */
export async function generateComplianceReport(
  supabase: SupabaseClient,
  organizationId: string
): Promise<Blob> {
  // Colectare date
  const data = await collectComplianceData(supabase, organizationId)

  // Inițializare document PDF
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  // Helper pentru culori status
  const getStatusColor = (status: string): [number, number, number] => {
    switch (status) {
      case 'conform': return [34, 197, 94] // green-500
      case 'partial': return [234, 179, 8] // yellow-500
      case 'neconform': return [239, 68, 68] // red-500
      default: return [156, 163, 175] // gray-400
    }
  }

  // ══════════════════════════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════════════════════════

  doc.setFillColor(37, 99, 235) // blue-600
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('RAPORT CONFORMITATE SSM/PSI', pageWidth / 2, 20, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Generat de platforma s-s-m.ro', pageWidth / 2, 30, { align: 'center' })

  yPosition = 55

  // ══════════════════════════════════════════════════════════════
  // DATE FIRMĂ
  // ══════════════════════════════════════════════════════════════

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Date Firmă', 14, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Denumire: ${data.organization.name}`, 14, yPosition)
  yPosition += 6

  if (data.organization.cui) {
    doc.text(`CUI: ${data.organization.cui}`, 14, yPosition)
    yPosition += 6
  }

  if (data.organization.address) {
    doc.text(`Adresă: ${data.organization.address}`, 14, yPosition)
    yPosition += 6
  }

  if (data.organization.county) {
    doc.text(`Județ: ${data.organization.county}`, 14, yPosition)
    yPosition += 6
  }

  const generatedDate = new Date(data.generatedAt).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.text(`Data generare: ${generatedDate}`, 14, yPosition)
  yPosition += 15

  // ══════════════════════════════════════════════════════════════
  // SCOR CONFORMITATE GLOBAL
  // ══════════════════════════════════════════════════════════════

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Scor Conformitate Global', 14, yPosition)
  yPosition += 10

  // Box pentru scor
  const scoreBoxX = 14
  const scoreBoxWidth = 50
  const scoreBoxHeight = 25

  const scoreColor = data.globalScore >= 80
    ? [34, 197, 94]
    : data.globalScore >= 50
    ? [234, 179, 8]
    : [239, 68, 68]

  doc.setFillColor(...scoreColor)
  doc.roundedRect(scoreBoxX, yPosition, scoreBoxWidth, scoreBoxHeight, 3, 3, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(`${data.globalScore}%`, scoreBoxX + scoreBoxWidth / 2, yPosition + 17, { align: 'center' })

  yPosition += scoreBoxHeight + 15

  // ══════════════════════════════════════════════════════════════
  // STATUS MODULE
  // ══════════════════════════════════════════════════════════════

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Status Module', 14, yPosition)
  yPosition += 5

  // Tabel module
  autoTable(doc, {
    startY: yPosition,
    head: [['Modul', 'Scor', 'Status', 'Detalii']],
    body: data.modules.map(module => [
      module.name,
      `${module.score}%`,
      module.status.toUpperCase(),
      module.details
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 'auto' }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const rowIndex = data.row.index
        const status = data.modules[rowIndex].status
        const color = getStatusColor(status)
        data.cell.styles.textColor = color
        data.cell.styles.fontStyle = 'bold'
      }
    }
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // ══════════════════════════════════════════════════════════════
  // ALERTE ACTIVE
  // ══════════════════════════════════════════════════════════════

  if (yPosition > 220) {
    doc.addPage()
    yPosition = 20
  }

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`Alerte Active (${data.activeAlerts.length})`, 14, yPosition)
  yPosition += 5

  if (data.activeAlerts.length > 0) {
    const alertTableData = data.activeAlerts.slice(0, 10).map(alert => {
      const createdDate = new Date(alert.created_at).toLocaleDateString('ro-RO')
      return [
        alert.title,
        alert.message.substring(0, 80) + (alert.message.length > 80 ? '...' : ''),
        createdDate
      ]
    })

    autoTable(doc, {
      startY: yPosition,
      head: [['Titlu', 'Mesaj', 'Data']],
      body: alertTableData,
      theme: 'striped',
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 100 },
        2: { cellWidth: 30, halign: 'center' }
      }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15
  } else {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    doc.text('Nu există alerte active în acest moment.', 14, yPosition + 10)
    yPosition += 20
  }

  // ══════════════════════════════════════════════════════════════
  // RECOMANDĂRI
  // ══════════════════════════════════════════════════════════════

  if (yPosition > 220) {
    doc.addPage()
    yPosition = 20
  }

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Recomandări', 14, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  data.recommendations.forEach((recommendation, index) => {
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }

    doc.setTextColor(37, 99, 235)
    doc.text(`${index + 1}.`, 14, yPosition)
    doc.setTextColor(0, 0, 0)

    const lines = doc.splitTextToSize(recommendation, pageWidth - 30)
    doc.text(lines, 22, yPosition)
    yPosition += lines.length * 6 + 3
  })

  // ══════════════════════════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════════════════════════

  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Pagina ${i} din ${totalPages} | s-s-m.ro | Raport generat automat`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // ══════════════════════════════════════════════════════════════
  // RETURNARE BLOB
  // ══════════════════════════════════════════════════════════════

  const blob = doc.output('blob')
  return blob
}

/**
 * Helper pentru descărcare directă PDF în browser
 */
export function downloadComplianceReportPDF(blob: Blob, organizationName: string): void {
  const fileName = `Raport_Conformitate_${organizationName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
