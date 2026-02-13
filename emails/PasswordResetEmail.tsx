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

interface PasswordResetEmailProps {
  email: string
  resetUrl: string
  expiresInMinutes?: number
}

export default function PasswordResetEmail({
  email,
  resetUrl,
  expiresInMinutes = 60,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Resetare parolă pentru contul S-S-M.RO</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>S-S-M.RO</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Resetare parolă</Text>

            <Text style={paragraph}>
              Salut,
            </Text>

            <Text style={paragraph}>
              Am primit o cerere de resetare a parolei pentru contul asociat cu adresa de email{' '}
              <strong>{email}</strong>.
            </Text>

            <Text style={paragraph}>
              Dacă tu ai solicitat această resetare, apasă pe butonul de mai jos pentru a crea o parolă nouă:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Resetează parola
              </Button>
            </Section>

            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ Acest link expiră în {expiresInMinutes} minute.
              </Text>
            </Section>

            <Hr style={hr} />

            <Section style={securityBox}>
              <Text style={securityTitle}>🔒 Notă de securitate</Text>
              <Text style={securityText}>
                Dacă <strong>nu</strong> ai solicitat resetarea parolei, poți ignora acest email
                în siguranță. Parola ta actuală va rămâne neschimbată.
              </Text>
              <Text style={securityText}>
                Pentru siguranța contului tău, nu partaja niciodată acest link cu alte persoane.
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Link-ul nu funcționează? Copiază și lipește următoarea adresă în browser:
            </Text>
            <Text style={urlText}>{resetUrl}</Text>

            <Text style={footer}>
              Dacă continui să ai probleme, contactează-ne la{' '}
              <a href="mailto:suport@s-s-m.ro" style={link}>suport@s-s-m.ro</a>
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

const warningBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #f59e0b',
  borderRadius: '8px',
  padding: '12px 16px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const warningText = {
  fontSize: '14px',
  color: '#92400e',
  margin: 0,
}

const securityBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #10b981',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
}

const securityTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#065f46',
  margin: '0 0 8px 0',
}

const securityText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#047857',
  margin: '8px 0',
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

const urlText = {
  fontSize: '12px',
  color: '#2563eb',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f3f4f6',
  padding: '8px',
  borderRadius: '4px',
  margin: '8px 0',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}
