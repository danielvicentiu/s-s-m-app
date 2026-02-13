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

interface WelcomeEmailProps {
  userFullName: string
  organizationName?: string
  loginUrl: string
}

export default function WelcomeEmail({
  userFullName,
  organizationName,
  loginUrl = 'https://app.s-s-m.ro',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bine ai venit pe platforma S-S-M.RO - Soluții digitale SSM/PSI</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>S-S-M.RO</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Bine ai venit, {userFullName}!</Text>

            <Text style={paragraph}>
              Contul tău a fost creat cu succes pe platforma S-S-M.RO - soluția digitală
              pentru gestionarea conformității SSM (securitate și sănătate în muncă) și PSI
              (protecție împotriva incendiilor).
            </Text>

            {organizationName && (
              <Text style={paragraph}>
                Ești membru al organizației: <strong>{organizationName}</strong>
              </Text>
            )}

            <Text style={paragraph}>
              Cu această platformă poți:
            </Text>
            <ul style={list}>
              <li>Gestiona fișele medicale ale angajaților</li>
              <li>Urmări echipamentele de siguranță și datele de expirare</li>
              <li>Genera rapoarte de conformitate automat</li>
              <li>Primi alerte pentru certificate ce urmează să expire</li>
              <li>Accesa legislația SSM/PSI actualizată</li>
            </ul>

            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Accesează platforma
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Dacă ai întrebări sau ai nevoie de asistență, nu ezita să ne contactezi
              la <a href="mailto:suport@s-s-m.ro" style={link}>suport@s-s-m.ro</a>
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

const list = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4b5563',
  paddingLeft: '20px',
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
