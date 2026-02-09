// ============================================================
// FIȘIER: app/api/alerts/check/route.ts
// SCOP: Verifică zilnic fișe medicale + echipamente care expiră
//       Trimite email via Resend de la alerte@s-s-m.ro
// CRON: Rulează automat zilnic la 08:00 via Vercel Cron
// REFACTORED: Citește din alert_categories (dinamic per țară)
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getAllAlertCategories, calculateAlertUrgency } from '@/lib/dashboard-helpers';
import type { AlertCategory } from '@/lib/types';

// Lazy-init clienți (avoid module-level crash at build time)
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role = bypass RLS
  );
}

// Tipuri
interface AlertItem {
  type: 'medical' | 'equipment';
  employee_name?: string;
  equipment_type?: string;
  description?: string;
  location?: string;
  expiry_date: string;
  days_left: number;
  urgency: 'info' | 'warning' | 'critical' | 'expired';
  alert_category?: string;
}

interface OrgAlerts {
  org_id: string;
  org_name: string;
  contact_email: string;
  country_code: string;
  items: AlertItem[];
}

// Helper: calculează zile rămase
function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Helper: emoji urgență
function urgencyEmoji(urgency: AlertItem['urgency']): string {
  switch (urgency) {
    case 'expired': return '🔴';
    case 'critical': return '🟠';
    case 'warning': return '🟡';
    case 'info': return '🔵';
  }
}

// Helper: text urgență RO (dinamic din alert_category)
function urgencyText(urgency: AlertItem['urgency'], alertCategory?: AlertCategory): string {
  switch (urgency) {
    case 'expired': return 'EXPIRAT';
    case 'critical':
      return alertCategory
        ? `CRITIC - ${alertCategory.critical_days_before} zile`
        : 'CRITIC - 3 zile';
    case 'warning':
      return alertCategory
        ? `ATENȚIE - ${alertCategory.warning_days_before} zile`
        : 'ATENȚIE - 7 zile';
    case 'info':
      return alertCategory
        ? `Informare - ${alertCategory.warning_days_before} zile`
        : 'Informare - 30 zile';
  }
}

