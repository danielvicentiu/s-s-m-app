// components/email-templates/AlerteConformitate.tsx
// Template email alerte conformitate SSM/PSI — adaptat v0, React Email / Resend
// Semafor vizual: expirat=rosu, critic=galben, atentie=verde

import { Html, Head, Body, Container, Heading, Text, Section, Button, Preview } from '@react-email/components'

export interface AlertRow {
  tip: string
  denumire: string
  angajat?: string
  data_expirare?: string
  zile_ramase?: number
  organizatie?: string
}

interface AlerteConformitateProps {
  alerts: AlertRow[]
  organizationName?: string
  reportDate?: string
  dashboardUrl?: string
}

function getSemafor(zile?: number): string {
  if (zile === undefined) return '🟡'
  if (zile < 0) return '🔴'
  if (zile <= 7) return '🟡'
  return '🟢'
}

export function AlerteConformitate({
  alerts,
  organizationName = 'Organizatia dvs.',
  reportDate = new Date().toLocaleDateString('ro-RO'),
  dashboardUrl = 'https://app.s-s-m.ro/dashboard',
}: AlerteConformitateProps) {
  const expired = alerts.filter((a) => (a.zile_ramase ?? 0) < 0).length
  const critical = alerts.filter((a) => (a.zile_ramase ?? 99) >= 0 && (a.zile_ramase ?? 99) <= 7).length

  return (
    <Html lang="ro">
      <Head />
      <Preview>Alerte Conformitate {organizationName}: {expired} expirate, {critical} critice</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
          <Heading style={{ color: '#dc2626', fontSize: '24px', margin: '0 0 8px' }}>
            Alerte Conformitate SSM/PSI
          </Heading>
          <Text style={{ color: '#374151', margin: '0 0 16px' }}>
            Organizatie: <strong>{organizationName}</strong> | Data: {reportDate}
          </Text>
          <Section>
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                }}
              >
                <Text style={{ margin: 0, fontWeight: 'bold', color: '#dc2626' }}>
                  {getSemafor(alert.zile_ramase)} {alert.tip}: {alert.denumire}
                </Text>
                {alert.angajat && (
                  <Text style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Angajat: {alert.angajat}
                  </Text>
                )}
                {alert.data_expirare && (
                  <Text style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Expira: {alert.data_expirare}
                    {alert.zile_ramase !== undefined && ` (${alert.zile_ramase} zile ramase)`}
                  </Text>
                )}
              </div>
            ))}
          </Section>
          <Section style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button
              href={dashboardUrl}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Vezi detalii pe platforma
            </Button>
          </Section>
          <Text style={{ color: '#9ca3af', fontSize: '12px', marginTop: '24px', textAlign: 'center' }}>
            Generat automat de platforma s-s-m.ro
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default AlerteConformitate
