import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateSsmPsiPdf = (employee: any, ssmScore: number, psiScore: number) => {
  const doc = new jsPDF();
  
  // --- DEFINIRE CULORI GLOBALE (Disponibile peste tot) ---
  const blueColor: [number, number, number] = [0, 51, 153];
  const redColor: [number, number, number] = [204, 0, 0];

  // ==========================================
  // PAGINA 1: COPERTĂ SSM (ALBASTRU)
  // ==========================================
  doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(employee.companies?.name?.toUpperCase() || "UNITATEA", 105, 20, { align: 'center' });
  doc.line(20, 22, 190, 22);

  doc.setFontSize(18);
  doc.text("FIȘĂ DE INSTRUIRE INDIVIDUALĂ", 105, 60, { align: 'center' });
  doc.text("privind Securitatea și Sănătatea în Muncă", 105, 70, { align: 'center' });

  doc.setFontSize(11);
  doc.text(`NUMELE ȘI PRENUMELE: ${employee.last_name} ${employee.first_name}`.toUpperCase(), 20, 110);
  doc.text(`MARCA / ID: ${employee.id?.substring(0, 8) || "__________"}`, 20, 120);
  doc.text(`DOMICILIUL: ${employee.address || "___________________________________"}`, 20, 130);

  // ==========================================
  // PAGINA 2: TEXTUL OBLIGATORIU "ATENȚIE!"
  // ==========================================
  doc.addPage();
  doc.setFontSize(24);
  doc.text("ATENȚIE!", 105, 60, { align: 'center' });
  doc.setFontSize(14);
  doc.text("Nici o persoană nu va fi admisă la lucru fără", 105, 80, { align: 'center' });
  doc.text("instruirea introductiv generală și la locul de muncă", 105, 90, { align: 'center' });

  // ==========================================
  // PAGINA 3: REZULTATE TESTĂRI SSM
  // ==========================================
  doc.addPage();
  doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
  doc.text("REZULTATELE TESTĂRILOR SSM", 105, 20, { align: 'center' });
  autoTable(doc, {
    startY: 30,
    head: [['Data', 'Materialul examinat', 'Nota', 'Rezultat']],
    body: [[new Date().toLocaleDateString(), 'Instruire SSM - Conform HG 1425', `${ssmScore}/10`, 'ADMIS']],
    theme: 'grid',
    styles: { lineColor: blueColor }
  });

  // ==========================================
  // PAGINA 4: FIȘĂ PSI (ROȘU)
  // ==========================================
  doc.addPage();
  doc.setTextColor(redColor[0], redColor[1], redColor[2]);
  doc.setFontSize(14);
  doc.text("UNITATEA: " + (employee.companies?.name?.toUpperCase() || "__________"), 105, 20, { align: 'center' });
  doc.setFontSize(18);
  doc.text("FIȘĂ INDIVIDUALĂ DE INSTRUCTAJ", 105, 60, { align: 'center' });
  doc.text("în domeniul Situațiilor de Urgență (PSI)", 105, 70, { align: 'center' });

  // ==========================================
  // PAGINA 5: REZULTATE TESTĂRI PSI
  // ==========================================
  doc.addPage();
  doc.setTextColor(redColor[0], redColor[1], redColor[2]);
  doc.text("CONSEMNĂRI REZULTATE TESTARE PSI", 105, 20, { align: 'center' });
  autoTable(doc, {
    startY: 30,
    head: [['Data', 'Materialul examinat', 'Nota', 'Rezultat']],
    body: [[new Date().toLocaleDateString(), 'Instruire PSI - Conform Legii 307', `${psiScore}/10`, 'ADMIS']],
    theme: 'grid',
    styles: { lineColor: redColor }
  });

  doc.save(`Fisa_SSM_PSI_${employee.last_name}.pdf`);
};