// lib/services/email-templates/welcome-email.ts
// Email Template: Welcome Email — Bun venit organizație nouă
// Trimite email personalizat la administrator după înregistrare
// Integrare: Resend API
// Data: 14 Februarie 2026

import { Resend } from 'resend'

// ── Types ──

export interface WelcomeEmailParams {
  adminEmail: string
  adminName: string
  orgName: string
  dashboardUrl?: string
  helpCenterUrl?: string
  demoUrl?: string
}

// ── HTML Email Template ──

/**
 * Generate HTML email body for welcome email
 */
function generateHTMLBody(params: WelcomeEmailParams): string {
  const dashboardUrl = params.dashboardUrl || 'https://app.s-s-m.ro/dashboard'
  const helpCenterUrl = params.helpCenterUrl || 'https://app.s-s-m.ro/faq'
  const demoUrl = params.demoUrl || 'https://app.s-s-m.ro/contact'

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bun venit pe s-s-m.ro</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1F2937;
      margin: 0;
      padding: 0;
      background-color: #F9FAFB;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
      padding: 48px 24px;
      text-align: center;
    }
    .logo {
      font-size: 36px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .tagline {
      color: #DBEAFE;
      font-size: 16px;
      margin: 12px 0 0 0;
    }
    .welcome-badge {
      display: inline-block;
      padding: 12px 24px;
      background-color: #DBEAFE;
      color: #1E40AF;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      margin: 24px 0 0 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 32px;
    }
    .greeting {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: #111827;
    }
    .intro-text {
      font-size: 16px;
      color: #4B5563;
      margin: 0 0 32px 0;
      line-height: 1.7;
    }
    .steps-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 24px 0;
      color: #111827;
      text-align: center;
    }
    .step {
      display: flex;
      align-items: flex-start;
      margin: 0 0 28px 0;
      padding: 20px;
      background-color: #F9FAFB;
      border-radius: 12px;
      border-left: 4px solid #3B82F6;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .step:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }
    .step-number {
      font-size: 28px;
      font-weight: 700;
      color: #3B82F6;
      margin: 0 20px 0 0;
      min-width: 32px;
    }
    .step-content {
      flex: 1;
    }
    .step-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px 0;
    }
    .step-description {
      font-size: 14px;
      color: #6B7280;
      margin: 0;
      line-height: 1.6;
    }
    .cta-section {
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      padding: 32px 24px;
      border-radius: 12px;
      text-align: center;
      margin: 32px 0;
    }
    .cta-title {
      font-size: 18px;
      font-weight: 600;
      color: #1E40AF;
      margin: 0 0 20px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
      color: #FFFFFF;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      margin: 8px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
      white-space: nowrap;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }
    .cta-button-secondary {
      background: #FFFFFF;
      color: #2563EB;
      border: 2px solid #3B82F6;
      box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15);
    }
    .cta-button-secondary:hover {
      background: #F0F9FF;
    }
    .links-section {
      margin: 32px 0;
      padding: 24px;
      background-color: #F9FAFB;
      border-radius: 12px;
      text-align: center;
    }
    .links-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 16px 0;
    }
    .link-item {
      display: inline-block;
      margin: 8px 12px;
    }
    .link {
      color: #3B82F6;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;
    }
    .link:hover {
      color: #2563EB;
      text-decoration: underline;
    }
    .support-section {
      margin: 32px 0;
      padding: 24px;
      background-color: #FEF3C7;
      border-radius: 12px;
      border: 2px solid #F59E0B;
    }
    .support-text {
      font-size: 14px;
      color: #78350F;
      margin: 0;
      text-align: center;
    }
    .footer {
      background-color: #F9FAFB;
      padding: 32px 24px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer-org {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 16px 0;
    }
    .footer-text {
      font-size: 13px;
      color: #6B7280;
      margin: 8px 0;
    }
    .footer-link {
      color: #3B82F6;
      text-decoration: none;
    }
    .footer-link:hover {
      text-decoration: underline;
    }
    .footer-social {
      margin: 20px 0;
    }
    .footer-copyright {
      margin-top: 20px;
      font-size: 12px;
      color: #9CA3AF;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .header {
        padding: 32px 16px;
      }
      .content {
        padding: 24px 16px;
      }
      .greeting {
        font-size: 20px;
      }
      .step {
        flex-direction: column;
      }
      .step-number {
        margin: 0 0 12px 0;
      }
      .cta-button {
        display: block;
        margin: 12px 0;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">s-s-m.ro</h1>
      <p class="tagline">Platformă SSM/PSI Digitală</p>
      <div class="welcome-badge">✨ Bun venit!</div>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Greeting -->
      <h2 class="greeting">Bună ziua, ${params.adminName}! 👋</h2>

      <!-- Intro -->
      <p class="intro-text">
        Bine ați venit pe <strong>s-s-m.ro</strong>! Contul organizației <strong>${params.orgName}</strong>
        a fost creat cu succes. Suntem încântați să vă alăturați comunității noastre de profesioniști
        SSM/PSI care digitizează managementul securității și sănătății în muncă.
      </p>

      <!-- Next Steps -->
      <h3 class="steps-title">🚀 Următorii Pași</h3>

      <div class="step">
        <div class="step-number">1</div>
        <div class="step-content">
          <div class="step-title">👥 Adaugă Angajați</div>
          <p class="step-description">
            Începeți prin a adăuga angajații organizației în sistem. Puteți importa date în masă
            din Excel/CSV sau adăuga angajați individual cu toate informațiile necesare.
          </p>
        </div>
      </div>

      <div class="step">
        <div class="step-number">2</div>
        <div class="step-content">
          <div class="step-title">📋 Completează Instruiri</div>
          <p class="step-description">
            Programați și gestionați instruirile SSM/PSI pentru angajați. Platforma vă permite
            să urmăriți participarea, să generați documente automat și să primiți reminder-uri
            pentru reinstruiri.
          </p>
        </div>
      </div>

      <div class="step">
        <div class="step-number">3</div>
        <div class="step-content">
          <div class="step-title">📄 Generează Documente</div>
          <p class="step-description">
            Generați automat toate documentele necesare pentru conformitatea SSM/PSI: fișe de
            instruire, registre, rapoarte, certificate. Toate documentele sunt conforme cu
            legislația în vigoare.
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <h3 class="cta-title">🎯 Gata să începeți?</h3>
        <a href="${dashboardUrl}" class="cta-button">
          🏠 Accesează Dashboard-ul
        </a>
      </div>

      <!-- Links Section -->
      <div class="links-section">
        <h4 class="links-title">📚 Resurse Utile</h4>
        <div class="link-item">
          <a href="${helpCenterUrl}" class="link">📖 Centru de Ajutor</a>
        </div>
        <div class="link-item">
          <a href="${demoUrl}" class="link">📅 Programează Demo</a>
        </div>
        <div class="link-item">
          <a href="https://app.s-s-m.ro/blog" class="link">📰 Blog SSM/PSI</a>
        </div>
        <div class="link-item">
          <a href="https://app.s-s-m.ro/terms" class="link">📜 Termeni și Condiții</a>
        </div>
      </div>

      <!-- Support Section -->
      <div class="support-section">
        <p class="support-text">
          <strong>💬 Aveți nevoie de ajutor?</strong><br>
          Echipa noastră este aici pentru dumneavoastră! Contactați-ne la
          <a href="mailto:support@s-s-m.ro" style="color: #92400E; font-weight: 600;">support@s-s-m.ro</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-org">${params.orgName}</p>

      <p class="footer-text">
        Acest email a fost trimis automat de platforma
        <a href="https://app.s-s-m.ro" class="footer-link">s-s-m.ro</a>
      </p>

      <p class="footer-text">
        Pentru întrebări sau suport tehnic, contactați-ne la<br>
        <a href="mailto:support@s-s-m.ro" class="footer-link">support@s-s-m.ro</a> sau
        <a href="tel:+40123456789" class="footer-link">+40 123 456 789</a>
      </p>

      <div class="footer-social">
        <p class="footer-text">
          Urmăriți-ne:
          <a href="https://linkedin.com/company/s-s-m-ro" class="footer-link">LinkedIn</a> •
          <a href="https://facebook.com/ssm.ro" class="footer-link">Facebook</a>
        </p>
      </div>

      <p class="footer-copyright">
        © ${new Date().getFullYear()} s-s-m.ro — Platformă SSM/PSI Digitală<br>
        Toate drepturile rezervate
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// ── Plain Text Version ──

/**
 * Generate plain text version of the email
 */
function generatePlainTextBody(params: WelcomeEmailParams): string {
  const dashboardUrl = params.dashboardUrl || 'https://app.s-s-m.ro/dashboard'
  const helpCenterUrl = params.helpCenterUrl || 'https://app.s-s-m.ro/faq'
  const demoUrl = params.demoUrl || 'https://app.s-s-m.ro/contact'

  return `
✨ BUN VENIT PE S-S-M.RO!

Bună ziua, ${params.adminName}!

Bine ați venit pe s-s-m.ro! Contul organizației ${params.orgName} a fost creat cu succes.
Suntem încântați să vă alăturați comunității noastre de profesioniști SSM/PSI care digitizează
managementul securității și sănătății în muncă.

🚀 URMĂTORII PAȘI:

1. 👥 Adaugă Angajați
   Începeți prin a adăuga angajații organizației în sistem. Puteți importa date în masă
   din Excel/CSV sau adăuga angajați individual.

2. 📋 Completează Instruiri
   Programați și gestionați instruirile SSM/PSI pentru angajați. Platforma vă permite
   să urmăriți participarea și să generați documente automat.

3. 📄 Generează Documente
   Generați automat toate documentele necesare pentru conformitatea SSM/PSI: fișe de
   instruire, registre, rapoarte, certificate.

🎯 GATA SĂ ÎNCEPEȚI?

Accesează Dashboard-ul:
${dashboardUrl}

📚 RESURSE UTILE:

• Centru de Ajutor: ${helpCenterUrl}
• Programează Demo: ${demoUrl}
• Blog SSM/PSI: https://app.s-s-m.ro/blog
• Termeni și Condiții: https://app.s-s-m.ro/terms

💬 AVEȚI NEVOIE DE AJUTOR?

Echipa noastră este aici pentru dumneavoastră!
Email: support@s-s-m.ro
Telefon: +40 123 456 789

---
${params.orgName}
Platformă s-s-m.ro — SSM/PSI Digitală
https://app.s-s-m.ro

© ${new Date().getFullYear()} s-s-m.ro — Toate drepturile rezervate
  `.trim()
}

// ── Main Function: Send Welcome Email ──

/**
 * Send welcome email to new organization admin
 *
 * @param adminEmail - Admin email address
 * @param adminName - Admin full name
 * @param orgName - Organization name
 * @returns Promise with success status and message ID
 */
export async function sendWelcomeEmail(
  adminEmail: string,
  adminName: string,
  orgName: string
): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    // Validate Resend API key
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured in environment')
    }

    // Initialize Resend client
    const resend = new Resend(apiKey)

    // Validate params
    if (!adminEmail) {
      throw new Error('Admin email is required')
    }

    if (!adminName) {
      throw new Error('Admin name is required')
    }

    if (!orgName) {
      throw new Error('Organization name is required')
    }

    // Build email params
    const params: WelcomeEmailParams = {
      adminEmail,
      adminName,
      orgName
    }

    // Generate email bodies
    const html = generateHTMLBody(params)
    const text = generatePlainTextBody(params)

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 's-s-m.ro <welcome@s-s-m.ro>',
      to: [adminEmail],
      subject: 'Bun venit pe s-s-m.ro — Platformă SSM/PSI Digitală',
      html,
      text,
      tags: [
        {
          name: 'type',
          value: 'welcome_email'
        },
        {
          name: 'org_name',
          value: orgName
        }
      ]
    })

    if (error) {
      console.error('[WelcomeEmail] Resend API error:', error)
      throw error
    }

    console.log('[WelcomeEmail] Email sent successfully', {
      messageId: data?.id,
      recipient: adminEmail,
      orgName
    })

    return {
      success: true,
      messageId: data?.id
    }
  } catch (error) {
    console.error('[WelcomeEmail] Error sending email:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// ── Export ──

export default sendWelcomeEmail
