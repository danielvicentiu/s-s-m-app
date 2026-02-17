// lib/reports/generateMedicalReport.ts
// Generare raport HTML pentru Situație Medicală
// Data: 17 Februarie 2026

interface MedicalExaminationEntry {
  id: string
  employee_name: string
  employee_id: string | null
  examination_type: string | null
  examination_date: string | null
  expiry_date: string | null
  result: string | null
}

interface EmployeeEntry {
  id: string
  full_name: string
}

interface MedicalReportData {
  organization: {
    name: string
    cui: string | null
    address: string | null
  }
  qrCodeUrl?: string
  examinations: MedicalExaminationEntry[]
  employees: EmployeeEntry[]
}

const RESULT_LABELS: Record<string, string> = {
  apt: 'Apt',
  apt_conditionat: 'Apt Condiționat',
  inapt_temporar: 'Inapt Temporar',
  inapt: 'Inapt',
  in_asteptare: 'În Așteptare',
}

const EXAMINATION_TYPE_LABELS: Record<string, string> = {
  periodic: 'Periodic',
  angajare: 'La Angajare',
  reluare: 'La Reluare',
  la_cerere: 'La Cerere',
  supraveghere: 'Supraveghere',
  fisa_aptitudine: 'Fișă Aptitudine',
  fisa_psihologica: 'Fișă Psihologică',
  control_periodic: 'Control Periodic',
  control_angajare: 'Control Angajare',
  control_reluare: 'Control Reluare',
  vaccinare: 'Vaccinare',
  altul: 'Alt Tip',
}

