// lib/reports/generateITMSimulationReport.ts
// Generare raport HTML pentru Simulare Control ITM
// Data: 17 Februarie 2026

interface ChecklistItem {
  label: string
  passed: boolean
  details: string
  legalRef?: string
}

interface ITMSimulationData {
  organization: {
    name: string
    cui: string | null
    address: string | null
    employee_count: number
  }
  qrCodeUrl?: string
  companySize: 'micro' | 'small' | 'medium' | 'large'
  checklistItems: ChecklistItem[]
  recommendations: string[]
}

const COMPANY_SIZE_LABELS: Record<string, string> = {
  micro: 'Microîntreprindere (1–9 angajați)',
  small: 'Întreprindere Mică (10–49 angajați)',
  medium: 'Întreprindere Mijlocie (50–249 angajați)',
  large: 'Întreprindere Mare (250+ angajați)',
}

export function generateITMSimulationReport(data: ITMSimulationData): string {
  const today = new Date().toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const passedItems = data.checklistItems.filter((i) => i.passed).length
  const totalItems = data.checklistItems.length
  const score = totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0

  const verdict = score >= 80 ? 'PREGĂTIT' : score >= 50 ? 'RISC MEDIU' : 'RISC RIDICAT'
  const verdictColor = score >= 80 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626'
  const verdictBg = score >= 80 ? '#d1fae5' : score >= 50 ? '#fef3c7' : '#fee2e2'

  // Fine estimation based on L319/2006
  const failedCount = totalItems - passedItems
  const minFine = failedCount * 2000
  const maxFine = failedCount * 20000

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulare Control ITM - ${data.organization.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background: #ffffff; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; position: relative; }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header h2 { font-size: 18px; opacity: 0.9; font-weight: 400; margin-top: 4px; }
    .header .subtitle { font-size: 16px; opacity: 0.9; }
    .header .org-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3); }
    .header .org-info div { margin: 5px 0; font-size: 14px; }
    .verdict-box { border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px; border: 3px solid ${verdictColor}; background: ${verdictBg}; }
    .verdict-box .verdict-label { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .verdict-box .verdict-value { font-size: 42px; font-weight: 800; color: ${verdictColor}; }
    .verdict-box .verdict-score { font-size: 18px; color: ${verdictColor}; font-weight: 600; margin-top: 4px; }
    .verdict-box .verdict-stats { font-size: 14px; color: #6b7280; margin-top: 8px; }
    .company-info { background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px; display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
    .company-info .tag { background: #dbeafe; color: #1e40af; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .section-header { background: #fef2f2; padding: 15px 20px; border-left: 4px solid #991b1b; margin-bottom: 20px; border-radius: 4px; }
    .section-header h2 { font-size: 20px; color: #1f2937; font-weight: 600; }
    .checklist-item { display: flex; gap: 16px; align-items: flex-start; padding: 14px 16px; border-bottom: 1px solid #f3f4f6; }
    .checklist-item:nth-child(even) { background: #f9fafb; }
    .checklist-item .icon { font-size: 20px; min-width: 28px; text-align: center; }
    .checklist-item .content { flex: 1; }
    .checklist-item .item-label { font-weight: 600; font-size: 14px; color: #1f2937; }
    .checklist-item .item-details { font-size: 13px; color: #6b7280; margin-top: 3px; }
    .checklist-item .item-legal { font-size: 11px; color: #9ca3af; margin-top: 2px; font-style: italic; }
    .fine-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .fine-box h3 { color: #9a3412; margin-bottom: 12px; font-size: 16px; }
    .fine-range { font-size: 28px; font-weight: 700; color: #9a3412; }
    .recommendations-list { list-style: none; padding: 0; }
    .recommendations-list li { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
    .recommendations-list li::before { content: "→"; color: #991b1b; font-weight: 700; min-width: 20px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
    .empty-state { text-align: center; padding: 40px; color: #9ca3af; font-style: italic; }
    @media print {
      body { padding: 0; }
      .header { background: #991b1b !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .section { page-break-inside: avoid; }
      .verdict-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .checklist-item:nth-child(even) { background: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      ${data.qrCodeUrl ? `<img src="${data.qrCodeUrl}" alt="QR" style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px; border-radius: 8px; background: white; padding: 4px;" />` : ''}
      <h1>🏛️ SIMULARE CONTROL ITM</h1>
      <h2>Inspecția Muncii — L319/2006 + HG1425/2006</h2>
      <div class="subtitle">Simulare audit intern conformitate SSM</div>
      <div class="org-info">
        <div><strong>Organizație:</strong> ${data.organization.name}</div>
        ${data.organization.cui ? `<div><strong>CUI:</strong> ${data.organization.cui}</div>` : ''}
        ${data.organization.address ? `<div><strong>Adresă:</strong> ${data.organization.address}</div>` : ''}
        <div><strong>Nr. Angajați:</strong> ${data.organization.employee_count}</div>
        <div><strong>Data simulare:</strong> ${today}</div>
      </div>
    </div>

    <!-- Company Classification -->
    <div class="company-info">
      <strong style="font-size: 14px; color: #374151;">Clasificare:</strong>
      <span class="tag">${COMPANY_SIZE_LABELS[data.companySize] || data.companySize}</span>
    </div>

    <!-- Verdict -->
    <div class="verdict-box">
      <div class="verdict-label">Verdict Simulare ITM</div>
      <div class="verdict-value">${verdict}</div>
      <div class="verdict-score">${score}% Conformitate</div>
      <div class="verdict-stats">${passedItems} / ${totalItems} puncte îndeplinite</div>
    </div>

    <!-- Checklist -->
    <div class="section">
      <div class="section-header">
        <h2>A. Listă Verificare Conformitate (L319/2006)</h2>
      </div>
      ${data.checklistItems.length > 0 ? `
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          ${data.checklistItems.map((item) => `
            <div class="checklist-item">
              <div class="icon">${item.passed ? '✅' : '❌'}</div>
              <div class="content">
                <div class="item-label">${item.label}</div>
                <div class="item-details">${item.details}</div>
                ${item.legalRef ? `<div class="item-legal">${item.legalRef}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <div style="text-align: right; padding: 12px 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; font-size: 14px;">
          Punctaj: <strong>${passedItems}/${totalItems}</strong> &nbsp;|&nbsp; Scor: <strong style="color: ${verdictColor};">${score}%</strong>
        </div>
      ` : '<div class="empty-state">Nu există date suficiente pentru evaluare</div>'}
    </div>

    <!-- Fine Estimation -->
    <div class="section">
      <div class="section-header">
        <h2>B. Estimare Sancțiuni Potențiale</h2>
      </div>
      <div class="fine-box">
        <h3>💰 Interval Amenzi Potențiale (L319/2006, Art. 39-40)</h3>
        ${failedCount > 0 ? `
          <div class="fine-range">${minFine.toLocaleString('ro-RO')} – ${maxFine.toLocaleString('ro-RO')} RON</div>
          <p style="font-size: 13px; color: #9a3412; margin-top: 8px;">
            Estimare bazată pe ${failedCount} ${failedCount === 1 ? 'neconformitate' : 'neconformități'} identificate.
            Amenzile reale variază în funcție de gravitate și circumstanțe.
          </p>
          <p style="font-size: 12px; color: #b45309; margin-top: 6px;">
            ⚠️ Aceasta este o estimare orientativă, nu o evaluare juridică. Consultați un specialist SSM.
          </p>
        ` : `
          <div style="color: #059669; font-size: 18px; font-weight: 600;">✅ Nicio neconformitate identificată — risc minim de sancțiuni</div>
        `}
      </div>
    </div>

    <!-- Recommendations -->
    <div class="section">
      <div class="section-header">
        <h2>C. Recomandări Prioritare</h2>
      </div>
      ${data.recommendations.length > 0 ? `
        <ul class="recommendations-list">
          ${data.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
        </ul>
      ` : '<div class="empty-state" style="color: #059669;">✅ Nu există recomandări — organizația este conformă</div>'}
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>Raport generat automat de platforma <strong>s-s-m.ro</strong></div>
      <div style="margin-top: 10px;">Data generare: ${today}</div>
      <div style="margin-top: 10px; font-size: 11px;">
        AVERTISMENT: Aceasta este o simulare internă, nu un audit oficial. Rezultatele nu înlocuiesc
        o inspecție reală ITM sau consultanța unui specialist SSM autorizat.
      </div>
      <div style="margin-top: 6px; font-size: 11px;">Pentru salvare ca PDF, folosiți funcția Print din browser și selectați "Save as PDF"</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}
