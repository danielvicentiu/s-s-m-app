/**
 * Ergonomic Risk Factors Database
 *
 * Comprehensive database of workplace ergonomic risks including:
 * - Manual handling and lifting
 * - Postural risks
 * - Repetitive movements
 * - VDT (Visual Display Terminal) work
 * - Vibrations and physical strain
 *
 * Assessment methods: RULA, REBA, NIOSH, ISO standards
 */

export interface ErgonomicRisk {
  id: string;
  name: string;
  description: string;
  assessmentMethod: string;
  thresholdValues: {
    parameter: string;
    value: string;
    unit: string;
    riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  }[];
  preventiveMeasures: string[];
  applicableJobs: string[];
  legalReference: string;
  category: 'manual_handling' | 'posture' | 'repetitive' | 'vdt' | 'vibration' | 'environment';
}

export const ergonomicRisks: ErgonomicRisk[] = [
  {
    id: 'ERG-001',
    name: 'Ridicare Manuală Greutăți',
    description: 'Riscuri asociate cu ridicarea, coborârea, împingerea sau tragerea manuală a sarcinilor grele. Poate cauza leziuni musculo-scheletice, hernii discale și traumatisme acute.',
    assessmentMethod: 'NIOSH Lifting Equation',
    thresholdValues: [
      {
        parameter: 'Greutate maximă recomandată',
        value: '25',
        unit: 'kg',
        riskLevel: 'medium'
      },
      {
        parameter: 'Greutate maximă ocazională',
        value: '40',
        unit: 'kg',
        riskLevel: 'high'
      },
      {
        parameter: 'Frecvență ridicare',
        value: '15',
        unit: 'ridicări/min',
        riskLevel: 'high'
      },
      {
        parameter: 'Indice NIOSH (LI)',
        value: '3.0',
        unit: 'adimensional',
        riskLevel: 'very_high'
      }
    ],
    preventiveMeasures: [
      'Utilizare echipamente de ridicat (palanuri, stivuitoare, electropalan)',
      'Reducerea greutății sarcinilor prin fracționare',
      'Instruire în tehnici corecte de ridicare (îndoire genunchi, spate drept)',
      'Amplasarea obiectelor la înălțimi ergonomice (75-110 cm)',
      'Implementare sisteme de ajutor mecanic',
      'Rotația personalului pentru reducerea expunerii',
      'Pauze regulate pentru recuperare musculară',
      'Evaluare medicală periodică a lucrătorilor'
    ],
    applicableJobs: [
      'Muncitor depozit',
      'Operator logistică',
      'Lucrător construcții',
      'Mecanic auto',
      'Personal spital (mobilizare pacienți)',
      'Operator producție',
      'Instalator',
      'Electrician industrial'
    ],
    legalReference: 'HG 1051/2006 - cerințe minime de securitate pentru manipularea manuală a sarcinilor',
    category: 'manual_handling'
  },
  {
    id: 'ERG-002',
    name: 'Postură Statică Prelungită - Stând',
    description: 'Menținerea poziției în picioare pentru perioade lungi fără posibilitate de a schimba poziția. Cauzează oboseală, dureri lombare, varice și probleme circulatorii.',
    assessmentMethod: 'REBA (Rapid Entire Body Assessment)',
    thresholdValues: [
      {
        parameter: 'Durată continuă în picioare',
        value: '2',
        unit: 'ore',
        riskLevel: 'medium'
      },
      {
        parameter: 'Total zilnic în picioare',
        value: '6',
        unit: 'ore',
        riskLevel: 'high'
      },
      {
        parameter: 'Scor REBA',
        value: '8',
        unit: 'puncte',
        riskLevel: 'high'
      },
      {
        parameter: 'Scor REBA',
        value: '11',
        unit: 'puncte',
        riskLevel: 'very_high'
      }
    ],
    preventiveMeasures: [
      'Amenajare scaune ergonomice pentru pauze scurte',
      'Covoare anti-oboseală la posturile de lucru',
      'Rotație între sarcini diferite (alternare stând-șezând)',
      'Pauze de 10 minute la fiecare 2 ore',
      'Exerciții de stretching și relaxare',
      'Încălțăminte ergonomică cu talpă amortizoare',
      'Suporturi pentru un picior (foot rest) la lucru prelungit',
      'Ajustarea înălțimii planului de lucru'
    ],
    applicableJobs: [
      'Operator linie producție',
      'Vânzător magazin',
      'Coafor/frizer',
      'Bucătar',
      'Chirurg/medic stomatolog',
      'Casier supermarket',
      'Agent pază',
      'Lucrător asamblare'
    ],
    legalReference: 'Legea 319/2006 - SSM, art. 18',
    category: 'posture'
  },
  {
    id: 'ERG-003',
    name: 'Postură Statică - Șezând Prelungit',
    description: 'Lucrul în poziție șezândă prelungită la birou sau calculator. Poate cauza dureri lombare, probleme cervicale, sindrom metabolic și afecțiuni cardiovasculare.',
    assessmentMethod: 'RULA (Rapid Upper Limb Assessment)',
    thresholdValues: [
      {
        parameter: 'Ședere continuă fără pauză',
        value: '50',
        unit: 'minute',
        riskLevel: 'medium'
      },
      {
        parameter: 'Total zilnic șezând',
        value: '8',
        unit: 'ore',
        riskLevel: 'high'
      },
      {
        parameter: 'Scor RULA',
        value: '5',
        unit: 'puncte',
        riskLevel: 'medium'
      },
      {
        parameter: 'Scor RULA',
        value: '7',
        unit: 'puncte',
        riskLevel: 'very_high'
      }
    ],
    preventiveMeasures: [
      'Scaun ergonomic cu reglaj înălțime, spătar lombar, brațe',
      'Birouri reglabile pe înălțime (sit-stand desk)',
      'Monitor la 50-70 cm distanță, partea superioară la nivel ochilor',
      'Pauze active la fiecare 50 minute (regula 50-10)',
      'Exerciții de mobilizare cervicală și lombară',
      'Tastatură și mouse ergonomice',
      'Suport pentru picioare dacă este necesar',
      'Iluminare adecvată (500 lux pentru birouri)'
    ],
    applicableJobs: [
      'Programator IT',
      'Contabil',
      'Operator date',
      'Designer grafic',
      'Agent call center',
      'Secretar',
      'Analist financiar',
      'Șofer profesionist'
    ],
    legalReference: 'HG 1028/2006 - cerințe minime pentru lucrul cu echipamente cu ecran de vizualizare',
    category: 'vdt'
  },
  {
    id: 'ERG-004',
    name: 'Mișcări Repetitive Membre Superioare',
    description: 'Efectuarea acelorași mișcări ale mâinilor, încheieturilor sau brațelor în mod repetat. Risc pentru sindrom tunel carpian, tendinite, epicondilite.',
    assessmentMethod: 'OCRA Index (Occupational Repetitive Actions)',
    thresholdValues: [
      {
        parameter: 'Cicluri pe minut',
        value: '30',
        unit: 'cicluri/min',
        riskLevel: 'medium'
      },
      {
        parameter: 'Acțiuni tehnice pe minut',
        value: '40',
        unit: 'acțiuni/min',
        riskLevel: 'high'
      },
      {
        parameter: 'Indice OCRA',
        value: '7.5',
        unit: 'puncte',
        riskLevel: 'medium'
      },
      {
        parameter: 'Indice OCRA',
        value: '22.5',
        unit: 'puncte',
        riskLevel: 'very_high'
      }
    ],
    preventiveMeasures: [
      'Rotație între posturi cu sarcini diferite',
      'Automatizare procese repetitive',
      'Unelte ergonomice cu mânere anti-vibratoare',
      'Pauze de 5 minute la fiecare oră',
      'Exerciții de stretching pentru membre superioare',
      'Reducerea forței necesare prin îmbunătățiri tehnice',
      'Suport pentru încheieturi la lucru prelungit',
      'Supraveghere medicală specializată'
    ],
    applicableJobs: [
      'Operator asamblare electronică',
      'Lucrător ambalare',
      'Casier/casier bancă',
      'Muzician',
      'Coafor/manichiurist',
      'Tamplar',
      'Operator introducere date',
      'Croitor/croitoreasă'
    ],
    legalReference: 'ISO 11228-3:2007 - Ergonomie, mișcări repetitive',
    category: 'repetitive'
  },
  {
    id: 'ERG-005',
    name: 'Muncă la Ecran (VDT) Intensivă',
    description: 'Utilizarea intensivă a calculatorului/ecranului de vizualizare. Risc pentru oboseală vizuală (CVS - Computer Vision Syndrome), dureri cap, tulburări musculo-scheletice.',
    assessmentMethod: 'Evaluare conformitate HG 1028/2006',
    thresholdValues: [
      {
        parameter: 'Timp continuu la ecran',
        value: '60',
        unit: 'minute',
        riskLevel: 'medium'
      },
      {
        parameter: 'Total zilnic la ecran',
        value: '6',
        unit: 'ore',
        riskLevel: 'high'
      },
      {
        parameter: 'Distanță monitor',
        value: '50',
        unit: 'cm (minim)',
        riskLevel: 'medium'
      },
      {
        parameter: 'Luminozitate ecran',
        value: '500',
        unit: 'cd/m²',
        riskLevel: 'high'
      }
    ],
    preventiveMeasures: [
      'Pauze obligatorii: 10 minute la fiecare oră sau 15 min la 2 ore',
      'Monitoare anti-reflectare, IPS, minim Full HD',
      'Regula 20-20-20: la 20 min, privire 20 sec la 20 feet (6m)',
      'Iluminare ambientală 300-500 lux, fără reflecții pe monitor',
      'Poziționare ecran perpendicular pe ferestre',
      'Ajustare luminozitate/contrast/temperatură culoare',
      'Control medical oftalmologic anual',
      'Exerciții relaxare oculară'
    ],
    applicableJobs: [
      'Dezvoltator software',
      'Designer grafic',
      'Editor video',
      'Operator CAD',
      'Analist date',
      'Agent bursă',
      'Traducător',
      'Redactor'
    ],
    legalReference: 'HG 1028/2006 - cerințe minime pentru lucrul cu echipamente cu ecran de vizualizare',
    category: 'vdt'
  },
  {
    id: 'ERG-006',
    name: 'Vibrații Corp Întreg',
    description: 'Expunere la vibrații transmise la întreg corpul prin platforme vibrante, vehicule, utilaje. Risc pentru afecțiuni coloanei vertebrale, hernii discale.',
    assessmentMethod: 'ISO 2631-1 - Whole Body Vibration',
    thresholdValues: [
      {
        parameter: 'Valoare expunere zilnică A(8)',
        value: '0.5',
        unit: 'm/s²',
        riskLevel: 'medium'
      },
      {
        parameter: 'Valoare limită expunere A(8)',
        value: '1.15',
        unit: 'm/s²',
        riskLevel: 'very_high'
      },
      {
        parameter: 'Vibrații verticale (az)',
        value: '0.8',
        unit: 'm/s²',
        riskLevel: 'high'
      },
      {
        parameter: 'Durata expunere',
        value: '4',
        unit: 'ore/zi',
        riskLevel: 'high'
      }
    ],
    preventiveMeasures: [
      'Scaune cu suspensie anti-vibrații',
      'Întreținere preventivă vehicule/utilaje',
      'Limitarea vitezei pe teren accidentat',
      'Rotație între șoferi/operatori',
      'Pauze regulate departe de sursa de vibrații',
      'Cabine cu izolație anti-vibrații',
      'Control medical anual - evaluare coloană vertebrală',
      'Înlocuire utilaje învechite'
    ],
    applicableJobs: [
      'Șofer camion',
      'Operator buldozer/excavator',
      'Șofer autobuz',
      'Pilot elicopter',
      'Operator utilaj drumuri',
      'Conducător stivuitor',
      'Operator agricol',
      'Șofer metrou'
    ],
    legalReference: 'HG 1876/2005 - protecția lucrătorilor împotriva riscurilor vibrațiilor',
    category: 'vibration'
  },
  {
    id: 'ERG-007',
    name: 'Vibrații Mână-Braț',
    description: 'Vibrații transmise prin unelte manuale electrice sau pneumatice. Risc pentru sindrom Raynaud (degete albe), neuropatii periferice, afecțiuni osteoarticulare.',
    assessmentMethod: 'ISO 5349 - Hand-Arm Vibration',
    thresholdValues: [
      {
        parameter: 'Valoare declanșare acțiune A(8)',
        value: '2.5',
        unit: 'm/s²',
        riskLevel: 'medium'
      },
      {
        parameter: 'Valoare limită expunere A(8)',
        value: '5.0',
        unit: 'm/s²',
        riskLevel: 'very_high'
      },
      {
        parameter: 'Expunere zilnică echivalentă',
        value: '100',
        unit: 'm²/s⁴·h',
        riskLevel: 'high'
      },
      {
        parameter: 'Frecvență dominantă',
        value: '125',
        unit: 'Hz',
        riskLevel: 'high'
      }
    ],
    preventiveMeasures: [
      'Unelte cu sistem anti-vibrații certificat',
      'Limitarea timpului de utilizare (maxim 2 ore/zi)',
      'Mănuși anti-vibrații conforme EN ISO 10819',
      'Menținerea uneltelor în stare bună (lame ascuțite)',
      'Încălzirea mâinilor înainte de lucru',
      'Pauze de 10 minute la fiecare oră',
      'Evitarea prinderii excesive (grip minim necesar)',
      'Supraveghere medicală specializată'
    ],
    applicableJobs: [
      'Operator polizor unghiular',
      'Tâmplar cu unelte electrice',
      'Lucrător demolări',
      'Mecanic cu cheie pneumatică',
      'Operator drujbă',
      'Operator ciocan pneumatic',
      'Muncitor construcții (bormasină)',
      'Operator șlefuit'
    ],
    legalReference: 'HG 1876/2005 - protecția lucrătorilor împotriva riscurilor vibrațiilor',
    category: 'vibration'
  },
  {
    id: 'ERG-008',
    name: 'Lucru în Poziție Aplecată/Înclinată',
    description: 'Menținerea trunchiului în poziție aplecată sau înclinată pentru perioade lungi. Risc major pentru dureri lombare cronice, hernii discale, contracturi musculare.',
    assessmentMethod: 'REBA + Ovako Working Posture Analysis System (OWAS)',
    thresholdValues: [
      {
        parameter: 'Unghi flexie trunchi',
        value: '20',
        unit: 'grade',
        riskLevel: 'medium'
      },
      {
        parameter: 'Unghi flexie trunchi',
        value: '60',
        unit: 'grade',
        riskLevel: 'very_high'
      },
      {
        parameter: 'Durată poziție aplecată',
        value: '15',
        unit: '% din timp',
        riskLevel: 'high'
      },
      {
        parameter: 'Categorie OWAS',
        value: '3',
        unit: 'nivel',
        riskLevel: 'high'
      }
    ],
    preventiveMeasures: [
      'Ajustarea înălțimii planului de lucru',
      'Platforme reglabile pentru poziționare ergonomică',
      'Unelte cu mânere prelungite pentru acces mai ușor',
      'Rotație între sarcini diferite',
      'Pauze cu exerciții de stretching lombar',
      'Centuri lombare pentru suport (doar temporar)',
      'Training în tehnici corecte de lucru',
      'Reorganizarea spațiului de lucru'
    ],
    applicableJobs: [
      'Îngrijitor bătrâni',
      'Lucrător agricol (recoltare)',
      'Mecanic auto',
      'Instalator',
      'Electrician',
      'Îngrijitor animale',
      'Curățător profesional',
      'Operator asamblare joasă'
    ],
    legalReference: 'Legea 319/2006 - SSM, evaluare riscuri ergonomice',
    category: 'posture'
  },
  {
    id: 'ERG-009',
    name: 'Lucru cu Brațele Ridicate',
    description: 'Muncă cu brațele ridicate deasupra nivelului umerilor pentru perioade prelungite. Risc pentru sindrom de impingement umăr, tendinite rotator cuff, dureri cervicale.',
    assessmentMethod: 'RULA + Strain Index',
    thresholdValues: [
      {
        parameter: 'Unghi ridicare braț',
        value: '60',
        unit: 'grade',
        riskLevel: 'medium'
      },
      {
        parameter: 'Unghi ridicare braț',
        value: '90',
        unit: 'grade',
        riskLevel: 'very_high'
      },
      {
        parameter: 'Durată braț ridicat',
        value: '10',
        unit: '% din timp',
        riskLevel: 'high'
      },
      {
        parameter: 'Scor RULA',
        value: '6',
        unit: 'puncte',
        riskLevel: 'high'
      }
    ],
    preventiveMeasures: [
      'Platforme de lucru reglabile sau scări ergonomice',
      'Unelte ușoare cu sistem de suspensie',
      'Sisteme de ridicare pentru poziționare la înălțime optimă',
      'Limitarea duratei lucrului cu brațele ridicate',
      'Pauze frecvente cu relaxare umeri',
      'Exerciții de mobilizare scapulo-humerală',
      'Rotație între sarcini',
      'Reorganizare proces pentru minimizare lucru sus'
    ],
    applicableJobs: [
      'Zugrav/vopsitor',
      'Electrician instalații înalte',
      'Mecanic aviație',
      'Instalator tavan',
      'Operator sudură overhead',
      'Montator mobilă',
      'Tehnician telecom (antene)',
      'Lucrător construcții (finisaje)'
    ],
    legalReference: 'ISO 11226:2000 - Evaluarea posturii statice de lucru',
    category: 'posture'
  },
  {
    id: 'ERG-010',
    name: 'Mișcări de Rotație/Torsiune Trunchi',
    description: 'Efectuarea frecventă a mișcărilor de rotație sau torsiune a trunchiului, mai ales cu sarcini. Risc crescut pentru hernii discale, leziuni ligamentare, afecțiuni vertebrale.',
    assessmentMethod: 'REBA + MAC (Manual handling Assessment Charts)',
    thresholdValues: [
      {
        parameter: 'Unghi rotație trunchi',
        value: '30',
        unit: 'grade',
        riskLevel: 'medium'
      },
      {
        parameter: 'Frecvență rotații',
        value: '10',
        unit: 'rotații/oră',
        riskLevel: 'high'
      },
      {
        parameter: 'Rotație + sarcină',
        value: '10',
        unit: 'kg',
        riskLevel: 'very_high'
      },
      {
        parameter: 'Scor REBA',
        value: '9',
        unit: 'puncte',
        riskLevel: 'high'
      }
    ],
    preventiveMeasures: [
      'Reorganizare layout pentru eliminare rotații',
      'Conveioare rotative sau platforme turnante',
      'Instruire: deplasare cu picioarele, nu rotație trunchi',
      'Spațiu adecvat pentru mișcare completă a corpului',
      'Reducerea greutăților manipulate',
      'Sisteme de transfer automat',
      'Rotație între posturi',
      'Pauze cu exerciții de mobilizare'
    ],
    applicableJobs: [
      'Operator linie asamblare',
      'Lucrător depozit (sortare)',
      'Îngrijitor (mobilizare pacienți)',
      'Lucrător îmbuteliere',
      'Operator CNC (încărcare/descărcare)',
      'Bagajist aeroport',
      'Manipulant colete',
      'Casier bancă (manipulare numerar)'
    ],
    legalReference: 'HG 1051/2006 - manipularea manuală a sarcinilor',
    category: 'manual_handling'
  },
  {
    id: 'ERG-011',
    name: 'Lucru în Genunchi/Ghemuit',
    description: 'Menținerea poziției în genunchi sau ghemuit pentru perioade lungi. Risc pentru afecțiuni articulare genunchi (bursită, artroză), probleme circulatorii.',
    assessmentMethod: 'REBA + OWAS',
    thresholdValues: [
      {
        parameter: 'Durată în genunchi',
        value: '1',
        unit: 'oră/zi',
        riskLevel: 'medium'
      },
      {
        parameter: 'Durată cumulată',
        value: '2',
        unit: 'ore/zi',
        riskLevel: 'high'
      },
      {
        parameter: 'Presiune pe genunchi',
        value: '100',
        unit: 'N/cm²',
        riskLevel: 'high'
      },
      {
        parameter: 'Categorie OWAS',
        value: '3',
        unit: 'nivel',
        riskLevel: 'high'
      }
    ],
    preventiveMeasures: [
      'Genunchere profesionale cu protecție și amortizare',
      'Saltele/covoare de protecție pentru genunchi',
      'Scăunele ergonomice joase cu rotile',
      'Reorganizare procese pentru reducere poziție genunchi',
      'Platforme ajustabile pentru acces mai bun',
      'Alternare cu alte poziții de lucru',
      'Pauze frecvente pentru mobilizare',
      'Exerciții de stretching pentru membre inferioare'
    ],
    applicableJobs: [
      'Instalator',
      'Electrician',
      'Parchetar',
      'Montator covoare',
      'Grădinar',
      'Mecanic auto',
      'Lucrător construcții',
      'Tehnician service'
    ],
    legalReference: 'Legea 319/2006 - SSM, prevenirea afecțiunilor profesionale',
    category: 'posture'
  },
  {
    id: 'ERG-012',
    name: 'Forță de Prindere/Strângere Excesivă',
    description: 'Utilizarea unei forțe excesive de prindere sau strângere cu mâna și degetele. Risc pentru sindrom tunel carpian, tendinite, epicondilite, afecțiuni degenerative.',
    assessmentMethod: 'Strain Index + Hand Activity Level (HAL)',
    thresholdValues: [
      {
        parameter: 'Forță prindere',
        value: '40',
        unit: '% din maxim',
        riskLevel: 'medium'
      },
      {
        parameter: 'Forță prindere',
        value: '60',
        unit: '% din maxim',
        riskLevel: 'very_high'
      },
      {
        parameter: 'Durată prindere',
        value: '30',
        unit: '% din ciclu',
        riskLevel: 'high'
      },
      {
        parameter: 'HAL Score',
        value: '7',
        unit: 'puncte',
        riskLevel: 'high'
      }
    ],
    preventiveMeasures: [
      'Unelte cu mânere ergonomice (diametru 30-50mm)',
      'Suprafețe mânere anti-alunecare',
      'Reducerea forței necesare prin îmbunătățiri tehnice',
      'Unelte cu acționare automată (electrică vs manuală)',
      'Mănuși cu grip pentru reducerea forței',
      'Pauze frecvente pentru relaxare musculară',
      'Exerciții de stretching pentru mâini și degete',
      'Rotație între sarcini'
    ],
    applicableJobs: [
      'Operator presă manuală',
      'Muncitor asamblare',
      'Mecanic',
      'Tamplar',
      'Coafor',
      'Maseur',
      'Tehnician dentar',
      'Operator instrumente precizie'
    ],
    legalReference: 'ISO 11228-3:2007 - Forțe de prindere',
    category: 'repetitive'
  },
  {
    id: 'ERG-013',
    name: 'Contact cu Suprafețe Dure/Muchii Ascuțite',
    description: 'Contact repetat sau prelungit cu suprafețe dure, muchii ascuțite ale mobilierului sau echipamentului. Risc pentru compresie nervoasă, leziuni țesut moale.',
    assessmentMethod: 'Evaluare ergonomică calitativă + Strain Index',
    thresholdValues: [
      {
        parameter: 'Presiune contact',
        value: '50',
        unit: 'kPa',
        riskLevel: 'medium'
      },
      {
        parameter: 'Durată contact',
        value: '30',
        unit: 'min/zi',
        riskLevel: 'high'
      },
      {
        parameter: 'Frecvență contact',
        value: '20',
        unit: 'contacte/oră',
        riskLevel: 'high'
      },
      {
        parameter: 'Suprafață contact',
        value: '2',
        unit: 'cm²',
        riskLevel: 'very_high'
      }
    ],
    preventiveMeasures: [
      'Rotunjirea muchiilor mobilierului și echipamentelor',
      'Protecții moi pentru suprafețe de contact',
      'Covoare/saltele de protecție',
      'Mănuși cu protecție palmar',
      'Suporturi ergonomice pentru încheieturi (wrist rest)',
      'Unelte cu mânere căptușite',
      'Reorganizare post pentru eliminare puncte contact',
      'Informare și training lucrători'
    ],
    applicableJobs: [
      'Operator masă lucru industrială',
      'Ambalator manual',
      'Operator introducere date',
      'Mecanic (contact cu scule)',
      'Tamplar (contact cu banc lucru)',
      'Operator sortare',
      'Muncitor asamblare',
      'Casier (contact cu tejghea)'
    ],
    legalReference: 'ISO 11226:2000 - Evaluare posturi de lucru',
    category: 'environment'
  },
  {
    id: 'ERG-014',
    name: 'Iluminare Inadecvată',
    description: 'Nivel insuficient sau excesiv de iluminare la locul de muncă. Risc pentru oboseală vizuală, cefalee, greșeli de lucru, accidente.',
    assessmentMethod: 'Măsurători luxmetru conform SR EN 12464-1',
    thresholdValues: [
      {
        parameter: 'Iluminare birouri',
        value: '500',
        unit: 'lux (minim)',
        riskLevel: 'medium'
      },
      {
        parameter: 'Iluminare lucru fin',
        value: '750',
        unit: 'lux (minim)',
        riskLevel: 'medium'
      },
      {
        parameter: 'Uniformitate iluminare',
        value: '0.7',
        unit: 'Emin/Emed',
        riskLevel: 'medium'
      },
      {
        parameter: 'Indice orbire (UGR)',
        value: '19',
        unit: 'maxim',
        riskLevel: 'high'
      }
    ],
    preventiveMeasures: [
      'Sistem iluminare conform SR EN 12464-1',
      'Combinare iluminare generală + localizată',
      'Corpuri iluminat cu difuzor anti-orbire',
      'Temperatură culoare 4000K (alb neutru) pentru birouri',
      'Control orbire directă și reflectată',
      'Jaluzele/perdele pentru controlul luminii naturale',
      'Întreținere periodică (curățare, înlocuire becuri)',
      'Poziționare corecte posturi față de ferestre'
    ],
    applicableJobs: [
      'Toate posturile de lucru interior',
      'Control calitate (lucru fin)',
      'Operator producție precizie',
      'Bijutier',
      'Electronist',
      'Chirurg',
      'Designer',
      'Operator date'
    ],
    legalReference: 'SR EN 12464-1:2021 - Iluminatul locurilor de muncă',
    category: 'environment'
  },
  {
    id: 'ERG-015',
    name: 'Temperatură și Umiditate Inadecvată',
    description: 'Condiții termice inadecvate la locul de muncă (prea cald, prea rece, umiditate excesivă). Risc pentru deshidratare, hipotermie, disconfort termic, scădere performanță.',
    assessmentMethod: 'Indice WBGT + Indice PMV-PPD (ISO 7730)',
    thresholdValues: [
      {
        parameter: 'Temperatură confort iarnă',
        value: '20-24',
        unit: '°C',
        riskLevel: 'low'
      },
      {
        parameter: 'Temperatură confort vară',
        value: '23-26',
        unit: '°C',
        riskLevel: 'low'
      },
      {
        parameter: 'Umiditate relativă',
        value: '40-60',
        unit: '%',
        riskLevel: 'low'
      },
      {
        parameter: 'WBGT (lucru greu)',
        value: '28',
        unit: '°C',
        riskLevel: 'very_high'
      }
    ],
    preventiveMeasures: [
      'Sistem HVAC (heating, ventilation, air conditioning)',
      'Ventilatoare/climatizare în zonele fierbinți',
      'Încălzire adecvată în sezonul rece',
      'Îmbrăcăminte adecvată (echipament de protecție termic)',
      'Hidratare adecvată (acces la apă potabilă)',
      'Pauze în zone cu temperatură confort',
      'Reducerea efortului fizic în condiții extreme',
      'Program adaptat (ore mai răcoroase pentru lucru exterior)'
    ],
    applicableJobs: [
      'Muncitor topitorie/forjă',
      'Bucătar',
      'Lucrător depozit frigorific',
      'Muncitor construcții (exterior)',
      'Operator cuptor industrial',
      'Agricultor',
      'Paznic exterior',
      'Lucrător textile (spălătorie industrial)'
    ],
    legalReference: 'Legea 319/2006 + ISO 7243:2017 (WBGT)',
    category: 'environment'
  }
];

