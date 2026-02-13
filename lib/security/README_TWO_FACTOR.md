# Two-Factor Authentication (2FA) Module

Modul complet pentru autentificare cu doi factori (2FA) folosind TOTP (Time-based One-Time Password), compatibil cu Google Authenticator și alte aplicații standard de autentificare.

## Caracteristici

- ✅ Generare secrete TOTP (Time-based One-Time Password)
- ✅ Generare coduri QR pentru configurare ușoară
- ✅ Verificare token TOTP cu fereastră de timp configurabilă
- ✅ Activare/dezactivare 2FA cu validare
- ✅ Coduri de backup pentru recuperare (10 coduri per user)
- ✅ Compatibil cu Google Authenticator, Microsoft Authenticator, Authy, etc.
- ✅ Suport pentru server-side și client-side

## Instalare Dependințe

```bash
npm install otpauth qrcode
npm install --save-dev @types/qrcode
```

## Migrare Bază de Date

Rulează migrarea pentru a crea tabelele necesare:

```bash
# Aplică migrarea în Supabase
supabase db push
```

Sau execută manual SQL-ul din: `supabase/migrations/20260213_two_factor_auth.sql`

## Utilizare

### 1. Generare Secret și Cod QR pentru Setup

```typescript
import { generateSecret, generateQRCode } from '@/lib/security/two-factor';

// Server-side: generează secret nou pentru user
const { secret, uri } = await generateSecret(userId, userEmail);

// Generează codul QR pentru scanare în aplicația de autentificare
const { qrCodeDataUrl, secret, uri } = await generateQRCode(secret, userEmail);

// Afișează qrCodeDataUrl într-un element <img>
// <img src={qrCodeDataUrl} alt="QR Code for 2FA setup" />
```

### 2. Activare 2FA

```typescript
import { enable2FA } from '@/lib/security/two-factor';

// Utilizatorul scanează QR code-ul și introduce primul token
const token = '123456'; // Token de 6 cifre din aplicația de autentificare

const result = await enable2FA(userId, secret, token);

if (result.success) {
  console.log('2FA activat cu succes!');
  console.log('Coduri de backup:', result.backupCodes);
  // IMPORTANT: Afișează codurile de backup utilizatorului și instrucțiuni de stocare
} else {
  console.error('Eroare:', result.error);
}
```

### 3. Verificare Token la Login

```typescript
import { verifyToken } from '@/lib/security/two-factor';

// Server-side
const isValid = await verifyToken(userId, token);

if (isValid) {
  // Token valid, permite autentificarea
} else {
  // Token invalid
}

// Client-side
import { verifyTokenClient } from '@/lib/security/two-factor';
const isValid = await verifyTokenClient(userId, token);
```

### 4. Verificare Cod de Backup

```typescript
import { verifyBackupCode } from '@/lib/security/two-factor';

const isValid = await verifyBackupCode(userId, backupCode);

if (isValid) {
  // Cod valid, permite autentificarea
  // Codul este marcat automat ca folosit
} else {
  // Cod invalid sau deja folosit
}
```

### 5. Regenerare Coduri de Backup

```typescript
import { generateBackupCodes } from '@/lib/security/two-factor';

const result = await generateBackupCodes(userId, 10);

if (result.success) {
  console.log('Coduri noi de backup:', result.codes);
  // Afișează noile coduri utilizatorului
} else {
  console.error('Eroare:', result.error);
}
```

### 6. Dezactivare 2FA

```typescript
import { disable2FA } from '@/lib/security/two-factor';

// Necesită un token valid pentru confirmare
const result = await disable2FA(userId, token);

if (result.success) {
  console.log('2FA dezactivat cu succes!');
} else {
  console.error('Eroare:', result.error);
}
```

### 7. Verificare Status 2FA

```typescript
import { get2FAStatus } from '@/lib/security/two-factor';

const status = await get2FAStatus(userId);

console.log('2FA activat:', status.enabled);
console.log('Coduri de backup rămase:', status.backupCodesRemaining);
```

## Flux Complet de Implementare

### Setup 2FA (Prima Dată)

1. **User accesează pagina de securitate**
2. **Generare secret**: `generateSecret(userId, userEmail)`
3. **Afișare QR code**: `generateQRCode(secret, userEmail)`
4. **User scanează QR code** în Google Authenticator
5. **User introduce primul token** pentru verificare
6. **Activare 2FA**: `enable2FA(userId, secret, token)`
7. **Afișare coduri de backup** - utilizatorul trebuie să le salveze

### Login cu 2FA

