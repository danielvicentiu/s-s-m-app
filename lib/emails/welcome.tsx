import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Button,
  Img,
  Text,
  Hr,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  companyName: string;
  dashboardUrl?: string;
}

export default function WelcomeEmail({
  userName = 'Utilizator',
  companyName = 'Compania Dumneavoastră',
  dashboardUrl = 'https://app.s-s-m.ro/dashboard',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Row>
              <Column align="center">
                <Img
                  src="https://app.s-s-m.ro/logo.png"
                  alt="SSM Logo"
                  width="120"
                  height="120"
                  style={logo}
                />
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={heading}>Bun venit la S-S-M.ro!</Text>

            <Text style={paragraph}>
              Salut <strong>{userName}</strong>,
            </Text>

            <Text style={paragraph}>
              Bine ai venit la platforma S-S-M.ro! Suntem încântați să avem{' '}
              <strong>{companyName}</strong> alături de noi în digitizarea
              proceselor de compliance SSM și PSI.
            </Text>

            <Text style={paragraph}>
              Platforma ta este acum configurată și pregătită pentru utilizare.
              Iată următorii pași pentru a începe:
            </Text>

            {/* Next Steps */}
            <Section style={stepsContainer}>
              <Row>
                <Column style={stepNumber}>
                  <Text style={stepNumberText}>1</Text>
                </Column>
                <Column style={stepContent}>
                  <Text style={stepTitle}>Configurează profilul companiei</Text>
                  <Text style={stepDescription}>
                    Completează datele companiei și adaugă membrii echipei pentru
                    a gestiona eficient documentele SSM/PSI.
                  </Text>
                </Column>
              </Row>

              <Row style={stepRow}>
                <Column style={stepNumber}>
                  <Text style={stepNumberText}>2</Text>
                </Column>
                <Column style={stepContent}>
                  <Text style={stepTitle}>Adaugă angajați și echipamente</Text>
                  <Text style={stepDescription}>
                    Importă lista de angajați și echipamente pentru a gestiona
                    fișele medicale, instruirile și inspecțiile periodice.
                  </Text>
                </Column>
              </Row>

              <Row style={stepRow}>
                <Column style={stepNumber}>
                  <Text style={stepNumberText}>3</Text>
                </Column>
                <Column style={stepContent}>
                  <Text style={stepTitle}>Explorează dashboard-ul</Text>
                  <Text style={stepDescription}>
                    Descoperă toate funcționalitățile platformei: alerte automate,
                    rapoarte, documente și multe altele.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Accesează Dashboard-ul
              </Button>
            </Section>

            <Text style={paragraph}>
              Dacă ai întrebări sau ai nevoie de asistență, nu ezita să ne contactezi.
              Echipa noastră este aici să te ajute!
            </Text>

            <Text style={signatureText}>
              Cu respect,<br />
              <strong>Echipa S-S-M.ro</strong>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Contact:</strong> contact@s-s-m.ro
            </Text>
            <Text style={footerText}>
              S-S-M.ro — Platformă SSM/PSI pentru consultanți și firme
            </Text>
            <Text style={footerSmallText}>
              România • Bulgaria • Ungaria • Germania
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  border: '1px solid #e5e7eb',
};

const header = {
  backgroundColor: '#1e40af',
  padding: '32px 0',
};

const logo = {
  margin: '0 auto',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  padding: '8px',
};

const content = {
  padding: '40px 32px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0 0 16px 0',
};

const stepsContainer = {
  margin: '32px 0',
};

const stepRow = {
  marginTop: '24px',
};

const stepNumber = {
  width: '48px',
  verticalAlign: 'top' as const,
  paddingTop: '4px',
};

const stepNumberText = {
  backgroundColor: '#1e40af',
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center' as const,
  lineHeight: '40px',
  margin: '0',
};

const stepContent = {
  paddingLeft: '16px',
};

const stepTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 8px 0',
};

const stepDescription = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#6b7280',
  margin: '0',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#1e40af',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
};

const signatureText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '24px 0 0 0',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#6b7280',
  margin: '0 0 8px 0',
};

const footerSmallText = {
  fontSize: '13px',
  lineHeight: '18px',
  color: '#9ca3af',
  margin: '8px 0 0 0',
};
