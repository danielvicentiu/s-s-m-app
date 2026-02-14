/**
 * Limite de expunere profesională pentru România
 * Conform HG 1218/2006, Ord. 1093/2006, și alte acte normative SSM
 */

export interface ExposureLimit {
  id: string;
  agent: string;
  type: 'fizic' | 'chimic' | 'biologic';
  unit: string;
  limitValue8h: number;
  limitValueShort?: number;
  legalBasis: string;
  measurementMethod: string;
  requiredPPE: string[];
}

export const exposureLimits: ExposureLimit[] = [
  // AGENȚI FIZICI - ZGOMOT
  {
    id: 'noise-daily',
    agent: 'Zgomot continuu',
    type: 'fizic',
    unit: 'dB(A)',
    limitValue8h: 87,
    limitValueShort: 140, // nivel vârf
    legalBasis: 'HG 493/2006 - protecția lucrătorilor la zgomot',
    measurementMethod: 'Sonometru clasa 1, dozimetru de zgomot',
    requiredPPE: ['Antifoane', 'Căști antifonice']
  },
  {
    id: 'noise-action-upper',
    agent: 'Zgomot - nivel de acțiune superior',
    type: 'fizic',
    unit: 'dB(A)',
    limitValue8h: 85,
    limitValueShort: 137,
    legalBasis: 'HG 493/2006',
    measurementMethod: 'Sonometru clasa 1',
    requiredPPE: ['Antifoane', 'Căști antifonice (obligatoriu)']
  },
  {
    id: 'noise-action-lower',
    agent: 'Zgomot - nivel de acțiune inferior',
    type: 'fizic',
    unit: 'dB(A)',
    limitValue8h: 80,
    limitValueShort: 135,
    legalBasis: 'HG 493/2006',
    measurementMethod: 'Sonometru clasa 1',
    requiredPPE: ['Antifoane (disponibile la cerere)']
  },

  // AGENȚI FIZICI - VIBRAȚII
  {
    id: 'vibration-hand-arm',
    agent: 'Vibrații transmise la sistemul mână-braț',
    type: 'fizic',
    unit: 'm/s²',
    limitValue8h: 5,
    limitValueShort: 2.5, // nivel de acțiune
    legalBasis: 'HG 1876/2005 - protecția lucrătorilor la vibrații',
    measurementMethod: 'Vibometru conform ISO 5349',
    requiredPPE: ['Mănuși antivibratii', 'Scule cu amortizare']
  },
  {
    id: 'vibration-whole-body',
    agent: 'Vibrații transmise la întreg corpul',
    type: 'fizic',
    unit: 'm/s²',
    limitValue8h: 1.15,
    limitValueShort: 0.5, // nivel de acțiune
    legalBasis: 'HG 1876/2005',
    measurementMethod: 'Vibometru conform ISO 2631',
    requiredPPE: ['Scaun cu suspensie', 'Platformă antivibratii']
  },

  // AGENȚI FIZICI - PRAF
  {
    id: 'dust-inhalable',
    agent: 'Praf inhalabil (fracțiune totală)',
    type: 'fizic',
    unit: 'mg/m³',
    limitValue8h: 10,
    legalBasis: 'Ord. 1093/2006 - valori limită expunere',
    measurementMethod: 'Eșantionare gravimetrică, pompă personală',
    requiredPPE: ['Mască FFP2', 'Semimasca cu filtre P2']
  },
  {
    id: 'dust-respirable',
    agent: 'Praf respirabil (fracțiune alveolară)',
    type: 'fizic',
    unit: 'mg/m³',
    limitValue8h: 5,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Eșantionare gravimetrică cu ciclon',
    requiredPPE: ['Mască FFP2', 'Semimasca cu filtre P2']
  },
  {
    id: 'dust-wood',
    agent: 'Praf de lemn (tâmplărie)',
    type: 'fizic',
    unit: 'mg/m³',
    limitValue8h: 2,
    legalBasis: 'Ord. 1093/2006 - Directiva 2004/37/CE',
    measurementMethod: 'Eșantionare gravimetrică',
    requiredPPE: ['Mască FFP2', 'Aspirație locală']
  },

  // AGENȚI FIZICI - TEMPERATURĂ
  {
    id: 'temperature-hot',
    agent: 'Temperatură ridicată (mediu cald)',
    type: 'fizic',
    unit: '°C WBGT',
    limitValue8h: 28,
    limitValueShort: 32,
    legalBasis: 'Ord. 1093/2006, ISO 7243',
    measurementMethod: 'Termometru WBGT (Wet Bulb Globe Temperature)',
    requiredPPE: ['Îmbrăcăminte ușoară', 'Apă potabilă']
  },
  {
    id: 'temperature-cold',
    agent: 'Temperatură scăzută (mediu rece)',
    type: 'fizic',
    unit: '°C',
    limitValue8h: -20,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Termometru digital, viteza vântului',
    requiredPPE: ['Îmbrăcăminte termică', 'Mănuși', 'Cagulă']
  },

  // AGENȚI FIZICI - ILUMINAT
  {
    id: 'light-office',
    agent: 'Iluminat birou (sarcini vizuale medii)',
    type: 'fizic',
    unit: 'lux',
    limitValue8h: 500,
    legalBasis: 'SR EN 12464-1:2011',
    measurementMethod: 'Luxmetru calibrat',
    requiredPPE: []
  },
  {
    id: 'light-precision',
    agent: 'Iluminat muncă de precizie',
    type: 'fizic',
    unit: 'lux',
    limitValue8h: 750,
    legalBasis: 'SR EN 12464-1:2011',
    measurementMethod: 'Luxmetru calibrat',
    requiredPPE: []
  },
  {
    id: 'light-warehouse',
    agent: 'Iluminat depozit/magazie',
    type: 'fizic',
    unit: 'lux',
    limitValue8h: 200,
    legalBasis: 'SR EN 12464-1:2011',
    measurementMethod: 'Luxmetru calibrat',
    requiredPPE: []
  },

  // AGENȚI CHIMICI - SOLVENȚI
  {
    id: 'toluene',
    agent: 'Toluen (metilbenzen)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 192,
    limitValueShort: 384,
    legalBasis: 'Ord. 1093/2006, anexa nr. 1',
    measurementMethod: 'Tuburi adsorbante, cromatografie gazoasă',
    requiredPPE: ['Semimasca cu filtru A2', 'Mănuși nitril', 'Ventilație']
  },
  {
    id: 'benzene',
    agent: 'Benzen (cancerigen categoria 1A)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 3.25,
    limitValueShort: 16.25,
    legalBasis: 'Ord. 1093/2006 - Directiva 2004/37/CE',
    measurementMethod: 'Tuburi adsorbante, cromatografie gazoasă',
    requiredPPE: ['Masca integrală cu filtru A2', 'Mănuși neopren', 'Izolat']
  },
  {
    id: 'xylene',
    agent: 'Xilen (dimetilbenzen)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 221,
    limitValueShort: 442,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi adsorbante, cromatografie gazoasă',
    requiredPPE: ['Semimasca cu filtru A2', 'Mănuși nitril']
  },
  {
    id: 'acetone',
    agent: 'Acetonă (dimetilcetonă)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 1210,
    limitValueShort: 2420,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi adsorbante, cromatografie gazoasă',
    requiredPPE: ['Semimasca cu filtru A1', 'Mănuși nitril', 'Ventilație']
  },

  // AGENȚI CHIMICI - METALE
  {
    id: 'lead-inorganic',
    agent: 'Plumb și compuși anorganici',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 0.15,
    legalBasis: 'Ord. 1093/2006 - Directiva 98/24/CE',
    measurementMethod: 'Filtre membrane, spectrofotometrie de absorbție atomică',
    requiredPPE: ['Semimasca FFP3', 'Mănuși', 'Monitorizare plumbemie']
  },
  {
    id: 'lead-organic',
    agent: 'Plumb tetraetil (compuși organici)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 0.1,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi adsorbante, spectrofotometrie',
    requiredPPE: ['Masca integrală', 'Mănuși impermeabile', 'Îmbrăcăminte protecție']
  },
  {
    id: 'chromium-vi',
    agent: 'Crom hexavalent (Cr VI - cancerigen)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 0.05,
    legalBasis: 'Ord. 1093/2006 - Directiva 2004/37/CE',
    measurementMethod: 'Filtre membrane, spectrofotometrie',
    requiredPPE: ['Semimasca FFP3', 'Mănuși nitril', 'Costum protecție']
  },
  {
    id: 'mercury-vapor',
    agent: 'Mercur vapori (elementar)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 0.02,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi Hopcalite, absorbție atomică',
    requiredPPE: ['Semimasca cu filtru Hg', 'Ventilație', 'Mănuși']
  },

  // AGENȚI CHIMICI - AZBEST
  {
    id: 'asbestos',
    agent: 'Azbest (crisotil, amfibol)',
    type: 'chimic',
    unit: 'fibre/cm³',
    limitValue8h: 0.1,
    legalBasis: 'HG 1218/2006 - protecția lucrătorilor la azbest',
    measurementMethod: 'Filtre membrane, microscopie optică fazială (MOCP)',
    requiredPPE: ['Masca FFP3', 'Costum protecție tip 5', 'Duș decontaminare']
  },

  // AGENȚI CHIMICI - FORMALDEHIDĂ
  {
    id: 'formaldehyde',
    agent: 'Formaldehidă (metanal)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 0.62,
    limitValueShort: 1.24,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi adsorbante, cromatografie lichidă',
    requiredPPE: ['Semimasca cu filtru A2', 'Mănuși nitril', 'Ventilație']
  },

  // AGENȚI CHIMICI - OXIZI DE AZOT
  {
    id: 'nitrogen-dioxide',
    agent: 'Dioxid de azot (NO₂)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 5.7,
    limitValueShort: 9.6,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi colorimetrice, detector electrochimic',
    requiredPPE: ['Semimasca cu filtru NO-P3', 'Ventilație']
  },

  // AGENȚI CHIMICI - AMONIAC
  {
    id: 'ammonia',
    agent: 'Amoniac (NH₃)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 14,
    limitValueShort: 36,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi colorimetrice, detector electrochimic',
    requiredPPE: ['Semimasca cu filtru K2', 'Ochelari de protecție']
  },

  // AGENȚI CHIMICI - MONOXID DE CARBON
  {
    id: 'carbon-monoxide',
    agent: 'Monoxid de carbon (CO)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 23,
    limitValueShort: 117,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Detector electrochimic, cromatografie gazoasă',
    requiredPPE: ['Ventilație adecvată', 'Detector personal CO']
  },

  // AGENȚI CHIMICI - DIOXID DE CARBON
  {
    id: 'carbon-dioxide',
    agent: 'Dioxid de carbon (CO₂)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 9000,
    limitValueShort: 27000,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Detector infraroșu, cromatografie gazoasă',
    requiredPPE: ['Ventilație adecvată']
  },

  // AGENȚI CHIMICI - ACID SULFURIC
  {
    id: 'sulfuric-acid',
    agent: 'Acid sulfuric (H₂SO₄) - aerosoli',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 0.05,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Filtre membrane, titrare',
    requiredPPE: ['Semimasca FFP2', 'Ochelari', 'Mănuși cauciuc']
  },

  // AGENȚI CHIMICI - ACID AZOTIC
  {
    id: 'nitric-acid',
    agent: 'Acid azotic (HNO₃) - aerosoli',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 2.6,
    limitValueShort: 5.2,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Filtre membrane, cromatografie ionică',
    requiredPPE: ['Semimasca FFP2', 'Ochelari', 'Mănuși nitril']
  },

  // AGENȚI CHIMICI - HIDROXID DE SODIU
  {
    id: 'sodium-hydroxide',
    agent: 'Hidroxid de sodiu (NaOH) - aerosoli',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 2,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Filtre membrane, titrare acidimetrică',
    requiredPPE: ['Semimasca FFP2', 'Ochelari', 'Mănuși cauciuc']
  },

  // AGENȚI CHIMICI - CLOR
  {
    id: 'chlorine',
    agent: 'Clor (Cl₂)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 1.5,
    limitValueShort: 3,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi colorimetrice, detector electrochimic',
    requiredPPE: ['Semimasca cu filtru E2', 'Ventilație', 'Ochelari']
  },

  // AGENȚI CHIMICI - STIRENE
  {
    id: 'styrene',
    agent: 'Stiren (vinilbenzen)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 86,
    limitValueShort: 172,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi adsorbante, cromatografie gazoasă',
    requiredPPE: ['Semimasca cu filtru A2', 'Mănuși nitril', 'Ventilație']
  },

  // AGENȚI CHIMICI - METANOL
  {
    id: 'methanol',
    agent: 'Metanol (alcool metilic)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 260,
    limitValueShort: 520,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi adsorbante, cromatografie gazoasă',
    requiredPPE: ['Semimasca cu filtru A2', 'Mănuși nitril', 'Ventilație']
  },

  // AGENȚI CHIMICI - ETANOL
  {
    id: 'ethanol',
    agent: 'Etanol (alcool etilic)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 1920,
    limitValueShort: 9600,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi adsorbante, cromatografie gazoasă',
    requiredPPE: ['Semimasca cu filtru A1', 'Mănuși nitril']
  },

  // AGENȚI CHIMICI - ACID ACETIC
  {
    id: 'acetic-acid',
    agent: 'Acid acetic (CH₃COOH)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 25,
    limitValueShort: 50,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi adsorbante, cromatografie gazoasă',
    requiredPPE: ['Semimasca cu filtru A1', 'Mănuși cauciuc', 'Ochelari']
  },

  // AGENȚI CHIMICI - HIDROGEN SULFURAT
  {
    id: 'hydrogen-sulfide',
    agent: 'Hidrogen sulfurat (H₂S)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 7,
    limitValueShort: 14,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi colorimetrice, detector electrochimic',
    requiredPPE: ['Semimasca cu filtru B2', 'Detector personal H₂S']
  },

  // AGENȚI CHIMICI - DIOXID DE SULF
  {
    id: 'sulfur-dioxide',
    agent: 'Dioxid de sulf (SO₂)',
    type: 'chimic',
    unit: 'mg/m³',
    limitValue8h: 2.7,
    limitValueShort: 5.3,
    legalBasis: 'Ord. 1093/2006',
    measurementMethod: 'Tuburi colorimetrice, detector electrochimic',
    requiredPPE: ['Semimasca cu filtru E2', 'Ventilație']
  },

  // AGENȚI BIOLOGICI - EXEMPLE
  {
    id: 'bioaerosols-bacteria',
    agent: 'Bioaerosoli bacterieni (medii industriale)',
    type: 'biologic',
    unit: 'CFU/m³',
    limitValue8h: 1000,
    legalBasis: 'Ord. 1093/2006, ghiduri INSP',
    measurementMethod: 'Impactare pe geloză, numărare colonii',
    requiredPPE: ['Mască FFP2', 'Mănuși', 'Igienă personală']
  },
  {
    id: 'bioaerosols-fungi',
    agent: 'Bioaerosoli fungici (medii cu mucegai)',
    type: 'biologic',
    unit: 'CFU/m³',
    limitValue8h: 500,
    legalBasis: 'Ord. 1093/2006, ghiduri INSP',
    measurementMethod: 'Impactare pe geloză Sabouraud, numărare colonii',
    requiredPPE: ['Mască FFP2', 'Mănuși', 'Ventilație', 'Tratament antifungic']
  },

  // AGENȚI FIZICI - RADIAȚII UV
  {
    id: 'uv-radiation',
    agent: 'Radiații ultraviolete (UV-A, UV-B)',
    type: 'fizic',
    unit: 'J/m²',
    limitValue8h: 30,
    legalBasis: 'Directiva 2006/25/CE - radiații optice artificiale',
    measurementMethod: 'Radiometru UV calibrat',
    requiredPPE: ['Ochelari cu protecție UV', 'Crema protecție solară']
  }
];

/**
 * Funcții helper pentru filtrare și căutare
 */
export function getExposureLimitsByType(type: ExposureLimit['type']): ExposureLimit[] {
  return exposureLimits.filter(limit => limit.type === type);
}

export function getExposureLimitById(id: string): ExposureLimit | undefined {
  return exposureLimits.find(limit => limit.id === id);
}

export function searchExposureLimits(query: string): ExposureLimit[] {
  const lowerQuery = query.toLowerCase();
  return exposureLimits.filter(
    limit =>
      limit.agent.toLowerCase().includes(lowerQuery) ||
      limit.id.toLowerCase().includes(lowerQuery)
  );
}
