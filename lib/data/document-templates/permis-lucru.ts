/**
 * Template pentru Permis de Lucru pentru Lucrări Periculoase
 *
 * Conform HG 1425/2006 și normelor specifice SSM
 * pentru lucrări ce prezintă riscuri majore:
 * - Lucrări la înălțime (peste 2m)
 * - Lucrări în spații închise/confinate
 * - Lucrări cu foc deschis/sudură
 * - Lucrări în zone cu risc de explozie/incendiu
 * - Lucrări pe instalații electrice
 * - Lucrări cu substanțe periculoase
 *
 * Documentul este obligatoriu pentru autorizarea lucrărilor cu risc sporit
 * și asigură că toate măsurile de siguranță sunt implementate.
 */

export interface PermisLucruData {
  /** Informații despre organizație */
  organizatie: {
    nume: string;
    cui: string;
    adresa: string;
    telefon?: string;
    email?: string;
  };

  /** Detalii permis */
  permis: {
    numar: string; // Număr unic permis (ex: "PL-2024-001")
    dataEmitere: string; // ISO format: YYYY-MM-DD
    validDeLa: string; // ISO format: YYYY-MM-DD HH:mm
    validPanaLa: string; // ISO format: YYYY-MM-DD HH:mm
  };

  /** Locația lucrării */
  locatie: {
    locMunca: string; // ex: "Atelier producție - Secția 3"
    adresa?: string; // dacă diferă de sediul firmei
    zonaPericol?: string; // descriere specifică (ex: "Zona cu risc de explozie ATEX")
  };

  /** Descrierea lucrării */
  lucrare: {
    descriere: string; // descriere detaliată lucrare
    tipuriLucrariPericuloase: string[]; // array cu tipurile lucrărilor (ex: ["inaltime", "foc_deschis"])
    echipamenteUtilizate: string[]; // utilaje/echipamente folosite
    durata: string; // durata estimată (ex: "4 ore", "2 zile")
  };

  /** Emitent permis */
  emitent: {
    nume: string;
    functie: string; // ex: "Responsabil SSM", "Șef secție"
    semnatura?: string; // base64 sau URL
  };

  /** Executant lucrare - firma/echipa care execută */
  executant: {
    numeCompanie?: string; // dacă e firma externă
    responsabil: string; // nume responsabil echipă
    telefon?: string;
    echipa: string[]; // array cu numele lucrătorilor
  };

  /** Verificări obligatorii înainte de începere */
  verificari: {
    item: string; // descriere verificare
    efectuat: boolean; // true/false
    observatii?: string;
  }[];

  /** Măsuri SSM obligatorii */
  masuri: {
    masura: string; // descriere măsură
    responsabil?: string;
    verificat: boolean;
  }[];

  /** Echipamente de protecție obligatorii */
  eip: {
    echipament: string; // ex: "Cască de protecție", "Ham de siguranță"
    obligatoriu: boolean;
    distribuit: boolean;
  }[];

  /** Proceduri de urgență */
  urgenta?: {
    personContact: string;
    telefonUrgenta: string;
    localizareStingator?: string;
    localizareTrusa?: string;
    proceduraEvacuare?: string;
  };

  /** Semnături și aprobări */
  semnaturi: {
    emitent?: {
      data: string; // ISO format
      ora: string; // HH:mm
      semnatura?: string;
    };
    executant?: {
      data: string;
      ora: string;
      semnatura?: string;
    };
    responsabilSSM?: {
      nume: string;
      data: string;
      ora: string;
      semnatura?: string;
    };
    inchiderePermis?: {
      data: string;
      ora: string;
      semnatura?: string;
      observatii?: string;
    };
  };

  /** Observații generale */
  observatii?: string;

  /** Data generării documentului */
  dataGenerare?: string;
}

/**
 * Tipuri de lucrări periculoase
 */
