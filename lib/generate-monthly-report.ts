// lib/generate-monthly-report.ts
// Generate monthly SSM & PSI compliance report

import PDFDocument from 'pdfkit'

interface ComplianceSummary {
  score: number // 0-100
  active_employees: number
  trainings_this_month: number
  trainings_overdue: number
}

interface MedicalExam {
  employee_name: string
  exam_date: string
  expiry_date: string
  status: 'valid' | 'expiring' | 'expired'
}

interface Equipment {
  type: string
  serial_number: string
  location: string
  last_check: string
  expiry_date: string
  status: 'valid' | 'expiring' | 'expired'
}

interface Training {
  employee_name: string
  type: string
  date: string
  status: 'completed' | 'pending' | 'overdue'
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  action: string
}

interface MonthlyReportData {
  organization_name: string
  organization_cui: string
  month: string // "2026-02"
  month_label: string // "Februarie 2026"

  summary: ComplianceSummary
  medical_exams: {
    valid_count: number
    total_count: number
    expiring_next_month: MedicalExam[]
  }
  equipment: {
    total_count: number
    checked_this_month: number
    expired: Equipment[]
  }
  trainings: Training[]
  recommendations: Recommendation[]

  generated_date: string
}

function getStatusColor(status: 'valid' | 'expiring' | 'expired' | 'completed' | 'pending' | 'overdue'): string {
  switch (status) {
    case 'valid':
    case 'completed':
      return '#10B981' // green
    case 'expiring':
    case 'pending':
      return '#F59E0B' // yellow
    case 'expired':
    case 'overdue':
      return '#EF4444' // red
    default:
      return '#6B7280' // gray
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981' // green
  if (score >= 60) return '#F59E0B' // yellow
  return '#EF4444' // red
}

export async function generateMonthlyReport(data: MonthlyReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const chunks: Buffer[] = []
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 50, right: 50 },
      })

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const pageWidth = 595
      const margin = 50
      const contentWidth = pageWidth - 2 * margin

      // ========== HEADER ==========
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#1E293B')
      doc.text('RAPORT LUNAR SSM & PSI', margin, 50, {
        align: 'center',
        width: contentWidth,
      })

      doc.fontSize(12).font('Helvetica').fillColor('#64748B')
      doc.moveDown(0.5)
      doc.text(`${data.month_label} — ${data.organization_name}`, {
        align: 'center',
      })

      doc.moveDown(1.5)

      // ========== SECTION A: SUMMARY ==========
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E293B')
      doc.text('A. SUMAR CONFORMITATE', margin, doc.y)

      doc.moveDown(0.5)

      // Compliance score box
      const scoreY = doc.y
      const scoreColor = getScoreColor(data.summary.score)

      doc.roundedRect(margin, scoreY, contentWidth, 60, 5)
        .lineWidth(2)
        .strokeColor(scoreColor)
        .stroke()

      doc.fontSize(36).font('Helvetica-Bold').fillColor(scoreColor)
      doc.text(`${data.summary.score}%`, margin + 20, scoreY + 10, {
        width: 100,
        align: 'center',
      })

      doc.fontSize(11).font('Helvetica').fillColor('#475569')
      doc.text('Scor general conformitate', margin + 130, scoreY + 20)

      // Metrics grid
      doc.moveDown(4)
      const metricsY = doc.y

      const metrics = [
        { label: 'Angajați activi', value: data.summary.active_employees, color: '#3B82F6' },
        { label: 'Instruiri luna asta', value: data.summary.trainings_this_month, color: '#10B981' },
        { label: 'Instruiri restante', value: data.summary.trainings_overdue, color: data.summary.trainings_overdue > 0 ? '#EF4444' : '#10B981' },
      ]

      const boxWidth = (contentWidth - 20) / 3
      metrics.forEach((metric, i) => {
        const x = margin + i * (boxWidth + 10)

        doc.fontSize(24).font('Helvetica-Bold').fillColor(metric.color)
        doc.text(String(metric.value), x, metricsY, {
          width: boxWidth,
          align: 'center',
        })

        doc.fontSize(9).font('Helvetica').fillColor('#64748B')
        doc.text(metric.label, x, doc.y + 5, {
          width: boxWidth,
          align: 'center',
        })
      })

      doc.moveDown(4)

      // ========== SECTION B: MEDICAL ==========
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E293B')
      doc.text('B. MEDICINA MUNCII', margin, doc.y)

      doc.moveDown(0.5)
      doc.fontSize(10).font('Helvetica').fillColor('#475569')
      doc.text(`Fișe medicale valabile: ${data.medical_exams.valid_count} din ${data.medical_exams.total_count}`)

      if (data.medical_exams.expiring_next_month.length > 0) {
        doc.moveDown(0.5)
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#F59E0B')
        doc.text(`⚠ Expiră luna viitoare: ${data.medical_exams.expiring_next_month.length}`)

        doc.fontSize(9).font('Helvetica').fillColor('#475569')
        data.medical_exams.expiring_next_month.slice(0, 5).forEach((exam) => {
          doc.text(`  • ${exam.employee_name} — Expiră: ${exam.expiry_date}`, margin + 10, doc.y + 3)
        })

        if (data.medical_exams.expiring_next_month.length > 5) {
          doc.text(`  ... și încă ${data.medical_exams.expiring_next_month.length - 5}`, margin + 10, doc.y + 3)
        }
      }

      doc.moveDown(1.5)

      // ========== SECTION C: EQUIPMENT ==========
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E293B')
      doc.text('C. ECHIPAMENTE PSI', margin, doc.y)

      doc.moveDown(0.5)
      doc.fontSize(10).font('Helvetica').fillColor('#475569')
      doc.text(`Total echipamente: ${data.equipment.total_count}`)
      doc.text(`Verificări efectuate luna asta: ${data.equipment.checked_this_month}`)

      if (data.equipment.expired.length > 0) {
        doc.moveDown(0.5)
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#EF4444')
        doc.text(`⚠ EXPIRATE: ${data.equipment.expired.length}`)

        doc.fontSize(9).font('Helvetica').fillColor('#475569')
        data.equipment.expired.slice(0, 5).forEach((eq) => {
          doc.text(`  • ${eq.type} (${eq.location}) — Expirat: ${eq.expiry_date}`, margin + 10, doc.y + 3)
        })

        if (data.equipment.expired.length > 5) {
          doc.text(`  ... și încă ${data.equipment.expired.length - 5}`, margin + 10, doc.y + 3)
        }
      }

      doc.moveDown(1.5)

      // ========== SECTION D: TRAININGS ==========
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E293B')
      doc.text('D. INSTRUIRI', margin, doc.y)

      doc.moveDown(0.5)

      if (data.trainings.length > 0) {
        // Table header
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#475569')
        const tableY = doc.y
        doc.text('Angajat', margin, tableY)
        doc.text('Tip instruire', margin + 150, tableY)
        doc.text('Data', margin + 300, tableY)
        doc.text('Status', margin + 380, tableY)

        doc.moveTo(margin, tableY + 15).lineTo(margin + contentWidth, tableY + 15).stroke('#CBD5E1')

        // Table rows
        doc.font('Helvetica').fontSize(9)
        let rowY = tableY + 20

        data.trainings.slice(0, 10).forEach((training) => {
          if (rowY > 750) {
            doc.addPage()
            rowY = 50
          }

          doc.fillColor('#1E293B').text(training.employee_name, margin, rowY, { width: 140 })
          doc.fillColor('#475569').text(training.type, margin + 150, rowY, { width: 140 })
          doc.fillColor('#475569').text(training.date, margin + 300, rowY)

          const statusColor = getStatusColor(training.status)
          doc.fillColor(statusColor).text(training.status.toUpperCase(), margin + 380, rowY)

          rowY += 18
        })

        if (data.trainings.length > 10) {
          doc.fillColor('#64748B').text(`... și încă ${data.trainings.length - 10} instruiri`, margin, rowY + 5)
        }
      } else {
        doc.fontSize(10).fillColor('#64748B')
        doc.text('Nicio instruire înregistrată în această lună.')
      }

      doc.moveDown(1.5)

      // ========== SECTION E: RECOMMENDATIONS ==========
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E293B')
      doc.text('E. RECOMANDĂRI LUNA VIITOARE', margin, doc.y)

      doc.moveDown(0.5)

      if (data.recommendations.length > 0) {
        data.recommendations.forEach((rec) => {
          const priorityColor = rec.priority === 'high' ? '#EF4444' : rec.priority === 'medium' ? '#F59E0B' : '#10B981'
          const priorityLabel = rec.priority === 'high' ? 'PRIORITATE MARE' : rec.priority === 'medium' ? 'Prioritate medie' : 'Prioritate mică'

          doc.fontSize(9).font('Helvetica-Bold').fillColor(priorityColor)
          doc.text(`▶ ${priorityLabel}`, margin, doc.y + 5)

          doc.fontSize(10).font('Helvetica').fillColor('#475569')
          doc.text(rec.action, margin + 10, doc.y + 3, { width: contentWidth - 10 })

          doc.moveDown(0.5)
        })
      } else {
        doc.fontSize(10).fillColor('#64748B')
        doc.text('Nicio recomandare în acest moment. Conformitate bună!')
      }

      // ========== FOOTER ==========
      doc.fontSize(8).font('Helvetica').fillColor('#94A3B8')
      doc.text(
        'Generat automat de platforma s-s-m.ro',
        margin,
        760,
        { align: 'center', width: contentWidth }
      )

      doc.fontSize(7).fillColor('#CBD5E1')
      doc.text(`Data: ${data.generated_date}`, margin, 770, {
        align: 'center',
        width: contentWidth,
      })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
