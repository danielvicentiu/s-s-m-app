/**
 * Model de instrucțiuni proprii SSM pentru diverse domenii de activitate
 * Utilizat pentru generarea rapidă de instrucțiuni de lucru personalizate
 */

export type InstructiuneProprie = {
  id: string;
  title: string;
  domain: 'birou' | 'santier' | 'depozit' | 'productie' | 'laborator';
  sections: {
    title: string;
    content: string;
  }[];
  legalBasis: string;
  revisionPeriodMonths: number;
};

export const instructiuniProprii: InstructiuneProprie[] = [
  {
    id: 'ip-001',
    title: 'Instrucțiune de lucru la calculator',
    domain: 'birou',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Prezenta instrucțiune stabilește regulile de securitate și sănătate în muncă pentru personalul care lucrează la calculator, în vederea prevenirii afecțiunilor musculo-scheletice, oculare și a oboselii generale.'
      },
      {
        title: '2. Domeniul de aplicare',
        content: 'Instrucțiunea se aplică tuturor angajaților care lucrează la calculator minimum 4 ore pe zi.'
      },
      {
        title: '3. Amenajarea locului de muncă',
        content: '- Monitorul trebuie poziționat la 50-70 cm distanță de ochi\n- Partea superioară a ecranului la nivelul ochilor sau ușor sub\n- Scaunul reglabil în înălțime, cu spătar pentru zona lombară\n- Picioarele sprijinite complet pe podea sau pe suport\n- Iluminat natural și artificial adecvat, fără reflex pe monitor'
      },
      {
        title: '4. Organizarea timpului de lucru',
        content: '- Pauză de 10-15 minute la fiecare 2 ore de lucru continuu\n- Exerciții pentru ochi la fiecare oră (privit la distanță)\n- Schimbarea poziției corpului periodic\n- Evitarea posturii statice prelungite'
      },
      {
        title: '5. Măsuri de prevenire',
        content: '- Verificarea zilnică a funcționării echipamentului\n- Raportarea imediată a defecțiunilor\n- Utilizarea unui suport pentru documente la aceeași înălțime cu monitorul\n- Menținerea curățeniei la locul de muncă'
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006',
    revisionPeriodMonths: 24
  },
  {
    id: 'ip-002',
    title: 'Instrucțiune pentru lucrul în spații închise',
    domain: 'productie',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de SSM pentru lucrătorii care desfășoară activități în spații închise (rezervoare, silozuri, puțuri, canale) unde există risc de intoxicare, asfixiere sau explozie.'
      },
      {
        title: '2. Condiții prealabile',
        content: '- Permis de lucru emis și valabil\n- Verificarea atmosferei (O2 > 19%, combustibili < 10% LEL, toxice < LPE)\n- Echipament de protecție adecvat disponibil\n- Echipă de intervenție pregătită la exterior'
      },
      {
        title: '3. Echipament de protecție',
        content: '- Ham de siguranță cu coardă de salvare\n- Aparat de respirat autonom sau cu aducțiune de aer\n- Detector portabil multi-gaz\n- Comunicare permanentă (radio/visual)\n- Iluminat de siguranță antiex'
      },
      {
        title: '4. Procedura de lucru',
        content: '- Ventilare prealabilă minimum 30 minute\n- Izolarea spațiului de toate sursele\n- Intrare numai după autorizare explicită\n- Prezența obligatorie a supraveghetorului la exterior\n- Monitorizare continuă a atmosferei'
      },
      {
        title: '5. Procedura de urgență',
        content: '- La primul semn de pericol, evacuare immediată\n- Apel 112 și servicii interne de urgență\n- Salvarea victimei doar cu echipament corespunzător\n- Acordarea primului ajutor\n- Raportarea incidentului'
      }
    ],
    legalBasis: 'Legea 319/2006, OSHA Confined Spaces Standard',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-003',
    title: 'Instrucțiune pentru utilizarea stivuitoarelor',
    domain: 'depozit',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea regulilor de siguranță pentru operatorii de stivuitoare în vederea prevenirii accidentelor de muncă și avarierii materialelor.'
      },
      {
        title: '2. Condiții pentru operator',
        content: '- Certificat de operator stivuitor valabil\n- Autorizație de lucru pentru echipamentul respectiv\n- Examen medical periodic la zi\n- Instruire SSM specifică'
      },
      {
        title: '3. Verificări înainte de utilizare',
        content: '- Stare generală: anvelope, frâne, direcție\n- Funcționare furci, lanțuri, cilindri hidraulici\n- Claxon, lumini, semnalizare sonoră marsarier\n- Nivel lichide: ulei hidraulic, combustibil, agent răcire\n- Verificare carnet service și întreținere'
      },
      {
        title: '4. Reguli de operare',
        content: '- Viteză maximă 10 km/h în spații închise\n- Deplasare cu furcile coborâte la 15-20 cm de sol\n- La ridicare: sarcina centrată, înclinare ușoară înapoi\n- Interzis transportul persoanelor\n- Claxonare la colțuri și intersecții\n- Respectarea capacității nominale de ridicare'
      },
      {
        title: '5. Interdicții',
        content: '- Operare sub influența alcoolului/drogurilor\n- Ridicarea sarcinilor peste capacitatea maximă\n- Staționare sub sarcini suspendate\n- Utilizarea stivuitorului ca lift pentru persoane\n- Manevre bruște sau cu viteză excesivă'
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1146/2006',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-004',
    title: 'Instrucțiune pentru lucrul la înălțime',
    domain: 'santier',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de protecție pentru lucrătorii care desfășoară activități la înălțime mai mare de 2 metri, în vederea prevenirii accidentelor prin cădere.'
      },
      {
        title: '2. Echipament de protecție individuală',
        content: '- Ham de siguranță integral (corp întreg)\n- Coardă de siguranță cu amortizor de șoc\n- Dispozitiv de ancorare certificat\n- Cască de protecție cu jugulară\n- Încălțăminte de protecție antiderapantă\n- Mănuși de protecție'
      },
      {
        title: '3. Verificări prealabile',
        content: '- Starea schelei/platformei/scării (stabilitate, protecții laterale)\n- Condiții meteo (vânt < 60 km/h, fără ploaie/gheață)\n- Verificarea echipamentului de protecție (ham, corzi, carabiniere)\n- Marcarea și delimitarea zonei de lucru la sol\n- Identificarea punctelor de ancorare certificate'
      },
      {
        title: '4. Reguli de lucru',
        content: '- Ancorare permanentă pe durata lucrului\n- Utilizare scule legate/prinse de operator\n- Ridicare materiale doar cu mijloace adecvate (macara, lift)\n- Comunicare permanentă cu solul\n- Maximum 2 persoane pe platformă (conform certificat)\n- Interzis aruncarea obiectelor/sculelor de la înălțime'
      },
      {
        title: '5. Situații de urgență',
        content: '- Oprirea imediată a lucrului în caz de vijelie/furtună\n- Evacuare calmă și controlată\n- Plan de salvare pentru persoane suspendate în ham\n- Apelare 112 și servicii medicale interne\n- Raportare incidente/situații periculoase'
      }
    ],
    legalBasis: 'Legea 319/2006, HG 300/2006',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-005',
    title: 'Instrucțiune pentru manipularea substanțelor chimice',
    domain: 'laborator',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de protecție pentru personalul care manipulează substanțe chimice periculoase în vederea prevenirii intoxicațiilor, arsurilor și leziunilor.'
      },
      {
        title: '2. Identificare și etichetare',
        content: '- Toate substanțele trebuie etichetate conform CLP\n- Verificarea FDS (Fișă Date Securitate) înainte de utilizare\n- Identificare pictograme pericol: toxic, corosiv, inflamabil, etc.\n- Utilizare registru substanțe chimice actualizat'
      },
      {
        title: '3. Echipament de protecție',
        content: '- Halat de laborator rezistent chimic\n- Ochelari de protecție sau vizor facial\n- Mănuși rezistente chimic (conform FDS)\n- Mască respiratorie cu filtru specific (când este necesar)\n- Încălțăminte închisă, antiderapantă'
      },
      {
        title: '4. Manipulare și stocare',
        content: '- Lucru doar sub nișă cu ventilație\n- Transvazare lentă, evitare stropituri\n- Stocare separată substanțe incompatibile\n- Recipiente închise etanș când nu se folosesc\n- Depozitare la temperatură și umiditate conform FDS\n- Verificare periodică integritate ambalaje'
      },
      {
        title: '5. Proceduri de urgență',
        content: '- Kit de deversări accidentale disponibil și verificat\n- Dușuri de siguranță și spălători oculare funcționale\n- Procedură evacuare și izolare zonă contaminată\n- Contactare 112 și medic de medicina muncii\n- Neutralizare și eliminare conform legislației'
      }
    ],
    legalBasis: 'Legea 319/2006, Regulamentul CLP, HG 1218/2006',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-006',
    title: 'Instrucțiune pentru prevenirea incendiilor în birouri',
    domain: 'birou',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de prevenire și stingere a incendiilor în spații de birouri în vederea protejării vieții și bunurilor.'
      },
      {
        title: '2. Măsuri de prevenire',
        content: '- Interzis fumatul în afara zonelor special amenajate\n- Verificare zilnică deconectare aparate electrice (sfârșit program)\n- Folosirea prelungitorilor doar temporar, nu permanent\n- Depozitare materiale combustibile la minimum 1m de surse căldură\n- Menținere căi de evacuare libere și semnalizate'
      },
      {
        title: '3. Mijloace de stingere',
        content: '- Stingătoare verificate periodic (etichetă validitate)\n- Minimum 1 stingător la 200 mp sau max 20m distanță\n- Hidranți interiori verificați semestrial\n- Instalație detecție/alarmare funcțională\n- Verificare lunară baterii în lămpi de siguranță'
      },
      {
        title: '4. Procedură de evacuare',
        content: '- La auzirea alarmei, oprire echipamente și părăsire calmă\n- Folosire căi de evacuare marcate (NU lift)\n- Închidere uși și ferestre (fără încuiere)\n- Adunare la punctul de întâlnire stabilit\n- Apel 112 și raportare responsabil SSM/PSI'
      },
      {
        title: '5. Responsabilități',
        content: '- Ultima persoană din birou verifică deconectarea aparatelor\n- Responsabil etaj verifică toate birourile la final de zi\n- Raportare imediată defecțiuni instalații electrice\n- Participare obligatorie la exercițiile de evacuare\n- Cunoașterea locației stingătoarelor și a căilor de evacuare'
      }
    ],
    legalBasis: 'Legea 307/2006, Ordinul MAI 163/2007',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-007',
    title: 'Instrucțiune pentru utilizarea sculelor electrice portabile',
    domain: 'productie',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea regulilor de siguranță pentru utilizarea sculelor electrice portabile (bormasini, polizoare, ferăstraie) în vederea prevenirii electrocutării, tăieturilor și altor accidente.'
      },
      {
        title: '2. Verificări înainte de utilizare',
        content: '- Stare cablu alimentare (fără tăieturi, îndoituri)\n- Funcționare întrerupător pornire/oprire\n- Stare carcase, fără fisuri\n- Fixare corectă accesorii (burghie, discuri)\n- Verificare etichetă verificare tehnică periodică'
      },
      {
        title: '3. Echipament de protecție',
        content: '- Ochelari de protecție obligatoriu\n- Mănuși de protecție (conform tip lucrare)\n- Apărătoare auditivă (dacă zgomot > 85 dB)\n- Mască antipraf (la șlefuire, polizare)\n- Încălțăminte de protecție cu bombeu'
      },
      {
        title: '4. Reguli de utilizare',
        content: '- Alimentare doar de la prize cu protecție diferențială\n- Fixare piesă de prelucrat în dispozitiv, nu menținere cu mâna\n- Așteptare oprire completă înainte de depunere sculă\n- Interzis scoaterea protecțiilor\n- Lucru cu ambele mâini pe mânere\n- Pauze regulate pentru evitarea oboselii'
      },
      {
        title: '5. Interdicții și situații de urgență',
        content: '- Interzis utilizarea cu mâini umede/ude\n- Interzis folosirea în atmosfere explosive\n- Oprire imediată la fum/miros ars\n- La accident: oprire sursă electrică, apel 112\n- Raportare defecțiuni și retragere din uz'
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1146/2006',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-008',
    title: 'Instrucțiune pentru activități de depozitare pe rafturi înalte',
    domain: 'depozit',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea regulilor de siguranță pentru depozitarea și manipularea materialelor pe rafturi înalte în vederea prevenirii accidentelor prin cădere obiecte sau prăbușire rafturi.'
      },
      {
        title: '2. Organizarea depozitului',
        content: '- Rafturi ancorate conform instrucțiunilor producătorului\n- Marcaj capacitate maximă pe raft vizibil\n- Culoare de circulație marcate și libere (min 1,2m lățime)\n- Verificare lunară stabilitate rafturi și fixări\n- Iluminat adecvat în toate zonele'
      },
      {
        title: '3. Reguli de depozitare',
        content: '- Obiecte grele pe rafturile inferioare\n- Depozitare paleți uniform încărcați\n- Respectare strictă capacitate maximă pe nivel\n- Distanță minimum 1m față de corpuri iluminat/sprinklere\n- Materiale lungi depozitate pe suporți speciali'
      },
      {
        title: '4. Manipulare și ridicare',
        content: '- Folosire exclusiv stivuitor/transpalet pentru sarcini > 25kg\n- Verificare stabilitate sarcină înainte de ridicare\n- Ridicare și coborâre lentă, fără mișcări bruște\n- Interzis escaladarea rafturilor\n- Utilizare scări/platforme mobile pentru accesare nivele înalte'
      },
      {
        title: '5. Inspecții și întreținere',
        content: '- Verificare zilnică vizuală stare generală\n- Raportare imediată șuruburi lipsă, stalpi îndoiți\n- Verificare trimestrială de către responsabil depozit\n- Control anual de către firmă specializată\n- Înregistrare verificări în registru'
      }
    ],
    legalBasis: 'Legea 319/2006, SR EN 15635:2009',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-009',
    title: 'Instrucțiune pentru lucrul cu echipamente sub presiune',
    domain: 'productie',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de siguranță pentru utilizarea echipamentelor sub presiune (aer comprimat, abur, gaze) în vederea prevenirii exploziilor și accidentelor.'
      },
      {
        title: '2. Condiții de utilizare',
        content: '- Personal calificat și autorizat\n- Echipamente cu verificare tehnică valabilă (ISCIR)\n- Manometre și supape de siguranță verificate periodic\n- Fișă tehnică și instrucțiuni de exploatare disponibile\n- Jurnal de exploatare completat zilnic'
      },
      {
        title: '3. Verificări zilnice',
        content: '- Control vizual înveliș, conducte, racorduri\n- Verificare funcționare manometre\n- Test funcționare supape siguranță\n- Evacuare condensat din rezervoare\n- Verificare niveluri ulei, apă răcire'
      },
      {
        title: '4. Reguli de operare',
        content: '- Respectare strictă presiune de lucru maximă\n- Creștere treptată presiune la pornire\n- Interzis intervenții sub presiune\n- Depresurare completă înainte de orice revizie\n- Blocare ventile izolare cu lacăt la intervenții'
      },
      {
        title: '5. Situații de urgență',
        content: '- La creștere anormală presiune: oprire și evacuare presiune\n- La scurgeri: izolare sector și depresurare\n- Evacuare personal la zgomote neobișnuite\n- Apelare 112 și responsabil tehnic\n- Interzis repornire fără verificare cauză'
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1146/2006, Regulament ISCIR',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-010',
    title: 'Instrucțiune pentru gestionarea deșeurilor periculoase',
    domain: 'laborator',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea procedurii de colectare, stocare și eliminare a deșeurilor periculoase în conformitate cu legislația de mediu și SSM.'
      },
      {
        title: '2. Clasificare deșeuri',
        content: '- Identificare conform catalogului deșeurilor\n- Etichetare clară: tip deșeu, pictograme pericol, dată\n- Separare deșeuri incompatibile\n- Completare FIR (Fișă Identificare Reziduuri)\n- Registru deșeuri actualizat lunar'
      },
      {
        title: '3. Colectare și stocare',
        content: '- Recipiente rezistente, etanșe, compatibile cu deșeul\n- Depozitare în zonă marcată, ventilată\n- Tăviți de retenție sub recipiente lichide\n- Acces restricționat, personal instruit\n- Stingătoare adecvate în apropiere\n- Maximum 90 zile stocare la producător'
      },
      {
        title: '4. Echipament de protecție',
        content: '- Mănuși rezistente chimic\n- Ochelari protecție\n- Halat sau combinezon\n- Mască respiratorie (când este necesar)\n- Încălțăminte protecție chimică'
      },
      {
        title: '5. Transport și eliminare',
        content: '- Doar firme autorizate pentru ridicare\n- Întocmire BTA (Bon Transport Autorizat)\n- Păstrare documente 5 ani\n- Raportare anuală APM\n- Verificare destinație finală autorizată'
      }
    ],
    legalBasis: 'Legea 211/2011, HG 856/2002, Ordinul 95/2005',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-011',
    title: 'Instrucțiune pentru prevenirea accidentelor rutiere la volanul autovehiculelor de serviciu',
    domain: 'birou',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea regulilor de siguranță pentru conducătorii auto din cadrul companiei în vederea prevenirii accidentelor rutiere și asigurării securității.'
      },
      {
        title: '2. Condiții pentru conducător',
        content: '- Permis de conducere valabil pentru categoria respectivă\n- Examen medical pentru șoferi profesionisti la zi\n- Interzis conducerea sub influența alcoolului/drogurilor\n- Odihnă adecvată (min 8h somn înainte ture lungi)\n- Declarare medicamente care afectează vigilența'
      },
      {
        title: '3. Verificări înainte de plecare',
        content: '- Controlul vizual anvelope, lumini, oglinzi\n- Verificare niveluri: ulei, lichid frână, răcire\n- Funcționare frâne, direcție, claxon\n- Prezență triunghi, stingător, trusă medicală\n- Verificare ITP și RCA valabile'
      },
      {
        title: '4. Reguli de conducere',
        content: '- Respectarea strictă a regulilor de circulație\n- Viteză adaptată condițiilor (meteo, trafic, drum)\n- Pauză 15 min la fiecare 2h conducere\n- Utilizare centuri siguranță șofer și pasageri\n- Interzis folosirea telefonului fără hands-free\n- Respectare program odihnă (max 9h conducere/zi)'
      },
      {
        title: '5. Procedură în caz de accident',
        content: '- Oprire, semnalizare, asigurare loc accident\n- Acordare prim ajutor victimelor\n- Apelare 112 (poliție, ambulanță)\n- Anunțare imediată responsabil direct și asigurător\n- Completare constat amiabil\n- Raportare eveniment către SSM'
      }
    ],
    legalBasis: 'Legea 319/2006, OUG 195/2002 (circulație rutieră)',
    revisionPeriodMonths: 24
  },
  {
    id: 'ip-012',
    title: 'Instrucțiune pentru sudare și tăiere cu oxigaz',
    domain: 'santier',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de protecție pentru lucrătorii care efectuează operațiuni de sudare și tăiere cu oxigaz în vederea prevenirii incendiilor, exploziilor și arsurilor.'
      },
      {
        title: '2. Condiții pentru sudor',
        content: '- Autorizație/certificat sudor valabil\n- Examen medical periodic la zi\n- Instruire SSM și PSI specifică\n- Permis de lucru cu foc în zone cu risc\n- Pregătire pentru acordare prim ajutor'
      },
      {
        title: '3. Echipament de protecție',
        content: '- Mască de sudură cu filtru automat (DIN 9-13)\n- Mănuși sudor din piele prelungite\n- Sort și jambiere din piele\n- Încălțăminte S3 HI rezistentă căldură\n- Îmbrăcăminte ignifugă, fără buzunare deschise'
      },
      {
        title: '4. Pregătirea locului de muncă',
        content: '- Îndepărtare materiale combustibile în rază 10m\n- Protejare materiale care nu pot fi mutate\n- Verificare absența gaze/vapori inflamabili\n- Asigurare ventilație adecvată\n- Stingătoare și mijloace PSI pregătite\n- Persoană desemnată pentru supravegherea focului'
      },
      {
        title: '5. Reguli de utilizare echipament',
        content: '- Verificare furtunuri (fără fisuri, uzuri)\n- Stocare separate butelii oxigen și acetilena (min 5m)\n- Fixare butelii vertical cu lanț/clemă\n- Deschidere treptată ventile\n- Închidere ventile și eliberare presiune după terminare\n- Supraveghere loc 1h după finalizare lucrări'
      }
    ],
    legalBasis: 'Legea 319/2006, Legea 307/2006, SR EN ISO 25980',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-013',
    title: 'Instrucțiune pentru manipularea manuală a sarcinilor',
    domain: 'depozit',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea tehnicilor corecte de ridicare și transport manual a sarcinilor pentru prevenirea afecțiunilor musculo-scheletice și a accidentelor.'
      },
      {
        title: '2. Limite de greutate',
        content: '- Bărbați adulți: maximum 25 kg (condiții optime)\n- Femei adulte: maximum 15 kg (condiții optime)\n- Tineri 16-18 ani: maximum 20% din limite adulți\n- Sarcini peste limite: folosire mijloace mecanizate\n- La distanțe mari sau ridicări repetate: reducere 20-30%'
      },
      {
        title: '3. Tehnica corectă de ridicare',
        content: '- Apropiere maximă de sarcină\n- Picioare la lățimea umerilor, un picior ușor în față\n- Ghemuire cu spate drept (nu aplecare)\n- Apucare fermă cu ambele mâini\n- Ridicare folosind picioarele, nu spatele\n- Menținere sarcină aproape de corp\n- Evitare torsiuni trunchiului (reorientare cu picioarele)'
      },
      {
        title: '4. Transport și depunere',
        content: '- Mers cu pași mici, privire înainte\n- Schimbări direcție prin pivotare picior, nu torsiune\n- Depunere controlată, nu aruncarea sarcinii\n- Pauze regulate la efort susținut\n- Cerere ajutor la sarcini grele/voluminoase'
      },
      {
        title: '5. Măsuri preventive',
        content: '- Verificare drum transport (fără obstacole, podea uscată)\n- Folosire cărucioare/transpalete când este posibil\n- Îmbrăcăminte confortabilă, încălțăminte stabilă\n- Raportare dureri spate/articulații\n- Participare program exerciții fizice preventive'
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1091/2006, SR ISO 11228',
    revisionPeriodMonths: 24
  },
  {
    id: 'ip-014',
    title: 'Instrucțiune pentru prevenirea accidentelor electrice',
    domain: 'productie',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de protecție împotriva șocului electric și a incendiilor de natură electrică în vederea protejării vieții și sănătății lucrătorilor.'
      },
      {
        title: '2. Personal autorizat',
        content: '- Lucrări la instalații electrice: doar electricieni autorizați ANRE\n- Personal instruit pentru utilizarea echipamentelor electrice\n- Interzis improvizații sau reparații de către neavizați\n- Autorizație electrician valabilă (reînnoire periodic)\n- Cunoaștere prim ajutor la electrocutare'
      },
      {
        title: '3. Măsuri de protecție',
        content: '- Alimentare echipamente prin prize cu contact protecție (PE)\n- Instalație electrică cu protecție diferențială (max 30mA)\n- Verificare periodică legare la pământ\n- Marcaj echipamente electrice cu stare tensiune\n- Încuietori/lacăte pentru tablouri electrice'
      },
      {
        title: '4. Reguli de utilizare',
        content: '- Verificare stare cablu/priză înainte conectare\n- Interzis tracțiune cablu la deconectare (tragere de priză)\n- Oprire echipament înainte conectare/deconectare\n- Interzis modificarea instalațiilor fără aprobare\n- Raportare imediată defecțiuni, scântei, miros ars\n- Interzis utilizare echipamente cu mâini ude'
      },
      {
        title: '5. Prim ajutor la electrocutare',
        content: '- Întrerupere sursă electrică (întrerupător, siguranțe)\n- Dacă nu se poate: îndepărtare victimă cu material izolant uscat\n- Verificare conștiență, respirație, puls\n- Apel 112 și începere RCP dacă este necesar\n- Poziție laterală siguranță dacă victima respiră\n- Tratare arsuri superficiale, așteptare personal medical'
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1146/2006, Normativ I7/2011',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-015',
    title: 'Instrucțiune pentru lucrul în condiții de caniculă',
    domain: 'santier',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de protecție pentru lucrătorii expuși la temperaturi ridicate în vederea prevenirii deshidratării, epuizării termice și loviturii de căldură.'
      },
      {
        title: '2. Identificare risc',
        content: '- Temperaturi exterioare > 32°C sau Cod Portocaliu/Roșu caniculă\n- Lucru fizic intens în soare sau spații neventilate\n- Îmbrăcăminte de protecție impermeabilă (costum chimice)\n- Lucru lângă surse căldură (cuptoare, motoare)'
      },
      {
        title: '3. Măsuri organizatorice',
        content: '- Reprogramare lucrări grele în orele mai răcoroase (6-11, 18-20)\n- Pauze suplimentare: 10 min la umbră la fiecare 45 min lucru\n- Rotație personal la lucrări foarte grele\n- Amenajare zonă odihnă răcoroasă/umbrită\n- Furnizare apă potabilă rece (min 3L/persoană/tură)\n- Reducere timp lucru sau suspendare la Cod Roșu'
      },
      {
        title: '4. Echipament de protecție adaptat',
        content: '- Îmbrăcăminte din materiale ușoare, respirante, culori deschise\n- Pălărie cu boruri late sau șapcă cu cozoroc\n- Ochelari soare protecție UV\n- Cremă protecție solară factor > 30\n- Acces permanent la apă răcoritoare'
      },
      {
        title: '5. Recunoaștere semne și prim ajutor',
        content: 'Semne epuizare termică: transpirații abundente, slăbiciune, amețeală, greață\n- Mutare imediată la umbră, hidratare, răcire cu apă\n\nSemne lovitură de căldură: temperatură > 40°C, piele uscată, confuzie, leșin\n- URGENȚĂ MEDICALĂ: apel 112\n- Răcire rapidă (apă rece, ventilatoare)\n- Poziționare lateral până la sosire ambulanță'
      }
    ],
    legalBasis: 'Legea 319/2006, Ordinul 1139/2007',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-016',
    title: 'Instrucțiune pentru utilizarea platformelor mobile de lucru (nacelă)',
    domain: 'santier',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de siguranță pentru operatorii platformelor mobile elevatoare (nacele) în vederea prevenirii căderilor de la înălțime și răsturnării.'
      },
      {
        title: '2. Condiții pentru operator',
        content: '- Certificat operator platformă mobilă valabil\n- Autorizație internă de lucru\n- Examen medical la zi\n- Minimum 18 ani\n- Instruire specifică tip platformă'
      },
      {
        title: '3. Verificări înainte de utilizare',
        content: '- Verificare carnet întreținere și revizie tehnică valabilă\n- Inspecție vizuală: fisuri, scurgeri hidraulice, anvelope\n- Test funcțional: ridicare, coborâre, rotire, comenzi urgență\n- Verificare marcaj capacitate maximă (persoane + echipament)\n- Control acumulatori/combustibil\n- Verificare dispozitive siguranță: limitatoare înclinare, stop urgență'
      },
      {
        title: '4. Reguli de operare',
        content: '- Evaluare teren: plat, stabil, fără gropi (înclinare max 3°)\n- Extindere complete stabilizatoare înainte ridicare\n- Purtare obligatorie ham cu ancorare în punctul din coș\n- Respectare capacitate maximă coș\n- Viteză redusă la deplasare cu coș ridicat\n- Oprire la vânt > 45 km/h sau condiții meteo severe\n- Menținere distanță min 5m față linii electrice aeriene'
      },
      {
        title: '5. Interdicții și urgențe',
        content: 'INTERZIS:\n- Utilizare ca macara pentru ridicări\n- Îmbrâncirea de pereți/obiecte pentru deplasare\n- Supraaglomerare coș peste capacitate\n- Traversare teren accidentat cu coș ridicat\n\nURGENȚĂ:\n- La blocare, folosire comenzi coborâre urgență\n- Evacuare doar după coborâre completă\n- Apel 112 și servicii interne la accident'
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1146/2006, SR EN 280',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-017',
    title: 'Instrucțiune pentru activități de curățenie și igienizare',
    domain: 'birou',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de protecție pentru personalul de curățenie în vederea prevenirii intoxicațiilor, alergiilor și accidentelor de muncă.'
      },
      {
        title: '2. Echipament de protecție',
        content: '- Mănuși cauciuc rezistente chimic\n- Șorț/halat impermeabil\n- Încălțăminte antiderapantă, rezistentă apă\n- Ochelari protecție la curățare cu pulverizare\n- Mască FFP2 la utilizare substanțe cu vapori iritanți'
      },
      {
        title: '3. Substanțe de curățare',
        content: '- Folosire doar produse autorizate, cu etichetă conformă\n- Citire FDS și etichetă înainte de utilizare\n- INTERZIS amestecarea produselor (risc degajări toxice)\n- Depozitare separată substanțe, în ambalaje originale\n- Păstrare sub cheie, acces restricționat'
      },
      {
        title: '4. Procedură de curățare',
        content: '- Marcare zonă în curățare (plăci \"Pardoseală udă\")\n- Diluare conform instrucțiuni (evitare concentrații mari)\n- Ventilare spațiu în timpul și după curățare\n- Spălare de la zonele mai curate spre cele mai murdare\n- Clătire abundentă, uscare completă pardoseală\n- Spălare mâini după terminare, chiar cu mănuși'
      },
      {
        title: '5. Prim ajutor la contact',
        content: 'Contact piele: spălare 15 min apă curentă, îndepărtare îmbrăcăminte contaminată\n\nContact ochi: clătire 15 min apă curentă, pleoapă deschisă, consult oftalmologic\n\nInhalare: evacuare la aer, poziție confortabilă, apel 112 dacă simptome\n\nIngestie: clătire gură, BAU apă, apel 112, prezentare etichetă produs'
      }
    ],
    legalBasis: 'Legea 319/2006, HG 1218/2006',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-018',
    title: 'Instrucțiune pentru utilizarea motoarelor cu ardere internă în spații închise',
    domain: 'depozit',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de protecție împotriva intoxicației cu monoxid de carbon (CO) la utilizarea echipamentelor cu motor cu ardere internă în spații închise sau semiînchise.'
      },
      {
        title: '2. Identificare risc',
        content: '- Stivuitoare, transpalete cu motor termic\n- Generatoare electrice cu benzină/motorină\n- Echipamente spălat cu presiune\n- Orice utilaj cu motor care degajă gaze evacuare\n- Spații închise: depozite, ateliere, hale fără ventilație'
      },
      {
        title: '3. Măsuri de protecție',
        content: '- PREFERINȚĂ: utilizare echipamente electrice în spații închise\n- Ventilație naturală: porți, ferestre deschise pe 2 laturi opuse\n- Ventilație forțată: minimum 6 schimburi aer/oră\n- Sistem evacuare gaze conectat direct la exterior\n- Detector CO instalat și funcțional (alarmare la 35 ppm)\n- Limitare timp funcționare motor'
      },
      {
        title: '4. Reguli de utilizare',
        content: '- Verificare funcționare detector CO înainte începere lucru\n- Motor la ralanti când este posibil\n- Pauze regulate cu oprire motor și aerisire\n- Interzis lăsare motor în funcțiune nesupravegheat\n- Oprire imediată la apariția simptomelor (durere cap, amețeală)\n- Oprire la declanșare alarmă detector CO'
      },
      {
        title: '5. Prim ajutor la intoxicare CO',
        content: 'Simptome: durere cap, amețeală, greață, confuzie, leșin\n\nPROCEDURĂ:\n1. Evacuare IMEDIATĂ victimă la aer curat\n2. Apel 112 - URGENȚĂ VITALĂ\n3. Verificare respirație\n4. RCP dacă nu respiră\n5. Poziție laterală siguranță dacă este conștientă\n6. Oxigenoterapie la sosire echipaj medical\n\nATENȚIE: CO nu are miros, nu poate fi detectat fără aparat!'
      }
    ],
    legalBasis: 'Legea 319/2006, SR EN 50292',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-019',
    title: 'Instrucțiune pentru lucrul izolat (lucrul singur)',
    domain: 'productie',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de protecție pentru lucrătorii care desfășoară activități în izolare, fără posibilitatea de asistență imediată în caz de urgență.'
      },
      {
        title: '2. Definire lucru izolat',
        content: '- Lucru singur într-o locație fără alt personal pe rază de 50m\n- Lucru în ture de noapte singur în clădire\n- Deplasări teren/client fără însoțitor\n- Lucru la înălțime, spații înguste, subsoluri - singur\n- Situații cu răspuns la urgență > 5 minute'
      },
      {
        title: '3. Evaluare și autorizare',
        content: '- Evaluare risc specific pentru fiecare situație\n- Autorizare scrisă de la supervizor\n- Stabilire orar și durată maximă lucru izolat\n- Verificare stare sănătate lucrător (fără afecțiuni risc)\n- Instruire privind riscuri și proceduri urgență'
      },
      {
        title: '4. Sistem supraveghere',
        content: '- Telefon mobil încărcat și funcțional obligatoriu\n- Contact programat cu supervizor (minim la 2 ore)\n- Dispozitiv alarmă worker alone (recomandabil)\n- Jurnal lucru izolat cu orar intrare/ieșire\n- Persoană desemnată pentru verificare periodică\n- Plan intervenție în caz de nereceptare la control'
      },
      {
        title: '5. Restricții',
        content: 'INTERZIS lucru izolat pentru:\n- Lucrări la înălțime > 3m\n- Lucrări în spații înguste/închise\n- Manipulare substanțe chimice foarte periculoase\n- Lucrări electrice sub tensiune\n- Utilizare echipamente cu risc foarte ridicat\n- Personal nou angajat (perioada probă)\n- Persoane cu afecțiuni medicale incompatibile'
      }
    ],
    legalBasis: 'Legea 319/2006, SR ISO 45001',
    revisionPeriodMonths: 12
  },
  {
    id: 'ip-020',
    title: 'Instrucțiune pentru prevenirea hărțuirii și violenței la locul de muncă',
    domain: 'birou',
    sections: [
      {
        title: '1. Scopul instrucțiunii',
        content: 'Stabilirea măsurilor de prevenire și combatere a hărțuirii morale, hărțuirii sexuale și violenței la locul de muncă pentru asigurarea unui mediu profesional sigur și respectuos.'
      },
      {
        title: '2. Definiții',
        content: 'HĂRȚUIRE MORALĂ (mobbing): comportament abuziv repetat care afectează demnitatea/sănătatea (umilire, izolare, critici excesive, sarcini imposibile)\n\nHĂRȚUIRE SEXUALĂ: comportament nedorit cu conotație sexuală (remarci, cereri favori, gesturi, contact fizic)\n\nVIOLENȚĂ: agresiune fizică, amenințări, intimidare'
      },
      {
        title: '3. Politica organizației',
        content: '- TOLERANȚĂ ZERO față de orice formă hărțuire/violență\n- Dreptul fiecărui angajat la mediu de lucru respectuos\n- Protecție împotriva represaliilor pentru raportare\n- Confidențialitate anchete\n- Sancțiuni disciplinare conform gravitate (avertisment-concediere)'
      },
      {
        title: '4. Procedură raportare',
        content: '1. Raportare verbală sau scrisă către:\n   - Manager direct (dacă nu este implicat)\n   - Responsabil HR\n   - Responsabil SSM\n   - Persoană de încredere desemnată\n\n2. Anchetă internă confidențială (5-10 zile)\n\n3. Măsuri protecție victimă (relocare, program modificat)\n\n4. Decizie și sancțiuni\n\n5. Sesizare autorități (Inspectoratul Muncii, Poliție) dacă este cazul'
      },
      {
        title: '5. Responsabilități',
        content: 'ANGAJAȚI:\n- Respect colegii, comportament profesional\n- Raportare situații de care au cunoștință\n\nMANAGERI:\n- Exemplu comportament etic\n- Reacție promptă la sesizări\n- Instruire echipă\n\nORGANIZAȚIE:\n- Politici clare comunicate\n- Instruire periodică (anual)\n- Anchetă imparțială\n- Confidențialitate și protecție raportanți'
      }
    ],
    legalBasis: 'Legea 319/2006, Legea 202/2002, Codul Muncii',
    revisionPeriodMonths: 12
  }
];
