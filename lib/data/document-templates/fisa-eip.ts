/**
 * Template pentru Fișa Individuală de Atribuire Echipament Individual de Protecție (EIP)
 *
 * Conform HG 1048/2006 privind cerințele minime de securitate și sănătate
 * pentru utilizarea de către lucrători a echipamentelor individuale de protecție
 * la locul de muncă
 *
 * Acest document individualizat înregistrează toate echipamentele EIP
 * atribuite unui angajat, inclusiv date de atribuire, returnare și semnături.
 */

export interface FisaEIPData {
  /** Informații despre organizație */
  organizatie: {
    nume: string;
    cui: string;
    adresa: string;
    telefon?: string;
    email?: string;
  };

  /** Informații despre angajat */
  angajat: {
    nume: string;
    prenume: string;
    cnp?: string;
    functie: string;
    departament?: string;
    dataAngajare: string; // ISO format: YYYY-MM-DD
  };

  /** Lista echipamentelor EIP atribuite */
  echipamente: {
    nr: number;
    denumire: string;
    cantitate: number;
    unitateMasura?: string; // ex: "buc", "perechi", "seturi"
    dataAtribuire: string; // ISO format: YYYY-MM-DD
    dataReturnare?: string; // ISO format: YYYY-MM-DD
    observatii?: string;
    semnaturaAtribuire?: string; // pentru versiune digitală - base64 sau URL
    semnaturaReturnare?: string; // pentru versiune digitală - base64 sau URL
  }[];

  /** Data generării documentului */
  dataGenerare?: string;
}

/**
 * Categorii standard de echipamente EIP conform HG 1048/2006
 */
export const CATEGORII_EIP = {
  // Protecția capului
  CASCA_PROTECTIE: 'Cască de protecție',
  CASCA_SUDURA: 'Cască de sudură',
  CACIULA_INDUSTRIE: 'Căciulă industrială',

  // Protecția ochilor și feței
  OCHELARI_PROTECTIE: 'Ochelari de protecție',
  ECRAN_FACIAL: 'Ecran facial',
  OCHELARI_SUDURA: 'Ochelari de sudură',

  // Protecția auzului
  ANTIFOANE_EXTERNE: 'Antifoane externe',
  DOPURI_UZ: 'Dopuri de urechi',
  CASCA_ANTIFONICA: 'Cască antifonică',

  // Protecția respiratorie
  MASCA_PARTICULE: 'Mască protecție particule',
  MASCA_GAZE: 'Mască protecție gaze și vapori',
  SEMIMASCA: 'Semimască filtrare',
  APARAT_RESPIRATOR: 'Aparat de protecție respiratorie',

  // Protecția mâinilor și brațelor
  MANUSI_PROTECTIE: 'Mănuși de protecție',
  MANUSI_MECANICE: 'Mănuși protecție mecanică',
  MANUSI_CHIMICE: 'Mănuși protecție chimică',
  MANUSI_TERMICE: 'Mănuși protecție termică',
  MANUSI_ELECTRICE: 'Mănuși protecție electrică',

  // Protecția picioarelor și piciorului
  INCALTAMINTE_SIGURANTA: 'Încălțăminte de siguranță',
  BOCANCI_PROTECTIE: 'Bocanci de protecție',
  CIZME_PROTECTIE: 'Cizme de protecție',
  CIZME_IZOLATOARE: 'Cizme izolatoare electric',

  // Protecția corpului
  COMBINEZON: 'Combinezon de protecție',
  SALOPETA: 'Salopetă de protecție',
  SORT: 'Sort de protecție',
  VESTA_REFLECTORIZANTA: 'Vestă reflectorizantă',
  JACHETA_IARNA: 'Jachetă de iarnă',

  // Protecție împotriva căderilor
  HAM_SIGURANTA: 'Ham de siguranță',
  CHINGI_SIGURANTA: 'Chingi de siguranță',
  CORDON_SIGURANTA: 'Cordon de siguranță cu amortizor',
} as const;

/**
 * Unități de măsură standard pentru EIP
 */
