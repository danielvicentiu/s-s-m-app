// Supabase Edge Function: Generate PDF documents from templates
// Deploy: supabase functions deploy generate-document
// Environment variables required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

// Types
interface GenerateDocumentRequest {
  template_type: 'fisa_instruire' | 'plan_prevenire' | 'decizie_cssm';
  org_id: string;
  employee_ids?: string[];
  additional_params?: Record<string, any>;
}

interface Employee {
  id: string;
  full_name: string;
  job_title?: string;
  department?: string;
  hire_date?: string;
  cor_code?: string;
}

interface Organization {
  id: string;
  name: string;
  cui?: string;
  address?: string;
  county?: string;
  contact_email?: string;
  contact_phone?: string;
}

interface Training {
  id: string;
  training_type: string;
  training_date: string;
  instructor_name?: string;
  duration_hours?: number;
  location?: string;
}

// HTML Templates
const DOCUMENT_TEMPLATES = {
  fisa_instruire: (org: Organization, employees: Employee[], training?: Training, params?: any) => `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <title>Fișă de Instruire SSM</title>
  <style>
    @page { margin: 2cm; size: A4; }
    body {
      font-family: 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 15px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 18pt;
      color: #2563eb;
      text-transform: uppercase;
    }
    .header .org-info {
      font-size: 10pt;
      color: #666;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 10px;
      padding: 5px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      font-weight: bold;
      min-width: 150px;
      color: #374151;
    }
    .info-value {
      color: #1f2937;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #f3f4f6;
      font-weight: bold;
      color: #374151;
    }
    tr:nth-child(even) {
      background: #f9fafb;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 9pt;
      color: #6b7280;
      text-align: center;
    }
    .signature-section {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 45%;
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 60px;
      padding-top: 5px;
      font-size: 10pt;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Fișă de Instruire SSM</h1>
    <div class="org-info">
      ${org.name}<br>
      ${org.cui ? `CUI: ${org.cui}` : ''} ${org.address ? `| ${org.address}` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Informații Instruire</div>
    <div class="info-row">
      <div class="info-label">Data instruirii:</div>
      <div class="info-value">${training?.training_date ? new Date(training.training_date).toLocaleDateString('ro-RO') : new Date().toLocaleDateString('ro-RO')}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Tipul instruirii:</div>
      <div class="info-value">${training?.training_type || 'Instruire periodică SSM'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Instructor:</div>
      <div class="info-value">${training?.instructor_name || params?.instructor_name || '_____________________'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Durata:</div>
      <div class="info-value">${training?.duration_hours || params?.duration_hours || '___'} ore</div>
    </div>
    <div class="info-row">
      <div class="info-label">Locație:</div>
      <div class="info-value">${training?.location || params?.location || org.address || '_____________________'}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Participanți</div>
    <table>
      <thead>
        <tr>
          <th>Nr.</th>
          <th>Nume Complet</th>
          <th>Funcție</th>
          <th>Departament</th>
          <th>Semnătură</th>
        </tr>
      </thead>
      <tbody>
        ${employees.map((emp, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${emp.full_name}</td>
          <td>${emp.job_title || '-'}</td>
          <td>${emp.department || '-'}</td>
          <td></td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-line">
        Instructor SSM<br>
        (Nume și semnătură)
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        Responsabil Organizație<br>
        (Nume și semnătură)
      </div>
    </div>
  </div>

  <div class="footer">
    Document generat automat de platforma s-s-m.ro | ${new Date().toLocaleString('ro-RO')}<br>
    &copy; 2026 s-s-m.ro | SSM & PSI Digital
  </div>
</body>
</html>`,

  plan_prevenire: (org: Organization, employees: Employee[], _training: any, params?: any) => `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <title>Plan de Prevenire și Protecție</title>
  <style>
    @page { margin: 2cm; size: A4; }
    body {
      font-family: 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #dc2626;
      padding-bottom: 15px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 20pt;
      color: #dc2626;
      text-transform: uppercase;
      font-weight: bold;
    }
    .header .org-info {
      font-size: 11pt;
      color: #374151;
      margin-top: 10px;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #dc2626;
      margin-bottom: 15px;
      padding: 8px 0;
      border-bottom: 2px solid #e5e7eb;
      text-transform: uppercase;
    }
    .subsection-title {
      font-size: 12pt;
      font-weight: bold;
      color: #374151;
      margin: 15px 0 10px 0;
    }
    .info-row {
      margin-bottom: 10px;
      padding: 5px 0;
    }
    .info-label {
      font-weight: bold;
      color: #374151;
      display: inline-block;
      min-width: 200px;
    }
    .content-block {
      background: #f9fafb;
      padding: 15px;
      border-left: 4px solid #dc2626;
      margin: 15px 0;
      border-radius: 4px;
    }
    ul {
      margin: 10px 0;
      padding-left: 25px;
    }
    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 12px;
      text-align: left;
    }
    th {
      background: #fee2e2;
      font-weight: bold;
      color: #991b1b;
    }
    tr:nth-child(even) {
      background: #fef2f2;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      font-size: 9pt;
      color: #6b7280;
      text-align: center;
    }
    .signature-section {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .signature-box {
      width: 30%;
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 70px;
      padding-top: 5px;
      font-size: 10pt;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Plan de Prevenire și Protecție</h1>
    <div class="org-info">
      <strong>${org.name}</strong><br>
      ${org.cui ? `CUI: ${org.cui}` : ''}<br>
      ${org.address ? org.address : ''} ${org.county ? `| Județul ${org.county}` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">1. Date de Identificare</div>
    <div class="info-row">
      <span class="info-label">Denumire organizație:</span> ${org.name}
    </div>
    <div class="info-row">
      <span class="info-label">CUI:</span> ${org.cui || 'N/A'}
    </div>
    <div class="info-row">
      <span class="info-label">Adresă:</span> ${org.address || 'N/A'}
    </div>
    <div class="info-row">
      <span class="info-label">Număr total angajați:</span> ${employees.length}
    </div>
    <div class="info-row">
      <span class="info-label">Contact:</span> ${org.contact_email || 'N/A'} | ${org.contact_phone || 'N/A'}
    </div>
    <div class="info-row">
      <span class="info-label">Data elaborării planului:</span> ${new Date().toLocaleDateString('ro-RO')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">2. Obiectivele Planului de Prevenire</div>
    <div class="content-block">
      <ul>
        <li>Identificarea și evaluarea riscurilor profesionale la nivelul organizației</li>
        <li>Stabilirea măsurilor de prevenire și protecție necesare</li>
        <li>Instruirea și informarea lucrătorilor privind riscurile profesionale</li>
        <li>Monitorizarea continuă a condițiilor de muncă</li>
        <li>Asigurarea conformității cu legislația SSM în vigoare</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">3. Structura Organizatorică SSM</div>
    <div class="subsection-title">3.1. Responsabilități</div>
    <div class="content-block">
      <strong>Angajator:</strong> Asigură implementarea măsurilor de prevenire și protecție<br>
      <strong>Responsabil SSM:</strong> ${params?.ssm_responsible || '_____________________'}<br>
      <strong>Comitet SSM:</strong> ${params?.cssm_members ? 'Constituit' : 'Se va constitui conform art. 18, Legea 319/2006'}
    </div>
  </div>

  <div class="section">
    <div class="section-title">4. Angajați și Funcții</div>
    <table>
      <thead>
        <tr>
          <th>Nr.</th>
          <th>Nume Complet</th>
          <th>Funcție</th>
          <th>Departament</th>
          <th>COR</th>
        </tr>
      </thead>
      <tbody>
        ${employees.map((emp, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${emp.full_name}</td>
          <td>${emp.job_title || '-'}</td>
          <td>${emp.department || '-'}</td>
          <td>${emp.cor_code || '-'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">5. Măsuri de Prevenire și Protecție</div>
    <div class="subsection-title">5.1. Măsuri Generale</div>
    <div class="content-block">
      <ul>
        <li>Instruire SSM inițială și periodică pentru toți angajații</li>
        <li>Evaluare medicală periodică conform legislației muncii</li>
        <li>Asigurarea echipamentelor de protecție individuală (EPI)</li>
        <li>Verificări tehnice periodice ale echipamentelor de lucru</li>
        <li>Menținerea evidențelor obligatorii SSM</li>
      </ul>
    </div>
    <div class="subsection-title">5.2. Măsuri Specifice pe Locuri de Muncă</div>
    <div class="content-block">
      ${params?.specific_measures || 'Se vor identifica și documenta riscurile specifice fiecărui loc de muncă conform metodologiei de evaluare a riscurilor.'}
    </div>
  </div>

  <div class="section">
    <div class="section-title">6. Program de Instruire</div>
    <div class="content-block">
      <ul>
        <li>Instruire inițială la angajare</li>
        <li>Instruire periodică (anual sau conform specificului activității)</li>
        <li>Instruire la schimbarea locului de muncă sau introducerea de noi echipamente</li>
        <li>Instruire suplimentară în caz de accident sau incident</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">7. Proceduri în Caz de Urgență</div>
    <div class="content-block">
      <ul>
        <li>Evacuare: ${params?.evacuation_procedure || 'Conform planului de evacuare afișat la locurile vizibile'}</li>
        <li>Prim ajutor: ${params?.first_aid || 'Trusă de prim ajutor disponibilă, persoane instruite'}</li>
        <li>Incendiu: ${params?.fire_procedure || 'Stingătoare verificate, ieșiri de urgență semnalizate'}</li>
        <li>Accidente: Raportare imediată, investigare conform Legea 319/2006</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">8. Revizuire și Actualizare</div>
    <div class="content-block">
      Prezentul plan va fi revizuit anual sau ori de câte ori apar modificări semnificative în organizare, tehnologie sau legislație. Următoarea revizuire este programată pentru ${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('ro-RO')}.
    </div>
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-line">
        Administrator<br>
        (Nume și semnătură)
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        Responsabil SSM<br>
        (Nume și semnătură)
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        Consultant SSM<br>
        (Nume și semnătură)
      </div>
    </div>
  </div>

  <div class="footer">
    Document generat automat de platforma s-s-m.ro | ${new Date().toLocaleString('ro-RO')}<br>
    Conformitate: Legea 319/2006, HG 1425/2006, Ordin 1091/2016<br>
    &copy; 2026 s-s-m.ro | SSM & PSI Digital
  </div>
</body>
</html>`,

  decizie_cssm: (org: Organization, employees: Employee[], _training: any, params?: any) => `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <title>Decizie de Constituire a Comitetului de Securitate și Sănătate în Muncă</title>
  <style>
    @page { margin: 2.5cm; size: A4; }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .header h1 {
      margin: 0 0 5px 0;
      font-size: 16pt;
      text-transform: uppercase;
      font-weight: bold;
    }
    .header .number {
      font-size: 12pt;
      margin-top: 10px;
    }
    .org-header {
      text-align: center;
      margin-bottom: 30px;
      font-size: 11pt;
    }
    .org-header strong {
      font-size: 13pt;
      text-transform: uppercase;
    }
    .content {
      text-align: justify;
      margin-bottom: 20px;
    }
    .content p {
      margin: 15px 0;
      text-indent: 1.5cm;
    }
    .article {
      margin: 20px 0;
      page-break-inside: avoid;
    }
    .article-title {
      font-weight: bold;
      margin-bottom: 10px;
      text-indent: 0;
    }
    .article-content {
      text-indent: 1.5cm;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #000;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #e5e7eb;
      font-weight: bold;
    }
    .signature-section {
      margin-top: 60px;
      page-break-inside: avoid;
    }
    .signature-box {
      margin-top: 40px;
    }
    .signature-line {
      margin-top: 70px;
      text-align: right;
    }
    .legal-basis {
      margin-top: 30px;
      font-size: 10pt;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="org-header">
    <strong>${org.name}</strong><br>
    ${org.cui ? `CUI: ${org.cui}` : ''}<br>
    ${org.address ? org.address : ''}
  </div>

  <div class="header">
    <h1>Decizie</h1>
    <div class="number">Nr. ______ din ${new Date().toLocaleDateString('ro-RO')}</div>
  </div>

  <div class="content">
    <p>
      Având în vedere prevederile Legii nr. 319/2006 privind securitatea și sănătatea în muncă,
      cu modificările și completările ulterioare, precum și Hotărârea Guvernului nr. 1425/2006
      pentru aprobarea Normelor metodologice de aplicare a prevederilor Legii nr. 319/2006,
    </p>
    <p>
      În conformitate cu art. 18 alin. (1) din Legea nr. 319/2006, care prevede că „În unitățile
      care au peste 50 de salariați se constituie comitetul de securitate și sănătate în muncă",
    </p>
    <p>
      Luând în considerare necesitatea asigurării unui cadru organizat pentru consultarea
      lucrătorilor și participarea acestora la luarea de decizii în domeniul securității și
      sănătății în muncă,
    </p>
  </div>

  <div class="article">
    <div class="article-title">Art. 1.</div>
    <div class="article-content">
      Se constituie Comitetul de Securitate și Sănătate în Muncă (CSSM) în cadrul
      ${org.name}, în conformitate cu prevederile legale în vigoare.
    </div>
  </div>

  <div class="article">
    <div class="article-title">Art. 2.</div>
    <div class="article-content">
      Comitetul de Securitate și Sănătate în Muncă va avea următoarea componență:
    </div>
    <table>
      <thead>
        <tr>
          <th>Nume și Prenume</th>
          <th>Funcția în Organizație</th>
          <th>Calitatea în CSSM</th>
        </tr>
      </thead>
      <tbody>
        ${params?.cssm_members ? params.cssm_members.map((member: any) => `
        <tr>
          <td>${member.name || '_____________________'}</td>
          <td>${member.job_title || '_____________________'}</td>
          <td>${member.cssm_role || '_____________________'}</td>
        </tr>
        `).join('') : `
        <tr>
          <td>_____________________</td>
          <td>_____________________</td>
          <td>Președinte</td>
        </tr>
        <tr>
          <td>_____________________</td>
          <td>_____________________</td>
          <td>Secretar</td>
        </tr>
        <tr>
          <td>_____________________</td>
          <td>_____________________</td>
          <td>Membru</td>
        </tr>
        <tr>
          <td>_____________________</td>
          <td>_____________________</td>
          <td>Membru</td>
        </tr>
        `}
      </tbody>
    </table>
  </div>

  <div class="article">
    <div class="article-title">Art. 3.</div>
    <div class="article-content">
      Comitetul de Securitate și Sănătate în Muncă are următoarele atribuții principale:
    </div>
    <div style="margin-left: 1.5cm; margin-top: 10px;">
      a) Analizează și face propuneri privind politica de securitate și sănătate în muncă;<br>
      b) Urmărește aplicarea prevederilor legale privind securitatea și sănătatea în muncă;<br>
      c) Analizează factorii de risc din unitate și propune măsuri de prevenire;<br>
      d) Analizează cauzele producerii accidentelor de muncă și bolilor profesionale;<br>
      e) Efectuează verificări proprii privind aplicarea normelor de securitate și sănătate în muncă;<br>
      f) Propune măsuri de protecție pentru lucrătorii sensibili la riscuri specifice;<br>
      g) Propune măsuri pentru îmbunătățirea condițiilor de muncă.
    </div>
  </div>

  <div class="article">
    <div class="article-title">Art. 4.</div>
    <div class="article-content">
      Comitetul de Securitate și Sănătate în Muncă se va întruni trimestrial sau ori de câte
      ori este necesar. Ședințele se consemnează în procese-verbale, care vor fi păstrate
      conform legislației în vigoare.
    </div>
  </div>

  <div class="article">
    <div class="article-title">Art. 5.</div>
    <div class="article-content">
      Prezenta decizie produce efecte de la data semnării și va fi comunicată tuturor
      membrilor CSSM și adusă la cunoștința întregului personal.
    </div>
  </div>

  <div class="legal-basis">
    Întocmit în baza:<br>
    - Legea nr. 319/2006 privind securitatea și sănătatea în muncă<br>
    - HG nr. 1425/2006 - Norme metodologice de aplicare a Legii 319/2006<br>
    - Ordin 1091/2016 privind registrul general de evidență a salariaților
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-line">
        <strong>ADMINISTRATOR/DIRECTOR</strong><br><br>
        Nume: _____________________<br><br>
        Semnătura: _____________________
      </div>
    </div>
  </div>

</body>
</html>`,
};

