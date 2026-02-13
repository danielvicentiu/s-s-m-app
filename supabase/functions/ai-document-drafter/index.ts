// AI Document Drafter Edge Function
// Generates complete SSM/PSI compliance documents using Claude API
// Supports: instructiuni_proprii, procedura, regulament
// Returns structured HTML document with sections, content, and legal basis

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

type DocumentType = 'instructiuni_proprii' | 'procedura' | 'regulament'

interface DocumentContext {
  industry: string
  company_name?: string
  risks?: string[]
  processes?: string[]
  equipment?: string[]
  additional_info?: string
}

interface RequestBody {
  document_type: DocumentType
  context: DocumentContext
  max_tokens?: number
}

interface DocumentSection {
  section_number: string
  section_title: string
  section_content: string
  subsections?: DocumentSection[]
}

interface GeneratedDocument {
  title: string
  subtitle?: string
  introduction: string
  sections: DocumentSection[]
  legal_basis: string[]
  approval_section: string
  revision_info: string
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MAX_TOKENS = 8192

const DOCUMENT_PROMPTS: Record<DocumentType, string> = {
  instructiuni_proprii: `You are a Romanian SSM/PSI expert. Generate comprehensive "Instrucțiuni Proprii de Securitate și Sănătate în Muncă" (Internal Safety Instructions) for the given workplace context.

**DOCUMENT STRUCTURE:**

1. **Title**: "INSTRUCȚIUNI PROPRII DE SECURITATE ȘI SĂNĂTATE ÎN MUNCĂ"
2. **Subtitle**: Company name + specific area/activity
3. **Introduction**: Purpose, scope, applicability (2-3 paragraphs)
4. **Main Sections** (numbered 1., 2., 3., etc.):
   - I. DISPOZIȚII GENERALE (scope, definitions, responsibilities)
   - II. CONDIȚII DE ADMITERE LA LOCUL DE MUNCĂ (training, medical, PPE requirements)
   - III. RISCURI IDENTIFICATE ȘI MĂSURI DE PREVENIRE (specific to context)
   - IV. ECHIPAMENTE DE PROTECȚIE (required PPE by activity)
   - V. REGULI DE CONDUITĂ ȘI COMPORTAMENT (do's and don'ts)
   - VI. MĂSURI ÎN CAZ DE ACCIDENT/INCIDENT (emergency procedures)
   - VII. SANCȚIUNI (disciplinary measures for non-compliance)
5. **Legal Basis**: List of applicable Romanian laws (Legea 319/2006, HG 1425/2006, etc.)
6. **Approval Section**: Signature blocks (Elaborat, Verificat, Aprobat)
7. **Revision Info**: Version, date, revision number

**REQUIREMENTS:**
- Use formal Romanian language, present tense for instructions
- Be specific to the industry and risks provided
- Include minimum 5-8 main sections
- Each section must have detailed, actionable content (not generic)
- Reference specific Romanian SSM/PSI legislation
- Include specific PPE for identified risks
- Include specific emergency procedures
- Minimum 2-3 paragraphs per section

**CONTEXT:**
- Industry: {industry}
- Company: {company_name}
- Identified Risks: {risks}
- Work Processes: {processes}
- Equipment Used: {equipment}
{additional_info}`,

  procedura: `You are a Romanian SSM/PSI expert. Generate a comprehensive "Procedură de Securitate și Sănătate în Muncă" (Safety Procedure) for the given workplace context.

**DOCUMENT STRUCTURE:**

1. **Title**: "PROCEDURĂ DE SECURITATE ȘI SĂNĂTATE ÎN MUNCĂ"
2. **Subtitle**: Specific procedure name (e.g., "Procedura de lucru la înălțime")
3. **Introduction**: Purpose, scope, applicability, definitions (2-3 paragraphs)
4. **Main Sections** (numbered 1., 2., 3., etc.):
   - I. SCOPUL PROCEDURII
   - II. DOMENIUL DE APLICARE
   - III. RESPONSABILITĂȚI (by role: manager, supervisor, worker)
   - IV. DEFINIȚII ȘI ABREVIERI
   - V. DESCRIEREA PROCEDURII (step-by-step process)
   - VI. RISCURI ȘI MĂSURI DE CONTROL
   - VII. ECHIPAMENTE ȘI MIJLOACE NECESARE
   - VIII. SITUAȚII DE URGENȚĂ
   - IX. ÎNREGISTRĂRI ȘI DOCUMENTE AFERENTE
   - X. ANEXE (if applicable)
5. **Legal Basis**: Applicable legislation and standards
6. **Approval Section**: Signature blocks
7. **Revision Info**: Version control

**REQUIREMENTS:**
- Use procedural language (imperative, step-by-step)
- Include specific roles and responsibilities
- Provide detailed, sequential steps for the procedure
- Include risk control measures for each step
- Reference specific equipment, tools, PPE
- Include checklists where appropriate
- Minimum 8-10 main sections
- Each section detailed and specific to context

**CONTEXT:**
- Industry: {industry}
- Company: {company_name}
- Identified Risks: {risks}
- Work Processes: {processes}
- Equipment Used: {equipment}
{additional_info}`,

  regulament: `You are a Romanian SSM/PSI expert. Generate a comprehensive "Regulament Intern de Securitate și Sănătate în Muncă" (Internal Safety Regulations) for the given workplace context.

**DOCUMENT STRUCTURE:**

1. **Title**: "REGULAMENT INTERN DE SECURITATE ȘI SĂNĂTATE ÎN MUNCĂ"
2. **Subtitle**: Company name
3. **Introduction**: Legal basis, purpose, scope (2-3 paragraphs)
4. **Chapters** (CAPITOLUL I, II, III, etc.) with Articles (Art. 1, 2, 3, etc.):
   - CAP. I - DISPOZIȚII GENERALE (Art. 1-5: scope, definitions, applicability)
   - CAP. II - ORGANIZAREA SSM (Art. 6-12: structure, committee, responsibilities)
   - CAP. III - DREPTURILE ȘI OBLIGAȚIILE ANGAJATORULUI (Art. 13-20)
   - CAP. IV - DREPTURILE ȘI OBLIGAȚIILE LUCRĂTORILOR (Art. 21-28)
   - CAP. V - INSTRUCȚIUNI GENERALE DE SSM (Art. 29-35: general safety rules)
   - CAP. VI - ECHIPAMENTE DE PROTECȚIE (Art. 36-40: PPE requirements)
   - CAP. VII - PROTECȚIA ÎMPOTRIVA INCENDIILOR (Art. 41-48: fire safety)
   - CAP. VIII - ACORDAREA PRIMULUI AJUTOR (Art. 49-52)
   - CAP. IX - CERCETAREA ACCIDENTELOR (Art. 53-57: incident investigation)
   - CAP. X - SANCȚIUNI (Art. 58-62: penalties for violations)
   - CAP. XI - DISPOZIȚII FINALE (Art. 63-65)
5. **Legal Basis**: Complete list of applicable laws
6. **Approval Section**: Employer signature, union consultation
7. **Revision Info**: Effective date, revision number

**REQUIREMENTS:**
- Use legal/regulatory language (Art. X format)
- Minimum 10-12 chapters, 60+ articles
- Each article must be specific, clear, and actionable
- Include both employer and employee rights/obligations
- Cover all aspects: organization, prevention, emergency, sanctions
- Reference all relevant Romanian SSM/PSI legislation
- Industry-specific requirements based on context
- Detailed and comprehensive (this is the main safety regulation)

**CONTEXT:**
- Industry: {industry}
- Company: {company_name}
- Identified Risks: {risks}
- Work Processes: {processes}
- Equipment Used: {equipment}
{additional_info}`,
}

const OUTPUT_FORMAT_INSTRUCTION = `

**OUTPUT FORMAT:**
Return ONLY a valid JSON object with this structure:
{
  "title": "string",
  "subtitle": "string",
  "introduction": "string (2-3 paragraphs in HTML format with <p> tags)",
  "sections": [
    {
      "section_number": "string (e.g., 'I', '1', 'CAP. I')",
      "section_title": "string",
      "section_content": "string (HTML format with <p>, <ul>, <li>, <strong> tags)",
      "subsections": [
        {
          "section_number": "string (e.g., '1.1', 'Art. 5')",
          "section_title": "string",
          "section_content": "string (HTML format)"
        }
      ]
    }
  ],
  "legal_basis": ["string (e.g., 'Legea 319/2006 privind SSM')", ...],
  "approval_section": "string (HTML format with signature blocks)",
  "revision_info": "string (e.g., 'Rev. 01 / Data: {current_date} / Ediția: 1')"
}

**HTML FORMATTING RULES:**
- Use <p> for paragraphs
- Use <ul><li> for lists
- Use <strong> for emphasis
- Use <br> for line breaks within sections
- Keep HTML clean and semantic
- NO markdown, ONLY HTML

Return ONLY the JSON object, no explanations or markdown code blocks.`

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
      max_tokens = DEFAULT_MAX_TOKENS,
    } = body

    // Validate document_type
    const validTypes: DocumentType[] = ['instructiuni_proprii', 'procedura', 'regulament']
    if (!document_type || !validTypes.includes(document_type)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid document_type parameter',
          valid_types: validTypes,
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

    if (!context.industry || typeof context.industry !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid context.industry parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate max_tokens
    if (max_tokens < 1000 || max_tokens > 16384) {
      return new Response(
        JSON.stringify({ error: 'max_tokens must be between 1000 and 16384' }),
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

    // Build context strings
    const companyName = context.company_name || 'S.C. [NUME COMPANIE] S.R.L.'
    const risksStr = context.risks?.length ? context.risks.join(', ') : 'riscuri generale SSM/PSI'
    const processesStr = context.processes?.length ? context.processes.join(', ') : 'procese generale de muncă'
    const equipmentStr = context.equipment?.length ? context.equipment.join(', ') : 'echipamente generale'
    const additionalInfoStr = context.additional_info
      ? `\n- Additional Information: ${context.additional_info}`
      : ''

    // Get prompt template
    const promptTemplate = DOCUMENT_PROMPTS[document_type]

    // Construct full prompt
    const currentDate = new Date().toISOString().split('T')[0]
    const fullPrompt = promptTemplate
      .replace('{industry}', context.industry)
      .replace('{company_name}', companyName)
      .replace('{risks}', risksStr)
      .replace('{processes}', processesStr)
      .replace('{equipment}', equipmentStr)
      .replace('{additional_info}', additionalInfoStr)
      .replace('{current_date}', currentDate) + OUTPUT_FORMAT_INSTRUCTION

    // Call Claude API
    console.log(`Generating ${document_type} document...`)
    console.log(`Context: industry=${context.industry}, company=${companyName}`)

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
            content: fullPrompt,
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
    const extractedText = claudeData.content?.[0]?.text

    if (!extractedText) {
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
    let generatedDocument: GeneratedDocument
    try {
      // Clean potential markdown code blocks
      const cleanedText = extractedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      generatedDocument = JSON.parse(cleanedText)

      // Validate structure
      if (!generatedDocument.title || !generatedDocument.introduction) {
        throw new Error('Missing title or introduction')
      }

      if (!Array.isArray(generatedDocument.sections) || generatedDocument.sections.length === 0) {
        throw new Error('Missing or empty sections array')
      }

      if (!Array.isArray(generatedDocument.legal_basis) || generatedDocument.legal_basis.length === 0) {
        throw new Error('Missing or empty legal_basis array')
      }

      if (!generatedDocument.approval_section || !generatedDocument.revision_info) {
        throw new Error('Missing approval_section or revision_info')
      }

      // Validate each section
      generatedDocument.sections.forEach((section, index) => {
        if (!section.section_number || !section.section_title || !section.section_content) {
          throw new Error(`Invalid section structure at index ${index}`)
        }
      })

    } catch (parseError) {
      console.error('Failed to parse document:', parseError)
      console.error('Raw response:', extractedText.substring(0, 500))
      return new Response(
        JSON.stringify({
          error: 'Failed to parse AI response',
          details: parseError instanceof Error ? parseError.message : 'Unknown error',
          raw_response: extractedText.substring(0, 500),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate complete HTML document
    const htmlDocument = generateHTMLDocument(generatedDocument, document_type)

    console.log(`Successfully generated ${document_type} with ${generatedDocument.sections.length} sections`)

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        document_type,
        document: generatedDocument,
        html: htmlDocument,
        metadata: {
          sections_count: generatedDocument.sections.length,
          legal_references_count: generatedDocument.legal_basis.length,
          model: 'claude-sonnet-4-5-20250929',
          tokens_used: claudeData.usage,
          generated_at: new Date().toISOString(),
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

/**
 * Generate complete HTML document from structured data
 */
function generateHTMLDocument(doc: GeneratedDocument, documentType: DocumentType): string {
  const currentDate = new Date().toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const sectionsHTML = doc.sections
    .map((section) => {
      const subsectionsHTML = section.subsections
        ? section.subsections
            .map(
              (sub) => `
        <div class="subsection">
          <h4>${sub.section_number}. ${sub.section_title}</h4>
          <div class="content">${sub.section_content}</div>
        </div>
      `
            )
            .join('')
        : ''

      return `
    <div class="section">
      <h3>${section.section_number}. ${section.section_title}</h3>
      <div class="content">${section.section_content}</div>
      ${subsectionsHTML}
    </div>
  `
    })
    .join('')

  const legalBasisHTML = doc.legal_basis.map((law) => `<li>${law}</li>`).join('')

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      background: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    .header h1 {
      font-size: 20pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #1e40af;
      margin-bottom: 10px;
    }
    .header h2 {
      font-size: 14pt;
      color: #475569;
      font-weight: normal;
    }
    .introduction {
      margin: 30px 0;
      padding: 20px;
      background: #f8fafc;
      border-left: 4px solid #2563eb;
    }
    .introduction p {
      margin-bottom: 12px;
    }
    .section {
      margin: 30px 0;
      page-break-inside: avoid;
    }
    .section h3 {
      font-size: 14pt;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e2e8f0;
    }
    .subsection {
      margin: 20px 0 20px 20px;
    }
    .subsection h4 {
      font-size: 12pt;
      font-weight: bold;
      color: #334155;
      margin-bottom: 10px;
    }
    .content p {
      margin-bottom: 10px;
      text-align: justify;
    }
    .content ul {
      margin: 10px 0 10px 30px;
    }
    .content li {
      margin-bottom: 8px;
    }
    .content strong {
      font-weight: bold;
      color: #1e293b;
    }
    .legal-basis {
      margin: 40px 0;
      padding: 20px;
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 8px;
    }
    .legal-basis h3 {
      font-size: 13pt;
      font-weight: bold;
      color: #92400e;
      margin-bottom: 15px;
    }
    .legal-basis ul {
      list-style-type: none;
    }
    .legal-basis li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    .legal-basis li:before {
      content: "⚖";
      position: absolute;
      left: 0;
      color: #d97706;
    }
    .approval {
      margin: 40px 0;
      padding: 20px;
      border: 2px solid #cbd5e1;
      border-radius: 8px;
    }
    .revision {
      margin: 20px 0;
      padding: 15px;
      background: #f1f5f9;
      border-radius: 6px;
      text-align: center;
      font-size: 10pt;
      color: #475569;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      font-size: 9pt;
      color: #64748b;
    }
    @media print {
      body {
        padding: 10mm;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${doc.title}</h1>
    ${doc.subtitle ? `<h2>${doc.subtitle}</h2>` : ''}
  </div>

  <div class="introduction">
    ${doc.introduction}
  </div>

  ${sectionsHTML}

  <div class="legal-basis">
    <h3>Bază Legală</h3>
    <ul>
      ${legalBasisHTML}
    </ul>
  </div>

  <div class="approval">
    ${doc.approval_section}
  </div>

  <div class="revision">
    ${doc.revision_info}
  </div>

  <div class="footer">
    <p>Document generat cu platforma SSM/PSI digitală s-s-m.ro</p>
    <p>Data generării: ${currentDate}</p>
  </div>
</body>
</html>
  `.trim()
}
