// ============================================================
// S-S-M.RO — Generator Fișă de Instruire SSM/PSI (Node.js)
// Conform HG 1425/2006 Anexa 11 + Legea 319/2006
// ============================================================

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// ============================================================
// CONSTANTS
// ============================================================
const MM = 2.835; // 1mm = 2.835 points
const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN = 15 * MM;
const CONTENT_W = A4_W - 2 * MARGIN;

// Colors
const NAVY = '#1E293B';
const TEAL = '#10B981';
const LIGHT_GRAY = '#F1F5F9';
const MID_GRAY = '#94A3B8';
const BORDER_GRAY = '#CBD5E1';
const RED_ALERT = '#EF4444';
const WHITE = '#FFFFFF';
const BLACK = '#000000';

// Training type labels
const TRAINING_TYPE_LABELS = {
  introductiv_general: 'Instruire Introductiv Generală',
  la_locul_de_munca: 'Instruire la Locul de Muncă',
  periodic: 'Instruire Periodică',
  psi: 'Instruire PSI (Prevenire și Stingere Incendii)',
  situatii_urgenta: 'Instruire Situații de Urgență',
  custom: 'Instruire Specifică',
};

const VERIFICATION_LABELS = {
  admis: 'ADMIS',
  respins: 'RESPINS',
  pending: 'ÎN AȘTEPTARE',
};

// Default topics by training type
const DEFAULT_TOPICS = {
  introductiv_general: [
    'Legislația SSM: Legea 319/2006, HG 1425/2006 — drepturi și obligații',
    'Riscuri generale în activitatea desfășurată',
    'Echipamente individuale de protecție (EIP) — utilizare și verificare',
    'Semnalizare de securitate — tipuri și semnificație',
    'Primul ajutor — noțiuni de bază, apel urgență 112',
    'Evacuare în caz de urgență — căi de evacuare, puncte de adunare',
    'Prevenirea și stingerea incendiilor — reguli de bază',
    'Accidentul de muncă — definiție, raportare, investigare',
  ],
  la_locul_de_munca: [
    'Riscuri specifice postului de lucru',
    'Instrucțiuni proprii SSM pentru locul de muncă',
    'Utilizarea echipamentelor de muncă specifice',
    'EIP necesare și modul de utilizare',
    'Proceduri de lucru în siguranță',
    'Microclimatul la locul de muncă',
    'Semnalizare specifică locului de muncă',
    'Primul ajutor specific și situații de urgență',
  ],
  periodic: [
    'Reactualizare legislație SSM (noutăți legislative)',
    'Analiza accidentelor de muncă din perioada anterioară',
    'Riscuri specifice — măsuri de prevenire actualizate',
    'Demonstrarea practică a cunoștințelor SSM',
    'Utilizarea corectă a EIP',
    'Proceduri de urgență — reactualizare',
  ],
  psi: [
    'Legislația PSI: Legea 307/2006, OMAI 163/2007',
    'Cauze de incendiu specifice locului de muncă',
    'Mijloace de primă intervenție — stingătoare, hidranți',
    'Demonstrație practică utilizare stingător',
    'Căi de evacuare și ieșiri de urgență',
    'Planul de evacuare — cunoaștere și exersare',
    'Apelarea serviciului de urgență 112',
  ],
  situatii_urgenta: [
    'Tipuri de situații de urgență specifice locului de muncă',
    'Planul de evacuare — cunoaștere și exersare',
    'Căi de evacuare și ieșiri de urgență',
    'Puncte de adunare și proceduri de numărare',
    'Apelarea serviciului de urgență 112',
    'Primul ajutor în situații de urgență',
  ],
};

// ============================================================
// FONT RESOLVER
// ============================================================
function resolveFonts() {
  // Try multiple locations in order
  const candidates = [
    // 1. Project fonts/ directory (Vercel + local dev)
    path.join(process.cwd(), 'fonts'),
    // 2. public/fonts/ directory
    path.join(process.cwd(), 'public', 'fonts'),
    // 3. System fonts (Linux dev/Docker)
    '/usr/share/fonts/truetype/dejavu',
    // 4. Local test
    path.join(__dirname, 'fonts'),
    // 5. Relative to this file
    path.join(__dirname, '..', 'fonts'),
  ];

  for (const dir of candidates) {
    const regular = path.join(dir, 'DejaVuSans.ttf');
    if (fs.existsSync(regular)) {
      return {
        regular,
        bold: path.join(dir, 'DejaVuSans-Bold.ttf'),
        italic: path.join(dir, 'DejaVuSans-Oblique.ttf'),
      };
    }
  }

  // Fallback: use built-in Helvetica (no diacritics!)
  console.warn('WARNING: DejaVu fonts not found. Romanian diacritics will not render correctly.');
  return { regular: 'Helvetica', bold: 'Helvetica-Bold', italic: 'Helvetica-Oblique' };
}

