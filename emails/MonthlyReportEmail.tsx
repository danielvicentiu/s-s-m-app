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

interface MonthlyReportEmailProps {
  organizationName: string
  reportMonth: string
  reportYear: number
  stats: {
    totalEmployees: number
    validMedicals: number
    expiringMedicals: number
    expiredMedicals: number
    totalEquipment: number
    compliantEquipment: number
    nonCompliantEquipment: number
    totalAlerts: number
    actionedAlerts: number
  }
  dashboardUrl: string
  reportUrl?: string
}

export default function MonthlyReportEmail({
  organizationName,
  reportMonth,
  reportYear,
  stats,
  dashboardUrl = 'https://app.s-s-m.ro/dashboard',
  reportUrl,
}: MonthlyReportEmailProps) {
  const complianceRate = stats.totalEmployees > 0
    ? Math.round((stats.validMedicals / stats.totalEmployees) * 100)
    : 100

  const equipmentComplianceRate = stats.totalEquipment > 0
    ? Math.round((stats.compliantEquipment / stats.totalEquipment) * 100)
    : 100

  const alertResponseRate = stats.totalAlerts > 0
    ? Math.round((stats.actionedAlerts / stats.totalAlerts) * 100)
    : 100

  return (
    <Html>
      <Head />
      <Preview>
        {`Raport lunar ${reportMonth} ${reportYear} - ${organizationName}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>S-S-M.RO</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Raport Lunar Conformitate SSM/PSI</Text>

            <Text style={subheading}>
              {organizationName}
            </Text>

            <Text style={period}>
              {reportMonth} {reportYear}
            </Text>

            <Hr style={hr} />

            {/* Medical Overview */}
            <Section style={section}>
              <Text style={sectionTitle}>📋 Fișe Medicale</Text>

              <Section style={statsGrid}>
                <Section style={statBox}>
                  <Text style={statValue}>{stats.totalEmployees}</Text>
                  <Text style={statLabel}>Total angajați</Text>
                </Section>

                <Section style={statBox}>
                  <Text style={{...statValue, color: '#10b981'}}>{stats.validMedicals}</Text>
                  <Text style={statLabel}>Valide</Text>
                </Section>

                <Section style={statBox}>
                  <Text style={{...statValue, color: '#f59e0b'}}>{stats.expiringMedicals}</Text>
                  <Text style={statLabel}>Expiră în curând</Text>
                </Section>

                <Section style={statBox}>
                  <Text style={{...statValue, color: '#dc2626'}}>{stats.expiredMedicals}</Text>
                  <Text style={statLabel}>Expirate</Text>
                </Section>
              </Section>

              <Section style={progressBarContainer}>
                <Text style={progressLabel}>Rata de conformitate: {complianceRate}%</Text>
                <Section style={progressBar}>
                  <Section style={{
                    ...progressBarFill,
                    width: `${complianceRate}%`,
                    backgroundColor: complianceRate >= 90 ? '#10b981' : complianceRate >= 70 ? '#f59e0b' : '#dc2626',
                  }} />
                </Section>
              </Section>
            </Section>

            <Hr style={hr} />

            {/* Equipment Overview */}
            <Section style={section}>
              <Text style={sectionTitle}>🛡️ Echipamente de Siguranță</Text>

              <Section style={statsGrid}>
                <Section style={statBox}>
                  <Text style={statValue}>{stats.totalEquipment}</Text>
                  <Text style={statLabel}>Total echipamente</Text>
                </Section>

                <Section style={statBox}>
                  <Text style={{...statValue, color: '#10b981'}}>{stats.compliantEquipment}</Text>
                  <Text style={statLabel}>Conforme</Text>
                </Section>

                <Section style={statBox}>
                  <Text style={{...statValue, color: '#dc2626'}}>{stats.nonCompliantEquipment}</Text>
                  <Text style={statLabel}>Non-conforme</Text>
                </Section>
              </Section>

              <Section style={progressBarContainer}>
                <Text style={progressLabel}>Rata de conformitate: {equipmentComplianceRate}%</Text>
                <Section style={progressBar}>
                  <Section style={{
                    ...progressBarFill,
                    width: `${equipmentComplianceRate}%`,
                    backgroundColor: equipmentComplianceRate >= 90 ? '#10b981' : equipmentComplianceRate >= 70 ? '#f59e0b' : '#dc2626',
                  }} />
                </Section>
              </Section>
            </Section>

            <Hr style={hr} />

            {/* Alerts Overview */}
            <Section style={section}>
              <Text style={sectionTitle}>🔔 Alerte și Răspuns</Text>

              <Section style={statsGrid}>
                <Section style={statBox}>
                  <Text style={statValue}>{stats.totalAlerts}</Text>
                  <Text style={statLabel}>Total alerte</Text>
                </Section>

                <Section style={statBox}>
                  <Text style={{...statValue, color: '#10b981'}}>{stats.actionedAlerts}</Text>
                  <Text style={statLabel}>Rezolvate</Text>
                </Section>

                <Section style={statBox}>
                  <Text style={{...statValue, color: '#6b7280'}}>{stats.totalAlerts - stats.actionedAlerts}</Text>
                  <Text style={statLabel}>În așteptare</Text>
                </Section>
              </Section>

              <Section style={progressBarContainer}>
                <Text style={progressLabel}>Rata de răspuns: {alertResponseRate}%</Text>
                <Section style={progressBar}>
                  <Section style={{
                    ...progressBarFill,
                    width: `${alertResponseRate}%`,
                    backgroundColor: '#2563eb',
                  }} />
                </Section>
              </Section>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Vizualizează Dashboard-ul Complet
              </Button>
            </Section>

            {reportUrl && (
              <Section style={buttonContainer}>
                <Button style={secondaryButton} href={reportUrl}>
                  Descarcă Raportul PDF
                </Button>
              </Section>
            )}

            <Hr style={hr} />

            <Text style={footer}>
              Acest raport a fost generat automat de sistemul S-S-M.RO.
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
  marginBottom: '8px',
  textAlign: 'center' as const,
}

const subheading = {
  fontSize: '18px',
  fontWeight: '500',
  color: '#4b5563',
  marginBottom: '4px',
  textAlign: 'center' as const,
}

const period = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const section = {
  margin: '24px 0',
}

const sectionTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '16px',
}

const statsGrid = {
  display: 'grid' as const,
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '16px',
  marginBottom: '16px',
}

const statBox = {
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
}

const statValue = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: 0,
}

const statLabel = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '4px',
}

const progressBarContainer = {
  marginTop: '16px',
}

const progressLabel = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#4b5563',
  marginBottom: '8px',
}

const progressBar = {
  backgroundColor: '#e5e7eb',
  borderRadius: '9999px',
  height: '8px',
  overflow: 'hidden',
}

const progressBarFill = {
  height: '100%',
  borderRadius: '9999px',
  transition: 'width 0.3s ease',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0 12px 0',
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

const secondaryButton = {
  backgroundColor: '#ffffff',
  border: '1px solid #2563eb',
  borderRadius: '8px',
  color: '#2563eb',
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
  textAlign: 'center' as const,
}
