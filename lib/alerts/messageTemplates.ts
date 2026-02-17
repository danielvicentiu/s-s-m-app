// S-S-M.RO — Template-uri mesaje alerte SSM (română)
// Folosite pentru WhatsApp, SMS și Email

export const ALERT_TEMPLATES = {
  training_expiry: {
    whatsapp: (
      orgName: string,
      training: string,
      employee: string,
      date: string,
      link: string
    ) =>
      `⚠️ *${orgName}*\n\nInstruirea "${training}" pentru ${employee} expiră pe ${date}.\n\n📋 Accesați platforma: ${link}`,
    sms: (orgName: string, training: string, employee: string, date: string) =>
      `${orgName}: Instruirea ${training} pt ${employee} expira pe ${date}. Accesati s-s-m.ro`,
    email_subject: (training: string, employee: string) =>
      `⚠️ Instruirea ${training} pentru ${employee} expiră curând`,
  },

  medical_expiry: {
    whatsapp: (orgName: string, employee: string, date: string, link: string) =>
      `🏥 *${orgName}*\n\nFișa medicală pentru ${employee} expiră pe ${date}.\nProgramați examinarea!\n\n📋 ${link}`,
    sms: (orgName: string, employee: string, date: string) =>
      `${orgName}: Fisa medicala pt ${employee} expira pe ${date}. Programati examinarea!`,
    email_subject: (employee: string) =>
      `🏥 Fișa medicală pentru ${employee} expiră curând`,
  },

  psi_expiry: {
    whatsapp: (orgName: string, equipment: string, date: string, link: string) =>
      `🔥 *${orgName}*\n\nEchipamentul PSI "${equipment}" necesită verificare până pe ${date}.\n\n📋 ${link}`,
    sms: (orgName: string, equipment: string, date: string) =>
      `${orgName}: Echipament PSI ${equipment} - verificare pana pe ${date}`,
    email_subject: (equipment: string) =>
      `🔥 Echipament PSI ${equipment} — verificare necesară`,
  },

  iscir_expiry: {
    whatsapp: (orgName: string, equipment: string, date: string, link: string) =>
      `⚙️ *${orgName}*\n\nEchipamentul ISCIR "${equipment}" necesită verificare până pe ${date}.\n\n📋 ${link}`,
    sms: (orgName: string, equipment: string, date: string) =>
      `${orgName}: Echipament ISCIR ${equipment} - verificare pana pe ${date}`,
    email_subject: (equipment: string) =>
      `⚙️ Echipament ISCIR ${equipment} — verificare necesară`,
  },

  escalation: {
    whatsapp: (orgName: string, count: number, link: string) =>
      `🚨 *ESCALADARE - ${orgName}*\n\n${count} alerte neconfirmate de peste 48h.\nAcțiune imediată necesară!\n\n📋 ${link}`,
    sms: (orgName: string, count: number) =>
      `URGENT ${orgName}: ${count} alerte neconfirmate 48h+. Actiune imediata!`,
    email_subject: (orgName: string) =>
      `🚨 ESCALADARE: Alerte neconfirmate — ${orgName}`,
  },

  monthly_report: {
    whatsapp: (
      orgName: string,
      trainings: number,
      medical: number,
      equipment: number,
      link: string
    ) =>
      `📊 *Raport lunar SSM - ${orgName}*\n\n📝 ${trainings} instruiri programate\n🏥 ${medical} fișe medicale de reînnoit\n🔧 ${equipment} echipamente de verificat\n\n📋 Detalii: ${link}`,
    sms: (
      orgName: string,
      trainings: number,
      medical: number,
      equipment: number
    ) =>
      `Raport lunar ${orgName}: ${trainings} instruiri, ${medical} medical, ${equipment} echipamente. Detalii pe s-s-m.ro`,
    email_subject: (orgName: string, month: string) =>
      `📊 Raport lunar SSM — ${orgName} — ${month}`,
  },
}

/**
 * Generează HTML pentru email alertă expirare
 */
