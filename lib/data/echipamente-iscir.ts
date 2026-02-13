/**
 * ECHIPAMENTE ISCIR - Baza de date pentru echipamente sub supraveghere tehnică ISCIR
 *
 * Tipuri de echipamente reglementate de ISCIR România:
 * - Echipamente de ridicat (macarale, electropalan, etc.)
 * - Echipamente sub presiune (cazane, recipiente, conducte)
 * - Instalații de gaze (rețele, rezervoare GPL)
 *
 * Prescripții tehnice aplicabile:
 * - PT R (Ridicat): PT R1, PT R3, PT R7, PT R8, PT R9
 * - PT C (Presiune): PT C1, PT C11, PT C13, PT C16
 * - PT I (Instalații): PT I8 (gaze naturale)
 */

export type EchipamentISCIRType = 'ridicat' | 'presiune' | 'instalatii_gaze';

export interface EchipamentISCIR {
  id: string;
  name: string;
  type: EchipamentISCIRType;
  prescriptieTehnica: string;
  verificationInterval: number; // luni
  requiredAuthorization: string;
  legalBasis: string;
  documenteNecesare: string[];
}

export const echipamenteISCIR: EchipamentISCIR[] = [
  // ========== ECHIPAMENTE DE RIDICAT ==========
  {
    id: 'macara-turn',
    name: 'Macara turn',
    type: 'ridicat',
    prescriptieTehnica: 'PT R1',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat ISCIR',
    legalBasis: 'Legea 290/2003, PT R1',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație funcționare RSVTI',
      'Buletin de verificare metrологică (limitator sarcină)',
      'Manual de utilizare în limba română',
      'Registru de evidență'
    ]
  },
  {
    id: 'electropalan',
    name: 'Electropalan (palan electric)',
    type: 'ridicat',
    prescriptieTehnica: 'PT R3',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat ISCIR',
    legalBasis: 'Legea 290/2003, PT R3',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Declarație de conformitate CE',
      'Manual de utilizare',
      'Registru de evidență',
      'Dovadă verificare șenă rulare (dacă e cazul)'
    ]
  },
  {
    id: 'pod-rulant',
    name: 'Pod rulant',
    type: 'ridicat',
    prescriptieTehnica: 'PT R1',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat ISCIR',
    legalBasis: 'Legea 290/2003, PT R1',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație funcționare RSVTI',
      'Buletin de verificare metrологică (limitator sarcină)',
      'Verificare șină rulare',
      'Registru de evidență'
    ]
  },
  {
    id: 'macara-auto',
    name: 'Macara auto (autoturn)',
    type: 'ridicat',
    prescriptieTehnica: 'PT R7',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat ISCIR',
    legalBasis: 'Legea 290/2003, PT R7',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație funcționare RSVTI',
      'Certificat de verificare metrологică (limitator)',
      'Manual de utilizare',
      'Verificare stabilizatori'
    ]
  },
  {
    id: 'lift-marfuri',
    name: 'Lift de marfă',
    type: 'ridicat',
    prescriptieTehnica: 'PT R8',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat ISCIR + deservent autorizat',
    legalBasis: 'Legea 290/2003, PT R8',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație funcționare RSVTI',
      'Autorizație deservent (macaragiu)',
      'Manual de utilizare',
      'Registru de evidență intervenții',
      'Verificare frâne și limitator cursă'
    ]
  },
  {
    id: 'ascensor-persoane',
    name: 'Ascensor de persoane',
    type: 'ridicat',
    prescriptieTehnica: 'PT R9',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat ISCIR + deservent autorizat',
    legalBasis: 'Legea 290/2003, PT R9',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație funcționare RSVTI',
      'Autorizație deservent (liftier, dacă e cazul)',
      'Contract de mentenanță',
      'Registru de evidență',
      'Verificare parașută și limitator viteză'
    ]
  },
  {
    id: 'stivuitor-frontal',
    name: 'Stivuitor frontal',
    type: 'ridicat',
    prescriptieTehnica: 'PT R3',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat ISCIR + operator autorizat',
    legalBasis: 'Legea 290/2003, PT R3',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație operator stivuitor',
      'Manual de utilizare',
      'Declarație de conformitate',
      'Verificare furci și catarge'
    ]
  },

  // ========== ECHIPAMENTE SUB PRESIUNE ==========
  {
    id: 'cazan-abur',
    name: 'Cazan abur (peste 1 bar)',
    type: 'presiune',
    prescriptieTehnica: 'PT C1',
    verificationInterval: 24,
    requiredAuthorization: 'RSVTI autorizat ISCIR + focist autorizat',
    legalBasis: 'Legea 290/2003, PT C1, Directiva 2014/68/UE',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație funcționare RSVTI',
      'Autorizație focist',
      'Buletin presostatului',
      'Verificare supape siguranță',
      'Manual de utilizare',
      'Registru de evidență'
    ]
  },
  {
    id: 'cazan-apa-calda',
    name: 'Cazan apă caldă (peste 110°C sau 1 bar)',
    type: 'presiune',
    prescriptieTehnica: 'PT C1',
    verificationInterval: 24,
    requiredAuthorization: 'RSVTI autorizat ISCIR + focist autorizat',
    legalBasis: 'Legea 290/2003, PT C1',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație funcționare RSVTI',
      'Autorizație focist',
      'Verificare supape siguranță',
      'Verificare presostat/termostat',
      'Manual de utilizare'
    ]
  },
  {
    id: 'recipient-aer-comprimat',
    name: 'Recipient aer comprimat (compresor)',
    type: 'presiune',
    prescriptieTehnica: 'PT C11',
    verificationInterval: 24,
    requiredAuthorization: 'RSVTI autorizat ISCIR',
    legalBasis: 'Legea 290/2003, PT C11',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Declarație de conformitate CE',
      'Verificare supape siguranță',
      'Verificare presostat',
      'Manual de utilizare',
      'Registru de evidență'
    ]
  },
  {
    id: 'autoclave',
    name: 'Autoclave (sterilizare)',
    type: 'presiune',
    prescriptieTehnica: 'PT C1',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat ISCIR',
    legalBasis: 'Legea 290/2003, PT C1, PT C16 (medicale)',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Declarație de conformitate CE',
      'Verificare supape siguranță',
      'Certificat etalonare manometre',
      'Manual de utilizare',
      'Registru de sterilizare'
    ]
  },
  {
    id: 'butelie-gaz-medical',
    name: 'Butelii gaze medicale (oxigen, N2O)',
    type: 'presiune',
    prescriptieTehnica: 'PT C13',
    verificationInterval: 60,
    requiredAuthorization: 'Unitate autorizată reverificare',
    legalBasis: 'Legea 290/2003, PT C13',
    documenteNecesare: [
      'Certificat de reverificare periodică',
      'Marcaj indelebil cu data următoarei verificări',
      'Declarație conformitate inițială',
      'Etichetă identificare gaz',
      'Registru butelii (pentru spitale)'
    ]
  },
  {
    id: 'conducta-abur',
    name: 'Conductă abur (peste DN 50)',
    type: 'presiune',
    prescriptieTehnica: 'PT C1',
    verificationInterval: 24,
    requiredAuthorization: 'RSVTI autorizat ISCIR',
    legalBasis: 'Legea 290/2003, PT C1',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Schemă conductă (planșe)',
      'Verificare supape siguranță pe traseu',
      'Verificare compensatori dilatare',
      'Certificat sudori autorizați (la montaj)'
    ]
  },

  // ========== INSTALAȚII DE GAZE ==========
  {
    id: 'rezervor-gpl-suprateran',
    name: 'Rezervor GPL suprateran (peste 3 mc)',
    type: 'instalatii_gaze',
    prescriptieTehnica: 'PT I8',
    verificationInterval: 24,
    requiredAuthorization: 'RSVTI autorizat ISCIR + operator gaze autorizat',
    legalBasis: 'Legea 290/2003, PT I8, Legea gazelor 123/2012',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație funcționare RSVTI',
      'Autorizație operator gaze (dacă e instalație industrială)',
      'Verificare supape siguranță',
      'Verificare sistem antiincendiu',
      'Aviz ISU pentru amplasament',
      'Certificat etanșeitate instalație'
    ]
  },
  {
    id: 'rezervor-gpl-subteran',
    name: 'Rezervor GPL subteran (îngropat)',
    type: 'instalatii_gaze',
    prescriptieTehnica: 'PT I8',
    verificationInterval: 24,
    requiredAuthorization: 'RSVTI autorizat ISCIR + operator gaze autorizat',
    legalBasis: 'Legea 290/2003, PT I8',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Verificare protecție catodică',
      'Verificare supape și armături',
      'Test etanșeitate anuală',
      'Aviz ISU',
      'Plan de situație rezervor'
    ]
  },
  {
    id: 'retea-gaze-naturale-interna',
    name: 'Rețea gaze naturale internă (imobil)',
    type: 'instalatii_gaze',
    prescriptieTehnica: 'PT I8',
    verificationInterval: 60,
    requiredAuthorization: 'RSVTI autorizat ISCIR sau instalator gaze autorizat ANRE',
    legalBasis: 'Legea 290/2003, PT I8, Legea 123/2012',
    documenteNecesare: [
      'Certificat de verificare tehnică periodică',
      'Proces verbal de verificare etanșeitate',
      'Schemă instalație gaze',
      'Certificat de racordare (de la distribuitor)',
      'Declarație de conformitate montaj',
      'Aviz ISU (dacă e nou-montată)'
    ]
  },
  {
    id: 'centrala-termica-gaze',
    name: 'Centrală termică pe gaze (peste 50 kW)',
    type: 'instalatii_gaze',
    prescriptieTehnica: 'PT C1 + PT I8',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat ISCIR + focist/operator CT autorizat',
    legalBasis: 'Legea 290/2003, PT C1, PT I8',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR (pentru cazan)',
      'Proces verbal de verificare tehnică periodică',
      'Autorizație funcționare RSVTI',
      'Autorizație focist/operator CT',
      'Verificare instalație gaze (PT I8)',
      'Verificare sistem evacuare fum',
      'Buletin analiză gaze arse',
      'Aviz ISU'
    ]
  },
  {
    id: 'rampa-butelii-gpl',
    name: 'Rampă butelii GPL (peste 150 kg stocare)',
    type: 'instalatii_gaze',
    prescriptieTehnica: 'PT I8',
    verificationInterval: 12,
    requiredAuthorization: 'RSVTI autorizat sau instalator gaze autorizat',
    legalBasis: 'Legea 290/2003, PT I8',
    documenteNecesare: [
      'Proces verbal de verificare tehnică periodică',
      'Declarație de conformitate instalație',
      'Verificare etanșeitate',
      'Verificare detectorilor gaze (dacă există)',
      'Aviz ISU (pentru capacități mari)',
      'Certificat butelii la zi (reverificare PT C13)'
    ]
  },
  {
    id: 'uscator-aer-sub-presiune',
    name: 'Uscător aer comprimat (cu vas sub presiune)',
    type: 'presiune',
    prescriptieTehnica: 'PT C11',
    verificationInterval: 24,
    requiredAuthorization: 'RSVTI autorizat ISCIR',
    legalBasis: 'Legea 290/2003, PT C11',
    documenteNecesare: [
      'Certificat de înmatriculare ISCIR',
      'Proces verbal de verificare tehnică periodică',
      'Declarație conformitate CE',
      'Verificare supape siguranță',
      'Verificare presostat',
      'Manual de utilizare'
    ]
  }
];

/**
 * Căutare echipament după ID
 */
export function getEchipamentById(id: string): EchipamentISCIR | undefined {
  return echipamenteISCIR.find(e => e.id === id);
}

/**
 * Filtrare echipamente după tip
 */
export function getEchipamenteByType(type: EchipamentISCIRType): EchipamentISCIR[] {
  return echipamenteISCIR.filter(e => e.type === type);
}

/**
 * Verificare dacă un echipament necesită verificare (pe bază de luni)
 */
export function needsVerification(lastVerificationDate: Date, verificationInterval: number): boolean {
  const monthsSinceVerification =
    (new Date().getTime() - lastVerificationDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return monthsSinceVerification >= verificationInterval;
}
