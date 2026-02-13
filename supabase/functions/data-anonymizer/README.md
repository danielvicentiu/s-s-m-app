# Data Anonymizer Edge Function

## Overview

GDPR-compliant Edge Function that anonymizes all personal data associated with a user and organization. This function supports the **Right to Erasure** (Article 17 GDPR) and **Right to Data Portability** (Article 20 GDPR) while maintaining statistical integrity of the data.

## Features

- ✅ Anonymizes personal identifiable information (PII) across all tables
- ✅ Preserves statistical data for compliance reporting
- ✅ Hashes CNP/SSN with SHA-256 for uniqueness without exposing data
- ✅ Generates consistent employee IDs (Employee_XXXX format)
- ✅ Creates detailed audit log for compliance tracking
- ✅ Handles errors gracefully with partial rollback protection
- ✅ Returns comprehensive anonymization report

## Tables Anonymized

### 1. **profiles**
- `full_name` → "Anonymized User"
- `phone` → NULL
- `avatar_url` → NULL

### 2. **employees**
- `name` → "Employee_XXXX" (consistent hash-based ID)
- `cnp` → "HASHED_XXXXXXXXXXXXXXXX" (SHA-256 hash)
- `phone` → NULL
- `email` → NULL
- `address` → NULL
- `emergency_contact_name` → NULL
- `emergency_contact_phone` → NULL

### 3. **medical_examinations**
- `employee_name` → "Employee_XXXX"
- `cnp_hash` → "HASHED_XXXXXXXXXXXXXXXX"
- `doctor_name` → "Dr. Anonymized"
- `clinic_name` → "Clinic Anonymized"
- `notes` → NULL

### 4. **trainings**
- `instructor_name` → "Instructor Anonymized"
- `notes` → NULL

### 5. **organizations**
- `contact_email` → "anonymized@example.com"
- `contact_phone` → NULL
- `address` → NULL

### 6. **safety_equipment**
- `inspector_name` → "Inspector Anonymized"

## Statistical Data Preserved

The following data is **NOT** anonymized to preserve statistical integrity:

- Dates (examination dates, training dates, expiry dates)
- Results (apt/inapt, pass/fail)
- Counts (employee count, equipment count)
- Types and categories (equipment types, examination types)
- Organization structure (departments, roles - not names)
- Compliance scores and metrics

## Request Format

### Endpoint
```
POST https://<project-ref>.supabase.co/functions/v1/data-anonymizer
```

### Headers
```
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

### Request Body
```json
{
  "user_id": "uuid-of-user",
  "organization_id": "uuid-of-organization",
  "reason": "right_to_erasure",
  "requested_by": "uuid-of-requesting-user"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string (UUID) | Yes | User ID whose data will be anonymized |
| `organization_id` | string (UUID) | Yes | Organization ID containing the data |
| `reason` | string | No | Reason for anonymization: `right_to_erasure`, `data_minimization`, `retention_policy`, `other`. Default: `right_to_erasure` |
| `requested_by` | string (UUID) | No | User ID who requested the anonymization (for audit) |

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "user_id": "uuid",
  "organization_id": "uuid",
  "reason": "right_to_erasure",
  "requested_by": "uuid",
  "results": [
    {
      "table": "profiles",
      "records_anonymized": 1,
      "fields_modified": ["full_name", "phone", "avatar_url"]
    },
    {
      "table": "employees",
      "records_anonymized": 15,
      "fields_modified": ["name", "cnp", "phone", "email", "address", "emergency_contact_name", "emergency_contact_phone"]
    }
  ],
  "total_records_affected": 42,
  "audit_log_id": "uuid",
  "anonymized_at": "2026-02-13T10:30:00Z"
}
```

### Partial Success Response (200 with errors)
```json
{
  "success": false,
  "user_id": "uuid",
  "organization_id": "uuid",
  "reason": "right_to_erasure",
  "requested_by": "uuid",
  "results": [...],
  "total_records_affected": 30,
  "audit_log_id": "uuid",
  "anonymized_at": "2026-02-13T10:30:00Z",
  "errors": [
    "Error anonymizing trainings: permission denied"
  ]
}
```

### Error Response (400/500)
```json
{
  "error": "Missing or invalid user_id parameter"
}
```

## Usage Example

### Using curl
```bash
curl -X POST https://uhccxfyvhjeudkexcgiq.supabase.co/functions/v1/data-anonymizer \
  -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "organization_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "reason": "right_to_erasure",
    "requested_by": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
  }'
```

### Using JavaScript/TypeScript
```typescript
const { data, error } = await supabase.functions.invoke('data-anonymizer', {
  body: {
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    organization_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    reason: 'right_to_erasure',
    requested_by: session.user.id,
  },
})

if (error) {
  console.error('Anonymization failed:', error)
} else {
  console.log(`Anonymized ${data.total_records_affected} records`)
}
```

## GDPR Compliance

This function implements GDPR requirements:

### Article 17 - Right to Erasure ("Right to be Forgotten")
- Removes all personal identifiable information
- Maintains audit trail of erasure
- Preserves necessary data for legal obligations (compliance statistics)

### Article 30 - Records of Processing Activities
- Creates comprehensive audit log entry
- Records who requested anonymization, when, and why
- Logs all tables and fields modified

### Data Retention
- Statistical data is preserved for compliance reporting
- Audit logs are maintained for 7 years (adjustable)
- Anonymization is **irreversible**

## Security Considerations

- **Service Role Key Required**: Function uses Supabase Service Role Key for database access
- **Authorization**: Implement proper authorization checks before calling this function
- **Irreversible**: Anonymization cannot be undone - confirm user intent before calling
- **Audit Trail**: All anonymization events are logged in `audit_log` table
- **Partial Failure Handling**: If some tables fail, others are still anonymized (check `errors` array)

## Best Practices

1. **User Confirmation**: Always require explicit user confirmation before anonymization
2. **Backup**: Ensure database backups exist before running anonymization
3. **Audit Review**: Review audit logs regularly for compliance
4. **Testing**: Test in development environment first
5. **Authorization**: Verify user has permission to anonymize data for the organization
6. **Data Export**: Offer data export before anonymization (Right to Data Portability)

## Deployment

The function is automatically deployed to Supabase Edge Functions.

### Local Testing
```bash
supabase functions serve data-anonymizer
```

### Deploy to Production
```bash
supabase functions deploy data-anonymizer
```

## Environment Variables

Required environment variables (set in Supabase Dashboard):

- `SUPABASE_URL` - Automatically set by Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Automatically set by Supabase

## Error Handling

The function handles errors gracefully:

- **Per-table errors**: If one table fails, others continue
- **Detailed error messages**: Check `errors` array in response
- **Audit log failures**: Non-blocking - anonymization continues
- **Validation errors**: Return 400 with clear error message

## Monitoring

Monitor anonymization requests via:

1. **Audit Log Table**: Query `audit_log` where `action = 'data_anonymization'`
2. **Edge Function Logs**: View in Supabase Dashboard → Edge Functions
3. **Error Tracking**: Review `errors` array in response for failed operations

## License

Part of s-s-m.ro platform - proprietary software.

## Version History

- **v1.0.0** (2026-02-13) - Initial release
  - Anonymizes 6 core tables
  - SHA-256 CNP hashing
  - Comprehensive audit logging
  - GDPR Article 17 compliance
