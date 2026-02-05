// ============================================================
// FIȘIER: src/app/api/alerts/test/route.ts
// SCOP: Trimite UN email de test pentru a verifica că Resend funcționează
// UTILIZARE: Accesează GET /api/alerts/test?email=daniel@email.com
// ATENȚIE: Șterge acest fișier din producție sau protejează-l!
// ============================================================

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get('email');

  if (!testEmail) {
    return NextResponse.json(
      { error: 'Adaugă ?email=adresa@ta.com în URL' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Alerte SSM <alerte@s-s-m.ro>',
      to: [testEmail],
      subject: '✅ Test Alerte SSM — s-s-m.ro funcționează!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1a1a2e;color:white;padding:20px;text-align:center;">
            <h1 style="margin:0;">✅ Test Reușit!</h1>
          </div>
          <div style="padding:30px;text-align:center;">
            <p style="font-size:18px;color:#333;">
              Emailurile de la <strong>alerte@s-s-m.ro</strong> funcționează corect!
            </p>
            <p style="color:#666;">
              Trimis la: ${new Date().toLocaleString('ro-RO')}<br>
              Destinatar: ${testEmail}
            </p>
            <div style="margin:30px 0;padding:20px;background:#e8f5e9;border-radius:8px;">
              <p style="color:#2e7d32;font-weight:bold;margin:0;">
                🎉 Configurare completă!
              </p>
              <p style="color:#333;margin:10px 0 0;">
                Resend ✅ | DNS Verified ✅ | Domeniu s-s-m.ro ✅
              </p>
            </div>
          </div>
          <div style="background:#f5f5f5;padding:15px;text-align:center;font-size:12px;color:#666;">
            SSM Consultanță — s-s-m.ro
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Email de test trimis la ${testEmail}`,
      resend_id: data?.id,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Eroare la trimitere' },
      { status: 500 }
    );
  }
}
