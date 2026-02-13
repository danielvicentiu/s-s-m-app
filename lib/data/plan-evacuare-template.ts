/**
 * Template pentru Plan de Evacuare în caz de urgență
 * Conform normelor de securitate și sănătate în muncă (SSM) și PSI
 */

export interface ContactUrgenta {
  serviciu: string;
  telefon: string;
  descriere?: string;
}

export interface MembruEchipa {
  functie: string;
  responsabilitati: string[];
  calificari?: string;
}

export interface CalieEvacuare {
  id: string;
  denumire: string;
  descriere: string;
  capacitate?: string;
  observatii?: string;
}

export interface PunctAdunare {
  id: string;
  denumire: string;
  locatie: string;
  capacitate?: number;
  coordonate?: {
    lat: number;
    lng: number;
  };
  responsabil?: string;
}

export interface EchipamentUrgenta {
  tip: string;
  locatie: string;
  cantitate?: number;
  dataVerificare?: string;
  observatii?: string;
}

export interface ScenariuUrgenta {
  tip: string;
  descriere: string;
  proceduri: string[];
  nivelRisc: 'scăzut' | 'mediu' | 'ridicat';
}

export interface ProceduraEvacuare {
  etapa: string;
  actiuni: string[];
  responsabil?: string;
  timpEstimat?: string;
}

export interface PlanEvacuareTemplate {
  // Informații generale
  obiectiv: string;
  domeniuAplicare: string;
  versiune: string;
  dataAprobare?: string;

  // Scenarii de urgență
  scenariiUrgenta: ScenariuUrgenta[];

  // Echipa de intervenție
  echipaInterventie: MembruEchipa[];

  // Căi de evacuare
  caiEvacuare: CalieEvacuare[];

  // Puncte de adunare
  puncteAdunare: PunctAdunare[];

  // Echipamente de urgență
  echipamenteUrgenta: EchipamentUrgenta[];

  // Proceduri de evacuare
  proceduri: ProceduraEvacuare[];

  // Contacte de urgență
  contacteUrgenta: ContactUrgenta[];

  // Instrucțiuni generale
  instructiuniGenerale: string[];
}

