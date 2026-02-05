// ============================================================
// FIȘIER: src/app/api/alerts/check/route.ts
// SCOP: Verifică zilnic fișe medicale + echipamente care expiră
//       Trimite email via Resend de la alerte@s-s-m.ro
// CRON: Rulează automat zilnic la 08:00 via Vercel Cron
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Inițializare clienți
const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role = bypass RLS
);

// Praguri alerte (zile înainte de expirare)
const ALERT_THRESHOLDS = [30, 7, 3, 0] as const;

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
}

interface OrgAlerts {
  org_id: string;
  org_name: string;
  contact_email: string;
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

// Helper: determinare urgență
function getUrgency(daysLeft: number): AlertItem['urgency'] {
  if (daysLeft <= 0) return 'expired';
  if (daysLeft <= 3) return 'critical';
  if (daysLeft <= 7) return 'warning';
  return 'info';
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

// Helper: text urgență RO
function urgencyText(urgency: AlertItem['urgency']): string {
  switch (urgency) {
    case 'expired': return 'EXPIRAT';
    case 'critical': return 'CRITIC - 3 zile';
    case 'warning': return 'ATENȚIE - 7 zile';
    case 'info': return 'Informare - 30 zile';
  }
}

// Generare HTML email
function generateEmailHtml(orgName: string, items: AlertItem[]): string {
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
          ${critical.length > 0 ? `<strong style="color:#f57c00;">${critical.length} element(e) expiră în 3 zile.</strong><br>` : ''}
          ${warning.length > 0 ? `${warning.length} element(e) expiră în 7 zile.<br>` : ''}
          ${info.length > 0 ? `${info.length} element(e) expiră în 30 zile.<br>` : ''}
        </p>

        ${renderSection('🔴 EXPIRATE — Acțiune Imediată', '#d32f2f', expired)}
        ${renderSection('🟠 CRITIC — Expiră în 3 zile', '#f57c00', critical)}
        ${renderSection('🟡 ATENȚIE — Expiră în 7 zile', '#fbc02d', warning)}
        ${renderSection('🔵 INFORMARE — Expiră în 30 zile', '#1976d2', info)}
      </div>

      <div style="background:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#666;">
        <p>Acest email a fost trimis automat de <strong>s-s-m.ro</strong></p>
        <p>Platformă digitală SSM & SU — SSM Consultanță</p>
      </div>
    </div>
  `;
}

// ============================================================
// MAIN: GET handler — apelat de Vercel Cron zilnic
// ============================================================
export async function GET(request: Request) {
  // Protecție: verifică CRON_SECRET (opțional în MVP)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    const in30Days = new Date(today);
    in30Days.setDate(today.getDate() + 30);

    // 1. Ia toate organizațiile cu contact_email
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, contact_email, preferred_channels');

    if (orgsError) throw orgsError;
    if (!orgs || orgs.length === 0) {
      return NextResponse.json({ message: 'Nicio organizație', sent: 0 });
    }

    let totalSent = 0;
    let totalAlerts = 0;
    const results: any[] = [];

    for (const org of orgs) {
      if (!org.contact_email) continue; // Skip dacă nu are email

      const items: AlertItem[] = [];

      // 2. Fișe medicale care expiră în 30 zile sau deja expirate
      const { data: medicals } = await supabase
        .from('medical_examinations')
        .select('employee_name, expiry_date, examination_type, result')
        .eq('organization_id', org.id)
        .lte('expiry_date', in30Days.toISOString().split('T')[0])
        .order('expiry_date', { ascending: true });

      if (medicals) {
        for (const med of medicals) {
          const daysLeft = daysUntil(med.expiry_date);
          // Doar alertele relevante (expirate sau în praguri)
          if (daysLeft <= 30) {
            items.push({
              type: 'medical',
              employee_name: med.employee_name,
              expiry_date: med.expiry_date,
              days_left: daysLeft,
              urgency: getUrgency(daysLeft),
            });
          }
        }
      }

      // 3. Echipamente care expiră în 30 zile sau deja expirate
      const { data: equipment } = await supabase
        .from('safety_equipment')
        .select('equipment_type, description, location, expiry_date, status')
        .eq('organization_id', org.id)
        .lte('expiry_date', in30Days.toISOString().split('T')[0])
        .order('expiry_date', { ascending: true });

      if (equipment) {
        for (const eq of equipment) {
          const daysLeft = daysUntil(eq.expiry_date);
          if (daysLeft <= 30) {
            items.push({
              type: 'equipment',
              equipment_type: eq.equipment_type,
              description: eq.description,
              location: eq.location,
              expiry_date: eq.expiry_date,
              days_left: daysLeft,
              urgency: getUrgency(daysLeft),
            });
          }
        }
      }

      // 4. Trimite email dacă sunt alerte
      if (items.length > 0) {
        // Sortează: expirate first, apoi critical, warning, info
        items.sort((a, b) => a.days_left - b.days_left);

        const hasExpired = items.some(i => i.urgency === 'expired');
        const hasCritical = items.some(i => i.urgency === 'critical');

        // Subject line dinamic
        let subject = `[SSM] ${org.name} — `;
        if (hasExpired) {
          subject += `⚠️ ${items.filter(i => i.urgency === 'expired').length} EXPIRATE!`;
        } else if (hasCritical) {
          subject += `🟠 ${items.filter(i => i.urgency === 'critical').length} expiră în 3 zile`;
        } else {
          subject += `${items.length} alerte SSM`;
        }

        const { data: emailResult, error: emailError } = await resend.emails.send({
          from: 'Alerte SSM <alerte@s-s-m.ro>',
          to: [org.contact_email],
          subject: subject,
          html: generateEmailHtml(org.name, items),
        });

        if (emailError) {
          console.error(`Email error for ${org.name}:`, emailError);
          results.push({ org: org.name, status: 'error', error: emailError.message });
        } else {
          totalSent++;
          totalAlerts += items.length;

          // 5. Log în notification_log
          await supabase.from('notification_log').insert({
            organization_id: org.id,
            channel: 'email',
            recipient: org.contact_email,
            subject: subject,
            status: 'sent',
            metadata: {
              items_count: items.length,
              expired: items.filter(i => i.urgency === 'expired').length,
              critical: items.filter(i => i.urgency === 'critical').length,
              warning: items.filter(i => i.urgency === 'warning').length,
              info: items.filter(i => i.urgency === 'info').length,
              resend_id: emailResult?.id,
            },
          });

          results.push({
            org: org.name,
            status: 'sent',
            alerts: items.length,
            expired: items.filter(i => i.urgency === 'expired').length,
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