export function generateMedicalReport(data: MedicalReportData): string {
  const today = new Date().toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getStatusBadge = (expiryDate: string | null): string => {
    if (!expiryDate) return '<span class="status-badge info">N/A</span>'
    const expiry = new Date(expiryDate)
    const daysUntil = Math.ceil((expiry.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntil < 0) return '<span class="status-badge expired">Expirat</span>'
    if (daysUntil <= 30) return `<span class="status-badge warning">Expiră în ${daysUntil} zile</span>`
    return '<span class="status-badge valid">Valid</span>'
  }

  const getResultBadge = (result: string | null): string => {
    if (!result) return '-'
    const label = RESULT_LABELS[result] || result
    if (result === 'apt') return `<span class="status-badge valid">${label}</span>`
    if (result === 'apt_conditionat') return `<span class="status-badge warning">${label}</span>`
    if (result === 'inapt' || result === 'inapt_temporar') return `<span class="status-badge expired">${label}</span>`
    return `<span class="status-badge info">${label}</span>`
  }

  const valid = data.examinations.filter((e) => {
    if (!e.expiry_date) return false
    const expiry = new Date(e.expiry_date)
    return expiry >= todayDate
  }).length

  const expired = data.examinations.filter((e) => {
    if (!e.expiry_date) return false
    const expiry = new Date(e.expiry_date)
    return expiry < todayDate
  }).length

  const expiringSoon = data.examinations.filter((e) => {
    if (!e.expiry_date) return false
    const expiry = new Date(e.expiry_date)
    const daysUntil = Math.ceil((expiry.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil >= 0 && daysUntil <= 30
  }).length

  // Employees without medical record
  const employeesWithExamination = new Set(
    data.examinations.map((e) => e.employee_id).filter(Boolean)
  )
  const employeesWithoutMedical = data.employees.filter(
    (emp) => !employeesWithExamination.has(emp.id)
  )

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport Medical - ${data.organization.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background: #ffffff; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; position: relative; }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header .subtitle { font-size: 16px; opacity: 0.9; }
    .header .org-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3); }
    .header .org-info div { margin: 5px 0; font-size: 14px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #0d9488; }
    .stat-card .label { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .stat-card .value { font-size: 32px; font-weight: 700; color: #1f2937; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .section-header { background: #f0fdfa; padding: 15px 20px; border-left: 4px solid #0d9488; margin-bottom: 20px; border-radius: 4px; }
    .section-header h2 { font-size: 20px; color: #1f2937; font-weight: 600; }
    .warning-box { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .warning-box h3 { color: #92400e; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    thead { background: #f9fafb; border-bottom: 2px solid #e5e7eb; }
    thead th { padding: 12px 16px; text-align: left; font-weight: 600; font-size: 13px; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #f3f4f6; }
    tbody tr:nth-child(even) { background: #f9fafb; }
    tbody td { padding: 12px 16px; font-size: 14px; color: #4b5563; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.valid { background: #d1fae5; color: #065f46; }
    .status-badge.warning { background: #fef3c7; color: #92400e; }
    .status-badge.expired { background: #fee2e2; color: #991b1b; }
    .status-badge.info { background: #dbeafe; color: #1e40af; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
    .empty-state { text-align: center; padding: 40px; color: #9ca3af; font-style: italic; }
    @media print {
      body { padding: 0; }
      .header { background: #0d9488 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .section { page-break-inside: avoid; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; page-break-after: auto; }
      thead { display: table-header-group; }
      tbody tr:nth-child(even) { background: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .status-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      ${data.qrCodeUrl ? `<img src="${data.qrCodeUrl}" alt="QR" style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px; border-radius: 8px; background: white; padding: 4px;" />` : ''}
      <h1>🏥 Raport Situație Medicală</h1>
      <div class="subtitle">Fișe de Aptitudine și Examene Medicale Angajați</div>
      <div class="org-info">
        <div><strong>Organizație:</strong> ${data.organization.name}</div>
        ${data.organization.cui ? `<div><strong>CUI:</strong> ${data.organization.cui}</div>` : ''}
        ${data.organization.address ? `<div><strong>Adresă:</strong> ${data.organization.address}</div>` : ''}
        <div><strong>Data raport:</strong> ${today}</div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Total Fișe</div>
        <div class="value">${data.examinations.length}</div>
      </div>
      <div class="stat-card">
        <div class="label">Valide</div>
        <div class="value" style="color: #059669;">${valid}</div>
      </div>
      <div class="stat-card">
        <div class="label">Expirate</div>
        <div class="value" style="color: #dc2626;">${expired}</div>
      </div>
      <div class="stat-card">
        <div class="label">Expiră în 30 Zile</div>
        <div class="value" style="color: #d97706;">${expiringSoon}</div>
      </div>
      <div class="stat-card">
        <div class="label">Fără Fișă</div>
        <div class="value" style="color: #7c3aed;">${employeesWithoutMedical.length}</div>
      </div>
    </div>

    ${employeesWithoutMedical.length > 0 ? `
      <div class="warning-box">
        <h3>⚠️ Angajați fără fișă medicală (${employeesWithoutMedical.length})</h3>
        <p>Următorii angajați nu au o fișă medicală înregistrată în sistem și necesită examinare urgentă.</p>
      </div>
    ` : ''}

    <!-- Examinations Table -->
    <div class="section">
      <div class="section-header">
        <h2>A. Situație Fișe Medicale per Angajat</h2>
      </div>
      ${data.examinations.length > 0 ? `
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
            ${data.examinations.map((e) => `
              <tr>
                <td>${e.employee_name}</td>
                <td>${EXAMINATION_TYPE_LABELS[e.examination_type || ''] || e.examination_type || '-'}</td>
                <td>${formatDate(e.examination_date)}</td>
                <td>${formatDate(e.expiry_date)}</td>
                <td>${getResultBadge(e.result)}</td>
                <td>${getStatusBadge(e.expiry_date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există fișe medicale înregistrate</div>'}
    </div>

    <!-- Employees without medical record -->
    ${employeesWithoutMedical.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <h2>B. Angajați FĂRĂ Fișă Medicală</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nume Angajat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${employeesWithoutMedical.map((emp) => `
              <tr>
                <td>${emp.full_name}</td>
                <td><span class="status-badge expired">Fișă Lipsă</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : `
      <div class="section">
        <div class="section-header"><h2>B. Angajați FĂRĂ Fișă Medicală</h2></div>
        <div class="empty-state" style="color: #059669;">✅ Toți angajații au fișe medicale înregistrate</div>
      </div>
    `}

    <!-- Footer -->
    <div class="footer">
      <div>Raport generat automat de platforma <strong>s-s-m.ro</strong></div>
      <div style="margin-top: 10px;">Data generare: ${today}</div>
      <div style="margin-top: 10px; font-size: 11px;">Pentru salvare ca PDF, folosiți funcția Print din browser și selectați "Save as PDF"</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}
