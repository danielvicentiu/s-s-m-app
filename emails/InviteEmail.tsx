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

interface InviteEmailProps {
  inviterName: string
  organizationName: string
  role: string
  inviteUrl: string
  expiresInDays?: number
}

export default function InviteEmail({
  inviterName,
  organizationName,
  role,
  inviteUrl,
  expiresInDays = 7,
}: InviteEmailProps) {
  const roleLabels: Record<string, string> = {
    consultant: 'Consultant SSM',
    firma_admin: 'Administrator firmă',
    angajat: 'Angajat',
  }

  return (
    <Html>
      <Head />
      <Preview>
        Ai fost invitat să te alături organizației {organizationName} pe S-S-M.RO
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>S-S-M.RO</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Invitație la organizație</Text>

            <Text style={paragraph}>
              <strong>{inviterName}</strong> te-a invitat să te alături organizației:
            </Text>

            <Section style={inviteBox}>
              <Text style={organizationNameText}>{organizationName}</Text>
              <Text style={roleText}>
                Rol: <strong>{roleLabels[role] || role}</strong>
              </Text>
            </Section>

            <Text style={paragraph}>
              S-S-M.RO este platforma digitală pentru gestionarea conformității SSM
              (securitate și sănătate în muncă) și PSI (protecție împotriva incendiilor).
            </Text>

            <Text style={paragraph}>
              Prin acceptarea acestei invitații, vei avea acces la:
            </Text>
            <ul style={list}>
              <li>Dashboard-ul organizației {organizationName}</li>
              <li>Gestionarea fișelor medicale și echipamentelor de siguranță</li>
              <li>Alerte automate pentru certificate ce urmează să expire</li>
              <li>Rapoarte de conformitate și generare de documente</li>
              <li>Acces la legislația SSM/PSI actualizată</li>
            </ul>

            <Section style={buttonContainer}>
              <Button style={button} href={inviteUrl}>
                Acceptă invitația
              </Button>
            </Section>

            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ Acest link de invitație expiră în {expiresInDays} zile.
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Dacă nu ai solicitat această invitație, poți ignora acest email în siguranță.
              Niciun cont nu va fi creat dacă nu accesezi link-ul de mai sus.
            </Text>

            <Text style={footer}>
              Dacă ai întrebări, contactează-ne la{' '}
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
  textAlign: 'center' as const,
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

const inviteBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #2563eb',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const organizationNameText = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 8px 0',
}

const roleText = {
  fontSize: '16px',
  color: '#2563eb',
  margin: 0,
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

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  marginTop: '16px',
  textAlign: 'center' as const,
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}