export const TIPURI_LUCRARI_PERICULOASE = {
  INALTIME: {
    id: 'inaltime',
    nume: 'Lucrări la înălțime',
    descriere: 'Lucrări executate la peste 2 metri înălțime',
    culoare: '#EF4444',
  },
  SPATII_INCHISE: {
    id: 'spatii_inchise',
    nume: 'Lucrări în spații închise/confinate',
    descriere: 'Lucrări în rezervoare, canale, puțuri, spații fără ventilație',
    culoare: '#F59E0B',
  },
  FOC_DESCHIS: {
    id: 'foc_deschis',
    nume: 'Lucrări cu foc deschis',
    descriere: 'Sudură, tăiere cu gaz, lucrări cu flacără deschisă',
    culoare: '#DC2626',
  },
  ELECTRICE: {
    id: 'electrice',
    nume: 'Lucrări pe instalații electrice',
    descriere: 'Lucrări pe instalații electrice sub tensiune sau dezafectate',
    culoare: '#8B5CF6',
  },
  SUBSTANTE_PERICULOASE: {
    id: 'substante_periculoase',
    nume: 'Lucrări cu substanțe periculoase',
    descriere: 'Manipulare chimicale toxice, corozive, inflamabile',
    culoare: '#EC4899',
  },
  EXCAVATII: {
    id: 'excavatii',
    nume: 'Lucrări de excavații/săpături',
    descriere: 'Săpături mai adânci de 1,25m, risc de prăbușire',
    culoare: '#92400E',
  },
  ZONA_ATEX: {
    id: 'zona_atex',
    nume: 'Lucrări în zone ATEX',
    descriere: 'Zone cu risc de explozie/atmosferă explozivă',
    culoare: '#B91C1C',
  },
  UTILAJE_GRELE: {
    id: 'utilaje_grele',
    nume: 'Lucrări cu utilaje grele',
    descriere: 'Macarale, excavatoare, platforme elevatoare',
    culoare: '#059669',
  },
} as const;

/**
 * Verificări standard obligatorii
 */
export const VERIFICARI_STANDARD = [
  {
    item: 'Zona de lucru a fost izolată și semnalizată corespunzător',
    efectuat: false,
  },
  {
    item: 'Accesul persoanelor neautorizate este restricționat',
    efectuat: false,
  },
  {
    item: 'Echipamentele de lucru sunt în stare bună de funcționare',
    efectuat: false,
  },
  {
    item: 'Condițiile meteo permit executarea lucrărilor în siguranță',
    efectuat: false,
  },
  {
    item: 'Iluminatul zonei este adecvat',
    efectuat: false,
  },
  {
    item: 'Există mijloace de prim ajutor în apropiere',
    efectuat: false,
  },
  {
    item: 'Există mijloace de stingere a incendiilor funcționale',
    efectuat: false,
  },
  {
    item: 'Personalul a fost instruit specific pentru această lucrare',
    efectuat: false,
  },
  {
    item: 'S-a verificat absența instalațiilor ascunse (gaz, electric, apă)',
    efectuat: false,
  },
  {
    item: 'Căile de evacuare sunt libere și semnalizate',
    efectuat: false,
  },
];

/**
 * EIP standard pentru lucrări periculoase
 */
export const EIP_STANDARD = [
  { echipament: 'Cască de protecție', obligatoriu: true, distribuit: false },
  { echipament: 'Încălțăminte de protecție', obligatoriu: true, distribuit: false },
  { echipament: 'Mănuși de protecție', obligatoriu: true, distribuit: false },
  { echipament: 'Ochelari de protecție', obligatoriu: false, distribuit: false },
  { echipament: 'Vestă reflectorizantă', obligatoriu: false, distribuit: false },
];

/**
 * Generează HTML pentru Permis de Lucru
 */