// Generare HTML email
function generateEmailHtml(orgName: string, items: AlertItem[], alertCategories: AlertCategory[]): string {
  const expired = items.filter(i => i.urgency === 'expired');
  const critical = items.filter(i => i.urgency === 'critical');
  const warning = items.filter(i => i.urgency === 'warning');
  const info = items.filter(i => i.urgency === 'info');

  const renderSection = (title: string, color: string, sectionItems: AlertItem[]) => {
    if (sectionItems.length === 0) return '';
    return `
      <div style="margin-bottom:20px;">
        <h3 style="color:${color};margin-bottom:10px;">${title} (${sectionItems.length})</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr style="background:#f5f5f5;">
            <th style="padding:8px;text-align:left;border:1px solid #ddd;">Tip</th>
            <th style="padding:8px;text-align:left;border:1px solid #ddd;">Detalii</th>
            <th style="padding:8px;text-align:left;border:1px solid #ddd;">Data expirare</th>
            <th style="padding:8px;text-align:left;border:1px solid #ddd;">Zile rămase</th>
          </tr>
          ${sectionItems.map(item => `
            <tr>
              <td style="padding:8px;border:1px solid #ddd;">
                ${item.type === 'medical' ? '🏥 Fișă medicală' : '🧯 Echipament'}
                ${item.alert_category ? `<br><small style="color:#666;">${item.alert_category}</small>` : ''}
              </td>
              <td style="padding:8px;border:1px solid #ddd;">
                ${item.type === 'medical'
                  ? item.employee_name
                  : `${item.description || item.equipment_type} (${item.location || 'N/A'})`
                }
              </td>
              <td style="padding:8px;border:1px solid #ddd;">${item.expiry_date}</td>
              <td style="padding:8px;border:1px solid #ddd;color:${color};font-weight:bold;">
                ${item.days_left <= 0 ? 'EXPIRAT' : `${item.days_left} zile`}
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  };

  return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">
      <div style="background:#1a1a2e;color:white;padding:20px;text-align:center;">
        <h1 style="margin:0;font-size:22px;">⚠️ Alerte SSM — ${orgName}</h1>
        <p style="margin:5px 0 0;opacity:0.8;">Raport zilnic ${new Date().toLocaleDateString('ro-RO')}</p>
      </div>

      <div style="padding:20px;">
        <p style="font-size:15px;color:#333;">
          ${expired.length > 0 ? `<strong style="color:#d32f2f;">⚠️ ${expired.length} element(e) EXPIRATE necesită acțiune imediată!</strong><br>` : ''}
          ${critical.length > 0 ? `<strong style="color:#f57c00;">${critical.length} element(e) CRITICE.</strong><br>` : ''}
          ${warning.length > 0 ? `${warning.length} element(e) AVERTISMENT.<br>` : ''}
          ${info.length > 0 ? `${info.length} element(e) INFORMARE.<br>` : ''}
        </p>

        ${renderSection('🔴 EXPIRATE — Acțiune Imediată', '#d32f2f', expired)}
        ${renderSection('🟠 CRITIC', '#f57c00', critical)}
        ${renderSection('🟡 ATENȚIE', '#fbc02d', warning)}
        ${renderSection('🔵 INFORMARE', '#1976d2', info)}
      </div>

      <div style="background:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#666;">
        <p>Acest email a fost trimis automat de <strong>s-s-m.ro</strong></p>
        <p>Platformă digitală SSM & PSI — Multilingv (RO, BG, HU, DE, PL)</p>
      </div>
    </div>
  `;
}

// ============================================================
// MAIN: GET handler — apelat de Vercel Cron zilnic
// REFACTORED: Citește alert_categories din DB (dinamic)
// ============================================================
export async function GET(request: Request) {
  // Protecție: verifică CRON_SECRET (opțional în MVP)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const resend = getResend();

    // 1. Fetch TOATE alert categories (toate țările)
    const alertCategories = await getAllAlertCategories();

    if (alertCategories.length === 0) {
      return NextResponse.json({
        message: 'Nicio categorie alertă configurată',
        sent: 0,
      });
    }

    // 2. Grupează alert categories per țară
    const categoriesByCountry = alertCategories.reduce((acc, cat) => {
      if (!acc[cat.country_code]) acc[cat.country_code] = [];
      acc[cat.country_code].push(cat);
      return acc;
    }, {} as Record<string, AlertCategory[]>);

    // 3. Ia toate organizațiile cu contact_email
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, contact_email, country_code, preferred_channels');

    if (orgsError) throw orgsError;
    if (!orgs || orgs.length === 0) {
      return NextResponse.json({ message: 'Nicio organizație', sent: 0 });
    }

    let totalSent = 0;
    let totalAlerts = 0;
    const results: any[] = [];

    for (const org of orgs) {
      if (!org.contact_email) continue; // Skip dacă nu are email

      // Determină țara organizației (fallback pe RO)
      const orgCountry = org.country_code || 'RO';
      const orgAlertCategories = categoriesByCountry[orgCountry] || [];

      if (orgAlertCategories.length === 0) {
        results.push({
          org: org.name,
          status: 'no_config',
          message: `Nicio categorie alertă pentru țara ${orgCountry}`,
        });
        continue;
      }

      const items: AlertItem[] = [];

      // 4. Pentru fiecare alert_category, verifică datele relevante
      for (const alertCat of orgAlertCategories) {
        // Determină care tabele să verifice bazat pe obligation_id sau naming convention
        // Pentru simplitate, verificăm ambele tabele (medical + equipment)

        // Max warning_days_before din toate categoriile (pentru query optimization)
        const maxDays = Math.max(...orgAlertCategories.map(c => c.warning_days_before));
        const today = new Date();
        const cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() + maxDays);

        // 4a. Fișe medicale
        const { data: medicals } = await supabase
          .from('medical_examinations')
          .select('employee_name, expiry_date, examination_type, result')
          .eq('organization_id', org.id)
          .lte('expiry_date', cutoffDate.toISOString().split('T')[0])
          .order('expiry_date', { ascending: true });

        if (medicals) {
          for (const med of medicals) {
            const daysLeft = daysUntil(med.expiry_date);

            // Verifică dacă intră în pragurile alert_category curente
            if (daysLeft <= alertCat.warning_days_before) {
              const urgency = calculateAlertUrgency(daysLeft, alertCat);

              items.push({
                type: 'medical',
                employee_name: med.employee_name,
                expiry_date: med.expiry_date,
                days_left: daysLeft,
                urgency,
                alert_category: alertCat.name,
              });
            }
          }
        }

        // 4b. Echipamente PSI
        const { data: equipment } = await supabase
          .from('safety_equipment')
          .select('equipment_type, description, location, expiry_date')
          .eq('organization_id', org.id)
          .lte('expiry_date', cutoffDate.toISOString().split('T')[0])
          .order('expiry_date', { ascending: true });

        if (equipment) {
          for (const eq of equipment) {
            const daysLeft = daysUntil(eq.expiry_date);

            // Verifică dacă intră în pragurile alert_category curente
            if (daysLeft <= alertCat.warning_days_before) {
              const urgency = calculateAlertUrgency(daysLeft, alertCat);

              items.push({
                type: 'equipment',
                equipment_type: eq.equipment_type,
                description: eq.description,
                location: eq.location,
                expiry_date: eq.expiry_date,
                days_left: daysLeft,
                urgency,
                alert_category: alertCat.name,
              });
            }
          }
        }
      }

      // 5. Elimină duplicate (același item poate match multiple alert_categories)
      const uniqueItems = Array.from(
        new Map(
          items.map(item => [
            `${item.type}-${item.expiry_date}-${item.employee_name || item.equipment_type}`,
            item
          ])
        ).values()
      );

      // 6. Trimite email dacă sunt alerte
      if (uniqueItems.length > 0) {
        // Sortează: expirate first, apoi critical, warning, info
        uniqueItems.sort((a, b) => a.days_left - b.days_left);

        const hasExpired = uniqueItems.some(i => i.urgency === 'expired');
        const hasCritical = uniqueItems.some(i => i.urgency === 'critical');

        // Subject line dinamic
        let subject = `[SSM] ${org.name} — `;
        if (hasExpired) {
          subject += `⚠️ ${uniqueItems.filter(i => i.urgency === 'expired').length} EXPIRATE!`;
        } else if (hasCritical) {
          subject += `🟠 ${uniqueItems.filter(i => i.urgency === 'critical').length} CRITICE`;
        } else {
          subject += `${uniqueItems.length} alerte SSM`;
        }

        const { data: emailResult, error: emailError } = await resend.emails.send({
          from: 'Alerte SSM <alerte@s-s-m.ro>',
          to: [org.contact_email],
          subject: subject,
          html: generateEmailHtml(org.name, uniqueItems, orgAlertCategories),
        });

        if (emailError) {
          console.error(`Email error for ${org.name}:`, emailError);
          results.push({ org: org.name, status: 'error', error: emailError.message });
        } else {
          totalSent++;
          totalAlerts += uniqueItems.length;

          // 7. Log în notification_log
          await supabase.from('notification_log').insert({
            organization_id: org.id,
            notification_type: 'alert_expiry',
            channel: 'email',
            recipient: org.contact_email,
            status: 'sent',
            sent_at: new Date().toISOString(),
            metadata: {
              subject: subject,
              items_count: uniqueItems.length,
              expired: uniqueItems.filter(i => i.urgency === 'expired').length,
              critical: uniqueItems.filter(i => i.urgency === 'critical').length,
              warning: uniqueItems.filter(i => i.urgency === 'warning').length,
              info: uniqueItems.filter(i => i.urgency === 'info').length,
              resend_id: emailResult?.id,
              country_code: orgCountry,
              alert_categories_used: orgAlertCategories.map(c => c.name),
            },
          });

          results.push({
            org: org.name,
            country: orgCountry,
            status: 'sent',
            alerts: uniqueItems.length,
            expired: uniqueItems.filter(i => i.urgency === 'expired').length,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      organizations_checked: orgs.length,
      emails_sent: totalSent,
      total_alerts: totalAlerts,
      alert_categories_loaded: alertCategories.length,
      countries_configured: Object.keys(categoriesByCountry).length,
      details: results,
    });

  } catch (error: any) {
    console.error('Alert check error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
