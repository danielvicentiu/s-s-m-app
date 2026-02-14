/**
 * OBLIGAȚII SSM UNGARIA (Munkavédelem)
 * Bază legală: 1993. évi XCIII. törvény a munkavédelemről, 5/1993. (XII. 26.) MüM rendelet
 *
 * Categorii:
 * - kockazatertekeles: Evaluare risc
 * - oktatas: Instruire/Formare
 * - munkakor_alkalmasagi: Aptitudine medicală
 * - egyeni_vedoeszkoz: Echipament individual de protecție
 * - munkabaleset: Accident de muncă
 */

export interface ObligatieSSMHU {
  id: string;
  denumire: string;
  descriere: string;
  categorie: 'kockazatertekeles' | 'oktatas' | 'munkakor_alkalmasagi' | 'egyeni_vedoeszkoz' | 'munkabaleset';
  periodicitate: string;
  termen_legal: string;
  baza_legala: string;
  penalty_min_huf: number;
  penalty_max_huf: number;
  responsabil: string;
}

export const obligatiiSSMHU: ObligatieSSMHU[] = [
  // === KOCKÁZATÉRTÉKELÉS (Evaluare risc) ===
  {
    id: 'hu_ssm_001',
    denumire: 'Kockázatértékelés elkészítése',
    descriere: 'Evaluarea riscurilor pentru toate locurile de muncă și activitățile din organizație',
    categorie: 'kockazatertekeles',
    periodicitate: 'La înființare și revizuire periodică',
    termen_legal: '30 zile de la începerea activității',
    baza_legala: '1993. évi XCIII. tv. 54. §',
    penalty_min_huf: 500000,
    penalty_max_huf: 2000000,
    responsabil: 'Angajator / Specialist munkavédelem'
  },
  {
    id: 'hu_ssm_002',
    denumire: 'Kockázatértékelés felülvizsgálata',
    descriere: 'Revizuirea evaluării riscurilor la modificări în procesul de muncă sau tehnologie',
    categorie: 'kockazatertekeles',
    periodicitate: 'La modificări semnificative',
    termen_legal: 'Imediat după modificare',
    baza_legala: '5/1993. MüM r. 3. §',
    penalty_min_huf: 300000,
    penalty_max_huf: 1500000,
    responsabil: 'Angajator / Specialist munkavédelem'
  },
  {
    id: 'hu_ssm_003',
    denumire: 'Munkavédelmi szabályzat készítése',
    descriere: 'Elaborarea regulamentului de securitate și sănătate în muncă (peste 50 angajați)',
    categorie: 'kockazatertekeles',
    periodicitate: 'La înființare',
    termen_legal: '60 zile de la atingerea pragului de 50 angajați',
    baza_legala: '1993. évi XCIII. tv. 54. § (4)',
    penalty_min_huf: 400000,
    penalty_max_huf: 1800000,
    responsabil: 'Angajator'
  },
  {
    id: 'hu_ssm_004',
    denumire: 'Munkavédelmi ellenőrzés végrehajtása',
    descriere: 'Efectuarea controalelor periodice de securitate și sănătate în muncă',
    categorie: 'kockazatertekeles',
    periodicitate: 'Anual',
    termen_legal: 'Minimum 1 dată/an',
    baza_legala: '5/1993. MüM r. 5. §',
    penalty_min_huf: 250000,
    penalty_max_huf: 1000000,
    responsabil: 'Specialist munkavédelem'
  },
  {
    id: 'hu_ssm_005',
    denumire: 'Munkakörnyezet mérések',
    descriere: 'Măsurători ale factorilor de mediu de muncă (zgomot, praf, substanțe chimice)',
    categorie: 'kockazatertekeles',
    periodicitate: 'Conform clasificării locului de muncă',
    termen_legal: 'Anual sau conform legislației specifice',
    baza_legala: '25/2000. (IX. 30.) EüM-SzCsM r.',
    penalty_min_huf: 300000,
    penalty_max_huf: 1200000,
    responsabil: 'Angajator / Laborator acreditat'
  },

  // === OKTATÁS (Instruire) ===
  {
    id: 'hu_ssm_006',
    denumire: 'Általános munkavédelmi oktatás',
    descriere: 'Instruire generală SSM pentru toți angajații noi',
    categorie: 'oktatas',
    periodicitate: 'La angajare',
    termen_legal: 'Înainte de începerea activității',
    baza_legala: '1993. évi XCIII. tv. 55. §',
    penalty_min_huf: 200000,
    penalty_max_huf: 800000,
    responsabil: 'Angajator / Specialist munkavédelem'
  },
  {
    id: 'hu_ssm_007',
    denumire: 'Munkakör-specifikus oktatás',
    descriere: 'Instruire SSM specifică postului de lucru',
    categorie: 'oktatas',
    periodicitate: 'La angajare și periodic',
    termen_legal: 'Înainte de începerea activității',
    baza_legala: '5/1993. MüM r. 7. §',
    penalty_min_huf: 200000,
    penalty_max_huf: 800000,
    responsabil: 'Șef direct / Specialist munkavédelem'
  },
  {
    id: 'hu_ssm_008',
    denumire: 'Ismétlő munkavédelmi oktatás',
    descriere: 'Instruire SSM periodică (reamintire)',
    categorie: 'oktatas',
    periodicitate: 'Anual sau conform clasificării',
    termen_legal: '12 luni (lucrători) / 36 luni (birouri)',
    baza_legala: '5/1993. MüM r. 8. §',
    penalty_min_huf: 150000,
    penalty_max_huf: 600000,
    responsabil: 'Specialist munkavédelem'
  },
  {
    id: 'hu_ssm_009',
    denumire: 'Rendkívüli oktatás',
    descriere: 'Instruire extraordinară după accident sau modificări majore',
    categorie: 'oktatas',
    periodicitate: 'La evenimente speciale',
    termen_legal: 'În max 3 zile lucrătoare de la eveniment',
    baza_legala: '5/1993. MüM r. 9. §',
    penalty_min_huf: 250000,
    penalty_max_huf: 1000000,
    responsabil: 'Angajator / Specialist munkavédelem'
  },
  {
    id: 'hu_ssm_010',
    denumire: 'Vezetői munkavédelmi oktatás',
    descriere: 'Instruire SSM pentru manageri și supervizori',
    categorie: 'oktatas',
    periodicitate: 'La numire și periodic',
    termen_legal: 'Înainte de preluarea funcției / 5 ani',
    baza_legala: '1993. évi XCIII. tv. 55. § (2)',
    penalty_min_huf: 300000,
    penalty_max_huf: 1200000,
    responsabil: 'Angajator / Centru de formare acreditat'
  },
  {
    id: 'hu_ssm_011',
    denumire: 'Tűzvédelmi oktatás',
    descriere: 'Instruire privind apărarea împotriva incendiilor',
    categorie: 'oktatas',
    periodicitate: 'Anual',
    termen_legal: '12 luni',
    baza_legala: '54/2014. (XII. 5.) BM rendelet',
    penalty_min_huf: 200000,
    penalty_max_huf: 800000,
    responsabil: 'Responsabil PSI / Specialist tűzvédelem'
  },

  // === MUNKAKÖR ALKALMASSÁGI (Aptitudine medicală) ===
  {
    id: 'hu_ssm_012',
    denumire: 'Előzetes orvosi vizsgálat',
    descriere: 'Control medical la angajare (pre-angajare)',
    categorie: 'munkakor_alkalmasagi',
    periodicitate: 'La angajare',
    termen_legal: 'Înainte de începerea activității',
    baza_legala: '1993. évi XCIII. tv. 58. §',
    penalty_min_huf: 300000,
    penalty_max_huf: 1200000,
    responsabil: 'Angajator / Medic de medicina muncii'
  },
  {
    id: 'hu_ssm_013',
    denumire: 'Időszakos orvosi vizsgálat',
    descriere: 'Control medical periodic',
    categorie: 'munkakor_alkalmasagi',
    periodicitate: 'Conform clasificării riscului',
    termen_legal: '12/24/36 luni conform riscului',
    baza_legala: '33/1998. (VI. 24.) NM rendelet',
    penalty_min_huf: 250000,
    penalty_max_huf: 1000000,
    responsabil: 'Angajator / Medic de medicina muncii'
  },
  {
    id: 'hu_ssm_014',
    denumire: 'Soron kívüli orvosi vizsgálat',
    descriere: 'Control medical extraordinar la cerere sau după absență lungă',
    categorie: 'munkakor_alkalmasagi',
    periodicitate: 'La necesitate',
    termen_legal: 'Înainte de reluarea activității',
    baza_legala: '33/1998. (VI. 24.) NM r. 8. §',
    penalty_min_huf: 200000,
    penalty_max_huf: 800000,
    responsabil: 'Angajator / Medic de medicina muncii'
  },
  {
    id: 'hu_ssm_015',
    denumire: 'Foglalkozási megbetegedés kivizsgálása',
    descriere: 'Investigarea suspiciunii de boală profesională',
    categorie: 'munkakor_alkalmasagi',
    periodicitate: 'La suspiciune',
    termen_legal: 'Imediat la identificare',
    baza_legala: '27/1996. (VIII. 28.) NM rendelet',
    penalty_min_huf: 400000,
    penalty_max_huf: 2000000,
    responsabil: 'Angajator / ÁNTSZ (autoritate sănătate)'
  },
  {
    id: 'hu_ssm_016',
    denumire: 'Alkohol- és drogteszt végrehajtása',
    descriere: 'Test alcool/droguri pentru posturi critice de siguranță',
    categorie: 'munkakor_alkalmasagi',
    periodicitate: 'Conform politicii interne',
    termen_legal: 'Conform nevoilor identificate',
    baza_legala: '1993. évi XCIII. tv. 62. §',
    penalty_min_huf: 150000,
    penalty_max_huf: 600000,
    responsabil: 'Angajator / Medic de medicina muncii'
  },

  // === EGYÉNI VÉDŐESZKÖZ (EIP) ===
  {
    id: 'hu_ssm_017',
    denumire: 'Egyéni védőeszközök biztosítása',
    descriere: 'Furnizarea echipamentului individual de protecție conform evaluării riscurilor',
    categorie: 'egyeni_vedoeszkoz',
    periodicitate: 'Permanent / La uzură',
    termen_legal: 'Înainte de începerea expunerii',
    baza_legala: '2/1998. (I. 16.) MüM rendelet',
    penalty_min_huf: 300000,
    penalty_max_huf: 1500000,
    responsabil: 'Angajator'
  },
  {
    id: 'hu_ssm_018',
    denumire: 'Védőeszköz-használati oktatás',
    descriere: 'Instruire privind utilizarea corectă a EIP',
    categorie: 'egyeni_vedoeszkoz',
    periodicitate: 'La distribuire',
    termen_legal: 'Înainte de utilizare',
    baza_legala: '2/1998. (I. 16.) MüM r. 4. §',
    penalty_min_huf: 200000,
    penalty_max_huf: 800000,
    responsabil: 'Angajator / Specialist munkavédelem'
  },
  {
    id: 'hu_ssm_019',
    denumire: 'Védőeszköz nyilvántartás vezetése',
    descriere: 'Evidența distribuirii și înlocuirii EIP',
    categorie: 'egyeni_vedoeszkoz',
    periodicitate: 'Permanent',
    termen_legal: 'Actualizare la fiecare distribuire',
    baza_legala: '2/1998. (I. 16.) MüM r. 6. §',
    penalty_min_huf: 150000,
    penalty_max_huf: 600000,
    responsabil: 'Angajator / Magazioner'
  },
  {
    id: 'hu_ssm_020',
    denumire: 'Légzésvédő eszközök ellenőrzése',
    descriere: 'Verificarea și întreținerea echipamentelor de protecție respiratorie',
    categorie: 'egyeni_vedoeszkoz',
    periodicitate: 'Conform instrucțiunilor producătorului',
    termen_legal: 'Înainte de fiecare utilizare + periodic',
    baza_legala: '2/1998. (I. 16.) MüM r. 7. §',
    penalty_min_huf: 250000,
    penalty_max_huf: 1000000,
    responsabil: 'Utilizator / Responsabil tehnic'
  },
  {
    id: 'hu_ssm_021',
    denumire: 'Védőszemüveg és arcvédő biztosítása',
    descriere: 'Furnizarea protecției ochilor și feței pentru lucrări cu risc',
    categorie: 'egyeni_vedoeszkoz',
    periodicitate: 'Permanent / La uzură',
    termen_legal: 'Conform evaluării riscurilor',
    baza_legala: '2/1998. (I. 16.) MüM r. 3. melléklet',
    penalty_min_huf: 200000,
    penalty_max_huf: 800000,
    responsabil: 'Angajator'
  },

  // === MUNKABALESET (Accident de muncă) ===
  {
    id: 'hu_ssm_022',
    denumire: 'Munkabaleset bejelentése munkavédelmi hatóságnak',
    descriere: 'Raportarea accidentelor grave și mortale la Inspectoratul de Muncă',
    categorie: 'munkabaleset',
    periodicitate: 'La eveniment',
    termen_legal: '8 ore (grav) / imediat (mortal)',
    baza_legala: '1993. évi XCIII. tv. 63. §',
    penalty_min_huf: 500000,
    penalty_max_huf: 3000000,
    responsabil: 'Angajator'
  },
  {
    id: 'hu_ssm_023',
    denumire: 'Munkabaleset kivizsgálása',
    descriere: 'Investigarea accidentelor de muncă și stabilirea cauzelor',
    categorie: 'munkabaleset',
    periodicitate: 'La fiecare accident',
    termen_legal: '5 zile lucrătoare (ușor) / 30 zile (grav)',
    baza_legala: '45/1991. (XII. 26.) IM rendelet',
    penalty_min_huf: 400000,
    penalty_max_huf: 2000000,
    responsabil: 'Comisie de investigare'
  },
  {
    id: 'hu_ssm_024',
    denumire: 'Baleseti jegyzőkönyv elkészítése',
    descriere: 'Întocmirea procesului-verbal de accident (N1 nyomtatvány)',
    categorie: 'munkabaleset',
    periodicitate: 'La fiecare accident',
    termen_legal: '8 zile de la accident',
    baza_legala: '45/1991. (XII. 26.) IM r. 4. §',
    penalty_min_huf: 300000,
    penalty_max_huf: 1500000,
    responsabil: 'Angajator / Comisie'
  },
  {
    id: 'hu_ssm_025',
    denumire: 'Baleseti nyilvántartás vezetése',
    descriere: 'Evidența tuturor accidentelor de muncă (registru)',
    categorie: 'munkabaleset',
    periodicitate: 'Permanent',
    termen_legal: 'Actualizare imediată după fiecare accident',
    baza_legala: '45/1991. (XII. 26.) IM r. 6. §',
    penalty_min_huf: 250000,
    penalty_max_huf: 1000000,
    responsabil: 'Angajator / Specialist munkavédelem'
  },
  {
    id: 'hu_ssm_026',
    denumire: 'Munkabaleset utáni intézkedések végrehajtása',
    descriere: 'Implementarea măsurilor corective după accident',
    categorie: 'munkabaleset',
    periodicitate: 'După fiecare investigare',
    termen_legal: 'Conform termenelor stabilite în raport',
    baza_legala: '45/1991. (XII. 26.) IM r. 7. §',
    penalty_min_huf: 350000,
    penalty_max_huf: 1800000,
    responsabil: 'Angajator'
  },
  {
    id: 'hu_ssm_027',
    denumire: 'Elsősegély-felszerelés biztosítása',
    descriere: 'Asigurarea truse de prim ajutor și a personalului instruit',
    categorie: 'munkabaleset',
    periodicitate: 'Permanent',
    termen_legal: 'Verificare lunară',
    baza_legala: '1993. évi XCIII. tv. 60. §',
    penalty_min_huf: 200000,
    penalty_max_huf: 800000,
    responsabil: 'Angajator'
  },
  {
    id: 'hu_ssm_028',
    denumire: 'Elsősegélynyújtó képzés',
    descriere: 'Formare personal pentru acordarea primului ajutor',
    categorie: 'munkabaleset',
    periodicitate: 'La 50 angajați: min 1 persoană formată',
    termen_legal: 'Curs valid 3 ani',
    baza_legala: '5/1993. MüM r. 15. §',
    penalty_min_huf: 250000,
    penalty_max_huf: 1000000,
    responsabil: 'Angajator'
  },
  {
    id: 'hu_ssm_029',
    denumire: 'Súlyos baleset helyszínének biztosítása',
    descriere: 'Securizarea locului accidentului grav până la sosirea autorităților',
    categorie: 'munkabaleset',
    periodicitate: 'La accident grav/mortal',
    termen_legal: 'Imediat, până la finalizarea investigării',
    baza_legala: '1993. évi XCIII. tv. 63. § (3)',
    penalty_min_huf: 500000,
    penalty_max_huf: 2500000,
    responsabil: 'Angajator'
  },
  {
    id: 'hu_ssm_030',
    denumire: 'Munkabaleset statisztikai jelentés',
    descriere: 'Raport statistic anual privind accidentele de muncă către KSH',
    categorie: 'munkabaleset',
    periodicitate: 'Anual',
    termen_legal: '31 ianuarie (anul următor)',
    baza_legala: '45/1991. (XII. 26.) IM r. 10. §',
    penalty_min_huf: 300000,
    penalty_max_huf: 1200000,
    responsabil: 'Angajator / Specialist munkavédelem'
  }
];

/**
 * Helper: Filtrare obligații pe categorie
 */
export function getObligatiiByCategory(categorie: ObligatieSSMHU['categorie']): ObligatieSSMHU[] {
  return obligatiiSSMHU.filter(obl => obl.categorie === categorie);
}

/**
 * Helper: Găsire obligație după ID
 */
export function getObligatieById(id: string): ObligatieSSMHU | undefined {
  return obligatiiSSMHU.find(obl => obl.id === id);
}

/**
 * Categorii disponibile cu denumiri localizate
 */
export const categoriiSSMHU = {
  kockazatertekeles: 'Kockázatértékelés (Evaluare risc)',
  oktatas: 'Oktatás (Instruire)',
  munkakor_alkalmasagi: 'Munkakör alkalmassági (Aptitudine)',
  egyeni_vedoeszkoz: 'Egyéni védőeszköz (EIP)',
  munkabaleset: 'Munkabaleset (Accident muncă)'
} as const;
