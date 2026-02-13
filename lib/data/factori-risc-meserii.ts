/**
 * Factori de risc specifici pe meserii
 * Date pentru configurarea automată a riscurilor și echipamentelor de protecție
 * bazate pe COR (Clasificarea Ocupațiilor din România)
 */

export interface RiskFactor {
  factor: string;
  level: 'scazut' | 'mediu' | 'ridicat';
  source: string;
}

export interface JobRiskProfile {
  id: string;
  jobTitle: string;
  corCode: string;
  riskFactors: RiskFactor[];
  requiredEIP: string[];
  requiredTraining: string[];
  medicalExamFrequency: number; // luni
  specificInstructions: string[];
}

export const factoriRiscMeserii: JobRiskProfile[] = [
  {
    id: 'sudor',
    jobTitle: 'Sudor',
    corCode: '7212',
    riskFactors: [
      { factor: 'Radiații ultraviolete și infraroșii', level: 'ridicat', source: 'Arc electric' },
      { factor: 'Fum metalic și gaze nocive', level: 'ridicat', source: 'Proces sudare' },
      { factor: 'Zgomot', level: 'mediu', source: 'Echipamente' },
      { factor: 'Arsuri termice', level: 'ridicat', source: 'Piese incandescente' },
      { factor: 'Electrocutare', level: 'ridicat', source: 'Instalații electrice' },
      { factor: 'Poziții forțate', level: 'mediu', source: 'Poziție de lucru' },
    ],
    requiredEIP: [
      'Mască sudură cu filtru automat',
      'Mănuși sudor din piele',
      'Șorț sudor ignifug',
      'Bocanci cu bombeu metalic',
      'Ochelari de protecție',
      'Respirator P3 cu filtru carbon activ',
    ],
    requiredTraining: [
      'Instrucție PSI specifică sudori',
      'Lucru la înălțime (dacă este cazul)',
      'Lucru în spații închise',
      'Primul ajutor',
      'Utilizare echipamente de protecție',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Verificarea zilnică a echipamentului de sudură',
      'Ventilarea adecvată a spațiului de lucru',
      'Izolarea zonei de lucru cu paravane',
      'Verificarea cablurilor și conexiunilor electrice',
      'Utilizarea obligatorie a măștii cu filtru automat',
    ],
  },
  {
    id: 'electrician',
    jobTitle: 'Electrician',
    corCode: '7411',
    riskFactors: [
      { factor: 'Electrocutare', level: 'ridicat', source: 'Instalații electrice' },
      { factor: 'Arc electric', level: 'ridicat', source: 'Scurtcircuite' },
      { factor: 'Cădere de la înălțime', level: 'mediu', source: 'Lucru pe scări/platforme' },
      { factor: 'Arsuri', level: 'mediu', source: 'Supraîncălzire echipamente' },
      { factor: 'Contacte electrice indirecte', level: 'ridicat', source: 'Defecțiuni izolație' },
    ],
    requiredEIP: [
      'Cască protecție',
      'Mănuși dielectrice',
      'Bocanci dielectrici',
      'Ochelari de protecție',
      'Vestă reflectorizantă',
      'Centura scule izolate',
    ],
    requiredTraining: [
      'Autorizare electrician (ANRE)',
      'Lucru la înălțime',
      'Primul ajutor',
      'PSI specifică',
      'Proceduri descarcă/consemnare',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Verificarea absența tensiune înainte de intervenție',
      'Utilizarea doar scule izolate și certificate',
      'Consemnarea instalațiilor conform procedurilor',
      'Lucrul în echipă de minimum 2 persoane la tensiune',
      'Respectarea distanțelor de siguranță',
    ],
  },
  {
    id: 'sofer',
    jobTitle: 'Șofer transport marfă',
    corCode: '8332',
    riskFactors: [
      { factor: 'Accident rutier', level: 'ridicat', source: 'Trafic rutier' },
      { factor: 'Vibrații corp întreg', level: 'mediu', source: 'Vehicul' },
      { factor: 'Poziții forțate - șezând prelungit', level: 'mediu', source: 'Cabină' },
      { factor: 'Stres', level: 'mediu', source: 'Program, trafic' },
      { factor: 'Zgomot', level: 'scazut', source: 'Motor' },
      { factor: 'Manevrare manuală sarcini', level: 'mediu', source: 'Încărcare/descărcare' },
    ],
    requiredEIP: [
      'Vestă reflectorizantă',
      'Bocanci de protecție',
      'Mănuși de protecție (descărcare)',
      'Ochelari de soare',
    ],
    requiredTraining: [
      'Permis conducere categoria corespunzătoare',
      'Curs tahograf digital',
      'Curs ADR (transport mărfuri periculoase - dacă este cazul)',
      'Primul ajutor',
      'Securitate în trafic',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Respectarea timpilor de odihnă și condus',
      'Verificarea zilnică a stării tehnice a vehiculului',
      'Pauze regulate pentru mișcare',
      'Evitarea condusului în stare de oboseală',
      'Folosirea centurii de siguranță obligatoriu',
    ],
  },
  {
    id: 'lucrator-inaltime',
    jobTitle: 'Lucrător la înălțime',
    corCode: '7119',
    riskFactors: [
      { factor: 'Cădere de la înălțime', level: 'ridicat', source: 'Platforme, schele' },
      { factor: 'Cădere obiecte', level: 'ridicat', source: 'Scule, materiale' },
      { factor: 'Conditii meteorologice', level: 'mediu', source: 'Vânt, ploaie' },
      { factor: 'Efort fizic', level: 'mediu', source: 'Manevrare materiale' },
      { factor: 'Stres', level: 'mediu', source: 'Lucru la înălțime' },
    ],
    requiredEIP: [
      'Ham cu dispozitiv antișoc',
      'Cordă de siguranță cu absorbant șoc',
      'Cască de protecție',
      'Bocanci cu talpă antiderapantă',
      'Mănuși de protecție',
      'Vestă reflectorizantă',
    ],
    requiredTraining: [
      'Autorizare lucru la înălțime',
      'Verificare și întreținere echipamente alpinism utilitar',
      'Primul ajutor',
      'PSI specifică',
      'Proceduri salvare și evacuare',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Verificarea obligatorie a EPI înainte de fiecare utilizare',
      'Lucrul interzis la vânt peste 10 m/s',
      'Delimitarea zonei de lucru la sol',
      'Verificarea punctelor de ancorare',
      'Utilizarea permanentă a ham-ului de siguranță',
    ],
  },
  {
    id: 'operator-cnc',
    jobTitle: 'Operator mașini-unelte CNC',
    corCode: '7223',
    riskFactors: [
      { factor: 'Zgomot', level: 'ridicat', source: 'Mașină-unealtă' },
      { factor: 'Praf metalic', level: 'mediu', source: 'Prelucrare' },
      { factor: 'Uleiuri și emulsii', level: 'mediu', source: 'Lichid de răcire' },
      { factor: 'Vibrații mână-braț', level: 'scazut', source: 'Echipamente' },
      { factor: 'Proiectarea așchiilor', level: 'mediu', source: 'Proces prelucrare' },
      { factor: 'Poziții forțate', level: 'scazut', source: 'Poziție de lucru' },
    ],
    requiredEIP: [
      'Ochelari de protecție',
      'Căști antifonice',
      'Mănuși de protecție',
      'Bocanci de protecție',
      'Halat de protecție',
      'Mască respiratorie FFP2 (la praf intens)',
    ],
    requiredTraining: [
      'Operare mașini-unelte CNC',
      'Programare CNC nivel operator',
      'Primul ajutor',
      'PSI specifică',
      'Utilizare echipamente de protecție',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Oprirea mașinii la orice intervenție',
      'Verificarea dispozitivelor de siguranță',
      'Curățarea zilnică a așchiilor doar cu perie/suflantă',
      'Păstrarea distanței de siguranță în timpul procesării',
      'Folosirea obligatorie a ochelarilor de protecție',
    ],
  },
  {
    id: 'brutar',
    jobTitle: 'Brutar',
    corCode: '7512',
    riskFactors: [
      { factor: 'Arsuri termice', level: 'ridicat', source: 'Cuptor, tăvi fierbinți' },
      { factor: 'Microclimă caldă', level: 'mediu', source: 'Cuptor' },
      { factor: 'Praf de făină', level: 'mediu', source: 'Manipulare făină' },
      { factor: 'Efort fizic', level: 'mediu', source: 'Manevrare saci, tăvi' },
      { factor: 'Poziții forțate', level: 'mediu', source: 'Frământare, modelare' },
      { factor: 'Program nocturn', level: 'mediu', source: 'Program de lucru' },
    ],
    requiredEIP: [
      'Mănuși termorezistente',
      'Șorț ignifug',
      'Bocanci antiderapanți',
      'Bonetă/plasă păr',
      'Mască antipraf (la manipulare făină)',
    ],
    requiredTraining: [
      'PSI specifică brutărie',
      'Igienă alimentară HACCP',
      'Primul ajutor',
      'Manevrare manuală sarcini',
      'Utilizare echipamente brutărie',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Folosirea obligatorie mănușilor la scoaterea produselor din cuptor',
      'Verificarea temperaturii cuptorului înainte de introducere produs',
      'Aerisire adecvată a spațiului de lucru',
      'Pauze de hidratare în mediu cald',
      'Respectarea normelor de igienă alimentară',
    ],
  },
  {
    id: 'mecanic-auto',
    jobTitle: 'Mecanic auto',
    corCode: '7231',
    riskFactors: [
      { factor: 'Substanțe chimice nocive', level: 'ridicat', source: 'Uleiuri, solventi, antigel' },
      { factor: 'Zgomot', level: 'mediu', source: 'Scule pneumatice' },
      { factor: 'Vibrații mână-braț', level: 'mediu', source: 'Scule electrice' },
      { factor: 'Poziții forțate', level: 'ridicat', source: 'Poziție sub vehicul' },
      { factor: 'Efort fizic', level: 'mediu', source: 'Manevrare piese grele' },
      { factor: 'Strivire', level: 'mediu', source: 'Vehicule pe elevator' },
    ],
    requiredEIP: [
      'Mănuși rezistente chimice',
      'Bocanci de protecție',
      'Ochelari de protecție',
      'Halat de protecție',
      'Căști antifonice (scule pneumatice)',
      'Genunchere',
    ],
    requiredTraining: [
      'Mecanic auto - autorizare profesională',
      'Utilizare elevator auto',
      'Primul ajutor',
      'PSI specifică',
      'Manipulare substanțe chimice',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Verificarea stabilității vehiculului pe elevator',
      'Utilizarea obligatorie a suporturilor suplimentare',
      'Ventilarea atelierului la rularea motorului',
      'Spălarea mâinilor cu săpun special după lucru',
      'Depozitarea corectă a substanțelor chimice',
    ],
  },
  {
    id: 'zugrav-vopsitor',
    jobTitle: 'Zugrav-vopsitor',
    corCode: '7131',
    riskFactors: [
      { factor: 'Vapori organici', level: 'ridicat', source: 'Vopsele, diluanți' },
      { factor: 'Alergeni', level: 'mediu', source: 'Vopsele, lac' },
      { factor: 'Cădere de la înălțime', level: 'mediu', source: 'Scări, schele' },
      { factor: 'Poziții forțate', level: 'mediu', source: 'Lucru deasupra capului' },
      { factor: 'Contact cutanat substanțe', level: 'mediu', source: 'Vopsele' },
    ],
    requiredEIP: [
      'Mască respiratorie cu filtru A2',
      'Mănuși rezistente chimice',
      'Ochelari de protecție',
      'Halat/combinezon protecție',
      'Bocanci de protecție',
    ],
    requiredTraining: [
      'Lucru la înălțime',
      'Manipulare substanțe chimice',
      'Primul ajutor',
      'PSI specifică',
      'Utilizare echipamente protecție respiratorie',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Ventilarea obligatorie a spațiilor închise',
      'Utilizarea măștii la aplicarea vopselelor în solventi',
      'Evitarea contactului direct cu pielea',
      'Depozitarea vopselelor în spații ventilate',
      'Verificarea stabilității scărilor și schelelor',
    ],
  },
  {
    id: 'lacatus-mecanic',
    jobTitle: 'Lăcătuș mecanic',
    corCode: '7222',
    riskFactors: [
      { factor: 'Tăiere, înțepare', level: 'mediu', source: 'Scule, materiale' },
      { factor: 'Zgomot', level: 'mediu', source: 'Mașini unelte' },
      { factor: 'Vibrații', level: 'scazut', source: 'Scule electrice' },
      { factor: 'Praf metalic', level: 'scazut', source: 'Șlefuire' },
      { factor: 'Efort fizic', level: 'mediu', source: 'Manevrare piese' },
    ],
    requiredEIP: [
      'Ochelari de protecție',
      'Mănuși de protecție',
      'Bocanci de protecție',
      'Halat de protecție',
      'Căști antifonice (dacă este necesar)',
    ],
    requiredTraining: [
      'Utilizare mașini unelte',
      'Citire desen tehnic',
      'Primul ajutor',
      'PSI specifică',
    ],
    medicalExamFrequency: 24,
    specificInstructions: [
      'Verificarea stării sculelor înaintea utilizării',
      'Fixarea corectă a pieselor',
      'Curățarea așchiilor cu perie, nu manual',
      'Utilizarea ochelarilor la șlefuire',
    ],
  },
  {
    id: 'zidar',
    jobTitle: 'Zidar',
    corCode: '7112',
    riskFactors: [
      { factor: 'Cădere de la înălțime', level: 'ridicat', source: 'Schele' },
      { factor: 'Efort fizic intens', level: 'ridicat', source: 'Ridicare materiale' },
      { factor: 'Praf de ciment', level: 'mediu', source: 'Mortar, tencuială' },
      { factor: 'Poziții forțate', level: 'mediu', source: 'Aplicare mortar' },
      { factor: 'Dermatite', level: 'mediu', source: 'Contact ciment' },
      { factor: 'Condiții meteorologice', level: 'mediu', source: 'Lucru exterior' },
    ],
    requiredEIP: [
      'Cască de protecție',
      'Mănuși de protecție',
      'Bocanci de protecție',
      'Ham de siguranță (peste 2m)',
      'Genunchere',
      'Mască antipraf FFP2',
    ],
    requiredTraining: [
      'Lucru la înălțime',
      'Montare/demontare schele',
      'Primul ajutor',
      'PSI specifică',
      'Manevrare manuală sarcini',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Verificarea zilnică a schelelor',
      'Utilizarea ham-ului peste înălțimea de 2 metri',
      'Evitarea contactului prelungit cu cimentul',
      'Hidratare corespunzătoare',
      'Pauze regulate pentru odihnă',
    ],
  },
  {
    id: 'tamplar',
    jobTitle: 'Tâmplar',
    corCode: '7522',
    riskFactors: [
      { factor: 'Tăiere, înțepare', level: 'ridicat', source: 'Scule ascuțite, mașini' },
      { factor: 'Zgomot', level: 'ridicat', source: 'Mașini prelucrare lemn' },
      { factor: 'Praf de lemn', level: 'ridicat', source: 'Tăiere, șlefuire' },
      { factor: 'Vibrații', level: 'mediu', source: 'Scule electrice' },
      { factor: 'Vapori lacuri', level: 'mediu', source: 'Finisare' },
    ],
    requiredEIP: [
      'Ochelari de protecție',
      'Căști antifonice',
      'Mască antipraf P2',
      'Mănuși de protecție',
      'Bocanci de protecție',
      'Șorț de protecție',
    ],
    requiredTraining: [
      'Utilizare mașini prelucrare lemn',
      'PSI specifică',
      'Primul ajutor',
      'Manipulare substanțe chimice (lacuri)',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Verificarea dispozitivelor de protecție pe mașini',
      'Utilizarea empingătoarelor la mașini',
      'Oprirea mașinii înainte de orice intervenție',
      'Ventilarea atelierului',
      'Purtarea obligatorie a ochelarilor și căștilor',
    ],
  },
  {
    id: 'instalator',
    jobTitle: 'Instalator instalații sanitare',
    corCode: '7126',
    riskFactors: [
      { factor: 'Arsuri', level: 'mediu', source: 'Lipit țevi, apă fierbinte' },
      { factor: 'Tăiere', level: 'mediu', source: 'Scule ascuțite' },
      { factor: 'Poziții forțate', level: 'ridicat', source: 'Spații înguste' },
      { factor: 'Lucru în spații închise', level: 'mediu', source: 'Fose, canale' },
      { factor: 'Contact substanțe chimice', level: 'scazut', source: 'Adezivi, etanșanți' },
    ],
    requiredEIP: [
      'Mănuși de protecție',
      'Ochelari de protecție',
      'Bocanci de protecție',
      'Genunchere',
      'Mască respiratorie (spații închise)',
    ],
    requiredTraining: [
      'Autorizare instalator',
      'Lucru în spații închise',
      'Primul ajutor',
      'PSI specifică',
    ],
    medicalExamFrequency: 24,
    specificInstructions: [
      'Verificarea spațiilor închise înainte de intrare',
      'Utilizarea mănușilor termorezistente la lipit',
      'Ventilarea adecvată în spații închise',
      'Asigurarea căilor de evacuare',
    ],
  },
  {
    id: 'macaragiu',
    jobTitle: 'Macaragiu',
    corCode: '8343',
    riskFactors: [
      { factor: 'Cădere sarcini', level: 'ridicat', source: 'Manipulare' },
      { factor: 'Răsturnare macara', level: 'ridicat', source: 'Suprasarcină, teren' },
      { factor: 'Electrocutare', level: 'ridicat', source: 'Linii electrice' },
      { factor: 'Stres', level: 'mediu', source: 'Responsabilitate' },
      { factor: 'Poziții forțate', level: 'scazut', source: 'Cabină' },
      { factor: 'Vibrații', level: 'scazut', source: 'Utilaj' },
    ],
    requiredEIP: [
      'Cască de protecție',
      'Vestă reflectorizantă',
      'Bocanci de protecție',
      'Mănuși de protecție',
    ],
    requiredTraining: [
      'Autorizare macaragiu ISCIR',
      'Semnalizare în construcții',
      'Primul ajutor',
      'PSI specifică',
      'Proceduri de urgență',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Verificarea zilnică a macaralei (carte verificare)',
      'Verificarea stabilității terenului',
      'Respectarea sarcinii maxime admise',
      'Menținerea distanței de siguranță față de linii electrice',
      'Comunicare radio/semnale cu personalul la sol',
    ],
  },
  {
    id: 'frigotehnist',
    jobTitle: 'Frigotehnist',
    corCode: '7127',
    riskFactors: [
      { factor: 'Gaze frigorifice', level: 'ridicat', source: 'Agent frigorific' },
      { factor: 'Electrocutare', level: 'mediu', source: 'Instalații electrice' },
      { factor: 'Arsuri prin frig', level: 'mediu', source: 'Contact agent frigorific' },
      { factor: 'Presiune înaltă', level: 'mediu', source: 'Sistem frigorific' },
      { factor: 'Poziții forțate', level: 'mediu', source: 'Spații înguste' },
    ],
    requiredEIP: [
      'Mănuși de protecție',
      'Ochelari de protecție',
      'Bocanci de protecție',
      'Mănuși criogenice',
      'Mască respiratorie (intervențiі)',
    ],
    requiredTraining: [
      'Autorizare frigotehnist ISCIR',
      'Manipulare gaze frigorifice',
      'Primul ajutor',
      'PSI specifică',
      'Lucru în spații închise',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Verificarea lipsei scurgerilor înaintea intervenției',
      'Ventilarea spațiului de lucru',
      'Utilizarea echipamentului de detectare scurgeri',
      'Recuperarea gazelor frigorifice conform legislației',
      'Evitarea contactului direct cu agentul frigorific',
    ],
  },
  {
    id: 'operator-depozit',
    jobTitle: 'Operator depozit cu stivuitor',
    corCode: '9333',
    riskFactors: [
      { factor: 'Accidente cu stivuitorul', level: 'ridicat', source: 'Circulație' },
      { factor: 'Cădere sarcini', level: 'ridicat', source: 'Manipulare' },
      { factor: 'Lovire de obiecte', level: 'mediu', source: 'Depozit' },
      { factor: 'Vibrații', level: 'scazut', source: 'Stivuitor' },
      { factor: 'Zgomot', level: 'scazut', source: 'Motor stivuitor' },
      { factor: 'Efort fizic', level: 'mediu', source: 'Încărcare/descărcare manuală' },
    ],
    requiredEIP: [
      'Cască de protecție',
      'Vestă reflectorizantă',
      'Bocanci de protecție',
      'Mănuși de protecție',
    ],
    requiredTraining: [
      'Autorizare operator stivuitor ISCIR',
      'Manipulare manuală sarcini',
      'Primul ajutor',
      'PSI specifică',
      'Semnalizare depozit',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Verificarea zilnică a stivuitorului',
      'Respectarea capacității de încărcare',
      'Semnalizare sonoră la mers înapoi',
      'Viteza redusă în depozit',
      'Interzicerea transportului de persoane',
    ],
  },
  {
    id: 'croitor',
    jobTitle: 'Croitor industrial',
    corCode: '7535',
    riskFactors: [
      { factor: 'Înțepare, tăiere', level: 'mediu', source: 'Ace, foarfece, cuțite' },
      { factor: 'Zgomot', level: 'mediu', source: 'Mașini de cusut industriale' },
      { factor: 'Vibrații', level: 'scazut', source: 'Mașini de cusut' },
      { factor: 'Poziții forțate', level: 'ridicat', source: 'Poziție șezând prelungit' },
      { factor: 'Iluminat inadecvat', level: 'scazut', source: 'Lucru de precizie' },
      { factor: 'Mișcări repetitive', level: 'mediu', source: 'Cusut' },
    ],
    requiredEIP: [
      'Degetar metalic',
      'Mănuși protecție (la tăiere)',
      'Ochelari protecție (dacă necesar)',
      'Scaun ergonomic',
    ],
    requiredTraining: [
      'Utilizare mașini cusut industriale',
      'PSI specifică',
      'Primul ajutor',
      'Ergonomie la locul de muncă',
    ],
    medicalExamFrequency: 24,
    specificInstructions: [
      'Pauze regulate pentru mișcare (fiecare 2 ore)',
      'Poziție corectă de lucru',
      'Iluminat adecvat (minimum 500 lux)',
      'Verificarea acelor și a sistemului de siguranță',
      'Evitarea atingerii acului în timpul funcționării',
    ],
  },
  {
    id: 'curier',
    jobTitle: 'Curier',
    corCode: '9621',
    riskFactors: [
      { factor: 'Accident rutier', level: 'ridicat', source: 'Trafic' },
      { factor: 'Efort fizic', level: 'mediu', source: 'Cărat colete' },
      { factor: 'Condiții meteorologice', level: 'mediu', source: 'Exterior' },
      { factor: 'Stres', level: 'mediu', source: 'Termene livrare' },
      { factor: 'Agresiune', level: 'scazut', source: 'Contact public' },
      { factor: 'Mușcături animale', level: 'scazut', source: 'Câini' },
    ],
    requiredEIP: [
      'Vestă reflectorizantă',
      'Bocanci de protecție',
      'Mănuși de protecție',
      'Cască (pentru biciclete/scutere)',
      'Echipament ploaie',
    ],
    requiredTraining: [
      'Permis conducere (dacă este cazul)',
      'Prim ajutor',
      'Manipulare manuală sarcini',
      'PSI specifică',
      'Securitate în trafic',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Respectarea regulilor de circulație',
      'Pauze regulate',
      'Tehnici corecte de ridicare sarcini',
      'Evitarea supraîncărcării',
      'Precauție la câini agresivi',
    ],
  },
  {
    id: 'ospatar',
    jobTitle: 'Ospătar',
    corCode: '5120',
    riskFactors: [
      { factor: 'Arsuri', level: 'mediu', source: 'Preparate fierbinți' },
      { factor: 'Tăiere', level: 'scazut', source: 'Sticlă spartă' },
      { factor: 'Alunecare, cădere', level: 'mediu', source: 'Pardoseli ude' },
      { factor: 'Efort fizic', level: 'mediu', source: 'Cărat tăvi' },
      { factor: 'Program prelungit', level: 'mediu', source: 'Program lucru' },
      { factor: 'Stres', level: 'mediu', source: 'Contact clienți' },
    ],
    requiredEIP: [
      'Pantofi antiderapanți',
      'Șorț',
      'Mănuși termice (dacă transportă farfurii fierbinți)',
    ],
    requiredTraining: [
      'Igienă alimentară HACCP',
      'Prim ajutor',
      'PSI specifică',
      'Tehnici servire',
      'Comunicare clienți',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Atenție la transportul preparatelor fierbinți',
      'Curățarea imediată a lichidelor vărsate',
      'Colectare sticlă spartă cu mătură, nu manual',
      'Igienă mâini frecventă',
      'Pauze de odihnă',
    ],
  },
  {
    id: 'ospatar-bucatar',
    jobTitle: 'Bucătar',
    corCode: '5120',
    riskFactors: [
      { factor: 'Arsuri', level: 'ridicat', source: 'Plită, cuptor, ulei fierbinte' },
      { factor: 'Tăiere', level: 'ridicat', source: 'Cuțite, mașini tăiat' },
      { factor: 'Alunecare', level: 'mediu', source: 'Pardoseală unsuroasă' },
      { factor: 'Microclimă caldă', level: 'ridicat', source: 'Bucătărie' },
      { factor: 'Stres', level: 'ridicat', source: 'Program intens, comenzi' },
      { factor: 'Efort fizic', level: 'mediu', source: 'Stat prelungit în picioare' },
    ],
    requiredEIP: [
      'Mănuși termice',
      'Șorț ignifug',
      'Pantofi antiderapanți închisi',
      'Bonetă/plasă păr',
      'Mănuși tăiere (la pregătit)',
    ],
    requiredTraining: [
      'Igienă alimentară HACCP',
      'PSI specifică bucătărie',
      'Prim ajutor',
      'Utilizare echipamente bucătărie',
      'Manipulare substanțe periculoase (detergenți)',
    ],
    medicalExamFrequency: 12,
    specificInstructions: [
      'Utilizare obligatorie mănuși termice la cuptor/plită',
      'Cuțite ascuțite și depozitate corect',
      'Curățare imediată a scurgerilor',
      'Ventilație adecvată',
      'Hidratare frecventă',
      'Verificarea instalației de gaz',
    ],
  },
  {
    id: 'ingrijitor-cladiri',
    jobTitle: 'Îngrijitor clădiri',
    corCode: '9112',
    riskFactors: [
      { factor: 'Substanțe chimice', level: 'mediu', source: 'Detergenți, dezinfectanți' },
      { factor: 'Alergeni', level: 'mediu', source: 'Praf, acarieni' },
      { factor: 'Efort fizic', level: 'mediu', source: 'Curățenie, mutare mobilier' },
      { factor: 'Poziții forțate', level: 'mediu', source: 'Măturat, șters' },
      { factor: 'Alunecare', level: 'mediu', source: 'Pardoseli ude' },
      { factor: 'Mișcări repetitive', level: 'mediu', source: 'Curățenie' },
    ],
    requiredEIP: [
      'Mănuși de protecție rezistente chimice',
      'Șorț de protecție',
      'Bocanci antiderapanți',
      'Mască respiratorie (la praf intens)',
      'Ochelari protecție (la substanțe chimice)',
    ],
    requiredTraining: [
      'Manipulare substanțe chimice',
      'PSI specifică',
      'Prim ajutor',
      'Manevrare manuală sarcini',
      'Tehnici curățenie profesională',
    ],
    medicalExamFrequency: 24,
    specificInstructions: [
      'Citirea etichetelor produselor chimice',
      'Evitarea amestecării detergenților',
      'Ventilarea spațiilor în timpul curățeniei',
      'Semnalizare pardoseli ude',
      'Tehnici ergonomice de lucru',
    ],
  },
];

