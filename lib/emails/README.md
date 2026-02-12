# Email Templates - s-s-m.ro

Template-uri React Email pentru notificări automate SSM/PSI.

## Instalare

Template-urile folosesc `@react-email/components` și `resend` (deja instalate în proiect).

## Template-uri disponibile

### 1. ExpiryAlertEmail (`expiry-alert.tsx`)

Template pentru alerte de expirare documente/verificări SSM/PSI.

**Props:**
- `documentType`: `'instruire' | 'medical' | 'echipament'` — Tipul documentului
- `expiryDate`: `string` — Data expirării (ISO format)
- `employeeName?`: `string` — Nume angajat (opțional, pentru medical/instruire)
- `companyName`: `string` — Nume companie
- `urgency`: `'30_days' | '7_days' | 'expired'` — Nivel urgență
- `dashboardUrl?`: `string` — Link către dashboard (default: https://app.s-s-m.ro/dashboard)

**Nivele urgență:**
- `30_days` — Galben (⚠️ Atenție) — expiră în 30 zile
- `7_days` — Portocaliu (🔶 Urgent) — expiră în 7 zile
- `expired` — Roșu (🔴 EXPIRAT) — deja expirat

**Exemplu utilizare:**

```typescript
import { Resend } from 'resend'
import ExpiryAlertEmail from '@/lib/emails/expiry-alert'

const resend = new Resend(process.env.RESEND_API_KEY)

// Exemplu 1: Control medical ce expiră în 7 zile
await resend.emails.send({
  from: 'alerte@s-s-m.ro',
  to: 'admin@firma.ro',
  subject: 'Urgent: Control medical expiră în 7 zile',
  react: ExpiryAlertEmail({
    documentType: 'medical',
    expiryDate: '2026-02-20',
    employeeName: 'Popescu Ion',
    companyName: 'SC EXEMPLU SRL',
    urgency: '7_days',
    dashboardUrl: 'https://app.s-s-m.ro/dashboard/medical'
  })
})

// Exemplu 2: Stingător expirat
await resend.emails.send({
  from: 'alerte@s-s-m.ro',
  to: 'admin@firma.ro',
  subject: 'EXPIRAT: Verificare stingător',
  react: ExpiryAlertEmail({
    documentType: 'echipament',
    expiryDate: '2026-02-10',
    companyName: 'SC EXEMPLU SRL',
    urgency: 'expired',
    dashboardUrl: 'https://app.s-s-m.ro/dashboard/equipment'
  })
})

// Exemplu 3: Instruire SSM peste 30 zile
await resend.emails.send({
  from: 'alerte@s-s-m.ro',
  to: 'admin@firma.ro',
  subject: 'Atenție: Instruire SSM expiră peste 30 zile',
  react: ExpiryAlertEmail({
    documentType: 'instruire',
    expiryDate: '2026-03-15',
    employeeName: 'Ionescu Maria',
    companyName: 'SC EXEMPLU SRL',
    urgency: '30_days',
    dashboardUrl: 'https://app.s-s-m.ro/dashboard/training'
  })
})
```

## Preview local

Pentru a previzualiza template-urile local:

```bash
npx react-email dev
```

Apoi deschide http://localhost:3000 în browser.

## Integrare cu sistem alerte

Template-ul se integrează cu:
- Tabela `notification_log` (vezi `lib/types.ts` → `NotificationLogEntry`)
- Tipuri notificare: `alert_mm_30d`, `alert_mm_7d`, `alert_mm_expired`, etc.
- Cron job-uri pentru verificare expirări (de implementat)

## Design

Template-ul respectă ghidul de stil s-s-m.ro:
- Culori: blue-600 (#2563eb) accent, gray pentru text
- Border radius: rounded-2xl (16px)
- Responsive: optimizat pentru desktop și mobile email clients
- Accesibilitate: contrast WCAG AA compliant

## TODO

- [ ] Template pentru raport lunar
- [ ] Template pentru alerte fraud
- [ ] Template pentru onboarding nou client
- [ ] Template pentru reminder acțiuni pending
