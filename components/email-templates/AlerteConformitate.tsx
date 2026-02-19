// components/email-templates/AlerteConformitate.tsx
// Template email pentru alerte de conformitate SSM/PSI

import { Html, Head, Body, Container, Heading, Text, Section } from '@react-email/components'

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
}

export function AlerteConformitate({
  alerts,
  organizationName = 'Organizația dvs.',
  reportDate = new Date().toLocaleDateString('ro-RO'),
}: AlerteConformitateProps) {
  return (
    <Html lang="ro">
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
          <Heading style={{ color: '#0f172a', fontSize: '24px' }}>
            Alerte Conformitate SSM/PSI
          </Heading>
          <Text style={{ color: '#374151' }}>
            Organizație: <strong>{organizationName}</strong> | Data: {reportDate}
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
                  {alert.tip}: {alert.denumire}
                </Text>
                {alert.angajat && (
                  <Text style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Angajat: {alert.angajat}
                  </Text>
                )}
                {alert.data_expirare && (
                  <Text style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Expiră: {alert.data_expirare}
                    {alert.zile_ramase !== undefined && ` (${alert.zile_ramase} zile)`}
                  </Text>
                )}
              </div>
            ))}
          </Section>
          <Text style={{ color: '#9ca3af', fontSize: '12px', marginTop: '24px' }}>
            Acest email a fost generat automat de platforma s-s-m.ro
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
