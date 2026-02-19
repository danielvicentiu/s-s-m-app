// components/email-templates/BunVenit.tsx
// Template email bun venit — adaptat din v0 pentru React Email / Resend

import { Html, Head, Body, Container, Heading, Text, Section, Button, Preview } from '@react-email/components'

export interface BunVenitProps {
  numeContact: string
  numeFirma: string
  email: string
  plan: string
  dashboardUrl: string
}

export function BunVenit({
  numeContact = 'Utilizator',
  numeFirma = 'Firma dumneavoastră',
  email = '',
  plan = 'Professional',
  dashboardUrl = 'https://app.s-s-m.ro/dashboard',
}: BunVenitProps) {
  return (
    <Html lang="ro">
      <Head />
      <Preview>Bine ați venit pe s-s-m.ro, {numeContact}! Contul a fost creat cu succes.</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f4f6', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>

          {/* Header verde */}
          <Section style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', padding: '28px 32px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px' }}>
              🛡️ s-s-m.ro
            </Text>
            <Heading style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px', lineHeight: '1.3' }}>
              Bun venit pe s-s-m.ro, {numeContact}!
            </Heading>
            <Text style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: '1.5' }}>
              Contul tău a fost creat cu succes. Iată cum poți începe.
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '28px 32px' }}>
            <Text style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: '0 0 16px' }}>
              Salut {numeContact},
            </Text>
            <Text style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: '0 0 24px' }}>
              Felicitări! Ai făcut primul pas către conformitatea completă SSM, PSI, GDPR și NIS2.
              Platforma s-s-m.ro te va ghida în fiecare etapă.
            </Text>

            {/* Pași */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '12px' }}>
              <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px' }}>
                👥 1. Adaugă angajații
              </Text>
              <Text style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                Importă rapid din REGES/REVISAL sau încarcă un fișier Excel cu datele angajaților.
              </Text>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '12px' }}>
              <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px' }}>
                📅 2. Completează instruirile
              </Text>
              <Text style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                Calendarul automat planifică instruirile obligatorii SSM și PSI pentru fiecare angajat.
              </Text>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
              <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px' }}>
                📄 3. Generează documente
              </Text>
              <Text style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                Fișe de instruire, evaluări de risc și rapoarte PDF conforme — generate automat.
              </Text>
            </div>

            {/* Info cont */}
            <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: '24px' }}>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>
                Detaliile contului tău
              </Text>
              <Text style={{ fontSize: '13px', color: '#475569', margin: '0 0 4px' }}>
                Companie: <strong style={{ color: '#1e293b' }}>{numeFirma}</strong>
              </Text>
              <Text style={{ fontSize: '13px', color: '#475569', margin: '0 0 4px' }}>
                Plan: <strong style={{ color: '#1e293b' }}>{plan} — 30 zile gratuit</strong>
              </Text>
              <Text style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                Email: <strong style={{ color: '#1e293b' }}>{email}</strong>
              </Text>
            </div>

            {/* CTA */}
            <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Button
                href={dashboardUrl}
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Mergi la Panoul de Control →
              </Button>
            </Section>

            <Text style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', margin: 0 }}>
              ✉️ Ai nevoie de ajutor? Scrie-ne la{' '}
              <a href="mailto:suport@s-s-m.ro" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>
                suport@s-s-m.ro
              </a>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ borderTop: '1px solid #e2e8f0', padding: '20px 32px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <Text style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.7' }}>
              Primit de la <strong>s-s-m.ro</strong>{' '}|{' '}
              <a href="https://s-s-m.ro/dezabonare" style={{ color: '#2563eb', textDecoration: 'underline' }}>Dezabonare</a>{' '}|{' '}
              <a href="mailto:alerte@s-s-m.ro" style={{ color: '#2563eb', textDecoration: 'underline' }}>alerte@s-s-m.ro</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default BunVenit