export const planEvacuareTemplate: PlanEvacuareTemplate = {
  // Informații generale
  obiectiv: 'Asigurarea evacuării rapide și în siguranță a tuturor persoanelor din clădire în caz de urgență (incendiu, cutremur, amenințare cu bombă, etc.)',

  domeniuAplicare: 'Prezentul plan se aplică tuturor angajaților, vizitatorilor și colaboratorilor prezenți în clădire.',

  versiune: '1.0',

  // Scenarii de urgență
  scenariiUrgenta: [
    {
      tip: 'Incendiu',
      descriere: 'Declanșarea unui incendiu în oricare dintre zonele clădirii',
      nivelRisc: 'ridicat',
      proceduri: [
        'Activarea imediată a alarmei de incendiu',
        'Anunțarea serviciilor de urgență (pompieri - 112)',
        'Evacuarea ordonată a tuturor persoanelor',
        'Verificarea că toate persoanele au părăsit clădirea',
        'Întâlnirea la punctul de adunare stabilit'
      ]
    },
    {
      tip: 'Cutremur',
      descriere: 'Seism cu magnitudine semnificativă care afectează stabilitatea clădirii',
      nivelRisc: 'ridicat',
      proceduri: [
        'Adăpostirea sub birouri/mese solide în timpul cutremurului',
        'Evitarea ferestrelor și obiectelor care pot cădea',
        'Evacuarea după încetarea mișcărilor seismice principale',
        'Utilizarea scărilor (NU lifturile)',
        'Adunarea la punctul de siguranță exterior'
      ]
    },
    {
      tip: 'Amenințare cu bombă',
      descriere: 'Primirea unei amenințări credibile cu dispozitiv exploziv',
      nivelRisc: 'ridicat',
      proceduri: [
        'Anunțarea imediată a forțelor de ordine (112)',
        'Notarea tuturor detaliilor din apel (voce, zgomote de fond, etc.)',
        'Evacuarea calmă și ordonată fără a atinge obiecte suspecte',
        'Așteptarea verificării de către autorități înainte de revenire'
      ]
    },
    {
      tip: 'Scurgere de gaz/substanțe periculoase',
      descriere: 'Detectarea unei scurgeri de gaz sau substanțe chimice periculoase',
      nivelRisc: 'ridicat',
      proceduri: [
        'Oprirea surselor de aprindere (fără a acționa întrerupătoare electrice)',
        'Deschiderea ferestrelor pentru aerisire (dacă este sigur)',
        'Evacuarea imediată din zona afectată',
        'Anunțarea serviciilor de urgență',
        'Evitarea reîntoarcerii până la declararea zonei sigure'
      ]
    },
    {
      tip: 'Urgență medicală',
      descriere: 'Situație medicală gravă care necesită intervenție urgentă',
      nivelRisc: 'mediu',
      proceduri: [
        'Apelarea serviciilor medicale de urgență (112)',
        'Acordarea primului ajutor de către persoanele calificate',
        'Asigurarea accesului liber pentru echipele medicale',
        'Izolarea zonei dacă este cazul (boli transmisibile)'
      ]
    }
  ],

  // Echipa de intervenție
  echipaInterventie: [
    {
      functie: 'Coordonator Evacuare',
      responsabilitati: [
        'Coordonarea generală a procesului de evacuare',
        'Luarea deciziei de evacuare',
        'Comunicarea cu serviciile de urgență',
        'Declararea „totul în siguranță" după verificări'
      ],
      calificari: 'Pregătire în managementul situațiilor de urgență'
    },
    {
      functie: 'Responsabil Etaj/Zonă',
      responsabilitati: [
        'Verificarea evacuării complete a zonei alocate',
        'Asistarea persoanelor cu mobilitate redusă',
        'Închiderea ușilor și ferestrelor (dacă timpul permite)',
        'Raportarea către Coordonatorul de Evacuare'
      ],
      calificari: 'Instruire PSI și prim ajutor'
    },
    {
      functie: 'Echipă Prim Ajutor',
      responsabilitati: [
        'Acordarea primului ajutor în caz de răniri',
        'Evaluarea stării victimelor',
        'Stabilizarea victimelor până la sosirea paramedicilor',
        'Colaborarea cu serviciile medicale de urgență'
      ],
      calificari: 'Curs prim ajutor calificat'
    },
    {
      functie: 'Responsabil Numărătoare',
      responsabilitati: [
        'Verificarea prezenței tuturor angajaților la punctul de adunare',
        'Compararea cu registrul de prezență',
        'Raportarea persoanelor lipsă',
        'Menținerea ordinii la punctul de adunare'
      ]
    },
    {
      functie: 'Echipă Comunicare',
      responsabilitati: [
        'Menținerea contactului cu serviciile de urgență',
        'Informarea angajaților și familiilor (după caz)',
        'Gestionarea comunicării cu media (dacă este cazul)',
        'Documentarea evenimentului'
      ]
    }
  ],

  // Căi de evacuare
  caiEvacuare: [
    {
      id: 'cale-1',
      denumire: 'Scara principală (Est)',
      descriere: 'Scara interioară principală, acces din toate etajele',
      capacitate: 'Aproximativ 100 persoane/minut',
      observatii: 'Iluminare de urgență disponibilă, ieșire directă în exterior'
    },
    {
      id: 'cale-2',
      denumire: 'Scara secundară (Vest)',
      descriere: 'Scara exterioară de urgență, platforme la fiecare etaj',
      capacitate: 'Aproximativ 60 persoane/minut',
      observatii: 'Doar pentru urgențe, verificare periodică necesară'
    },
    {
      id: 'cale-3',
      denumire: 'Ieșire parter (Sud)',
      descriere: 'Ușă dublă de urgență la parter',
      capacitate: 'Aproximativ 80 persoane/minut',
      observatii: 'Deschidere automată în caz de alarmă'
    },
    {
      id: 'cale-4',
      denumire: 'Ieșire parter (Nord)',
      descriere: 'Ieșire prin zona de recepție',
      capacitate: 'Aproximativ 100 persoane/minut',
      observatii: 'Cale principală pentru vizitatori'
    }
  ],

  // Puncte de adunare
  puncteAdunare: [
    {
      id: 'punct-1',
      denumire: 'Punct Principal de Adunare',
      locatie: 'Parcarea din fața clădirii, zona marcată cu linii galbene',
      capacitate: 200,
      responsabil: 'Coordonator Evacuare + Responsabil Numărătoare',
      coordonate: {
        lat: 0,
        lng: 0
      }
    },
    {
      id: 'punct-2',
      denumire: 'Punct Secundar de Adunare',
      locatie: 'Grădina publică, la 100m vest de clădire',
      capacitate: 150,
      responsabil: 'Responsabil Etaj/Zonă desemnat',
      coordonate: {
        lat: 0,
        lng: 0
      }
    }
  ],

  // Echipamente de urgență
  echipamenteUrgenta: [
    {
      tip: 'Stingătoare incendiu (pulbere)',
      locatie: 'Fiecare etaj - lângă căile de evacuare',
      cantitate: 8,
      observatii: 'Verificare anuală obligatorie, etichetă verde când funcțional'
    },
    {
      tip: 'Stingătoare incendiu (CO2)',
      locatie: 'Server room, birouri cu echipamente electrice',
      cantitate: 4,
      observatii: 'Pentru echipamente electrice'
    },
    {
      tip: 'Hidrant interior',
      locatie: 'Fiecare etaj - la capătul holului',
      cantitate: 6,
      observatii: 'Testare semestrială'
    },
    {
      tip: 'Trusă prim ajutor (completă)',
      locatie: 'Recepție, sala de pauză fiecare etaj',
      cantitate: 4,
      observatii: 'Verificare lunară conținut, completare consumabile'
    },
    {
      tip: 'Defibrilator automat (AED)',
      locatie: 'Hol principal parter, lângă recepție',
      cantitate: 1,
      observatii: 'Verificare săptămânală indicator, înlocuire electrozi conform specificații'
    },
    {
      tip: 'Lanternă de urgență',
      locatie: 'Fiecare birou, căi de evacuare',
      cantitate: 20,
      observatii: 'Verificare baterii lunar'
    },
    {
      tip: 'Sistem de alarmă incendiu',
      locatie: 'Butoane pe fiecare etaj',
      cantitate: 12,
      observatii: 'Testare lunară, raportare defecțiuni imediat'
    },
    {
      tip: 'Sistem iluminare urgență',
      locatie: 'Toate căile de evacuare și scări',
      observatii: 'Iluminare automată la pană curent'
    }
  ],

  // Proceduri de evacuare
  proceduri: [
    {
      etapa: '1. Detectare și Alertă',
      actiuni: [
        'Orice persoană care detectează o situație de urgență alertează imediat colegii din apropiere',
        'Se activează alarma de incendiu prin apăsarea butonului de alarmă cel mai apropiat',
        'Se anunță serviciile de urgență (112) furnizând: adresa exactă, natura urgențe, număr aproximativ de persoane',
        'Se informează Coordonatorul de Evacuare'
      ],
      responsabil: 'Orice angajat',
      timpEstimat: '1-2 minute'
    },
    {
      etapa: '2. Anunțarea Evacuării',
      actiuni: [
        'Coordonatorul de Evacuare evaluează situația și decide evacuarea',
        'Se transmite prin sistem de sonorizare/interfon mesajul: "Atenție! Evacuare de urgență! Părăsiți calm clădirea!"',
        'Mesajul se repetă la interval de 30 secunde',
        'Responsabilii de etaj confirmă primirea mesajului'
      ],
      responsabil: 'Coordonator Evacuare',
      timpEstimat: '1 minut'
    },
    {
      etapa: '3. Evacuarea Propriu-zisă',
      actiuni: [
        'OPRIȚI lucrul imediat - lăsați toate obiectele personale',
        'NU folosiți lifturile - DOAR scările',
        'Urmați indicatoarele verzi "IEȘIRE" și săgețile de evacuare',
        'Mergeți calm, fără alergare sau îmbulzeală',
        'Ajutați colegii cu mobilitate redusă sau care au nevoie de asistență',
        'Dacă întâlniți fum, mergeți aplecat aproape de podea',
        'Închideți ușile birourilor în urma dvs. (fără încuiere)',
        'NU vă întoarceți pentru obiecte personale',
        'Responsabilii de etaj verifică toate spațiile (birouri, băi, săli) și se asigură că toată lumea a evacuat'
      ],
      responsabil: 'Toți angajații + Responsabili Etaj',
      timpEstimat: '3-5 minute'
    },
    {
      etapa: '4. Adunarea la Punctul de Siguranță',
      actiuni: [
        'Mergeți direct la Punctul Principal de Adunare (parcarea din față)',
        'NU opriți în fața intrărilor - lăsați acces liber pentru serviciile de urgență',
        'Rămâneți la punctul de adunare până la numărătoare',
        'Responsabilul de Numărătoare verifică prezența tuturor angajaților',
        'Se raportează imediat Coordonatorului orice persoană lipsă',
        'Se furnizează serviciilor de urgență informații despre persoanele lipsă (ultimă locație cunoscută)'
      ],
      responsabil: 'Responsabil Numărătoare',
      timpEstimat: '3-5 minute'
    },
    {
      etapa: '5. Verificare și Raportare',
      actiuni: [
        'Coordonatorul de Evacuare primește raportul de la toți Responsabilii de Etaj',
        'Se confirmă numărul total de persoane evacuate',
        'Se raportează serviciilor de urgență situația completă',
        'Se acordă prim ajutor celor răniți până la sosirea paramedicilor',
        'Se documentează incidentul (cine, ce, când, unde, cum)',
        'NU permiteți reintrarea în clădire fără autorizare de la pompieri/autorități'
      ],
      responsabil: 'Coordonator Evacuare + Echipă Prim Ajutor',
      timpEstimat: 'Continuu până la rezolvare'
    },
    {
      etapa: '6. Revenirea la Normal',
      actiuni: [
        'Așteptați confirmarea de la serviciile de urgență că clădirea este sigură',
        'Coordonatorul de Evacuare declară "totul în siguranță"',
        'Reintrarea se face organizat, pe grupuri, la indicația Coordonatorului',
        'Se efectuează o verificare a daunelor și se raportează',
        'Se completează raportul de incident',
        'Se organizează debriefing cu echipa de intervenție în maxim 48 ore',
        'Se actualizează planul de evacuare bazat pe lecțiile învățate'
      ],
      responsabil: 'Coordonator Evacuare',
      timpEstimat: 'Variabil'
    }
  ],

  // Contacte de urgență
  contacteUrgenta: [
    {
      serviciu: 'Urgențe generale (pompieri, ambulanță, poliție)',
      telefon: '112',
      descriere: 'Număr unic de urgență pentru România'
    },
    {
      serviciu: 'Pompieri',
      telefon: '981',
      descriere: 'Linie directă pompieri'
    },
    {
      serviciu: 'Ambulanță',
      telefon: '961',
      descriere: 'Linie directă urgențe medicale'
    },
    {
      serviciu: 'Poliție',
      telefon: '955',
      descriere: 'Linie directă poliție'
    },
    {
      serviciu: 'Coordonator Evacuare - [NUME]',
      telefon: '[TELEFON MOBIL]',
      descriere: 'Apel disponibil 24/7'
    },
    {
      serviciu: 'Responsabil SSM - [NUME]',
      telefon: '[TELEFON MOBIL]',
      descriere: 'Responsabil Securitate și Sănătate în Muncă'
    },
    {
      serviciu: 'Responsabil PSI - [NUME]',
      telefon: '[TELEFON MOBIL]',
      descriere: 'Responsabil Prevenirea și Stingerea Incendiilor'
    },
    {
      serviciu: 'Administrator clădire',
      telefon: '[TELEFON]',
      descriere: 'Pentru probleme tehnice (apă, gaz, electricitate)'
    },
    {
      serviciu: 'Distribuitor gaze naturale - Distrigaz',
      telefon: '0800.800.928',
      descriere: 'Pentru urgențe legate de gaz'
    },
    {
      serviciu: 'Distribuitor energie electrică',
      telefon: '[TELEFON LOCAL]',
      descriere: 'Pentru urgențe electrice'
    }
  ],

  // Instrucțiuni generale
  instructiuniGenerale: [
    '🔴 PĂSTRAȚI CALMUL - panica poate cauza mai multe victime decât urgența în sine',

    '📵 NU folosiți telefonul mobil în timpul evacuării - concentrați-vă pe siguranța dvs.',

    '🚪 NU blocați căile de evacuare cu mobilier, cutii sau echipamente',

    '🔥 Dacă hainele cuiva iau foc: STOP (opriți-vă), DROP (culcați-vă), ROLL (rostogoliți-vă)',

    '🚭 NU fumați în clădire - risc major de incendiu',

    '🔌 NU supraîncărcați prizele electrice - risc de incendiu',

    '🚶 Familiarizați-vă cu toate căile de evacuare din zona dvs. de lucru',

    '👥 Participați OBLIGATORIU la exercițiile de evacuare (minim 2/an)',

    '📋 Citiți și înțelegeți acest plan - viața dvs. și a colegilor poate depinde de el',

    '♿ Persoanele cu mobilitate redusă au prioritate la evacuare - asistate de colegii desemnați',

    '🎒 Echipamente de urgență (stingătoare, trusă prim ajutor) - NU le mutați sau folosiți decât în caz de urgență',

    '🔦 Verificați lunar funcționarea lanternelor din biroul dvs.',

    '📞 Memorați numerele de urgență - 112 pentru orice urgență',

    '🚨 La auzul alarmei - evacuați IMEDIAT, fără ezitare',

    '🔙 NU vă întoarceți în clădire pentru NICIUN MOTIV până nu este declarată sigură',

    '🗣️ Raportați orice echipament de urgență defect sau lipsă IMEDIAT responsabilului SSM',

    '🏃 În caz de fum intens - deplasați-vă APLECAT sau de-a lungul podelei',

    '🚷 Dacă ușa este FIERBINTE - NU o deschideți! Căutați o rută alternativă',

    '📱 După evacuare - informați familia că sunteți în siguranță (dacă posibil)',

    '✅ Urmați întotdeauna instrucțiunile echipelor de intervenție și serviciilor de urgență'
  ]
};

