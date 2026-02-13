/**
 * Lista de verificare ITM (Inspecția Muncii)
 * 30 puncte verificate în timpul controalelor ITM
 * Fiecare punct conține: id, checkpoint, descriere, bază legală, penalități, dovezi necesare, prioritate
 */

export interface ItmCheckpoint {
  id: number;
  checkpoint: string;
  description: string;
  legalBasis: string;
  penaltyRon: number;
  evidenceDocument: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const itmChecklist: ItmCheckpoint[] = [
  {
    id: 1,
    checkpoint: 'Registrul general de evidență a salariaților',
    description: 'Verificarea existenței și actualizării REVISAL pentru toți angajații',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 16, alin. 1',
    penaltyRon: 20000,
    evidenceDocument: 'Registru REVISAL actualizat, dovezi înregistrare CIM',
    priority: 'critical',
  },
  {
    id: 2,
    checkpoint: 'Contracte individuale de muncă',
    description: 'Existența CIM pentru toți angajații, semnate și comunicate în termen de 20 zile calendaristice',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 16, alin. 2',
    penaltyRon: 15000,
    evidenceDocument: 'CIM semnate, dovezi de comunicare',
    priority: 'critical',
  },
  {
    id: 3,
    checkpoint: 'Fișa postului',
    description: 'Fișa postului completă pentru fiecare angajat, semnată și comunicată',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 17',
    penaltyRon: 10000,
    evidenceDocument: 'Fișe de post actualizate cu semnături angajați',
    priority: 'high',
  },
  {
    id: 4,
    checkpoint: 'Regulament intern',
    description: 'Regulament intern aprobat, afișat la loc vizibil, comunicat salariaților',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 241-242',
    penaltyRon: 12000,
    evidenceDocument: 'Regulament intern, procese verbale comunicare',
    priority: 'high',
  },
  {
    id: 5,
    checkpoint: 'Programul de lucru afișat',
    description: 'Programul de lucru afișat la loc vizibil pentru toți angajații',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 115',
    penaltyRon: 5000,
    evidenceDocument: 'Program de lucru afișat, poze/documente',
    priority: 'medium',
  },
  {
    id: 6,
    checkpoint: 'Evaluarea riscurilor profesionale',
    description: 'Plan de prevenire și protecție actualizat, evaluare riscuri pentru toate posturile',
    legalBasis: 'Legea 319/2006 - SSM, art. 7, art. 11',
    penaltyRon: 20000,
    evidenceDocument: 'Plan prevenire, evaluare riscuri, fișe instrucțiuni SSM',
    priority: 'critical',
  },
  {
    id: 7,
    checkpoint: 'Instruire SSM la angajare',
    description: 'Instruire de securitate la angajare pentru toți lucrătorii (instructaj general)',
    legalBasis: 'Legea 319/2006 - SSM, art. 18',
    penaltyRon: 15000,
    evidenceDocument: 'Fișe de instruire SSM semnate, registru instruire',
    priority: 'critical',
  },
  {
    id: 8,
    checkpoint: 'Instruire SSM periodică',
    description: 'Instruire periodică de securitate (la 6 luni sau 1 an în funcție de grad risc)',
    legalBasis: 'Legea 319/2006 - SSM, art. 18',
    penaltyRon: 15000,
    evidenceDocument: 'Fișe instruire periodică, program anual instruire',
    priority: 'high',
  },
  {
    id: 9,
    checkpoint: 'Autorizații de lucru pentru mașini și instalații',
    description: 'Autorizații ISCIR, autorizații speciale pentru echipamente periculoase',
    legalBasis: 'Legea 319/2006 - SSM; reglementări ISCIR',
    penaltyRon: 25000,
    evidenceDocument: 'Autorizații ISCIR, autorizații echipamente, verificări periodice',
    priority: 'critical',
  },
  {
    id: 10,
    checkpoint: 'Echipament individual de protecție (EIP)',
    description: 'Dotarea angajaților cu EIP conform evaluării riscurilor, avize de utilizare',
    legalBasis: 'Legea 319/2006 - SSM, art. 11, alin. 1, lit. d',
    penaltyRon: 10000,
    evidenceDocument: 'Fișe dotare EIP, bonuri de consum, evidență distribuire',
    priority: 'high',
  },
  {
    id: 11,
    checkpoint: 'Avize medicale la angajare',
    description: 'Control medical la angajare pentru toți lucrătorii, fișă de aptitudine',
    legalBasis: 'Legea 319/2006 - SSM, art. 19; HG 355/2007',
    penaltyRon: 15000,
    evidenceDocument: 'Avize medicale la angajare, fișă aptitudine',
    priority: 'critical',
  },
  {
    id: 12,
    checkpoint: 'Avize medicale periodice',
    description: 'Control medical periodic în funcție de factorii de risc (anual/2 ani)',
    legalBasis: 'Legea 319/2006 - SSM, art. 19; HG 355/2007',
    penaltyRon: 15000,
    evidenceDocument: 'Avize medicale periodice, fișă aptitudine actualizată',
    priority: 'critical',
  },
  {
    id: 13,
    checkpoint: 'Înregistrarea accidentelor de muncă',
    description: 'Declararea accidentelor de muncă la ITM în termen de 3 zile, cercetat cu comisie',
    legalBasis: 'Legea 319/2006 - SSM, art. 26',
    penaltyRon: 25000,
    evidenceDocument: 'Procese verbale cercetare, declarații accident muncă F1',
    priority: 'critical',
  },
  {
    id: 14,
    checkpoint: 'Comitet de securitate și sănătate în muncă',
    description: 'Constituire comitet SSM pentru angajatori cu min. 50 angajați',
    legalBasis: 'Legea 319/2006 - SSM, art. 16',
    penaltyRon: 10000,
    evidenceDocument: 'Decizie constituire comitet, PV ședințe',
    priority: 'high',
  },
  {
    id: 15,
    checkpoint: 'Lucrător desemnat sau serviciu SSM',
    description: 'Desemnare lucrător SSM/contract servicii SSM externe în funcție de nr. angajați',
    legalBasis: 'Legea 319/2006 - SSM, art. 14',
    penaltyRon: 20000,
    evidenceDocument: 'Decizie desemnare/Contract SSM extern, adeverință curs SSM',
    priority: 'critical',
  },
  {
    id: 16,
    checkpoint: 'Salarii conforme cu salariul minim pe economie',
    description: 'Verificare plată salarii >= salariul minim brut pe țară garantat în plată',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 164',
    penaltyRon: 20000,
    evidenceDocument: 'State de plată, fluturași salariu',
    priority: 'critical',
  },
  {
    id: 17,
    checkpoint: 'Plata orelor suplimentare',
    description: 'Plata spor ore suplimentare (75% pentru primele 8 ore, 100% peste)',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 120',
    penaltyRon: 10000,
    evidenceDocument: 'Pontaje, state plată cu detaliere ore suplimentare',
    priority: 'high',
  },
  {
    id: 18,
    checkpoint: 'Concediu de odihnă acordat',
    description: 'Acordarea concediului minim legal (20 zile lucrătoare/an)',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 145',
    penaltyRon: 10000,
    evidenceDocument: 'Registru concedii, cereri concediu aprobate',
    priority: 'high',
  },
  {
    id: 19,
    checkpoint: 'Evidența timpului de lucru',
    description: 'Pontaj zilnic, evidență ore lucrate pentru fiecare angajat',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 119',
    penaltyRon: 8000,
    evidenceDocument: 'Pontaje lunare, foi de prezență semnate',
    priority: 'medium',
  },
  {
    id: 20,
    checkpoint: 'Munca la negru (necomunicarea CIM)',
    description: 'Verificare angajați nedeclarați sau CIM necomunicate în termen legal',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 260, lit. a',
    penaltyRon: 20000,
    evidenceDocument: 'REVISAL actualizat, CIM semnate și comunicate ITM',
    priority: 'critical',
  },
  {
    id: 21,
    checkpoint: 'Discriminare la angajare sau la locul de muncă',
    description: 'Verificare lipsa discriminării pe criterii sex, rasă, religie, opinie politică',
    legalBasis: 'OG 137/2000 - prevenirea discriminării',
    penaltyRon: 30000,
    evidenceDocument: 'Proceduri selecție angajați, declarații nediscriminare',
    priority: 'high',
  },
  {
    id: 22,
    checkpoint: 'Munca tinerilor sub 18 ani',
    description: 'Restricții program pentru tineri (max 6h/zi, 30h/săptămână), interdicție muncă nocturnă',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 51-59',
    penaltyRon: 15000,
    evidenceDocument: 'CIM, program lucru adaptat, aviz medic special',
    priority: 'critical',
  },
  {
    id: 23,
    checkpoint: 'Protecția maternității',
    description: 'Interdicții pentru gravide/lăuze, concediu pre/postnatal, pauze alăptare',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 61-67',
    penaltyRon: 10000,
    evidenceDocument: 'Avize medicale, adeverințe concedii medicale, program adaptat',
    priority: 'high',
  },
  {
    id: 24,
    checkpoint: 'Încadrare corectă personal TESA/muncitori',
    description: 'Verificare corectitudine încadrare pe funcții conform COR',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 39',
    penaltyRon: 5000,
    evidenceDocument: 'CIM, fișe post, organigramă',
    priority: 'medium',
  },
  {
    id: 25,
    checkpoint: 'Modificarea unilaterală a CIM',
    description: 'Verificare respectare procedură legală pentru modificare CIM (act adițional)',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 41-48',
    penaltyRon: 10000,
    evidenceDocument: 'Acte adiționale semnate, notificări modificări',
    priority: 'medium',
  },
  {
    id: 26,
    checkpoint: 'Delegare și detașare angajați',
    description: 'Respectare reguli delegare/detașare, spor minim 2.5 salarii bază',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 45-46',
    penaltyRon: 8000,
    evidenceDocument: 'Ordine delegare, state plată cu sporuri',
    priority: 'medium',
  },
  {
    id: 27,
    checkpoint: 'Încetare contract individual de muncă',
    description: 'Verificare respectare proceduri legale la concediere, preaviz, despăgubiri',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 55-80',
    penaltyRon: 15000,
    evidenceDocument: 'Decizii concediere, procese verbale consultare, documente preaviz',
    priority: 'high',
  },
  {
    id: 28,
    checkpoint: 'Formarea profesională a angajaților',
    description: 'Plan de formare profesională, respectare obligații CCM/contract individual',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 192-208',
    penaltyRon: 5000,
    evidenceDocument: 'Plan formare, certificate cursuri, evidență costuri formare',
    priority: 'low',
  },
  {
    id: 29,
    checkpoint: 'Întreruperea activității pentru nereguli grave SSM',
    description: 'Risc de întrerupere activitate în caz de nereguli grave/pericol iminent',
    legalBasis: 'Legea 319/2006 - SSM, art. 29',
    penaltyRon: 50000,
    evidenceDocument: 'Conformitate integrală SSM, plan măsuri corective',
    priority: 'critical',
  },
  {
    id: 30,
    checkpoint: 'Prevenirea și combaterea hărțuirii morale la locul de muncă',
    description: 'Proceduri interne pentru prevenirea hărțuirii psihologice (mobbing)',
    legalBasis: 'Legea 53/2003 - Codul Muncii, art. 5, alin. 3',
    penaltyRon: 10000,
    evidenceDocument: 'Proceduri anti-hărțuire, formulare sesizare, registru reclamații',
    priority: 'medium',
  },
];

/**
 * Helper pentru filtrare după prioritate
 */
export const getChecklistByPriority = (
  priority: 'critical' | 'high' | 'medium' | 'low'
): ItmCheckpoint[] => {
  return itmChecklist.filter((item) => item.priority === priority);
};

/**
 * Helper pentru statistici
 */
export const getChecklistStats = () => {
  const total = itmChecklist.length;
  const critical = itmChecklist.filter((item) => item.priority === 'critical').length;
  const high = itmChecklist.filter((item) => item.priority === 'high').length;
  const medium = itmChecklist.filter((item) => item.priority === 'medium').length;
  const low = itmChecklist.filter((item) => item.priority === 'low').length;
  const totalPenalties = itmChecklist.reduce((sum, item) => sum + item.penaltyRon, 0);

  return {
    total,
    critical,
    high,
    medium,
    low,
    totalPenalties,
  };
};
