import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components'

interface ExpiryAlertEmailProps {
  organizationName: string
  alertType: 'medical' | 'equipment' | 'training'
  itemName: string
  expiryDate: string
  daysUntilExpiry: number
  dashboardUrl: string
}

export default function ExpiryAlertEmail({
  organizationName,
  alertType,
  itemName,
  expiryDate,
  daysUntilExpiry,
  dashboardUrl = 'https://app.s-s-m.ro/dashboard',
}: ExpiryAlertEmailProps) {
  const alertTypeLabels = {
    medical: 'Fișă medicală',
    equipment: 'Echipament de siguranță',
    training: 'Instruire SSM',
  }

  const getSeverityColor = () => {
    if (daysUntilExpiry <= 0) return '#dc2626' // red-600
    if (daysUntilExpiry <= 7) return '#ea580c' // orange-600
    if (daysUntilExpiry <= 15) return '#f59e0b' // amber-500
    return '#2563eb' // blue-600
  }

  const getSeverityLabel = () => {
    if (daysUntilExpiry <= 0) return 'EXPIRAT'
    if (daysUntilExpiry <= 7) return 'URGENT'
    if (daysUntilExpiry <= 15) return 'ATENȚIE'
    return 'NOTIFICARE'
  }

  return (
    <Html>
      <Head />
      <Preview>
        Alertă expirare: {alertTypeLabels[alertType]} - {itemName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>S-S-M.RO</Text>
          </Section>

          <Section style={content}>
            <Section style={{
              ...alertBadge,
              backgroundColor: getSeverityColor(),
            }}>
              <Text style={alertBadgeText}>
                {getSeverityLabel()}
              </Text>
            </Section>

            <Text style={heading}>Alertă de expirare</Text>

            <Text style={paragraph}>
              <strong>{organizationName}</strong>
            </Text>

            <Section style={alertBox}>
              <Text style={alertLabel}>Tip:</Text>
              <Text style={alertValue}>{alertTypeLabels[alertType]}</Text>

              <Text style={alertLabel}>Articol:</Text>
              <Text style={alertValue}>{itemName}</Text>

              <Text style={alertLabel}>Data expirării:</Text>
              <Text style={alertValue}>{new Date(expiryDate).toLocaleDateString('ro-RO')}</Text>

              <Text style={alertLabel}>Timp rămas:</Text>
              <Text style={{
                ...alertValue,
                color: getSeverityColor(),
                fontWeight: 'bold',
              }}>
                {daysUntilExpiry <= 0
                  ? `Expirat cu ${Math.abs(daysUntilExpiry)} zile în urmă`
                  : `${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'zi' : 'zile'}`}
              </Text>
            </Section>

            <Text style={paragraph}>
              {daysUntilExpiry <= 0
                ? 'Acest element a expirat și necesită reînnoire urgentă pentru a menține conformitatea cu reglementările SSM/PSI.'
                : `Acest element va expira în ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'zi' : 'zile'}. Vă rugăm să luați măsurile necesare pentru reînnoire.`
              }
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Vizualizează în Dashboard
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Acest email a fost generat automat de sistemul S-S-M.RO.
              Pentru a actualiza preferințele de notificare, accesează
              <a href={`${dashboardUrl}/settings`} style={link}> setările contului</a>.
            </Text>

            <Text style={footer}>
              © {new Date().getFullYear()} S-S-M.RO - Platformă digitală SSM/PSI
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#2563eb',
}

const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: 0,
}

const content = {
  padding: '0 48px',
}

const alertBadge = {
  textAlign: 'center' as const,
  padding: '8px 16px',
  borderRadius: '9999px',
  display: 'inline-block',
  marginBottom: '24px',
}

const alertBadgeText = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  margin: 0,
  letterSpacing: '0.05em',
}

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginBottom: '16px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4b5563',
}

const alertBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const alertLabel = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '8px 0 4px 0',
}

const alertValue = {
  fontSize: '16px',
  color: '#1f2937',
  fontWeight: '500',
  margin: '0 0 16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  marginTop: '16px',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}
