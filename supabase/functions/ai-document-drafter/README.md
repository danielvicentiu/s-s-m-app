# AI Document Drafter Edge Function

Edge Function that generates complete SSM/PSI compliance documents using Claude API.

## Features

- **Document Types**:
  - `instructiuni_proprii` - Internal Safety Instructions
  - `procedura` - Safety Procedures
  - `regulament` - Internal Safety Regulations

- **Capabilities**:
  - Generates complete, structured documents with proper sections
  - Industry-specific content based on risks and processes
  - Full legal basis references (Romanian SSM/PSI legislation)
  - Professional HTML output with print-ready styling
  - Signature blocks and revision tracking

## Request Format

```typescript
POST /ai-document-drafter
Content-Type: application/json

{
  "document_type": "instructiuni_proprii" | "procedura" | "regulament",
  "context": {
    "industry": string,              // Required: e.g., "Fabricație metale", "Construcții"
    "company_name": string,          // Optional: Company name for headers
    "risks": string[],               // Optional: Identified workplace risks
    "processes": string[],           // Optional: Work processes/activities
    "equipment": string[],           // Optional: Equipment/machinery used
    "additional_info": string        // Optional: Additional context
  },
  "max_tokens": number               // Optional: 1000-16384, default 8192
}
```

## Examples

### 1. Generate Internal Safety Instructions

```bash
curl -X POST https://[project-ref].supabase.co/functions/v1/ai-document-drafter \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{
    "document_type": "instructiuni_proprii",
    "context": {
      "industry": "Fabricație mobilier",
      "company_name": "S.C. MOBILA EXPERT S.R.L.",
      "risks": [
        "Tăieri și lovituri cu utilaje de tâmplărie",
        "Zgomot excesiv",
        "Praf de lemn",
        "Incendiu materiale combustibile"
      ],
      "processes": [
        "Tăiere lemn cu fierăstrău circular",
        "Rindeluire",
        "Frezare",
        "Finisare și vopsire"
      ],
      "equipment": [
        "Fierăstrău circular",
        "Rindea electrică",
        "Freză",
        "Mașină de şlefuit"
      ]
    }
  }'
```

### 2. Generate Safety Procedure

```bash
curl -X POST https://[project-ref].supabase.co/functions/v1/ai-document-drafter \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{
    "document_type": "procedura",
    "context": {
      "industry": "Construcții",
      "company_name": "S.C. CONSTRUCT SIGUR S.R.L.",
      "risks": [
        "Căzături de la înălțime",
        "Prăbușire schelă",
        "Electrocutare",
        "Căzură obiecte din înălțime"
      ],
      "processes": [
        "Montare schelă mobilă",
        "Lucrări la înălțime peste 2m",
        "Utilizare centuri de siguranță"
      ],
      "equipment": [
        "Schelă mobilă",
        "Centuri de siguranță",
        "Căști de protecție",
        "Plase de protecție"
      ],
      "additional_info": "Procedura se aplică pentru lucrări de tencuială exterioară la clădiri cu înălțime până la 12m"
    }
  }'
```

### 3. Generate Internal Safety Regulations

```bash
curl -X POST https://[project-ref].supabase.co/functions/v1/ai-document-drafter \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{
    "document_type": "regulament",
    "context": {
      "industry": "Producție industrială",
      "company_name": "S.C. INDUSTRIA ROMANIA S.A.",
      "risks": [
        "Riscuri mecanice",
        "Riscuri electrice",
        "Riscuri chimice",
        "Incendiu și explozie",
        "Zgomot și vibrații"
      ],
      "processes": [
        "Producție echipamente industriale",
        "Sudură și debitare metale",
        "Tratamente termice",
        "Control calitate"
      ],
      "equipment": [
        "Mașini-unelte CNC",
        "Echipamente de sudură",
        "Cuptoare industriale",
        "Poduri rulante"
      ],
      "additional_info": "Companie cu 150 angajați, 3 hale de producție, program 3 schimburi"
    },
    "max_tokens": 12000
  }'
```