1. **User se autentifică** cu email/password (Supabase Auth)
2. **Verificare dacă 2FA este activat**: verifică `profiles.two_factor_enabled`
3. **Dacă 2FA activ**:
   - Afișează prompt pentru token
   - User introduce token din aplicație sau cod de backup
   - Verifică cu `verifyToken()` sau `verifyBackupCode()`
4. **Dacă valid**: permite accesul complet
5. **Dacă invalid**: afișează eroare și permite reîncercare

## Constante

```typescript
TOTP_ISSUER = 's-s-m.ro'          // Nume afișat în aplicația de autentificare
TOTP_ALGORITHM = 'SHA1'            // Algoritm standard pentru compatibilitate
TOTP_DIGITS = 6                    // Lungime token (6 cifre)
TOTP_PERIOD = 30                   // Perioada în secunde (30s standard)
BACKUP_CODE_LENGTH = 8             // Lungime cod de backup
```

## Securitate

### Best Practices

1. **Secretele TOTP** sunt stocate în `profiles.two_factor_secret` și sunt criptate at-rest de Supabase
2. **Codurile de backup** sunt stocate în text plain în `two_factor_backup_codes` (pentru producție, folosește bcrypt)
3. **RLS activ** pe toate tabelele - userii pot accesa doar propriile lor date
4. **Fiecare cod de backup** poate fi folosit o singură dată
5. **Timestamp** pentru când a fost folosit un cod de backup
6. **Fereastră de timp** pentru token: ±30 secunde (1 interval) pentru a acomoda sincronizarea ceasului

### Recomandări Producție

1. Hash codurile de backup cu bcrypt înainte de stocare
2. Implementează rate limiting pe verificarea token-urilor (max 3-5 încercări/minut)
3. Log toate evenimentele 2FA în `audit_log`
4. Trimite notificări email la activare/dezactivare 2FA
5. Trimite alertă dacă se folosește un cod de backup
6. Consideră implementarea recovery prin SMS sau email ca backup secundar

## Compatibilitate

Modulul este compatibil cu toate aplicațiile de autentificare standard care suportă TOTP:

- ✅ Google Authenticator (Android, iOS)
- ✅ Microsoft Authenticator
- ✅ Authy
- ✅ 1Password
- ✅ LastPass Authenticator
- ✅ Duo Mobile

## Schema Bază de Date

### `profiles` (modificări)

```sql
two_factor_enabled BOOLEAN DEFAULT FALSE
two_factor_secret TEXT                      -- Base32 encoded TOTP secret
```

### `two_factor_backup_codes` (nou)

```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
code TEXT NOT NULL                          -- Backup code (8 caractere)
used BOOLEAN DEFAULT FALSE
created_at TIMESTAMP
used_at TIMESTAMP
```

## Erori Comune

### "Codul de verificare este invalid"

- Token-ul este introdus greșit
- Token-ul a expirat (TOTP are validitate de 30 secunde)
- Ceasul device-ului nu este sincronizat corect
- Secret-ul nu a fost salvat corect în baza de date

### "Nu s-au putut genera codurile de backup"

- Eroare de inserare în baza de date
- RLS policies blochează operația
- User ID invalid

## Exemple de Componente UI

### Setup 2FA Component (React)

```typescript
'use client';

import { useState } from 'react';
import { generateSecret, generateQRCode, enable2FA } from '@/lib/security/two-factor';

export function Setup2FA({ userId, userEmail }) {
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleGenerateQR = async () => {
    const secretData = await generateSecret(userId, userEmail);
    setSecret(secretData.secret);

    const qrData = await generateQRCode(secretData.secret, userEmail);
    setQrCode(qrData.qrCodeDataUrl);
    setStep(2);
  };

  const handleEnable2FA = async () => {
    const result = await enable2FA(userId, secret, token);
    if (result.success) {
      setBackupCodes(result.backupCodes || []);
      setStep(3);
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      {step === 1 && (
        <button onClick={handleGenerateQR}>Activează 2FA</button>
      )}

      {step === 2 && (
        <div>
          <h3>Scanează acest cod QR</h3>
          <img src={qrCode} alt="QR Code" />
          <p>Secret manual: {secret}</p>
          <input
            type="text"
            placeholder="Introdu codul din aplicație"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={handleEnable2FA}>Verifică și Activează</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>2FA Activat! Salvează aceste coduri de backup:</h3>
          <ul>
            {backupCodes.map((code, i) => (
              <li key={i}>{code}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Support

Pentru probleme sau întrebări, contactează echipa de development.