// ============================================================
// MAIN GENERATOR
// ============================================================

/**
 * Generate a Fișă de Instruire PDF.
 * @param {object} data - Session data
 * @returns {Promise<Buffer>} PDF as Buffer
 */
function generateFisaPDF(data) {
  return new Promise((resolve, reject) => {
    const fonts = resolveFonts();
    const isCustomFont = !fonts.regular.includes('Helvetica');

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: {
        Title: 'Fișă de Instruire SSM/PSI',
        Author: 's-s-m.ro',
        Subject: `Instruire ${data.worker_name || ''}`,
        Creator: 'S-S-M.RO Platform',
      },
    });

    // Collect chunks
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Register custom fonts
    if (isCustomFont) {
      doc.registerFont('Regular', fonts.regular);
      doc.registerFont('Bold', fonts.bold);
      doc.registerFont('Italic', fonts.italic);
    } else {
      doc.registerFont('Regular', 'Helvetica');
      doc.registerFont('Bold', 'Helvetica-Bold');
      doc.registerFont('Italic', 'Helvetica-Oblique');
    }

    let y = MARGIN; // Current Y position (top-down)
    const xStart = MARGIN;
    const xEnd = A4_W - MARGIN;
    const center = A4_W / 2;

    // ============================================================
    // Helper functions
    // ============================================================
    function checkPage(needed) {
      if (y + needed > A4_H - MARGIN - 30 * MM) {
        doc.addPage();
        y = MARGIN;
      }
    }

    function drawLine(x1, y1, x2, y2, color, width) {
      doc.strokeColor(color || BORDER_GRAY).lineWidth(width || 0.5);
      doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
    }

    function drawRect(x, ry, w, h, options) {
      if (options.fill) {
        doc.rect(x, ry, w, h).fill(options.fill);
      }
      if (options.stroke) {
        doc.strokeColor(options.stroke).lineWidth(options.strokeWidth || 0.5);
        doc.rect(x, ry, w, h).stroke();
      }
    }

    function drawFieldRow(label, value, fy, labelWidth) {
      labelWidth = labelWidth || 55 * MM;
      doc.font('Bold').fontSize(8).fillColor(MID_GRAY);
      doc.text(label, xStart, fy, { width: labelWidth, lineBreak: false });
      doc.font('Regular').fontSize(9.5).fillColor(BLACK);
      doc.text(String(value || '—'), xStart + labelWidth, fy, {
        width: CONTENT_W - labelWidth,
        lineBreak: false,
      });
      drawLine(xStart + labelWidth, fy + 12, xEnd, fy + 12, LIGHT_GRAY, 0.3);
    }

    function drawSectionTitle(title) {
      checkPage(20 * MM);
      drawRect(xStart, y, CONTENT_W, 6 * MM, { fill: LIGHT_GRAY });
      drawRect(xStart, y, CONTENT_W, 6 * MM, { stroke: BORDER_GRAY, strokeWidth: 0.3 });
      doc.font('Bold').fontSize(8.5).fillColor(NAVY);
      doc.text(title, xStart + 3 * MM, y + 1.5 * MM, { lineBreak: false });
      y += 9 * MM;
    }

    // ============================================================
    // HEADER
    // ============================================================
    // Top teal bar
    drawRect(xStart, y, CONTENT_W, 2 * MM, { fill: TEAL });
    y += 8 * MM;

    // Organization name (left)
    doc.font('Bold').fontSize(11).fillColor(NAVY);
    doc.text(data.organization_name || 'Organizația', xStart, y, { lineBreak: false });

    // Document number (right)
    if (data.document_number) {
      doc.font('Regular').fontSize(8).fillColor(MID_GRAY);
      doc.text(`Nr. ${data.document_number}`, xStart, y, {
        width: CONTENT_W,
        align: 'right',
        lineBreak: false,
      });
    }
    y += 4 * MM;

    // Organization details
    if (data.organization_details) {
      doc.font('Regular').fontSize(7).fillColor(MID_GRAY);
      doc.text(data.organization_details, xStart, y, { lineBreak: false });
    }
    y += 10 * MM;

    // Main title bar
    drawRect(xStart, y, CONTENT_W, 14 * MM, { fill: NAVY });
    doc.font('Bold').fontSize(16).fillColor(WHITE);
    doc.text('FIȘĂ DE INSTRUIRE', xStart, y + 3.5 * MM, {
      width: CONTENT_W,
      align: 'center',
      lineBreak: false,
    });
    y += 17 * MM;

    // Training type subtitle
    const trainingType = data.training_type || 'periodic';
    const typeLabel = TRAINING_TYPE_LABELS[trainingType] || trainingType;
    doc.font('Bold').fontSize(10).fillColor(TEAL);
    doc.text(typeLabel, xStart, y, { width: CONTENT_W, align: 'center', lineBreak: false });
    y += 4 * MM;

    // Legal basis
    const legalBasis = data.legal_basis || [];
    if (legalBasis.length > 0) {
      const legalText = `Conform: ${legalBasis.slice(0, 3).join(' · ')}`;
      doc.font('Italic').fontSize(7).fillColor(MID_GRAY);
      doc.text(legalText, xStart, y, { width: CONTENT_W, align: 'center', lineBreak: false });
    }
    y += 5 * MM;

    drawLine(xStart, y, xEnd, y, LIGHT_GRAY, 0.3);
    y += 4 * MM;

    // ============================================================
    // SECTION 1: WORKER DATA
    // ============================================================
    drawSectionTitle('DATE ANGAJAT');

    const workerRows = [
      ['Nume și prenume:', data.worker_name],
      ['Funcția / Postul:', data.worker_position],
      ['Departament / Secție:', data.worker_department],
      ['Data angajării:', data.worker_hire_date],
      ['Locul de muncă:', data.work_location],
    ];

    for (const [label, value] of workerRows) {
      drawFieldRow(label, value, y);
      y += 6 * MM;
    }
    y += 2 * MM;

    // ============================================================
    // SECTION 2: TRAINING DETAILS
    // ============================================================
    drawSectionTitle('DETALII INSTRUIRE');

    const trainingRows = [
      ['Tipul instruirii:', typeLabel],
      ['Modulul:', `${data.module_code || ''} — ${data.module_title || ''}`],
      ['Data instruirii:', data.session_date],
      ['Durata efectivă:', `${data.duration_minutes || 0} minute`],
      ['Durata minimă legală:', `${data.duration_required || 60} minute`],
      ['Limba instruirii:', data.language_label || data.language || 'Română'],
      ['Locația:', data.location || 'Sediu angajator'],
    ];

    for (const [label, value] of trainingRows) {
      drawFieldRow(label, value, y);
      y += 6 * MM;
    }
    y += 2 * MM;

    // ============================================================
    // SECTION 3: TRAINING CONTENT
    // ============================================================
    drawSectionTitle('CONȚINUTUL INSTRUIRII');

    const topics = data.topics && data.topics.length > 0
      ? data.topics
      : (DEFAULT_TOPICS[trainingType] || DEFAULT_TOPICS.periodic);

    for (let i = 0; i < topics.length; i++) {
      checkPage(8 * MM);
      doc.font('Bold').fontSize(8).fillColor(TEAL);
      doc.text(`${i + 1}.`, xStart + 3 * MM, y, { lineBreak: false, continued: false });
      doc.font('Regular').fontSize(8.5).fillColor(BLACK);
      doc.text(topics[i], xStart + 10 * MM, y, {
        width: CONTENT_W - 12 * MM,
        lineBreak: true,
      });
      y += 5 * MM;
    }
    y += 3 * MM;

    // ============================================================
    // SECTION 4: TEST RESULTS
    // ============================================================
    checkPage(60 * MM);
    drawSectionTitle('REZULTAT VERIFICARE CUNOȘTINȚE');

    const totalQ = data.test_questions_total || 0;
    const correctQ = data.test_questions_correct || 0;
    const score = data.test_score || 0;
    const minScore = data.min_pass_score || 70;
    const verification = data.verification_result || 'pending';

    const testRows = [
      ['Nr. întrebări test:', String(totalQ)],
      ['Răspunsuri corecte:', `${correctQ} din ${totalQ}`],
      ['Scor obținut:', `${score}%`],
      ['Scor minim admitere:', `${minScore}%`],
    ];

    for (const [label, value] of testRows) {
      drawFieldRow(label, value, y);
      y += 6 * MM;
    }
    y += 3 * MM;

    // Verification result box
    const resultLabel = VERIFICATION_LABELS[verification] || verification.toUpperCase();
    let bgColor, textColor;
    if (verification === 'admis') {
      bgColor = '#064E3B';
      textColor = TEAL;
    } else if (verification === 'respins') {
      bgColor = '#450A0A';
      textColor = RED_ALERT;
    } else {
      bgColor = '#422006';
      textColor = '#F59E0B';
    }

    const boxH = 12 * MM;
    drawRect(xStart, y, CONTENT_W, boxH, { fill: bgColor });
    drawRect(xStart, y, CONTENT_W, boxH, { stroke: BORDER_GRAY, strokeWidth: 0.3 });
    doc.font('Bold').fontSize(14).fillColor(textColor);
    doc.text(`REZULTAT: ${resultLabel}`, xStart, y + 3.5 * MM, {
      width: CONTENT_W,
      align: 'center',
      lineBreak: false,
    });
    y += boxH + 4 * MM;

    // ============================================================
    // PERIODICITY NOTICE
    // ============================================================
    if (data.periodicity_months && data.next_due_date) {
      checkPage(15 * MM);
      const noticeH = 8 * MM;
      drawRect(xStart, y, CONTENT_W, noticeH, { fill: '#1E3A5F' });
      drawRect(xStart, y, CONTENT_W, noticeH, { stroke: '#3B82F6', strokeWidth: 0.5 });
      doc.font('Bold').fontSize(8).fillColor('#60A5FA');
      doc.text(
        `Următoarea instruire periodică: ${data.next_due_date} (la ${data.periodicity_months} luni)`,
        xStart,
        y + 2.2 * MM,
        { width: CONTENT_W, align: 'center', lineBreak: false }
      );
      y += noticeH + 4 * MM;
    }

    // ============================================================
    // SECTION 5: INSTRUCTOR
    // ============================================================
    checkPage(40 * MM);
    drawSectionTitle('DATE INSTRUCTOR');

    const instructorRows = [
      ['Instructor:', data.instructor_name],
      ['Nr. autorizație:', data.instructor_authorization || 'N/A'],
      ['Calificare:', data.instructor_qualification || 'Specialist SSM autorizat'],
    ];

    for (const [label, value] of instructorRows) {
      drawFieldRow(label, value, y);
      y += 6 * MM;
    }
    y += 5 * MM;

    // ============================================================
    // SECTION 6: SIGNATURES
    // ============================================================
    checkPage(50 * MM);
    drawLine(xStart, y, xEnd, y, BORDER_GRAY, 0.5);
    y += 8 * MM;

    const colWidth = (CONTENT_W - 20 * MM) / 2;

    // Left: Instructor
    const leftCenter = xStart + colWidth / 2;
    doc.font('Bold').fontSize(8).fillColor(MID_GRAY);
    doc.text('INSTRUCTOR', xStart, y, { width: colWidth, align: 'center', lineBreak: false });
    y += 5 * MM;
    doc.font('Regular').fontSize(9).fillColor(BLACK);
    doc.text(data.instructor_name || '', xStart, y, { width: colWidth, align: 'center', lineBreak: false });

    // Right: Worker (same Y level)
    const rightX = xStart + colWidth + 20 * MM;
    doc.font('Bold').fontSize(8).fillColor(MID_GRAY);
    doc.text('ANGAJAT INSTRUIT', rightX, y - 5 * MM, { width: colWidth, align: 'center', lineBreak: false });
    doc.font('Regular').fontSize(9).fillColor(BLACK);
    doc.text(data.worker_name || '', rightX, y, { width: colWidth, align: 'center', lineBreak: false });

    y += 15 * MM;

    // Signature lines
    drawLine(xStart + 10 * MM, y, xStart + colWidth - 10 * MM, y, BORDER_GRAY, 0.5);
    drawLine(rightX + 10 * MM, y, rightX + colWidth - 10 * MM, y, BORDER_GRAY, 0.5);

    y += 3 * MM;
    doc.font('Italic').fontSize(7).fillColor(MID_GRAY);
    doc.text('Semnătura', xStart, y, { width: colWidth, align: 'center', lineBreak: false });
    doc.text('Semnătura', rightX, y, { width: colWidth, align: 'center', lineBreak: false });

    // ============================================================
    // FOOTER
    // ============================================================
    const footerY = A4_H - MARGIN - 5 * MM;
    drawLine(xStart, footerY, xEnd, footerY, LIGHT_GRAY, 0.3);

    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const footerText =
      `Document generat de platforma s-s-m.ro · ${timestamp} · ` +
      'Conform HG 1425/2006 Anexa 11 · Legea 319/2006 · ' +
      'Se păstrează în dosarul personal SSM al angajatului';

    doc.font('Regular').fontSize(5.5).fillColor(MID_GRAY);
    doc.text(footerText, xStart, footerY + 2 * MM, {
      width: CONTENT_W,
      align: 'center',
      lineBreak: false,
    });

    // Quick-Valid reference
    if (data.quickvalid_timestamp) {
      doc.font('Bold').fontSize(6).fillColor(TEAL);
      doc.text(
        `✓ Quick-Valid: Validare biometrică la ${data.quickvalid_timestamp}`,
        xStart,
        footerY + 6 * MM,
        { width: CONTENT_W, align: 'center', lineBreak: false }
      );
    }

    // ============================================================
    // FINALIZE
    // ============================================================
    doc.end();
  });
}