export function generateExpiryAlertEmailHtml(params: {
  orgName: string
  alertType: string
  entityName: string
  expiryDate: string
  daysUntilExpiry: number
  link: string
}): string {
  const { orgName, alertType, entityName, expiryDate, daysUntilExpiry, link } = params

  const typeLabel =
    alertType === 'training_expiry'
      ? 'Instruire SSM'
      : alertType === 'medical_expiry'
      ? 'Fișă medicală'
      : alertType === 'psi_expiry'
      ? 'Echipament PSI'
      : 'Echipament ISCIR'

  const urgencyColor =
    daysUntilExpiry <= 1
      ? '#d32f2f'
      : daysUntilExpiry <= 7
      ? '#f57c00'
      : daysUntilExpiry <= 14
      ? '#fbc02d'
      : '#1976d2'

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:#1a1a2e;color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;font-size:20px;">⚠️ Alertă SSM — ${orgName}</h1>
        <p style="margin:8px 0 0;opacity:0.8;font-size:14px;">${new Date().toLocaleDateString('ro-RO')}</p>
      </div>
      <div style="padding:24px;background:#f8f9fa;border-radius:0 0 8px 8px;">
        <div style="background:white;border-radius:8px;padding:20px;border-left:4px solid ${urgencyColor};">
          <p style="margin:0 0 8px;font-size:14px;color:#666;">${typeLabel}</p>
          <h2 style="margin:0 0 12px;font-size:18px;color:#1a1a2e;">${entityName}</h2>
          <p style="margin:0;font-size:15px;color:#333;">
            Expiră pe: <strong style="color:${urgencyColor};">${expiryDate}</strong>
            (${daysUntilExpiry <= 0 ? 'EXPIRAT' : `${daysUntilExpiry} zile rămase`})
          </p>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="${link}" style="display:inline-block;background:#1976d2;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">
            Accesați Platforma
          </a>
        </div>
      </div>
      <div style="text-align:center;padding:16px;font-size:12px;color:#999;">
        Trimis automat de <strong>s-s-m.ro</strong> — Platformă digitală SSM & PSI
      </div>
    </div>
  `
}

/**
 * Generează HTML pentru email raport lunar
 */
export function generateMonthlyReportEmailHtml(params: {
  orgName: string
  month: string
  trainings: number
  medical: number
  equipment: number
  link: string
}): string {
  const { orgName, month, trainings, medical, equipment, link } = params

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:#1a1a2e;color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;font-size:20px;">📊 Raport Lunar SSM</h1>
        <p style="margin:8px 0 0;opacity:0.8;font-size:14px;">${orgName} — ${month}</p>
      </div>
      <div style="padding:24px;background:#f8f9fa;border-radius:0 0 8px 8px;">
        <div style="display:grid;gap:12px;">
          <div style="background:white;border-radius:8px;padding:16px;display:flex;align-items:center;gap:12px;">
            <span style="font-size:24px;">📝</span>
            <div>
              <p style="margin:0;font-size:13px;color:#666;">Instruiri programate</p>
              <p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#1a1a2e;">${trainings}</p>
            </div>
          </div>
          <div style="background:white;border-radius:8px;padding:16px;display:flex;align-items:center;gap:12px;">
            <span style="font-size:24px;">🏥</span>
            <div>
              <p style="margin:0;font-size:13px;color:#666;">Fișe medicale de reînnoit</p>
              <p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#1a1a2e;">${medical}</p>
            </div>
          </div>
          <div style="background:white;border-radius:8px;padding:16px;display:flex;align-items:center;gap:12px;">
            <span style="font-size:24px;">🔧</span>
            <div>
              <p style="margin:0;font-size:13px;color:#666;">Echipamente de verificat</p>
              <p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#1a1a2e;">${equipment}</p>
            </div>
          </div>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="${link}" style="display:inline-block;background:#1976d2;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">
            Detalii complete
          </a>
        </div>
      </div>
      <div style="text-align:center;padding:16px;font-size:12px;color:#999;">
        Raport generat automat de <strong>s-s-m.ro</strong>
      </div>
    </div>
  `
}
