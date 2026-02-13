# API Documentation — s-s-m.ro Platform

**Version:** 1.0
**Base URL:** `https://app.s-s-m.ro/api`
**Environment:** Production (Vercel)
**Authentication:** Supabase Auth (session-based) or Bearer token for cron jobs

---

## Table of Contents

1. [Authentication](#authentication)
2. [Alerts API](#alerts-api)
3. [PDF Generation API](#pdf-generation-api)
4. [REGES Integration API](#reges-integration-api)
5. [Legal Acts Management API](#legal-acts-management-api)
6. [Error Codes](#error-codes)

---

## Authentication

Most endpoints require authentication via Supabase session cookies (browser) or Bearer token (cron jobs).

### Session-based (Browser)
Automatically handled by Supabase client library. User must be logged in.

### Bearer Token (Cron Jobs)
```http
Authorization: Bearer {CRON_SECRET}
```

Set `CRON_SECRET` in environment variables for cron-protected endpoints.

---

## Alerts API

### 1. Send Daily Alerts Email

**Endpoint:** `GET /api/alerts`
**Auth Required:** Yes (Bearer token with CRON_SECRET)
**Description:** Sends daily alert emails for all organizations with expiring medical records, equipment, or training assignments.

**Request Headers:**
```json
{
  "Authorization": "Bearer {CRON_SECRET}"
}
```

**Response 200 OK:**
```json
{
  "message": "Alerte trimise: 5",
  "sent": 5,
  "results": [
    {
      "org": "Firma ABC SRL",
      "status": "sent",
      "alerts": {
        "medical": 3,
        "equipment": 2,
        "training": 1
      }
    },
    {
      "org": "Firma XYZ SA",
      "status": "no_alerts",
      "medical": 0,
      "equipment": 0,
      "training": 0
    }
  ],
  "timestamp": "2026-02-13T08:00:00.000Z"
}
```

**Error 401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**Error 500 Internal Server Error:**
```json
{
  "error": "Error message details"
}
```

---

### 2. Check Alerts (Advanced)

**Endpoint:** `GET /api/alerts/check`
**Auth Required:** Yes (Bearer token with CRON_SECRET)
**Description:** Advanced alert checking with dynamic alert categories per country. Sends emails via Resend to organization contact emails.

**Request Headers:**
```json
{
  "Authorization": "Bearer {CRON_SECRET}"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "timestamp": "2026-02-13T08:00:00.000Z",
  "organizations_checked": 25,
  "emails_sent": 8,
  "total_alerts": 47,
  "alert_categories_loaded": 12,
  "countries_configured": 4,
  "details": [
    {
      "org": "Construct Pro SRL",
      "country": "RO",
      "status": "sent",
      "alerts": 15,
      "expired": 3
    }
  ]
}
```

**Error 401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

---

## PDF Generation API

### 3. Generate Training Record (Fișă de Instruire)

**Endpoint:** `POST /api/generate-fisa`
**Auth Required:** No (uses Supabase anon key with RLS)
**Description:** Generates a PDF training record for a completed training session.

**Request Body:**
```json
{
  "session_id": "uuid-of-training-session",
  "organization_id": "uuid-of-organization"
}
```

**Response 200 OK:**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="Fisa_Instruire_Ion_Popescu_2026-01-15.pdf"`
- Returns PDF file as binary data

**Error 400 Bad Request:**
```json
{
  "error": "session_id and organization_id are required"
}
```

**Error 404 Not Found:**
```json
{
  "error": "Session not found or access denied"
}
```

**Error 500 Internal Server Error:**
```json
{
  "error": "Failed to generate PDF",
  "details": "Error details"
}
```

---

### 4. Generate Job Description (Fișă de Post)

**Endpoint:** `POST /api/generate-fisa-post`
**Auth Required:** Yes (Supabase session)
**Description:** Generates a PDF job description document with SSM requirements.

**Request Body:**
```json
{
  "employee_id": "uuid-optional",
  "employee_name": "Ion Popescu",
  "job_title": "Operator CNC",
  "cor_code": "721101",
  "organization_id": "uuid-of-organization",
  "organization_name": "Firma ABC SRL",
  "organization_cui": "RO12345678",
  "organization_address": "Str. Exemplu nr. 1, București",
  "department": "Producție"
}
```

**Response 200 OK:**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="Fisa_Post_Operator_CNC_Ion_Popescu.pdf"`
- Returns PDF file as binary data

**Error 400 Bad Request:**
```json
{
  "error": "employee_name, job_title, and organization_id are required"
}
```

**Error 401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

---

### 5. Generate Training Curriculum (Tematică de Instruire)

**Endpoint:** `POST /api/generate-tematica`
**Auth Required:** Yes (Supabase session)
**Description:** Generates a PDF training curriculum document.

**Request Body:**
```json
{
  "employee_id": "uuid-optional",
  "employee_name": "Ion Popescu",
  "job_title": "Operator CNC",
  "organization_id": "uuid-of-organization",
  "organization_name": "Firma ABC SRL",
  "organization_cui": "RO12345678",
  "organization_address": "Str. Exemplu nr. 1, București"
}
```

**Response 200 OK:**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="Tematica_Instruire_Ion_Popescu_2026.pdf"`
- Returns PDF file as binary data

**Error 400 Bad Request:**
```json
{
  "error": "employee_name and organization_id are required"
}
```

**Error 401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

---

## REGES Integration API

### 6. Create REGES Connection

**Endpoint:** `POST /api/reges/connections`
**Auth Required:** Yes (Supabase session + organization membership)
**Description:** Creates an encrypted connection to REGES (Romanian government employee registry).

**Request Body:**
```json
{
  "organization_id": "uuid-of-organization",
  "cui": "12345678",
  "reges_user_id": "reges-user-id",
  "reges_employer_id": "reges-employer-id",
  "username": "reges-username",
  "password": "reges-password"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "connection": {
    "id": "uuid-of-connection",
    "cui": "12345678",
    "reges_user_id": "reges-user-id",
    "reges_employer_id": "reges-employer-id",
    "status": "active"
  }
}
```

**Error 400 Bad Request:**
```json
{
  "error": "Missing required fields: organization_id, cui, reges_user_id, reges_employer_id, username, password"
}
```

**Error 401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**Error 403 Forbidden:**
```json
{
  "error": "User is not a member of this organization"
}
```

**Error 409 Conflict:**
```json
{
  "error": "A connection already exists for this organization and CUI"
}
```

---

### 7. Sync REGES Employees

**Endpoint:** `POST /api/reges/sync`
**Auth Required:** Yes (Supabase session + organization membership)
**Description:** Triggers synchronization of employees from REGES to Supabase.

**Request Body:**
```json
{
  "connection_id": "uuid-of-connection"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "connection_id": "uuid-of-connection",
  "totalEmployees": 47,
  "newEmployees": 3,
  "departedEmployees": 1,
  "syncedAt": "2026-02-13T10:30:00.000Z"
}
```

**Error 400 Bad Request:**
```json
{
  "error": "Missing required field: connection_id"
}
```

**Error 401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**Error 403 Forbidden:**
```json
{
  "error": "User is not a member of this organization"
}
```

**Error 404 Not Found:**
```json
{
  "error": "Connection not found or access denied"
}
```

---

### 8. Get REGES Sync Status

**Endpoint:** `GET /api/reges/sync?connection_id={uuid}`
**Auth Required:** Yes (Supabase session)
**Description:** Returns the sync status for a REGES connection.

**Query Parameters:**
- `connection_id` (required): UUID of the REGES connection

**Response 200 OK:**
```json
{
  "last_sync_at": "2026-02-13T10:30:00.000Z",
  "status": "active",
  "error_message": null,
  "total_employees": 47
}
```

**Error 400 Bad Request:**
```json
{
  "error": "Missing query parameter: connection_id"
}
```

**Error 404 Not Found:**
```json
{
  "error": "Connection not found"
}
```

---

## Legal Acts Management API

### 9. List Legal Acts

**Endpoint:** `GET /api/admin/legal-acts`
**Auth Required:** Yes (Admin role)
**Description:** Returns a list of legal acts with filtering options.

**Query Parameters:**
- `domain` (optional): Filter by domain (SSM, PSI, GDPR, NIS2)
- `act_type` (optional): Filter by act type (LEGE, HG, OUG, ORDIN)
- `status` (optional): Filter by pipeline status (no_text, text_imported, ai_extracted, validated)
- `search` (optional): Text search in act names

**Request Example:**
```http
GET /api/admin/legal-acts?domain=SSM&act_type=LEGE&status=validated
```

**Response 200 OK:**
```json
{
  "acts": [
    {
      "id": "uuid",
      "act_type": "LEGE",
      "act_number": "319",
      "act_year": 2006,
      "act_short_name": "LEGE 319/2006",
      "act_full_name": "LEGE nr. 319/2006 privind securitatea și sănătatea în muncă",
      "domain": "SSM",
      "domains": ["SSM"],
      "subdomains": ["evaluare_risc", "instructaj_ssm"],
      "status": "in_vigoare",
      "country_code": "RO",
      "confidence_level": "validated",
      "research_phase": "validated",
      "has_penalties": true,
      "penalty_min_lei": 2000,
      "penalty_max_lei": 100000,
      "ai_extraction_date": "2026-01-15T10:00:00.000Z",
      "validation_date": "2026-01-16T14:30:00.000Z",
      "validation_result": { "score": 87, "overall_status": "ok" },
      "display_mode": "expanded",
      "hierarchy_order": 1
    }
  ]
}
```

**Error 500 Internal Server Error:**
```json
{
  "error": "Error message"
}
```

---

### 10. Get Legal Act Details

**Endpoint:** `GET /api/admin/legal-acts/{id}`
**Auth Required:** Yes (Admin role)
**Description:** Returns detailed information about a specific legal act including obligations, penalties, and cross-references.

**Response 200 OK:**
```json
{
  "act": {
    "id": "uuid",
    "act_type": "LEGE",
    "act_number": "319",
    "act_year": 2006,
    "act_short_name": "LEGE 319/2006",
    "full_text": "Full text of the law...",
    "full_text_metadata": {
      "characters": 125430,
      "articles": 87,
      "chapters": 12
    },
    "ai_extraction_result": { "obligations": [...], "penalties": [...] }
  },
  "obligations": [
    {
      "id": "uuid",
      "legal_act_id": "uuid",
      "article_ref": "Art. 20 alin. (1) lit. c)",
      "obligation_type": "employer",
      "description": "Angajatorul trebuie să asigure instruirea angajaților",
      "original_text": "Text exact din lege...",
      "deadline_type": "periodic",
      "deadline_details": "La fiecare 6 luni pentru posturi cu risc ridicat",
      "applies_to": ["toate firmele"],
      "severity": "critical",
      "confidence": "high",
      "sort_order": 1,
      "review_status": "approved"
    }
  ],
  "penalties": [
    {
      "id": "uuid",
      "legal_act_id": "uuid",
      "article_ref": "Art. 50 alin. (1)",
      "violation_description": "Nerespectarea obligației de instruire periodică",
      "penalty_type": "amenda_contraventionala",
      "min_amount_lei": 2000,
      "max_amount_lei": 10000,
      "recipient": "angajator",
      "authority": "ITM",
      "confidence": "high"
    }
  ],
  "crossReferences": [
    {
      "id": "uuid",
      "act_a_id": "uuid",
      "source_article": "Art. 5",
      "target_act_type": "HG",
      "target_act_number": "1425",
      "target_act_year": 2006,
      "target_article": "Art. 10",
      "relationship_type": "trimite_la",
      "description": "Trimite la normele de aplicare"
    }
  ],
  "pipelineStatus": {
    "step": 4,
    "label": "Validat M3",
    "color": "green"
  },
  "reviewStats": {
    "obligations": {
      "total": 45,
      "pending": 2,
      "approved": 40,
      "rejected": 1,
      "edited": 2
    },
    "penalties": {
      "total": 12,
      "pending": 0,
      "approved": 12,
      "rejected": 0
    },
    "crossRefs": {
      "total": 8
    }
  }
}
```

**Error 404 Not Found:**
```json
{
  "error": "Act legislativ negăsit"
}
```

---

### 11. Import Legal Act (Manual Text)

**Endpoint:** `POST /api/admin/legal-import`
**Auth Required:** Yes (Admin role)
**Description:** Imports a legal act by manually providing the full text and metadata.

**Request Body:**
```json
{
  "full_text": "Full text of the law (minimum 100 characters)...",
  "act_type": "LEGE",
  "act_number": "319",
  "act_year": 2006,
  "act_full_name": "LEGE nr. 319/2006 privind securitatea și sănătatea în muncă",
  "act_short_name": "LEGE 319/2006",
  "official_journal": "M.Of. nr. 646 din 26.07.2006",
  "domain": "SSM",
  "domains": ["SSM"],
  "subdomains": ["evaluare_risc", "instructaj_ssm"],
  "status": "in_vigoare",
  "country_code": "RO",
  "eu_directives": ["89/391/CEE"],
  "full_text_metadata": {
    "characters": 125430,
    "articles": 87,
    "chapters": 12,
    "sections": 5
  },
  "notes": "Optional notes"
}
```

**Response 200 OK (New Insert):**
```json
{
  "success": true,
  "action": "inserted",
  "message": "LEGE 319/2006 importat cu succes!",
  "data": {
    "id": "uuid",
    "act_type": "LEGE",
    "act_number": "319",
    "act_year": 2006
  }
}
```

**Response 200 OK (Update Existing):**
```json
{
  "success": true,
  "action": "updated",
  "message": "LEGE 319/2006 actualizat cu succes. Textul anterior a fost înlocuit.",
  "data": {
    "id": "uuid",
    "act_type": "LEGE",
    "act_number": "319",
    "act_year": 2006
  }
}
```

**Error 400 Bad Request:**
```json
{
  "error": "Tip act, număr și an sunt obligatorii."
}
```

---

### 12. Fetch Legal Act from URL

**Endpoint:** `PUT /api/admin/legal-import`
**Auth Required:** Yes (Admin role)
**Description:** Fetches and extracts legal act text from legislatie.just.ro URL.

**Request Body:**
```json
{
  "url": "https://legislatie.just.ro/Public/DetaliiDocument/72764"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "text": "Extracted full text...",
  "metadata": {
    "actType": "LEGE",
    "actNumber": "319",
    "actYear": 2006,
    "actFullName": "LEGE nr. 319/2006 privind securitatea și sănătatea în muncă",
    "actShortName": "LEGE 319/2006",
    "officialJournal": "M.Of. nr. 646 din 26.07.2006",
    "euDirectives": ["89/391/CEE"],
    "counts": {
      "articles": 87,
      "chapters": 12,
      "sections": 5,
      "annexes": 2,
      "alineate": 234,
      "characters": 125430,
      "estimatedTokens": 31358
    }
  },
  "source_url": "https://legislatie.just.ro/Public/DetaliiDocument/72764",
  "characters": 125430
}
```

**Error 400 Bad Request:**
```json
{
  "error": "URL-ul trebuie să fie de pe legislatie.just.ro"
}
```

**Error 422 Unprocessable Entity:**
```json
{
  "error": "Nu am putut extrage text suficient din pagina indicată. Încearcă să copiezi manual textul..."
}
```

---

### 13. Extract Legal Obligations (AI - M2)

**Endpoint:** `POST /api/admin/legal-extract`
**Auth Required:** Yes (Admin role)
**Description:** Uses Claude AI to extract structured obligations, penalties, and cross-references from legal act text.

**Request Body:**
```json
{
  "act_id": "uuid-of-legal-act"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "act_short_name": "LEGE 319/2006",
  "chunks_processed": 3,
  "stats": {
    "obligations": 45,
    "obligations_employer": 38,
    "obligations_employee": 7,
    "penalties": 12,
    "cross_references": 8,
    "key_definitions": 15,
    "has_penalties": true,
    "penalty_range": "2,000 - 100,000 LEI"
  },
  "save_errors": null,
  "extraction": {
    "summary": "Legea-cadru în domeniul SSM...",
    "total_articles_found": 87,
    "obligations": [...],
    "penalties": [...],
    "cross_references": [...],
    "key_definitions": [...],
    "metadata": {...}
  }
}
```

**Error 400 Bad Request:**
```json
{
  "error": "Actul nu are text importat (full_text gol sau prea scurt)."
}
```

**Error 404 Not Found:**
```json
{
  "error": "Act negăsit: ID invalid"
}
```

---

### 14. Validate Legal Act (M3)

**Endpoint:** `POST /api/admin/legal-validate`
**Auth Required:** Yes (Admin role)
**Description:** Validates the quality and completeness of AI-extracted legal data.

**Request Body (Single Act):**
```json
{
  "act_id": "uuid-of-legal-act"
}
```

**Request Body (Batch):**
```json
{
  "batch": true
}
```

**Response 200 OK (Single):**
```json
{
  "success": true,
  "result": {
    "act_id": "uuid",
    "act_short_name": "LEGE 319/2006",
    "overall_status": "ok",
    "score": 87,
    "checks": [
      {
        "name": "article_coverage",
        "status": "ok",
        "message": "45/87 articole au obligații extrase (52%)",
        "details": {
          "text_articles": 87,
          "extracted_articles": 45,
          "coverage_percent": 52,
          "missing_articles": ["Art. 1", "Art. 2", "Art. 3"],
          "missing_total": 42
        }
      },
      {
        "name": "article_count_consistency",
        "status": "ok",
        "message": "Articole: AI=87, M1 regex=87, M3 regex=87 (diferență: 0)"
      },
      {
        "name": "obligations_quality",
        "status": "ok",
        "message": "45 obligații: 0 fără articol, 0 fără severity, 2 low confidence"
      },
      {
        "name": "penalties_validity",
        "status": "ok",
        "message": "12 sancțiuni, 0 probleme"
      },
      {
        "name": "cross_references",
        "status": "warning",
        "message": "8 referințe: 5 în DB, 3 lipsă (acte neimportate)"
      },
      {
        "name": "definitions_quality",
        "status": "ok",
        "message": "15 definiții: 0 fără articol, 0 incomplete"
      }
    ],
    "validated_at": "2026-02-13T12:00:00.000Z"
  }
}
```

**Response 200 OK (Batch):**
```json
{
  "success": true,
  "batch_stats": {
    "total": 25,
    "ok": 18,
    "warning": 5,
    "error": 2,
    "avg_score": 82
  },
  "results": [
    {
      "act_id": "uuid",
      "act_short_name": "LEGE 319/2006",
      "overall_status": "ok",
      "score": 87,
      "checks": [...],
      "validated_at": "2026-02-13T12:00:00.000Z"
    }
  ]
}
```

---

### 15. Batch Process Legal Acts (M2 + M3)

**Endpoint:** `POST /api/admin/legal-batch`
**Auth Required:** Yes (Admin role)
**Description:** Batch processes multiple legal acts: extracts with AI (M2) and validates (M3) automatically.

**Request Body:**
```json
{
  "steps": ["m2", "m3"]
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "m2_results": [
    {
      "success": true,
      "act_short_name": "LEGE 319/2006",
      "stats": {
        "obligations": 45,
        "penalties": 12,
        "cross_references": 8,
        "key_definitions": 15,
        "save_errors": null
      }
    }
  ],
  "m3_results": [
    {
      "act_short_name": "LEGE 319/2006",
      "score": 87,
      "overall_status": "ok"
    }
  ],
  "summary": {
    "m2_total": 5,
    "m2_success": 5,
    "m2_failed": 0,
    "m3_total": 5,
    "m3_ok": 4,
    "m3_warning": 1,
    "m3_error": 0,
    "m3_avg_score": 85
  },
  "duration_seconds": 127
}
```

---

### 16. Get Legal Taxonomy

**Endpoint:** `GET /api/admin/legal-taxonomy`
**Auth Required:** Yes (Admin role)
**Description:** Returns the legal taxonomy (domains and subdomains) for filtering.

**Response 200 OK:**
```json
{
  "taxonomy": [
    {
      "id": "uuid",
      "domain_code": "SSM",
      "domain_name": "Securitate și Sănătate în Muncă",
      "subdomain_code": "evaluare_risc",
      "subdomain_name": "Evaluare de Risc",
      "description": "Obligații privind evaluarea riscurilor la locul de muncă",
      "sort_order": 1,
      "is_active": true
    }
  ]
}
```

---

### 17. Update Legal Obligation Review Status

**Endpoint:** `PATCH /api/admin/legal-obligations/{id}`
**Auth Required:** Yes (Admin role)
**Description:** Updates the review status or edits a legal obligation extracted by AI.

**Request Body:**
```json
{
  "review_status": "approved",
  "review_notes": "Verificat și aprobat",
  "reviewed_by": "admin@s-s-m.ro",
  "description": "Updated description (optional)",
  "severity": "critical"
}
```

**Allowed Fields:**
- `review_status`: "pending" | "approved" | "rejected" | "edited"
- `review_notes`: string
- `reviewed_at`: ISO timestamp (auto-set)
- `reviewed_by`: string
- `description`: string
- `original_text`: string
- `article_ref`: string
- `obligation_type`: string
- `deadline_type`: string
- `deadline_details`: string
- `severity`: "critical" | "important" | "informative"
- `applies_to`: string[]

**Response 200 OK:**
```json
{
  "obligation": {
    "id": "uuid",
    "legal_act_id": "uuid",
    "article_ref": "Art. 20 alin. (1) lit. c)",
    "review_status": "approved",
    "review_notes": "Verificat și aprobat",
    "reviewed_at": "2026-02-13T12:30:00.000Z",
    "reviewed_by": "admin@s-s-m.ro",
    "updated_at": "2026-02-13T12:30:00.000Z"
  }
}
```

**Error 500 Internal Server Error:**
```json
{
  "error": "Eroare la actualizare obligație"
}
```

---

### 18. Update Legal Penalty Review Status

**Endpoint:** `PATCH /api/admin/legal-penalties/{id}`
**Auth Required:** Yes (Admin role)
**Description:** Updates the review status or edits a legal penalty extracted by AI.

**Request Body:**
```json
{
  "review_status": "approved",
  "review_notes": "Sume verificate",
  "reviewed_by": "admin@s-s-m.ro",
  "min_amount_lei": 2000,
  "max_amount_lei": 10000
}
```

**Allowed Fields:**
- `review_status`: "pending" | "approved" | "rejected"
- `review_notes`: string
- `reviewed_at`: ISO timestamp (auto-set)
- `reviewed_by`: string
- `violation_description`: string
- `penalty_type`: string
- `min_amount_lei`: number
- `max_amount_lei`: number
- `recipient`: string
- `authority`: string
- `article_ref`: string

**Response 200 OK:**
```json
{
  "penalty": {
    "id": "uuid",
    "legal_act_id": "uuid",
    "article_ref": "Art. 50 alin. (1)",
    "review_status": "approved",
    "review_notes": "Sume verificate",
    "reviewed_at": "2026-02-13T12:30:00.000Z",
    "reviewed_by": "admin@s-s-m.ro",
    "updated_at": "2026-02-13T12:30:00.000Z"
  }
}
```

---

## Error Codes

### Standard HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 400 | Bad Request | Invalid request parameters or body |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (duplicate) |
| 422 | Unprocessable Entity | Valid request but cannot be processed |
| 500 | Internal Server Error | Server-side error |
| 502 | Bad Gateway | External service error (e.g., URL fetch failed) |

### Common Error Response Format

All error responses follow this structure:

```json
{
  "error": "Human-readable error message",
  "details": "Optional additional details"
}
```

### Specific Error Scenarios

**Authentication Errors:**
- Missing `Authorization` header → 401
- Invalid `CRON_SECRET` → 401
- Expired Supabase session → 401

**Authorization Errors:**
- User not member of organization → 403
- Admin role required → 403

**Validation Errors:**
- Missing required fields → 400
- Invalid UUID format → 400
- Text too short (< 100 chars) → 400

**Resource Errors:**
- Act not found by ID → 404
- Connection not found → 404
- Session not found → 404

**Business Logic Errors:**
- Duplicate REGES connection → 409
- Act already imported (but returns 200 with "updated" action)

**External Service Errors:**
- legislatie.just.ro unreachable → 502
- Claude AI API error → 500
- Resend email API error → logged but doesn't fail the request

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/alerts/*` | 10 requests | 1 hour |
| `/api/generate-*` | 60 requests | 1 minute |
| `/api/reges/*` | 30 requests | 1 minute |
| `/api/admin/legal-extract` | 10 requests | 1 minute (Claude API limits) |
| `/api/admin/legal-batch` | 1 request | 5 minutes |

Rate limits are enforced by Vercel edge functions and Claude API quotas.

---

## Changelog

### Version 1.0 (2026-02-13)
- Initial API documentation
- 20+ endpoints documented
- Complete request/response examples
- Error codes reference
- Authentication guide

---

## Support

For API support or bug reports:
- Email: daniel.vicentiu@gmail.com
- GitHub: https://github.com/dvici/s-s-m
- Platform: https://app.s-s-m.ro

---

**Note:** This API is designed for the s-s-m.ro SSM/PSI compliance platform. All endpoints require proper authentication and follow Romanian data protection regulations (GDPR).