// ============================================================
// DEMO DATA (same as Python version)
// ============================================================
const DEMO_DATA = {
  organization_name: 'CMI Dr. Multescu Florentina',
  organization_details: 'CUI: 12345678 · J40/1234/2005 · Str. Exemplu nr. 10, București',
  document_number: 'FI-2026-001',

  worker_name: 'Ionescu Maria Elena',
  worker_position: 'Asistentă Medicală',
  worker_department: 'Cabinet Consultații',
  worker_hire_date: '15.03.2023',
  work_location: 'Cabinet medical, Str. Exemplu nr. 10',

  training_type: 'periodic',
  module_code: 'IP-001',
  module_title: 'Instruire Periodică SSM',
  session_date: '04.02.2026',
  duration_minutes: 120,
  duration_required: 120,
  language: 'ro',
  language_label: 'Română',
  location: 'Sediu cabinet medical',
  legal_basis: ['Legea 319/2006 Art.20 lit.c', 'HG 1425/2006 Art.95-99'],
  periodicity_months: 6,
  next_due_date: '04.08.2026',

  topics: [
    'Reactualizare legislație SSM — noutăți 2025-2026',
    'OUG 91/2025: modificări concediu medical și implicații SSM',
    'Riscuri specifice cabinetului medical: biologice, chimice, ergonomice',
    'Manipularea și eliminarea deșeurilor medicale periculoase',
    'Echipamente individuale de protecție: mănuși, mască, ochelari',
    'Proceduri de urgență: accident expunere sânge/fluide biologice',
    'Primul ajutor — reactualizare BLS (Basic Life Support)',
    'Evacuare în caz de incendiu — plan de evacuare actualizat',
  ],

  test_questions_total: 15,
  test_questions_correct: 13,
  test_score: 86.7,
  min_pass_score: 70,
  verification_result: 'admis',

  instructor_name: 'Daniel Vicentiu — SSM Consultanță',
  instructor_authorization: 'Autorizație MMSS Nr. XXXX/2005',
  instructor_qualification: 'Evaluator de Risc SSM · Specialist Ergonomie · Instructor BLS (ERC)',

  quickvalid_timestamp: null,
};

// ============================================================
// CLI MODE
// ============================================================
if (require.main === module) {
  const args = process.argv.slice(2);
  let data = DEMO_DATA;
  let outputPath = '/tmp/fisa_demo_nodejs.pdf';

  if (args.includes('--demo')) {
    // use default demo data
  } else if (args.includes('--json')) {
    const idx = args.indexOf('--json');
    data = JSON.parse(args[idx + 1]);
  } else if (args.includes('--file')) {
    const idx = args.indexOf('--file');
    data = JSON.parse(fs.readFileSync(args[idx + 1], 'utf-8'));
  }

  if (args.includes('--output')) {
    const idx = args.indexOf('--output');
    outputPath = args[idx + 1];
  }

  generateFisaPDF(data)
    .then((buffer) => {
      fs.writeFileSync(outputPath, buffer);
      console.log(outputPath);
    })
    .catch((err) => {
      console.error('Error:', err);
      process.exit(1);
    });
}

module.exports = { generateFisaPDF, DEMO_DATA };
