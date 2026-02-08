// ============================================================
// S-S-M.RO — Generator Fișă de Post SSM (Node.js)
// Conform HG 1425/2006 + Legea 319/2006
// ============================================================

const PDFDocument = require('pdfkit');
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
const ORANGE = '#F59E0B';
const RED = '#EF4444';
const WHITE = '#FFFFFF';
const BLACK = '#000000';

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
// DEFAULT DATA BY JOB TYPE
// ============================================================
const DEFAULT_TASKS = {
  default: [
    'Executarea atribuțiilor de serviciu conform fișei postului',
    'Respectarea programului de lucru și a regulamentului intern',
    'Utilizarea echipamentelor de lucru conform instrucțiunilor',
    'Participarea la instruirile SSM periodice obligatorii',
    'Raportarea imediată a incidentelor și accidentelor de muncă',
  ],
};

const DEFAULT_RISKS = {
  default: [
    { tip: 'Risc ergonomic', descriere: 'Postură prelungită în poziție șezând/în picioare', nivel: 'mediu' },
    { tip: 'Risc de electrocutare', descriere: 'Utilizare echipamente electrice', nivel: 'scăzut' },
    { tip: 'Risc de cădere', descriere: 'Suprafețe de circulație', nivel: 'scăzut' },
    { tip: 'Risc PSI', descriere: 'Materiale combustibile în zona de lucru', nivel: 'scăzut' },
    { tip: 'Risc biologic/chimic', descriere: 'Contactul cu produse de curățenie/igienizare', nivel: 'scăzut' },
  ],
};

const DEFAULT_EIP = {
  default: [
    'Echipament de protecție specific postului (conform necesităților)',
    'Încălțăminte de protecție (dacă este cazul)',
    'Mănuși de protecție (pentru manipulare obiecte)',
  ],
};

// ============================================================
// MAIN GENERATOR
// ============================================================

/**
 * Generate a Fișă de Post SSM PDF.
 * @param {object} data - Job description data
 * @returns {Promise<Buffer>} PDF as Buffer
 */
