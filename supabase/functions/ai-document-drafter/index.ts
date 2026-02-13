// AI Document Drafter Edge Function
// Generates complete SSM/PSI documents using Claude API
// Supports: instructiuni_proprii (internal instructions), procedura (procedures), regulament (regulations)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  document_type: 'instructiuni_proprii' | 'procedura' | 'regulament'
  context: {
    organization_name?: string
    industry: string
    risks?: string[]
    processes?: string[]
    employee_count?: number
    specific_requirements?: string
  }
  locale?: string
  max_tokens?: number
}

interface DocumentSection {
  section_number: string
  section_title: string
  content: string
  subsections?: DocumentSection[]
}

interface DocumentResponse {
  document_title: string
  document_subtitle?: string
  document_type: string
  version: string
  effective_date: string
  sections: DocumentSection[]
  legal_basis: string[]
  appendices?: string[]
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 8192

const DOCUMENT_TYPE_INFO = {
  instructiuni_proprii: {
    ro: {
      name: 'Instrucțiuni Proprii de Securitate și Sănătate în Muncă',
      description: 'Instrucțiuni interne specifice organizației, adaptate la locul de muncă și activitățile desfășurate',
      legal_base: 'Legea 319/2006 privind securitatea și sănătatea în muncă, HG 1425/2006',
    },
    en: {
      name: 'Internal Health and Safety Instructions',
      description: 'Organization-specific internal instructions adapted to workplace and activities',
      legal_base: 'Law 319/2006 on occupational health and safety, GD 1425/2006',
    },
  },
  procedura: {
    ro: {
      name: 'Procedură de Securitate și Sănătate în Muncă',
      description: 'Procedură operațională detaliată pentru activități sau procese specifice',
      legal_base: 'Legea 319/2006, Ordin 1091/2016 privind cerințele minime de SSM',
    },
    en: {
      name: 'Health and Safety Procedure',
      description: 'Detailed operational procedure for specific activities or processes',
      legal_base: 'Law 319/2006, Order 1091/2016 on minimum OSH requirements',
    },
  },
  regulament: {
    ro: {
      name: 'Regulament Intern de Securitate și Sănătate în Muncă',
      description: 'Regulament cuprinzător care stabilește reguli generale și responsabilități',
      legal_base: 'Legea 319/2006, Legea 53/2003 Codul Muncii, HG 1425/2006',
    },
    en: {
      name: 'Internal Health and Safety Regulations',
      description: 'Comprehensive regulation establishing general rules and responsibilities',
      legal_base: 'Law 319/2006, Law 53/2003 Labor Code, GD 1425/2006',
    },
  },
}

const ROMANIAN_SSM_LEGISLATION = `
RELEVANT ROMANIAN SSM/PSI LEGISLATION:

1. **Legea nr. 319/2006** - Legea securității și sănătății în muncă
   - Art. 6: Obligațiile angajatorului
   - Art. 7: Evaluarea riscurilor
   - Art. 8: Instruirea lucrătorilor
   - Art. 9-11: Echipament de protecție

2. **Hotărârea Guvernului nr. 1425/2006** - Cerințe minime SSM
   - Cap. II: Obligații generale ale angajatorilor
   - Cap. III: Amenajarea locurilor de muncă
   - Cap. IV: Echipament individual de protecție

3. **Ordin nr. 1091/2016** - Proceduri de informare și consultare
   - Informarea și instruirea lucrătorilor
   - Consultarea reprezentanților lucrătorilor
   - Participarea lucrătorilor

4. **Legea nr. 307/2006** - Legea privind apărarea împotriva incendiilor
   - Art. 10-15: Obligații de PSI
   - Autorizarea de securitate la incendiu
   - Planuri de evacuare și intervenție

5. **Ordinul nr. 95/2016** - Regulament de PSI
   - Cap. II: Măsuri generale de PSI
   - Cap. III: Planuri de evacuare
   - Cap. IV: Instrucțiuni de apărare împotriva incendiilor

6. **Legea nr. 53/2003** - Codul Muncii (relevant pentru SSM)
   - Art. 175-182: Sănătatea și securitatea în muncă
   - Art. 183: Drepturile lucrătorilor
   - Art. 184: Obligațiile lucrătorilor

7. **Norme metodologice și ordine complementare**:
   - HG 971/2006 - Cerințe minime pentru șantiere
   - HG 1146/2006 - Atmosfere explozive (ATEX)
   - Ordin 508/2002 - Autorizarea personalului PSI
`

function buildDocumentPrompt(documentType: string, context: RequestBody['context'], locale: string): string {
  const docInfo = DOCUMENT_TYPE_INFO[documentType as keyof typeof DOCUMENT_TYPE_INFO]
  const lang = locale === 'ro' ? 'ro' : 'en'
  const docTypeInfo = docInfo[lang]

  return `You are an expert SSM/PSI (Occupational Health & Safety / Fire Safety) consultant with 20+ years of experience in Romania.

${ROMANIAN_SSM_LEGISLATION}

Generate a complete, professional, legally-compliant ${docTypeInfo.name} document.

**Document Type**: ${docTypeInfo.name}
**Description**: ${docTypeInfo.description}
**Legal Basis**: ${docTypeInfo.legal_base}

**Organization Context**:
${context.organization_name ? `- Organization: ${context.organization_name}` : ''}
- Industry: ${context.industry}
${context.employee_count ? `- Number of employees: ${context.employee_count}` : ''}
${context.risks && context.risks.length > 0 ? `- Identified risks: ${context.risks.join(', ')}` : ''}
${context.processes && context.processes.length > 0 ? `- Key processes: ${context.processes.join(', ')}` : ''}
${context.specific_requirements ? `- Specific requirements: ${context.specific_requirements}` : ''}

**Language**: ${lang === 'ro' ? 'Romanian' : 'English'}

Generate a comprehensive document with the following structure:

1. **document_title** - Official document title (in ${lang === 'ro' ? 'Romanian' : 'English'})
2. **document_subtitle** - Optional subtitle with organization name
3. **document_type** - Type of document (${documentType})
4. **version** - Version number (e.g., "1.0")
5. **effective_date** - Effective date (e.g., "2026-02-13")
6. **sections** - Array of main sections, each containing:
   - **section_number**: Section number (e.g., "I", "II", "1", "2")
   - **section_title**: Section title
   - **content**: Full HTML content for this section (use proper HTML tags: <p>, <ul>, <li>, <strong>, <em>, <br>)
   - **subsections**: Optional array of nested subsections (same structure)

7. **legal_basis** - Array of legal references (legislation articles, laws, government decisions)
8. **appendices** - Optional array of appendix titles

**CRITICAL REQUIREMENTS**:

1. **Content must be complete and detailed** - NOT just outlines or templates
   - Each section must have FULL, detailed content (minimum 200-500 words per major section)
   - Include specific procedures, step-by-step instructions, concrete examples
   - DO NOT use placeholders like "[to be completed]" or "[insert company name]"
   - Write actual, usable content that can be directly used by the organization

2. **Industry-specific content**:
   - Tailor ALL content to ${context.industry}
   - Include industry-specific risks, hazards, and procedures
   - Reference industry-specific equipment and processes
   - Use realistic examples from ${context.industry}

3. **Legal compliance**:
   - Reference specific articles from Romanian legislation
   - Ensure all requirements from Legea 319/2006 are addressed
   - Include PSI requirements where applicable (Legea 307/2006)
   - Cite specific legal obligations and penalties

4. **Professional structure**:
   ${documentType === 'instructiuni_proprii' ? `
   - Cap. I: Dispoziții generale (scope, definitions, responsibilities)
   - Cap. II: Identificarea riscurilor specifice (detailed risk analysis)
   - Cap. III: Măsuri de prevenire și protecție (specific preventive measures)
   - Cap. IV: Echipament de protecție (PPE requirements and usage)
   - Cap. V: Proceduri în caz de urgență (emergency procedures)
   - Cap. VI: Răspunderi și sancțiuni (responsibilities and penalties)
   ` : ''}
   ${documentType === 'procedura' ? `
   - Cap. I: Obiectiv și domeniu de aplicare
   - Cap. II: Documente de referință
   - Cap. III: Termeni și definiții
   - Cap. IV: Descrierea procedurii (detailed step-by-step)
   - Cap. V: Responsabilități
   - Cap. VI: Înregistrări și evidențe
   ` : ''}
   ${documentType === 'regulament' ? `
   - Cap. I: Dispoziții generale
   - Cap. II: Organizarea activității de SSM
   - Cap. III: Drepturile și obligațiile părților
   - Cap. IV: Măsuri generale de SSM
   - Cap. V: Instruirea lucrătorilor
   - Cap. VI: Controlul medical
   - Cap. VII: Echipament de protecție
   - Cap. VIII: Măsuri PSI (fire safety)
   - Cap. IX: Răspunderi și sancțiuni disciplinare
   - Cap. X: Dispoziții finale
   ` : ''}

5. **HTML formatting**:
   - Use proper semantic HTML in content field
   - Format lists as <ul><li>...</li></ul>
   - Use <strong> for important terms
   - Use <p> for paragraphs
   - Use <br> sparingly (prefer proper paragraphs)

6. **Realistic and actionable**:
   - Include specific time frames (e.g., "instruire anuală", "verificare lunară")
   - Name specific responsible roles (e.g., "șef departament", "responsabil SSM", "director general")
   - Include concrete metrics and thresholds
   - Provide specific examples of violations and consequences

Return ONLY a valid JSON object matching this exact structure:
{
  "document_title": "string",
  "document_subtitle": "string",
  "document_type": "string",
  "version": "string",
  "effective_date": "YYYY-MM-DD",
  "sections": [
    {
      "section_number": "string",
      "section_title": "string",
      "content": "HTML string with detailed content",
      "subsections": [/* optional nested sections */]
    }
  ],
  "legal_basis": ["string"],
  "appendices": ["string"]
}

Return ONLY the JSON object, no explanations or markdown code blocks.`
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse request body
    const body: RequestBody = await req.json()
    const {
      document_type,
      context,
      locale = 'ro',
      max_tokens = DEFAULT_MAX_TOKENS
    } = body

    // Validate document_type
    const validTypes = ['instructiuni_proprii', 'procedura', 'regulament']
    if (!document_type || !validTypes.includes(document_type)) {
      return new Response(
        JSON.stringify({
          error: `Invalid document_type. Must be one of: ${validTypes.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate context
    if (!context || typeof context !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid context parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!context.industry || typeof context.industry !== 'string' || context.industry.length < 3) {
      return new Response(
        JSON.stringify({ error: 'context.industry is required (minimum 3 characters)' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate max_tokens
    if (max_tokens < 2000 || max_tokens > 16000) {
      return new Response(
        JSON.stringify({ error: 'max_tokens must be between 2000 and 16000' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get API key from environment
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Build prompt
    const prompt = buildDocumentPrompt(document_type, context, locale)

    // Call Claude API
    console.log(`Generating ${document_type} document for industry: ${context.industry}`)
    const claudeResponse = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: max_tokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      console.error('Claude API error:', errorText)
      return new Response(
        JSON.stringify({
          error: 'AI service error',
          details: `Status ${claudeResponse.status}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const claudeData = await claudeResponse.json()
    const generatedText = claudeData.content?.[0]?.text

    if (!generatedText) {
      console.error('No text in Claude response:', claudeData)
      return new Response(
        JSON.stringify({ error: 'No response from AI service' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse generated document
    let document: DocumentResponse
    try {
      // Clean potential markdown code blocks
      const cleanedText = generatedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      document = JSON.parse(cleanedText)

      // Validate structure
      if (!document.document_title || !Array.isArray(document.sections)) {
        throw new Error('Invalid document structure: missing required fields')
      }

      if (document.sections.length === 0) {
        throw new Error('Document must have at least one section')
      }

      if (!Array.isArray(document.legal_basis) || document.legal_basis.length === 0) {
        throw new Error('Document must have legal basis')
      }

      // Validate each section
      document.sections.forEach((section, index) => {
        if (
          !section.section_number ||
          !section.section_title ||
          !section.content
        ) {
          throw new Error(`Invalid section structure at index ${index}`)
        }

        // Validate content is not empty or placeholder
        const contentText = section.content.replace(/<[^>]*>/g, '').trim()
        if (contentText.length < 50) {
          throw new Error(`Section ${index} content too short (minimum 50 characters)`)
        }
      })

    } catch (parseError) {
      console.error('Failed to parse document:', parseError)
      console.error('Raw response:', generatedText)
      return new Response(
        JSON.stringify({
          error: 'Failed to parse AI response',
          message: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
          raw_response: generatedText.substring(0, 1000),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate full HTML document
    const htmlDocument = generateHTMLDocument(document)

    console.log(`Successfully generated ${document_type} with ${document.sections.length} sections`)

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        document: document,
        html: htmlDocument,
        metadata: {
          document_type,
          industry: context.industry,
          locale,
          sections_count: document.sections.length,
          legal_references_count: document.legal_basis.length,
          model: 'claude-sonnet-4-5-20250929',
          tokens_used: claudeData.usage,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

// Helper function to generate complete HTML document
function generateHTMLDocument(doc: DocumentResponse): string {
  const sectionsHtml = doc.sections.map(section => generateSectionHTML(section)).join('\n')

  const legalBasisHtml = doc.legal_basis.map(ref => `<li>${ref}</li>`).join('\n')

  const appendicesHtml = doc.appendices && doc.appendices.length > 0
    ? `
      <section class="appendices">
        <h2>Anexe</h2>
        <ul>
          ${doc.appendices.map(app => `<li>${app}</li>`).join('\n')}
        </ul>
      </section>
    `
    : ''

  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.document_title}</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      line-height: 1.6;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
    .metadata {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-top: 20px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #1a1a1a;
    }
    .section-content {
      font-size: 14px;
      text-align: justify;
    }
    .subsection {
      margin-left: 20px;
      margin-top: 15px;
    }
    .subsection-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }
    li {
      margin-bottom: 8px;
    }
    .legal-basis {
      margin-top: 40px;
      padding: 20px;
      background-color: #f9f9f9;
      border-left: 4px solid #333;
    }
    .legal-basis h2 {
      font-size: 16px;
      margin-bottom: 15px;
    }
    .legal-basis ul {
      list-style-type: none;
      padding-left: 0;
    }
    .legal-basis li {
      margin-bottom: 8px;
      font-size: 13px;
    }
    .appendices {
      margin-top: 30px;
      page-break-before: always;
    }
    strong {
      font-weight: bold;
    }
    em {
      font-style: italic;
    }
    @media print {
      body {
        padding: 0;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${doc.document_title}</h1>
    ${doc.document_subtitle ? `<div class="subtitle">${doc.document_subtitle}</div>` : ''}
    <div class="metadata">
      <span>Versiunea: ${doc.version}</span>
      <span>Data intrării în vigoare: ${doc.effective_date}</span>
    </div>
  </div>

  ${sectionsHtml}

  <div class="legal-basis">
    <h2>Bază Legală</h2>
    <ul>
      ${legalBasisHtml}
    </ul>
  </div>

  ${appendicesHtml}
</body>
</html>`
}

// Helper function to generate HTML for a section (recursive for subsections)
function generateSectionHTML(section: DocumentSection, level: number = 1): string {
  const subsectionsHtml = section.subsections
    ? section.subsections.map(sub => generateSectionHTML(sub, level + 1)).join('\n')
    : ''

  const sectionClass = level === 1 ? 'section' : 'subsection'
  const titleClass = level === 1 ? 'section-title' : 'subsection-title'

  return `
  <div class="${sectionClass}">
    <div class="${titleClass}">${section.section_number}. ${section.section_title}</div>
    <div class="section-content">
      ${section.content}
    </div>
    ${subsectionsHtml}
  </div>`
}
