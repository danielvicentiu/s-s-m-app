/**
 * Bulgarian SSM (Occupational Health and Safety) Legislative Acts Database
 * Бази данни за нормативни актове по безопасност и здраве при работа в България
 *
 * Generated: 2026-02-13
 */

export interface LegislativePenalty {
  violationType: string;
  minAmount: number;
  maxAmount: number;
  currency: string;
  description: string;
}

export interface LegislativeAct {
  id: string;
  type: 'law' | 'ordinance' | 'regulation' | 'decree';
  number: string;
  year: number;
  titleBG: string;
  titleEN: string;
  authority: string;
  effectiveDate?: string;
  lastAmended?: string;
  scope: string[];
  keyObligations: string[];
  penalties: LegislativePenalty[];
  relatedActs?: string[];
  officialUrl?: string;
}

export const LEGISLATIE_BG_SSM: LegislativeAct[] = [
  {
    id: 'bg-kt-2024',
    type: 'law',
    number: 'Кодекс на труда',
    year: 1986,
    titleBG: 'Кодекс на труда на Република България',
    titleEN: 'Labor Code of the Republic of Bulgaria',
    authority: 'Народно събрание (National Assembly)',
    effectiveDate: '1987-01-01',
    lastAmended: '2024-12-31',
    scope: ['labor-relations', 'employment-contracts', 'working-conditions', 'occupational-safety'],
    keyObligations: [
      'Работодателят осигурява безопасни и здравословни условия на труд (чл. 273)',
      'Провеждане на инструктаж за безопасност при наемане и смяна на работното място',
      'Осигуряване на лични предпазни средства (ЛПС) безплатно за работниците',
      'Организиране на периодични медицински прегледи за работниците',
      'Създаване на служба по трудова медицина при над 50 работници',
      'Изготвяне на оценка на риска за всички работни места',
      'Осигуряване на обучение по безопасност и здраве при работа',
      'Уведомяване на Инспекцията по труда при трудови злополуки',
      'Водене на регистър на трудовите злополуки',
      'Предоставяне на информация за рисковете на работното място'
    ],
    penalties: [
      {
        violationType: 'Липса на инструктаж за безопасност',
        minAmount: 1500,
        maxAmount: 5000,
        currency: 'BGN',
        description: 'Глоба за необезопасяване на инструктаж при наемане или смяна на работа'
      },
      {
        violationType: 'Неосигуряване на ЛПС',
        minAmount: 2000,
        maxAmount: 8000,
        currency: 'BGN',
        description: 'Санкция за непредоставяне на лични предпазни средства'
      },
      {
        violationType: 'Липса на оценка на риска',
        minAmount: 3000,
        maxAmount: 10000,
        currency: 'BGN',
        description: 'Глоба за работа без актуална оценка на професионалния риск'
      },
      {
        violationType: 'Неуведомяване за трудова злополука',
        minAmount: 5000,
        maxAmount: 15000,
        currency: 'BGN',
        description: 'Тежка санкция за неуведомяване на ИТ при трудова злополука'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-5-2005', 'bg-naredba-3-2004'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/1594373121'
  },
  {
    id: 'bg-zbut-1997',
    type: 'law',
    number: 'Закон за здравословни и безопасни условия на труд',
    year: 1997,
    titleBG: 'Закон за здравословни и безопасни условия на труд (ЗЗБУТ)',
    titleEN: 'Occupational Health and Safety Act',
    authority: 'Народно събрание',
    effectiveDate: '1997-09-01',
    lastAmended: '2024-08-01',
    scope: ['occupational-safety', 'health-protection', 'risk-assessment', 'labor-inspection'],
    keyObligations: [
      'Осигуряване на здравословни и безопасни условия на труд за всички работници (чл. 5)',
      'Назначаване на специалист по безопасност и здраве при работа',
      'Провеждане на оценка на риска и актуализация при промени',
      'Създаване на комитет/групи по условия на труд при над 50 работници',
      'Осигуряване на специализирано обучение по ЗБУТ',
      'Спазване на изискванията за работа с машини и оборудване',
      'Провеждане на предварителни и периодични медицински прегледи',
      'Организиране на оказване на първа помощ на работното място',
      'Уведомяване за пускане в експлоатация на обекти с повишен риск',
      'Разследване на трудови злополуки и професионални заболявания'
    ],
    penalties: [
      {
        violationType: 'Липса на специалист по ЗБУТ',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Санкция за неназначаване на компетентно лице по безопасност'
      },
      {
        violationType: 'Работа без оценка на риска',
        minAmount: 4000,
        maxAmount: 15000,
        currency: 'BGN',
        description: 'Тежка глоба за отсъствие на документирана оценка на риска'
      },
      {
        violationType: 'Липса на комитет по условия на труд',
        minAmount: 2000,
        maxAmount: 7000,
        currency: 'BGN',
        description: 'Глоба при над 50 работници без създаден комитет'
      },
      {
        violationType: 'Неосигуряване на обучение по ЗБУТ',
        minAmount: 2500,
        maxAmount: 9000,
        currency: 'BGN',
        description: 'Санкция за липса на задължително обучение на работниците'
      }
    ],
    relatedActs: ['bg-kt-2024', 'bg-naredba-5-2005', 'bg-naredba-7-1999'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2134673408'
  },
  {
    id: 'bg-naredba-5-2005',
    type: 'ordinance',
    number: 'Наредба № 5',
    year: 2005,
    titleBG: 'Наредба № 5 от 2005 г. за минималните изисквания за безопасност и здраве при работа с машини',
    titleEN: 'Ordinance No. 5 of 2005 on Minimum Safety and Health Requirements for Work with Machinery',
    authority: 'Министерство на труда и социалната политика',
    effectiveDate: '2005-09-01',
    lastAmended: '2023-06-15',
    scope: ['machinery-safety', 'equipment-operation', 'technical-requirements'],
    keyObligations: [
      'Осигуряване на машини с маркировка СЕ и декларация за съответствие',
      'Поддържане на машините в изправно работно състояние',
      'Провеждане на периодични проверки на работното оборудване',
      'Обучение на работниците за безопасна експлоатация на машините',
      'Осигуряване на инструкции за работа на български език',
      'Монтиране на предпазни устройства и спирателни механизми',
      'Забрана за отстраняване или заобикаляне на предпазни средства',
      'Извършване на текущи ремонти и профилактика на оборудването',
      'Водене на документация за технически прегледи и ремонти',
      'Спазване на изискванията за работа с вдигателни съоръжения'
    ],
    penalties: [
      {
        violationType: 'Експлоатация на машина без маркировка СЕ',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Глоба за използване на несертифицирано оборудване'
      },
      {
        violationType: 'Липса на периодични проверки',
        minAmount: 2000,
        maxAmount: 8000,
        currency: 'BGN',
        description: 'Санкция за неизвършване на задължителни технически прегледи'
      },
      {
        violationType: 'Отстранени предпазни устройства',
        minAmount: 4000,
        maxAmount: 15000,
        currency: 'BGN',
        description: 'Тежка глоба за работа с демонтирани предпазители'
      },
      {
        violationType: 'Липса на обучение за машините',
        minAmount: 2500,
        maxAmount: 9000,
        currency: 'BGN',
        description: 'Санкция за допускане до работа без специализирано обучение'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-3-2004', 'bg-naredba-2-2004'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135523863'
  },
  {
    id: 'bg-naredba-3-2004',
    type: 'ordinance',
    number: 'Наредба № 3',
    year: 2004,
    titleBG: 'Наредба № 3 от 2004 г. за минималните изисквания за безопасност и здраве на работното място',
    titleEN: 'Ordinance No. 3 of 2004 on Minimum Safety and Health Requirements in the Workplace',
    authority: 'Министерство на труда и социалната политика',
    effectiveDate: '2004-07-01',
    lastAmended: '2022-11-30',
    scope: ['workplace-design', 'work-environment', 'facility-requirements', 'ergonomics'],
    keyObligations: [
      'Осигуряване на достатъчна работна площ (минимум 2 кв.м. на работник)',
      'Поддържане на температура между 18-28°C в работните помещения',
      'Осигуряване на естествено и/или изкуствено осветление (минимум 200 люкса)',
      'Спазване на изискванията за вентилация и качество на въздуха',
      'Осигуряване на санитарни помещения и питейна вода',
      'Оборудване на пътища за евакуация и аварийни изходи',
      'Маркировка на опасните зони и поставяне на знаци за безопасност',
      'Осигуряване на ергономични работни места и почивки',
      'Поддържане на ред, чистота и хигиена на работното място',
      'Защита от шум, вибрации и вредни фактори на средата'
    ],
    penalties: [
      {
        violationType: 'Недостатъчна работна площ',
        minAmount: 1500,
        maxAmount: 6000,
        currency: 'BGN',
        description: 'Глоба за претоварване на работните помещения'
      },
      {
        violationType: 'Неспазване на температурен режим',
        minAmount: 1000,
        maxAmount: 4000,
        currency: 'BGN',
        description: 'Санкция за работа при неподходяща температура'
      },
      {
        violationType: 'Липса на аварийни изходи',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Тежка глоба за неосигурени евакуационни пътища'
      },
      {
        violationType: 'Недостатъчно осветление',
        minAmount: 1200,
        maxAmount: 5000,
        currency: 'BGN',
        description: 'Санкция за работа при слабо осветление под норма'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-5-2005', 'bg-naredba-13-2003'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135512455'
  },
  {
    id: 'bg-naredba-7-1999',
    type: 'ordinance',
    number: 'Наредба № 7',
    year: 1999,
    titleBG: 'Наредба № 7 от 1999 г. за минималните изисквания за безопасност и здраве при използване на работното оборудване',
    titleEN: 'Ordinance No. 7 of 1999 on Minimum Safety and Health Requirements for Use of Work Equipment',
    authority: 'Министерство на труда и социалната политика',
    effectiveDate: '1999-10-01',
    lastAmended: '2021-08-20',
    scope: ['work-equipment', 'tools-safety', 'maintenance', 'operator-training'],
    keyObligations: [
      'Избор на подходящо оборудване спрямо специфичните условия на работа',
      'Провеждане на първоначална проверка преди пускане в експлоатация',
      'Осигуряване на периодични проверки на оборудването',
      'Поддържане на техническа документация и журнали за експлоатация',
      'Обучение и инструктаж на работниците за ползване на оборудването',
      'Забрана за работа с повредено или неизправно оборудване',
      'Осигуряване на инструкции за безопасна работа',
      'Маркировка на опасните части на оборудването',
      'Осигуряване на средства за блокиране на енергийни източници',
      'Извършване на ремонти само от квалифициран персонал'
    ],
    penalties: [
      {
        violationType: 'Експлоатация на неизправно оборудване',
        minAmount: 2500,
        maxAmount: 10000,
        currency: 'BGN',
        description: 'Глоба за допускане до работа с повредено оборудване'
      },
      {
        violationType: 'Липса на периодични проверки',
        minAmount: 2000,
        maxAmount: 7000,
        currency: 'BGN',
        description: 'Санкция за неизпълнение на задължителните проверки'
      },
      {
        violationType: 'Работа без обучение',
        minAmount: 1800,
        maxAmount: 6000,
        currency: 'BGN',
        description: 'Глоба за допускане до оборудване без инструктаж'
      },
      {
        violationType: 'Липса на технически документи',
        minAmount: 1500,
        maxAmount: 5000,
        currency: 'BGN',
        description: 'Санкция за неводене на експлоатационна документация'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-5-2005'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2134827008'
  },
  {
    id: 'bg-naredba-13-2003',
    type: 'ordinance',
    number: 'Наредба № 13',
    year: 2003,
    titleBG: 'Наредба № 13 от 2003 г. за защита на работещите от рискове, свързани с експозиция на химични агенти при работа',
    titleEN: 'Ordinance No. 13 of 2003 on Protection of Workers from Risks Related to Exposure to Chemical Agents at Work',
    authority: 'Министерство на здравеопазването',
    effectiveDate: '2003-12-01',
    lastAmended: '2023-03-15',
    scope: ['chemical-safety', 'hazardous-substances', 'exposure-limits', 'personal-protection'],
    keyObligations: [
      'Оценка на риска при работа с химични вещества и смеси',
      'Водене на регистър на използваните химични агенти',
      'Осигуряване на информационни листове за безопасност (SDS) на български',
      'Спазване на пределно допустими концентрации (ПДК) във въздуха',
      'Осигуряване на подходящи лични предпазни средства',
      'Провеждане на медицински прегледи при работа с канцерогени',
      'Етикетиране и маркировка на опасни химични вещества',
      'Осигуряване на аварийни душове и очни промивки',
      'Обучение на работниците за безопасна работа с химикали',
      'Мониторинг на въздушната среда в работните помещения'
    ],
    penalties: [
      {
        violationType: 'Работа без оценка на химичен риск',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Тежка глоба за липса на оценка при работа с химични агенти'
      },
      {
        violationType: 'Липса на информационни листове',
        minAmount: 2000,
        maxAmount: 8000,
        currency: 'BGN',
        description: 'Санкция за отсъствие на SDS на работното място'
      },
      {
        violationType: 'Превишаване на ПДК',
        minAmount: 4000,
        maxAmount: 15000,
        currency: 'BGN',
        description: 'Тежка санкция за експозиция над допустимите норми'
      },
      {
        violationType: 'Неетикетирани химични вещества',
        minAmount: 1500,
        maxAmount: 6000,
        currency: 'BGN',
        description: 'Глоба за липса на етикети и маркировка'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-14-2003', 'bg-naredba-5-2009'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135502596'
  },
  {
    id: 'bg-naredba-14-2003',
    type: 'ordinance',
    number: 'Наредба № 14',
    year: 2003,
    titleBG: 'Наредба № 14 от 2003 г. за защита на работещите от рискове, свързани с експозиция на канцерогени и мутагени при работа',
    titleEN: 'Ordinance No. 14 of 2003 on Protection of Workers from Risks Related to Exposure to Carcinogens and Mutagens at Work',
    authority: 'Министерство на здравеопазването',
    effectiveDate: '2003-12-01',
    lastAmended: '2022-09-10',
    scope: ['carcinogens', 'mutagens', 'occupational-cancer', 'health-surveillance'],
    keyObligations: [
      'Специална оценка на риска при работа с канцерогени и мутагени',
      'Водене на регистър на работниците, експонирани на канцерогени',
      'Организиране на задължителни медицински прегледи преди и след експозиция',
      'Замяна на канцерогенни вещества с по-малко опасни, където е възможно',
      'Ограничаване на броя работници с достъп до канцерогени',
      'Осигуряване на затворени системи за работа с канцерогени',
      'Поддържане на медицинско досие за всеки експониран работник',
      'Мониторинг на въздушната среда и биологичен контрол',
      'Спазване на строги правила за лична хигиена',
      'Съхраняване на медицински данни минимум 40 години след прекратяване'
    ],
    penalties: [
      {
        violationType: 'Работа с канцерогени без оценка',
        minAmount: 5000,
        maxAmount: 20000,
        currency: 'BGN',
        description: 'Много тежка глоба за липса на специална оценка на риска'
      },
      {
        violationType: 'Липса на регистър на експонираните',
        minAmount: 4000,
        maxAmount: 15000,
        currency: 'BGN',
        description: 'Тежка санкция за неводене на регистър на работниците'
      },
      {
        violationType: 'Непровеждане на медицински прегледи',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Глоба за липса на задължителен здравен мониторинг'
      },
      {
        violationType: 'Несъхраняване на медицински досиета',
        minAmount: 3500,
        maxAmount: 14000,
        currency: 'BGN',
        description: 'Санкция за неспазване на 40-годишния срок за съхранение'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-13-2003'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135502597'
  },
  {
    id: 'bg-naredba-5-2009',
    type: 'ordinance',
    number: 'Наредба № 5',
    year: 2009,
    titleBG: 'Наредба № 5 от 2009 г. за реда и начина за провеждане на задължителните предварителни и периодични медицински прегледи',
    titleEN: 'Ordinance No. 5 of 2009 on Mandatory Pre-Employment and Periodic Medical Examinations',
    authority: 'Министерство на здравеопазването',
    effectiveDate: '2009-05-01',
    lastAmended: '2024-01-15',
    scope: ['medical-examinations', 'health-surveillance', 'occupational-health'],
    keyObligations: [
      'Провеждане на предварителен медицински преглед преди постъпване на работа',
      'Организиране на периодични медицински прегледи според изложените рискове',
      'Периодичност на прегледите: годишно, 2 години или 3 години според факторите',
      'Медицински преглед за работници под 18 години – задължително годишен',
      'Издаване на медицинско свидетелство за годност за работа',
      'Водене на здравно-профилактични карти за всеки работник',
      'Недопускане до работа без валиден медицински преглед',
      'Провеждане на извънреден преглед при промяна на условията на труд',
      'Сътрудничество с професионална здравна служба или лекар по трудова медицина',
      'Съхраняване на медицински документи съгласно законовите срокове'
    ],
    penalties: [
      {
        violationType: 'Работа без медицински преглед',
        minAmount: 2500,
        maxAmount: 10000,
        currency: 'BGN',
        description: 'Глоба за допускане на работник без валидно медицинско свидетелство'
      },
      {
        violationType: 'Непровеждане на периодични прегледи',
        minAmount: 2000,
        maxAmount: 8000,
        currency: 'BGN',
        description: 'Санкция за неизпълнение на задължителната периодичност'
      },
      {
        violationType: 'Липса на здравни карти',
        minAmount: 1500,
        maxAmount: 6000,
        currency: 'BGN',
        description: 'Глоба за неводене на здравно-профилактични карти'
      },
      {
        violationType: 'Допускане на негоден работник',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Тежка санкция за допускане до работа на негоден по здраве'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-kt-2024', 'bg-naredba-13-2003'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135639575'
  },
  {
    id: 'bg-naredba-2-2004',
    type: 'ordinance',
    number: 'Наредба № 2',
    year: 2004,
    titleBG: 'Наредба № 2 от 2004 г. за минималните изисквания за здравословни и безопасни условия на труд при работа на работното място с видеодисплей',
    titleEN: 'Ordinance No. 2 of 2004 on Minimum Safety and Health Requirements for Work with Display Screen Equipment',
    authority: 'Министерство на труда и социалната политика',
    effectiveDate: '2004-05-01',
    lastAmended: '2021-12-10',
    scope: ['office-work', 'computer-work', 'ergonomics', 'vdt-work'],
    keyObligations: [
      'Оценка на работните места с видеодисплей (компютри)',
      'Осигуряване на ергономични столове с регулируема височина',
      'Поддържане на достатъчно разстояние между екрана и очите (50-70 см)',
      'Спазване на изискванията за осветление без отблясъци на екрана',
      'Осигуряване на почивки при продължителна работа (10 мин на час)',
      'Провеждане на специализирани медицински прегледи за зрение',
      'Регулируемост на яркостта и контраста на дисплеите',
      'Осигуряване на достатъчна работна площ върху бюрото',
      'Информиране на работниците за ергономични принципи',
      'Проверка на микроклимата и вентилацията в офисите'
    ],
    penalties: [
      {
        violationType: 'Липса на ергономични условия',
        minAmount: 1000,
        maxAmount: 4000,
        currency: 'BGN',
        description: 'Глоба за неспазване на ергономичните изисквания'
      },
      {
        violationType: 'Неосигуряване на почивки',
        minAmount: 1200,
        maxAmount: 5000,
        currency: 'BGN',
        description: 'Санкция за работа без задължителни почивки'
      },
      {
        violationType: 'Липса на оценка на работните места',
        minAmount: 1500,
        maxAmount: 6000,
        currency: 'BGN',
        description: 'Глоба за неизвършена оценка на VDT работни места'
      },
      {
        violationType: 'Непровеждане на медицински преглед за зрение',
        minAmount: 1800,
        maxAmount: 7000,
        currency: 'BGN',
        description: 'Санкция за липса на офталмологичен преглед'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-3-2004'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135512454'
  },
  {
    id: 'bg-naredba-6-2005',
    type: 'ordinance',
    number: 'Наредба № 6',
    year: 2005,
    titleBG: 'Наредба № 6 от 2005 г. за минималните изисквания за осигуряване на здравето и безопасността на работниците при рискове, свързани с експозиция на електромагнитни полета',
    titleEN: 'Ordinance No. 6 of 2005 on Minimum Requirements for Protection of Workers from Electromagnetic Fields',
    authority: 'Министерство на здравеопазването',
    effectiveDate: '2005-10-01',
    lastAmended: '2022-07-20',
    scope: ['electromagnetic-fields', 'radiation-protection', 'exposure-limits'],
    keyObligations: [
      'Оценка на експозицията на електромагнитни полета (EMF)',
      'Спазване на референтни нива на експозиция според честотата',
      'Измерване на нивата на EMF с калибрирани уреди',
      'Ограничаване на времето на експозиция при високи нива',
      'Информиране на работниците за рисковете от EMF',
      'Осигуряване на защитно облекло при необходимост',
      'Маркировка на зони с високо ниво на електромагнитни полета',
      'Провеждане на медицински прегледи на експонираните работници',
      'Въвеждане на технически мерки за намаляване на експозицията',
      'Водене на документация за измервания и експозиции'
    ],
    penalties: [
      {
        violationType: 'Липса на оценка на EMF',
        minAmount: 2000,
        maxAmount: 8000,
        currency: 'BGN',
        description: 'Глоба за неизвършена оценка на електромагнитни полета'
      },
      {
        violationType: 'Превишаване на референтни нива',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Тежка санкция за експозиция над допустимите норми'
      },
      {
        violationType: 'Липса на измервания',
        minAmount: 1800,
        maxAmount: 7000,
        currency: 'BGN',
        description: 'Глоба за неизмерване на нивата на EMF'
      },
      {
        violationType: 'Немаркирани опасни зони',
        minAmount: 1500,
        maxAmount: 6000,
        currency: 'BGN',
        description: 'Санкция за липса на знаци в зони с високо EMF'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-13-2003'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135523864'
  },
  {
    id: 'bg-naredba-6-2006',
    type: 'ordinance',
    number: 'Наредба № 6',
    year: 2006,
    titleBG: 'Наредба № 6 от 2006 г. за безопасността и здравето при работа в строителството',
    titleEN: 'Ordinance No. 6 of 2006 on Safety and Health in Construction',
    authority: 'Министерство на регионалното развитие и благоустройството',
    effectiveDate: '2006-08-01',
    lastAmended: '2023-11-05',
    scope: ['construction-safety', 'building-sites', 'temporary-works', 'fall-protection'],
    keyObligations: [
      'Назначаване на координатор по безопасност и здраве (КБЗ) на строителната площадка',
      'Изготвяне на план за безопасност и здраве (ПБЗ) преди започване',
      'Осигуряване на колективна защита срещу падане от височина',
      'Използване на скелета и работни платформи с необходимите разрешителни',
      'Ограждане на строителната площадка и осигуряване на контролиран достъп',
      'Провеждане на ежедневен инструктаж за безопасност',
      'Осигуряване на лични предпазни средства (каски, обувки, колани)',
      'Водене на дневник на строителната площадка',
      'Спазване на правилата за работа с електрически инсталации',
      'Уведомяване на инспекцията при строителни обекти над 30 работни дни'
    ],
    penalties: [
      {
        violationType: 'Липса на координатор по БЗ',
        minAmount: 5000,
        maxAmount: 20000,
        currency: 'BGN',
        description: 'Много тежка глоба за строителство без назначен КБЗ'
      },
      {
        violationType: 'Работа без план за БЗ',
        minAmount: 4000,
        maxAmount: 15000,
        currency: 'BGN',
        description: 'Тежка санкция за липса на план за безопасност'
      },
      {
        violationType: 'Липса на защита срещу падане',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Глоба за работа на височина без предпазни средства'
      },
      {
        violationType: 'Неограден строителен обект',
        minAmount: 2000,
        maxAmount: 8000,
        currency: 'BGN',
        description: 'Санкция за неосигурен контрол на достъпа'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-zur-2001', 'bg-naredba-3-2004'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135537664'
  },
  {
    id: 'bg-naredba-8-2005',
    type: 'ordinance',
    number: 'Наредба № 8',
    year: 2005,
    titleBG: 'Наредба № 8 от 2005 г. за минималните изисквания за осигуряване на здравето и безопасността на работещите при рискове, свързани с експозиция на шум',
    titleEN: 'Ordinance No. 8 of 2005 on Minimum Requirements for Protection of Workers from Noise',
    authority: 'Министерство на здравеопазването',
    effectiveDate: '2005-11-01',
    lastAmended: '2021-10-15',
    scope: ['noise-exposure', 'hearing-protection', 'acoustic-measurements'],
    keyObligations: [
      'Измерване на нивата на шум на работните места',
      'Спазване на пределно допустими нива: 85 dB(A) за 8-часов работен ден',
      'Осигуряване на антифони при ниво на шум над 80 dB(A)',
      'Задължително носене на антифони над 85 dB(A)',
      'Маркировка на зони с високо ниво на шум',
      'Провеждане на аудиометрични изследвания на експонираните работници',
      'Въвеждане на технически мерки за намаляване на шума',
      'Ротация на работниците при високо ниво на експозиция',
      'Обучение на работниците за рисковете от шум',
      'Водене на регистър на измерванията и медицинските прегледи'
    ],
    penalties: [
      {
        violationType: 'Липса на измервания на шума',
        minAmount: 2000,
        maxAmount: 8000,
        currency: 'BGN',
        description: 'Глоба за неизмерени нива на шум на работното място'
      },
      {
        violationType: 'Превишаване на ПДН за шум',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Тежка санкция за експозиция над 85 dB(A)'
      },
      {
        violationType: 'Неосигуряване на антифони',
        minAmount: 2500,
        maxAmount: 9000,
        currency: 'BGN',
        description: 'Глоба за липса на предпазни средства за слух'
      },
      {
        violationType: 'Липса на аудиометрични прегледи',
        minAmount: 2000,
        maxAmount: 7000,
        currency: 'BGN',
        description: 'Санкция за непровеждане на слухови изследвания'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-13-2003', 'bg-naredba-5-2009'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135530496'
  },
  {
    id: 'bg-zur-2001',
    type: 'law',
    number: 'Закон за устройство на територията',
    year: 2001,
    titleBG: 'Закон за устройство на територията (ЗУТ)',
    titleEN: 'Spatial Planning Act',
    authority: 'Народно събрание',
    effectiveDate: '2001-04-01',
    lastAmended: '2024-11-20',
    scope: ['construction-permits', 'building-regulations', 'construction-supervision'],
    keyObligations: [
      'Спазване на изискванията за сигурност на конструкциите (чл. 169)',
      'Назначаване на строителен надзор при строежи І и ІІ категория',
      'Извършване на окончателна проверка преди въвеждане в експлоатация',
      'Осигуряване на технически надзор от правоспособни лица',
      'Спазване на одобрения инвестиционен проект',
      'Уведомяване на общината при започване на строителство',
      'Провеждане на мерки за безопасност при строителните работи',
      'Съхраняване на строителна документация на обекта',
      'Извършване на периодични прегледи на завършени строежи',
      'Спазване на правилата за разрушаване на строежи'
    ],
    penalties: [
      {
        violationType: 'Строителство без надзор',
        minAmount: 5000,
        maxAmount: 20000,
        currency: 'BGN',
        description: 'Много тежка глоба за строеж без назначен строителен надзор'
      },
      {
        violationType: 'Неспазване на проекта',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Санкция за отклонение от одобрения проект'
      },
      {
        violationType: 'Липса на технически надзор',
        minAmount: 4000,
        maxAmount: 15000,
        currency: 'BGN',
        description: 'Тежка глоба за строеж без технически надзор'
      },
      {
        violationType: 'Въвеждане без окончателна проверка',
        minAmount: 6000,
        maxAmount: 25000,
        currency: 'BGN',
        description: 'Много тежка санкция за експлоатация без разрешение'
      }
    ],
    relatedActs: ['bg-naredba-6-2006', 'bg-zbut-1997'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2134455296'
  },
  {
    id: 'bg-zpb-1997',
    type: 'law',
    number: 'Закон за пожарна безопасност и защита на населението',
    year: 1997,
    titleBG: 'Закон за пожарна безопасност и защита на населението при бедствия (ЗПБЗНБ)',
    titleEN: 'Fire Safety and Civil Protection Act',
    authority: 'Народно събрание',
    effectiveDate: '1997-12-01',
    lastAmended: '2023-08-30',
    scope: ['fire-safety', 'fire-prevention', 'emergency-preparedness', 'evacuation'],
    keyObligations: [
      'Изготвяне на план за пожарна безопасност на обекта',
      'Назначаване на служител по пожарна безопасност',
      'Осигуряване на пожарогасители и противопожарно оборудване',
      'Провеждане на периодични пожарни тренировки (минимум годишно)',
      'Поддържане на евакуационни пътища свободни и маркирани',
      'Извършване на периодични проверки на пожарните уредби',
      'Обучение на работниците за пожарна безопасност',
      'Спазване на изискванията за съхранение на запалими материали',
      'Осигуряване на аварийно осветление и пожароизвестяване',
      'Уведомяване на пожарната служба при инциденти'
    ],
    penalties: [
      {
        violationType: 'Липса на пожарогасители',
        minAmount: 2000,
        maxAmount: 8000,
        currency: 'BGN',
        description: 'Глоба за неосигурени или изтекли пожарогасители'
      },
      {
        violationType: 'Препречени евакуационни пътища',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Тежка санкция за блокирани пътища за евакуация'
      },
      {
        violationType: 'Липса на пожарни тренировки',
        minAmount: 1500,
        maxAmount: 6000,
        currency: 'BGN',
        description: 'Глоба за непровеждане на задължителни учения'
      },
      {
        violationType: 'Липса на служител по ПБ',
        minAmount: 2500,
        maxAmount: 10000,
        currency: 'BGN',
        description: 'Санкция за неназначен отговорник по пожарна безопасност'
      }
    ],
    relatedActs: ['bg-zbut-1997', 'bg-naredba-3-2004', 'bg-naredba-6-2006'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2134408704'
  },
  {
    id: 'bg-naredba-15-2006',
    type: 'ordinance',
    number: 'Наредба № 15',
    year: 2006,
    titleBG: 'Наредба № 15 от 2006 г. за техническите изисквания към строежите за осигуряване на безопасност при пожар',
    titleEN: 'Ordinance No. 15 of 2006 on Technical Requirements for Fire Safety in Buildings',
    authority: 'Министерство на регионалното развитие и благоустройството',
    effectiveDate: '2006-10-01',
    lastAmended: '2022-05-25',
    scope: ['building-fire-safety', 'fire-resistance', 'fire-compartmentation', 'evacuation-design'],
    keyObligations: [
      'Проектиране на сгради със съответна огнеустойчивост на конструкциите',
      'Осигуряване на минимум два евакуационни пътя от всяко ниво',
      'Спазване на изискванията за противопожарни разстояния между сгради',
      'Разделяне на сградата на пожарни сектори съгласно нормите',
      'Осигуряване на системи за пожароизвестяване и оповестяване',
      'Проектиране на противопожарни врати и клапи',
      'Монтаж на аварийно осветление по евакуационните маршрути',
      'Извършване на изчисления на пожарния риск при необходимост',
      'Спазване на максималната дължина на евакуационен път (макс. 40 м)',
      'Осигуряване на достъп за пожарни автомобили до сградата'
    ],
    penalties: [
      {
        violationType: 'Неспазване на евакуационни изисквания',
        minAmount: 4000,
        maxAmount: 15000,
        currency: 'BGN',
        description: 'Тежка глоба за евакуационни пътища под изискванията'
      },
      {
        violationType: 'Липса на пожароизвестяване',
        minAmount: 3000,
        maxAmount: 12000,
        currency: 'BGN',
        description: 'Санкция за сгради без система за пожароизвестяване'
      },
      {
        violationType: 'Недостатъчна огнеустойчивост',
        minAmount: 5000,
        maxAmount: 20000,
        currency: 'BGN',
        description: 'Много тежка глоба за конструкции под изискуемата огнеустойчивост'
      },
      {
        violationType: 'Липса на аварийно осветление',
        minAmount: 2000,
        maxAmount: 8000,
        currency: 'BGN',
        description: 'Глоба за отсъствие на аварийно осветление'
      }
    ],
    relatedActs: ['bg-zpb-1997', 'bg-zur-2001', 'bg-naredba-6-2006'],
    officialUrl: 'https://www.lex.bg/laws/ldoc/2135548928'
  }
];

/**
 * Helper function to get acts by type
 */
export function getActsByType(type: LegislativeAct['type']): LegislativeAct[] {
  return LEGISLATIE_BG_SSM.filter(act => act.type === type);
}

/**
 * Helper function to get acts by year range
 */
export function getActsByYearRange(startYear: number, endYear: number): LegislativeAct[] {
  return LEGISLATIE_BG_SSM.filter(act => act.year >= startYear && act.year <= endYear);
}

/**
 * Helper function to get acts by scope
 */
export function getActsByScope(scope: string): LegislativeAct[] {
  return LEGISLATIE_BG_SSM.filter(act => act.scope.includes(scope));
}

/**
 * Helper function to search acts by keyword (in titles or obligations)
 */
export function searchActs(keyword: string): LegislativeAct[] {
  const lowercaseKeyword = keyword.toLowerCase();
  return LEGISLATIE_BG_SSM.filter(act =>
    act.titleBG.toLowerCase().includes(lowercaseKeyword) ||
    act.titleEN.toLowerCase().includes(lowercaseKeyword) ||
    act.keyObligations.some(obligation => obligation.toLowerCase().includes(lowercaseKeyword))
  );
}

/**
 * Helper function to get act by ID
 */
export function getActById(id: string): LegislativeAct | undefined {
  return LEGISLATIE_BG_SSM.find(act => act.id === id);
}

/**
 * Summary statistics
 */
export const BG_SSM_STATS = {
  totalActs: LEGISLATIE_BG_SSM.length,
  laws: LEGISLATIE_BG_SSM.filter(a => a.type === 'law').length,
  ordinances: LEGISLATIE_BG_SSM.filter(a => a.type === 'ordinance').length,
  regulations: LEGISLATIE_BG_SSM.filter(a => a.type === 'regulation').length,
  decrees: LEGISLATIE_BG_SSM.filter(a => a.type === 'decree').length,
  totalPenalties: LEGISLATIE_BG_SSM.reduce((sum, act) => sum + act.penalties.length, 0),
  totalObligations: LEGISLATIE_BG_SSM.reduce((sum, act) => sum + act.keyObligations.length, 0)
};
