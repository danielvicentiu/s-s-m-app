// ============================================================
// S-S-M.RO — Generator Tematică de Instruire SSM (Node.js)
// Conform HG 1425/2006 + Legea 319/2006
// ============================================================

const PDFKit = require('pdfkit');
const PDFDocument = PDFKit.default || PDFKit;
const path = require('path');
const fs = require('fs');

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
const WHITE = '#FFFFFF';
const BLACK = '#000000';

// Default training topics by type
const TRAINING_TOPICS = {
  introductiv_general: [
    { tema: 'Legislația SSM: Legea 319/2006, HG 1425/2006', durata: 30, metoda: 'Prelegere + prezentare PPT' },
    { tema: 'Drepturi și obligații SSM pentru angajator și angajați', durata: 20, metoda: 'Prelegere + discuții' },
    { tema: 'Riscuri generale în activitatea desfășurată', durata: 30, metoda: 'Prelegere + exemple practice' },
    { tema: 'Echipamente individuale de protecție (EIP) — utilizare și verificare', durata: 20, metoda: 'Demonstrație practică' },
    { tema: 'Semnalizare de securitate — tipuri și semnificație', durata: 15, metoda: 'Prezentare + exemple vizuale' },
    { tema: 'Primul ajutor — noțiuni de bază, apel urgență 112', durata: 30, metoda: 'Demonstrație practică' },
    { tema: 'Evacuare în caz de urgență — căi de evacuare, puncte de adunare', durata: 20, metoda: 'Tur ghidat + exersare' },
    { tema: 'Prevenirea și stingerea incendiilor — reguli de bază', durata: 25, metoda: 'Prelegere + demonstrație stingător' },
    { tema: 'Accidentul de muncă — definiție, raportare, investigare', durata: 20, metoda: 'Prelegere + studii de caz' },
    { tema: 'Verificare cunoștințe — test evaluare', durata: 30, metoda: 'Test scris sau oral' },
  ],
  la_locul_de_munca: [
    { tema: 'Riscuri specifice postului de lucru', durata: 40, metoda: 'Prelegere + analiza locului de muncă' },
    { tema: 'Instrucțiuni proprii SSM pentru locul de muncă', durata: 30, metoda: 'Prelegere + prezentare instrucțiuni' },
    { tema: 'Utilizarea echipamentelor de muncă specifice', durata: 40, metoda: 'Demonstrație practică' },
    { tema: 'EIP necesare și modul de utilizare', durata: 20, metoda: 'Demonstrație practică' },
    { tema: 'Proceduri de lucru în siguranță', durata: 30, metoda: 'Prelegere + exersare' },
    { tema: 'Microclimatul la locul de muncă', durata: 15, metoda: 'Prelegere + măsurători' },
    { tema: 'Semnalizare specifică locului de muncă', durata: 15, metoda: 'Tur ghidat' },
    { tema: 'Primul ajutor specific și situații de urgență', durata: 20, metoda: 'Demonstrație practică' },
    { tema: 'Verificare cunoștințe — test evaluare', durata: 30, metoda: 'Test scris sau oral' },
  ],
  periodic: [
    { tema: 'Reactualizare legislație SSM (noutăți legislative)', durata: 20, metoda: 'Prelegere' },
    { tema: 'Analiza accidentelor de muncă din perioada anterioară', durata: 25, metoda: 'Prelegere + discuții' },
    { tema: 'Riscuri specifice — măsuri de prevenire actualizate', durata: 30, metoda: 'Prelegere + exemple practice' },
    { tema: 'Demonstrarea practică a cunoștințelor SSM', durata: 25, metoda: 'Exersare practică' },
    { tema: 'Utilizarea corectă a EIP', durata: 20, metoda: 'Demonstrație practică' },
    { tema: 'Proceduri de urgență — reactualizare', durata: 20, metoda: 'Exersare' },
    { tema: 'Verificare cunoștințe — test evaluare', durata: 20, metoda: 'Test scris sau oral' },
  ],
  psi: [
    { tema: 'Legislația PSI: Legea 307/2006, OMAI 163/2007', durata: 20, metoda: 'Prelegere' },
    { tema: 'Cauze de incendiu specifice locului de muncă', durata: 25, metoda: 'Prelegere + exemple' },
    { tema: 'Mijloace de primă intervenție — stingătoare, hidranți', durata: 30, metoda: 'Prelegere + prezentare echipamente' },
    { tema: 'Demonstrație practică utilizare stingător', durata: 30, metoda: 'Demonstrație practică' },
    { tema: 'Căi de evacuare și ieșiri de urgență', durata: 20, metoda: 'Tur ghidat' },
    { tema: 'Planul de evacuare — cunoaștere și exersare', durata: 25, metoda: 'Exersare practică' },
    { tema: 'Apelarea serviciului de urgență 112', durata: 10, metoda: 'Simulare' },
    { tema: 'Verificare cunoștințe — test evaluare', durata: 20, metoda: 'Test scris sau oral' },
  ],
};

