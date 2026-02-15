// ============================================================
// lib/legislative-import/notification-service.ts
// Notificări email via Resend pentru schimbări legislative
// ============================================================

import { Resend } from 'resend';
import type { ImportResult } from './adapters/ro-adapter';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendChangeNotification(results: ImportResult[]): Promise<void> {
  const changed = results.filter((r) => r.status === 'updated' || r.status === 'new');
  const errors = results.filter((r) => r.status === 'error');

  // Nu trimite email dacă totul e unchanged
  if (changed.length === 0 && errors.length === 0) return;

  const toEmail = process.env.ADMIN_EMAIL || 'daniel@s-s-m.ro';
  const subject = buildSubject(changed, errors);
  const html = buildEmailHtml(results);

  try {
    await resend.emails.send({
      from: 'SSM Legislative Monitor <notifications@s-s-m.ro>',
      to: [toEmail],
      replyTo: 'daniel@s-s-m.ro',
      subject,
      html,
    });
    console.log(`[M7 Notify] Email sent to ${toEmail}`);
  } catch (error) {
    // Non-fatal — nu bloca pipeline-ul
    console.error('[M7 Notify] Failed to send email:', error);
  }
}

function buildSubject(changed: ImportResult[], errors: ImportResult[]): string {
  const parts: string[] = [];
  if (changed.length > 0) parts.push(`${changed.length} acte modificate`);
  if (errors.length > 0) parts.push(`${errors.length} erori`);
  const dateStr = new Date().toLocaleDateString('ro-RO');
  return `[SSM Monitor] ${parts.join(' | ')} — ${dateStr}`;
}

function buildEmailHtml(results: ImportResult[]): string {
  const emoji: Record<string, string> = {
    updated: '🔄',
    new: '🆕',
    error: '❌',
    unchanged: '✅',
  };

  const rows = results
    .filter((r) => r.status !== 'unchanged')
    .map(
      (r) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${emoji[r.status] || '❓'}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;"><strong>${r.actKey}</strong></td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${r.titluScurt}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${r.status.toUpperCase()}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${r.changes?.join(', ') || r.error || '—'}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${r.durationMs}ms</td>
      </tr>`
    )
    .join('');

  const unchangedCount = results.filter((r) => r.status === 'unchanged').length;
  const dateStr = new Date().toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;">
      <h2 style="color:#1a365d;">🏛️ SSM Legislative Monitor — Raport</h2>
      <p style="color:#4a5568;">Data: ${dateStr}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f7fafc;">
            <th style="padding:8px;text-align:left;">St</th>
            <th style="padding:8px;text-align:left;">Key</th>
            <th style="padding:8px;text-align:left;">Act</th>
            <th style="padding:8px;text-align:left;">Status</th>
            <th style="padding:8px;text-align:left;">Detalii</th>
            <th style="padding:8px;text-align:left;">Durată</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${unchangedCount > 0 ? `<p style="color:#718096;">✅ ${unchangedCount} acte fără modificări</p>` : ''}
      <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;">
      <p style="color:#a0aec0;font-size:12px;">
        Generat automat de s-s-m.ro M7 Legislative Monitor<br>
        <a href="https://s-s-m.ro/ro/admin/legal-import">Dashboard →</a>
      </p>
    </div>`;
}
