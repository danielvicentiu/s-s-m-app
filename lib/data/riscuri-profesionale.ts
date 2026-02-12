// S-S-M.RO — RISCURI PROFESIONALE ROMÂNIA
// Bază de date cu 40 riscuri profesionale conforme legislației SSM
// Legea 319/2006 și HG 1425/2006

export type RiskCategory = 'fizic' | 'chimic' | 'biologic' | 'ergonomic' | 'psihosocial'
export type RiskSeverity = 'scăzut' | 'mediu' | 'ridicat' | 'foarte ridicat'

export interface ProfessionalRisk {
  id: string
  title: string
  description: string
  category: RiskCategory
  severity: RiskSeverity
  measures: string[]
  legalBasis: string
  affectedSectors: string[]
}

export const RISCURI_PROFESIONALE: ProfessionalRisk[] = [
  // ══════════════════════════════════════════════════════════════
  // RISCURI FIZICE
  // ══════════════════════════════════════════════════════════════
  {
    id: 'fizic-zgomot',
    title: 'Expunere la zgomot excesiv',
    description: 'Niveluri de zgomot peste 80 dB(A) pentru 8h/zi pot afecta auzul și provoca stres. La peste 85 dB(A) sunt necesare măsuri obligatorii de protecție.',
    category: 'fizic',
    severity: 'ridicat',
    measures: [
      'Utilizarea obligatorie de căști/dopuri antibruit certificate',
      'Audiograme periodice (control medical audiologic anual)',
      'Izolare fonică a surselor de zgomot și reducere la sursă',
      'Rotație de personal pentru limitarea timpului de expunere',
      'Instruire privind riscurile expunerii la zgomot'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 1 (zgomot)',
    affectedSectors: ['Fabrici metalurgice', 'Construcții', 'Aeroporturi', 'Industrie prelucrătoare', 'Tâmplărie']
  },
  {
    id: 'fizic-vibratii',
    title: 'Expunere la vibrații mecanice',
    description: 'Vibrații transmise mână-braț sau corp întreg de la unelte electrice, vehicule sau mașini industriale. Pot cauza boli osteoarticulare, tulburări circulatorii și neurologice.',
    category: 'fizic',
    severity: 'ridicat',
    measures: [
      'Utilizare scule și echipamente cu amortizoare de vibrații',
      'Limitarea timpului de lucru cu unelte vibratoare',
      'Pauze obligatorii și exerciții de recuperare',
      'Control medical specializat pentru muncitori expuși',
      'Înlocuirea echipamentelor învechite cu tehnologie modernă'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 2 (vibrații mecanice)',
    affectedSectors: ['Construcții', 'Exploatări miniere', 'Silvicultură', 'Transport rutier', 'Industrie grea']
  },
  {
    id: 'fizic-radiatii-ionizante',
    title: 'Expunere la radiații ionizante',
    description: 'Radiații alfa, beta, gamma sau cu neutroni provenite de la aparate medicale (raze X), surse radioactive industriale sau laboratoare. Risc de cancer și mutații genetice.',
    category: 'fizic',
    severity: 'foarte ridicat',
    measures: [
      'Utilizare obligatorie de echipament de protecție EPI (șorțuri plumbate, ecrane)',
      'Monitorizare dozimetrică individuală permanentă',
      'Limitarea strictă a timpului de expunere conform normelor',
      'Control medical periodic specialized (hematologie, oncologie)',
      'Zonare controlată și acces restricționat la surse',
      'Instruire specifică și autorizare individuală'
    ],
    legalBasis: 'Legea 301/2004 + HG 1425/2006',
    affectedSectors: ['Spitale (radiologie)', 'Centrale nucleare', 'Industrie (control nedistructiv)', 'Cercetare nucleară']
  },
  {
    id: 'fizic-radiatii-neionizante',
    title: 'Expunere la radiații neionizante (UV, IR, laser)',
    description: 'Radiații ultraviolete (de la sudură, lămpi UV), infraroșii (de la cuptoare), laser. Pot cauza leziuni oculare, arsuri piele, cataractă.',
    category: 'fizic',
    severity: 'mediu',
    measures: [
      'Ecrane de protecție și cortine speciale împotriva radiațiilor',
      'Ochelari de protecție cu filtre UV/IR adecvate',
      'Limitarea accesului în zonele cu expunere ridicată',
      'Control oftalmologic periodic',
      'Semnalizare corespunzătoare a zonelor periculoase'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 5 (radiații optice)',
    affectedSectors: ['Sudură industrială', 'Laboratoare laser', 'Industrie alimentară (sterilizare UV)', 'Cosmetică (saloane bronzare)']
  },
  {
    id: 'fizic-temperaturi-extreme',
    title: 'Lucru la temperaturi extreme (căldură excesivă)',
    description: 'Temperaturi peste 30°C în spații închise sau expunere la căldură radiativă intensă. Risc de epuizare termică, deshidratare, insolație.',
    category: 'fizic',
    severity: 'ridicat',
    measures: [
      'Asigurare sistem ventilație/climatizare funcțional',
      'Pauze frecvente în zone răcoroase',
      'Furnizare lichide pentru hidratare (apă, săruri minerale)',
      'Echipament de lucru respirant și protecție solară',
      'Monitorizare medicală pentru risc cardiovascular'
    ],
    legalBasis: 'Legea 319/2006 art. 18 + HG 1425/2006',
    affectedSectors: ['Furnale/Topitorii', 'Brutării', 'Construcții (vară)', 'Agricultură', 'Depozite fără climatizare']
  },
  {
    id: 'fizic-frig-extreme',
    title: 'Lucru la temperaturi extreme (frig intens)',
    description: 'Temperaturi sub -5°C în depozite frigorifice, în exterior iarna sau în fabrici neîncălzite. Risc de hipotermie, degerături, boli respiratorii.',
    category: 'fizic',
    severity: 'ridicat',
    measures: [
      'Echipament termic corespunzător (îmbrăcăminte călduroasă, mănuși, cizme termice)',
      'Pauze în încăperi încălzite',
      'Limitarea timpului de expunere conform normelor',
      'Băuturi calde disponibile',
      'Încălzire locală a posturilor de lucru unde este posibil'
    ],
    legalBasis: 'Legea 319/2006 + HG 1425/2006',
    affectedSectors: ['Depozite frigorifice', 'Industrie alimentară (congelare)', 'Construcții (iarnă)', 'Pescuit']
  },
  {
    id: 'fizic-iluminat-insuficient',
    title: 'Iluminat inadecvat (insuficient sau excesiv)',
    description: 'Niveluri de iluminare sub 200 lux pentru lucru fin sau peste 1000 lux fără protecție. Provoacă oboseală vizuală, dureri de cap, greșeli, accidente.',
    category: 'fizic',
    severity: 'mediu',
    measures: [
      'Asigurarea nivelului de iluminare conform SR EN 12464-1',
      'Control oftalmologic periodic',
      'Utilizare iluminat suplimentar localizat la posturile de lucru',
      'Curățare periodică a corpurilor de iluminat',
      'Reducerea reflexiilor și orbiririi (storuri, ecrane antireflexie)'
    ],
    legalBasis: 'Legea 319/2006 + SR EN 12464-1:2011',
    affectedSectors: ['Fabrici textile', 'Ateliere mecanice', 'Laboratoare', 'Birouri', 'Depozite']
  },
  {
    id: 'fizic-electricitate',
    title: 'Risc de electrocutare',
    description: 'Contact direct sau indirect cu echipamente electrice sub tensiune. Șocul electric poate cauza arsuri, aritmii cardiace, deces.',
    category: 'fizic',
    severity: 'foarte ridicat',
    measures: [
      'Echipamente electrice verificate periodic de electrician autorizat ANRE',
      'Utilizare EPI izolant electric (mănuși, încălțăminte dielectrică)',
      'Instalații de punere la pământ verificate',
      'Întreruptoare diferențiale funcționale pe toate circuitele',
      'Semnalizare pericol electric',
      'Instruire electricieni cu autorizare ANRE',
      'Proceduri de consemnare (Lock-Out/Tag-Out)'
    ],
    legalBasis: 'Legea 319/2006 + HG 1146/2006 (ANRE)',
    affectedSectors: ['Electricieni (toate sectoarele)', 'Fabrici', 'Construcții', 'Instalatori', 'Service echipamente']
  },
  {
    id: 'fizic-presiune-anormala',
    title: 'Lucru la presiune atmosferică anormală',
    description: 'Lucru în tuneluri, caisoane, scufundări (presiune crescută) sau la altitudine (presiune scăzută). Risc de embolie gazoasă, boala caisonului.',
    category: 'fizic',
    severity: 'foarte ridicat',
    measures: [
      'Camere/stagiuri de decompresie obligatorii conform tabelelor',
      'Control medical strict specializat (ORL, cardiovascular, pulmonar)',
      'Echipament specialized de scufundare sau compresie',
      'Supraveghere medicală permanentă pe șantier',
      'Respect riguros al procedurilor de urcare/coborâre'
    ],
    legalBasis: 'HG 1425/2006 + norme INCD ISIPM',
    affectedSectors: ['Construcții subterane (metrou, tuneluri)', 'Scufundări comerciale', 'Caissoane poduri', 'Lucru la mare altitudine']
  },

  // ══════════════════════════════════════════════════════════════
  // RISCURI CHIMICE
  // ══════════════════════════════════════════════════════════════
  {
    id: 'chimic-solvenți-organici',
    title: 'Expunere la solvenți organici (benzen, toluen, acetonă)',
    description: 'Inhalare vapori de solvenți din vopsele, lacuri, diluanți, adezivi. Provoacă intoxicație acută (amețeli, greață) și cronică (afectare ficat, rinichi, SNC).',
    category: 'chimic',
    severity: 'ridicat',
    measures: [
      'Ventilație locală prin aspirație (hote, sisteme de exhaustare)',
      'Măști cu filtre specifice pentru vapori organici (tip A)',
      'Analize medicale periodice (transaminaze hepatice, hemoleucogramă)',
      'Utilizare solvenți cu volatilitate redusă',
      'Instruire privind manipularea substanțelor chimice',
      'Fișe de securitate (FDS) accesibile pentru toți lucrătorii'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 10 (agenți chimici)',
    affectedSectors: ['Vopsitorii auto', 'Fabrici de vopsele/lacuri', 'Tipografii', 'Industrie chimică', 'Curățătorii chimice']
  },
  {
    id: 'chimic-praf-silice',
    title: 'Expunere la praf de siliciu cristalin respirabil',
    description: 'Inhalare de praf fin de siliciu de la tăierea/șlefuirea betonului, marmură, granit, minerale. Provoacă silicoză pulmonară (fibroză ireversibilă).',
    category: 'chimic',
    severity: 'foarte ridicat',
    measures: [
      'Umezire la locul generării prafului (tăiere cu apă)',
      'Aspirație localizată (sisteme mobile de captare praf)',
      'Măști FFP3 obligatorii pentru praf fin',
      'Radiografii pulmonare anuale (monitorizare silicoză)',
      'Spălare riguroasă după schimb, separarea îmbrăcămintei de lucru',
      'Rotație personal pentru limitarea expunerii'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 10 + OMS 2000/679/CE',
    affectedSectors: ['Construcții (beton, piatră)', 'Exploatări miniere', 'Cariere', 'Ceramică/sticlărie', 'Tuneluri']
  },
  {
    id: 'chimic-azbest',
    title: 'Expunere la azbest (amianto)',
    description: 'Inhalare fibre de azbest de la demolări/reparații acoperișuri Eternit, izolații vechi, garnituri. Cauză cancer pulmonar, mezoteliom.',
    category: 'chimic',
    severity: 'foarte ridicat',
    measures: [
      'Utilizare exclusiv firme specializate autorizate pentru azbest',
      'Măști FFP3 cu protecție particule + combinezoane etanșe',
      'Umezirea materialelor înainte de demontare',
      'Împachetare și eliminare ca deșeuri periculoase',
      'Monitorizare medicală strictă (radiografii pulmonare)',
      'Interdicție strictă de suflare cu aer comprimat'
    ],
    legalBasis: 'OUG 200/2000 + HG 856/2002 (azbest)',
    affectedSectors: ['Demolări', 'Renovări clădiri vechi', 'Instalatori termice (izolații vechi)', 'Deșeuri periculoase']
  },
  {
    id: 'chimic-plumb',
    title: 'Expunere la plumb și compuși',
    description: 'Inhalare/ingestie plumb de la topirea acumulatorilor, vopsele vechi, reciclare. Saturnism: afectare SNC, anemie, afectare rinichi.',
    category: 'chimic',
    severity: 'foarte ridicat',
    measures: [
      'Ventilație puternică la punctele de topire',
      'Măști cu filtru P3 + combinezoane de protecție',
      'Determinare plumbemie (dozare plumb în sânge) trimestrial',
      'Spălare mâinilor obligatorie înainte de masă',
      'Vestiare separate pentru haine de lucru',
      'Supraveghere medicală specializată'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 10 (plumb metalic)',
    affectedSectors: ['Reciclare baterii/acumulatori', 'Industrie ceramică (glazură)', 'Vopsitorii (vopsele cu plumb)', 'Prelucrare metale']
  },
  {
    id: 'chimic-pesticide',
    title: 'Expunere la pesticide și produse fitosanitare',
    description: 'Contact cu insecticide, erbicide, fungicide în agricultură și dezinsecție. Intoxicații acute (organofosfate) și efecte pe termen lung (cancer, infertilitate).',
    category: 'chimic',
    severity: 'ridicat',
    measures: [
      'Echipament complet: mască cu filtru ABEK, mănuși nitril, combinezon impermeabil',
      'Respectarea strictă a intervalului de revenire în cultură',
      'Spălare corporală imediată după tratamente',
      'Analize colinesterază eritrocitară (pentru organofosfate)',
      'Depozitare pesticide în spații dedicate, securizate',
      'Pregătire soluții în spații aerisite'
    ],
    legalBasis: 'HG 1425/2006 + Legea 307/2006 (protecția mediului)',
    affectedSectors: ['Agricultură', 'Grădinărit', 'Dezinsecție/deratizare (DDD)', 'Silvicultură', 'Sera/Legumicultură']
  },
  {
    id: 'chimic-gaze-toxice',
    title: 'Expunere la gaze toxice (CO, H₂S, NH₃, Cl₂)',
    description: 'Inhalare monoxid de carbon (fără miros), hidrogen sulfurat (ouă stricate), amoniac, clor. Risc intoxicație acută, deces prin asfixie chimică.',
    category: 'chimic',
    severity: 'foarte ridicat',
    measures: [
      'Detectoare automate de gaze cu alarmă sonoră/vizuală',
      'Ventilație mecanică continuă în spații confinate',
      'Aparate de respirat izolante (SCBA) pentru intervenții',
      'Permis de lucru obligatoriu în spații confinate',
      'Instrucții clare de evacuare și prim ajutor',
      'Control medical cu teste respiratorii (spirometrie)'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 10',
    affectedSectors: ['Rafinării', 'Fabrici chimice', 'Canalizare (H₂S)', 'Frigotehnie (NH₃)', 'Staţii epurare apă']
  },
  {
    id: 'chimic-acid-baze',
    title: 'Expunere la acizi și baze puternice',
    description: 'Contact cu acid sulfuric, clorhidric, sodă caustică, potasă. Arsuri chimice severe piele și mucoase, deteriorarea ochilor.',
    category: 'chimic',
    severity: 'ridicat',
    measures: [
      'Echipament protecție chimică: vizieră facială, mănuși cauciuc, șorț',
      'Dușuri de siguranță și spălătoare oculare funcționale',
      'Depozitare în recipiente etichetate, separată acizi de baze',
      'Proceduri manipulare (adăugare acid în apă, niciodată invers)',
      'Kit neutralizare și sorbție deranjamente',
      'Instruire prim ajutor pentru arsuri chimice'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 10 + HG 1408/2008 (Seveso)',
    affectedSectors: ['Industrie chimică', 'Galvanizare', 'Rafinării', 'Curățenie industrială', 'Laboratoare']
  },
  {
    id: 'chimic-formaldehida',
    title: 'Expunere la formaldehidă',
    description: 'Vapori de formaldehidă de la rășini, dezinfectante, conservanți morgi/laboratoare. Iritant puternic, cancerigen (nazofaringe).',
    category: 'chimic',
    severity: 'ridicat',
    measures: [
      'Aspirație locală la locul de utilizare',
      'Măști cu filtru A (vapori organici)',
      'Înlocuire cu dezinfectante alternative mai puțin toxice',
      'Control medical ORL periodic',
      'Limitarea timpului de expunere',
      'Etichetare clară "substanță cancerigena categoria 1B"'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 10 + Lista CMR (INCDPM)',
    affectedSectors: ['PAL/mobilier (rășini)', 'Textile', 'Laboratoare anatomie', 'Spitale (dezinfecție)', 'Conservare probe']
  },
  {
    id: 'chimic-praf-lemn',
    title: 'Expunere la praf de lemn dur',
    description: 'Inhalare praf fin de la tăierea lemnului de stejar, fag, frasin. Cancerigen pentru sinusuri nazale și nazofaringe, rinoree, astm.',
    category: 'chimic',
    severity: 'ridicat',
    measures: [
      'Aspirație la locul generării (pe mașinile de tâmplărie)',
      'Măști FFP2 minim (recomandat FFP3)',
      'Curățare cu aspiratoare industriale (nu suflare sau măturat)',
      'Control medical ORL și pulmonar anual',
      'Rotație personal pentru limitarea expunerii',
      'Sisteme centralizate de aspirație praf'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 10 + Directiva 2004/37/CE (cancerigene)',
    affectedSectors: ['Tâmplării', 'Mobilă lemn masiv', 'Restaurare mobilier', 'Parchet', 'Dulgherii']
  },
  {
    id: 'chimic-metale-grele',
    title: 'Expunere la vapori de metale grele (Hg, Cd, Cr)',
    description: 'Vapori de mercur (termometre, lămpi), cadmiu (sudură, baterii), crom hexavalent (cromări). Afectări renale, cancer.',
    category: 'chimic',
    severity: 'foarte ridicat',
    measures: [
      'Ventilație locală la procesele de încălzire/sudură',
      'Măști cu filtru P3 + vapori organici',
      'Analize urinare metale grele (mercur, cadmiu, crom)',
      'Înlocuire cu alternative mai puțin toxice (termometre digitale)',
      'Proceduri de urgență pentru deranjamente de mercur',
      'Control medical specializat (renal, respirator)'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 10',
    affectedSectors: ['Galvanizare', 'Industrie electronică', 'Laboratoare', 'Reciclare baterii', 'Sudură']
  },

  // ══════════════════════════════════════════════════════════════
  // RISCURI BIOLOGICE
  // ══════════════════════════════════════════════════════════════
  {
    id: 'biologic-virusuri-sange',
    title: 'Expunere la virusuri transmisibile prin sânge (HIV, HBV, HCV)',
    description: 'Risc de infectare prin înțepare cu ace contaminate, contact cu sânge infectat. Specific personal medical, laborator.',
    category: 'biologic',
    severity: 'foarte ridicat',
    measures: [
      'Vaccinare obligatorie hepatita B pentru personal medical',
      'Utilizare containere rigide pentru ace și instrumente ascuțite',
      'Mănuși medicale de unică folosință obligatorii',
      'Proceduri clare de profilaxie post-expunere (PPE)',
      'Instruire manipulare deșeuri biologice periculoase',
      'Control medical periodic și testare serologică'
    ],
    legalBasis: 'Legea 319/2006 + OMS 1101/2016 (supraveghere boli transmisibile)',
    affectedSectors: ['Spitale', 'Laboratoare analize medicale', 'Stomatologie', 'Ambulanțe', 'Centre de donare sânge']
  },
  {
    id: 'biologic-tuberculoza',
    title: 'Risc de infectare cu Mycobacterium tuberculosis',
    description: 'Transmitere prin aer a tuberculozei de la pacienți infectați. Personal medical din pneumologie, infecțioase, laboratoare TB.',
    category: 'biologic',
    severity: 'ridicat',
    measures: [
      'Măști FFP2/FFP3 în secții TB și la proceduri cu risc aerosolizare',
      'Camere cu presiune negativă pentru pacienți TB',
      'Testare periodică IDR/QuantiFERON pentru personal',
      'Vaccinare BCG (deși eficiență limitată)',
      'Izolare pacienți confirmați TB bacilifer',
      'Chemoprevenție (profilaxie cu izoniazidă) pentru expuși'
    ],
    legalBasis: 'OMS 1101/2016 + Protocol PNT tuberculoză (MS)',
    affectedSectors: ['Spitale (pneumologie, infecțioase)', 'Penitenciare', 'Centre socio-medicale', 'Laboratoare microbiologie']
  },
  {
    id: 'biologic-zoonoze',
    title: 'Expunere la zoonoze (bruceloză, leptospiroză, rabie)',
    description: 'Boli transmise de animale: bruceloză (bovine/ovine), leptospiroză (rozătoare), rabie (câini/vulpi/lilieci). Risc veterinari, fermieri.',
    category: 'biologic',
    severity: 'ridicat',
    measures: [
      'Vaccinare antirabică pentru personal cu risc ridicat',
      'Echipament de protecție: mănuși, cizme, halate impermeabile',
      'Control medical periodic cu teste serologice specifice',
      'Proceduri de captare și manipulare animale în siguranță',
      'Dezinfecție și deratizare periodică în ferme',
      'Instruire privind recunoașterea simptomelor'
    ],
    legalBasis: 'Legea 319/2006 + OMS 1101/2016',
    affectedSectors: ['Veterinari', 'Ferme (bovine, ovine, porcine)', 'Abatoare', 'Grădini zoologice', 'Silvicultură', 'Apicultură']
  },
  {
    id: 'biologic-mucegai-fungi',
    title: 'Expunere la spori de fungi și mucegaiuri',
    description: 'Inhalare spori de la mucegai în depozite umede, compost, cereale. Alergii respiratorii, astm, pneumonită de hipersensibilitate.',
    category: 'biologic',
    severity: 'mediu',
    measures: [
      'Ventilație adecvată în depozite',
      'Măști FFP2 la manipularea materialelor infestate',
      'Uscare și păstrare la umiditate controlată',
      'Curățare periodică și îndepărtarea surselor de mucegai',
      'Control medical pulmonar periodic (spirometrie)',
      'Evitarea expunerii pentru persoane cu astm/alergii'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 11 (agenți biologici)',
    affectedSectors: ['Agricultură (depozite cereale)', 'Industrie alimentară', 'Compostare', 'Biblioteci/Arhive', 'Construcții (renovări clădiri umede)']
  },
  {
    id: 'biologic-salmonella-e-coli',
    title: 'Expunere la bacterii patogene alimentare (Salmonella, E. coli)',
    description: 'Contact cu carne crudă, ouă, lapte nepasteurizat contaminat. Gastroenterite, febră tifoidă, infecții urinare.',
    category: 'biologic',
    severity: 'mediu',
    measures: [
      'Igienizare riguroasă mâini după manipularea alimentelor crude',
      'Mănuși și halate în abatoare și preparare carne',
      'Separarea strictă alimente crude de preparate',
      'Control medical periodic (coproculturi pentru purtători)',
      'Temperaturi corecte de păstrare și preparare',
      'Instruire HACCP pentru personalul alimentar'
    ],
    legalBasis: 'Legea 319/2006 + Reg. CE 852/2004 (igiena produselor alimentare)',
    affectedSectors: ['Industrie alimentară', 'Restaurante/Catering', 'Abatoare', 'Ferme păsări/porcine', 'Magazine alimentare']
  },
  {
    id: 'biologic-legionella',
    title: 'Risc de infectare cu Legionella pneumophila',
    description: 'Inhalare aerosoli contaminați cu Legionella de la turnuri de răcire, sisteme de climatizare, dușuri. Boala legionarilor (pneumonie severă).',
    category: 'biologic',
    severity: 'ridicat',
    measures: [
      'Curățare și dezinfecție periodică a sistemelor de apă caldă',
      'Menținerea temperaturii apei calde peste 55°C',
      'Controale microbiologice regulate ale apei',
      'Evitarea stagnării apei în conducte',
      'Instruire personal mentenanță HVAC',
      'Plan de prevenire și control Legionella'
    ],
    legalBasis: 'OMS 301/2021 (calitatea apei destinate consumului uman)',
    affectedSectors: ['Hoteluri', 'Spitale', 'Piscine', 'SPA/Wellness', 'Clădiri de birouri cu climatizare', 'Complexe industriale']
  },
  {
    id: 'biologic-deseuri-medicale',
    title: 'Expunere la deșeuri medicale infecțioase',
    description: 'Manipulare deșeuri contaminate cu sânge, secreții, materiale biologice. Risc de infecții multiple.',
    category: 'biologic',
    severity: 'ridicat',
    measures: [
      'Segregare la sursă în containere codificate culoare (galben)',
      'Mănuși groase anti-perforație pentru colectare',
      'Containere rigide pentru obiecte ascuțite',
      'Vaccinare hepatita B obligatorie',
      'Proceduri de manipulare conform HG 1493/2006',
      'Instruire specifică gestionare deșeuri periculoase'
    ],
    legalBasis: 'HG 1493/2006 (deșeuri medicale)',
    affectedSectors: ['Spitale', 'Cabinete medicale', 'Laboratoare', 'Stomatologii', 'Firme colectare deșeuri medicale']
  },
  {
    id: 'biologic-covid-respiratorii',
    title: 'Risc de infectare cu virusuri respiratorii (COVID-19, gripă)',
    description: 'Transmitere aeriană virusuri respiratorii în spații aglomerate, contact direct pacienți. Pandemii și epidemii sezoniere.',
    category: 'biologic',
    severity: 'ridicat',
    measures: [
      'Măști medicale/FFP2 în zone cu risc ridicat',
      'Vaccinare antigripală anuală pentru personal medical',
      'Igienizare frecventă a mâinilor (soluții hidroalcoolice)',
      'Ventilație adecvată în spații închise',
      'Izolare cazuri confirmate',
      'Protocoale de triaj și distanțare în unitățile sanitare',
      'Echipamente de protecție complete pentru proceduri cu risc'
    ],
    legalBasis: 'Legea 136/2020 (măsuri în pandemie) + OMS 1101/2016',
    affectedSectors: ['Spitale', 'Cabinete medicale', 'Farmacii', 'Cămine bătrâni', 'Grădinițe/Școli', 'Transport public']
  },

  // ══════════════════════════════════════════════════════════════
  // RISCURI ERGONOMICE
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ergonomic-munca-display',
    title: 'Lucru prelungit la calculator (ecran)',
    description: 'Lucru >4h/zi la calculator. Oboseală vizuală, dureri cervicale, dureri de spate, sindrom tunel carpian, sedentarism.',
    category: 'ergonomic',
    severity: 'mediu',
    measures: [
      'Pauze de 10 min la fiecare 50 min lucru continuu la ecran',
      'Scaun ergonomic reglabil (înălțime, spătar lombar)',
      'Monitor la nivelul ochilor, distanță 50-70 cm',
      'Iluminat indirect fără reflexii pe ecran',
      'Control oftalmologic anual (corectarea vederii)',
      'Exerciții de relaxare musculară (gât, umeri, încheieturi)'
    ],
    legalBasis: 'HG 1028/2006 (ecrane de vizualizare)',
    affectedSectors: ['Birouri IT', 'Contabilitate', 'Administrație', 'Call-center', 'Design grafic', 'Redacții']
  },
  {
    id: 'ergonomic-manipulare-greutati',
    title: 'Manipulare manuală de greutăți',
    description: 'Ridicare, transport, împingere, tragere sarcini grele. Risc de lombalgie, hernii discale, traumatisme acute.',
    category: 'ergonomic',
    severity: 'ridicat',
    measures: [
      'Instruire tehnică de ridicare corectă (din șold, nu din spate)',
      'Limitarea greutății: max 25kg bărbați, 15kg femei (Legea 319/2006)',
      'Utilizare echipamente auxiliare (cărucioare, transpaleți, macarale)',
      'Rotație sarcini între lucrători',
      'Pauze de recuperare',
      'Control medical ortopedic periodic',
      'Kinetoterapie preventivă (întărire musculatură lombară)'
    ],
    legalBasis: 'HG 1425/2006 - Anexa 8 (manipulare manuală)',
    affectedSectors: ['Depozite/Logistică', 'Construcții', 'Agricultură', 'Industrie prelucrătoare', 'Comerț (mărfuri)']
  },
  {
    id: 'ergonomic-pozitie-prelungita',
    title: 'Lucru în poziții forțate (îngenuncheat, ghemuit, cu brațele ridicate)',
    description: 'Menținere poziții inconfortabile prelungit: instalatori sub obiecte, electricieni deasupra capului, recoltare agricolă aplecat.',
    category: 'ergonomic',
    severity: 'mediu',
    measures: [
      'Utilizare scaune/platforme de lucru ajustabile',
      'Rotație poziții de lucru',
      'Pauze frecvente cu exerciții de stretching',
      'Genunchiere și protecții pentru articulații',
      'Organizare ergonomică a postului de lucru',
      'Scule cu mânere prelungite pentru reducerea aplecării'
    ],
    legalBasis: 'Legea 319/2006 art. 18 (ergonomie)',
    affectedSectors: ['Instalatori (termice, sanitare, electrice)', 'Agricultură (recoltare)', 'Curățenie', 'Mecanici auto', 'Montaj/Asamblare']
  },
  {
    id: 'ergonomic-miscare-repetitiva',
    title: 'Mișcări repetitive ale membrelor superioare',
    description: 'Gesturi repetitive mână-încheietură >30 acțiuni/min: asamblare, tastare, împachetare. Tendinite, sindrom tunel carpian.',
    category: 'ergonomic',
    severity: 'mediu',
    measures: [
      'Rotație între sarcini diferite pentru diversificarea mișcărilor',
      'Pauze scurte frecvente (microPauze)',
      'Ergonomizare scule și unelte (mânere)',
      'Încălzire înainte de lucru (exerciții pentru mâini)',
      'Control medical ortoped/neurolog periodic',
      'Automatizare operațiuni unde este posibil'
    ],
    legalBasis: 'Legea 319/2006 + ISO 11228-3 (ergonomie)',
    affectedSectors: ['Asamblare componente', 'Textile/Croitorie', 'Ambalare', 'Data-entry', 'Muzicieni', 'Frizeri/Coafori']
  },
  {
    id: 'ergonomic-pozitie-sezut-prelungit',
    title: 'Lucru în poziție șezândă prelungit (>6h/zi)',
    description: 'Șezut static prelungit fără posibilitate mișcare. Risc cardiovascular, obezitate, tromboză venoasă, hemoroizi.',
    category: 'ergonomic',
    severity: 'mediu',
    measures: [
      'Pauze active la fiecare 2 ore (plimbări scurte)',
      'Scaune ergonomice cu sprijin lombar ajustabil',
      'Birouri ajustabile în înălțime (sit-stand desk)',
      'Exerciții la birou pentru circulație (rotații glezne, ridicări pe vârfuri)',
      'Încurajarea folosirii scărilor în loc de lift',
      'Control medical periodic (cardiovascular, vene)'
    ],
    legalBasis: 'HG 1028/2006 + Legea 319/2006',
    affectedSectors: ['Birouri', 'Șoferi profesionişti (transport lung)', 'Operatori mașini', 'Supraveghere monitoare (securitate)']
  },
  {
    id: 'ergonomic-iluminat-postură',
    title: 'Posturi de lucru neergonomice (înălțime incorectă, acces dificil)',
    description: 'Mese/bănci prea înalte sau prea joase, acces îngreunat la comenzi, forțare posturală constantă.',
    category: 'ergonomic',
    severity: 'mediu',
    measures: [
      'Evaluare ergonomică a posturilor de lucru',
      'Ajustare înălțime mese/scaune la antropometria lucrătorilor',
      'Platforme ajustabile pentru lucrători de statură diferită',
      'Reorganizare layout pentru acces facil la scule/materiale',
      'Consultanță ergonomie de la specialist SSM',
      'Implicarea lucrătorilor în proiectarea posturilor'
    ],
    legalBasis: 'Legea 319/2006 art. 18',
    affectedSectors: ['Fabrici asamblare', 'Laboratoare', 'Bucătării industriale', 'Ateliere mecanice', 'Linii de producție']
  },

  // ══════════════════════════════════════════════════════════════
  // RISCURI PSIHOSOCIALE
  // ══════════════════════════════════════════════════════════════
  {
    id: 'psihosocial-stres-ocupational',
    title: 'Stres ocupațional cronic',
    description: 'Presiune psihică constantă: termene strânse, sarcini contradictorii, volum mare de muncă, lipsa controlului. Burnout, anxietate, depresie.',
    category: 'psihosocial',
    severity: 'ridicat',
    measures: [
      'Evaluare periodică a riscurilor psihosociale (chestionare)',
      'Clarificarea rolurilor și așteptărilor pentru fiecare post',
      'Asigurarea resurselor adecvate pentru îndeplinirea sarcinilor',
      'Promovarea echilibrului viață profesională-personală',
      'Acces la consiliere psihologică (cabinet psiholog)',
      'Training management stres pentru angajați',
      'Canale de comunicare deschise cu managementul'
    ],
    legalBasis: 'Legea 319/2006 art. 6 (evaluare toate riscurile inclusiv psihosociale)',
    affectedSectors: ['Toate sectoarele', 'IT/Software (deadline-uri)', 'Vânzări (targeturi)', 'Manageri', 'Personal medical']
  },
  {
    id: 'psihosocial-hartuire-discriminare',
    title: 'Hărțuire la locul de muncă și discriminare',
    description: 'Comportamente abuzive repetate: hărțuire morală (mobbing), hărțuire sexuală, discriminare (sex, vârstă, etnie). Impact psihic sever.',
    category: 'psihosocial',
    severity: 'foarte ridicat',
    measures: [
      'Politică clară anti-hărțuire și anti-discriminare (cod de conduită)',
      'Proceduri confidențiale de raportare și investigare',
      'Instruire obligatorie a tuturor angajaților și managerilor',
      'Măsuri disciplinare clare pentru încălcări',
      'Suport psihologic pentru victime',
      'Promovarea diversității și incluziunii',
      'Responsabil desemnat pentru prevenirea hărțuirii'
    ],
    legalBasis: 'Legea 202/2002 (egalitate șanse) + Legea 319/2006',
    affectedSectors: ['Toate sectoarele', 'Mari organizații', 'Retail (expunere clienți)', 'Secții cu preponderență gen']
  },
  {
    id: 'psihosocial-violenta-la-locul-de-munca',
    title: 'Violență și agresiune la locul de muncă',
    description: 'Agresiune fizică sau verbală din partea clienților, pacienților, colegilor. Specific servicii publice, sănătate, educație.',
    category: 'psihosocial',
    severity: 'ridicat',
    measures: [
      'Training de-escaladare conflicte pentru personal',
      'Sisteme de alarmă personală (butoane de panică)',
      'Lucru în echipă (niciodată singur în situații cu risc)',
      'Securitate fizică (agenți pază, camere supraveghere)',
      'Protocoale de raportare incidente',
      'Suport post-incident (consiliere psihologică)',
      'Evaluarea clienților/pacienților cu istoric violent'
    ],
    legalBasis: 'Legea 319/2006 + Legea 333/2003 (paza)',
    affectedSectors: ['Spitale (urgențe, psihiatrie)', 'Poliție/Jandarmi', 'Școli', 'Servicii sociale', 'Transport public', 'Magazine/Benzinării']
  },
  {
    id: 'psihosocial-munca-de-noapte',
    title: 'Munca în ture de noapte și program neregulat',
    description: 'Lucru nocturn (22:00-06:00) sau ture rotative. Perturbarea ritmului circadian: insomnie, tulburări digestive, risc cardiovascular crescut.',
    category: 'psihosocial',
    severity: 'mediu',
    measures: [
      'Limitarea turelor consecutive de noapte (max 3-4)',
      'Pauze adecvate în timpul turei (masă caldă)',
      'Control medical periodic specializat pentru lucrători noapte',
      'Iluminare puternică la locul de muncă noaptea',
      'Spații de odihnă adecvate',
      'Evitarea atribuirii turelor de noapte persoanelor cu contraindicații medicale',
      'Rotație echilibrată și previzibilă a turelor'
    ],
    legalBasis: 'Codul Muncii art. 124-125 + Legea 319/2006',
    affectedSectors: ['Spitale', 'Producție continuă (industrie)', 'Transport', 'Securitate/Pază', 'Call-center internaționale', 'Utilități (apă, electricitate)']
  },
  {
    id: 'psihosocial-izolare-sociala',
    title: 'Izolare socială și lucru solitari',
    description: 'Lucru fără contact cu colegi: securitate nocturnă, șoferi transport lung, lucru de acasă izolat. Risc depresie, lipsa suport.',
    category: 'psihosocial',
    severity: 'mediu',
    measures: [
      'Comunicare regulată prin telefon/radio cu sediul',
      'Vizite periodice ale supervizorului',
      'Sistemele de alarmă personală pentru urgențe',
      'Întâlniri de echipă regulate (săptămânale/lunare)',
      'Acces la suport psihologic la nevoie',
      'Proceduri clare pentru situații de urgență',
      'Promovarea comunității virtuale pentru remote workers'
    ],
    legalBasis: 'Legea 319/2006 art. 6',
    affectedSectors: ['Pază/Securitate (posturi izolate)', 'Transport internațional TIR', 'Operatori utilități (stații izolate)', 'Servicii curierat', 'Freelanceri/Remote work']
  },
  {
    id: 'psihosocial-insecuritate-locuri-munca',
    title: 'Insecuritate a locului de muncă',
    description: 'Incertitudine privind continuitatea angajării: contracte pe termen scurt, restructurări frecvente, instabilitate economică.',
    category: 'psihosocial',
    severity: 'mediu',
    measures: [
      'Comunicare transparentă a managementului despre situația firmei',
      'Contracte clare cu termeni previzibili',
      'Oportunități de dezvoltare profesională (training-uri)',
      'Proceduri echitabile în caz de restructurare',
      'Suport pentru reconversie profesională',
      'Promovarea angajărilor pe termen lung unde este posibil',
      'Acces la consiliere carieră'
    ],
    legalBasis: 'Codul Muncii + Legea 319/2006',
    affectedSectors: ['Construcții (proiecte temporare)', 'Horeca sezonieră', 'Retail (contracte part-time)', 'Start-up-uri', 'Subcontractanți']
  },
  {
    id: 'psihosocial-munca-emotionala',
    title: 'Muncă emoțională intensă (contact cu suferință, deces)',
    description: 'Expunere constantă la suferință umană, deces, situații traumatizante. Risc de traumă secundară, burnout compasiune.',
    category: 'psihosocial',
    severity: 'ridicat',
    measures: [
      'Suport psihologic specializat regulat (debriefing)',
      'Grupuri de suport între colegi',
      'Rotație între departamente cu expunere diferită',
      'Training management emoțional și reziliență',
      'Recunoașterea și normalizarea reacțiilor emoționale',
      'Politici clare privind pauzele după evenimente traumatizante',
      'Acces facil la consiliere psihologică confidențială'
    ],
    legalBasis: 'Legea 319/2006 art. 6',
    affectedSectors: ['Spitale (ATI, oncologie, pediatrie)', 'Ambulanță/SMURD', 'Poliție/Pompieri', 'Servicii funerare', 'Asistenți sociali (protecție copil)', 'Call-center urgențe']
  },
  {
    id: 'psihosocial-exces-program',
    title: 'Program prelungit și suprasolicitare (ore suplimentare excesive)',
    description: 'Săptămâni de lucru peste 48h, fără zile libere, ore suplimentare constante. Epuizare fizică și psihică, conflict muncă-familie.',
    category: 'psihosocial',
    severity: 'ridicat',
    measures: [
      'Respectarea strictă a limitelor legale (48h/săptămână inclusiv ore suplimentare)',
      'Monitorizarea pontajelor și interventia la depășiri',
      'Planificare realistă a volumului de muncă',
      'Angajarea de personal suplimentar la nevoie',
      'Promovarea echilibrului viață-muncă',
      'Interzicerea culturii "always on" (email după program)',
      'Zile libere obligatorii după perioade intensive'
    ],
    legalBasis: 'Codul Muncii art. 109-112 + Directiva UE 2003/88/CE',
    affectedSectors: ['IT/Software (crunch time)', 'Consultanță/Audit', 'Restaurante/Horeca', 'Retail (sărbători)', 'Start-up-uri', 'Agricultură (sezon)']
  }
]

// Helper: Filtrare după categorie
export function getRiscuriByCategory(category: RiskCategory): ProfessionalRisk[] {
  return RISCURI_PROFESIONALE.filter(risc => risc.category === category)
}

// Helper: Filtrare după severitate
export function getRiscuriBySeverity(severity: RiskSeverity): ProfessionalRisk[] {
  return RISCURI_PROFESIONALE.filter(risc => risc.severity === severity)
}

// Helper: Căutare după sector afectat
export function getRiscuriForSector(sector: string): ProfessionalRisk[] {
  return RISCURI_PROFESIONALE.filter(risc =>
    risc.affectedSectors.some(s => s.toLowerCase().includes(sector.toLowerCase()))
  )
}

// Helper: Statistici
export function getRiscuriStatistics() {
  const byCategory = {
    fizic: getRiscuriByCategory('fizic').length,
    chimic: getRiscuriByCategory('chimic').length,
    biologic: getRiscuriByCategory('biologic').length,
    ergonomic: getRiscuriByCategory('ergonomic').length,
    psihosocial: getRiscuriByCategory('psihosocial').length
  }

  const bySeverity = {
    scăzut: getRiscuriBySeverity('scăzut').length,
    mediu: getRiscuriBySeverity('mediu').length,
    ridicat: getRiscuriBySeverity('ridicat').length,
    'foarte ridicat': getRiscuriBySeverity('foarte ridicat').length
  }

  return {
    total: RISCURI_PROFESIONALE.length,
    byCategory,
    bySeverity
  }
}