## Response Format

```typescript
{
  "success": true,
  "document_type": "instructiuni_proprii" | "procedura" | "regulament",
  "document": {
    "title": string,
    "subtitle": string,
    "introduction": string,           // HTML formatted
    "sections": [
      {
        "section_number": string,     // e.g., "I", "1", "CAP. I"
        "section_title": string,
        "section_content": string,    // HTML formatted
        "subsections": [              // Optional nested sections
          {
            "section_number": string,
            "section_title": string,
            "section_content": string
          }
        ]
      }
    ],
    "legal_basis": string[],          // Romanian SSM/PSI laws
    "approval_section": string,       // HTML formatted signature blocks
    "revision_info": string           // Version and date info
  },
  "html": string,                     // Complete HTML document ready for display/print
  "metadata": {
    "sections_count": number,
    "legal_references_count": number,
    "model": "claude-sonnet-4-5-20250929",
    "tokens_used": {
      "input_tokens": number,
      "output_tokens": number
    },
    "generated_at": string            // ISO 8601 timestamp
  }
}
```

## Document Structure

### Instrucțiuni Proprii (Internal Safety Instructions)
- 5-8 main sections
- Includes: general provisions, admission requirements, risks and prevention, PPE, conduct rules, emergency procedures, sanctions
- 2-3 paragraphs per section minimum

### Procedură (Safety Procedure)
- 8-10 main sections
- Includes: purpose, scope, responsibilities, definitions, step-by-step procedure, risks/controls, equipment, emergencies, records
- Detailed sequential steps

### Regulament (Internal Safety Regulations)
- 10-12 chapters (CAPITOLUL I, II, etc.)
- 60+ articles (Art. 1, 2, 3, etc.)
- Comprehensive coverage: organization, rights, obligations, general rules, PPE, fire safety, first aid, investigations, sanctions
- Legal/regulatory language

## HTML Output

The `html` field contains a complete, print-ready HTML document with:
- Professional styling (A4 page format)
- Proper headings and sections
- Legal basis highlighted section
- Signature blocks
- Revision information
- Print-optimized CSS

You can directly display this HTML in an iframe or save as PDF.

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid document_type parameter",
  "valid_types": ["instructiuni_proprii", "procedura", "regulament"]
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to parse AI response",
  "details": "Missing title or introduction",
  "raw_response": "..."
}
```

## Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Claude API key for document generation

## Technical Details

- **Model**: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **Token Range**: 1000-16384 (default: 8192)
- **Language**: Romanian (for all document content)
- **Legal Framework**: Romanian SSM/PSI legislation (Legea 319/2006, HG 1425/2006, Legea 307/2006, etc.)

## Use Cases

1. **Automated Document Generation**: Generate compliance documents for new clients/companies
2. **Template Creation**: Create customized safety documents based on specific industries
3. **Compliance Acceleration**: Reduce document creation time from days to minutes
4. **Consistency**: Ensure all documents follow proper structure and include required elements
5. **Legal Compliance**: Automatic inclusion of relevant Romanian legislation references

## Integration Example

```typescript
// Client-side integration
async function generateSafetyInstructions(context: DocumentContext) {
  const response = await fetch('/api/v1/documents/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      document_type: 'instructiuni_proprii',
      context: context
    })
  });

  const data = await response.json();

  // Display HTML document
  document.getElementById('preview').innerHTML = data.html;

  // Or save structured data
  await saveDocument(data.document);
}
```

## Notes

- Documents are generated in Romanian language
- All legal references are based on Romanian SSM/PSI legislation
- HTML output is print-ready and can be converted to PDF
- Generated documents should be reviewed by qualified SSM personnel before official use
- Token usage varies based on document complexity (typically 6000-12000 output tokens)
