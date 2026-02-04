// ============================================================
// S-S-M.RO — API Route: Alerte Zilnice Email
// PUNE ACEST FIȘIER ÎN: app/api/alerts/route.ts
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Lazy initialization - se creează doar când se apelează funcția
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  const resend = getResend();
  const supabase = getSupabase();

  // Protecție opțională cu CRON_SECRET
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);
    const in30Days = new Date(today);
    in30Days.setDate(today.getDate() + 30);

    // Toate organizațiile
    const { data: orgs } = await supabase.from('organizations').select('*');
    if (!orgs || orgs.length === 0) {
      return NextResponse.json({ message: 'Nicio organizație găsită', sent: 0 });
    }

    let totalSent = 0;
    const results: any[] = [];

    for (const org of orgs) {
      // Fișe medicale expirate sau care expiră în 30 zile
      const { data: medAlerts } = await supabase
        .from('medical_examinations')
        .select('*, profiles(full_name)')
        .eq('organization_id', org.id)
        .lte('expiry_date', in30Days.toISOString().split('T')[0])
        .order('expiry_date', { ascending: true });

      // Echipamente PSI expirate sau care expiră în 30 zile
      const { data: equipAlerts } = await supabase
        .from('psi_equipment')
        .select('*')
        .eq('organization_id', org.id)
        .lte('expiry_date', in30Days.toISOString().split('T')[0])
        .order('expiry_date', { ascending: true });

      // Instruiri depășite
      const { data: trainingAlerts } = await supabase
        .from('training_assignments')
        .select('*, profiles!training_assignments_worker_id_fkey(full_name), training_modules(title)')
        .eq('organization_id', org.id)
        .in('status', ['assigned', 'overdue'])
        .lte('due_date', in30Days.toISOString().split('T')[0])
        .order('due_date', { ascending: true });

      const hasAlerts = (medAlerts?.length || 0) + (equipAlerts?.length || 0) + (trainingAlerts?.length || 0) > 0;

      if (hasAlerts) {
        const emailHtml = buildAlertEmail(org.name, medAlerts || [], equipAlerts || [], trainingAlerts || [], today);

        const { error: emailError } = await resend.emails.send({
          from: 'SSM Alerte <onboarding@resend.dev>',
          to: process.env.ALERT_EMAIL_TO || 'daniel@s-s-m.ro',
          subject: `⚠️ [${org.name}] — Alerte SSM/PSI (${(medAlerts?.length || 0) + (equipAlerts?.length || 0) + (trainingAlerts?.length || 0)} elemente)`,
          html: emailHtml,
        });

        if (emailError) {
          results.push({ org: org.name, status: 'error', error: emailError });
        } else {
          totalSent++;
          results.push({ org: org.name, status: 'sent', alerts: (medAlerts?.length || 0) + (equipAlerts?.length || 0) + (trainingAlerts?.length || 0) });
        }

        // Salvează notificarea în DB (ignoră erori)
        await supabase.from('notifications').insert({
          organization_id: org.id,
          type: 'daily_alert',
          channel: 'email',
          status: emailError ? 'failed' : 'sent',
          details: { medical: medAlerts?.length || 0, equipment: equipAlerts?.length || 0, training: trainingAlerts?.length || 0 },
        });     }
    }

    return NextResponse.json({
      message: `Alerte trimise: ${totalSent}`,
      sent: totalSent,
      results,
      timestamp: today.toISOString(),
    });
  } catch (error) {
    console.error('Alert error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// ============================================================
// HTML Email Builder
// ============================================================
function buildAlertEmail(
  orgName: string,
  medAlerts: any[],
  equipAlerts: any[],
  trainingAlerts: any[],
  today: Date
): string {
  const formatDate = (d: string) => new Date(d).toLocaleDateString('ro-RO');
  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const statusBadge = (days: number) => {
    if (days < 0) return '<span style="color:#DC2626;font-weight:bold">⛔ EXPIRAT</span>';
    if (days <= 7) return '<span style="color:#EA580C;font-weight:bold">🔴 Urgent</span>';
    if (days <= 30) return '<span style="color:#D97706;font-weight:bold">🟡 Atenție</span>';
    return '<span style="color:#16A34A">✅ OK</span>';
  };

  let html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:20px;background:#f9fafb">
      <div style="background:#1E3A5F;color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="margin:0;font-size:22px">⚠️ Raport Alerte SSM/PSI</h1>
        <p style="margin:5px 0 0;opacity:0.8">${orgName} — ${formatDate(today.toISOString())}</p>
      </div>
      <div style="background:white;padding:20px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">
  `;

  // Fișe medicale
  if (medAlerts.length > 0) {
    html += `<h2 style="color:#1E3A5F;border-bottom:2px solid #3B82F6;padding-bottom:8px">🏥 Fișe Medicale (${medAlerts.length})</h2>`;
    html += '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">';
    html += '<tr style="background:#F3F4F6"><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Angajat</th><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Expiră</th><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Status</th></tr>';
    for (const m of medAlerts) {
      const days = daysUntil(m.expiry_date);
      html += `<tr><td style="padding:8px;border:1px solid #E5E7EB">${m.profiles?.full_name || 'N/A'}</td><td style="padding:8px;border:1px solid #E5E7EB">${formatDate(m.expiry_date)}</td><td style="padding:8px;border:1px solid #E5E7EB">${statusBadge(days)} (${days} zile)</td></tr>`;
    }
    html += '</table>';
  }

  // Echipamente PSI
  if (equipAlerts.length > 0) {
    html += `<h2 style="color:#1E3A5F;border-bottom:2px solid #EF4444;padding-bottom:8px">🧯 Echipamente PSI (${equipAlerts.length})</h2>`;
    html += '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">';
    html += '<tr style="background:#F3F4F6"><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Echipament</th><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Locație</th><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Expiră</th><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Status</th></tr>';
    for (const e of equipAlerts) {
      const days = daysUntil(e.expiry_date);
      html += `<tr><td style="padding:8px;border:1px solid #E5E7EB">${e.name || e.type}</td><td style="padding:8px;border:1px solid #E5E7EB">${e.location || 'N/A'}</td><td style="padding:8px;border:1px solid #E5E7EB">${formatDate(e.expiry_date)}</td><td style="padding:8px;border:1px solid #E5E7EB">${statusBadge(days)}</td></tr>`;
    }
    html += '</table>';
  }

  // Instruiri
  if (trainingAlerts.length > 0) {
    html += `<h2 style="color:#1E3A5F;border-bottom:2px solid #F59E0B;padding-bottom:8px">📚 Instruiri Restante (${trainingAlerts.length})</h2>`;
    html += '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">';
    html += '<tr style="background:#F3F4F6"><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Angajat</th><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Modul</th><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Termen</th><th style="padding:8px;text-align:left;border:1px solid #E5E7EB">Status</th></tr>';
    for (const t of trainingAlerts) {
      const days = daysUntil(t.due_date);
      html += `<tr><td style="padding:8px;border:1px solid #E5E7EB">${t.profiles?.full_name || 'N/A'}</td><td style="padding:8px;border:1px solid #E5E7EB">${t.training_modules?.title || 'N/A'}</td><td style="padding:8px;border:1px solid #E5E7EB">${formatDate(t.due_date)}</td><td style="padding:8px;border:1px solid #E5E7EB">${statusBadge(days)}</td></tr>`;
    }
    html += '</table>';
  }

  html += `
        <div style="margin-top:20px;padding:15px;background:#F0F9FF;border-radius:8px;text-align:center">
          <p style="margin:0;color:#1E3A5F">Acces platformă: <a href="https://app.s-s-m.ro/dashboard" style="color:#3B82F6;font-weight:bold">app.s-s-m.ro</a></p>
        </div>
        <p style="margin-top:15px;font-size:12px;color:#9CA3AF;text-align:center">
          Acest email a fost generat automat de platforma s-s-m.ro<br>
          SSM Consultanță — ${new Date().getFullYear()}
        </p>
      </div>
    </body>
    </html>
  `;

  return html;
}
