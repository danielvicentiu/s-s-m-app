import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components'

export type DocumentType = 'instruire' | 'medical' | 'echipament'
export type UrgencyLevel = '30_days' | '7_days' | 'expired'

interface ExpiryAlertEmailProps {
  documentType: DocumentType
  expiryDate: string
  employeeName?: string
  companyName: string
  urgency: UrgencyLevel
  dashboardUrl?: string
}

const documentTypeLabels: Record<DocumentType, string> = {
  instruire: 'Instruire SSM',
  medical: 'Control medical periodic',
  echipament: 'Verificare echipament PSI',
}

const urgencyConfig = {
  '30_days': {
    color: '#f59e0b',
    backgroundColor: '#fef3c7',
    label: 'Atenție',
    message: 'expiră în următoarele 30 de zile',
  },
  '7_days': {
    color: '#f97316',
    backgroundColor: '#fed7aa',
    label: 'Urgent',
    message: 'expiră în următoarele 7 zile',
  },
  expired: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    label: 'EXPIRAT',
    message: 'a expirat și necesită acțiune imediată',
  },
}

export default function ExpiryAlertEmail({
  documentType,
  expiryDate,
  employeeName,
  companyName,
  urgency,
  dashboardUrl = 'https://app.s-s-m.ro/dashboard',
}: ExpiryAlertEmailProps) {
  const docLabel = documentTypeLabels[documentType]
  const config = urgencyConfig[urgency]
  const previewText = `${config.label}: ${docLabel} ${config.message}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>s-s-m.ro</Heading>
            <Text style={subtitle}>Platformă digitală SSM & PSI</Text>
          </Section>

          {/* Urgency Badge */}
          <Section style={{
            ...urgencyBadge,
            backgroundColor: config.backgroundColor,
          }}>
            <Text style={{
              ...urgencyText,
              color: config.color,
            }}>
              {config.label}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>{docLabel}</Heading>

            <Text style={paragraph}>
              Bună ziua,
            </Text>

            <Text style={paragraph}>
              <strong>{docLabel}</strong> {config.message}.
            </Text>

            {/* Details Box */}
            <Section style={detailsBox}>
              {employeeName && (
                <>
                  <Text style={detailLabel}>Angajat:</Text>
                  <Text style={detailValue}>{employeeName}</Text>
                </>
              )}

              <Text style={detailLabel}>Companie:</Text>
              <Text style={detailValue}>{companyName}</Text>

              <Text style={detailLabel}>Data expirării:</Text>
              <Text style={{ ...detailValue, fontWeight: '600', color: config.color }}>
                {new Date(expiryDate).toLocaleDateString('ro-RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Section>

            {/* Call to Action */}
            <Text style={paragraph}>
              {urgency === 'expired'
                ? 'Este necesar să remediați această situație cât mai curând posibil pentru a menține conformitatea cu legislația SSM/PSI.'
                : 'Vă recomandăm să planificați în avans această verificare pentru a evita neconformități.'
              }
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Vezi în dashboard
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Acest email a fost generat automat de platforma s-s-m.ro.
            </Text>
            <Text style={footerText}>
              Pentru orice întrebări, accesați dashboard-ul sau contactați consultantul dvs. SSM.
            </Text>
            <Text style={footerCopyright}>
              © 2026 s-s-m.ro. Toate drepturile rezervate.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo = {
  color: '#2563eb',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px 0',
}

const subtitle = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
}

const urgencyBadge = {
  textAlign: 'center' as const,
  padding: '16px',
  borderRadius: '12px',
  marginBottom: '24px',
}

const urgencyText = {
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '32px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
}

const heading = {
  color: '#111827',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 24px 0',
}

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
}

const detailsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const detailLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 4px 0',
}

const detailValue = {
  color: '#111827',
  fontSize: '16px',
  margin: '0 0 16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0 0 0',
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
  padding: '14px 32px',
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px 0',
}

const footerCopyright = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '16px 0 0 0',
}
