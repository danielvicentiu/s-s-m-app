// lib/reports/generateSSMReport.ts
// Generare raport HTML pentru Situație SSM Completă
// Data: 17 Februarie 2026

import { MedicalExamination } from '@/lib/types'

interface SSMReportData {
  organization: {
    name: string
    cui: string | null
    address: string | null
  }
  qrCodeUrl?: string
  employees: Array<{
    id: string
    full_name: string
    job_title: string | null
    hired_at: string | null
    is_active: boolean
  }>
  medicalRecords: MedicalExamination[]
  trainings: Array<{
    id: string
    employee_id: string
    employee_name: string
    training_type: string
    training_date: string
    expiry_date: string | null
    status: string
  }>
  equipment: Array<{
    id: string
    equipment_type: string
    description: string | null
    location: string | null
    serial_number: string | null
    last_inspection_date: string | null
    expiry_date: string
    is_compliant: boolean
  }>
}

export function generateSSMReport(data: SSMReportData): string {
  const today = new Date().toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  // Calculate compliance score
  const complianceScore = calculateComplianceScore(data)

  // Helper to format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Helper to get status badge
  const getStatusBadge = (expiryDate: string): string => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expiryDate)
    const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) {
      return '<span class="status-badge expired">Expirat</span>'
    } else if (daysUntil <= 30) {
      return '<span class="status-badge expiring">Expiră în ' + daysUntil + ' zile</span>'
    } else {
      return '<span class="status-badge valid">Valid</span>'
    }
  }

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport SSM - ${data.organization.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #ffffff;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      position: relative;
    }

    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }

    .header .subtitle {
      font-size: 16px;
      opacity: 0.9;
    }

    .header .org-info {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
    }

    .header .org-info div {
      margin: 5px 0;
      font-size: 14px;
    }

    /* Section */
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .section-header {
      background: #f3f4f6;
      padding: 15px 20px;
      border-left: 4px solid #2563eb;
      margin-bottom: 20px;
      border-radius: 4px;
    }

    .section-header h2 {
      font-size: 20px;
      color: #1f2937;
      font-weight: 600;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    thead {
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
    }

    thead th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    tbody tr {
      border-bottom: 1px solid #f3f4f6;
    }

    tbody tr:nth-child(even) {
      background: #f9fafb;
    }

    tbody tr:hover {
      background: #f3f4f6;
    }

    tbody td {
      padding: 12px 16px;
      font-size: 14px;
      color: #4b5563;
    }

    /* Status badges */
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.valid {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.expiring {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.expired {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Compliance score */
    .compliance-score {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 30px;
    }

    .compliance-score h3 {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 10px;
    }

    .compliance-score .score {
      font-size: 48px;
      font-weight: 700;
      color: ${complianceScore >= 80 ? '#059669' : complianceScore >= 60 ? '#d97706' : '#dc2626'};
    }

    /* Footer */
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }

    .footer .page-number {
      margin-top: 10px;
    }

    /* Print styles */
    @media print {
      body {
        padding: 0;
      }

      .header {
        background: #2563eb !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .section {
        page-break-inside: avoid;
      }

      table {
        page-break-inside: auto;
      }

      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }

      thead {
        display: table-header-group;
      }

      tbody tr:nth-child(even) {
        background: #f9fafb !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .status-badge {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #9ca3af;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      ${data.qrCodeUrl ? `<img src="${data.qrCodeUrl}" alt="QR" style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px; border-radius: 8px; background: white; padding: 4px;" />` : ''}
      <h1>📋 Raport Situație SSM Completă</h1>
      <div class="subtitle">Securitatea și Sănătatea în Muncă</div>
      <div class="org-info">
        <div><strong>Organizație:</strong> ${data.organization.name}</div>
        ${data.organization.cui ? `<div><strong>CUI:</strong> ${data.organization.cui}</div>` : ''}
        ${data.organization.address ? `<div><strong>Adresă:</strong> ${data.organization.address}</div>` : ''}
        <div><strong>Data raport:</strong> ${today}</div>
      </div>
    </div>

    <!-- Compliance Score -->
    <div class="compliance-score">
      <h3>Scor Conformitate Generală</h3>
      <div class="score">${complianceScore}%</div>
    </div>

    <!-- Section A: Lista angajați -->
    <div class="section">
      <div class="section-header">
        <h2>A. Lista Angajați</h2>
      </div>
      ${data.employees.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Nume Complet</th>
              <th>Funcție</th>
              <th>Data Angajării</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.employees.map(emp => `
              <tr>
                <td>${emp.full_name}</td>
                <td>${emp.job_title || '-'}</td>
                <td>${formatDate(emp.hired_at)}</td>
                <td>${emp.is_active ? '<span class="status-badge valid">Activ</span>' : '<span class="status-badge expired">Inactiv</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="text-align: right; color: #6b7280; font-size: 14px; margin-top: 10px;">
          Total angajați: <strong>${data.employees.length}</strong>
        </div>
      ` : '<div class="empty-state">Nu există angajați înregistrați</div>'}
    </div>

    <!-- Section B: Instruiri -->
    <div class="section">
      <div class="section-header">
        <h2>B. Instruiri SSM</h2>
      </div>
      ${data.trainings.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Angajat</th>
              <th>Tip Instruire</th>
              <th>Data Instruirii</th>
              <th>Data Expirare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.trainings.map(training => {
              const status = training.expiry_date ? getStatusBadge(training.expiry_date) : '<span class="status-badge valid">Valabil</span>'
              return `
                <tr>
                  <td>${training.employee_name}</td>
                  <td>${training.training_type}</td>
                  <td>${formatDate(training.training_date)}</td>
                  <td>${formatDate(training.expiry_date)}</td>
                  <td>${status}</td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există instruiri înregistrate</div>'}
    </div>

    <!-- Section C: Documente Medicale -->
    <div class="section">
      <div class="section-header">
        <h2>C. Fișe Medicale și Aptitudini</h2>
      </div>
      ${data.medicalRecords.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Angajat</th>
              <th>Tip Examinare</th>
              <th>Data Examinare</th>
              <th>Data Expirare</th>
              <th>Rezultat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.medicalRecords.map(record => `
              <tr>
                <td>${record.employee_name}</td>
                <td>${record.examination_type}</td>
                <td>${formatDate(record.examination_date)}</td>
                <td>${formatDate(record.expiry_date)}</td>
                <td>${record.result}</td>
                <td>${getStatusBadge(record.expiry_date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există fișe medicale înregistrate</div>'}
    </div>

    <!-- Section D: Echipamente PSI -->
    <div class="section">
      <div class="section-header">
        <h2>D. Echipamente PSI</h2>
      </div>
      ${data.equipment.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Tip Echipament</th>
              <th>Serie</th>
              <th>Locație</th>
              <th>Ultima Verificare</th>
              <th>Data Expirare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.equipment.map(eq => `
              <tr>
                <td>${eq.equipment_type}</td>
                <td>${eq.serial_number || '-'}</td>
                <td>${eq.location || '-'}</td>
                <td>${formatDate(eq.last_inspection_date)}</td>
                <td>${formatDate(eq.expiry_date)}</td>
                <td>${getStatusBadge(eq.expiry_date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există echipamente PSI înregistrate</div>'}
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>Raport generat automat de platforma <strong>s-s-m.ro</strong></div>
      <div class="page-number">Data generare: ${today}</div>
      <div style="margin-top: 10px; font-size: 11px;">Pentru salvare ca PDF, folosiți funcția Print din browser și selectați "Save as PDF"</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Helper: Calculate compliance score
function calculateComplianceScore(data: SSMReportData): number {
  let totalScore = 0
  let maxScore = 0

  // Employees score (25%)
  maxScore += 25
  if (data.employees.length > 0) {
    const activeEmployees = data.employees.filter(e => e.is_active).length
    totalScore += Math.round((activeEmployees / data.employees.length) * 25)
  }

  // Medical records score (35%)
  maxScore += 35
  if (data.medicalRecords.length > 0) {
    const validRecords = data.medicalRecords.filter(r => {
      const today = new Date()
      const expiry = new Date(r.expiry_date)
      return expiry >= today
    }).length
    totalScore += Math.round((validRecords / data.medicalRecords.length) * 35)
  }

  // Trainings score (25%)
  maxScore += 25
  if (data.trainings.length > 0) {
    const validTrainings = data.trainings.filter(t => {
      if (!t.expiry_date) return true
      const today = new Date()
      const expiry = new Date(t.expiry_date)
      return expiry >= today
    }).length
    totalScore += Math.round((validTrainings / data.trainings.length) * 25)
  }

  // Equipment score (15%)
  maxScore += 15
  if (data.equipment.length > 0) {
    const validEquipment = data.equipment.filter(e => {
      const today = new Date()
      const expiry = new Date(e.expiry_date)
      return expiry >= today && e.is_compliant
    }).length
    totalScore += Math.round((validEquipment / data.equipment.length) * 15)
  }

  return Math.round((totalScore / maxScore) * 100)
}
