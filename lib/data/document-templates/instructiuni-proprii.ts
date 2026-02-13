/**
 * Template pentru Instrucțiuni Proprii SSM per Activitate
 *
 * Conform Legii 319/2006 privind securitatea și sănătatea în muncă
 * și HG 1425/2006 privind normele metodologice de aplicare
 *
 * Instrucțiunile proprii sunt documente specifice fiecărei activități/post de lucru,
 * care detaliază riscurile și măsurile de prevenire necesare pentru desfășurarea
 * în siguranță a activității respective.
 */

export interface InstructiuniPropriiData {
  /** Informații despre organizație */
  organizatie: {
    nume: string;
    cui: string;
    adresa: string;
    telefon?: string;
    email?: string;
  };

  /** Detalii instrucțiune */
  instructiune: {
    cod: string; // ex: "IP-001", "SSM-INST-15"
    titlu: string; // ex: "Lucrul la înălțime", "Operare mașină de frezat"
    versiune: string; // ex: "1.0", "2.1"
    data: string; // ISO format: YYYY-MM-DD
    revizuire?: string; // data următoarei revizuiri (ISO format)
  };

  /** Locuri de muncă / posturi unde se aplică */
  aplicare: {
    departament?: string;
    locDeMunca: string[]; // ex: ["Atelier mecanic", "Șantier construcții"]
    functii: string[]; // ex: ["Muncitor constructor", "Operator utilaj"]
  };

  /** Scop și domeniu de aplicare */
  scop: string;

  /** Definiții și termeni specifici (opțional) */
  definitii?: {
    termen: string;
    explicatie: string;
  }[];

  /** Responsabilități */
  responsabilitati: {
    angajator: string[];
    lucrator: string[];
    supraveghetor?: string[];
  };

  /** Descrierea detaliată a activității */
  descriereActivitate: {
    introducere: string;
    etape: {
      nr: number;
      denumire: string;
      detalii: string;
    }[];
  };

  /** Riscuri identificate */
  riscuri: {
    tip: string; // ex: "Fizic", "Chimic", "Mecanic", "Ergonomic"
    descriere: string;
    gravitate: 'scăzută' | 'medie' | 'ridicată' | 'foarte ridicată';
  }[];

  /** Măsuri de prevenire și protecție */
  masuriPrevenire: {
    categorie: string; // ex: "Măsuri tehnice", "Măsuri organizatorice", "EIP"
    masuri: string[];
  }[];

  /** Echipament individual de protecție (EIP) */
  eip: {
    echipament: string; // ex: "Cască de protecție", "Mănuși izolante"
    standard?: string; // ex: "EN 397", "EN 388"
    obligatoriu: boolean;
  }[];

  /** Instrucțiuni de prim ajutor specifice */
  primAjutor: {
    situatie: string; // ex: "Electrocutare", "Arsură chimică"
    actiuni: string[];
  }[];

  /** Sancțiuni pentru nerespectare (opțional) */
  sanctiuni?: string;

  /** Întocmit și aprobat */
  semnaturi: {
    intocmit: {
      nume: string;
      functie: string;
      data?: string;
    };
    verificat?: {
      nume: string;
      functie: string;
      data?: string;
    };
    aprobat: {
      nume: string;
      functie: string;
      data?: string;
    };
  };

  /** Data generării documentului */
  dataGenerare?: string;
}

/**
 * Niveluri de gravitate pentru riscuri
 */
export const NIVELURI_GRAVITATE = {
  SCAZUTA: 'scăzută',
  MEDIE: 'medie',
  RIDICATA: 'ridicată',
  FOARTE_RIDICATA: 'foarte ridicată',
} as const;

/**
 * Tipuri comune de riscuri SSM
 */
export const TIPURI_RISCURI = {
  FIZIC: 'Fizic',
  CHIMIC: 'Chimic',
  BIOLOGIC: 'Biologic',
  MECANIC: 'Mecanic',
  ELECTRIC: 'Electric',
  ERGONOMIC: 'Ergonomic',
  PSIHOSOCIAL: 'Psihosocial',
  INCENDIU: 'Incendiu/Explozie',
} as const;

/**
 * Categorii de măsuri de prevenire
 */
export const CATEGORII_MASURI = {
  TEHNICE: 'Măsuri tehnice',
  ORGANIZATORICE: 'Măsuri organizatorice',
  EIP: 'Echipament individual de protecție',
  MONITORIZARE: 'Monitorizare și supraveghere',
  FORMARE: 'Formare și instruire',
} as const;

/**
 * Generează HTML pentru Instrucțiuni Proprii SSM
 * conform Legii 319/2006 și HG 1425/2006
 */
