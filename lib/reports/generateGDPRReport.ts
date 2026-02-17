// lib/reports/generateGDPRReport.ts
// Generare raport HTML pentru Situație GDPR
// Data: 17 Februarie 2026

interface GDPRDpo {
  name: string | null
  contact: string | null
  anspdcp_notified: boolean
}

interface GDPRProcessingActivity {
  id: string
  activity_name: string
  purpose: string | null
  legal_basis: string | null
  data_categories: string | null
  status: string | null
  dpia_required?: boolean | null
  dpia_completed?: boolean | null
}

interface GDPRConsent {
  id: string
  type: string | null
  status: string | null
  given_at: string | null
  withdrawn_at: string | null
}

interface GDPRReportData {
  organization: {
    name: string
    cui: string | null
    address: string | null
  }
  qrCodeUrl?: string
  dpo: GDPRDpo | null
  processingActivities: GDPRProcessingActivity[]
  consents: GDPRConsent[]
}

export function generateGDPRReport(data: GDPRReportData): string {
  const today = new Date().toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const validLegalBases = ['consimtamant', 'contract', 'obligatie_legala', 'interes_vital', 'interes_public', 'interes_legitim']
  const activitiesWithValidBasis = data.processingActivities.filter(
    (a) => a.legal_basis && validLegalBases.includes(a.legal_basis)
  ).length
  const activeConsents = data.consents.filter((c) => c.status === 'active').length

  const activitiesScore = data.processingActivities.length > 0
    ? Math.round((activitiesWithValidBasis / data.processingActivities.length) * 100)
    : 0
  const consentsScore = data.consents.length > 0
    ? Math.round((activeConsents / data.consents.length) * 100)
    : 0
  const complianceScore = data.processingActivities.length > 0 || data.consents.length > 0
    ? Math.round((activitiesScore + consentsScore) / 2)
    : 0

  const dpiaRequired = data.processingActivities.filter((a) => a.dpia_required).length
  const dpiaCompleted = data.processingActivities.filter((a) => a.dpia_completed).length

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport GDPR - ${data.organization.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background: #ffffff; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; position: relative; }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header .subtitle { font-size: 16px; opacity: 0.9; }
    .header .org-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3); }
    .header .org-info div { margin: 5px 0; font-size: 14px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; }
    .stat-card .label { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .stat-card .value { font-size: 32px; font-weight: 700; color: #1f2937; }
    .compliance-score { background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; border: 1px solid #bbf7d0; }
    .compliance-score h3 { font-size: 16px; color: #6b7280; margin-bottom: 10px; }
    .compliance-score .score { font-size: 48px; font-weight: 700; color: ${complianceScore >= 80 ? '#059669' : complianceScore >= 60 ? '#d97706' : '#dc2626'}; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .section-header { background: #f0fdf4; padding: 15px 20px; border-left: 4px solid #059669; margin-bottom: 20px; border-radius: 4px; }
    .section-header h2 { font-size: 20px; color: #1f2937; font-weight: 600; }
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
    .dpo-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .dpo-card h3 { color: #065f46; margin-bottom: 12px; font-size: 16px; }
    .dpo-card .dpo-detail { display: flex; gap: 8px; margin: 6px 0; font-size: 14px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
    .empty-state { text-align: center; padding: 40px; color: #9ca3af; font-style: italic; }
    @media print {
      body { padding: 0; }
      .header { background: #059669 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
      <h1>🔐 Raport Situație GDPR</h1>
      <div class="subtitle">Protecția Datelor cu Caracter Personal — Regulamentul UE 679/2016</div>
      <div class="org-info">
        <div><strong>Organizație:</strong> ${data.organization.name}</div>
        ${data.organization.cui ? `<div><strong>CUI:</strong> ${data.organization.cui}</div>` : ''}
        ${data.organization.address ? `<div><strong>Adresă:</strong> ${data.organization.address}</div>` : ''}
        <div><strong>Data raport:</strong> ${today}</div>
      </div>
    </div>

    <!-- Compliance Score -->
    <div class="compliance-score">
      <h3>Scor Conformitate GDPR</h3>
      <div class="score">${complianceScore}%</div>
      <div style="color: #6b7280; font-size: 14px; margin-top: 8px;">
        Activități cu bază legală validă: ${activitiesWithValidBasis}/${data.processingActivities.length} &nbsp;|&nbsp;
        Consimțăminte active: ${activeConsents}/${data.consents.length}
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Activități Prelucrare</div>
        <div class="value">${data.processingActivities.length}</div>
      </div>
      <div class="stat-card">
        <div class="label">Consimțăminte</div>
        <div class="value">${data.consents.length}</div>
      </div>
      <div class="stat-card">
        <div class="label">DPIA Necesare</div>
        <div class="value">${dpiaRequired}</div>
      </div>
      <div class="stat-card">
        <div class="label">DPIA Efectuate</div>
        <div class="value">${dpiaCompleted}</div>
      </div>
    </div>

    <!-- DPO Section -->
    <div class="section">
      <div class="section-header">
        <h2>A. Responsabil Protecția Datelor (DPO)</h2>
      </div>
      ${data.dpo ? `
        <div class="dpo-card">
          <h3>Date DPO</h3>
          <div class="dpo-detail"><strong>Nume:</strong> ${data.dpo.name || 'Nespecificat'}</div>
          <div class="dpo-detail"><strong>Contact:</strong> ${data.dpo.contact || 'Nespecificat'}</div>
          <div class="dpo-detail"><strong>Notificat ANSPDCP:</strong>
            ${data.dpo.anspdcp_notified
              ? '<span class="status-badge valid">Da</span>'
              : '<span class="status-badge warning">Nu</span>'}
          </div>
        </div>
      ` : `<div class="empty-state">Nu există date DPO înregistrate</div>`}
    </div>

    <!-- Processing Activities -->
    <div class="section">
      <div class="section-header">
        <h2>B. Activități de Prelucrare</h2>
      </div>
      ${data.processingActivities.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Activitate</th>
              <th>Scop</th>
              <th>Bază Legală</th>
              <th>Categorii Date</th>
              <th>DPIA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.processingActivities.map((a) => `
              <tr>
                <td>${a.activity_name}</td>
                <td>${a.purpose || '-'}</td>
                <td>${a.legal_basis || '<span class="status-badge warning">Lipsă</span>'}</td>
                <td>${a.data_categories || '-'}</td>
                <td>${a.dpia_required
                  ? (a.dpia_completed
                    ? '<span class="status-badge valid">Efectuat</span>'
                    : '<span class="status-badge expired">Necesară</span>')
                  : '<span class="status-badge info">N/A</span>'}
                </td>
                <td>${a.status === 'active' ? '<span class="status-badge valid">Activă</span>'
                  : a.status === 'inactive' ? '<span class="status-badge warning">Inactivă</span>'
                  : `<span class="status-badge info">${a.status || '-'}</span>`}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există activități de prelucrare înregistrate</div>'}
    </div>

    <!-- Consents -->
    <div class="section">
      <div class="section-header">
        <h2>C. Registru Consimțăminte</h2>
      </div>
      ${data.consents.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Tip</th>
              <th>Status</th>
              <th>Data Acordare</th>
              <th>Data Retragere</th>
            </tr>
          </thead>
          <tbody>
            ${data.consents.map((c) => `
              <tr>
                <td>${c.type || '-'}</td>
                <td>${c.status === 'active'
                  ? '<span class="status-badge valid">Activ</span>'
                  : '<span class="status-badge expired">Retras</span>'}
                </td>
                <td>${formatDate(c.given_at)}</td>
                <td>${c.withdrawn_at ? formatDate(c.withdrawn_at) : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="text-align: right; color: #6b7280; font-size: 14px; margin-top: 10px;">
          Total consimțăminte: <strong>${data.consents.length}</strong> | Active: <strong>${activeConsents}</strong> | Retrase: <strong>${data.consents.length - activeConsents}</strong>
        </div>
      ` : '<div class="empty-state">Nu există consimțăminte înregistrate</div>'}
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
