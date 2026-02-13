/**
 * Legislative acts database for Hungary (HU)
 * SSM (Occupational Safety and Health) regulations
 */

export interface LegislativeActHU {
  id: string;
  type: 'law' | 'decree' | 'regulation';
  number: string;
  year: number;
  titleHU: string;
  titleEN: string;
  keyObligations: string[];
  penalties: {
    min: number;
    max: number;
    currency: 'HUF';
    description: string;
  };
}

export const legislatieHU: LegislativeActHU[] = [
  {
    id: 'hu-munkavedelmi-torveny',
    type: 'law',
    number: '1993. évi XCIII. törvény',
    year: 1993,
    titleHU: 'A munkavédelemről',
    titleEN: 'Act on Occupational Safety and Health',
    keyObligations: [
      'Munkavédelmi szabályzat kidolgozása és munkavállalók tájékoztatása',
      'Kockázatértékelés elvégzése minden munkahelyen',
      'Munkavédelmi oktatás biztosítása (belépéskor és évente)',
      'Munkavédelmi képviselő választásának biztosítása (50+ fő)',
      'Munkahelyi balesetek kivizsgálása és jelentése'
    ],
    penalties: {
      min: 50000,
      max: 2000000,
      currency: 'HUF',
      description: 'Munkavédelmi szabályok megsértése esetén'
    }
  },
  {
    id: 'hu-munkavedelmi-rendelet',
    type: 'decree',
    number: '5/1993. (XII. 26.) MüM rendelet',
    year: 1993,
    titleHU: 'A munkavédelmi szabályzat minimális tartalmi követelményeiről',
    titleEN: 'Decree on Minimum Content Requirements for OSH Regulations',
    keyObligations: [
      'Munkavédelmi szabályzat készítése írásban',
      'Munkavállalók jogai és kötelezettségei egyértelmű meghatározása',
      'Veszélyes munkahelyek és tevékenységek azonosítása',
      'Munkavédelmi eszközök használatának szabályozása',
      'Szabályzat évenkénti felülvizsgálata'
    ],
    penalties: {
      min: 30000,
      max: 500000,
      currency: 'HUF',
      description: 'Hiányos vagy elavult munkavédelmi szabályzat'
    }
  },
  {
    id: 'hu-kockazatertekeles',
    type: 'decree',
    number: '3/2002. (II. 8.) SzCsM–EüM rendelet',
    year: 2002,
    titleHU: 'A munkahelyek munkavédelmi követelményeinek minimális szintjéről',
    titleEN: 'Decree on Minimum OSH Requirements for Workplaces',
    keyObligations: [
      'Kockázatértékelés elvégzése minden munkahelyen',
      'Munkahelyek megfelelő megvilágítása és szellőztetése',
      'Vészhelyzeti menekülési útvonalak kijelölése',
      'Elsősegély felszerelés és képzett elsősegélynyújtók biztosítása',
      'Tűzvédelmi eszközök rendszeres karbantartása'
    ],
    penalties: {
      min: 100000,
      max: 1500000,
      currency: 'HUF',
      description: 'Munkahelyi biztonsági követelmények be nem tartása'
    }
  },
  {
    id: 'hu-munkaruha-rendelet',
    type: 'decree',
    number: '9/2022. (VII. 7.) ITM rendelet',
    year: 2022,
    titleHU: 'Az egyéni védőeszközök követelményeiről és megfelelőségének tanúsításáról',
    titleEN: 'Decree on Requirements for Personal Protective Equipment',
    keyObligations: [
      'Megfelelő egyéni védőeszközök (EVE) biztosítása ingyen',
      'EVE használatának betanítása és ellenőrzése',
      'EVE karbantartása és cseréje szükség szerint',
      'EVE tárolásának megfelelő feltételei',
      'Munkavállalók EVE használatának dokumentálása'
    ],
    penalties: {
      min: 50000,
      max: 800000,
      currency: 'HUF',
      description: 'EVE biztosításának vagy használatának elmulasztása'
    }
  },
  {
    id: 'hu-munkaalkalmassag',
    type: 'decree',
    number: '33/1998. (VI. 24.) NM rendelet',
    year: 1998,
    titleHU: 'A munkaköri, szakmai, illetve személyi higiénés alkalmasság orvosi vizsgálatáról és véleményezéséről',
    titleEN: 'Decree on Medical Examinations for Work Fitness',
    keyObligations: [
      'Munkába állás előtti orvosi vizsgálat kötelező',
      'Időszakos orvosi vizsgálatok szervezése (évente vagy kétévente)',
      'Veszélyes munkaköröknél rendszeres egészségügyi felügyelet',
      'Orvosi alkalmassági vélemény dokumentálása',
      'Foglalkozási megbetegedések jelentése'
    ],
    penalties: {
      min: 100000,
      max: 1000000,
      currency: 'HUF',
      description: 'Orvosi vizsgálatok elmulasztása'
    }
  },
  {
    id: 'hu-munkaidő-rendelet',
    type: 'decree',
    number: '60/1999. (XII. 1.) EüM rendelet',
    year: 1999,
    titleHU: 'A képernyő előtti munkavégzés minimális egészségügyi és biztonsági követelményeiről',
    titleEN: 'Decree on Minimum Health and Safety Requirements for Display Screen Work',
    keyObligations: [
      'Ergonómikus munkaállomások kialakítása',
      'Rendszeres szünetek biztosítása (óránként 10 perc)',
      'Szemvizsgálat felajánlása képernyő előtt dolgozóknak',
      'Képernyők és világítás megfelelő beállítása',
      'Munkaállomások kockázatértékelése'
    ],
    penalties: {
      min: 30000,
      max: 500000,
      currency: 'HUF',
      description: 'Ergonómiai követelmények be nem tartása'
    }
  },
  {
    id: 'hu-veszelyes-anyagok',
    type: 'decree',
    number: '25/2000. (IX. 30.) EüM–SzCsM együttes rendelet',
    year: 2000,
    titleHU: 'A veszélyes anyagokkal és a veszélyes készítményekkel kapcsolatos egyes eljárások, illetve tevékenységek részletes szabályairól',
    titleEN: 'Decree on Procedures for Hazardous Substances and Preparations',
    keyObligations: [
      'Veszélyes anyagok nyilvántartása és címkézése',
      'Biztonsági adatlapok (SDS) elérhetővé tétele',
      'Veszélyes anyagokkal történő munkavégzés speciális oktatása',
      'Tárolási feltételek biztosítása',
      'Vegyi balesetek esetén szükséges intézkedések megtervezése'
    ],
    penalties: {
      min: 200000,
      max: 3000000,
      currency: 'HUF',
      description: 'Veszélyes anyagokkal kapcsolatos előírások megsértése'
    }
  },
  {
    id: 'hu-zajvedelem',
    type: 'decree',
    number: '66/2005. (VII. 26.) EüM rendelet',
    year: 2005,
    titleHU: 'A munkahelyi kémiai kóroki tényezők elleni védekezés szabályairól',
    titleEN: 'Decree on Protection Against Chemical Agents at Work',
    keyObligations: [
      'Kémiai kockázatértékelés elvégzése',
      'Expozíciós határértékek betartása',
      'Munkavállalók tájékoztatása a kémiai veszélyekről',
      'Levegőminőség mérése veszélyes környezetben',
      'Egészségügyi felügyelet veszélyes kémiai anyagokkal dolgozóknál'
    ],
    penalties: {
      min: 150000,
      max: 2000000,
      currency: 'HUF',
      description: 'Kémiai védelmi előírások megsértése'
    }
  },
  {
    id: 'hu-magasban-vegzett-munka',
    type: 'decree',
    number: '4/2002. (II. 20.) SzCsM–EüM rendelet',
    year: 2002,
    titleHU: 'Az építési munkahelyeken és az építési folyamatok során megvalósítandó minimális munkavédelmi követelményekről',
    titleEN: 'Decree on Minimum OSH Requirements at Construction Sites',
    keyObligations: [
      'Biztonsági terv készítése építési munkákhoz',
      'Magasban végzett munka védelme (állványok, korlátok)',
      'Munkagödrök és árkok biztosítása',
      'Építőipari gépek üzembe helyezés előtti ellenőrzése',
      'Munkavédelmi koordinátor kijelölése nagyobb építkezéseknél'
    ],
    penalties: {
      min: 200000,
      max: 5000000,
      currency: 'HUF',
      description: 'Építőipari munkavédelmi szabályok megsértése'
    }
  },
  {
    id: 'hu-tuzvedelem',
    type: 'decree',
    number: '30/1996. (XII. 6.) BM rendelet',
    year: 1996,
    titleHU: 'A tűzvédelmi szabályzat készítéséről',
    titleEN: 'Decree on Fire Protection Regulations',
    keyObligations: [
      'Tűzvédelmi szabályzat kidolgozása',
      'Tűzvédelmi oktatás évente minimum egyszer',
      'Tűzoltó készülékek elhelyezése és karbantartása',
      'Menekülési útvonalak kijelölése és szabadon tartása',
      'Évenkénti tűzvédelmi gyakorlat szervezése'
    ],
    penalties: {
      min: 100000,
      max: 2000000,
      currency: 'HUF',
      description: 'Tűzvédelmi szabályok megsértése'
    }
  },
  {
    id: 'hu-munkavedelmi-szakerto',
    type: 'decree',
    number: '21/2020. (XII. 21.) ITM rendelet',
    year: 2020,
    titleHU: 'A munkavédelmi szakértői tevékenység gyakorlásának feltételeiről',
    titleEN: 'Decree on Conditions for OSH Expert Activities',
    keyObligations: [
      'Munkavédelmi szakértő alkalmazása vagy megbízása',
      'Szakértői tevékenység dokumentálása',
      'Éves munkavédelmi ellenőrzés elvégzése',
      'Munkavédelmi fejlesztések javaslása',
      'Hatósági ellenőrzéseknél közreműködés'
    ],
    penalties: {
      min: 100000,
      max: 1500000,
      currency: 'HUF',
      description: 'Munkavédelmi szakértő hiánya vagy szakszerűtlen tevékenység'
    }
  },
  {
    id: 'hu-munkabaleset-jelentes',
    type: 'decree',
    number: '462/2015. (XII. 30.) Korm. rendelet',
    year: 2015,
    titleHU: 'A munkavédelmi hatóság kijelöléséről és a munkavédelmi bírság felhasználásának szabályairól',
    titleEN: 'Decree on OSH Authority Designation and Fine Usage',
    keyObligations: [
      'Munkahelyi balesetek azonnali jelentése (súlyos esetekben)',
      'Baleseti nyilvántartás vezetése',
      'Balesetek kivizsgálása 8 napon belül',
      'Megelőző intézkedések bevezetése',
      'Statisztikai jelentések benyújtása évente'
    ],
    penalties: {
      min: 200000,
      max: 3000000,
      currency: 'HUF',
      description: 'Balesetek jelentésének elmulasztása vagy hibás kivizsgálás'
    }
  },
  {
    id: 'hu-gepes-munka',
    type: 'decree',
    number: '16/2008. (VIII. 30.) NFGM rendelet',
    year: 2008,
    titleHU: 'A munkaeszközök és használatuk biztonsági és egészségügyi követelményeinek minimális szintjéről',
    titleEN: 'Decree on Minimum Safety Requirements for Work Equipment',
    keyObligations: [
      'Munkaeszközök megfelelőségi ellenőrzése',
      'Időszakos felülvizsgálatok elvégzése',
      'Kezelői engedélyek ellenőrzése (emelőgépek, targoncák)',
      'Gépek karbantartási naplójának vezetése',
      'Veszélyes gépek csak betanított kezelőkkel üzemeltethetők'
    ],
    penalties: {
      min: 150000,
      max: 2500000,
      currency: 'HUF',
      description: 'Munkaeszközök biztonsági előírásainak megsértése'
    }
  },
  {
    id: 'hu-munkavedelmi-kepviselo',
    type: 'decree',
    number: '4/2020. (XII. 23.) ITM rendelet',
    year: 2020,
    titleHU: 'A munkavédelmi képviselő választásának és működésének szabályairól',
    titleEN: 'Decree on Election and Operation of OSH Representatives',
    keyObligations: [
      'Munkavédelmi képviselő választásának biztosítása (50+ fő)',
      'Képviselő részére munkaidő biztosítása feladatai ellátására',
      'Képviselő bevonása kockázatértékelésbe',
      'Képviselő képzésének és továbbképzésének biztosítása',
      'Együttműködés a munkavédelmi képviselővel'
    ],
    penalties: {
      min: 50000,
      max: 1000000,
      currency: 'HUF',
      description: 'Munkavédelmi képviselő jogainak megsértése'
    }
  },
  {
    id: 'hu-fiatalkoru-vedelem',
    type: 'decree',
    number: '6/2020. (XII. 23.) ITM rendelet',
    year: 2020,
    titleHU: 'A 18 évnél fiatalabb munkavállalók foglalkoztatásának munka- és egészségvédelmi követelményeiről',
    titleEN: 'Decree on OSH Requirements for Workers Under 18',
    keyObligations: [
      'Tilos veszélyes munkákra 18 év alatti munkavállalókat alkalmazni',
      'Fokozott orvosi felügyelet kiskorúaknál',
      'Szülői vagy gyámhatósági hozzájárulás 16 év alatt',
      'Csökkentett munkaidő és kötelező szünetek',
      'Éjszakai munka tilalma fiatalkorúaknál'
    ],
    penalties: {
      min: 200000,
      max: 3000000,
      currency: 'HUF',
      description: 'Fiatalkorúak védelmére vonatkozó szabályok megsértése'
    }
  }
];

export default legislatieHU;
