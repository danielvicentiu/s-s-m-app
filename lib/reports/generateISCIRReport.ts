// lib/reports/generateISCIRReport.ts
// Generare raport HTML pentru Situație ISCIR
// Data: 17 Februarie 2026

interface ISCIREquipment {
  id: string
  equipment_type: string | null
  registration_number: string | null
  location: string | null
  last_verification_date: string | null
  expiry_date: string | null
  status: string | null
  description?: string | null
}

interface ISCIRVerification {
  id: string
  equipment_id: string | null
  verification_date: string | null
  next_verification_date: string | null
  result: string | null
  verified_by: string | null
  notes?: string | null
}

interface ISCIRReportData {
  organization: {
    name: string
    cui: string | null
    address: string | null
  }
  qrCodeUrl?: string
  equipment: ISCIREquipment[]
  verifications: ISCIRVerification[]
}

export function generateISCIRReport(data: ISCIRReportData): string {
  const today = new Date().toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const todayDate = new Date()

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
    return '<span class="status-badge valid">La zi</span>'
  }

  const expired = data.equipment.filter((eq) => {
    if (!eq.expiry_date) return false
    return new Date(eq.expiry_date) < todayDate
  }).length

  const expiringSoon = data.equipment.filter((eq) => {
    if (!eq.expiry_date) return false
    const expiry = new Date(eq.expiry_date)
    const daysUntil = Math.ceil((expiry.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil >= 0 && daysUntil <= 30
  }).length

  const valid = data.equipment.filter((eq) => {
    if (!eq.expiry_date) return false
    const expiry = new Date(eq.expiry_date)
    const daysUntil = Math.ceil((expiry.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil > 30
  }).length

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport ISCIR - ${data.organization.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background: #ffffff; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; position: relative; }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header .subtitle { font-size: 16px; opacity: 0.9; }
    .header .org-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3); }
    .header .org-info div { margin: 5px 0; font-size: 14px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #4f46e5; }
    .stat-card .label { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .stat-card .value { font-size: 32px; font-weight: 700; color: #1f2937; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .section-header { background: #eef2ff; padding: 15px 20px; border-left: 4px solid #4f46e5; margin-bottom: 20px; border-radius: 4px; }
    .section-header h2 { font-size: 20px; color: #1f2937; font-weight: 600; }
    .alert-box { background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .alert-box h3 { color: #991b1b; margin-bottom: 8px; }
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
      .header { background: #4f46e5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
      <h1>⚙️ Raport Situație ISCIR</h1>
      <div class="subtitle">Inspecția de Stat pentru Controlul Cazanelor, Recipientelor sub Presiune și Instalațiilor de Ridicat</div>
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
        <div class="label">Total Echipamente</div>
        <div class="value">${data.equipment.length}</div>
      </div>
      <div class="stat-card">
        <div class="label">Verificări Efectuate</div>
        <div class="value">${data.verifications.length}</div>
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
        <div class="label">La Zi</div>
        <div class="value" style="color: #059669;">${valid}</div>
      </div>
    </div>

    ${expired + expiringSoon > 0 ? `
      <div class="alert-box">
        <h3>⚠️ Atenție Necesară</h3>
        <p>${expired > 0 ? `<strong>${expired} echipamente expirate</strong> necesită reverificare urgentă. ` : ''}
        ${expiringSoon > 0 ? `<strong>${expiringSoon} echipamente</strong> expiră în următoarele 30 de zile.` : ''}</p>
      </div>
    ` : ''}

    <!-- Equipment Inventory -->
    <div class="section">
      <div class="section-header">
        <h2>A. Inventar Echipamente sub Presiune / ISCIR</h2>
      </div>
      ${data.equipment.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Tip Echipament</th>
              <th>Nr. Înregistrare</th>
              <th>Locație</th>
              <th>Ultima Verificare</th>
              <th>Dată Expirare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.equipment.map((eq) => `
              <tr>
                <td>${eq.equipment_type || '-'}</td>
                <td>${eq.registration_number || '-'}</td>
                <td>${eq.location || '-'}</td>
                <td>${formatDate(eq.last_verification_date)}</td>
                <td>${formatDate(eq.expiry_date)}</td>
                <td>${getStatusBadge(eq.expiry_date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există echipamente ISCIR înregistrate</div>'}
    </div>

    <!-- Verifications -->
    <div class="section">
      <div class="section-header">
        <h2>B. Verificări Periodice Efectuate</h2>
      </div>
      ${data.verifications.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Data Verificare</th>
              <th>Verificator</th>
              <th>Rezultat</th>
              <th>Următoarea Verificare</th>
              <th>Observații</th>
            </tr>
          </thead>
          <tbody>
            ${data.verifications.map((v) => `
              <tr>
                <td>${formatDate(v.verification_date)}</td>
                <td>${v.verified_by || '-'}</td>
                <td>${v.result === 'conform' || v.result === 'passed'
                  ? '<span class="status-badge valid">Conform</span>'
                  : v.result === 'neconform' || v.result === 'failed'
                  ? '<span class="status-badge expired">Neconform</span>'
                  : `<span class="status-badge info">${v.result || '-'}</span>`}
                </td>
                <td>${formatDate(v.next_verification_date)}</td>
                <td>${v.notes || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există verificări înregistrate</div>'}
    </div>

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