export function generateInstructiuniPropriiHTML(data: InstructiuniPropriiData): string {
  const dataGenerare = data.dataGenerare || new Date().toISOString().split('T')[0];

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instrucțiune Proprie SSM - ${data.instructiune.titlu}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm 1.5cm;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      margin: 0;
      padding: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      border-bottom: 2px solid #000;
      padding-bottom: 15px;
    }

    .header-left {
      flex: 1;
      font-size: 10pt;
    }

    .header-left p {
      margin: 2px 0;
    }

    .header-right {
      text-align: right;
      font-size: 10pt;
      border: 1px solid #000;
      padding: 10px;
      background-color: #f9f9f9;
    }

    .header-right p {
      margin: 3px 0;
    }

    .title {
      text-align: center;
      margin: 30px 0 25px 0;
    }

    .title h1 {
      font-size: 16pt;
      font-weight: bold;
      margin: 5px 0;
      text-transform: uppercase;
    }

    .title .subtitle {
      font-size: 14pt;
      font-weight: bold;
      margin: 10px 0;
      color: #0066cc;
    }

    .section {
      margin: 20px 0;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 13pt;
      font-weight: bold;
      margin: 20px 0 10px 0;
      padding: 8px 12px;
      background-color: #0066cc;
      color: white;
      text-transform: uppercase;
    }

    .subsection-title {
      font-size: 12pt;
      font-weight: bold;
      margin: 15px 0 8px 0;
      text-decoration: underline;
    }

    .content {
      margin: 10px 0;
      text-align: justify;
    }

    .content p {
      margin: 8px 0;
    }

    .list {
      margin: 10px 0 10px 20px;
    }

    .list li {
      margin: 6px 0;
      text-align: justify;
    }

    .numbered-list {
      list-style-type: decimal;
    }

    .alpha-list {
      list-style-type: lower-alpha;
    }

    .bullet-list {
      list-style-type: disc;
    }

    .info-box {
      border: 1px solid #ccc;
      padding: 12px;
      margin: 15px 0;
      background-color: #f9f9f9;
    }

    .info-box p {
      margin: 5px 0;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 10pt;
    }

    .table th,
    .table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
      vertical-align: top;
    }

    .table th {
      background-color: #e0e0e0;
      font-weight: bold;
      text-align: center;
    }

    .warning-box {
      border: 3px solid #ff6600;
      padding: 15px;
      margin: 20px 0;
      background-color: #fff3e0;
    }

    .warning-box .warning-title {
      font-size: 13pt;
      font-weight: bold;
      color: #ff6600;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    .danger-box {
      border: 3px solid #cc0000;
      padding: 15px;
      margin: 20px 0;
      background-color: #ffebee;
    }

    .danger-box .danger-title {
      font-size: 13pt;
      font-weight: bold;
      color: #cc0000;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    .eip-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
      margin: 15px 0;
    }

    .eip-item {
      border: 1px solid #666;
      padding: 10px;
      background-color: #f5f5f5;
    }

    .eip-item .eip-name {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .eip-item .eip-standard {
      font-size: 9pt;
      font-style: italic;
      color: #666;
    }

    .eip-item .eip-obligatoriu {
      font-size: 9pt;
      color: #cc0000;
      font-weight: bold;
      margin-top: 5px;
    }

    .risk-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 9pt;
      font-weight: bold;
      margin-left: 8px;
    }

    .risk-scazuta {
      background-color: #4caf50;
      color: white;
    }

    .risk-medie {
      background-color: #ff9800;
      color: white;
    }

    .risk-ridicata {
      background-color: #f44336;
      color: white;
    }

    .risk-foarte-ridicata {
      background-color: #b71c1c;
      color: white;
    }

    .signatures {
      margin-top: 40px;
      page-break-inside: avoid;
    }

    .signature-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    .signature-table td {
      border: 1px solid #000;
      padding: 10px;
      vertical-align: top;
    }

    .signature-table .signature-label {
      font-weight: bold;
      font-size: 10pt;
    }

    .signature-table .signature-space {
      min-height: 60px;
      border-top: 1px solid #999;
      margin-top: 40px;
      padding-top: 5px;
      font-size: 9pt;
      text-align: center;
    }

    .footer {
      margin-top: 30px;
      border-top: 1px solid #ccc;
      padding-top: 10px;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }

    .note {
      font-size: 9pt;
      font-style: italic;
      color: #555;
      margin: 15px 0;
      padding: 10px;
      background-color: #f5f5f5;
      border-left: 4px solid #999;
    }

    @media print {
      body { margin: 0; }
      .no-print { display: none; }
      .eip-grid {
        display: block;
      }
      .eip-item {
        display: inline-block;
        width: 45%;
        margin: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <p><strong>${data.organizatie.nume}</strong></p>
      <p>CUI: ${data.organizatie.cui}</p>
      <p>${data.organizatie.adresa}</p>
      ${data.organizatie.telefon ? `<p>Tel: ${data.organizatie.telefon}</p>` : ''}
      ${data.organizatie.email ? `<p>Email: ${data.organizatie.email}</p>` : ''}
    </div>
    <div class="header-right">
      <p><strong>COD:</strong> ${data.instructiune.cod}</p>
      <p><strong>Versiune:</strong> ${data.instructiune.versiune}</p>
      <p><strong>Data:</strong> ${formatDate(data.instructiune.data)}</p>
      ${data.instructiune.revizuire ? `<p><strong>Revizuire:</strong> ${formatDate(data.instructiune.revizuire)}</p>` : ''}
    </div>
  </div>

  <div class="title">
    <h1>INSTRUCȚIUNE PROPRIE</h1>
    <div class="subtitle">${data.instructiune.titlu}</div>
  </div>

  <!-- SCOP ȘI DOMENIU DE APLICARE -->
  <div class="section">
    <div class="section-title">1. SCOP ȘI DOMENIU DE APLICARE</div>
    <div class="content">
      <p>${data.scop}</p>
    </div>

    <div class="info-box">
      <p><strong>Se aplică în următoarele locuri de muncă:</strong></p>
      <ul class="list bullet-list">
        ${data.aplicare.locDeMunca.map(loc => `<li>${loc}</li>`).join('')}
      </ul>
      <p><strong>Pentru funcțiile:</strong></p>
      <ul class="list bullet-list">
        ${data.aplicare.functii.map(functie => `<li>${functie}</li>`).join('')}
      </ul>
      ${data.aplicare.departament ? `<p><strong>Departament:</strong> ${data.aplicare.departament}</p>` : ''}
    </div>
  </div>

  <!-- DEFINIȚII (dacă există) -->
  ${data.definitii && data.definitii.length > 0 ? `
  <div class="section">
    <div class="section-title">2. DEFINIȚII ȘI TERMENI</div>
    <table class="table">
      <thead>
        <tr>
          <th style="width: 30%;">Termen</th>
          <th>Explicație</th>
        </tr>
      </thead>
      <tbody>
        ${data.definitii.map(def => `
        <tr>
          <td><strong>${def.termen}</strong></td>
          <td>${def.explicatie}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <!-- RESPONSABILITĂȚI -->
  <div class="section">
    <div class="section-title">${data.definitii && data.definitii.length > 0 ? '3' : '2'}. RESPONSABILITĂȚI</div>

    <div class="subsection-title">Responsabilitățile angajatorului:</div>
    <ul class="list numbered-list">
      ${data.responsabilitati.angajator.map(resp => `<li>${resp}</li>`).join('')}
    </ul>

    <div class="subsection-title">Responsabilitățile lucrătorului:</div>
    <ul class="list numbered-list">
      ${data.responsabilitati.lucrator.map(resp => `<li>${resp}</li>`).join('')}
    </ul>

    ${data.responsabilitati.supraveghetor && data.responsabilitati.supraveghetor.length > 0 ? `
    <div class="subsection-title">Responsabilitățile supraveghetorului/șefului de echipă:</div>
    <ul class="list numbered-list">
      ${data.responsabilitati.supraveghetor.map(resp => `<li>${resp}</li>`).join('')}
    </ul>
    ` : ''}
  </div>

  <!-- DESCRIEREA ACTIVITĂȚII -->
  <div class="section">
    <div class="section-title">${data.definitii && data.definitii.length > 0 ? '4' : '3'}. DESCRIEREA ACTIVITĂȚII</div>
    <div class="content">
      <p>${data.descriereActivitate.introducere}</p>
    </div>

    <div class="subsection-title">Etapele activității:</div>
    ${data.descriereActivitate.etape.map(etapa => `
    <div class="content">
      <p><strong>Etapa ${etapa.nr}: ${etapa.denumire}</strong></p>
      <p>${etapa.detalii}</p>
    </div>
    `).join('')}
  </div>

  <!-- RISCURI IDENTIFICATE -->
  <div class="section">
    <div class="section-title">${data.definitii && data.definitii.length > 0 ? '5' : '4'}. RISCURI IDENTIFICATE</div>

    <div class="warning-box">
      <div class="warning-title">⚠ ATENȚIE - Riscuri Identificate</div>
      <p>Următoarele riscuri au fost identificate pentru această activitate:</p>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th style="width: 15%;">Tip Risc</th>
          <th style="width: 65%;">Descriere</th>
          <th style="width: 20%;">Gravitate</th>
        </tr>
      </thead>
      <tbody>
        ${data.riscuri.map(risc => `
        <tr>
          <td><strong>${risc.tip}</strong></td>
          <td>${risc.descriere}</td>
          <td style="text-align: center;">
            <span class="risk-badge risk-${risc.gravitate.replace(/ă/g, 'a').replace(/ț/g, 't').replace(/ /g, '-')}">${risc.gravitate.toUpperCase()}</span>
          </td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- MĂSURI DE PREVENIRE ȘI PROTECȚIE -->
  <div class="section">
    <div class="section-title">${data.definitii && data.definitii.length > 0 ? '6' : '5'}. MĂSURI DE PREVENIRE ȘI PROTECȚIE</div>

    ${data.masuriPrevenire.map(categorie => `
    <div class="subsection-title">${categorie.categorie}:</div>
    <ul class="list numbered-list">
      ${categorie.masuri.map(masura => `<li>${masura}</li>`).join('')}
    </ul>
    `).join('')}
  </div>

  <!-- ECHIPAMENT INDIVIDUAL DE PROTECȚIE -->
  <div class="section">
    <div class="section-title">${data.definitii && data.definitii.length > 0 ? '7' : '6'}. ECHIPAMENT INDIVIDUAL DE PROTECȚIE (EIP)</div>

    <div class="danger-box">
      <div class="danger-title">🛡️ OBLIGATORIU - Echipament Individual de Protecție</div>
      <p>Următoarele echipamente individuale de protecție sunt OBLIGATORII pentru desfășurarea în siguranță a activității:</p>
    </div>

    <div class="eip-grid">
      ${data.eip.map(echipament => `
      <div class="eip-item">
        <div class="eip-name">${echipament.echipament}</div>
        ${echipament.standard ? `<div class="eip-standard">Standard: ${echipament.standard}</div>` : ''}
        ${echipament.obligatoriu ? '<div class="eip-obligatoriu">⚠ OBLIGATORIU</div>' : '<div style="font-size: 9pt; color: #666;">Recomandat</div>'}
      </div>
      `).join('')}
    </div>

    <div class="note">
      <strong>Notă importantă:</strong> Echipamentul individual de protecție trebuie să fie conform standardelor în vigoare,
      întreținut corespunzător și înlocuit periodic conform instrucțiunilor producătorului.
      Lucrătorii sunt obligați să utilizeze EIP-ul pus la dispoziție de angajator.
    </div>
  </div>

  <!-- PRIM AJUTOR -->
  <div class="section">
    <div class="section-title">${data.definitii && data.definitii.length > 0 ? '8' : '7'}. PRIM AJUTOR ȘI PROCEDURI DE URGENȚĂ</div>

    ${data.primAjutor.map(situatie => `
    <div class="subsection-title">În caz de ${situatie.situatie}:</div>
    <ol class="list numbered-list">
      ${situatie.actiuni.map(actiune => `<li>${actiune}</li>`).join('')}
    </ol>
    `).join('')}

    <div class="warning-box">
      <div class="warning-title">📞 NUMERE DE URGENȚĂ</div>
      <p><strong>112</strong> - Număr unic de urgență (pompieri, ambulanță, poliție)</p>
      <p>Anunțați IMEDIAT șeful direct și responsabilul SSM în cazul oricărui accident sau incident!</p>
    </div>
  </div>

  ${data.sanctiuni ? `
  <!-- SANCȚIUNI -->
  <div class="section">
    <div class="section-title">${data.definitii && data.definitii.length > 0 ? '9' : '8'}. SANCȚIUNI</div>
    <div class="content">
      <p>${data.sanctiuni}</p>
    </div>
  </div>
  ` : ''}

  <!-- DISPOZIȚII FINALE -->
  <div class="section">
    <div class="section-title">${data.definitii && data.definitii.length > 0 ? (data.sanctiuni ? '10' : '9') : (data.sanctiuni ? '9' : '8')}. DISPOZIȚII FINALE</div>
    <div class="content">
      <p>Prezenta instrucțiune proprie trebuie respectată întocmai de către toți lucrătorii care desfășoară activitatea descrisă.</p>
      <p>Nerespectarea prezentei instrucțiuni poate duce la accidente de muncă grave și atrage răspunderea disciplinară, conform Regulamentului Intern.</p>
      <p>Instrucțiunea va fi revizuită periodic sau ori de câte ori apar modificări ale condițiilor de muncă, procesului tehnologic sau legislației în vigoare.</p>
      <p>Toți lucrătorii vor fi instruiți pe baza prezentei instrucțiuni înainte de începerea activității și periodic, conform planului de instruire.</p>
    </div>
  </div>

  <!-- SEMNĂTURI -->
  <div class="signatures">
    <table class="signature-table">
      <tr>
        <td style="width: 33%;">
          <div class="signature-label">ÎNTOCMIT</div>
          <p><strong>${data.semnaturi.intocmit.nume}</strong></p>
          <p>${data.semnaturi.intocmit.functie}</p>
          <p>Data: ${data.semnaturi.intocmit.data ? formatDate(data.semnaturi.intocmit.data) : '___________'}</p>
          <div class="signature-space">Semnătura</div>
        </td>
        ${data.semnaturi.verificat ? `
        <td style="width: 33%;">
          <div class="signature-label">VERIFICAT</div>
          <p><strong>${data.semnaturi.verificat.nume}</strong></p>
          <p>${data.semnaturi.verificat.functie}</p>
          <p>Data: ${data.semnaturi.verificat.data ? formatDate(data.semnaturi.verificat.data) : '___________'}</p>
          <div class="signature-space">Semnătura</div>
        </td>
        ` : ''}
        <td style="width: ${data.semnaturi.verificat ? '33' : '67'}%;">
          <div class="signature-label">APROBAT</div>
          <p><strong>${data.semnaturi.aprobat.nume}</strong></p>
          <p>${data.semnaturi.aprobat.functie}</p>
          <p>Data: ${data.semnaturi.aprobat.data ? formatDate(data.semnaturi.aprobat.data) : '___________'}</p>
          <div class="signature-space">Semnătura și ștampila</div>
        </td>
      </tr>
    </table>
  </div>

  <div class="footer">
    <p>Document generat: ${formatDate(dataGenerare)}</p>
    <p>Platforma SSM digitală - s-s-m.ro</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Formatează data din format ISO (YYYY-MM-DD) în format românesc (DD.MM.YYYY)
 */
function formatDate(isoDate: string): string {
  if (!isoDate) return '-';

  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}

/**
 * Generează date exemplu pentru testing - activitate lucru la înălțime
 */
export function generateSampleInstructiuniPropriiData(): InstructiuniPropriiData {
  return {
    organizatie: {
      nume: 'SC CONSTRUCT PROFESIONAL SRL',
      cui: 'RO12345678',
      adresa: 'Str. Constructorilor nr. 15, București, Sector 2',
      telefon: '021.345.6789',
      email: 'office@constructpro.ro',
    },
    instructiune: {
      cod: 'IP-SSM-015',
      titlu: 'LUCRUL LA ÎNĂLȚIME',
      versiune: '2.0',
      data: '2024-01-15',
      revizuire: '2025-01-15',
    },
    aplicare: {
      departament: 'Șantier construcții',
      locDeMunca: ['Șantiere construcții', 'Lucrări de montaj', 'Lucrări de reparații la înălțime'],
      functii: ['Muncitor constructor', 'Montator', 'Zidar', 'Tâmplar'],
    },
    scop: 'Prezenta instrucțiune proprie stabilește cerințele de securitate și sănătate în muncă pentru lucrătorii care desfășoară activități la înălțime (peste 2 metri de la nivelul solului), având ca scop prevenirea accidentelor prin cădere de la înălțime, cădere de obiecte și asigurarea condițiilor de lucru în siguranță.',
    definitii: [
      {
        termen: 'Lucru la înălțime',
        explicatie: 'Orice activitate desfășurată la o diferență de nivel mai mare de 2 metri față de sol sau platformă stabilă.',
      },
      {
        termen: 'Sistem de protecție antecădere',
        explicatie: 'Ansamblul de echipamente (hamuri, corzi, puncte de ancorare) care protejează lucrătorul împotriva căderii.',
      },
      {
        termen: 'Punct de ancorare',
        explicatie: 'Element fix, suficient de rezistent, la care se atașează echipamentul antecădere.',
      },
    ],
    responsabilitati: {
      angajator: [
        'Asigurarea echipamentelor necesare și a echipamentului individual de protecție corespunzător',
        'Verificarea stării tehnice a schelelor, platformelor și sistemelor antecădere',
        'Instruirea lucrătorilor privind riscurile și măsurile de prevenire',
        'Asigurarea supravegherii permanente a lucrărilor la înălțime',
        'Interzicerea lucrului la înălțime în condiții meteorologice nefavorabile (vânt puternic, ploaie torențială)',
      ],
      lucrator: [
        'Utilizarea obligatorie a echipamentului individual de protecție (ham, cască, încălțăminte)',
        'Verificarea zilnică a echipamentului antecădere înainte de utilizare',
        'Respectarea strictă a instrucțiunilor de lucru și a măsurilor de securitate',
        'Anunțarea imediată a șefului direct despre orice defecțiune sau situație periculoasă',
        'Interzicerea categorică a muncii la înălțime sub influența alcoolului sau drogurilor',
        'Nemodificarea sau eliminarea dispozitivelor de protecție',
      ],
      supraveghetor: [
        'Supravegherea permanentă a lucrătorilor care lucrează la înălțime',
        'Verificarea utilizării corecte a echipamentului de protecție',
        'Oprirea imediată a lucrărilor în caz de pericol iminent',
        'Coordonarea evacuării în caz de urgență',
      ],
    },
    descriereActivitate: {
      introducere: 'Lucrul la înălțime reprezintă una dintre activitățile cu risc ridicat în domeniul construcțiilor. Activitatea cuprinde lucrări de montaj, instalații, finisaje, reparații efectuate pe schele, platforme suspendate, scări sau alte echipamente la înălțimi mai mari de 2 metri.',
      etape: [
        {
          nr: 1,
          denumire: 'Pregătirea zonei de lucru',
          detalii: 'Verificarea și securizarea zonei de dedesubt, delimitarea perimetrului cu panouri de avertizare, verificarea accesului, montarea panourilor de semnalizare „LUCRU LA ÎNĂLȚIME".',
        },
        {
          nr: 2,
          denumire: 'Verificarea echipamentelor',
          detalii: 'Inspecția vizuală a schelei/platformei, verificarea stabilității, verificarea punctelor de ancorare, verificarea hamurilor și cordelor de siguranță, testarea rezistenței.',
        },
        {
          nr: 3,
          denumire: 'Echiparea cu EIP',
          detalii: 'Îmbrăcarea hamului de siguranță conform instrucțiunilor, verificarea sistemelor de prindere, atașarea la punctul de ancorare, verificarea căștii și încălțămintei antiderapante.',
        },
        {
          nr: 4,
          denumire: 'Urcarea la locul de muncă',
          detalii: 'Utilizarea exclusiv a căilor de acces amenajate, menținerea a trei puncte de contact, transportul sculelor în valize/genți special destinate, interzicerea cățărării pe părți nesigure.',
        },
        {
          nr: 5,
          denumire: 'Executarea lucrării',
          detalii: 'Menținerea atașării permanente la sistemul antecădere, poziționare stabilă, folosirea sculelor adecvate, evitarea suprasolicitării și a mișcărilor bruste, comunicare permanentă cu supraveghetorul.',
        },
        {
          nr: 6,
          denumire: 'Coborârea și finalizarea',
          detalii: 'Asigurarea sculelor și materialelor, coborâre în siguranță, verificarea zonei de lucru, raportarea către șeful de echipă, depozitarea corespunzătoare a EIP.',
        },
      ],
    },
    riscuri: [
      {
        tip: TIPURI_RISCURI.MECANIC,
        descriere: 'Cădere de la înălțime datorită pierderii echilibrului, ruperii echipamentului sau căilor de acces nesigure',
        gravitate: 'foarte ridicată',
      },
      {
        tip: TIPURI_RISCURI.MECANIC,
        descriere: 'Cădere de obiecte, scule sau materiale de construcție asupra lucrătorilor de la sol',
        gravitate: 'ridicată',
      },
      {
        tip: TIPURI_RISCURI.MECANIC,
        descriere: 'Prăbușirea schelei sau platformei de lucru din cauza montajului defectuos sau supraîncărcării',
        gravitate: 'foarte ridicată',
      },
      {
        tip: TIPURI_RISCURI.FIZIC,
        descriere: 'Expunere la condiții meteorologice nefavorabile (vânt puternic, temperaturi extreme, fulgere)',
        gravitate: 'ridicată',
      },
      {
        tip: TIPURI_RISCURI.ERGONOMIC,
        descriere: 'Poziții de lucru forțate, solicitare fizică crescută, oboseală',
        gravitate: 'medie',
      },
      {
        tip: TIPURI_RISCURI.ELECTRIC,
        descriere: 'Contact cu linii electrice aeriene în apropierea zonei de lucru',
        gravitate: 'foarte ridicată',
      },
    ],
    masuriPrevenire: [
      {
        categorie: CATEGORII_MASURI.TEHNICE,
        masuri: [
          'Utilizarea exclusiv a schelelor și platformelor certificate și verificate tehnic',
          'Montarea balustradelor de protecție la minimum 1 metru înălțime',
          'Instalarea plaselor de protecție și a planșeelor intermediare',
          'Asigurarea punctelor de ancorare certificate (minimum 15 kN)',
          'Montarea scărilor de acces conform normelor (unghi 60-75°)',
          'Instalarea sistemelor colective de protecție (plase, parapete)',
        ],
      },
      {
        categorie: CATEGORII_MASURI.ORGANIZATORICE,
        masuri: [
          'Interzicerea lucrului la înălțime în condiții meteo nefavorabile (vânt >40 km/h, furtună, ceață densă)',
          'Asigurarea supravegherii permanente a lucrătorilor',
          'Delimitarea și securizarea zonei de dedesubt',
          'Planificarea lucrărilor pentru evitarea lucrului simultan pe verticală',
          'Asigurarea timpului necesar pentru pauze (la fiecare 2 ore)',
          'Restricționarea accesului persoanelor neautorizate',
          'Verificarea zilnică a echipamentelor înainte de începerea lucrului',
        ],
      },
      {
        categorie: CATEGORII_MASURI.EIP,
        masuri: [
          'Utilizarea obligatorie a hamurilor de siguranță cu inel dorsal',
          'Purtarea căștii de protecție pe toată durata lucrului',
          'Încălțăminte de protecție antiderapantă cu bombeu metalic',
          'Mănuși de protecție adecvate manipulării materialelor',
          'Vestă reflectorizantă pentru vizibilitate',
        ],
      },
      {
        categorie: CATEGORII_MASURI.MONITORIZARE,
        masuri: [
          'Verificarea și testarea sistemelor antecădere înainte de fiecare utilizare',
          'Inspecții periodice ale schelelor și platformelor (săptămânal)',
          'Monitorizarea condițiilor meteorologice',
          'Raportarea imediată a oricărei situații periculoase',
        ],
      },
    ],
    eip: [
      {
        echipament: 'Ham de siguranță complet',
        standard: 'EN 361',
        obligatoriu: true,
      },
      {
        echipament: 'Dispozitiv antecădere cu frână automată',
        standard: 'EN 360',
        obligatoriu: true,
      },
      {
        echipament: 'Cască de protecție',
        standard: 'EN 397',
        obligatoriu: true,
      },
      {
        echipament: 'Încălțăminte de protecție S3',
        standard: 'EN ISO 20345',
        obligatoriu: true,
      },
      {
        echipament: 'Mănuși de protecție mecanică',
        standard: 'EN 388',
        obligatoriu: true,
      },
      {
        echipament: 'Vestă reflectorizantă',
        standard: 'EN ISO 20471',
        obligatoriu: true,
      },
      {
        echipament: 'Ochelari de protecție',
        standard: 'EN 166',
        obligatoriu: false,
      },
    ],
    primAjutor: [
      {
        situatie: 'Cădere de la înălțime',
        actiuni: [
          'Apelați IMEDIAT 112 și solicitați ambulanța',
          'NU mutați victima dacă există suspiciune de leziuni la coloană',
          'Verificați starea de conștiență și respirația',
          'În caz de hemoragie externă, aplicați presiune directă pe rană cu material curat',
          'Acoperiți victima pentru a preveni hipotermia',
          'Monitorizați semnele vitale până la sosirea ambulanței',
          'Izolați zona de curiozitate și trafic',
        ],
      },
      {
        situatie: 'Suspendare în ham (traumă de suspensie)',
        actiuni: [
          'Efectuați salvarea victimei CÂT MAI RAPID POSIBIL (max 15 minute)',
          'Coborâți victima în poziție orizontală',
          'NU așezați victima brusc în poziție verticală - RISC DE STOP CARDIAC',
          'Apelați 112 imediat',
          'Monitorizați respirația și conștiența',
          'Dacă victima este conștientă, așezați-o în poziție semi-șezândă',
          'Nu oferiți lichide până la evaluarea medicală',
        ],
      },
      {
        situatie: 'Lovire cu obiecte căzute de la înălțime',
        actiuni: [
          'Apelați 112',
          'Evaluați gravitatea leziunilor (cap, torace, membre)',
          'În caz de rană la cap, mențineți victima imobilă',
          'Aplicați gheață (prin material textil) pe vânătăi și umflături',
          'NU îndepărtați obiecte înfipte în rană',
          'Monitorizați starea de conștiență',
        ],
      },
    ],
    sanctiuni: 'Nerespectarea prezentelor instrucțiuni constituie abatere disciplinară gravă și se sancționează conform Regulamentului Intern, putând merge de la avertisment scris până la desfacerea disciplinară a contractului de muncă. În conformitate cu art. 178 din Legea 53/2003 (Codul Muncii), refuzul nejustificat al salariatului de a respecta normele de securitate și sănătate în muncă constituie o abatere gravă.',
    semnaturi: {
      intocmit: {
        nume: 'Popa Andrei',
        functie: 'Responsabil SSM',
        data: '2024-01-10',
      },
      verificat: {
        nume: 'Ionescu George',
        functie: 'Șef Șantier',
        data: '2024-01-12',
      },
      aprobat: {
        nume: 'Marinescu Adrian',
        functie: 'Director General',
        data: '2024-01-15',
      },
    },
    dataGenerare: new Date().toISOString().split('T')[0],
  };
}

/**
 * Validează datele pentru instrucțiunile proprii
 */
export function validateInstructiuniPropriiData(data: Partial<InstructiuniPropriiData>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validare organizație
  if (!data.organizatie?.nume?.trim()) {
    errors.push('Numele organizației este obligatoriu');
  }
  if (!data.organizatie?.cui?.trim()) {
    errors.push('CUI-ul organizației este obligatoriu');
  }
  if (!data.organizatie?.adresa?.trim()) {
    errors.push('Adresa organizației este obligatorie');
  }

  // Validare instrucțiune
  if (!data.instructiune?.cod?.trim()) {
    errors.push('Codul instrucțiunii este obligatoriu');
  }
  if (!data.instructiune?.titlu?.trim()) {
    errors.push('Titlul instrucțiunii este obligatoriu');
  }
  if (!data.instructiune?.versiune?.trim()) {
    errors.push('Versiunea este obligatorie');
  }
  if (!data.instructiune?.data) {
    errors.push('Data instrucțiunii este obligatorie');
  }

  // Validare aplicare
  if (!data.aplicare?.locDeMunca || data.aplicare.locDeMunca.length === 0) {
    errors.push('Trebuie specificat cel puțin un loc de muncă');
  }
  if (!data.aplicare?.functii || data.aplicare.functii.length === 0) {
    errors.push('Trebuie specificată cel puțin o funcție');
  }

  // Validare scop
  if (!data.scop?.trim()) {
    errors.push('Scopul instrucțiunii este obligatoriu');
  }

  // Validare responsabilități
  if (!data.responsabilitati?.angajator || data.responsabilitati.angajator.length === 0) {
    errors.push('Trebuie specificate responsabilitățile angajatorului');
  }
  if (!data.responsabilitati?.lucrator || data.responsabilitati.lucrator.length === 0) {
    errors.push('Trebuie specificate responsabilitățile lucrătorului');
  }

  // Validare descriere activitate
  if (!data.descriereActivitate?.introducere?.trim()) {
    errors.push('Introducerea descrierii activității este obligatorie');
  }
  if (!data.descriereActivitate?.etape || data.descriereActivitate.etape.length === 0) {
    errors.push('Trebuie descrisă cel puțin o etapă a activității');
  }

  // Validare riscuri
  if (!data.riscuri || data.riscuri.length === 0) {
    errors.push('Trebuie identificat cel puțin un risc');
  }

  // Validare măsuri de prevenire
  if (!data.masuriPrevenire || data.masuriPrevenire.length === 0) {
    errors.push('Trebuie specificată cel puțin o categorie de măsuri de prevenire');
  }

  // Validare EIP
  if (!data.eip || data.eip.length === 0) {
    errors.push('Trebuie specificat cel puțin un echipament individual de protecție');
  }

  // Validare prim ajutor
  if (!data.primAjutor || data.primAjutor.length === 0) {
    errors.push('Trebuie specificate instrucțiuni de prim ajutor');
  }

  // Validare semnături
  if (!data.semnaturi?.intocmit?.nume?.trim()) {
    errors.push('Numele persoanei care a întocmit documentul este obligatoriu');
  }
  if (!data.semnaturi?.intocmit?.functie?.trim()) {
    errors.push('Funcția persoanei care a întocmit documentul este obligatorie');
  }
  if (!data.semnaturi?.aprobat?.nume?.trim()) {
    errors.push('Numele persoanei care a aprobat documentul este obligatoriu');
  }
  if (!data.semnaturi?.aprobat?.functie?.trim()) {
    errors.push('Funcția persoanei care a aprobat documentul este obligatorie');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Export implicit
 */
export default {
  generateInstructiuniPropriiHTML,
  generateSampleInstructiuniPropriiData,
  validateInstructiuniPropriiData,
  NIVELURI_GRAVITATE,
  TIPURI_RISCURI,
  CATEGORII_MASURI,
};
