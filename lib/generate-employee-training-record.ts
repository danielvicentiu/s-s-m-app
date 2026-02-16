// lib/generate-employee-training-record.ts
// Generate ITM-compliant training record (Fișa Individuală de Instruire)
// Conform HG 1425/2006 Anexa 11

import PDFDocument from 'pdfkit'

interface TrainingRecord {
  date: string
  type: string
  duration_hours: number
  materials: string
  instructor: string
}

interface EmployeeTrainingData {
  // Organization
  organization_name: string
  organization_cui: string
  organization_address: string

  // Employee
  employee_name: string
  employee_cnp: string // Will be masked
  employee_job_title: string
  employee_department: string

  // Training records
  trainings: TrainingRecord[]

  // Generation metadata
  generated_date: string
  generated_ip?: string
}

const TRAINING_TYPE_LABELS: Record<string, string> = {
  'introductiv_general': 'Introductiv generală SSM',
  'la_locul_de_munca': 'La locul de muncă SSM',
  'periodic': 'Periodică SSM',
  'psi': 'PSI/SU',
  'custom': 'Specifică',
}

// Mask CNP: show first digit and last 6 digits (1XXXXXX123456)
function maskCNP(cnp: string): string {
  if (!cnp || cnp.length !== 13) return cnp
  return cnp[0] + 'X'.repeat(6) + cnp.slice(7)
}

