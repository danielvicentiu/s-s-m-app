/**
 * Bulgaria SSM Penalties Database
 * Based on ZZBBUT (Закон за здравословни и безопасни условия на труд)
 * Bulgarian Occupational Safety and Health Act
 */

export interface Penalty {
  id: string;
  article: string;
  violation: string;
  minFine: number; // EUR
  maxFine: number; // EUR
  authority: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const penaltiesBG: Penalty[] = [
  {
    id: 'bg-001',
    article: 'ZZBBUT чл. 54, ал. 1',
    violation: 'Неизпълнение на задължението за провеждане на оценка на риска на работното място',
    minFine: 500,
    maxFine: 2000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
  },
  {
    id: 'bg-002',
    article: 'ZZBBUT чл. 54, ал. 2',
    violation: 'Недопускане на упълномощени представители на работниците до участие в осигуряване на здравословни и безопасни условия на труд',
    minFine: 300,
    maxFine: 1500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
  },
  {
    id: 'bg-003',
    article: 'ZZBBUT чл. 54, ал. 3',
    violation: 'Неосигуряване на обучение по безопасност и здраве при работа на работниците и служителите',
    minFine: 500,
    maxFine: 2500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
  },
  {
    id: 'bg-004',
    article: 'ZZBBUT чл. 54, ал. 4',
    violation: 'Неосигуряване на лични предпазни средства на работниците',
    minFine: 400,
    maxFine: 2000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
  },
  {
    id: 'bg-005',
    article: 'ZZBBUT чл. 54, ал. 5',
    violation: 'Допускане до работа на работници без провеждане на задължителни медицински прегледи',
    minFine: 600,
    maxFine: 3000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
  },
  {
    id: 'bg-006',
    article: 'ZZBBUT чл. 54, ал. 6',
    violation: 'Неназначаване на служител по безопасност и здраве при работа или неосигуряване на служба по трудова медицина',
    minFine: 500,
    maxFine: 2500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
  },
  {
    id: 'bg-007',
    article: 'ZZBBUT чл. 54, ал. 7',
    violation: 'Неосигуряване на здравословни и безопасни условия на труд при експлоатация на работното оборудване',
    minFine: 400,
    maxFine: 2000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
  },
  {
    id: 'bg-008',
    article: 'ZZBBUT чл. 54, ал. 8',
    violation: 'Неизпълнение на предписания на контролните органи',
    minFine: 500,
    maxFine: 2500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
  },
  {
    id: 'bg-009',
    article: 'ZZBBUT чл. 54, ал. 9',
    violation: 'Неизвършване на периодична проверка на работното оборудване',
    minFine: 300,
    maxFine: 1500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
  },
  {
    id: 'bg-010',
    article: 'ZZBBUT чл. 54, ал. 10',
    violation: 'Неуведомяване на ИА ГИТ за настъпил трудов инцидент',
    minFine: 600,
    maxFine: 3000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
  },
  {
    id: 'bg-011',
    article: 'ZZBBUT чл. 54, ал. 11',
    violation: 'Недопускане на инспекторите по труда до обект или непредоставяне на изискуема информация',
    minFine: 500,
    maxFine: 2500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
  },
  {
    id: 'bg-012',
    article: 'ZZBBUT чл. 54, ал. 12',
    violation: 'Неосигуряване на достъп до документация по безопасност и здраве при работа',
    minFine: 200,
    maxFine: 1000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'low',
  },
  {
    id: 'bg-013',
    article: 'ZZBBUT чл. 55, ал. 1',
    violation: 'Работа без разрешение за дейности с повишена опасност',
    minFine: 800,
    maxFine: 4000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
  },
  {
    id: 'bg-014',
    article: 'ZZBBUT чл. 55, ал. 2',
    violation: 'Допускане до работа на лица без необходимата квалификация и правоспособност',
    minFine: 500,
    maxFine: 2500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'high',
  },
  {
    id: 'bg-015',
    article: 'ZZBBUT чл. 56, ал. 1',
    violation: 'Неизпълнение на задължението за регистрация на работните места с вредни условия на труд',
    minFine: 400,
    maxFine: 2000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
  },
  {
    id: 'bg-016',
    article: 'ZZBBUT чл. 56, ал. 2',
    violation: 'Неосигуряване на специално работно облекло и храна при работа в студени помещения',
    minFine: 300,
    maxFine: 1500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
  },
  {
    id: 'bg-017',
    article: 'ZZBBUT чл. 57, ал. 1',
    violation: 'Неосигуряване на първа долекарска помощ на работното място',
    minFine: 300,
    maxFine: 1500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'medium',
  },
  {
    id: 'bg-018',
    article: 'ZZBBUT чл. 57, ал. 2',
    violation: 'Неосигуряване на подходящи санитарно-битови помещения за работниците',
    minFine: 200,
    maxFine: 1000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'low',
  },
  {
    id: 'bg-019',
    article: 'ZZBBUT чл. 58, ал. 1',
    violation: 'Неосигуряване на безопасни условия за работа на бременни и кърмачки',
    minFine: 600,
    maxFine: 3000,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
  },
  {
    id: 'bg-020',
    article: 'ZZBBUT чл. 58, ал. 2',
    violation: 'Допускане до нощна работа или работа с вредни условия на непълнолетни лица',
    minFine: 700,
    maxFine: 3500,
    authority: 'Изпълнителна агенция „Главна инспекция по труда" (ИА ГИТ)',
    severity: 'critical',
  },
];

/**
 * Get all Bulgarian SSM penalties
 */
export function getPenaltiesBG(): Penalty[] {
  return penaltiesBG;
}

/**
 * Get penalties by severity
 */
export function getPenaltiesBGBySeverity(severity: Penalty['severity']): Penalty[] {
  return penaltiesBG.filter(p => p.severity === severity);
}

/**
 * Get penalty by ID
 */
export function getPenaltyBGById(id: string): Penalty | undefined {
  return penaltiesBG.find(p => p.id === id);
}

/**
 * Search penalties by violation text
 */
export function searchPenaltiesBG(query: string): Penalty[] {
  const lowerQuery = query.toLowerCase();
  return penaltiesBG.filter(p =>
    p.violation.toLowerCase().includes(lowerQuery) ||
    p.article.toLowerCase().includes(lowerQuery)
  );
}