// Convert HTML to PDF using Deno's built-in capabilities
async function htmlToPdf(html: string): Promise<Uint8Array> {
  // For Edge Functions, we'll use a headless browser service or a PDF generation API
  // Since Deno doesn't have native PDF support, we'll use jsPDF or similar
  // For now, we'll use a simple approach with puppeteer-like service

  // Note: In production, you might want to use a dedicated service like:
  // - Browserless.io
  // - Gotenberg
  // - PDFShift
  // - Or run Puppeteer in a separate container

  // For this implementation, we'll use a placeholder that returns the HTML
  // In real deployment, integrate with a PDF service

  const encoder = new TextEncoder();
  return encoder.encode(html);
}

// Upload file to Supabase Storage
async function uploadToStorage(
  supabase: any,
  bucket: string,
  path: string,
  data: Uint8Array,
  contentType: string
): Promise<string> {
  const { data: uploadData, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, data, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // Parse request body
    const body: GenerateDocumentRequest = await req.json();
    const { template_type, org_id, employee_ids, additional_params } = body;

    // Validate input
    if (!template_type || !org_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: template_type, org_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!['fisa_instruire', 'plan_prevenire', 'decizie_cssm'].includes(template_type)) {
      return new Response(
        JSON.stringify({
          error: "Invalid template_type",
          allowed: ['fisa_instruire', 'plan_prevenire', 'decizie_cssm']
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch organization data
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', org_id)
      .single();

    if (orgError || !org) {
      return new Response(
        JSON.stringify({ error: "Organization not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch employees data
    let employees: Employee[] = [];
    if (employee_ids && employee_ids.length > 0) {
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('id, full_name, job_title, department, hire_date, cor_code')
        .in('id', employee_ids)
        .eq('organization_id', org_id);

      if (employeesError) {
        throw new Error(`Failed to fetch employees: ${employeesError.message}`);
      }

      employees = employeesData || [];
    } else {
      // If no specific employees, fetch all active employees
      const { data: allEmployees, error: allEmployeesError } = await supabase
        .from('employees')
        .select('id, full_name, job_title, department, hire_date, cor_code')
        .eq('organization_id', org_id)
        .is('deleted_at', null);

      if (allEmployeesError) {
        throw new Error(`Failed to fetch employees: ${allEmployeesError.message}`);
      }

      employees = allEmployees || [];
    }

    // Generate HTML from template
    const templateFn = DOCUMENT_TEMPLATES[template_type];
    const html = templateFn(org, employees, undefined, additional_params);

    // Convert HTML to PDF
    const pdfBuffer = await htmlToPdf(html);

    // Generate file path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${template_type}_${org_id}_${timestamp}.pdf`;
    const storagePath = `documents/${org_id}/${fileName}`;

    // Upload to Storage
    const publicUrl = await uploadToStorage(
      supabase,
      'documents',
      storagePath,
      pdfBuffer,
      'application/pdf'
    );

    // Save metadata to generated_documents table
    const { data: docRecord, error: docError } = await supabase
      .from('generated_documents')
      .insert({
        organization_id: org_id,
        document_type: template_type === 'fisa_instruire' ? 'fisa_instruire' :
                      template_type === 'plan_prevenire' ? 'raport_conformitate' : 'altul',
        storage_path: storagePath,
        file_name: fileName,
        file_size_bytes: pdfBuffer.length,
        content_version: 1,
        legal_basis_version: '2026',
        generation_context: {
          template_type,
          employee_count: employees.length,
          employee_ids: employee_ids || [],
          additional_params,
          generated_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (docError) {
      console.error("Failed to save document record:", docError);
      // Don't fail the request if metadata save fails
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        document_id: docRecord?.id,
        url: publicUrl,
        file_name: fileName,
        template_type,
        organization_id: org_id,
        employee_count: employees.length,
        file_size_bytes: pdfBuffer.length,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating document:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
