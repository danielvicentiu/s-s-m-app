/**
 * Baza de date cu autoritățile PSI (Prevenire și Stingere Incendii) din 5 țări
 * România, Bulgaria, Ungaria, Germania, Polonia
 */

export interface PsiAuthority {
  country: string;
  countryCode: 'RO' | 'BG' | 'HU' | 'DE' | 'PL';
  authorityName: string;
  authorityNameLocal: string;
  website: string;
  phone: string;
  emergencyNumber: string;
  inspectionFrequency: string;
  requiredDocs: string[];
  penalties: {
    minorViolation: string;
    majorViolation: string;
    criticalViolation: string;
    noDocumentation: string;
  };
  notes: string;
}

export const psiAuthorities: PsiAuthority[] = [
  {
    country: 'România',
    countryCode: 'RO',
    authorityName: 'General Inspectorate for Emergency Situations',
    authorityNameLocal: 'Inspectoratul General pentru Situații de Urgență (IGSU/ISU)',
    website: 'https://www.igsu.ro',
    phone: '021 316 0160',
    emergencyNumber: '112',
    inspectionFrequency: 'Anual sau la sesizare',
    requiredDocs: [
      'Autorizație de securitate la incendiu',
      'Plan de evacuare',
      'Instrucțiuni de securitate la incendiu',
      'Registrul de evidență a verificărilor',
      'Certificate de verificare echipamente P.S.I.',
      'Documentație tehnică instalații de stingere',
      'Procese verbale de instruire personal',
      'Scenarii de securitate la incendiu',
      'Aviz P.S.I. pentru construcții',
      'Proiect P.S.I. autorizat'
    ],
    penalties: {
      minorViolation: '1.000 - 5.000 RON',
      majorViolation: '5.000 - 20.000 RON',
      criticalViolation: '20.000 - 100.000 RON + suspendare activitate',
      noDocumentation: '10.000 - 50.000 RON'
    },
    notes: 'Controlul se face de către ISU județean. Amenzi conform OUG 195/2005.'
  },
  {
    country: 'Bulgaria',
    countryCode: 'BG',
    authorityName: 'General Directorate Fire Safety and Civil Protection',
    authorityNameLocal: 'Главна дирекция "Пожарна безопасност и защита на населението" (ГДПБЗН)',
    website: 'https://www.fire.bg',
    phone: '+359 2 982 3000',
    emergencyNumber: '112',
    inspectionFrequency: 'Anual sau la solicitare',
    requiredDocs: [
      'План за пожарна безопасност (Plan de securitate la incendiu)',
      'Инструкции за пожарна безопасност (Instrucțiuni PSI)',
      'Регистър за инструктажи (Registru instruire)',
      'Протоколи за проверка на оборудване (Certificate echipamente)',
      'Планове за евакуация (Planuri evacuare)',
      'Договор за поддръжка на системи (Contract mentenanță sisteme)',
      'Разрешение за пожарна безопасност (Autorizație PSI)',
      'Документация за огнеупорни материали (Documentație materiale)',
      'Дневник за обекта (Jurnal obiectiv)',
      'Застрахователна полица (Poliță asigurare)'
    ],
    penalties: {
      minorViolation: '500 - 1.500 BGN (1.500 - 4.500 RON)',
      majorViolation: '1.500 - 5.000 BGN (4.500 - 15.000 RON)',
      criticalViolation: '5.000 - 15.000 BGN (15.000 - 45.000 RON) + oprire activitate',
      noDocumentation: '2.000 - 8.000 BGN (6.000 - 24.000 RON)'
    },
    notes: 'Amenzi conform Законa за защита при бедствия. 1 BGN ≈ 3 RON'
  },
  {
    country: 'Ungaria',
    countryCode: 'HU',
    authorityName: 'National Directorate General for Disaster Management',
    authorityNameLocal: 'Belügyminisztérium Országos Katasztrófavédelmi Főigazgatóság (BM OKF)',
    website: 'https://www.katasztrofavedelem.hu',
    phone: '+36 1 469 5000',
    emergencyNumber: '112',
    inspectionFrequency: 'La 2-3 ani sau la sesizare',
    requiredDocs: [
      'Tűzvédelmi szabályzat (Regulament PSI)',
      'Tűzvédelmi oktatási napló (Registru instruire)',
      'Menekülési terv (Plan evacuare)',
      'Oltókészülékek ellenőrzési könyve (Registru verificări stingătoare)',
      'Tűzoltó készülékek jegyzéke (Inventar echipamente)',
      'Tűzvédelmi berendezések karbantartási szerződése (Contract mentenanță)',
      'Tűzvédelmi engedély (Autorizație PSI)',
      'Villamos berendezések felülvizsgálati jegyzőkönyve (Verificări instalații electrice)',
      'Veszélyes anyagok nyilvántartása (Evidență substanțe periculoase)',
      'Tűzvédelmi eljárásrend (Proceduri PSI)'
    ],
    penalties: {
      minorViolation: '50.000 - 200.000 HUF (700 - 2.800 RON)',
      majorViolation: '200.000 - 1.000.000 HUF (2.800 - 14.000 RON)',
      criticalViolation: '1.000.000 - 5.000.000 HUF (14.000 - 70.000 RON) + zárlat (închidere)',
      noDocumentation: '500.000 - 2.000.000 HUF (7.000 - 28.000 RON)'
    },
    notes: 'Amenzi conform 1996. évi XXXI. törvény. 1 EUR ≈ 400 HUF, 1 RON ≈ 70 HUF'
  },
  {
    country: 'Germania',
    countryCode: 'DE',
    authorityName: 'Fire Department / Fire Protection Authority',
    authorityNameLocal: 'Feuerwehr / Brandschutzbehörde',
    website: 'https://www.bbk.bund.de',
    phone: 'Variază pe landuri (de ex. Berlin: +49 30 387 30)',
    emergencyNumber: '112',
    inspectionFrequency: 'Anual sau la 2 ani (depinde de land și risc)',
    requiredDocs: [
      'Brandschutzordnung (Regulament protecție incendiu)',
      'Flucht- und Rettungsplan (Plan evacuare și salvare)',
      'Brandschutzhelfer-Nachweis (Dovadă responsabili PSI)',
      'Feuerlöscher-Wartungsprotokoll (Protocol mentenanță stingătoare)',
      'Brandschutztechnische Dokumentation (Documentație tehnică PSI)',
      'Prüfbescheinigungen für Brandschutzanlagen (Certificate sisteme PSI)',
      'Baugenehmigung mit Brandschutznachweis (Autorizație construcție cu aviz PSI)',
      'Elektrische Anlagen Prüfprotokoll (Verificare instalații electrice)',
      'Sicherheitsdatenblätter (Fișe siguranță substanțe)',
      'Alarmplan (Plan alarmare)'
    ],
    penalties: {
      minorViolation: '500 - 2.500 EUR (2.500 - 12.500 RON)',
      majorViolation: '2.500 - 10.000 EUR (12.500 - 50.000 RON)',
      criticalViolation: '10.000 - 50.000 EUR (50.000 - 250.000 RON) + Betriebsschließung',
      noDocumentation: '5.000 - 25.000 EUR (25.000 - 125.000 RON)'
    },
    notes: 'Legislație federală + pe landuri. Amenzi conform Ordnungswidrigkeitengesetz. 1 EUR ≈ 5 RON'
  },
  {
    country: 'Polonia',
    countryCode: 'PL',
    authorityName: 'State Fire Service',
    authorityNameLocal: 'Państwowa Straż Pożarna (PSP)',
    website: 'https://www.straz.gov.pl',
    phone: '+48 22 523 3000',
    emergencyNumber: '112',
    inspectionFrequency: 'La 2 ani sau la sesizare',
    requiredDocs: [
      'Instrukcja bezpieczeństwa pożarowego (Instrucțiuni securitate incendiu)',
      'Plan ewakuacji (Plan evacuare)',
      'Rejestr instruktażu pracowników (Registru instruire angajați)',
      'Protokoły przeglądu urządzeń p.poż. (Protocoale verificare echipamente)',
      'Książka obiektu budowlanego (Carte tehnică edificiu)',
      'Umowa na konserwację systemów p.poż. (Contract mentenanță sisteme)',
      'Decyzja zatwierdzająca projekt p.poż. (Decizie aprobare proiect PSI)',
      'Protokoły badań instalacji elektrycznych (Verificări instalații electrice)',
      'Karty charakterystyki substancji (Fișe caracterizare substanțe)',
      'Procedury alarmowe (Proceduri alarmare)'
    ],
    penalties: {
      minorViolation: '1.000 - 5.000 PLN (1.200 - 6.000 RON)',
      majorViolation: '5.000 - 20.000 PLN (6.000 - 24.000 RON)',
      criticalViolation: '20.000 - 100.000 PLN (24.000 - 120.000 RON) + zamknięcie działalności',
      noDocumentation: '10.000 - 50.000 PLN (12.000 - 60.000 RON)'
    },
    notes: 'Amenzi conform Ustawa o ochronie przeciwpożarowej. 1 PLN ≈ 1.2 RON'
  }
];

/**
 * Obține autoritatea PSI pentru o țară specificată
 */
export function getPsiAuthorityByCountry(countryCode: string): PsiAuthority | undefined {
  return psiAuthorities.find(auth => auth.countryCode === countryCode);
}

/**
 * Obține lista tuturor codurilor de țări disponibile
 */
export function getAvailableCountries(): string[] {
  return psiAuthorities.map(auth => auth.countryCode);
}

/**
 * Verifică dacă o țară are date PSI disponibile
 */
export function hasCountryPsiData(countryCode: string): boolean {
  return psiAuthorities.some(auth => auth.countryCode === countryCode);
}
