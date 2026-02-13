# GDPR Data Anonymizer Edge Function

## Scop

Edge Function pentru anonimizarea datelor personale conform GDPR (Dreptul la ștergere/anonimizare).
Funcția primește `user_id` și `org_id` și anonimizează toate datele cu caracter personal din sistem,
păstrând doar datele statistice necesare pentru raportare și conformitate.

## Caracteristici

- **Anonimizare completă**: Înlocuiește nume cu `Employee_XXX`, hash-uiește CNP-uri
- **Păstrare date statistice**: Păstrează tipuri, date, statusuri pentru rapoarte
- **Audit trail**: Creează înregistrare în `audit_log` pentru trasabilitate
- **Securitate**: Folosește `SUPABASE_SERVICE_ROLE_KEY` pentru acces RLS bypass
- **CORS enabled**: Poate fi apelată din aplicația web

## Tabele afectate

1. **employees**: Anonimizează nume, CNP (hash), email, telefon, adresă, contacte urgență
2. **medical_records**: Șterge note, nume doctor, facilități medicale, restricții
3. **trainings**: Anonimizează instructor, note participanți
4. **equipment**: Șterge persoană responsabilă, note
5. **documents**: Șterge note personale
6. **alerts**: Anonimizează mesaje
7. **penalties**: Anonimizează inspector, note, acțiuni corective

## Request Format

```json
POST /data-anonymizer
{
  "user_id": "uuid-of-user",
  "org_id": "uuid-of-organization",
  "reason": "GDPR Right to Erasure",
  "requested_by": "uuid-of-requester"
}
```

## Response Format

### Success (200)
```json
{
  "success": true,
  "anonymized_records": {
    "employees": 15,
    "medical_records": 8,
    "trainings": 12,
    "equipment": 5,
    "documents": 20,
    "alerts": 3,
    "penalties": 2
  },
  "timestamp": "2026-02-13T10:30:00.000Z",
  "audit_log_id": "uuid-of-audit-entry"
}
```

### Error (400/500)
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2026-02-13T10:30:00.000Z"
}
```

## Deployment

### 1. Deploy funcția în Supabase

```bash
# Din root-ul proiectului
npx supabase functions deploy data-anonymizer --project-ref uhccxfyvhjeudkexcgiq
```

### 2. Set environment variables (dacă e necesar)

Environment variables sunt setate automat de Supabase:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Test funcția

```bash
# Test local
npx supabase functions serve data-anonymizer

# Test în producție
curl -X POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/data-anonymizer \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-uuid","org_id":"test-org-uuid"}'
```

## Securitate

⚠️ **IMPORTANT**: Această funcție folosește `SERVICE_ROLE_KEY` și bypass-uiește RLS.
Trebuie protejată cu:

1. **Autentificare**: Verifică că requestul vine de la un utilizator autentificat
2. **Autorizare**: Verifică că utilizatorul are dreptul să anonimizeze datele (admin/consultant)
3. **Rate limiting**: Implementează rate limiting pentru a preveni abuzul
4. **Logging**: Toate operațiile sunt înregistrate în `audit_log`

## Integrare în aplicație

```typescript
// lib/services/gdpr.ts
export async function anonymizeUserData(
  userId: string,
  orgId: string,
  reason?: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/data-anonymizer`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        org_id: orgId,
        reason,
        requested_by: currentUserId,
      }),
    }
  )

  return await response.json()
}
```

## Considerații GDPR

- **Right to Erasure (Art. 17)**: Funcția implementează anonimizarea în loc de ștergere completă
- **Data Retention**: Datele statistice sunt păstrate pentru compliance și raportare
- **Audit Trail**: Toate operațiile sunt auditate conform Art. 30 (Records of processing)
- **Irreversible**: Anonimizarea este ireversibilă - nu există rollback

## TODO

- [ ] Adaugă autentificare JWT în funcție
- [ ] Adaugă rate limiting (1 request/min per org)
- [ ] Adaugă email notification către admin după anonimizare
- [ ] Extinde cu anonimizare pentru tabele viitoare (accidents, inspections, etc.)
- [ ] Adaugă dry-run mode pentru preview înainte de anonimizare