export function generatePermisLucruHTML(data: PermisLucruData): string {
  const dataGenerare = data.dataGenerare || new Date().toISOString().split('T')[0];

  // Extrage tipurile de lucrări selectate cu detalii
  const tipuriLucrari = data.lucrare.tipuriLucrariPericuloase
    .map(tip => {
      const tipGasit = Object.values(TIPURI_LUCRARI_PERICULOASE).find(t => t.id === tip);
      return tipGasit || null;
    })
    .filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Permis de Lucru - ${data.permis.numar}</title>
  <style>
    @page {
      size: A4;
      margin: 1.5cm 1.5cm;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      margin: 0;
      padding: 0;
    }

    .header {
      text-align: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 3px solid #DC2626;
    }

    .header h1 {
      font-size: 18pt;
      font-weight: bold;
      margin: 0 0 5px 0;
      text-transform: uppercase;
      color: #DC2626;
    }

    .header .subtitle {
      font-size: 11pt;
      font-weight: bold;
      margin: 5px 0;
      color: #333;
    }

    .header .permis-info {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 10pt;
    }

    .alert-box {
      background-color: #FEF2F2;
      border: 2px solid #DC2626;
      border-radius: 8px;
      padding: 12px;
      margin: 15px 0;
      text-align: center;
    }

    .alert-box strong {
      color: #DC2626;
      font-size: 11pt;
      text-transform: uppercase;
    }

    .section {
      margin-bottom: 15px;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 11pt;
      font-weight: bold;
      background-color: #F3F4F6;
      padding: 6px 10px;
      margin-bottom: 8px;
      border-left: 4px solid #3B82F6;
      text-transform: uppercase;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
    }

    .info-item {
      font-size: 9pt;
    }

    .info-item strong {
      display: block;
      font-weight: bold;
      color: #374151;
      margin-bottom: 2px;
    }

    .info-item span {
      color: #000;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .tip-lucrare-badge {
      display: inline-block;
      padding: 4px 10px;
      margin: 3px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: bold;
      color: white;
    }

    .verificari-table, .masuri-table, .eip-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 9pt;
    }

    .verificari-table th,
    .masuri-table th,
    .eip-table th {
      background-color: #E5E7EB;
      font-weight: bold;
      padding: 6px 8px;
      border: 1px solid #9CA3AF;
      text-align: left;
      font-size: 9pt;
    }

    .verificari-table td,
    .masuri-table td,
    .eip-table td {
      border: 1px solid #D1D5DB;
      padding: 6px 8px;
      vertical-align: middle;
    }

    .checkbox {
      width: 16px;
      height: 16px;
      border: 2px solid #374151;
      display: inline-block;
      text-align: center;
      line-height: 14px;
      font-weight: bold;
      background-color: white;
    }

    .checkbox.checked {
      background-color: #10B981;
      border-color: #10B981;
      color: white;
    }

    .checkbox.checked::after {
      content: '✓';
    }

    .echipa-list {
      columns: 2;
      column-gap: 15px;
      font-size: 9pt;
      margin-top: 5px;
    }

    .echipa-list li {
      margin-bottom: 3px;
      break-inside: avoid;
    }

    .urgenta-box {
      background-color: #FEF3C7;
      border: 2px solid #F59E0B;
      border-radius: 6px;
      padding: 10px;
      margin: 10px 0;
    }

    .urgenta-box h3 {
      margin: 0 0 8px 0;
      color: #D97706;
      font-size: 10pt;
      text-transform: uppercase;
    }

    .urgenta-box .info-grid {
      gap: 6px;
    }

    .semnaturi-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 15px;
    }

    .semnatura-box {
      border: 1px solid #9CA3AF;
      border-radius: 6px;
      padding: 10px;
      min-height: 100px;
    }

    .semnatura-box h4 {
      margin: 0 0 8px 0;
      font-size: 9pt;
      font-weight: bold;
      color: #1F2937;
      text-transform: uppercase;
      border-bottom: 1px solid #E5E7EB;
      padding-bottom: 4px;
    }

    .semnatura-box p {
      margin: 4px 0;
      font-size: 8pt;
    }

    .semnatura-box .semnatura-line {
      margin-top: 20px;
      border-top: 1px solid #000;
      padding-top: 3px;
      text-align: center;
      font-size: 7pt;
      color: #6B7280;
    }

    .observatii-box {
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      padding: 10px;
      background-color: #F9FAFB;
      min-height: 60px;
      font-size: 9pt;
      margin-top: 8px;
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #D1D5DB;
      font-size: 8pt;
      color: #6B7280;
      text-align: center;
    }

    .page-break {
      page-break-before: always;
    }

    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚠️ PERMIS DE LUCRU ⚠️</h1>
    <div class="subtitle">Pentru Lucrări Periculoase</div>
    <div class="permis-info">
      <div><strong>Permis Nr:</strong> ${data.permis.numar}</div>
      <div><strong>Emis:</strong> ${formatDate(data.permis.dataEmitere)}</div>
      <div><strong>Valid:</strong> ${formatDateTime(data.permis.validDeLa)} - ${formatDateTime(data.permis.validPanaLa)}</div>
    </div>
  </div>

  <div class="alert-box">
    <strong>⚠️ ATENȚIE: Lucrările nu pot începe fără verificarea tuturor măsurilor de siguranță! ⚠️</strong>
  </div>

  <!-- ORGANIZAȚIE -->
  <div class="section">
    <div class="section-title">📋 Date Organizație</div>
    <div class="info-grid">
      <div class="info-item">
        <strong>Societate:</strong>
        <span>${data.organizatie.nume}</span>
      </div>
      <div class="info-item">
        <strong>C.U.I.:</strong>
        <span>${data.organizatie.cui}</span>
      </div>
      <div class="info-item full-width">
        <strong>Adresa:</strong>
        <span>${data.organizatie.adresa}</span>
      </div>
      ${data.organizatie.telefon ? `
      <div class="info-item">
        <strong>Telefon:</strong>
        <span>${data.organizatie.telefon}</span>
      </div>
      ` : ''}
      ${data.organizatie.email ? `
      <div class="info-item">
        <strong>Email:</strong>
        <span>${data.organizatie.email}</span>
      </div>
      ` : ''}
    </div>
  </div>

  <!-- LOCAȚIE LUCRARE -->
  <div class="section">
    <div class="section-title">📍 Locație Lucrare</div>
    <div class="info-grid">
      <div class="info-item full-width">
        <strong>Loc de muncă:</strong>
        <span>${data.locatie.locMunca}</span>
      </div>
      ${data.locatie.adresa ? `
      <div class="info-item full-width">
        <strong>Adresa:</strong>
        <span>${data.locatie.adresa}</span>
      </div>
      ` : ''}
      ${data.locatie.zonaPericol ? `
      <div class="info-item full-width">
        <strong>⚠️ Zonă de pericol:</strong>
        <span style="color: #DC2626; font-weight: bold;">${data.locatie.zonaPericol}</span>
      </div>
      ` : ''}
    </div>
  </div>

  <!-- DESCRIERE LUCRARE -->
  <div class="section">
    <div class="section-title">🔨 Descriere Lucrare</div>
    <div class="info-item full-width">
      <strong>Descriere:</strong>
      <div style="margin-top: 5px;">${data.lucrare.descriere}</div>
    </div>

    <div class="info-item" style="margin-top: 10px;">
      <strong>Tipuri lucrări periculoase:</strong>
      <div style="margin-top: 5px;">
        ${tipuriLucrari.map(tip => `
          <span class="tip-lucrare-badge" style="background-color: ${tip.culoare};">
            ${tip.nume}
          </span>
        `).join('')}
      </div>
    </div>

    <div class="info-grid" style="margin-top: 10px;">
      <div class="info-item">
        <strong>Durata estimată:</strong>
        <span>${data.lucrare.durata}</span>
      </div>
      <div class="info-item">
        <strong>Echipamente utilizate:</strong>
        <span>${data.lucrare.echipamenteUtilizate.join(', ')}</span>
      </div>
    </div>
  </div>

  <!-- EMITENT ȘI EXECUTANT -->
  <div class="section">
    <div class="info-grid">
      <div>
        <div class="section-title">👤 Emitent Permis</div>
        <div class="info-item">
          <strong>Nume:</strong>
          <span>${data.emitent.nume}</span>
        </div>
        <div class="info-item">
          <strong>Funcție:</strong>
          <span>${data.emitent.functie}</span>
        </div>
      </div>
      <div>
        <div class="section-title">👷 Executant Lucrare</div>
        ${data.executant.numeCompanie ? `
        <div class="info-item">
          <strong>Companie:</strong>
          <span>${data.executant.numeCompanie}</span>
        </div>
        ` : ''}
        <div class="info-item">
          <strong>Responsabil:</strong>
          <span>${data.executant.responsabil}</span>
        </div>
        ${data.executant.telefon ? `
        <div class="info-item">
          <strong>Telefon:</strong>
          <span>${data.executant.telefon}</span>
        </div>
        ` : ''}
      </div>
    </div>

    ${data.executant.echipa.length > 0 ? `
    <div class="info-item" style="margin-top: 10px;">
      <strong>Echipă de lucru (${data.executant.echipa.length} persoane):</strong>
      <ul class="echipa-list">
        ${data.executant.echipa.map((membru, idx) => `<li>${idx + 1}. ${membru}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
  </div>

  <!-- VERIFICĂRI OBLIGATORII -->
  <div class="section">
    <div class="section-title">✅ Verificări Obligatorii Înainte de Începere</div>
    <table class="verificari-table">
      <thead>
        <tr>
          <th style="width: 5%;">Nr.</th>
          <th style="width: 65%;">Verificare</th>
          <th style="width: 10%; text-align: center;">Efectuat</th>
          <th style="width: 20%;">Observații</th>
        </tr>
      </thead>
      <tbody>
        ${data.verificari.map((verificare, idx) => `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td>${verificare.item}</td>
          <td style="text-align: center;">
            <span class="checkbox ${verificare.efectuat ? 'checked' : ''}"></span>
          </td>
          <td style="font-size: 8pt;">${verificare.observatii || '-'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- MĂSURI SSM -->
  <div class="section">
    <div class="section-title">🛡️ Măsuri de Securitate și Sănătate în Muncă</div>
    <table class="masuri-table">
      <thead>
        <tr>
          <th style="width: 5%;">Nr.</th>
          <th style="width: 65%;">Măsură SSM</th>
          <th style="width: 20%;">Responsabil</th>
          <th style="width: 10%; text-align: center;">Verificat</th>
        </tr>
      </thead>
      <tbody>
        ${data.masuri.map((masura, idx) => `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td>${masura.masura}</td>
          <td style="font-size: 8pt;">${masura.responsabil || '-'}</td>
          <td style="text-align: center;">
            <span class="checkbox ${masura.verificat ? 'checked' : ''}"></span>
          </td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- ECHIPAMENTE DE PROTECȚIE -->
  <div class="section">
    <div class="section-title">🦺 Echipamente Individuale de Protecție</div>
    <table class="eip-table">
      <thead>
        <tr>
          <th style="width: 5%;">Nr.</th>
          <th style="width: 60%;">Echipament</th>
          <th style="width: 15%; text-align: center;">Obligatoriu</th>
          <th style="width: 20%; text-align: center;">Distribuit/Verificat</th>
        </tr>
      </thead>
      <tbody>
        ${data.eip.map((echipament, idx) => `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td>${echipament.echipament}</td>
          <td style="text-align: center;">
            <span class="checkbox ${echipament.obligatoriu ? 'checked' : ''}"></span>
          </td>
          <td style="text-align: center;">
            <span class="checkbox ${echipament.distribuit ? 'checked' : ''}"></span>
          </td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  ${data.urgenta ? `
  <!-- PROCEDURI DE URGENȚĂ -->
  <div class="section">
    <div class="urgenta-box">
      <h3>🚨 Proceduri de Urgență</h3>
      <div class="info-grid">
        <div class="info-item">
          <strong>Persoană contact urgență:</strong>
          <span>${data.urgenta.personContact}</span>
        </div>
        <div class="info-item">
          <strong>Telefon urgență:</strong>
          <span style="font-weight: bold; color: #DC2626;">${data.urgenta.telefonUrgenta}</span>
        </div>
        ${data.urgenta.localizareStingator ? `
        <div class="info-item">
          <strong>Stingătoare:</strong>
          <span>${data.urgenta.localizareStingator}</span>
        </div>
        ` : ''}
        ${data.urgenta.localizareTrusa ? `
        <div class="info-item">
          <strong>Trusă prim ajutor:</strong>
          <span>${data.urgenta.localizareTrusa}</span>
        </div>
        ` : ''}
        ${data.urgenta.proceduraEvacuare ? `
        <div class="info-item full-width">
          <strong>Procedură evacuare:</strong>
          <span>${data.urgenta.proceduraEvacuare}</span>
        </div>
        ` : ''}
      </div>
    </div>
  </div>
  ` : ''}

  ${data.observatii ? `
  <!-- OBSERVAȚII -->
  <div class="section">
    <div class="section-title">📝 Observații</div>
    <div class="observatii-box">
      ${data.observatii}
    </div>
  </div>
  ` : ''}

  <!-- SEMNĂTURI -->
  <div class="section">
    <div class="section-title">✍️ Semnături și Aprobări</div>
    <div class="semnaturi-grid">
      <div class="semnatura-box">
        <h4>Emitent Permis</h4>
        <p><strong>Nume:</strong> ${data.emitent.nume}</p>
        <p><strong>Funcție:</strong> ${data.emitent.functie}</p>
        ${data.semnaturi.emitent ? `
        <p><strong>Data/Ora:</strong> ${formatDate(data.semnaturi.emitent.data)} / ${data.semnaturi.emitent.ora}</p>
        ${data.semnaturi.emitent.semnatura ? `
        <div style="text-align: center; margin-top: 10px;">
          <img src="${data.semnaturi.emitent.semnatura}" alt="Semnătură emitent" style="max-height: 40px;">
        </div>
        ` : `
        <div class="semnatura-line">Semnătură</div>
        `}
        ` : `
        <div class="semnatura-line">Semnătură</div>
        `}
      </div>

      <div class="semnatura-box">
        <h4>Executant Lucrare</h4>
        <p><strong>Nume:</strong> ${data.executant.responsabil}</p>
        ${data.executant.numeCompanie ? `<p><strong>Companie:</strong> ${data.executant.numeCompanie}</p>` : ''}
        ${data.semnaturi.executant ? `
        <p><strong>Data/Ora:</strong> ${formatDate(data.semnaturi.executant.data)} / ${data.semnaturi.executant.ora}</p>
        ${data.semnaturi.executant.semnatura ? `
        <div style="text-align: center; margin-top: 10px;">
          <img src="${data.semnaturi.executant.semnatura}" alt="Semnătură executant" style="max-height: 40px;">
        </div>
        ` : `
        <div class="semnatura-line">Semnătură</div>
        `}
        ` : `
        <div class="semnatura-line">Semnătură</div>
        `}
      </div>

      ${data.semnaturi.responsabilSSM ? `
      <div class="semnatura-box">
        <h4>Responsabil SSM</h4>
        <p><strong>Nume:</strong> ${data.semnaturi.responsabilSSM.nume}</p>
        <p><strong>Data/Ora:</strong> ${formatDate(data.semnaturi.responsabilSSM.data)} / ${data.semnaturi.responsabilSSM.ora}</p>
        ${data.semnaturi.responsabilSSM.semnatura ? `
        <div style="text-align: center; margin-top: 10px;">
          <img src="${data.semnaturi.responsabilSSM.semnatura}" alt="Semnătură SSM" style="max-height: 40px;">
        </div>
        ` : `
        <div class="semnatura-line">Semnătură</div>
        `}
      </div>
      ` : ''}

      ${data.semnaturi.inchiderePermis ? `
      <div class="semnatura-box">
        <h4>Închidere Permis</h4>
        <p><strong>Data/Ora:</strong> ${formatDate(data.semnaturi.inchiderePermis.data)} / ${data.semnaturi.inchiderePermis.ora}</p>
        ${data.semnaturi.inchiderePermis.observatii ? `
        <p><strong>Observații:</strong> ${data.semnaturi.inchiderePermis.observatii}</p>
        ` : ''}
        ${data.semnaturi.inchiderePermis.semnatura ? `
        <div style="text-align: center; margin-top: 10px;">
          <img src="${data.semnaturi.inchiderePermis.semnatura}" alt="Semnătură închidere" style="max-height: 40px;">
        </div>
        ` : `
        <div class="semnatura-line">Semnătură</div>
        `}
      </div>
      ` : ''}
    </div>
  </div>

  <div class="footer">
    <p><strong>⚠️ IMPORTANT:</strong> Acest permis este valabil NUMAI pentru perioada și condițiile specificate mai sus.</p>
    <p>Orice modificare a condițiilor de lucru impune oprirea imediată a activității și revizuirea permisului.</p>
    <p style="margin-top: 10px;">Document generat: ${formatDate(dataGenerare)} | Platforma SSM digitală - s-s-m.ro</p>
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

  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}.${month}.${year}`;
}

/**
 * Formatează data și ora din format ISO în format românesc
 */
function formatDateTime(isoDateTime: string): string {
  if (!isoDateTime) return '-';

  const [datePart, timePart] = isoDateTime.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart ? timePart.split(':') : ['00', '00'];

  return `${day}.${month}.${year} ${hour}:${minute}`;
}

/**
 * Generează date exemplu pentru testing
 */
export function generateSamplePermisLucruData(): PermisLucruData {
  return {
    organizatie: {
      nume: 'SC CONSTRUCT EXPERT SRL',
      cui: 'RO12345678',
      adresa: 'Str. Industriei nr. 25, București, Sector 3',
      telefon: '021.345.6789',
      email: 'office@constructexpert.ro',
    },
    permis: {
      numar: 'PL-2024-015',
      dataEmitere: '2024-11-15',
      validDeLa: '2024-11-16T08:00',
      validPanaLa: '2024-11-16T17:00',
    },
    locatie: {
      locMunca: 'Atelier producție - Hala 2',
      adresa: 'Str. Industriei nr. 25, București',
      zonaPericol: 'Zonă cu risc de cădere obiecte - acoperire hală',
    },
    lucrare: {
      descriere: 'Lucrări de reparații la acoperișul halei de producție - înlocuire tablă deteriorată, verificare și consolidare structură susținere, curățare jgheaburi.',
      tipuriLucrariPericuloase: ['inaltime', 'foc_deschis'],
      echipamenteUtilizate: ['Schelă mobilă 6m', 'Scară extensibilă', 'Aparat sudură', 'Polizor unghiular'],
      durata: '8 ore (o zi lucrătoare)',
    },
    emitent: {
      nume: 'Ionescu Vasile',
      functie: 'Responsabil SSM',
    },
    executant: {
      numeCompanie: 'SC METAL ROOF SRL',
      responsabil: 'Popescu Dan',
      telefon: '0722 123 456',
      echipa: [
        'Popescu Dan (Șef echipă)',
        'Georgescu Mihai (Sudor)',
        'Radu Ion (Acoperitor)',
        'Stanciu Andrei (Muncitor necalificat)',
      ],
    },
    verificari: [
      {
        item: 'Zona de lucru a fost izolată și semnalizată corespunzător',
        efectuat: true,
      },
      {
        item: 'Accesul persoanelor neautorizate este restricționat',
        efectuat: true,
      },
      {
        item: 'Schela mobilă a fost verificată și este stabilă',
        efectuat: true,
        observatii: 'Verificată conform procedură, certificat valid',
      },
      {
        item: 'Condițiile meteo permit lucrul la înălțime (fără ploaie/vânt)',
        efectuat: true,
        observatii: 'Vreme frumoasă, fără risc',
      },
      {
        item: 'Iluminatul zonei este adecvat',
        efectuat: true,
      },
      {
        item: 'Există mijloace de prim ajutor în apropiere',
        efectuat: true,
        observatii: 'Trusă în vestiar la 20m',
      },
      {
        item: 'Stingătoare funcționale disponibile în zonă',
        efectuat: true,
        observatii: '2 stingătoare CO2 în hală',
      },
      {
        item: 'Personalul a fost instruit specific pentru lucrări la înălțime',
        efectuat: true,
      },
      {
        item: 'S-a verificat inexistența instalațiilor electrice aeriene',
        efectuat: true,
      },
      {
        item: 'Căile de evacuare sunt libere',
        efectuat: true,
      },
    ],
    masuri: [
      {
        masura: 'Utilizare obligatorie ham de siguranță cu frânare automată, ancorat pe structură rezistentă',
        responsabil: 'Popescu Dan',
        verificat: true,
      },
      {
        masura: 'Delimitare perimetru de siguranță la sol - minimum 3m de la zona de lucru',
        responsabil: 'Ionescu Vasile',
        verificat: true,
      },
      {
        masura: 'Instalare plasă de protecție pentru cădere obiecte',
        responsabil: 'Popescu Dan',
        verificat: true,
      },
      {
        masura: 'Verificare funcționare stingătoare înainte de începere sudură',
        responsabil: 'Georgescu Mihai',
        verificat: true,
      },
      {
        masura: 'Îndepărtare materiale combustibile din raza de 5m de punctul de sudură',
        responsabil: 'Radu Ion',
        verificat: true,
      },
      {
        masura: 'Comunicare permanentă între echipă prin stație radio',
        responsabil: 'Popescu Dan',
        verificat: true,
      },
      {
        masura: 'Pauze obligatorii la fiecare 2 ore de lucru la înălțime',
        responsabil: 'Popescu Dan',
        verificat: false,
      },
      {
        masura: 'Supraveghere permanentă de la sol - observator dedicat',
        responsabil: 'Stanciu Andrei',
        verificat: true,
      },
    ],
    eip: [
      { echipament: 'Cască de protecție', obligatoriu: true, distribuit: true },
      { echipament: 'Ham de siguranță cu frânare automată', obligatoriu: true, distribuit: true },
      { echipament: 'Încălțăminte antiderapantă S3', obligatoriu: true, distribuit: true },
      { echipament: 'Mănuși de protecție antivibrații', obligatoriu: true, distribuit: true },
      { echipament: 'Ochelari de protecție pentru sudură', obligatoriu: true, distribuit: true },
      { echipament: 'Vestă reflectorizantă', obligatoriu: true, distribuit: true },
      { echipament: 'Protecție auditivă (antifoane)', obligatoriu: false, distribuit: true },
      { echipament: 'Mască protecție respiratorie', obligatoriu: false, distribuit: false },
    ],
    urgenta: {
      personContact: 'Ionescu Vasile (Responsabil SSM)',
      telefonUrgenta: '0721 234 567 | SMURD: 112',
      localizareStingator: 'Hala 2 - intrare principală și zonă depozitare (2 bucăți CO2)',
      localizareTrusa: 'Vestiar Hala 2 - perete stânga intrare',
      proceduraEvacuare: 'La semnalul sonor sau verbal: coborâre imediată din schelă, evacuare prin ieșirea principală către punctul de adunare (parcare)',
    },
    semnaturi: {
      emitent: {
        data: '2024-11-15',
        ora: '17:30',
      },
      executant: {
        data: '2024-11-16',
        ora: '08:00',
      },
      responsabilSSM: {
        nume: 'Ionescu Vasile',
        data: '2024-11-15',
        ora: '17:30',
      },
    },
    observatii: 'Verificare structură acoperis de către inginer constructor obligatorie înainte de începerea lucrărilor. Raportare zilnică progres către responsabil SSM.',
    dataGenerare: new Date().toISOString().split('T')[0],
  };
}

/**
 * Validează datele pentru permis de lucru
 */
export function validatePermisLucruData(data: Partial<PermisLucruData>): {
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

  // Validare permis
  if (!data.permis?.numar?.trim()) {
    errors.push('Numărul permisului este obligatoriu');
  }
  if (!data.permis?.dataEmitere) {
    errors.push('Data emiterii este obligatorie');
  }
  if (!data.permis?.validDeLa) {
    errors.push('Data de început este obligatorie');
  }
  if (!data.permis?.validPanaLa) {
    errors.push('Data de sfârșit este obligatorie');
  }

  // Validare locație
  if (!data.locatie?.locMunca?.trim()) {
    errors.push('Locul de muncă este obligatoriu');
  }

  // Validare lucrare
  if (!data.lucrare?.descriere?.trim()) {
    errors.push('Descrierea lucrării este obligatorie');
  }
  if (!data.lucrare?.tipuriLucrariPericuloase || data.lucrare.tipuriLucrariPericuloase.length === 0) {
    errors.push('Trebuie să selectați cel puțin un tip de lucrare periculoasă');
  }
  if (!data.lucrare?.echipamenteUtilizate || data.lucrare.echipamenteUtilizate.length === 0) {
    errors.push('Trebuie să specificați echipamentele utilizate');
  }
  if (!data.lucrare?.durata?.trim()) {
    errors.push('Durata lucrării este obligatorie');
  }

  // Validare emitent
  if (!data.emitent?.nume?.trim()) {
    errors.push('Numele emitentului este obligatoriu');
  }
  if (!data.emitent?.functie?.trim()) {
    errors.push('Funcția emitentului este obligatorie');
  }

  // Validare executant
  if (!data.executant?.responsabil?.trim()) {
    errors.push('Responsabilul executant este obligatoriu');
  }
  if (!data.executant?.echipa || data.executant.echipa.length === 0) {
    errors.push('Trebuie să specificați echipa de lucru');
  }

  // Validare verificări
  if (!data.verificari || data.verificari.length === 0) {
    errors.push('Trebuie să existe verificări obligatorii');
  } else {
    const verificariNeefectuate = data.verificari.filter(v => !v.efectuat);
    if (verificariNeefectuate.length > 0) {
      errors.push(`${verificariNeefectuate.length} verificări obligatorii nu au fost efectuate`);
    }
  }

  // Validare măsuri
  if (!data.masuri || data.masuri.length === 0) {
    errors.push('Trebuie să specificați măsuri de siguranță');
  }

  // Validare EIP
  if (!data.eip || data.eip.length === 0) {
    errors.push('Trebuie să specificați echipamentele de protecție');
  } else {
    const eipObligatorii = data.eip.filter(e => e.obligatoriu && !e.distribuit);
    if (eipObligatorii.length > 0) {
      errors.push(`${eipObligatorii.length} echipamente obligatorii nu au fost distribuite`);
    }
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
  generatePermisLucruHTML,
  generateSamplePermisLucruData,
  validatePermisLucruData,
  TIPURI_LUCRARI_PERICULOASE,
  VERIFICARI_STANDARD,
  EIP_STANDARD,
};