/**
 * Funcție helper pentru generarea unui plan de evacuare personalizat
 * bazat pe template-ul de bază
 */
export function generateCustomPlan(
  organizationName: string,
  address: string,
  customData?: Partial<PlanEvacuareTemplate>
): PlanEvacuareTemplate {
  return {
    ...planEvacuareTemplate,
    ...customData,
    obiectiv: customData?.obiectiv ||
      `Asigurarea evacuării rapide și în siguranță a tuturor persoanelor din clădirea ${organizationName} situată la adresa ${address} în caz de urgență (incendiu, cutremur, amenințare cu bombă, etc.)`,
  };
}

/**
 * Validează dacă un plan de evacuare este complet
 */
export function validatePlan(plan: PlanEvacuareTemplate): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!plan.obiectiv || plan.obiectiv.trim() === '') {
    errors.push('Obiectivul planului lipsește');
  }

  if (!plan.scenariiUrgenta || plan.scenariiUrgenta.length === 0) {
    errors.push('Nu există scenarii de urgență definite');
  }

  if (!plan.echipaInterventie || plan.echipaInterventie.length === 0) {
    errors.push('Echipa de intervenție nu este definită');
  }

  if (!plan.caiEvacuare || plan.caiEvacuare.length === 0) {
    errors.push('Nu există căi de evacuare definite');
  }

  if (!plan.puncteAdunare || plan.puncteAdunare.length === 0) {
    errors.push('Nu există puncte de adunare definite');
  }

  if (!plan.contacteUrgenta || plan.contacteUrgenta.length === 0) {
    errors.push('Nu există contacte de urgență definite');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