export const UNITATI_MASURA_EIP = {
  BUCATI: 'buc',
  PERECHI: 'perechi',
  SETURI: 'seturi',
  METRI: 'm',
  CUTII: 'cutii',
} as const;

/**
 * Generează HTML pentru Fișa Individuală de Atribuire EIP
 * conform HG 1048/2006
 */
export function generateFisaEIPHTML(data: FisaEIPData): string {
  const numeTotalAngajat = `${data.angajat.nume} ${data.angajat.prenume}`;
  const dataGenerare = data.dataGenerare || new Date().toISOString().split('T')[0];

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fișă Individuală Atribuire EIP - ${numeTotalAngajat}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 1.5cm 1cm;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 10pt;
      line-height: 1.3;
      color: #000;
      margin: 0;
      padding: 0;
    }

    .header {
      text-align: center;
      margin-bottom: 15px;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
    }

    .header h1 {
      font-size: 13pt;
      font-weight: bold;
      margin: 0 0 4px 0;
      text-transform: uppercase;
    }

    .header .subtitle {
      font-size: 9pt;
      font-style: italic;
      margin: 3px 0;
    }

    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      gap: 15px;
    }

    .organizatie-info,
    .angajat-info {
      flex: 1;
      border: 1px solid #000;
      padding: 8px;
      font-size: 9pt;
    }

    .organizatie-info {
      background-color: #f9f9f9;
    }

    .organizatie-info p,
    .angajat-info p {
      margin: 2px 0;
    }

    .organizatie-info strong,
    .angajat-info strong {
      display: inline-block;
      width: 90px;
    }

    .angajat-info h2 {
      font-size: 11pt;
      margin: 0 0 8px 0;
      text-decoration: underline;
      text-align: center;
    }

    .eip-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 8.5pt;
    }

    .eip-table th,
    .eip-table td {
      border: 1px solid #000;
      padding: 5px 3px;
      text-align: center;
      vertical-align: middle;
    }

    .eip-table th {
      background-color: #e0e0e0;
      font-weight: bold;
      font-size: 8.5pt;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .eip-table td.denumire,
    .eip-table td.observatii {
      text-align: left;
      font-size: 8.5pt;
    }

    .eip-table td.semnatura {
      min-height: 50px;
      vertical-align: bottom;
      padding: 3px;
    }

    .eip-table td.semnatura img {
      max-height: 40px;
      max-width: 100%;
    }

    .col-nr { width: 3%; }
    .col-denumire { width: 20%; }
    .col-cantitate { width: 6%; }
    .col-um { width: 6%; }
    .col-data-atribuire { width: 9%; }
    .col-sem-atribuire { width: 12%; }
    .col-data-returnare { width: 9%; }
    .col-sem-returnare { width: 12%; }
    .col-observatii { width: 23%; }

    .section-title {
      font-size: 10pt;
      font-weight: bold;
      margin: 12px 0 8px 0;
      text-decoration: underline;
    }

    .note {
      font-size: 7.5pt;
      font-style: italic;
      color: #555;
      margin-top: 10px;
      padding: 6px;
      background-color: #f5f5f5;
      border-left: 3px solid #999;
      page-break-inside: avoid;
    }

    .note strong {
      display: block;
      margin-bottom: 3px;
    }

    .note ul {
      margin: 3px 0 0 15px;
      padding: 0;
    }

    .note li {
      margin: 2px 0;
    }

    .footer {
      margin-top: 15px;
      border-top: 1px solid #ccc;
      padding-top: 8px;
      font-size: 8pt;
      color: #666;
      display: flex;
      justify-content: space-between;
    }

    .signatures {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }

    .signature-box {
      text-align: center;
      min-width: 200px;
    }

    .signature-box p {
      margin: 3px 0;
      font-size: 9pt;
    }

    .signature-box .line {
      border-top: 1px solid #000;
      margin: 40px 20px 5px 20px;
    }

    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>FIȘĂ INDIVIDUALĂ DE ATRIBUIRE</h1>
    <h1>ECHIPAMENT INDIVIDUAL DE PROTECȚIE (EIP)</h1>
    <div class="subtitle">Conform HG 1048/2006 privind cerințele minime de securitate și sănătate</div>
    <div class="subtitle">pentru utilizarea echipamentelor individuale de protecție la locul de muncă</div>
  </div>

  <div class="info-section">
    <div class="organizatie-info">
      <p><strong>Societate:</strong> ${data.organizatie.nume}</p>
      <p><strong>C.U.I.:</strong> ${data.organizatie.cui}</p>
      <p><strong>Adresa:</strong> ${data.organizatie.adresa}</p>
      ${data.organizatie.telefon ? `<p><strong>Telefon:</strong> ${data.organizatie.telefon}</p>` : ''}
      ${data.organizatie.email ? `<p><strong>Email:</strong> ${data.organizatie.email}</p>` : ''}
    </div>

    <div class="angajat-info">
      <h2>Date Angajat</h2>
      <p><strong>Nume:</strong> ${numeTotalAngajat}</p>
      ${data.angajat.cnp ? `<p><strong>CNP:</strong> ${data.angajat.cnp}</p>` : ''}
      <p><strong>Funcția:</strong> ${data.angajat.functie}</p>
      ${data.angajat.departament ? `<p><strong>Departament:</strong> ${data.angajat.departament}</p>` : ''}
      <p><strong>Data angajării:</strong> ${formatDate(data.angajat.dataAngajare)}</p>
    </div>
  </div>

  <div class="section-title">REGISTRUL ECHIPAMENTELOR ATRIBUITE</div>

  <table class="eip-table">
    <thead>
      <tr>
        <th class="col-nr">Nr.<br/>crt.</th>
        <th class="col-denumire">Denumirea<br/>echipamentului EIP</th>
        <th class="col-cantitate">Cant.</th>
        <th class="col-um">U.M.</th>
        <th class="col-data-atribuire">Data<br/>atribuirii</th>
        <th class="col-sem-atribuire">Semnătura<br/>la primire</th>
        <th class="col-data-returnare">Data<br/>returnării</th>
        <th class="col-sem-returnare">Semnătura<br/>la returnare</th>
        <th class="col-observatii">Observații</th>
      </tr>
    </thead>
    <tbody>
      ${data.echipamente.length > 0 ? data.echipamente.map(eip => `
      <tr>
        <td>${eip.nr}</td>
        <td class="denumire">${eip.denumire}</td>
        <td>${eip.cantitate}</td>
        <td>${eip.unitateMasura || 'buc'}</td>
        <td>${formatDate(eip.dataAtribuire)}</td>
        <td class="semnatura">${eip.semnaturaAtribuire ? `<img src="${eip.semnaturaAtribuire}" alt="Semnătură">` : ''}</td>
        <td>${eip.dataReturnare ? formatDate(eip.dataReturnare) : '-'}</td>
        <td class="semnatura">${eip.semnaturaReturnare ? `<img src="${eip.semnaturaReturnare}" alt="Semnătură">` : ''}</td>
        <td class="observatii">${eip.observatii || '-'}</td>
      </tr>
      `).join('') : `
      <tr>
        <td colspan="9" style="text-align: center; padding: 20px; font-style: italic; color: #999;">
          Nu există echipamente EIP atribuite
        </td>
      </tr>
      `}
      ${generateEmptyRows(Math.max(0, 12 - data.echipamente.length))}
    </tbody>
  </table>

  <div class="note">
    <strong>Note importante:</strong>
    <ul>
      <li>Angajatul are obligația să folosească corect echipamentul individual de protecție primit conform instruirii primite.</li>
      <li>EIP-ul deteriorat sau uzat se returnează și se înlocuiește cu unul nou.</li>
      <li>La încetarea contractului de muncă, angajatul restituie toate echipamentele primite.</li>
      <li>Semnătura la primire confirmă că angajatul a primit echipamentul în stare bună și a fost instruit privind utilizarea acestuia.</li>
      <li>Conform HG 1048/2006, angajatorul are obligația de a asigura gratuit EIP adecvat riscurilor identificate.</li>
      <li>EIP-ul este strict personal și nu poate fi cedat altor persoane.</li>
    </ul>
  </div>

  <div class="signatures">
    <div class="signature-box">
      <p><strong>ANGAJAT</strong></p>
      <p>${numeTotalAngajat}</p>
      <div class="line"></div>
      <p>Semnătura</p>
    </div>

    <div class="signature-box">
      <p><strong>RESPONSABIL SSM</strong></p>
      <p>&nbsp;</p>
      <div class="line"></div>
      <p>Semnătura și ștampila</p>
    </div>

    <div class="signature-box">
      <p><strong>REPREZENTANT ANGAJATOR</strong></p>
      <p>&nbsp;</p>
      <div class="line"></div>
      <p>Semnătura și ștampila</p>
    </div>
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
 * Generează rânduri goale pentru tabel (pentru format printat)
 */
function generateEmptyRows(count: number): string {
  if (count <= 0) return '';

  const rows: string[] = [];
  for (let i = 0; i < count; i++) {
    rows.push(`
      <tr>
        <td>&nbsp;</td>
        <td class="denumire">&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="semnatura">&nbsp;</td>
        <td>&nbsp;</td>
        <td class="semnatura">&nbsp;</td>
        <td class="observatii">&nbsp;</td>
      </tr>
    `);
  }

  return rows.join('');
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
 * Generează date exemplu pentru testing
 */
export function generateSampleFisaEIPData(): FisaEIPData {
  return {
    organizatie: {
      nume: 'SC EXEMPLU CONSTRUCT SRL',
      cui: 'RO12345678',
      adresa: 'Str. Industriei nr. 10, București, Sector 3',
      telefon: '021.123.4567',
      email: 'office@exemplu.ro',
    },
    angajat: {
      nume: 'Popescu',
      prenume: 'Ion',
      cnp: '1800101123456',
      functie: 'Muncitor necalificat',
      departament: 'Producție',
      dataAngajare: '2024-01-10',
    },
    echipamente: [
      {
        nr: 1,
        denumire: CATEGORII_EIP.CASCA_PROTECTIE,
        cantitate: 1,
        unitateMasura: UNITATI_MASURA_EIP.BUCATI,
        dataAtribuire: '2024-01-10',
        observatii: 'Cască albă cu vizor - EN 397',
      },
      {
        nr: 2,
        denumire: CATEGORII_EIP.INCALTAMINTE_SIGURANTA,
        cantitate: 1,
        unitateMasura: UNITATI_MASURA_EIP.PERECHI,
        dataAtribuire: '2024-01-10',
        observatii: 'Bocanci S3 mărimea 43',
      },
      {
        nr: 3,
        denumire: CATEGORII_EIP.MANUSI_MECANICE,
        cantitate: 5,
        unitateMasura: UNITATI_MASURA_EIP.PERECHI,
        dataAtribuire: '2024-01-10',
        observatii: 'Mănuși latex cu protecție mecanică',
      },
      {
        nr: 4,
        denumire: CATEGORII_EIP.VESTA_REFLECTORIZANTA,
        cantitate: 2,
        unitateMasura: UNITATI_MASURA_EIP.BUCATI,
        dataAtribuire: '2024-01-10',
        observatii: 'Vestă reflectorizantă portocalie - EN 471',
      },
      {
        nr: 5,
        denumire: CATEGORII_EIP.OCHELARI_PROTECTIE,
        cantitate: 1,
        unitateMasura: UNITATI_MASURA_EIP.BUCATI,
        dataAtribuire: '2024-01-15',
        observatii: 'Ochelari protecție impact - EN 166',
      },
      {
        nr: 6,
        denumire: CATEGORII_EIP.ANTIFOANE_EXTERNE,
        cantitate: 1,
        unitateMasura: UNITATI_MASURA_EIP.BUCATI,
        dataAtribuire: '2024-01-15',
        observatii: 'Antifoane cu arcul peste cap - SNR 27dB',
      },
      {
        nr: 7,
        denumire: CATEGORII_EIP.MANUSI_MECANICE,
        cantitate: 5,
        unitateMasura: UNITATI_MASURA_EIP.PERECHI,
        dataAtribuire: '2024-04-20',
        dataReturnare: '2024-07-15',
        observatii: 'Înlocuire după uzură - mănuși rupte',
      },
      {
        nr: 8,
        denumire: CATEGORII_EIP.JACHETA_IARNA,
        cantitate: 1,
        unitateMasura: UNITATI_MASURA_EIP.BUCATI,
        dataAtribuire: '2024-11-01',
        observatii: 'Jachetă impermeabilă pentru sezonul rece',
      },
    ],
    dataGenerare: new Date().toISOString().split('T')[0],
  };
}

/**
 * Validează datele pentru fișa EIP
 */
export function validateFisaEIPData(data: Partial<FisaEIPData>): {
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

  // Validare angajat
  if (!data.angajat?.nume?.trim()) {
    errors.push('Numele angajatului este obligatoriu');
  }
  if (!data.angajat?.prenume?.trim()) {
    errors.push('Prenumele angajatului este obligatoriu');
  }
  if (!data.angajat?.functie?.trim()) {
    errors.push('Funcția angajatului este obligatorie');
  }
  if (!data.angajat?.dataAngajare) {
    errors.push('Data angajării este obligatorie');
  }

  // Validare echipamente
  if (!data.echipamente || data.echipamente.length === 0) {
    errors.push('Trebuie să existe cel puțin un echipament EIP atribuit');
  } else {
    data.echipamente.forEach((eip, index) => {
      if (!eip.denumire?.trim()) {
        errors.push(`Echipament ${index + 1}: Denumirea este obligatorie`);
      }
      if (!eip.cantitate || eip.cantitate <= 0) {
        errors.push(`Echipament ${index + 1}: Cantitatea trebuie să fie mai mare ca 0`);
      }
      if (!eip.dataAtribuire) {
        errors.push(`Echipament ${index + 1}: Data atribuirii este obligatorie`);
      }

      // Validare logică returnare
      if (eip.dataReturnare) {
        const dataAtrib = new Date(eip.dataAtribuire);
        const dataRet = new Date(eip.dataReturnare);

        if (dataRet < dataAtrib) {
          errors.push(`Echipament ${index + 1}: Data returnării nu poate fi înainte de data atribuirii`);
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculează EIP-uri active (nereturnat) pentru un angajat
 */
export function getActiveEIP(data: FisaEIPData): FisaEIPData['echipamente'] {
  return data.echipamente.filter(eip => !eip.dataReturnare);
}

/**
 * Calculează EIP-uri returnate pentru un angajat
 */
export function getReturnedEIP(data: FisaEIPData): FisaEIPData['echipamente'] {
  return data.echipamente.filter(eip => eip.dataReturnare);
}

/**
 * Calculează statistici EIP pentru un angajat
 */
export function calculateEIPStats(data: FisaEIPData): {
  totalEchipamente: number;
  echipamenteActive: number;
  echipamenteReturnate: number;
  ultimaAtribuire: string | null;
  ultimaReturnare: string | null;
} {
  const active = getActiveEIP(data);
  const returnate = getReturnedEIP(data);

  const dateAtribuiri = data.echipamente
    .map(e => e.dataAtribuire)
    .filter(Boolean)
    .sort()
    .reverse();

  const dateReturnari = data.echipamente
    .map(e => e.dataReturnare)
    .filter(Boolean)
    .sort()
    .reverse();

  return {
    totalEchipamente: data.echipamente.length,
    echipamenteActive: active.length,
    echipamenteReturnate: returnate.length,
    ultimaAtribuire: dateAtribuiri[0] || null,
    ultimaReturnare: dateReturnari[0] || null,
  };
}

/**
 * Export implicit
 */
export default {
  generateFisaEIPHTML,
  generateSampleFisaEIPData,
  validateFisaEIPData,
  getActiveEIP,
  getReturnedEIP,
  calculateEIPStats,
  CATEGORII_EIP,
  UNITATI_MASURA_EIP,
};