export async function generateEmployeeTrainingRecord(
  data: EmployeeTrainingData
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const chunks: Buffer[] = []
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      })

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const pageWidth = 595 // A4 width in points
      const pageHeight = 842 // A4 height in points
      const margin = 50

      // ========== HEADER ==========
      doc.fontSize(16).font('Helvetica-Bold')
      doc.text('FIȘA INDIVIDUALĂ DE INSTRUIRE', margin, margin, {
        align: 'center',
        width: pageWidth - 2 * margin,
      })

      doc.fontSize(10).font('Helvetica')
      doc.moveDown(0.5)
      doc.text('Conform HG 1425/2006 Anexa 11', {
        align: 'center',
      })

      doc.moveDown(1.5)

      // ========== ORGANIZATION DATA ==========
      const yStart = doc.y
      doc.fontSize(11).font('Helvetica-Bold')
      doc.text('ANGAJATOR:', margin, yStart)

      doc.font('Helvetica').fontSize(10)
      doc.text(`Denumire: ${data.organization_name}`, margin, doc.y + 5)
      doc.text(`CUI: ${data.organization_cui}`, margin, doc.y + 2)
      doc.text(`Sediu: ${data.organization_address}`, margin, doc.y + 2)

      doc.moveDown(1)

      // ========== EMPLOYEE DATA ==========
      doc.fontSize(11).font('Helvetica-Bold')
      doc.text('ANGAJAT:', margin, doc.y)

      doc.font('Helvetica').fontSize(10)
      doc.text(`Nume și prenume: ${data.employee_name}`, margin, doc.y + 5)
      doc.text(`CNP: ${maskCNP(data.employee_cnp)}`, margin, doc.y + 2)
      doc.text(`Funcția: ${data.employee_job_title}`, margin, doc.y + 2)
      if (data.employee_department) {
        doc.text(`Departament: ${data.employee_department}`, margin, doc.y + 2)
      }

      doc.moveDown(1.5)

      // ========== TRAINING TABLE ==========
      const tableTop = doc.y
      const colWidths = [30, 70, 120, 50, 100, 80, 50, 50]
      const colX = [
        margin,
        margin + colWidths[0],
        margin + colWidths[0] + colWidths[1],
        margin + colWidths[0] + colWidths[1] + colWidths[2],
        margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
        margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4],
        margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5],
        margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6],
      ]

      // Table header
      doc.fontSize(9).font('Helvetica-Bold')
      const headerY = tableTop
      const rowHeight = 25

      doc.rect(margin, headerY, pageWidth - 2 * margin, rowHeight).stroke()

      // Header texts
      const headers = ['Nr.', 'Data', 'Tip instruire', 'Durata\n(ore)', 'Materialul predat', 'Instructor', 'Semnătură\nlucrător', 'Semnătură\ninstructor']
      headers.forEach((header, i) => {
        doc.text(header, colX[i] + 2, headerY + 5, {
          width: colWidths[i] - 4,
          align: 'center',
          lineGap: -2,
        })
      })

      // Table rows
      doc.font('Helvetica').fontSize(8)
      let currentY = headerY + rowHeight

      data.trainings.forEach((training, index) => {
        const rowY = currentY

        // Check if we need a new page
        if (rowY + rowHeight > pageHeight - margin) {
          doc.addPage()
          currentY = margin
        }

        // Draw row
        doc.rect(margin, rowY, pageWidth - 2 * margin, rowHeight).stroke()

        // Draw vertical lines
        colX.forEach((x) => {
          doc.moveTo(x, rowY).lineTo(x, rowY + rowHeight).stroke()
        })

        // Fill data
        doc.text(String(index + 1), colX[0] + 2, rowY + 8, {
          width: colWidths[0] - 4,
          align: 'center',
        })

        doc.text(training.date, colX[1] + 2, rowY + 8, {
          width: colWidths[1] - 4,
          align: 'center',
        })

        const trainingType = TRAINING_TYPE_LABELS[training.type] || training.type
        doc.text(trainingType, colX[2] + 2, rowY + 5, {
          width: colWidths[2] - 4,
          align: 'left',
          lineGap: -1,
        })

        doc.text(String(training.duration_hours), colX[3] + 2, rowY + 8, {
          width: colWidths[3] - 4,
          align: 'center',
        })

        doc.text(training.materials || '—', colX[4] + 2, rowY + 5, {
          width: colWidths[4] - 4,
          align: 'left',
          lineGap: -1,
        })

        doc.text(training.instructor || '—', colX[5] + 2, rowY + 5, {
          width: colWidths[5] - 4,
          align: 'left',
          lineGap: -1,
        })

        // Signature fields (empty or electronic signature)
        if (data.generated_ip) {
          const sigText = '[Semnat\nelectronic]'
          doc.fontSize(7)
          doc.text(sigText, colX[6] + 2, rowY + 6, {
            width: colWidths[6] - 4,
            align: 'center',
            lineGap: -2,
          })
          doc.text(sigText, colX[7] + 2, rowY + 6, {
            width: colWidths[7] - 4,
            align: 'center',
            lineGap: -2,
          })
          doc.fontSize(8)
        }
        // else: leave empty for physical signature

        currentY += rowHeight
      })

      // Add empty rows if fewer than 5 trainings
      const minRows = Math.max(5, data.trainings.length)
      for (let i = data.trainings.length; i < minRows; i++) {
        const rowY = currentY

        if (rowY + rowHeight > pageHeight - margin) {
          doc.addPage()
          currentY = margin
        }

        doc.rect(margin, rowY, pageWidth - 2 * margin, rowHeight).stroke()
        colX.forEach((x) => {
          doc.moveTo(x, rowY).lineTo(x, rowY + rowHeight).stroke()
        })

        currentY += rowHeight
      }

      // ========== FOOTER ==========
      doc.moveDown(2)

      doc.fontSize(9).font('Helvetica')
      doc.text('Document generat automat de platforma s-s-m.ro', margin, doc.y, {
        align: 'center',
        width: pageWidth - 2 * margin,
      })

      if (data.generated_date) {
        doc.fontSize(8).font('Helvetica')
        doc.text(`Data generare: ${data.generated_date}`, margin, doc.y + 5, {
          align: 'center',
          width: pageWidth - 2 * margin,
        })
      }

      if (data.generated_ip) {
        doc.fontSize(7).fillColor('#666666')
        doc.text(`IP: ${data.generated_ip}`, margin, doc.y + 3, {
          align: 'center',
          width: pageWidth - 2 * margin,
        })
      }

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
