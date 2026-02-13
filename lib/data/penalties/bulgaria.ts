/**
 * Penalties database for Bulgaria (ZZBBUT - Health and Safety at Work Act)
 * Закон за здравословни и безопасни условия на труд (ЗЗБУТ)
 *
 * All fines are in EUR (converted from BGN at 1 EUR = 1.95583 BGN)
 */

export interface BulgariaPenalty {
  id: string;
  article: string;
  violation: string;
  minFine: number;
  maxFine: number;
  authority: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  legalReference: string;
}

const bulgariaPenalties: BulgariaPenalty[] = [
  {
    id: 'bg-001',
    article: 'Чл. 212, ал. 1',
    violation: 'Недоведено до знанието на работниците и служителите на условията на труд и свързаните с това рискове за тяхното здраве',
    minFine: 500,
    maxFine: 1000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
    legalReference: 'ЗЗБУТ чл. 212, ал. 1'
  },
  {
    id: 'bg-002',
    article: 'Чл. 212, ал. 2',
    violation: 'Недопускане на работниците и служителите до участие в обсъждането на въпросите, свързани със здравословните и безопасни условия на труд',
    minFine: 500,
    maxFine: 1000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
    legalReference: 'ЗЗБУТ чл. 212, ал. 2'
  },
  {
    id: 'bg-003',
    article: 'Чл. 213, ал. 1',
    violation: 'Неосигуряване на обучение по безопасност и здраве при работа на работниците и служителите',
    minFine: 1500,
    maxFine: 3000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
    legalReference: 'ЗЗБУТ чл. 213, ал. 1'
  },
  {
    id: 'bg-004',
    article: 'Чл. 213, ал. 2',
    violation: 'Допускане до работа на лица, които не са преминали необходимото обучение и/или инструктаж по безопасност и здраве при работа',
    minFine: 2000,
    maxFine: 5000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
    legalReference: 'ЗЗБУТ чл. 213, ал. 2'
  },
  {
    id: 'bg-005',
    article: 'Чл. 214, ал. 1',
    violation: 'Неизвършване на оценка на риска за всяко работно място',
    minFine: 1500,
    maxFine: 3000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
    legalReference: 'ЗЗБУТ чл. 214, ал. 1'
  },
  {
    id: 'bg-006',
    article: 'Чл. 215, ал. 1',
    violation: 'Неосигуряване на лични предпазни средства на работниците и служителите',
    minFine: 1000,
    maxFine: 2000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
    legalReference: 'ЗЗБУТ чл. 215, ал. 1'
  },
  {
    id: 'bg-007',
    article: 'Чл. 216, ал. 1',
    violation: 'Неосигуряване на предварителни и/или периодични медицински прегледи на работещите при условия по чл. 169',
    minFine: 1500,
    maxFine: 3000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
    legalReference: 'ЗЗБУТ чл. 216, ал. 1'
  },
  {
    id: 'bg-008',
    article: 'Чл. 216, ал. 2',
    violation: 'Допускане до работа на лица, които не са преминали задължителен медицински преглед',
    minFine: 2000,
    maxFine: 4000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
    legalReference: 'ЗЗБУТ чл. 216, ал. 2'
  },
  {
    id: 'bg-009',
    article: 'Чл. 217, ал. 1',
    violation: 'Неназначаване на служба по трудова медицина или неосигуряване на дейности по трудова медицина',
    minFine: 1000,
    maxFine: 2000,
    authority: 'Изпълнителна агенция „Główna инспекция по труда" (ИА ГИТ)',
    severity: 'high',
    legalReference: 'ЗЗБУТ чл. 217, ал. 1'
  },
  {
    id: 'bg-010',
    article: 'Чл. 218, ал. 1',
    violation: 'Неизпълнение на мерките, предписани от органите на Изпълнителна агенция "Главна инспекция по труда"',
    minFine: 2500,
    maxFine: 10000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
    legalReference: 'ЗЗБУТ чл. 218, ал. 1'
  },
  {
    id: 'bg-011',
    article: 'Чл. 219, ал. 1',
    violation: 'Неуведомяване на ИА ГИТ за настъпило трудово злополуки в законоустановените срокове',
    minFine: 1500,
    maxFine: 3000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
    legalReference: 'ЗЗБУТ чл. 219, ал. 1'
  },
  {
    id: 'bg-012',
    article: 'Чл. 220, ал. 1',
    violation: 'Неизработване на правила за осигуряване на здравословни и безопасни условия на труд',
    minFine: 800,
    maxFine: 1500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
    legalReference: 'ЗЗБУТ чл. 220, ал. 1'
  },
  {
    id: 'bg-013',
    article: 'Чл. 221, ал. 1',
    violation: 'Използване на оборудване, което не отговаря на изискванията за безопасност',
    minFine: 2000,
    maxFine: 5000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
    legalReference: 'ЗЗБУТ чл. 221, ал. 1'
  },
  {
    id: 'bg-014',
    article: 'Чл. 222, ал. 1',
    violation: 'Неосигуряване на безопасна организация на работните места',
    minFine: 1000,
    maxFine: 2500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
    legalReference: 'ЗЗБУТ чл. 222, ал. 1'
  },
  {
    id: 'bg-015',
    article: 'Чл. 223, ал. 1',
    violation: 'Неосигуряване на първа помощ при злополуки на работното място',
    minFine: 800,
    maxFine: 1500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
    legalReference: 'ZZBUT чл. 223, ал. 1'
  },
  {
    id: 'bg-016',
    article: 'Чл. 224, ал. 1',
    violation: 'Недопускане на представители на работниците и служителите до съвместни проверки по безопасност и здраве при работа',
    minFine: 500,
    maxFine: 1000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
    legalReference: 'ЗЗБУТ чл. 224, ал. 1'
  },
  {
    id: 'bg-017',
    article: 'Чл. 225, ал. 1',
    violation: 'Неосигуряване на подходящи санитарно-битови помещения и устройства',
    minFine: 600,
    maxFine: 1200,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
    legalReference: 'ЗЗБУТ чл. 225, ал. 1'
  },
  {
    id: 'bg-018',
    article: 'Чл. 226, ал. 1',
    violation: 'Неосигуряване на специално облекло и храна при работа в особени температурни условия',
    minFine: 500,
    maxFine: 1000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'low',
    legalReference: 'ЗЗБУТ чл. 226, ал. 1'
  },
  {
    id: 'bg-019',
    article: 'Чл. 227, ал. 1',
    violation: 'Непредоставяне на информация и документи, изискани от инспектора по труда',
    minFine: 1000,
    maxFine: 2000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
    legalReference: 'ЗЗБУТ чл. 227, ал. 1'
  },
  {
    id: 'bg-020',
    article: 'Чл. 228, ал. 1',
    violation: 'Необезпечаване на измервания на вредни фактори на работната среда (шум, прах, химични агенти, микроклимат)',
    minFine: 1200,
    maxFine: 2500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
    legalReference: 'ЗЗБУТ чл. 228, ал. 1'
  }
];

/**
 * Get all Bulgaria penalties
 */
export function getPenaltiesBG(): BulgariaPenalty[] {
  return bulgariaPenalties;
}

/**
 * Get penalty by ID
 */
export function getPenaltyById(id: string): BulgariaPenalty | undefined {
  return bulgariaPenalties.find(p => p.id === id);
}

/**
 * Get penalties by severity
 */
export function getPenaltiesBySeverity(severity: BulgariaPenalty['severity']): BulgariaPenalty[] {
  return bulgariaPenalties.filter(p => p.severity === severity);
}

/**
 * Search penalties by violation text
 */
export function searchPenalties(query: string): BulgariaPenalty[] {
  const lowerQuery = query.toLowerCase();
  return bulgariaPenalties.filter(p =>
    p.violation.toLowerCase().includes(lowerQuery) ||
    p.article.toLowerCase().includes(lowerQuery)
  );
}

export default bulgariaPenalties;
