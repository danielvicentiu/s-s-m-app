// S-S-M.RO — Email Alert Templates
// Template-uri HTML pentru alertele de expirare

export interface ExpiryItem {
  type: 'medical' | 'psi' | 'iscir'
  identifier: string // nume angajat sau cod echipament
  category: string // tip examinare sau tip echipament
  expiryDate: string
  daysRemaining: number
}

export interface AlertEmailData {
  organizationName: string
  medicalExpiries: ExpiryItem[]
  psiExpiries: ExpiryItem[]
  iscirExpiries: ExpiryItem[]
  dashboardUrl: string
}

/**
 * Returnează culoarea badge-ului bazat pe zilele rămase
 */
function getStatusColor(daysRemaining: number): string {
  if (daysRemaining < 0) return '#dc2626' // red-600 - expirat
  if (daysRemaining <= 30) return '#ea580c' // orange-600 - critic
  if (daysRemaining <= 90) return '#ca8a04' // yellow-600 - atenție
  return '#16a34a' // green-600 - ok
}

/**
 * Returnează label status bazat pe zilele rămase
 */
function getStatusLabel(daysRemaining: number): string {
  if (daysRemaining < 0) return 'EXPIRAT'
  if (daysRemaining === 0) return 'EXPIRĂ AZI'
  if (daysRemaining <= 30) return 'CRITIC'
  if (daysRemaining <= 90) return 'ATENȚIE'
  return 'OK'
}

/**
 * Generează rând tabel pentru un item expirat
 */
function generateTableRow(item: ExpiryItem): string {
  const color = getStatusColor(item.daysRemaining)
  const status = getStatusLabel(item.daysRemaining)

  return `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px 16px; font-size: 14px; color: #374151;">${item.identifier}</td>
      <td style="padding: 12px 16px; font-size: 14px; color: #6b7280;">${item.category}</td>
      <td style="padding: 12px 16px; font-size: 14px; color: #374151;">${item.expiryDate}</td>
      <td style="padding: 12px 16px; text-align: center;">
        <span style="
          display: inline-block;
          padding: 4px 12px;
          background-color: ${color};
          color: white;
          font-size: 12px;
          font-weight: 600;
          border-radius: 9999px;
        ">${status}</span>
      </td>
      <td style="padding: 12px 16px; font-size: 14px; text-align: right; font-weight: 500; color: ${color};">
        ${item.daysRemaining < 0 ? Math.abs(item.daysRemaining) + ' zile depășit' : item.daysRemaining + ' zile'}
      </td>
    </tr>
  `
}

/**
 * Generează secțiune tabel pentru un tip de expirare
 */
function generateSection(title: string, items: ExpiryItem[]): string {
  if (items.length === 0) return ''

  const rows = items.map(item => generateTableRow(item)).join('')

  return `
    <div style="margin-bottom: 32px;">
      <h2 style="
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid #2563eb;
      ">${title}</h2>

      <table style="
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      ">
        <thead style="background-color: #f9fafb;">
          <tr>
            <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
              ${title.includes('Medicale') ? 'Angajat' : 'Identificator'}
            </th>
            <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
              Tip
            </th>
            <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
              Data expirare
            </th>
            <th style="padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
              Status
            </th>
            <th style="padding: 12px 16px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
              Zile rămase
            </th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `
}

/**
 * Generează HTML complet pentru email de alertă expirări
 */
export function generateExpiryAlertHtml(data: AlertEmailData): string {
  const totalExpiries =
    data.medicalExpiries.length +
    data.psiExpiries.length +
    data.iscirExpiries.length

  const medicalSection = generateSection(
    '🏥 Fișe Medicale Expirate/În Expirare',
    data.medicalExpiries
  )
  const psiSection = generateSection(
    '🧯 Echipamente PSI',
    data.psiExpiries
  )
  const iscirSection = generateSection(
    '⚙️ Echipamente ISCIR',
    data.iscirExpiries
  )

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerte Expirări - ${data.organizationName}</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f3f4f6;
">
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">

    <!-- Header -->
    <div style="
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      padding: 32px;
      border-radius: 12px 12px 0 0;
      text-align: center;
    ">
      <div style="
        font-size: 32px;
        font-weight: bold;
        color: white;
        margin-bottom: 8px;
      ">S-S-M.RO</div>
      <div style="
        font-size: 20px;
        color: #dbeafe;
        font-weight: 500;
      ">🔔 Alerte Expirări</div>
    </div>

    <!-- Content -->
    <div style="
      background-color: white;
      padding: 32px;
      border-radius: 0 0 12px 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    ">

      <!-- Intro -->
      <div style="margin-bottom: 32px;">
        <h1 style="
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 12px 0;
        ">Bună ziua,</h1>
        <p style="
          font-size: 16px;
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        ">
          Vă notificăm că organizația <strong>${data.organizationName}</strong>
          are <strong style="color: #dc2626;">${totalExpiries} documente/echipamente</strong>
          expirate sau în curs de expirare care necesită atenție imediată.
        </p>
      </div>

      <!-- Sections -->
      ${medicalSection}
      ${psiSection}
      ${iscirSection}

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <a href="${data.dashboardUrl}" style="
          display: inline-block;
          padding: 14px 32px;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
        ">📊 Vezi Dashboard Complet</a>
      </div>

    </div>

    <!-- Footer -->
    <div style="
      text-align: center;
      padding: 24px;
      color: #6b7280;
      font-size: 14px;
    ">
      <p style="margin: 0 0 8px 0;">
        🤖 Email generat automat de <strong>S-S-M.RO</strong>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        Platformă SSM/PSI digitală pentru consultanți și firme
      </p>
      <p style="margin: 12px 0 0 0; font-size: 12px;">
        <a href="${data.dashboardUrl}" style="color: #2563eb; text-decoration: none;">Dashboard</a>
        &nbsp;•&nbsp;
        <a href="https://s-s-m.ro" style="color: #2563eb; text-decoration: none;">Website</a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim()
}