/**
 * Helper function to get risk profile by job ID
 */
export function getRiskProfileById(id: string): JobRiskProfile | undefined {
  return factoriRiscMeserii.find((profile) => profile.id === id);
}

/**
 * Helper function to get risk profile by COR code
 */
export function getRiskProfileByCorCode(corCode: string): JobRiskProfile | undefined {
  return factoriRiscMeserii.find((profile) => profile.corCode === corCode);
}

/**
 * Helper function to search risk profiles by job title
 */
export function searchRiskProfiles(searchTerm: string): JobRiskProfile[] {
  const lowerSearch = searchTerm.toLowerCase();
  return factoriRiscMeserii.filter((profile) =>
    profile.jobTitle.toLowerCase().includes(lowerSearch)
  );
}

/**
 * Helper function to get all high-risk jobs
 */
export function getHighRiskJobs(): JobRiskProfile[] {
  return factoriRiscMeserii.filter((profile) =>
    profile.riskFactors.some((factor) => factor.level === 'ridicat')
  );
}

/**
 * Helper function to get jobs requiring specific training
 */
export function getJobsRequiringTraining(trainingType: string): JobRiskProfile[] {
  const lowerTraining = trainingType.toLowerCase();
  return factoriRiscMeserii.filter((profile) =>
    profile.requiredTraining.some((training) => training.toLowerCase().includes(lowerTraining))
  );
}
