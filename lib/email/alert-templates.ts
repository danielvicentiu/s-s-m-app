/**
 * lib/email/alert-templates.ts
 * Template-uri HTML responsive pentru emailuri de alertă
 * Design: simplu, profesional, compatible email clients
 */

export interface AlertEmailData {
  recipientName: string;
  alertType: 'medical' | 'equipment' | 'training' | 'document' | 'other';
  alertTitle: string;
  alertDescription: string;
  expiryDate?: string;
  employeeName?: string;
  itemName?: string;
  organizationName: string;
  dashboardUrl: string;
}

/**
 * Generează HTML responsive pentru email de alertă
 */
export function generateAlertEmailHtml(data: AlertEmailData): string {
  const {
    recipientName,
    alertType,
    alertTitle,
    alertDescription,
    expiryDate,
    employeeName,
    itemName,
    organizationName,
    dashboardUrl,
  } = data;

  const alertConfig = getAlertConfig(alertType);

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${alertTitle}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: ${alertConfig.color};
      padding: 32px 24px;
      text-align: center;
    }
    .header-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .header-title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    .content {
      padding: 32px 24px;
    }
    .greeting {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 24px;
    }
    .alert-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin-bottom: 24px;
      border-radius: 4px;
    }
    .alert-title {
      font-size: 18px;
      font-weight: 600;
      color: #92400e;
      margin: 0 0 8px 0;
    }
    .alert-description {
      font-size: 14px;
      color: #78350f;
      margin: 0;
      line-height: 1.5;
    }
    .details {
      margin-bottom: 24px;
    }
    .detail-row {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #6b7280;
      width: 140px;
      flex-shrink: 0;
    }
    .detail-value {
      color: #1f2937;
    }
    .expiry-warning {
      color: #dc2626;
      font-weight: 600;
    }
    .cta-button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 16px 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer-logo {
      font-weight: 700;
      color: #2563eb;
      font-size: 16px;
      margin-bottom: 8px;
    }
    .footer-links {
      margin-top: 16px;
    }
    .footer-link {
      color: #2563eb;
      text-decoration: none;
      margin: 0 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-icon">${alertConfig.icon}</div>
      <h1 class="header-title">${alertConfig.title}</h1>
    </div>
    <div class="content">
      <p class="greeting">Bună ${recipientName},</p>
      <div class="alert-box">
        <h2 class="alert-title">${alertTitle}</h2>
        <p class="alert-description">${alertDescription}</p>
      </div>
      <div class="details">
        ${employeeName ? `<div class="detail-row"><div class="detail-label">Angajat:</div><div class="detail-value">${employeeName}</div></div>` : ''}
        ${itemName ? `<div class="detail-row"><div class="detail-label">Element:</div><div class="detail-value">${itemName}</div></div>` : ''}
        ${expiryDate ? `<div class="detail-row"><div class="detail-label">Data expirării:</div><div class="detail-value expiry-warning">${expiryDate}</div></div>` : ''}
        <div class="detail-row">
          <div class="detail-label">Organizație:</div>
          <div class="detail-value">${organizationName}</div>
        </div>
      </div>
      <p>Pentru a vizualiza detalii complete și a gestiona această alertă, accesează dashboard-ul:</p>
      <center>
        <a href="${dashboardUrl}" class="cta-button">Accesează Dashboard</a>
      </center>
      <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
        Acest email a fost generat automat de sistemul s-s-m.ro pentru a te notifica despre elemente care necesită atenție.
      </p>
    </div>
    <div class="footer">
      <div class="footer-logo">s-s-m.ro</div>
      <div>Platforma digitală SSM/PSI</div>
      <div class="footer-links">
        <a href="https://app.s-s-m.ro" class="footer-link">Dashboard</a>
        <a href="https://app.s-s-m.ro/help" class="footer-link">Ajutor</a>
        <a href="https://app.s-s-m.ro/settings/notifications" class="footer-link">Setări notificări</a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getAlertConfig(type: AlertEmailData['alertType']) {
  switch (type) {
    case 'medical':
      return { icon: '🏥', title: 'Alertă Medicală', color: '#dc2626' };
    case 'equipment':
      return { icon: '🛠️', title: 'Alertă Echipament', color: '#ea580c' };
    case 'training':
      return { icon: '📚', title: 'Alertă Instruire', color: '#2563eb' };
    case 'document':
      return { icon: '📄', title: 'Alertă Document', color: '#7c3aed' };
    default:
      return { icon: '⚠️', title: 'Alertă SSM', color: '#f59e0b' };
  }
}

export function generateAlertEmailSubject(
  alertType: AlertEmailData['alertType'],
  alertTitle: string
): string {
  const prefix = getSubjectPrefix(alertType);
  return `${prefix} ${alertTitle}`;
}

function getSubjectPrefix(type: AlertEmailData['alertType']): string {
  switch (type) {
    case 'medical':
      return '[SSM] Alertă Medicală:';
    case 'equipment':
      return '[SSM] Alertă Echipament:';
    case 'training':
      return '[SSM] Alertă Instruire:';
    case 'document':
      return '[SSM] Alertă Document:';
    default:
      return '[SSM] Alertă:';
  }
}

export function generateAlertEmailText(data: AlertEmailData): string {
  const {
    recipientName,
    alertTitle,
    alertDescription,
    expiryDate,
    employeeName,
    itemName,
    organizationName,
    dashboardUrl,
  } = data;

  let text = `Bună ${recipientName},\n\n`;
  text += `${alertTitle}\n`;
  text += `${alertDescription}\n\n`;
  text += `DETALII:\n`;
  text += `─────────────────────────────────────\n`;
  
  if (employeeName) {
    text += `Angajat: ${employeeName}\n`;
  }
  if (itemName) {
    text += `Element: ${itemName}\n`;
  }
  if (expiryDate) {
    text += `Data expirării: ${expiryDate}\n`;
  }
  text += `Organizație: ${organizationName}\n`;
  text += `─────────────────────────────────────\n\n`;
  
  text += `Pentru a vizualiza detalii complete și a gestiona această alertă, accesează:\n`;
  text += `${dashboardUrl}\n\n`;
  text += `─────────────────────────────────────\n`;
  text += `s-s-m.ro - Platforma digitală SSM/PSI\n`;
  text += `Acest email a fost generat automat.\n`;

  return text;
}
