// lib/reports/generatePSIReport.ts
// Generare raport HTML pentru Situație PSI Completă
// Data: 17 Februarie 2026

import { PSIEquipment, PSIInspection, PSI_EQUIPMENT_TYPE_LABELS } from '@/lib/types'

interface PSIReportData {
  organization: {
    name: string
    cui: string | null
    address: string | null
  }
  qrCodeUrl?: string
  equipment: PSIEquipment[]
  inspections: PSIInspection[]
  alerts: Array<{
    id: string
    equipment_type: string
    identifier: string
    location: string | null
    next_inspection_date: string
    days_until_due: number
    alert_level: string
  }>
}

export function generatePSIReport(data: PSIReportData): string {
  const today = new Date().toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  // Helper to format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Helper to get alert badge
  const getAlertBadge = (daysUntil: number): string => {
    if (daysUntil < 0) {
      return '<span class="status-badge expired">Expirat</span>'
    } else if (daysUntil <= 30) {
      return '<span class="status-badge critical">Critic (' + daysUntil + ' zile)</span>'
    } else if (daysUntil <= 60) {
      return '<span class="status-badge warning">Atenție (' + daysUntil + ' zile)</span>'
    } else {
      return '<span class="status-badge valid">La zi</span>'
    }
  }

  // Calculate stats
  const totalEquipment = data.equipment.length
  const expiredEquipment = data.equipment.filter(eq => {
    if (!eq.next_inspection_date) return false
    const today = new Date()
    const nextInspection = new Date(eq.next_inspection_date)
    return nextInspection < today
  }).length

  const activeAlerts = data.alerts.filter(a => a.days_until_due <= 30).length

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport PSI - ${data.organization.name}</title>
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
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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

    /* Stats Cards */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #dc2626;
    }

    .stat-card .label {
      font-size: 13px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .stat-card .value {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
    }

    /* Section */
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .section-header {
      background: #fef2f2;
      padding: 15px 20px;
      border-left: 4px solid #dc2626;
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

    .status-badge.warning {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.critical {
      background: #fed7aa;
      color: #9a3412;
    }

    .status-badge.expired {
      background: #fee2e2;
      color: #991b1b;
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
        background: #dc2626 !important;
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
      <h1>🔥 Raport Situație PSI Completă</h1>
      <div class="subtitle">Prevenirea și Stingerea Incendiilor</div>
      <div class="org-info">
        <div><strong>Organizație:</strong> ${data.organization.name}</div>
        ${data.organization.cui ? `<div><strong>CUI:</strong> ${data.organization.cui}</div>` : ''}
        ${data.organization.address ? `<div><strong>Adresă:</strong> ${data.organization.address}</div>` : ''}
        <div><strong>Data raport:</strong> ${today}</div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Total Echipamente</div>
        <div class="value">${totalEquipment}</div>
      </div>
      <div class="stat-card">
        <div class="label">Echipamente Expirate</div>
        <div class="value">${expiredEquipment}</div>
      </div>
      <div class="stat-card">
        <div class="label">Alerte Active</div>
        <div class="value">${activeAlerts}</div>
      </div>
    </div>

    <!-- Section: Echipamente PSI -->
    <div class="section">
      <div class="section-header">
        <h2>Echipamente PSI</h2>
      </div>
      ${data.equipment.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Tip Echipament</th>
              <th>Identificator</th>
              <th>Locație</th>
              <th>Producător</th>
              <th>Model</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.equipment.map(eq => {
              const equipmentTypeLabel = PSI_EQUIPMENT_TYPE_LABELS[eq.equipment_type as keyof typeof PSI_EQUIPMENT_TYPE_LABELS] || eq.equipment_type
              return `
                <tr>
                  <td>${equipmentTypeLabel}</td>
                  <td>${eq.identifier}</td>
                  <td>${eq.location || '-'}</td>
                  <td>${eq.manufacturer || '-'}</td>
                  <td>${eq.model || '-'}</td>
                  <td>${eq.status === 'operational' ? '<span class="status-badge valid">Operațional</span>' : '<span class="status-badge warning">Necesită intervenție</span>'}</td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există echipamente PSI înregistrate</div>'}
    </div>

    <!-- Section: Verificări și Inspecții -->
    <div class="section">
      <div class="section-header">
        <h2>Verificări și Inspecții</h2>
      </div>
      ${data.inspections.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Echipament</th>
              <th>Data Inspecție</th>
              <th>Inspector</th>
              <th>Licență</th>
              <th>Rezultat</th>
              <th>Următoarea Inspecție</th>
            </tr>
          </thead>
          <tbody>
            ${data.inspections.map(inspection => {
              const equipmentId = inspection.psi_equipment?.identifier || 'N/A'
              return `
                <tr>
                  <td>${equipmentId}</td>
                  <td>${formatDate(inspection.inspection_date)}</td>
                  <td>${inspection.inspector_name}</td>
                  <td>${inspection.inspector_license || '-'}</td>
                  <td>${inspection.result === 'conform' ? '<span class="status-badge valid">Conform</span>' : inspection.result === 'conform_cu_observatii' ? '<span class="status-badge warning">Cu observații</span>' : '<span class="status-badge expired">Neconform</span>'}</td>
                  <td>${formatDate(inspection.next_inspection_date)}</td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există inspecții înregistrate</div>'}
    </div>

    <!-- Section: Alerte Active -->
    <div class="section">
      <div class="section-header">
        <h2>Alerte Active</h2>
      </div>
      ${data.alerts.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Tip Echipament</th>
              <th>Identificator</th>
              <th>Locație</th>
              <th>Următoarea Inspecție</th>
              <th>Nivel Alertă</th>
            </tr>
          </thead>
          <tbody>
            ${data.alerts.map(alert => `
              <tr>
                <td>${alert.equipment_type}</td>
                <td>${alert.identifier}</td>
                <td>${alert.location || '-'}</td>
                <td>${formatDate(alert.next_inspection_date)}</td>
                <td>${getAlertBadge(alert.days_until_due)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<div class="empty-state">Nu există alerte active</div>'}
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
