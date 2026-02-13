/**
 * Penalties database for Germany (DE)
 * Occupational Safety and Health (Arbeitsschutz) violations
 * Based on ArbSchG (Arbeitsschutzgesetz) and DGUV regulations
 * Authority: BAuA (Bundesanstalt für Arbeitsschutz und Arbeitsmedizin)
 */

export interface Penalty {
  id: string;
  article: string;
  offense: string;
  offenseDE: string;
  minFine: number;
  maxFine: number;
  currency: 'EUR';
  authority: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export const penaltiesDE: Penalty[] = [
  {
    id: 'de-pen-001',
    article: 'ArbSchG § 3 Abs. 1',
    offense: 'Lipsa evaluării riscurilor profesionale',
    offenseDE: 'Fehlende Gefährdungsbeurteilung',
    minFine: 5000,
    maxFine: 25000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'critical',
    description: 'Angajatorul nu a efectuat evaluarea riscurilor obligatorie pentru locurile de muncă, încălcând obligația fundamentală de prevenție.'
  },
  {
    id: 'de-pen-002',
    article: 'ArbSchG § 12 Abs. 1',
    offense: 'Instruire SSM insuficientă sau inexistentă',
    offenseDE: 'Unzureichende oder fehlende Arbeitsschutzunterweisung',
    minFine: 2500,
    maxFine: 15000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'high',
    description: 'Lucrătorii nu au primit instruirea obligatorie privind securitatea și sănătatea în muncă la angajare sau periodic.'
  },
  {
    id: 'de-pen-003',
    article: 'ArbSchG § 5 Abs. 2',
    offense: 'Documentație de evaluare a riscurilor incompletă',
    offenseDE: 'Unvollständige Dokumentation der Gefährdungsbeurteilung',
    minFine: 1500,
    maxFine: 10000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'medium',
    description: 'Evaluarea riscurilor nu este documentată corespunzător sau nu include toate elementele obligatorii conform legislației.'
  },
  {
    id: 'de-pen-004',
    article: 'ArbMedVV § 4',
    offense: 'Lipsa controalelor medicale obligatorii',
    offenseDE: 'Fehlende arbeitsmedizinische Vorsorge',
    minFine: 3000,
    maxFine: 20000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'high',
    description: 'Angajatorul nu a organizat controalele medicale de medicina muncii obligatorii pentru lucrătorii expuși la riscuri specifice.'
  },
  {
    id: 'de-pen-005',
    article: 'PSA-BV § 2 Abs. 1',
    offense: 'Echipamente de protecție individuală inadecvate sau lipsa',
    offenseDE: 'Unzureichende oder fehlende persönliche Schutzausrüstung',
    minFine: 2000,
    maxFine: 12000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'high',
    description: 'Angajatorul nu a furnizat echipamentele de protecție individuală necesare sau acestea nu corespund riscurilor identificate.'
  },
  {
    id: 'de-pen-006',
    article: 'BetrSichV § 10',
    offense: 'Utilizarea echipamentelor de lucru neconforme',
    offenseDE: 'Verwendung nicht konformer Arbeitsmittel',
    minFine: 4000,
    maxFine: 25000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'critical',
    description: 'Echipamentele de lucru nu îndeplinesc cerințele de securitate sau nu au fost verificate tehnic conform reglementărilor.'
  },
  {
    id: 'de-pen-007',
    article: 'ArbStättV § 4 Abs. 3',
    offense: 'Căi de evacuare blocate sau nesemnalizate',
    offenseDE: 'Blockierte oder nicht gekennzeichnete Fluchtwege',
    minFine: 2500,
    maxFine: 15000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'high',
    description: 'Căile de evacuare în caz de urgență sunt blocate, înguste sau nu sunt marcate corespunzător cu semnalizare fotoluminiscentă.'
  },
  {
    id: 'de-pen-008',
    article: 'GefStoffV § 7',
    offense: 'Nerespectarea cerințelor pentru substanțe periculoase',
    offenseDE: 'Verstoß gegen Anforderungen für Gefahrstoffe',
    minFine: 5000,
    maxFine: 30000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'critical',
    description: 'Manipularea, depozitarea sau utilizarea substanțelor chimice periculoase fără respectarea procedurilor de siguranță și a FDS.'
  },
  {
    id: 'de-pen-009',
    article: 'ArbSchG § 11',
    offense: 'Lipsa serviciului de protecție a muncii (Fachkraft)',
    offenseDE: 'Fehlende Fachkraft für Arbeitssicherheit',
    minFine: 4000,
    maxFine: 20000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'critical',
    description: 'Angajatorul nu a desemnat specialist în protecția muncii (Fachkraft für Arbeitssicherheit) conform obligațiilor legale.'
  },
  {
    id: 'de-pen-010',
    article: 'BetrSichV § 14',
    offense: 'Verificări tehnice periodice neefectuate',
    offenseDE: 'Fehlende wiederkehrende Prüfungen',
    minFine: 2000,
    maxFine: 12000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'high',
    description: 'Echipamentele de lucru și instalațiile nu au fost supuse verificărilor tehnice periodice obligatorii de către persoane autorizate.'
  },
  {
    id: 'de-pen-011',
    article: 'ArbStättV Anhang 2.3',
    offense: 'Lipsa semnalizării de securitate',
    offenseDE: 'Fehlende Sicherheitskennzeichnung',
    minFine: 1000,
    maxFine: 8000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'medium',
    description: 'Zonele periculoase nu sunt marcate cu indicatoare de avertizare și securitate conform ASR A1.3.'
  },
  {
    id: 'de-pen-012',
    article: 'LärmVibrationsArbSchV § 7',
    offense: 'Depășirea valorilor limită de expunere la zgomot',
    offenseDE: 'Überschreitung der Lärmgrenzwerte',
    minFine: 3000,
    maxFine: 18000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'critical',
    description: 'Nivelul de zgomot la locul de muncă depășește 85 dB(A) fără măsuri de protecție tehnică și organizatorică adecvate.'
  },
  {
    id: 'de-pen-013',
    article: 'ArbStättV Anhang 3.4',
    offense: 'Iluminat insuficient la locul de muncă',
    offenseDE: 'Unzureichende Beleuchtung',
    minFine: 800,
    maxFine: 5000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'low',
    description: 'Nivelul de iluminare la locurile de muncă este sub valorile minime conform ASR A3.4, afectând siguranța lucrătorilor.'
  },
  {
    id: 'de-pen-014',
    article: 'DGUV Vorschrift 1 § 24',
    offense: 'Neraportarea accidentelor de muncă',
    offenseDE: 'Unterlassene Meldung von Arbeitsunfällen',
    minFine: 2500,
    maxFine: 15000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'high',
    description: 'Angajatorul nu a notificat Berufsgenossenschaft despre producerea unui accident de muncă cu incapacitate peste 3 zile.'
  },
  {
    id: 'de-pen-015',
    article: 'BaustellV § 3',
    offense: 'Lipsa planului de securitate și protecție a sănătății (SiGePlan)',
    offenseDE: 'Fehlender Sicherheits- und Gesundheitsschutzplan',
    minFine: 3500,
    maxFine: 20000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'critical',
    description: 'Pentru șantiere cu mai mult de 500 zile-om nu a fost elaborat planul SiGePlan obligatoriu.'
  },
  {
    id: 'de-pen-016',
    article: 'ArbStättV Anhang 2.1',
    offense: 'Lipsa instalațiilor sanitare adecvate',
    offenseDE: 'Unzureichende Sanitäreinrichtungen',
    minFine: 1500,
    maxFine: 10000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'medium',
    description: 'Angajatorul nu asigură toalete, vestiare sau spații de odihnă conform cerințelor ASR A4.1.'
  },
  {
    id: 'de-pen-017',
    article: 'ArbSchG § 22',
    offense: 'Refuzul controlului de către inspectorii de muncă',
    offenseDE: 'Behinderung der Aufsichtsbehörde',
    minFine: 4000,
    maxFine: 25000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'high',
    description: 'Împiedicarea accesului inspectorilor de la Gewerbeaufsicht la verificarea respectării normelor de protecție a muncii.'
  },
  {
    id: 'de-pen-018',
    article: 'BetrSichV § 12',
    offense: 'Lipsa măsurilor de protecție împotriva căderilor de la înălțime',
    offenseDE: 'Fehlende Absturzsicherung',
    minFine: 3500,
    maxFine: 20000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'critical',
    description: 'La lucrările la înălțime peste 2m nu au fost instalate sisteme de protecție colectivă (balustrade, plase) sau individuală (centuri).'
  },
  {
    id: 'de-pen-019',
    article: 'ArbStättV § 3 Abs. 1',
    offense: 'Condiții microclimatice inadecvate',
    offenseDE: 'Unzureichendes Raumklima',
    minFine: 1200,
    maxFine: 8000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'medium',
    description: 'Temperatura, umiditatea sau ventilația la locul de muncă nu respectă valorile recomandate conform ASR A3.5.'
  },
  {
    id: 'de-pen-020',
    article: 'DGUV Vorschrift 3 § 5',
    offense: 'Utilizarea echipamentelor electrice defecte',
    offenseDE: 'Verwendung mangelhafter elektrischer Betriebsmittel',
    minFine: 2500,
    maxFine: 15000,
    currency: 'EUR',
    authority: 'BAuA',
    severity: 'critical',
    description: 'Utilizarea echipamentelor electrice cu defecțiuni sau fără verificări DGUV V3, creând risc de electrocutare.'
  }
];

/**
 * Get all German penalties
 * @returns Array of penalties for Germany
 */
export function getPenaltiesDE(): Penalty[] {
  return penaltiesDE;
}

/**
 * Get penalty by ID
 * @param id Penalty ID
 * @returns Penalty object or undefined
 */
export function getPenaltyByIdDE(id: string): Penalty | undefined {
  return penaltiesDE.find(p => p.id === id);
}

/**
 * Get penalties by severity
 * @param severity Severity level
 * @returns Array of penalties matching the severity
 */
export function getPenaltiesBySeverityDE(severity: Penalty['severity']): Penalty[] {
  return penaltiesDE.filter(p => p.severity === severity);
}

export default penaltiesDE;
