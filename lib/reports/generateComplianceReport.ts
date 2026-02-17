// lib/reports/generateComplianceReport.ts
// Generare raport HTML pentru Conformitate Generală (Killer Report)
// Data: 17 Februarie 2026

interface DomainScore {
  name: string
  label: string
  score: number
  valid: number
  total: number
  available: boolean
}

interface UrgentAction {
  domain: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string | null
}

interface TimelineItem {
  date: string
  description: string
  domain: string
  daysUntil: number
}

interface ComplianceReportData {
  organization: {
    name: string
    cui: string | null
    address: string | null
  }
  qrCodeUrl?: string
  domains: DomainScore[]
  urgentActions: UrgentAction[]
  timeline30: TimelineItem[]
  timeline60: TimelineItem[]
  timeline90: TimelineItem[]
}

export function generateComplianceReport(data: ComplianceReportData): string {
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

  const availableDomains = data.domains.filter((d) => d.available)
  const overallScore = availableDomains.length > 0
    ? Math.round(availableDomains.reduce((sum, d) => sum + d.score, 0) / availableDomains.length)
    : 0

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#059669'
    if (score >= 60) return '#d97706'
    return '#dc2626'
  }

  const getBarColor = (score: number) => {
    if (score >= 80) return '#059669'
    if (score >= 60) return '#d97706'
    return '#dc2626'
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return '<span class="status-badge expired">Urgentă</span>'
    if (priority === 'medium') return '<span class="status-badge warning">Medie</span>'
    return '<span class="status-badge info">Scăzută</span>'
  }

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport Conformitate Generală - ${data.organization.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background: #ffffff; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; position: relative; }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header .subtitle { font-size: 16px; opacity: 0.9; }
    .header .org-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3); }
    .header .org-info div { margin: 5px 0; font-size: 14px; }
    .overall-score-box { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px; }
    .overall-score-box h2 { font-size: 18px; color: #6b7280; margin-bottom: 16px; }
    .overall-score-number { font-size: 72px; font-weight: 800; color: ${getScoreColor(overallScore)}; line-height: 1; }
    .overall-score-label { font-size: 14px; color: #6b7280; margin-top: 8px; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .section-header { background: #eff6ff; padding: 15px 20px; border-left: 4px solid #1e40af; margin-bottom: 20px; border-radius: 4px; }
    .section-header h2 { font-size: 20px; color: #1f2937; font-weight: 600; }
    .domain-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .domain-card { background: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb; }
    .domain-card.unavailable { opacity: 0.5; }
    .domain-card .domain-name { font-weight: 600; font-size: 15px; margin-bottom: 8px; color: #1f2937; }
    .domain-card .domain-stats { font-size: 13px; color: #6b7280; margin-bottom: 10px; }
    .domain-card .bar-track { background: #e5e7eb; border-radius: 4px; height: 12px; overflow: hidden; }
    .domain-card .bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    .domain-card .score-label { text-align: right; font-size: 18px; font-weight: 700; margin-top: 6px; }
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
    .timeline-section { margin-bottom: 20px; }
    .timeline-section h3 { font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
    .timeline-item { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .timeline-item .date { min-width: 100px; font-size: 13px; color: #6b7280; }
    .timeline-item .desc { font-size: 14px; color: #374151; }
    .timeline-item .domain-tag { font-size: 11px; background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 10px; white-space: nowrap; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
    .empty-state { text-align: center; padding: 40px; color: #9ca3af; font-style: italic; }
    @media print {
      body { padding: 0; }
      .header { background: #1e3a5f !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .section { page-break-inside: avoid; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; page-break-after: auto; }
      thead { display: table-header-group; }
      tbody tr:nth-child(even) { background: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .status-badge, .domain-card .bar-fill { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      ${data.qrCodeUrl ? `<img src="${data.qrCodeUrl}" alt="QR" style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px; border-radius: 8px; background: white; padding: 4px;" />` : ''}
      <h1>📊 Raport Conformitate Generală</h1>
      <div class="subtitle">Evaluare completă SSM, PSI, Medical, GDPR, ISCIR, Near-Miss</div>
      <div class="org-info">
        <div><strong>Organizație:</strong> ${data.organization.name}</div>
        ${data.organization.cui ? `<div><strong>CUI:</strong> ${data.organization.cui}</div>` : ''}
        ${data.organization.address ? `<div><strong>Adresă:</strong> ${data.organization.address}</div>` : ''}
        <div><strong>Data raport:</strong> ${today}</div>
      </div>
    </div>

    <!-- Overall Score -->
    <div class="overall-score-box">
      <h2>Scor Conformitate Generală</h2>
      <div class="overall-score-number">${overallScore}%</div>
      <div class="overall-score-label">
        ${overallScore >= 80 ? '✅ Conformitate Bună' : overallScore >= 60 ? '⚠️ Conformitate Parțială — Necesită Îmbunătățiri' : '❌ Conformitate Scăzută — Acțiuni Urgente Necesare'}
      </div>
      <div style="font-size: 13px; color: #9ca3af; margin-top: 8px;">
        Calculat pe baza a ${availableDomains.length} domenii disponibile din ${data.domains.length} totale
      </div>
    </div>

    <!-- Domain Scores -->
    <div class="section">
      <div class="section-header">
        <h2>A. Scoruri per Domeniu</h2>
      </div>
      <div class="domain-grid">
        ${data.domains.map((domain) => `
          <div class="domain-card ${domain.available ? '' : 'unavailable'}">
            <div class="domain-name">${domain.label}</div>
            <div class="domain-stats">
              ${domain.available
                ? `${domain.valid} / ${domain.total} ${domain.total === 1 ? 'element valid' : 'elemente valide'}`
                : 'Modul neactivat'}
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width: ${domain.available ? domain.score : 0}%; background: ${getBarColor(domain.score)};"></div>
            </div>
            <div class="score-label" style="color: ${domain.available ? getScoreColor(domain.score) : '#9ca3af'};">
              ${domain.available ? `${domain.score}%` : 'N/A'}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Top Urgent Actions -->
    <div class="section">
      <div class="section-header">
        <h2>B. Top Acțiuni Urgente</h2>
      </div>
      ${data.urgentActions.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Domeniu</th>
              <th>Acțiune Necesară</th>
              <th>Prioritate</th>
              <th>Termen</th>
            </tr>
          </thead>
          <tbody>
            ${data.urgentActions.slice(0, 10).map((action) => `
              <tr>
                <td>${action.domain}</td>
                <td>${action.description}</td>
                <td>${getPriorityBadge(action.priority)}</td>
                <td>${formatDate(action.dueDate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state" style="color: #059669;">✅ Nu există acțiuni urgente identificate</div>'}
    </div>

    <!-- Timeline -->
    <div class="section">
      <div class="section-header">
        <h2>C. Calendar Expirări Viitoare</h2>
      </div>

      ${data.timeline30.length > 0 ? `
        <div class="timeline-section">
          <h3 style="color: #dc2626;">🔴 Următoarele 30 de zile (${data.timeline30.length} elemente)</h3>
          ${data.timeline30.map((item) => `
            <div class="timeline-item">
              <div class="date">${formatDate(item.date)}</div>
              <div class="desc">${item.description}</div>
              <div class="domain-tag">${item.domain}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.timeline60.length > 0 ? `
        <div class="timeline-section">
          <h3 style="color: #d97706;">🟡 30–60 de zile (${data.timeline60.length} elemente)</h3>
          ${data.timeline60.map((item) => `
            <div class="timeline-item">
              <div class="date">${formatDate(item.date)}</div>
              <div class="desc">${item.description}</div>
              <div class="domain-tag">${item.domain}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.timeline90.length > 0 ? `
        <div class="timeline-section">
          <h3 style="color: #059669;">🟢 60–90 de zile (${data.timeline90.length} elemente)</h3>
          ${data.timeline90.map((item) => `
            <div class="timeline-item">
              <div class="date">${formatDate(item.date)}</div>
              <div class="desc">${item.description}</div>
              <div class="domain-tag">${item.domain}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.timeline30.length === 0 && data.timeline60.length === 0 && data.timeline90.length === 0
        ? '<div class="empty-state">Nu există expirări în următoarele 90 de zile</div>'
        : ''}
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
