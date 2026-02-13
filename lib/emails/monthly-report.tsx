import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface MonthlyReportEmailProps {
  organizationName: string;
  month: string;
  year: number;
  trainingsCount: number;
  medicalExamsCount: number;
  activeAlertsCount: number;
  complianceScore: number;
  previousMonth?: {
    trainingsCount: number;
    medicalExamsCount: number;
    activeAlertsCount: number;
    complianceScore: number;
  };
  dashboardUrl: string;
}

export const MonthlyReportEmail = ({
  organizationName = 'Organizația Ta',
  month = 'Ianuarie',
  year = 2026,
  trainingsCount = 0,
  medicalExamsCount = 0,
  activeAlertsCount = 0,
  complianceScore = 0,
  previousMonth,
  dashboardUrl = 'https://app.s-s-m.ro/dashboard',
}: MonthlyReportEmailProps) => {
  const previewText = `Raport lunar SSM/PSI - ${month} ${year}`;

  const calculateChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const diff = current - previous;
    const percentChange = previous > 0 ? ((diff / previous) * 100).toFixed(1) : '0';
    return { diff, percentChange, isPositive: diff >= 0 };
  };

  const trainingsChange = calculateChange(trainingsCount, previousMonth?.trainingsCount);
  const medicalChange = calculateChange(medicalExamsCount, previousMonth?.medicalExamsCount);
  const alertsChange = calculateChange(activeAlertsCount, previousMonth?.activeAlertsCount);
  const complianceChange = calculateChange(complianceScore, previousMonth?.complianceScore);

  const renderMetric = (
    label: string,
    value: number,
    change: ReturnType<typeof calculateChange>,
    isAlert: boolean = false
  ) => {
    const color = isAlert ? '#dc2626' : '#2563eb';
    const changeColor = change?.isPositive ? '#059669' : '#dc2626';

    return (
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color, marginBottom: '8px' }}>
          {value}
        </div>
        {change && (
          <div style={{ fontSize: '14px', color: changeColor }}>
            {change.isPositive ? '↗' : '↘'} {change.diff > 0 ? '+' : ''}{change.diff}
            ({change.isPositive ? '+' : ''}{change.percentChange}%) vs. luna anterioară
          </div>
        )}
      </div>
    );
  };

  const renderComplianceBar = () => {
    const barLength = 40;
    const filledLength = Math.round((complianceScore / 100) * barLength);
    const emptyLength = barLength - filledLength;

    let color = '#dc2626'; // red
    if (complianceScore >= 80) color = '#059669'; // green
    else if (complianceScore >= 60) color = '#f59e0b'; // orange

    return (
      <div style={{
        fontFamily: 'monospace',
        fontSize: '16px',
        backgroundColor: '#f9fafb',
        padding: '12px',
        borderRadius: '8px',
        marginTop: '8px'
      }}>
        <span style={{ color }}>{`[${'█'.repeat(filledLength)}${' '.repeat(emptyLength)}]`}</span>
        {' '}
        <span style={{ fontWeight: 'bold', color }}>{complianceScore}%</span>
      </div>
    );
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>📊 Raport Lunar SSM/PSI</Heading>
            <Text style={subtitle}>
              {organizationName} • {month} {year}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Metrics Grid */}
          <Section style={metricsSection}>
            <table style={{ width: '100%' }}>
              <tr>
                <td style={{ width: '50%', paddingRight: '12px' }}>
                  {renderMetric('Instruiri efectuate', trainingsCount, trainingsChange)}
                </td>
                <td style={{ width: '50%', paddingLeft: '12px' }}>
                  {renderMetric('Examene medicale', medicalExamsCount, medicalChange)}
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%', paddingRight: '12px' }}>
                  {renderMetric('Alerte active', activeAlertsCount, alertsChange, true)}
                </td>
                <td style={{ width: '50%', paddingLeft: '12px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                      Scor conformitate
                    </div>
                    {renderComplianceBar()}
                    {complianceChange && (
                      <div style={{
                        fontSize: '14px',
                        color: complianceChange.isPositive ? '#059669' : '#dc2626',
                        marginTop: '8px'
                      }}>
                        {complianceChange.isPositive ? '↗' : '↘'} {complianceChange.diff > 0 ? '+' : ''}{complianceChange.diff}%
                        vs. luna anterioară
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Summary Text */}
          <Section style={summarySection}>
            <Heading style={h2}>Sumar</Heading>
            <Text style={text}>
              În luna {month} {year}, organizația dumneavoastră a înregistrat{' '}
              <strong>{trainingsCount} instruiri SSM/PSI</strong> și{' '}
              <strong>{medicalExamsCount} examene medicale</strong>.
            </Text>

            {activeAlertsCount > 0 ? (
              <Text style={alertText}>
                ⚠️ Aveți <strong>{activeAlertsCount} alerte active</strong> care necesită atenție.
              </Text>
            ) : (
              <Text style={successText}>
                ✅ Nu există alerte active în acest moment.
              </Text>
            )}

            <Text style={text}>
              Scorul de conformitate pentru această lună este de{' '}
              <strong style={{
                color: complianceScore >= 80 ? '#059669' : complianceScore >= 60 ? '#f59e0b' : '#dc2626'
              }}>
                {complianceScore}%
              </strong>.
              {complianceScore < 80 && (
                <span> Vă recomandăm să verificați raportul detaliat pentru îmbunătățiri.</span>
              )}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Call to Action */}
          <Section style={ctaSection}>
            <Text style={text}>
              Pentru detalii complete și analiza datelor, accesați dashboard-ul:
            </Text>
            <div style={buttonContainer}>
              <Link href={dashboardUrl} style={button}>
                Vezi Raportul Detaliat
              </Link>
            </div>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Acest raport este generat automat de platforma S-S-M.ro
            </Text>
            <Text style={footerText}>
              © {year} S-S-M.ro • Platforma digitală SSM/PSI
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default MonthlyReportEmail;

// Styles
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 32px 0',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1f2937',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  padding: '0',
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  padding: '0',
};

const subtitle = {
  color: '#6b7280',
  fontSize: '16px',
  margin: '0',
};

const metricsSection = {
  padding: '32px 32px',
};

const summarySection = {
  padding: '24px 32px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const alertText = {
  color: '#991b1b',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  backgroundColor: '#fef2f2',
  padding: '12px',
  borderRadius: '8px',
  borderLeft: '4px solid #dc2626',
};

const successText = {
  color: '#065f46',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  backgroundColor: '#f0fdf4',
  padding: '12px',
  borderRadius: '8px',
  borderLeft: '4px solid #059669',
};

const ctaSection = {
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const buttonContainer = {
  marginTop: '24px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const footer = {
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};