/**
 * Helper functions for risk assessment
 */

export const getErgonomicRiskById = (id: string): ErgonomicRisk | undefined => {
  return ergonomicRisks.find(risk => risk.id === id);
};

export const getErgonomicRisksByCategory = (category: ErgonomicRisk['category']): ErgonomicRisk[] => {
  return ergonomicRisks.filter(risk => risk.category === category);
};

export const getErgonomicRisksByJob = (jobTitle: string): ErgonomicRisk[] => {
  return ergonomicRisks.filter(risk =>
    risk.applicableJobs.some(job =>
      job.toLowerCase().includes(jobTitle.toLowerCase()) ||
      jobTitle.toLowerCase().includes(job.toLowerCase())
    )
  );
};

export const getHighRiskFactors = (): ErgonomicRisk[] => {
  return ergonomicRisks.filter(risk =>
    risk.thresholdValues.some(threshold =>
      threshold.riskLevel === 'high' || threshold.riskLevel === 'very_high'
    )
  );
};

/**
 * Risk assessment helper
 */
export const assessRiskLevel = (
  riskId: string,
  measuredValue: number,
  parameter: string
): { riskLevel: string; recommendation: string } | null => {
  const risk = getErgonomicRiskById(riskId);
  if (!risk) return null;

  const threshold = risk.thresholdValues.find(t => t.parameter === parameter);
  if (!threshold) return null;

  // Simplified risk assessment logic
  const thresholdValue = parseFloat(threshold.value);
  const exceedsThreshold = measuredValue >= thresholdValue;

  return {
    riskLevel: exceedsThreshold ? threshold.riskLevel : 'low',
    recommendation: exceedsThreshold
      ? `Valoarea măsurată (${measuredValue}) depășește pragul de ${threshold.value} ${threshold.unit}. Implementați imediat măsurile preventive.`
      : `Valoarea măsurată (${measuredValue}) este sub pragul de risc de ${threshold.value} ${threshold.unit}.`
  };
};

export default ergonomicRisks;
