import { render } from '@react-email/render';
import { MonthlyReportEmail } from './monthly-report';

export interface MonthlyReportData {
  organizationName: string;
  month: string;
  year: number;
  trainingsCount: number;
  medicalExamsCount: number;
  activeAlertsCount: number;
  complianceScore: number;
  previousMonth?: {
    trainingsCount: number;
    medicalExamsCount: number;
    activeAlertsCount: number;
    complianceScore: number;
  };
  dashboardUrl?: string;
}

/**
 * Generate HTML for monthly report email
 */
export async function generateMonthlyReportEmail(data: MonthlyReportData): Promise<string> {
  const html = await render(MonthlyReportEmail({
    ...data,
    dashboardUrl: data.dashboardUrl || 'https://app.s-s-m.ro/dashboard',
  }));

  return html;
}

/**
 * Generate plain text version for monthly report email
 */
export async function generateMonthlyReportText(data: MonthlyReportData): Promise<string> {
  const { organizationName, month, year, trainingsCount, medicalExamsCount, activeAlertsCount, complianceScore } = data;

  return `
RAPORT LUNAR SSM/PSI
${organizationName} - ${month} ${year}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMAR ACTIVITĂȚI

• Instruiri efectuate: ${trainingsCount}
• Examene medicale: ${medicalExamsCount}
• Alerte active: ${activeAlertsCount}
• Scor conformitate: ${complianceScore}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

În luna ${month} ${year}, organizația dumneavoastră a înregistrat ${trainingsCount} instruiri SSM/PSI și ${medicalExamsCount} examene medicale.

${activeAlertsCount > 0
  ? `⚠️ Aveți ${activeAlertsCount} alerte active care necesită atenție.`
  : '✅ Nu există alerte active în acest moment.'}

Scorul de conformitate pentru această lună este de ${complianceScore}%.

Pentru detalii complete și analiza datelor, accesați dashboard-ul la:
${data.dashboardUrl || 'https://app.s-s-m.ro/dashboard'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Acest raport este generat automat de platforma S-S-M.ro
© ${year} S-S-M.ro • Platforma digitală SSM/PSI
  `.trim();
}

export { MonthlyReportEmail };
