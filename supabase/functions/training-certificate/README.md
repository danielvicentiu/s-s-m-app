# Training Certificate Generator - Edge Function

## Overview

This Supabase Edge Function generates professional training certificates as PDF documents for completed SSM/PSI training sessions. The certificate includes:

- Company header with organization details
- Employee name and job title
- Training module information (title, code, category, type)
- Session details (date, duration, instructor, location)
- Test results and verification status
- Legal basis references
- QR code for online verification
- Unique certificate ID for authenticity

## Features

- **Professional PDF Generation**: Landscape A4 format with branded design
- **QR Code Verification**: Each certificate includes a QR code linking to verification page
- **Automatic Storage Upload**: PDFs are uploaded to Supabase Storage bucket
- **Audit Trail**: Updates training session record with certificate generation timestamp
- **Multi-language Support**: Uses session language for appropriate formatting
- **Legal Compliance**: Includes all required legal references and standards

## API Endpoint

```
POST /functions/v1/training-certificate
```

## Request Body

```json
{
  "training_id": "uuid-of-training-session",
  "employee_id": "uuid-of-employee"
}
```

## Response

### Success (200)

```json
{
  "success": true,
  "certificate_url": "https://storage.supabase.co/documents/training-certificates/certificate_...",
  "training_id": "uuid",
  "employee_name": "John Doe",
  "module_title": "Instruire SSM Generală",
  "generated_at": "2026-02-13T12:00:00.000Z"
}
```

### Error (400/500)

```json
{
  "error": "Failed to generate certificate",
  "message": "Detailed error message"
}
```

## Database Dependencies

The function queries the following tables:

- `training_sessions` - Main training session record
- `training_modules` - Module details (title, code, category, legal basis)
- `organizations` - Company information for header
- `workers` - Employee details (name, job title)

## Storage

Certificates are stored in the `documents` bucket under the path:
```
training-certificates/certificate_{employee_name}_{training_id}_{timestamp}.pdf
```

## Environment Variables

Required environment variables (auto-configured in Supabase):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database access

## Deployment

Deploy this function using the Supabase CLI:

```bash
supabase functions deploy training-certificate
```

## Usage Example

### From Client (Browser/App)

```typescript
const { data, error } = await supabase.functions.invoke('training-certificate', {
  body: {
    training_id: '123e4567-e89b-12d3-a456-426614174000',
    employee_id: '987fcdeb-51a2-43f1-9876-543210fedcba'
  }
})

if (error) {
  console.error('Failed to generate certificate:', error)
} else {
  console.log('Certificate URL:', data.certificate_url)
  // Download or display the certificate
  window.open(data.certificate_url, '_blank')
}
```

### From Server (Node.js/Deno)

```typescript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/training-certificate',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      training_id: 'uuid',
      employee_id: 'uuid'
    })
  }
)

const data = await response.json()
```

## Certificate Design

The certificate follows the s-s-m.ro branding:
- **Primary Color**: Blue (#2563EB - blue-600)
- **Layout**: Landscape A4 (297mm x 210mm)
- **Format**: Professional certificate with border and header
- **Sections**:
  1. Header (blue background with white text)
  2. Organization details
  3. Employee name (centered, prominent)
  4. Training module information (highlighted box)
  5. Session details (date, duration, instructor, location)
  6. Test results (if available)
  7. Legal basis (footer area)
  8. QR code (bottom right)
  9. Certificate ID and generation date (footer)

## Security

- Uses service role key for database access (bypasses RLS)
- Validates that training_id and employee_id match before generating
- Only generates certificates for completed training sessions
- Storage bucket should have appropriate RLS policies

## Future Enhancements

- [ ] Email delivery of certificate to employee
- [ ] Batch certificate generation
- [ ] Custom branding per organization
- [ ] Digital signatures
- [ ] Multi-language certificate templates
- [ ] Watermarks for draft/final status

## Troubleshooting

### Certificate not generating

- Check that training session exists and is completed
- Verify employee is associated with the training
- Ensure storage bucket 'documents' exists
- Check Supabase function logs for detailed errors

### QR code not working

- Verify verification URL is accessible
- Check that certificate ID is valid
- Ensure app.s-s-m.ro/verify route is configured

## Related Documentation

- Training Module: `lib/training-types.ts`
- Training Queries: `lib/training-queries.ts`
- Database Schema: `docs/DOC1_CONSOLIDARE_v9.2.md`