function generateFisaPostPDF(data) {
  return new Promise((resolve, reject) => {
    const fonts = resolveFonts();
    const isCustomFont = !fonts.regular.includes('Helvetica');

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: {
        Title: 'Fișă de Post SSM',
        Author: 's-s-m.ro',
        Subject: `Fișă de Post SSM — ${data.job_title || 'Post'}`,
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

    function drawSectionTitle(title, icon) {
      checkPage(20 * MM);
      drawRect(xStart, y, CONTENT_W, 6 * MM, { fill: LIGHT_GRAY });
      drawRect(xStart, y, CONTENT_W, 6 * MM, { stroke: BORDER_GRAY, strokeWidth: 0.3 });
      doc.font('Bold').fontSize(8.5).fillColor(NAVY);
      const text = icon ? `${icon} ${title}` : title;
      doc.text(text, xStart + 3 * MM, y + 1.5 * MM, { lineBreak: false });
      y += 9 * MM;
    }

    function drawFieldRow(label, value, fy) {
      const labelWidth = 55 * MM;
      doc.font('Bold').fontSize(8).fillColor(MID_GRAY);
      doc.text(label, xStart + 3 * MM, fy, { width: labelWidth, lineBreak: false });
      doc.font('Regular').fontSize(9.5).fillColor(BLACK);
      doc.text(String(value || '—'), xStart + labelWidth + 3 * MM, fy, {
        width: CONTENT_W - labelWidth - 6 * MM,
        lineBreak: false,
      });
      drawLine(xStart + labelWidth + 3 * MM, fy + 12, xEnd - 3 * MM, fy + 12, LIGHT_GRAY, 0.3);
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
    doc.text('FIȘĂ DE POST SSM', xStart, y + 3.5 * MM, {
      width: CONTENT_W,
      align: 'center',
      lineBreak: false,
    });
    y += 17 * MM;

    // Job title
    doc.font('Bold').fontSize(12).fillColor(TEAL);
    doc.text(data.job_title || 'Post', xStart, y, { width: CONTENT_W, align: 'center', lineBreak: false });
    y += 4 * MM;

    // COR code if available
    if (data.cor_code) {
      doc.font('Regular').fontSize(8).fillColor(MID_GRAY);
      doc.text(`Cod COR: ${data.cor_code}`, xStart, y, {
        width: CONTENT_W,
        align: 'center',
        lineBreak: false,
      });
      y += 4 * MM;
    }

    drawLine(xStart, y, xEnd, y, LIGHT_GRAY, 0.3);
    y += 4 * MM;

    // ============================================================
    // SECTION 1: DATE GENERALE
    // ============================================================
    drawSectionTitle('DATE GENERALE');

    const generalRows = [
      ['Angajator:', data.organization_name],
      ['Denumire post:', data.job_title],
      ['Cod COR:', data.cor_code || 'Neclasificat'],
      ['Departament/Secție:', data.department || 'Conform organigramă'],
      ['Data elaborării fișei:', new Date().toLocaleDateString('ro-RO')],
    ];

    for (const [label, value] of generalRows) {
      drawFieldRow(label, value, y);
      y += 6 * MM;
    }
    y += 3 * MM;

    // ============================================================
    // SECTION 2: SARCINI ȘI RESPONSABILITĂȚI
    // ============================================================
    drawSectionTitle('SARCINI ȘI RESPONSABILITĂȚI', '📋');

    const tasks = data.tasks || DEFAULT_TASKS.default;

    for (let i = 0; i < tasks.length; i++) {
      checkPage(10 * MM);
      doc.font('Bold').fontSize(8).fillColor(TEAL);
      doc.text(`${i + 1}.`, xStart + 5 * MM, y, { lineBreak: false });
      doc.font('Regular').fontSize(8.5).fillColor(BLACK);
      const taskText = typeof tasks[i] === 'string' ? tasks[i] : tasks[i].descriere;
      doc.text(taskText, xStart + 12 * MM, y, {
        width: CONTENT_W - 15 * MM,
        lineBreak: true,
      });
      y += doc.heightOfString(taskText, { width: CONTENT_W - 15 * MM }) + 4 * MM;
    }
    y += 3 * MM;

    // ============================================================
    // SECTION 3: RISCURI LA LOCUL DE MUNCĂ
    // ============================================================
    checkPage(60 * MM);
    drawSectionTitle('RISCURI IDENTIFICATE LA LOCUL DE MUNCĂ', '⚠️');

    const risks = data.risks || DEFAULT_RISKS.default;

    // Table header
    const colTip = 50 * MM;
    const colDescriere = CONTENT_W - colTip - 25 * MM;
    const colNivel = 25 * MM;

    drawRect(xStart, y, CONTENT_W, 8 * MM, { fill: LIGHT_GRAY });
    drawRect(xStart, y, CONTENT_W, 8 * MM, { stroke: BORDER_GRAY, strokeWidth: 0.5 });

    doc.font('Bold').fontSize(7.5).fillColor(NAVY);
    doc.text('Tip risc', xStart + 2 * MM, y + 2.5 * MM, { lineBreak: false });
    doc.text('Descriere', xStart + colTip + 2 * MM, y + 2.5 * MM, { lineBreak: false });
    doc.text('Nivel', xStart + colTip + colDescriere + 2 * MM, y + 2.5 * MM, { width: colNivel, align: 'center', lineBreak: false });

    y += 8 * MM;

    for (const risk of risks) {
      const rowH = Math.max(
        doc.heightOfString(risk.descriere, { width: colDescriere - 4 * MM }) + 4 * MM,
        10 * MM
      );

      checkPage(rowH + 5 * MM);

      drawRect(xStart, y, CONTENT_W, rowH, { stroke: BORDER_GRAY, strokeWidth: 0.3 });

      doc.font('Bold').fontSize(8).fillColor(BLACK);
      doc.text(risk.tip, xStart + 2 * MM, y + 2 * MM, { width: colTip - 4 * MM, lineBreak: true });

      doc.font('Regular').fontSize(8).fillColor(BLACK);
      doc.text(risk.descriere, xStart + colTip + 2 * MM, y + 2 * MM, { width: colDescriere - 4 * MM, lineBreak: true });

      // Nivel badge
      const nivelColors = {
        scăzut: { bg: '#D1FAE5', text: '#059669' },
        mediu: { bg: '#FEF3C7', text: '#D97706' },
        ridicat: { bg: '#FEE2E2', text: '#DC2626' },
      };
      const colors = nivelColors[risk.nivel] || nivelColors.mediu;

      const badgeY = y + rowH / 2 - 3 * MM;
      drawRect(xStart + colTip + colDescriere + 5 * MM, badgeY, 15 * MM, 6 * MM, {
        fill: colors.bg,
        stroke: colors.text,
        strokeWidth: 0.5,
      });
      doc.font('Bold').fontSize(7).fillColor(colors.text);
      doc.text(risk.nivel.toUpperCase(), xStart + colTip + colDescriere + 5 * MM, badgeY + 1.5 * MM, {
        width: 15 * MM,
        align: 'center',
        lineBreak: false,
      });

      y += rowH;
    }

    y += 5 * MM;

    // ============================================================
    // SECTION 4: ECHIPAMENTE DE PROTECȚIE (EIP)
    // ============================================================
    checkPage(40 * MM);
    drawSectionTitle('ECHIPAMENTE INDIVIDUALE DE PROTECȚIE (EIP)', '🦺');

    const eip = data.eip || DEFAULT_EIP.default;

    for (let i = 0; i < eip.length; i++) {
      checkPage(8 * MM);
      doc.font('Regular').fontSize(8.5).fillColor(BLACK);
      doc.text('✓', xStart + 5 * MM, y, { lineBreak: false });
      const eipText = typeof eip[i] === 'string' ? eip[i] : eip[i].descriere;
      doc.text(eipText, xStart + 10 * MM, y, { width: CONTENT_W - 13 * MM, lineBreak: true });
      y += doc.heightOfString(eipText, { width: CONTENT_W - 13 * MM }) + 3 * MM;
    }
    y += 4 * MM;

    // Notice box
    checkPage(15 * MM);
    const noticeH = 10 * MM;
    drawRect(xStart, y, CONTENT_W, noticeH, { fill: '#FEF3C7', stroke: '#D97706', strokeWidth: 0.5 });
    doc.font('Bold').fontSize(7.5).fillColor('#92400E');
    doc.text('⚠ Utilizarea EIP este OBLIGATORIE. Nerespectarea atrage răspunderea disciplinară a angajatului.', xStart + 3 * MM, y + 3 * MM, {
      width: CONTENT_W - 6 * MM,
      lineBreak: true,
    });
    y += noticeH + 5 * MM;

    // ============================================================
    // SECTION 5: CERINȚE SSM
    // ============================================================
    checkPage(40 * MM);
    drawSectionTitle('CERINȚE PRIVIND SECURITATEA ȘI SĂNĂTATEA ÎN MUNCĂ', '✅');

    const cerinte = data.cerinte || [
      'Participarea obligatorie la instruirile SSM periodice',
      'Respectarea instrucțiunilor proprii SSM pentru locul de muncă',
      'Utilizarea corectă a echipamentelor de lucru și a EIP',
      'Raportarea imediată a incidentelor, accidentelor și aproape-accidentelor',
      'Conformarea la măsurile PSI (prevenire și stingere incendii)',
      'Menținerea ordinii și curățeniei la locul de muncă',
      'Supunerea la examenul medical de medicina muncii conform legislației',
    ];

    for (const cerinta of cerinte) {
      checkPage(8 * MM);
      doc.font('Regular').fontSize(8.5).fillColor(BLACK);
      doc.text('•', xStart + 5 * MM, y, { lineBreak: false });
      doc.text(cerinta, xStart + 10 * MM, y, { width: CONTENT_W - 13 * MM, lineBreak: true });
      y += doc.heightOfString(cerinta, { width: CONTENT_W - 13 * MM }) + 3 * MM;
    }
    y += 5 * MM;

    // ============================================================
    // LEGAL NOTICE
    // ============================================================
    checkPage(15 * MM);
    const legalH = 12 * MM;
    drawRect(xStart, y, CONTENT_W, legalH, { fill: '#DBEAFE', stroke: '#2563EB', strokeWidth: 0.5 });
    doc.font('Italic').fontSize(7.5).fillColor('#1E3A8A');
    doc.text('Această fișă de post face parte integrantă din documentația SSM a organizației, conform Legii 319/2006 și HG 1425/2006. Angajatul este obligat să cunoască și să respecte toate prevederile fișei de post.', xStart + 3 * MM, y + 3 * MM, {
      width: CONTENT_W - 6 * MM,
      lineBreak: true,
    });
    y += legalH + 8 * MM;

    // ============================================================
    // SIGNATURES
    // ============================================================
    checkPage(50 * MM);
    drawLine(xStart, y, xEnd, y, BORDER_GRAY, 0.5);
    y += 8 * MM;

    const colWidth = (CONTENT_W - 20 * MM) / 2;

    // Left: Întocmit
    doc.font('Bold').fontSize(8).fillColor(MID_GRAY);
    doc.text('ÎNTOCMIT', xStart, y, { width: colWidth, align: 'center', lineBreak: false });
    y += 5 * MM;
    doc.font('Regular').fontSize(9).fillColor(BLACK);
    doc.text(data.prepared_by || 'Responsabil SSM', xStart, y, { width: colWidth, align: 'center', lineBreak: false });

    // Right: Luat la cunoștință
    const rightX = xStart + colWidth + 20 * MM;
    doc.font('Bold').fontSize(8).fillColor(MID_GRAY);
    doc.text('ANGAJAT — LUAT LA CUNOȘTINȚĂ', rightX, y - 5 * MM, { width: colWidth, align: 'center', lineBreak: false });
    doc.font('Regular').fontSize(9).fillColor(BLACK);
    doc.text(data.employee_name || '...........................', rightX, y, { width: colWidth, align: 'center', lineBreak: false });

    y += 15 * MM;

    // Signature lines
    drawLine(xStart + 10 * MM, y, xStart + colWidth - 10 * MM, y, BORDER_GRAY, 0.5);
    drawLine(rightX + 10 * MM, y, rightX + colWidth - 10 * MM, y, BORDER_GRAY, 0.5);

    y += 3 * MM;
    doc.font('Italic').fontSize(7).fillColor(MID_GRAY);
    doc.text('Semnătura + Dată', xStart, y, { width: colWidth, align: 'center', lineBreak: false });
    doc.text('Semnătura + Dată', rightX, y, { width: colWidth, align: 'center', lineBreak: false });

    // ============================================================
    // FOOTER
    // ============================================================
    const footerY = A4_H - MARGIN - 5 * MM;
    drawLine(xStart, footerY, xEnd, footerY, LIGHT_GRAY, 0.3);

    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;

    const footerText = `Document generat de platforma s-s-m.ro · ${timestamp} · Conform Legii 319/2006 · HG 1425/2006`;

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

module.exports = { generateFisaPostPDF };
