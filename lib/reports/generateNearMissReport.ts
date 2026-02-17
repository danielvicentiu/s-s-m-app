// lib/reports/generateNearMissReport.ts
// Generare raport HTML pentru Incidente Near-Miss
// Data: 17 Februarie 2026

interface NearMissIncident {
  id: string
  report_date: string | null
  location: string | null
  category: string | null
  severity: string | null
  status: string | null
  corrective_actions: string | null
  description?: string | null
}

interface NearMissReportData {
  organization: {
    name: string
    cui: string | null
    address: string | null
  }
  qrCodeUrl?: string
  incidents: NearMissIncident[]
  incidentsLastMonth?: NearMissIncident[]
}

const SEVERITY_LABELS: Record<string, string> = {
  minor: 'Minor',
  moderate: 'Moderat',
  major: 'Major',
  critical: 'Critic',
  fatal: 'Fatal',
}

const SEVERITY_COLORS: Record<string, string> = {
  minor: 'background: #d1fae5; color: #065f46;',
  moderate: 'background: #fef3c7; color: #92400e;',
  major: 'background: #fed7aa; color: #9a3412;',
  critical: 'background: #fee2e2; color: #991b1b;',
  fatal: 'background: #7f1d1d; color: white;',
}

export function generateNearMissReport(data: NearMissReportData): string {
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

  const totalIncidents = data.incidents.length
  const openIncidents = data.incidents.filter((i) => i.status !== 'closed' && i.status !== 'inchis').length
  const closedIncidents = totalIncidents - openIncidents

  // Per severity counts
  const severityCounts: Record<string, number> = {}
  for (const inc of data.incidents) {
    const sev = inc.severity || 'necunoscut'
    severityCounts[sev] = (severityCounts[sev] || 0) + 1
  }

  // Top categories
  const categoryCounts: Record<string, number> = {}
  for (const inc of data.incidents) {
    const cat = inc.category || 'Necategorizat'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  }
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Trend
  const currentMonthCount = data.incidents.filter((i) => {
    if (!i.report_date) return false
    const d = new Date(i.report_date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const lastMonthCount = data.incidentsLastMonth?.length ?? 0

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport Near-Miss - ${data.organization.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background: #ffffff; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; position: relative; }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header .subtitle { font-size: 16px; opacity: 0.9; }
    .header .org-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3); }
    .header .org-info div { margin: 5px 0; font-size: 14px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #d97706; }
    .stat-card .label { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .stat-card .value { font-size: 32px; font-weight: 700; color: #1f2937; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .section-header { background: #fffbeb; padding: 15px 20px; border-left: 4px solid #d97706; margin-bottom: 20px; border-radius: 4px; }
    .section-header h2 { font-size: 20px; color: #1f2937; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    thead { background: #f9fafb; border-bottom: 2px solid #e5e7eb; }
    thead th { padding: 12px 16px; text-align: left; font-weight: 600; font-size: 13px; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #f3f4f6; }
    tbody tr:nth-child(even) { background: #f9fafb; }
    tbody td { padding: 12px 16px; font-size: 14px; color: #4b5563; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.open { background: #fef3c7; color: #92400e; }
    .status-badge.closed { background: #d1fae5; color: #065f46; }
    .trend-box { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .category-bar { display: flex; align-items: center; gap: 10px; margin: 8px 0; }
    .category-bar .bar-label { width: 200px; font-size: 14px; color: #374151; }
    .category-bar .bar-fill { height: 20px; background: #d97706; border-radius: 4px; min-width: 4px; }
    .category-bar .bar-count { font-size: 14px; color: #6b7280; font-weight: 600; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
    .empty-state { text-align: center; padding: 40px; color: #9ca3af; font-style: italic; }
    @media print {
      body { padding: 0; }
      .header { background: #d97706 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
      <h1>⚠️ Raport Incidente Near-Miss</h1>
      <div class="subtitle">Evenimente Periculoase și Aproape-Accidente</div>
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
        <div class="label">Total Incidente</div>
        <div class="value">${totalIncidents}</div>
      </div>
      <div class="stat-card">
        <div class="label">Deschise</div>
        <div class="value">${openIncidents}</div>
      </div>
      <div class="stat-card">
        <div class="label">Închise</div>
        <div class="value">${closedIncidents}</div>
      </div>
      <div class="stat-card">
        <div class="label">Luna Curentă</div>
        <div class="value">${currentMonthCount}</div>
      </div>
    </div>

    <!-- Trend -->
    <div class="section">
      <div class="section-header">
        <h2>A. Trend Incidente</h2>
      </div>
      <div class="trend-box">
        <strong>Luna curentă:</strong> ${currentMonthCount} incidente &nbsp;|&nbsp;
        <strong>Luna anterioară:</strong> ${lastMonthCount} incidente &nbsp;|&nbsp;
        <strong>Tendință:</strong>
        ${currentMonthCount > lastMonthCount
          ? `<span style="color: #dc2626;">↑ Creștere cu ${currentMonthCount - lastMonthCount} incidente</span>`
          : currentMonthCount < lastMonthCount
          ? `<span style="color: #059669;">↓ Scădere cu ${lastMonthCount - currentMonthCount} incidente</span>`
          : '<span style="color: #6b7280;">= Stabil</span>'}
      </div>
    </div>

    <!-- Severity Distribution -->
    <div class="section">
      <div class="section-header">
        <h2>B. Distribuție pe Severitate</h2>
      </div>
      ${Object.keys(severityCounts).length > 0 ? `
        <table>
          <thead><tr><th>Severitate</th><th>Număr Incidente</th><th>Procent</th></tr></thead>
          <tbody>
            ${Object.entries(severityCounts).map(([sev, count]) => `
              <tr>
                <td><span class="status-badge" style="${SEVERITY_COLORS[sev] || 'background:#f3f4f6;color:#374151;'}">${SEVERITY_LABELS[sev] || sev}</span></td>
                <td>${count}</td>
                <td>${totalIncidents > 0 ? Math.round((count / totalIncidents) * 100) : 0}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există date de severitate</div>'}
    </div>

    <!-- Incidents Table -->
    <div class="section">
      <div class="section-header">
        <h2>C. Tabel Incidente</h2>
      </div>
      ${data.incidents.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Data</th>
              <th>Locație</th>
              <th>Categorie</th>
              <th>Severitate</th>
              <th>Status</th>
              <th>Acțiuni Corective</th>
            </tr>
          </thead>
          <tbody>
            ${data.incidents.map((inc, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${formatDate(inc.report_date)}</td>
                <td>${inc.location || '-'}</td>
                <td>${inc.category || '-'}</td>
                <td><span class="status-badge" style="${SEVERITY_COLORS[inc.severity || ''] || 'background:#f3f4f6;color:#374151;'}">${SEVERITY_LABELS[inc.severity || ''] || inc.severity || '-'}</span></td>
                <td>${inc.status === 'closed' || inc.status === 'inchis'
                  ? '<span class="status-badge closed">Închis</span>'
                  : '<span class="status-badge open">Deschis</span>'}
                </td>
                <td style="max-width: 200px; white-space: normal;">${inc.corrective_actions || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există incidente înregistrate</div>'}
    </div>

    <!-- Top Categories -->
    <div class="section">
      <div class="section-header">
        <h2>D. Top Categorii Incidente</h2>
      </div>
      ${topCategories.length > 0 ? `
        <div style="padding: 10px;">
          ${topCategories.map(([cat, count]) => `
            <div class="category-bar">
              <div class="bar-label">${cat}</div>
              <div class="bar-fill" style="width: ${totalIncidents > 0 ? Math.max(20, Math.round((count / totalIncidents) * 400)) : 20}px;"></div>
              <div class="bar-count">${count} (${totalIncidents > 0 ? Math.round((count / totalIncidents) * 100) : 0}%)</div>
            </div>
          `).join('')}
        </div>
      ` : '<div class="empty-state">Nu există date de categorizare</div>'}
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
