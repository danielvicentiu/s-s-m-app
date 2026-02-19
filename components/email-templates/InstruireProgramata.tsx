// components/email-templates/InstruireProgramata.tsx
// Template email instruire programată — adaptat din v0 pentru React Email / Resend

import { Html, Head, Body, Container, Heading, Text, Section, Button, Preview } from '@react-email/components'

export interface InstruireProgramataProps {
  tipInstruire: string
  data: string
  durata: string
  locatie: string
  instructor: string
  numarParticipanti: number
  confirmUrl: string
  deadline?: string
}

export function InstruireProgramata({
  tipInstruire = 'Instruire periodică SSM',
  data = '',
  durata = '',
  locatie = '',
  instructor = '',
  numarParticipanti = 0,
  confirmUrl = 'https://app.s-s-m.ro/dashboard',
  deadline = '',
}: InstruireProgramataProps) {
  const details = [
    { emoji: '📅', label: 'Data și ora', value: data },
    { emoji: '⏱️', label: 'Durată', value: durata },
    { emoji: '📍', label: 'Locația', value: locatie },
    { emoji: '👤', label: 'Instructor', value: instructor },
    { emoji: '👥', label: 'Participanți', value: `${numarParticipanti} angajați convocați` },
    ...(deadline ? [{ emoji: '⚠️', label: 'Deadline confirmare', value: deadline }] : []),
  ]

  return (
    <Html lang="ro">
      <Head />
      <Preview>Instruire programată: {tipInstruire} — {data}</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f4f6', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>

          {/* Header albastru */}
          <Section style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: '28px 32px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px' }}>
              📅 s-s-m.ro
            </Text>
            <Heading style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px', lineHeight: '1.3' }}>
              Instruire Programată
            </Heading>
            <Text style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.5' }}>
              {tipInstruire}
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: '24px 32px 28px' }}>
            <Text style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: '0 0 20px' }}>
              Aveți o instruire programată. Vă rugăm să confirmați participarea înainte de termenul limită.
            </Text>

            {/* Detalii card */}
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: '20px' }}>
              <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>
                Detalii instruire
              </Text>
              {details.map((d) => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                  <Text style={{ fontSize: '16px', margin: 0, minWidth: '20px' }}>{d.emoji}</Text>
                  <div>
                    <Text style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 2px' }}>
                      {d.label}
                    </Text>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                      {d.value}
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Section style={{ textAlign: 'center', marginBottom: '12px' }}>
              <Button
                href={confirmUrl}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Confirmă Participarea →
              </Button>
            </Section>

            <Text style={{ textAlign: 'center', margin: '8px 0 0' }}>
              <a href={confirmUrl} style={{ fontSize: '13px', fontWeight: '600', color: '#2563eb', textDecoration: 'none' }}>
                📆 Adaugă în calendar
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

export default InstruireProgramata
