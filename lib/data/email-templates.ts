/**
 * Email Templates pentru platforma SSM/PSI
 * Template-uri pentru notificări automate și comunicare cu utilizatorii
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: string;
  variables: string[];
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Bun venit pe platformă',
    subject: 'Bun venit pe {orgName} - {userName}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bun venit pe platforma SSM/PSI!</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <p>Bun venit în <strong>{orgName}</strong>! Contul tău a fost creat cu succes.</p>
            <p>Platforma noastră te va ajuta să gestionezi eficient toate aspectele legate de securitatea muncii și prevenirea incendiilor.</p>
            <p>Poți accesa contul tău folosind link-ul de mai jos:</p>
            <a href="{link}" class="button">Acesează contul</a>
            <p>Dacă ai întrebări, nu ezita să ne contactezi.</p>
            <p>Echipa SSM/PSI</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'user_created',
    variables: ['userName', 'orgName', 'link']
  },
  {
    id: 'invite',
    name: 'Invitație organizație',
    subject: 'Ai fost invitat să te alături la {orgName}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invitație nouă</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <p>Ai fost invitat să te alături la organizația <strong>{orgName}</strong> pe platforma SSM/PSI.</p>
            <p>Acceptă invitația pentru a accesa toate resursele și funcționalitățile platformei.</p>
            <a href="{link}" class="button">Acceptă invitația</a>
            <p>Acest link este valabil 7 zile.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'user_invited',
    variables: ['userName', 'orgName', 'link']
  },
  {
    id: 'training-reminder',
    name: 'Reminder instruire SSM',
    subject: 'Reminder: Instruire SSM programată - {deadline}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reminder Instruire SSM</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="warning">
              <strong>Atenție:</strong> Ai o instruire SSM programată pentru <strong>{deadline}</strong>.
            </div>
            <p>Această instruire este obligatorie conform legislației în vigoare.</p>
            <p>Detalii complete despre instruire găsești în platformă:</p>
            <a href="{link}" class="button">Vezi detalii instruire</a>
            <p>Echipa {orgName}</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'training_reminder',
    variables: ['userName', 'orgName', 'deadline', 'link']
  },
  {
    id: 'medical-expiry',
    name: 'Expirare aviz medical',
    subject: 'URGENT: Avizul medical expiră în {deadline}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Aviz Medical în Expirare</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="alert">
              <strong>URGENT:</strong> Avizul tău medical va expira pe <strong>{deadline}</strong>.
            </div>
            <p>Conform legislației, nu poți desfășura activitate fără un aviz medical de muncă valabil.</p>
            <p>Te rugăm să programezi un control medical cât mai curând posibil.</p>
            <a href="{link}" class="button">Vezi aviz medical</a>
            <p>Pentru întrebări, contactează departamentul HR al {orgName}.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'medical_expiry_warning',
    variables: ['userName', 'orgName', 'deadline', 'link']
  },
  {
    id: 'document-expiry',
    name: 'Expirare document',
    subject: 'Atenție: Document SSM expiră pe {deadline}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Document în Expirare</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="warning">
              <strong>Atenție:</strong> Un document important SSM/PSI din organizația {orgName} va expira pe <strong>{deadline}</strong>.
            </div>
            <p>Pentru a menține conformitatea, te rugăm să regenerezi/actualizezi acest document.</p>
            <a href="{link}" class="button">Vezi document</a>
            <p>Mulțumim pentru atenție!</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'document_expiry_warning',
    variables: ['userName', 'orgName', 'deadline', 'link']
  },
  {
    id: 'compliance-report',
    name: 'Raport conformitate lunar',
    subject: 'Raport conformitate SSM/PSI - {orgName}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Raport Conformitate</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="info">
              Raportul de conformitate SSM/PSI pentru <strong>{orgName}</strong> este disponibil.
            </div>
            <p>Raportul include:</p>
            <ul>
              <li>Statusul instruirilor SSM</li>
              <li>Avize medicale valide/expirate</li>
              <li>Verificări echipamente PSI</li>
              <li>Alerte și neconformități</li>
            </ul>
            <a href="{link}" class="button">Vezi raportul complet</a>
            <p>Echipa SSM/PSI</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'compliance_report_generated',
    variables: ['userName', 'orgName', 'link']
  },
  {
    id: 'alert-critical',
    name: 'Alertă critică SSM',
    subject: '🚨 ALERTĂ CRITICĂ: {orgName}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .critical { background: #fee2e2; border: 2px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 ALERTĂ CRITICĂ</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="critical">
              <strong>ATENȚIE IMEDIATĂ NECESARĂ!</strong><br>
              A fost generată o alertă critică în <strong>{orgName}</strong>.
            </div>
            <p>Această alertă necesită acțiune imediată pentru a preveni riscuri de securitate sau neconformități legale.</p>
            <a href="{link}" class="button">Vezi alerta ACUM</a>
            <p><strong>Nu ignora acest mesaj!</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'critical_alert_created',
    variables: ['userName', 'orgName', 'link']
  },
  {
    id: 'password-reset',
    name: 'Resetare parolă',
    subject: 'Resetare parolă - s-s-m.ro',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6366f1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Resetare Parolă</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <p>Ai solicitat resetarea parolei pentru contul tău de pe platforma SSM/PSI.</p>
            <p>Apasă pe butonul de mai jos pentru a-ți crea o parolă nouă:</p>
            <a href="{link}" class="button">Resetează parola</a>
            <div class="warning">
              <strong>Securitate:</strong> Acest link expiră în 1 oră. Dacă nu ai solicitat resetarea parolei, ignoră acest email.
            </div>
            <p>Pentru asistență, contactează echipa de suport.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'password_reset_requested',
    variables: ['userName', 'link']
  },
  {
    id: 'subscription-expiry',
    name: 'Expirare abonament',
    subject: 'Abonamentul pentru {orgName} expiră pe {deadline}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7c3aed; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info { background: #ede9fe; border-left: 4px solid #7c3aed; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Abonament în Expirare</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="info">
              Abonamentul pentru <strong>{orgName}</strong> va expira pe <strong>{deadline}</strong>.
            </div>
            <p>Pentru a continua să beneficiezi de toate funcționalitățile platformei, te rugăm să reînnoiești abonamentul.</p>
            <ul>
              <li>Acces nelimitat la toate modulele</li>
              <li>Rapoarte automate de conformitate</li>
              <li>Suport prioritar</li>
              <li>Actualizări legislative</li>
            </ul>
            <a href="{link}" class="button">Reînnoiește abonamentul</a>
            <p>Echipa s-s-m.ro</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'subscription_expiry_warning',
    variables: ['userName', 'orgName', 'deadline', 'link']
  },
  {
    id: 'monthly-digest',
    name: 'Sumar lunar activitate',
    subject: 'Sumar lunar {orgName} - Activitate SSM/PSI',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .stats { background: #d1fae5; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Sumar Lunar</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <p>Iată sumarul activității din <strong>{orgName}</strong> pentru luna trecută:</p>
            <div class="stats">
              <strong>Activitate lunară:</strong>
              <ul>
                <li>Instruiri completate</li>
                <li>Avize medicale actualizate</li>
                <li>Verificări echipamente PSI</li>
                <li>Alerte rezolvate</li>
                <li>Documente generate</li>
              </ul>
            </div>
            <a href="{link}" class="button">Vezi raportul detaliat</a>
            <p>Continuați munca excelentă!</p>
            <p>Echipa SSM/PSI</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'monthly_digest',
    variables: ['userName', 'orgName', 'link']
  },
  {
    id: 'equipment-inspection',
    name: 'Verificare echipament PSI',
    subject: 'Verificare obligatorie echipament PSI - {deadline}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ea580c; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { background: #fed7aa; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧯 Verificare Echipament PSI</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="warning">
              <strong>Atenție:</strong> Echipamentele PSI din <strong>{orgName}</strong> necesită verificare până pe <strong>{deadline}</strong>.
            </div>
            <p>Verificarea periodică a echipamentelor de prevenire și stingere incendii este obligatorie conform legislației.</p>
            <p>Lista echipamentelor care necesită verificare:</p>
            <a href="{link}" class="button">Vezi lista echipamente</a>
            <p>Echipa SSM/PSI</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'equipment_inspection_due',
    variables: ['userName', 'orgName', 'deadline', 'link']
  },
  {
    id: 'penalty-warning',
    name: 'Avertizare risc sancțiune',
    subject: '⚠️ Risc sancțiune ITM - {orgName}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .alert { background: #fee2e2; border: 2px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Avertizare Risc Sancțiune</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="alert">
              <strong>AVERTIZARE ITM:</strong><br>
              Au fost identificate neconformități în <strong>{orgName}</strong> care pot duce la sancțiuni din partea Inspectoratului Teritorial de Muncă.
            </div>
            <p>Acțiune imediată necesară pentru:</p>
            <ul>
              <li>Evitarea amenzilor</li>
              <li>Menținerea conformității legale</li>
              <li>Protecția angajaților</li>
            </ul>
            <a href="{link}" class="button">Vezi neconformitățile</a>
            <p>Echipa de consultanță SSM</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'penalty_risk_detected',
    variables: ['userName', 'orgName', 'link']
  },
  {
    id: 'new-legislation',
    name: 'Actualizare legislație',
    subject: 'Actualizare legislație SSM/PSI - Acțiune necesară',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0891b2; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #0891b2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info { background: #cffafe; border-left: 4px solid #0891b2; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Actualizare Legislație</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="info">
              Au fost publicate noi reglementări SSM/PSI care afectează <strong>{orgName}</strong>.
            </div>
            <p>Este important să revizuiți aceste modificări legislative și să actualizați procedurile interne conform noilor cerințe.</p>
            <p>Termenul limită de conformare: <strong>{deadline}</strong></p>
            <a href="{link}" class="button">Citește actualizările</a>
            <p>Echipa de consultanță SSM/PSI vă stă la dispoziție pentru clarificări.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'legislation_updated',
    variables: ['userName', 'orgName', 'deadline', 'link']
  },
  {
    id: 'audit-scheduled',
    name: 'Audit programat',
    subject: 'Audit SSM/PSI programat pentru {deadline}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8b5cf6; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info { background: #ede9fe; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0; }
          .checklist { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Audit Programat</h1>
          </div>
          <div class="content">
            <p>Bună {userName},</p>
            <div class="info">
              A fost programat un audit SSM/PSI pentru <strong>{orgName}</strong> pe data de <strong>{deadline}</strong>.
            </div>
            <div class="checklist">
              <strong>Pregătire pentru audit:</strong>
              <ul>
                <li>✓ Verifică toate avizele medicale</li>
                <li>✓ Verifică statusul instruirilor SSM</li>
                <li>✓ Verifică echipamentele PSI</li>
                <li>✓ Pregătește documentația obligatorie</li>
                <li>✓ Verifică registrele de evidență</li>
              </ul>
            </div>
            <a href="{link}" class="button">Vezi checklist complet</a>
            <p>Echipa de consultanță vă va asista în pregătirea auditului.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'audit_scheduled',
    variables: ['userName', 'orgName', 'deadline', 'link']
  },
  {
    id: 'employee-offboarding',
    name: 'Încetare contract angajat',
    subject: 'Procedură încetare contract - {userName}',
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #64748b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #64748b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info { background: #f1f5f9; border-left: 4px solid #64748b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Încetare Contract</h1>
          </div>
          <div class="content">
            <p>Bună,</p>
            <div class="info">
              Această notificare confirmă inițierea procedurii de încetare contract pentru <strong>{userName}</strong> din <strong>{orgName}</strong>.
            </div>
            <p>Pașii următori:</p>
            <ul>
              <li>Arhivare documente SSM/PSI</li>
              <li>Actualizare registre evidență</li>
              <li>Predare echipamente de protecție</li>
              <li>Finalizare documentație HR</li>
            </ul>
            <a href="{link}" class="button">Vezi procedura completă</a>
            <p>Departament HR & SSM</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 s-s-m.ro - Platforma SSM/PSI digitală</p>
          </div>
        </div>
      </body>
      </html>
    `,
    trigger: 'employee_offboarding',
    variables: ['userName', 'orgName', 'link']
  }
];

/**
 * Utility functions pentru lucrul cu template-uri
 */

/**
 * Găsește un template după ID
 */
export function getTemplateById(id: string): EmailTemplate | undefined {
  return emailTemplates.find(template => template.id === id);
}

/**
 * Găsește template-uri după trigger
 */
export function getTemplatesByTrigger(trigger: string): EmailTemplate[] {
  return emailTemplates.filter(template => template.trigger === trigger);
}

/**
 * Înlocuiește placeholder-urile dintr-un template cu valori reale
 */
export function replaceTemplatePlaceholders(
  template: string,
  values: Record<string, string>
): string {
  let result = template;
  Object.entries(values).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value);
  });
  return result;
}

/**
 * Validează dacă toate variabilele necesare sunt furnizate
 */
export function validateTemplateVariables(
  template: EmailTemplate,
  values: Record<string, string>
): { valid: boolean; missing: string[] } {
  const missing = template.variables.filter(variable => !values[variable]);
  return {
    valid: missing.length === 0,
    missing
  };
}