// ============================================================
// FONT RESOLVER
// ============================================================
function resolveFonts() {
  const candidates = [
    path.join(process.cwd(), 'fonts'),
    path.join(process.cwd(), 'public', 'fonts'),
    '/usr/share/fonts/truetype/dejavu',
    path.join(__dirname, 'fonts'),
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

  console.warn('WARNING: DejaVu fonts not found. Romanian diacritics will not render correctly.');
  return { regular: 'Helvetica', bold: 'Helvetica-Bold', italic: 'Helvetica-Oblique' };
}

// ============================================================
// MAIN GENERATOR
// ============================================================

/**
 * Generate a Tematică de Instruire PDF.
 * @param {object} data - Training curriculum data
 * @returns {Promise<Buffer>} PDF as Buffer
 */
function generateTematicaPDF(data) {
  return new Promise((resolve, reject) => {
    const fonts = resolveFonts();
    const isCustomFont = !fonts.regular.includes('Helvetica');

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: {
        Title: 'Tematică de Instruire SSM',
        Author: 's-s-m.ro',
        Subject: `Tematică de Instruire ${data.organization_name || ''}`,
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

    let y = MARGIN;
    const xStart = MARGIN;
    const xEnd = A4_W - MARGIN;

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
    drawRect(xStart, y, CONTENT_W, 2 * MM, { fill: TEAL });
    y += 8 * MM;

    doc.font('Bold').fontSize(11).fillColor(NAVY);
    doc.text(data.organization_name || 'Organizația', xStart, y, { lineBreak: false });

    if (data.document_number) {
      doc.font('Regular').fontSize(8).fillColor(MID_GRAY);
      doc.text(`Nr. ${data.document_number}`, xStart, y, {
        width: CONTENT_W,
        align: 'right',
        lineBreak: false,
      });
    }
    y += 4 * MM;

    if (data.organization_details) {
      doc.font('Regular').fontSize(7).fillColor(MID_GRAY);
      doc.text(data.organization_details, xStart, y, { lineBreak: false });
    }
    y += 10 * MM;

    // Main title bar
    drawRect(xStart, y, CONTENT_W, 14 * MM, { fill: NAVY });
    doc.font('Bold').fontSize(16).fillColor(WHITE);
    doc.text('TEMATICĂ DE INSTRUIRE SSM', xStart, y + 3.5 * MM, {
      width: CONTENT_W,
      align: 'center',
      lineBreak: false,
    });
    y += 17 * MM;

    // Subtitle
    const trainingType = data.training_type || 'introductiv_general';
    const typeLabels = {
      introductiv_general: 'Instruire Introductiv Generală',
      la_locul_de_munca: 'Instruire la Locul de Muncă',
      periodic: 'Instruire Periodică',
      psi: 'Instruire PSI (Prevenire și Stingere Incendii)',
    };
    const typeLabel = typeLabels[trainingType] || 'Instruire SSM';

    doc.font('Bold').fontSize(10).fillColor(TEAL);
    doc.text(typeLabel, xStart, y, { width: CONTENT_W, align: 'center', lineBreak: false });
    y += 4 * MM;

    // Legal basis
    const legalBasis = data.legal_basis || ['Legea 319/2006 Art.20', 'HG 1425/2006 Art.95-99'];
    doc.font('Italic').fontSize(7).fillColor(MID_GRAY);
    doc.text(`Conform: ${legalBasis.join(' · ')}`, xStart, y, {
      width: CONTENT_W,
      align: 'center',
      lineBreak: false,
    });
    y += 5 * MM;

    drawLine(xStart, y, xEnd, y, LIGHT_GRAY, 0.3);
    y += 4 * MM;

    // ============================================================
    // SECTION 1: SCOP ȘI OBIECTIVE
    // ============================================================
    drawSectionTitle('SCOP ȘI OBIECTIVE');

    doc.font('Regular').fontSize(9).fillColor(BLACK);
    const scopText = data.scop ||
      'Instruirea personalului în domeniul securității și sănătății în muncă, conform cerințelor legale în vigoare, pentru asigurarea unui mediu de lucru sigur și sănătos.';
    doc.text(scopText, xStart + 3 * MM, y, { width: CONTENT_W - 6 * MM, lineBreak: true });
    y += doc.heightOfString(scopText, { width: CONTENT_W - 6 * MM }) + 5 * MM;

    // Obiective
    const obiective = data.obiective || [
      'Cunoașterea legislației în domeniul SSM și PSI',
      'Identificarea riscurilor la locul de muncă',
      'Aplicarea măsurilor de prevenire și protecție',
      'Acționarea corectă în situații de urgență',
    ];

    doc.font('Bold').fontSize(8.5).fillColor(NAVY);
    doc.text('Obiective specifice:', xStart + 3 * MM, y, { lineBreak: false });
    y += 6 * MM;

    for (const obj of obiective) {
      checkPage(8 * MM);
      doc.font('Regular').fontSize(8.5).fillColor(BLACK);
      doc.text('•', xStart + 6 * MM, y, { lineBreak: false });
      doc.text(obj, xStart + 10 * MM, y, { width: CONTENT_W - 13 * MM, lineBreak: true });
      y += doc.heightOfString(obj, { width: CONTENT_W - 13 * MM }) + 3 * MM;
    }
    y += 3 * MM;

    // ============================================================
    // SECTION 2: TEMATICĂ DETALIATĂ
    // ============================================================
    drawSectionTitle('TEMATICĂ DETALIATĂ — PROGRAM DE INSTRUIRE');

    const topics = data.topics || TRAINING_TOPICS[trainingType] || TRAINING_TOPICS.introductiv_general;
    let totalDurata = 0;

    // Table header
    checkPage(30 * MM);
    const colNr = 10 * MM;
    const colTema = CONTENT_W - colNr - 25 * MM - 40 * MM;
    const colDurata = 25 * MM;
    const colMetoda = 40 * MM;

    drawRect(xStart, y, CONTENT_W, 8 * MM, { fill: LIGHT_GRAY });
    drawRect(xStart, y, CONTENT_W, 8 * MM, { stroke: BORDER_GRAY, strokeWidth: 0.5 });

    doc.font('Bold').fontSize(7.5).fillColor(NAVY);
    doc.text('Nr.', xStart + 2 * MM, y + 2.5 * MM, { width: colNr, align: 'center', lineBreak: false });
    doc.text('Tema', xStart + colNr + 2 * MM, y + 2.5 * MM, { lineBreak: false });
    doc.text('Durata\n(min)', xStart + colNr + colTema + 2 * MM, y + 1.5 * MM, { width: colDurata, align: 'center', lineBreak: true });
    doc.text('Metodă', xStart + colNr + colTema + colDurata + 2 * MM, y + 2.5 * MM, { lineBreak: false });

    y += 8 * MM;

    // Table rows
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      const rowH = Math.max(doc.heightOfString(topic.tema, { width: colTema - 4 * MM }) + 4 * MM, 10 * MM);

      checkPage(rowH + 5 * MM);

      drawRect(xStart, y, CONTENT_W, rowH, { stroke: BORDER_GRAY, strokeWidth: 0.3 });

      // Nr
      doc.font('Bold').fontSize(8).fillColor(TEAL);
      doc.text(String(i + 1), xStart + 2 * MM, y + rowH / 2 - 3 * MM, { width: colNr, align: 'center', lineBreak: false });

      // Tema
      doc.font('Regular').fontSize(8.5).fillColor(BLACK);
      doc.text(topic.tema, xStart + colNr + 2 * MM, y + 2 * MM, { width: colTema - 4 * MM, lineBreak: true });

      // Durata
      doc.font('Bold').fontSize(8.5).fillColor(BLACK);
      doc.text(String(topic.durata), xStart + colNr + colTema + 2 * MM, y + rowH / 2 - 3 * MM, { width: colDurata, align: 'center', lineBreak: false });

      // Metodă
      doc.font('Italic').fontSize(7.5).fillColor(MID_GRAY);
      doc.text(topic.metoda, xStart + colNr + colTema + colDurata + 2 * MM, y + rowH / 2 - 3 * MM, { width: colMetoda - 4 * MM, lineBreak: true });

      totalDurata += topic.durata;
      y += rowH;
    }

    // Total row
    const totalRowH = 8 * MM;
    drawRect(xStart, y, CONTENT_W, totalRowH, { fill: NAVY });
    doc.font('Bold').fontSize(9).fillColor(WHITE);
    doc.text('TOTAL DURATĂ:', xStart + colNr + 2 * MM, y + 2.5 * MM, { lineBreak: false });
    doc.text(`${totalDurata} minute (${Math.round(totalDurata / 60)} ore)`, xStart + colNr + colTema + 2 * MM, y + 2.5 * MM, { width: colDurata + colMetoda, align: 'center', lineBreak: false });

    y += totalRowH + 5 * MM;

    // ============================================================
    // SECTION 3: INSTRUCTOR
    // ============================================================
    checkPage(40 * MM);
    drawSectionTitle('DATE INSTRUCTOR');

    const instructorRows = [
      ['Instructor:', data.instructor_name || 'Specialist SSM autorizat'],
      ['Nr. autorizație:', data.instructor_authorization || 'Conform Legii 319/2006'],
      ['Calificare:', data.instructor_qualification || 'Evaluator de Risc SSM'],
    ];

    for (const [label, value] of instructorRows) {
      doc.font('Bold').fontSize(8).fillColor(MID_GRAY);
      doc.text(label, xStart + 3 * MM, y, { width: 50 * MM, lineBreak: false });
      doc.font('Regular').fontSize(9).fillColor(BLACK);
      doc.text(value, xStart + 53 * MM, y, { width: CONTENT_W - 56 * MM, lineBreak: false });
      drawLine(xStart + 53 * MM, y + 12, xEnd - 3 * MM, y + 12, LIGHT_GRAY, 0.3);
      y += 6 * MM;
    }
    y += 8 * MM;

    // ============================================================
    // SIGNATURES
    // ============================================================
    checkPage(50 * MM);
    drawLine(xStart, y, xEnd, y, BORDER_GRAY, 0.5);
    y += 8 * MM;

    const colWidth = CONTENT_W / 2 - 10 * MM;

    // Left: Întocmit
    doc.font('Bold').fontSize(8).fillColor(MID_GRAY);
    doc.text('ÎNTOCMIT', xStart, y, { width: colWidth, align: 'center', lineBreak: false });
    y += 5 * MM;
    doc.font('Regular').fontSize(9).fillColor(BLACK);
    doc.text(data.instructor_name || '', xStart, y, { width: colWidth, align: 'center', lineBreak: false });

    // Right: Aprobat
    const rightX = xStart + CONTENT_W / 2 + 10 * MM;
    doc.font('Bold').fontSize(8).fillColor(MID_GRAY);
    doc.text('APROBAT', rightX, y - 5 * MM, { width: colWidth, align: 'center', lineBreak: false });
    doc.font('Regular').fontSize(9).fillColor(BLACK);
    doc.text(data.organization_representative || 'Reprezentant Angajator', rightX, y, { width: colWidth, align: 'center', lineBreak: false });

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
    const timestamp = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;

    const footerText = `Document generat de platforma s-s-m.ro · ${timestamp} · Conform HG 1425/2006 · Legea 319/2006`;

    doc.font('Regular').fontSize(5.5).fillColor(MID_GRAY);
    doc.text(footerText, xStart, footerY + 2 * MM, {
      width: CONTENT_W,
      align: 'center',
      lineBreak: false,
    });

    // ============================================================
    // FINALIZE
    // ============================================================
    doc.end();
  });
}

module.exports = { generateTematicaPDF };
