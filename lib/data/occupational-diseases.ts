/**
 * Boli profesionale conform HG 1425/2006
 * Listă cuprinzătoare cu 30 de boli profesionale recunoscute în România
 *
 * Structură: nume, agent cauzal, industrii expuse, simptome, diagnostic, prevenție, declarare
 */

export interface OccupationalDisease {
  id: string;
  name: string;
  code: string; // Cod conform nomenclatorului
  causalAgent: string;
  exposedIndustries: string[];
  symptoms: string[];
  diagnosis: string[];
  prevention: string[];
  reportingAuthorities: {
    itm: boolean; // Inspecția Muncii
    dsp: boolean; // Direcția de Sănătate Publică
    procedure: string;
  };
  minimumExposurePeriod?: string;
  legalReference: string;
}

export const occupationalDiseases: OccupationalDisease[] = [
  {
    id: "1",
    name: "Silicoză",
    code: "BP-01",
    causalAgent: "Praf de cuarț (dioxid de siliciu cristalin)",
    exposedIndustries: [
      "Minerit și extractie de carieră",
      "Industria de prelucrare a pietrei",
      "Turnătorii",
      "Industria ceramicii și sticlei",
      "Construcții - tăiere și șlefuire beton",
      "Fabricarea abrazivilor"
    ],
    symptoms: [
      "Dispnee (dificultăți de respirație) la efort, apoi în repaus",
      "Tuse seacă persistentă",
      "Dureri toracice",
      "Oboseală cronică",
      "Scădere ponderală",
      "Expectrație în stadii avansate"
    ],
    diagnosis: [
      "Radiografie toracică - opacități nodulare",
      "CT toracic de înaltă rezoluție",
      "Probe funcționale respiratorii (spirometrie)",
      "Anamneză ocupațională detaliată",
      "Excluderea altor cauze (tuberculoză, cancer pulmonar)"
    ],
    prevention: [
      "Udare la sursă pentru reducerea prafului",
      "Sisteme de ventilație și aspirație localizată",
      "Echipamente de protecție respiratorie (măști FFP3)",
      "Control medical periodic (anual - radiografie toracică)",
      "Rotație a lucrătorilor expuși",
      "Măsurători periodice ale concentrației de praf"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare în termen de 24 ore de la diagnostic. Formular ITM standardizat + raport medical DSP. Ancheta epidemiologică obligatorie."
    },
    minimumExposurePeriod: "Variabil - de la 6 luni (expunere intensă) la 15-20 ani",
    legalReference: "HG 1425/2006, Anexa 1, poziția 1"
  },
  {
    id: "2",
    name: "Asbestoză (Amiantoză)",
    code: "BP-02",
    causalAgent: "Fibre de azbest (crizotil, crocidolit, amosite)",
    exposedIndustries: [
      "Industria de produse din azbest (interzisă din 2007)",
      "Construcții - demolare clădiri vechi",
      "Reparații nave (izolații)",
      "Industria automotive (garnituri de frână vechi)",
      "Decontaminare și deșeuri periculoase"
    ],
    symptoms: [
      "Dispnee progresivă",
      "Tuse productivă",
      "Raluri crepitante la bazele pulmonare",
      "Deformări ale degetelor (degete hipocratice)",
      "Pleurezie",
      "Risc crescut de mezoteliom și cancer pulmonar"
    ],
    diagnosis: [
      "Radiografie toracică - fibroză interstiţială bazală",
      "CT toracic - pleural plaques, fibroză",
      "Spirometrie - afectare restrictivă",
      "Istoric ocupațional documentat",
      "Biopsie pulmonară (rar necesară)"
    ],
    prevention: [
      "INTERZICEREA completă a utilizării azbestului",
      "Proceduri stricte pentru decontaminare (notificare ITRSV)",
      "Echipament de protecție complet (combinezoane, măști P3)",
      "Zone de lucru izolate cu presiune negativă",
      "監supraveghere medicală pe viață pentru expuși istoric",
      "Registru național de expuși la azbest"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare obligatorie + notificare INSP. Urmărire epidemiologică permanentă. Anchetă la locul de muncă obligatorie."
    },
    minimumExposurePeriod: "Minim 10 ani, dar poate apărea după 20-40 ani de la prima expunere",
    legalReference: "HG 1425/2006, Anexa 1, poziția 2; OUG 195/2005"
  },
  {
    id: "3",
    name: "Surditate profesională (Hipooacuzie de percepție)",
    code: "BP-03",
    causalAgent: "Zgomot ocupațional continuu > 85 dB(A)",
    exposedIndustries: [
      "Metalurgie și prelucrări mecanice",
      "Industria textilă (țesătorii)",
      "Construcții - utilizare utilaje grele",
      "Aeroporturi și transporturi",
      "Industria lemnului (tâmplării, fierăstraie)",
      "Industria extractivă"
    ],
    symptoms: [
      "Pierdere progresivă a auzului (bilateral, simetric)",
      "Tinitus (șuierături în urechi)",
      "Dificultăți de înțelegere a vorbirii în medii zgomotoase",
      "Izolare socială și afectare comunicare",
      "Debut pe frecvențe înalte (4000 Hz)"
    ],
    diagnosis: [
      "Audiometrie tonală (cădere specifică la 4000 Hz)",
      "Audiometrie vocală",
      "Impedanțometrie (excludere afecțiuni ureche medie)",
      "Istoric ocupațional cu dozimetrie zgomot",
      "Excludere cauze non-ocupaționale (presbiacuzie, otoscleroza)"
    ],
    prevention: [
      "Măsurători periodice ale nivelului de zgomot",
      "Reducere la sursă (înlocuire echipamente, amortizoare)",
      "Protecție auditivă obligatorie (dopuri, căști) > 80 dB(A)",
      "Audiometrii periodice (anual pentru expuși)",
      "Rotație lucrători și limitare timp expunere",
      "Semnalizare zone cu risc de zgomot"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare după confirmare audiometrică. ITM verifică măsuri de protecție la locul de muncă. Monitoring continuu pentru expuși."
    },
    minimumExposurePeriod: "Variabil - 5-10 ani expunere continuă la > 85 dB(A)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 8; HG 493/2006"
  },
  {
    id: "4",
    name: "Dermatite alergice de contact",
    code: "BP-04",
    causalAgent: "Substanțe chimice sensibilizante (nichel, crom, rășini epoxidice, cauciuc)",
    exposedIndustries: [
      "Industria chimică și cosmetică",
      "Construcții (ciment - cromați)",
      "Frizerii și saloane beauty",
      "Industria cauciucului și plasticelor",
      "Metalurgie (lichide de răcire, uleiuri)",
      "Agricultură (pesticide)"
    ],
    symptoms: [
      "Eritem (roșeață) și prurit (mâncărime) intens",
      "Vezicule și exsudație",
      "Edem și fisuri ale pielii",
      "Hiperkeratoză în stadii cronice",
      "Localizare la zonele de contact (mâini, brațe, față)"
    ],
    diagnosis: [
      "Anamneză ocupațională detaliată",
      "Examen dermatologic",
      "Patch test (teste epicutanate) cu baterie ocupațională",
      "Îmbunătățire în concediu medical",
      "Recidivă la reluarea expunerii"
    ],
    prevention: [
      "Înlocuirea substanțelor alergene (cromați în ciment)",
      "Echipament de protecție (mănuși nitril, bumbac)",
      "Bariere cutanate (creme protectoare)",
      "Igienă strictă și spălare corectă",
      "Informare și formare lucrători",
      "Consult dermatologic preventiv"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare după confirmare prin patch test pozitiv. ITM verifică fișele de securitate și măsuri preventive."
    },
    minimumExposurePeriod: "Variabil - de la câteva săptămâni la ani (sensibilizare individuală)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 15"
  },
  {
    id: "5",
    name: "Intoxicație cronică cu plumb",
    code: "BP-05",
    causalAgent: "Plumb și compuși anorganici de plumb",
    exposedIndustries: [
      "Industria bateriilor (acumulatori)",
      "Industria vopselelor (pigmenți)",
      "Topitorii de metale",
      "Construcții - renovări clădiri vechi",
      "Industria sticlei (cristal)",
      "Reciclare metale"
    ],
    symptoms: [
      "Anemie hipocromă microcitară",
      "Colici abdominale (colici saturnine)",
      "Neuropatie periferică (paralizie radială - mână căzută)",
      "Linie gingivală gri-albăstruie (linia Burton)",
      "Dureri articulare",
      "Afectare renală și hipertensiune arterială"
    ],
    diagnosis: [
      "Plumbemie (Pb sanguin) > 40 μg/dL (limită legală)",
      "Hemogramă - anemie, punctații bazofile",
      "Acid delta-aminolevulinic urinar crescut",
      "Protoporfirină eritrocitară crescută",
      "Funcție renală și electromiografie"
    ],
    prevention: [
      "Monitorizare plumbemie trimestrială",
      "Ventilație localizată la sursă",
      "Protecție respiratorie (măști P3)",
      "Interdicție fumat și consumat alimente la locul de muncă",
      "Igiena strictă (duș obligatoriu, schimbare haine)",
      "Scoatere din expunere la plumbemie > 60 μg/dL"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare la depășirea valorilor limită biologice. Anchetă ITM obligatorie. Măsurători de mediu și biologice regulate."
    },
    minimumExposurePeriod: "Câteva luni - ani, în funcție de intensitatea expunerii",
    legalReference: "HG 1425/2006, Anexa 1, poziția 20; Ord. 1030/2007"
  },
  {
    id: "6",
    name: "Astm bronșic profesional",
    code: "BP-06",
    causalAgent: "Sensibilizanți respiratori (izocianați, făină, animale de laborator, lemn exotic)",
    exposedIndustries: [
      "Industria auto (vopsitorie, spumă poliuretanică)",
      "Brutării și morării",
      "Laboratoare biomedicale",
      "Industria lemnului",
      "Industria farmaceutică",
      "Coafuri (persulfați)"
    ],
    symptoms: [
      "Dispnee și wheezing (șuierături)",
      "Tuse și strângere toracică",
      "Simptome agravate la locul de muncă",
      "Ameliorare în weekend/concediu",
      "Posibile crize nocturne tardive"
    ],
    diagnosis: [
      "Spirometrie cu test de reversibilitate",
      "Peak flow monitoring (monitorizare la lucru vs acasă)",
      "Test de provocare bronșică specific",
      "IgE specifice (pentru alergeni proteici)",
      "Istoric ocupațional clar"
    ],
    prevention: [
      "Înlocuirea agentului cauzal",
      "Sisteme închise și ventilație",
      "Protecție respiratorie adecvată",
      "Supraveghere medicală cu spirometrie anuală",
      "Depistare precoce și scoatere din expunere",
      "Evitare expunere pentru sensibilizați"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare după confirmare prin teste funcționale și istoric. ITM evaluează expunerea la locul de muncă."
    },
    minimumExposurePeriod: "De la câteva luni la ani (sensibilizare variabilă)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 12"
  },
  {
    id: "7",
    name: "Pneumoconioză de la praf de cărbune (Antracoză)",
    code: "BP-07",
    causalAgent: "Praf de cărbune mineral",
    exposedIndustries: [
      "Minerit subteran cărbune",
      "Preparare și sortare cărbune",
      "Termocentrale pe cărbune"
    ],
    symptoms: [
      "Dispnee progresivă",
      "Tuse cronică cu expectorație neagră (melanoptoică)",
      "Bronșită cronică asociată",
      "Risc de fibroză masivă progresivă (FMP)",
      "Susceptibilitate crescută la tuberculoză"
    ],
    diagnosis: [
      "Radiografie toracică - opacități nodulare",
      "CT toracic",
      "Spirometrie - pattern obstructiv/mixt",
      "Istoric ocupațional în mină de cărbune",
      "Excludere tuberculoză"
    ],
    prevention: [
      "Măsuri tehnice de reducere a prafului (udare, ventilație)",
      "Protecție respiratorie",
      "Control medical periodic (radiografie anuală)",
      "Limitare concentrație praf respirabil",
      "Scoatere din expunere la primele semne"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare obligatorie. Supraveghere permanentă pentru mineri. Registru național pneumoconioze."
    },
    minimumExposurePeriod: "10-15 ani în minerit",
    legalReference: "HG 1425/2006, Anexa 1, poziția 1"
  },
  {
    id: "8",
    name: "Intoxicație cronică cu mercur",
    code: "BP-08",
    causalAgent: "Mercur și compușii săi (vapori de mercur metalic, săruri)",
    exposedIndustries: [
      "Industria electrotehnic (lămpi fluorescente, baterii)",
      "Industria chimică (catalizatori)",
      "Stomatologie (amalgam dentar - uzat)",
      "Extractie aur (amalgamare - tehnologie veche)",
      "Laboratoare chimice"
    ],
    symptoms: [
      "Tremor fin al mâinilor, limbii, pleoapelor",
      "Stomatită și sialoreee (salivație crescută)",
      "Eretism (iritabilitate, timiditate, insomnie)",
      "Afectare renală (proteinurie)",
      "Linie gingivală gri-violacee",
      "Polineuropatie periferică"
    ],
    diagnosis: [
      "Mercur urinar > 50 μg/g creatinină",
      "Mercur sanguin",
      "Evaluare neurologică și psihiatrică",
      "Funcție renală",
      "Anamneză ocupațională"
    ],
    prevention: [
      "Înlocuire cu alternative (LED în loc de lămpi Hg)",
      "Sisteme închise și ventilație",
      "Monitorizare biologică trimestrială",
      "Protecție respiratorie",
      "Igiena strictă (interzicere fumat, mâncare)",
      "Intervenție rapidă la scurgeri"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare la depășire valori biologice limită. Anchetă ITM cu măsurători de mediu."
    },
    minimumExposurePeriod: "Câteva luni - ani",
    legalReference: "HG 1425/2006, Anexa 1, poziția 21"
  },
  {
    id: "9",
    name: "Intoxicație cronică cu benzen",
    code: "BP-09",
    causalAgent: "Benzen (C6H6)",
    exposedIndustries: [
      "Industria petrochimică și rafinării",
      "Fabricarea solvenților",
      "Industria chimică (sinteze organice)",
      "Laboratoare chimice",
      "Vopsitorii (solvenți vechi)"
    ],
    symptoms: [
      "Anemie aplastică (pancitopenie)",
      "Leucopenie și trombocitopenie",
      "Risc crescut de leucemie (LMA)",
      "Oboseală, paliditate, hemoragii",
      "Semne neurologice (cefalee, vertij)"
    ],
    diagnosis: [
      "Hemogramă completă repetată",
      "Acid fenilmercapturic (S-PMA) urinar",
      "Acid trans-trans-muconic urinar",
      "Medulogramă (în cazuri severe)",
      "Anamneză ocupațională documentată"
    ],
    prevention: [
      "SUBSTITUIRE benzen cu toluene/xilol (mai puțin toxic)",
      "Sisteme închise complet",
      "Monitorizare biologică lunară/trimestrială",
      "Protecție respiratorie cu cartuș specific",
      "Control medical hematologic strict",
      "Scoatere imediată din expunere la semne hematologice"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare urgentă. Benzenul este cancerigen категorie 1A. Anchetă ITM extinsă obligatorie."
    },
    minimumExposurePeriod: "Câteva luni - ani; leucemia poate apărea după >5-10 ani",
    legalReference: "HG 1425/2006, Anexa 1, poziția 18; Directiva 2004/37/CE"
  },
  {
    id: "10",
    name: "Boli osteoarticulare de hipersolicitate",
    code: "BP-10",
    causalAgent: "Mișcări repetitive, posturi forțate, vibrații",
    exposedIndustries: [
      "Industria auto (linii asamblare)",
      "Textile și confecții",
      "Prelucrări alimentare",
      "Construcții",
      "IT (sindrom tunel carpian)",
      "Manipulare manuală repetitivă"
    ],
    symptoms: [
      "Durere la nivelul articulațiilor (umăr, cot, încheietură)",
      "Limitare de mișcare",
      "Parestezii (amorțeli, furnicături)",
      "Slăbiciune musculară",
      "Umflături articulare",
      "Simptome agravate de activitate"
    ],
    diagnosis: [
      "Examen clinic ortopedic",
      "Teste specifice (Phalen, Tinel pentru tunel carpian)",
      "Electromiografie și neurografie",
      "Radiografie, ecografie, RMN",
      "Anamneză ocupațională cu analiza gesturilor"
    ],
    prevention: [
      "Analiza ergonomică a posturilor de lucru",
      "Rotație taskuri și pauze regulate",
      "Mobilier ergonomic ajustabil",
      "Gimnastică de compensare",
      "Formare în ergonomie",
      "Detectare precoce prin controale medicale"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: false,
      procedure: "Declarare ITM. Evaluare ergonomică a locului de muncă obligatorie."
    },
    minimumExposurePeriod: "Variabil - de la câteva luni la ani",
    legalReference: "HG 1425/2006, Anexa 1, poziții 30-33"
  },
  {
    id: "11",
    name: "Intoxicație cu cloruri organice (solvenți)",
    code: "BP-11",
    causalAgent: "Solvenți clorurați (tricloroetilen, percloroetilen, cloroform)",
    exposedIndustries: [
      "Curățătorii chimice",
      "Degresare metale",
      "Industria chimică",
      "Laboratoare"
    ],
    symptoms: [
      "Hepatotoxicitate (citoliza hepatică)",
      "Nefrotoxicitate",
      "Afectare neurologică centrală și periferică",
      "Dermatite de iritație",
      "Efecte carcinogene (suspiciune)"
    ],
    diagnosis: [
      "Transaminaze crescute (ALT, AST)",
      "Funcție renală (creatinină, uree)",
      "Acid tricloracetic urinar (pentru tricloroetilen)",
      "Examen neurologic",
      "Anamneză ocupațională"
    ],
    prevention: [
      "Substituire cu solvenți mai puțin toxici",
      "Sisteme închise și ventilație",
      "Protecție respiratorie și dermică",
      "Monitorizare biologică hepatică și renală",
      "Interdicție consum alcool pentru expuși"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare la diagnostic. ITM evaluează expunerea și măsurile de control."
    },
    minimumExposurePeriod: "Luni - ani",
    legalReference: "HG 1425/2006, Anexa 1, poziția 19"
  },
  {
    id: "12",
    name: "Silicoantracoza",
    code: "BP-12",
    causalAgent: "Praf mixt de siliciu și cărbune",
    exposedIndustries: [
      "Minerit cărbune cu conținut ridicat de silice",
      "Tuneluri și lucrări subterane"
    ],
    symptoms: [
      "Combinație de simptome ale silicozei și antracozei",
      "Dispnee severă",
      "Risc crescut de tuberculoză",
      "Progresie rapidă spre fibroză"
    ],
    diagnosis: [
      "Radiografie toracică - opacități mixte",
      "CT toracic",
      "Spirometrie - afectare mixtă",
      "Excludere tuberculoză activă",
      "Anamneză mină de cărbune"
    ],
    prevention: [
      "Măsuri anti-praf combinate",
      "Ventilație îmbunătățită",
      "Protecție respiratorie strictă",
      "Supraveghere medicală intensivă"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare ca pneumoconioză mixtă. Supraveghere intensificată."
    },
    minimumExposurePeriod: "10+ ani",
    legalReference: "HG 1425/2006, Anexa 1, poziția 1"
  },
  {
    id: "13",
    name: "Berilioză",
    code: "BP-13",
    causalAgent: "Beriliu și compușii săi",
    exposedIndustries: [
      "Industria aerospațială",
      "Electronică (componente)",
      "Industria nucleară",
      "Aliaje speciale"
    ],
    symptoms: [
      "Granulomatoză pulmonară (similar sarcoidozei)",
      "Dispnee și tuse",
      "Slăbiciune generală",
      "Afectare sistemică posibilă"
    ],
    diagnosis: [
      "Radiografie și CT toracic - granulomatoză",
      "Test de transformare limfocitară (BeLPT)",
      "Lavaj bronhoalveolar",
      "Biopsie pulmonară - granuloame",
      "Beriliu urinar"
    ],
    prevention: [
      "Sisteme închise complet",
      "Protecție respiratorie de nivel înalt",
      "Monitorizare biologică",
      "Screening cu BeLPT pentru expuși",
      "Scoatere imediată din expunere la sensibilizare"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare obligatorie. Beriliul este foarte toxic - anchetă extinsă."
    },
    minimumExposurePeriod: "Luni - ani; poate avea latență lungă",
    legalReference: "HG 1425/2006, Anexa 1, poziția 4"
  },
  {
    id: "14",
    name: "Intoxicație cu cadmiu",
    code: "BP-14",
    causalAgent: "Cadmiu și compușii săi",
    exposedIndustries: [
      "Industria bateriilor Ni-Cd",
      "Galvanizare",
      "Pigmenți",
      "Industria plastice (stabilizatori PVC)",
      "Sudură aliaje cadmiu"
    ],
    symptoms: [
      "Nefrotoxicitate (proteinurie tubulară - β2-microglobulină)",
      "Osteomalație și osteoporoză",
      "Pneumonită acută (la expunere intensă)",
      "Emfizem pulmonar",
      "Risc crescut de cancer pulmonar și prostată"
    ],
    diagnosis: [
      "Cadmiu urinar > 5 μg/g creatinină",
      "β2-microglobulină urinară crescută",
      "Cadmiu sanguin (expunere recentă)",
      "Funcție renală completă",
      "Densitometrie osoasă"
    ],
    prevention: [
      "Substituire cu alternative",
      "Sisteme închise și aspirație locală",
      "Protecție respiratorie strictă",
      "Monitorizare biologică semestrială",
      "Interdicție fumat (fumul concentrează Cd)"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare obligatorie. Cadmiul este cancerigen categoria 1B. Anchetă ITM detaliată."
    },
    minimumExposurePeriod: "Ani - decenii pentru nefrotoxicitate",
    legalReference: "HG 1425/2006, Anexa 1, poziția 22; Directiva 2004/37/CE"
  },
  {
    id: "15",
    name: "Intoxicație cu crom hexavalent",
    code: "BP-15",
    causalAgent: "Compuși de crom hexavalent (CrVI)",
    exposedIndustries: [
      "Galvanizare și cromare",
      "Sudură inox",
      "Fabricare pigmenți (cromat de plumb)",
      "Tăbăcării (uzat)",
      "Vopsitorii industriale"
    ],
    symptoms: [
      "Ulcerații nazale și perforare sept nazal",
      "Dermatite și ulcerații cutanate",
      "Bronșită cronică",
      "Risc crescut de cancer pulmonar și nazal",
      "Sensibilizare alergică"
    ],
    diagnosis: [
      "Crom urinar (CrU) > 30 μg/g creatinină (sfârşit schimb)",
      "Examen ORL - leziuni nazale",
      "Examen dermatologic",
      "Radiografie toracică",
      "Anamneză ocupațională"
    ],
    prevention: [
      "SUBSTITUIRE CrVI cu CrIII (mai puțin toxic)",
      "Sisteme închise pentru baie de cromare",
      "Aspirație localizată puternică",
      "Protecție respiratorie și dermică",
      "Monitorizare biologică lunară",
      "Examen ORL periodic"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare obligatorie. CrVI este cancerigen categoria 1A. Măsuri urgente ITM."
    },
    minimumExposurePeriod: "Luni - ani",
    legalReference: "HG 1425/2006, Anexa 1, poziția 23; Directiva 2004/37/CE"
  },
  {
    id: "16",
    name: "Sindrom de vibrații mână-braț (HAVS)",
    code: "BP-16",
    causalAgent: "Vibrații transmise la mână (scule vibrante)",
    exposedIndustries: [
      "Construcții (ciocane pneumatice, compactoare)",
      "Minerit (perforatoare)",
      "Forestier (ferăstraie cu lanț)",
      "Industria metalului (polizoare, șlefuitoare)",
      "Prelucrare piatră"
    ],
    symptoms: [
      "Fenomen Raynaud (albire degetelor la frig)",
      "Parestezii și amorțeli degetelor",
      "Pierdere sensibilitate tactilă fină",
      "Dureri și slăbiciune în mâini",
      "Afectare osteoarticulară (chisturi osoase)"
    ],
    diagnosis: [
      "Anamneză ocupațională cu scule vibrante",
      "Test de provocare cu răcire",
      "Pletismografie digitală",
      "Teste de sensibilitate vibratorie",
      "Radiografie oase carpe și metacarpiene",
      "Evaluare neurologică"
    ],
    prevention: [
      "Scule antivibrații (izolare, amortizare)",
      "Limitare timp de expunere (max 2-4h/zi)",
      "Mănuși antivibrații",
      "Menținere căldură mâini",
      "Pauze regulate",
      "Monitorizare vibrații conform ISO 5349",
      "Scoatere din expunere la primele semne"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: false,
      procedure: "Declarare ITM. Evaluare niveluri de vibrații la locul de muncă obligatorie."
    },
    minimumExposurePeriod: "2-5 ani pentru semne vasculare; 10-20 ani pentru afectare osoasă",
    legalReference: "HG 1425/2006, Anexa 1, poziția 34; HG 1876/2005 (vibrații)"
  },
  {
    id: "17",
    name: "Astm de la făină (Baker's asthma)",
    code: "BP-17",
    causalAgent: "Proteine din făina de grâu, secară, orz + enzime (α-amilază)",
    exposedIndustries: [
      "Brutării și patiserii",
      "Morării",
      "Fabricare paste făinoase",
      "Industria de panificație industrială"
    ],
    symptoms: [
      "Rinoconjunctivită alergică",
      "Dispnee și wheezing la contact cu făină",
      "Tuse și strângere toracică",
      "Urticarie de contact (mai rar)",
      "Simptome ameliorate în weekend"
    ],
    diagnosis: [
      "Spirometrie cu test reversibilitate",
      "Peak flow monitoring (lucru vs acasă)",
      "IgE specifice pentru făină și α-amilază",
      "Prick test cutanat cu extracte făină",
      "Test de provocare bronșică (în centru specializat)"
    ],
    prevention: [
      "Măsuri tehnice: sisteme închise de manipulare făină",
      "Ventilație generală și localizată",
      "Măști FFP2/FFP3 pentru operațiuni cu praf",
      "Igienă: spălare haine, duș după schimb",
      "Screening pre-angajare (antecedente astm)",
      "Supraveghere medicală anuală cu spirometrie",
      "Realocare la primele semne de sensibilizare"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare ca astm profesional. ITM evaluează măsuri anti-praf."
    },
    minimumExposurePeriod: "6 luni - 5 ani (variabil individual)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 12"
  },
  {
    id: "18",
    name: "Alveolită alergică extrinsecă (Plămânul fermierului)",
    code: "BP-18",
    causalAgent: "Spori de fungi (Micropolyspora faeni, Thermoactinomyces) din fân/cereale mucegăite",
    exposedIndustries: [
      "Agricultură (ferme, silozuri)",
      "Creșterea animalelor",
      "Depozite cereale",
      "Morării"
    ],
    symptoms: [
      "Formă acută: febră, frisoane, dispnee la 4-8h după expunere",
      "Tuse seacă, dureri musculare",
      "Formă cronică: dispnee progresivă, fibronală",
      "Oboseală, scădere ponderală",
      "Raluri crepitante bazale"
    ],
    diagnosis: [
      "CT toracic: opacități în sticlă mată, noduli",
      "Lavaj bronhoalveolar: limfocitoză (>50%)",
      "IgG precipitante serice specifice",
      "Spirometrie: pattern restrictiv",
      "Biopsie pulmonară: granuloame",
      "Istoric expunere + test provocare (rar)"
    ],
    prevention: [
      "Depozitare fân/cereale la umiditate corectă (<20%)",
      "Ventilație adecvată silozuri și grajduri",
      "Protecție respiratorie la manipulare fân mucegăit",
      "Evitare expunere pentru sensibilizați",
      "Educație fermieri privind riscurile"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare ca pneumopatie profesională. DSP monitorizează cazurile în agricultură."
    },
    minimumExposurePeriod: "Luni - ani (forme acute pot apărea rapid)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 13"
  },
  {
    id: "19",
    name: "Intoxicație cu monoxid de carbon (CO)",
    code: "BP-19",
    causalAgent: "Monoxid de carbon (CO)",
    exposedIndustries: [
      "Topitorii și furnale",
      "Garaje și parcări (gaze eșapament)",
      "Pompieri",
      "Fabricare negru de fum",
      "Reparații auto în spații închise"
    ],
    symptoms: [
      "Formă acută: cefalee, vertij, greață, confuzie",
      "Sincopă, convulsii, comă",
      "Formă cronică: cefalee persistentă, oboseală, tulburări cognitive",
      "Afectare cardiacă (angină, aritmii)",
      "Secvele neurologice permanente posibile"
    ],
    diagnosis: [
      "Carboxihemoglobină (COHb) > 10% (nefumători), >15% (fumători)",
      "Gaze sangvine arteriale",
      "EKG și troponine (evaluare cardiacă)",
      "Evaluare neurologică",
      "Circumstanțe expunere"
    ],
    prevention: [
      "Ventilație adecvată a spațiilor închise",
      "Detectoare CO obligatorii în zone cu risc",
      "Întreținere corectă instalații ardere",
      "Interdicție rulare motor în garaj închis",
      "Evacuare gaze de eșapament la exterior",
      "Formare lucrători în recunoaștere simptome"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare la expunere acută ocupațională. Anchetă ITM pentru prevenire recurență."
    },
    minimumExposurePeriod: "Acute (minute-ore) sau cronic (luni-ani la expuneri repetate mici)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 24"
  },
  {
    id: "20",
    name: "Neuropatie optică toxică",
    code: "BP-20",
    causalAgent: "Alcool metilic (metanol), disulfură de carbon, plumb",
    exposedIndustries: [
      "Industria chimică (metanol)",
      "Fabricare fibre sintetice (CS2)",
      "Industria cauciucului (CS2)",
      "Intoxicație accidentală"
    ],
    symptoms: [
      "Scădere acuitate vizuală progresivă",
      "Modificări câmp vizual (scotom central)",
      "Alterări percepție culori",
      "În cazuri severe: orbire",
      "Dureri oculare"
    ],
    diagnosis: [
      "Examen oftalmologic complet",
      "Câmp vizual (perimetrie)",
      "Funduscopie: atrofie nervului optic",
      "Potențiale evocate vizuale",
      "Metanol sanguin (în caz de suspiciune metanol)",
      "Plumbemie (dacă plumb)",
      "Anamneză ocupațională"
    ],
    prevention: [
      "ELIMINARE metanol din procesele de lucru",
      "Sisteme închise pentru CS2",
      "Ventilație și protecție respiratorie",
      "Examen oftalmologic periodic (anual)",
      "Formare lucrători: recunoaștere simptome precoce",
      "Scoatere imediată din expunere la semne"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare urgentă. Anchetă ITM cu măsurători urgente de mediu."
    },
    minimumExposurePeriod: "Variabil - de la expunere acută (metanol) la ani (plumb, CS2)",
    legalReference: "HG 1425/2006, Anexa 1, poziții diverse"
  },
  {
    id: "21",
    name: "Bronhopneumopatie cronică obstructivă (BPOC) profesională",
    code: "BP-21",
    causalAgent: "Prafuri organice și anorganice, fum, gaze iritante",
    exposedIndustries: [
      "Minerit",
      "Construcții",
      "Agricultură",
      "Metalurgie",
      "Textile",
      "Fabricare ciment"
    ],
    symptoms: [
      "Dispnee progresivă la efort",
      "Tuse cronică productivă (> 3 luni/an, 2 ani consecutiv)",
      "Wheezing și strângere toracică",
      "Exacerbări frecvente",
      "Toleranță scăzută la efort"
    ],
    diagnosis: [
      "Spirometrie: VEMS/CVF < 0.70 post-bronhodilatator",
      "Radiografie/CT toracic",
      "Gazometrie arterială",
      "Istoric ocupațional documentat (>10 ani expunere)",
      "Excludere alte cauze (fumatul - coexistă frecvent)"
    ],
    prevention: [
      "Control praf la sursă",
      "Ventilație adecvată",
      "Protecție respiratorie",
      "Încetare fumat (crucial!)",
      "Spirometrie anuală pentru expuși",
      "Vaccinare anti-gripală și anti-pneumococică"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare ca boală profesională. Evaluare expunere cumulativă obligatorie."
    },
    minimumExposurePeriod: ">10 ani expunere semnificativă",
    legalReference: "HG 1425/2006, Anexa 1, poziția 11"
  },
  {
    id: "22",
    name: "Dermatoze iritative profesionale",
    code: "BP-22",
    causalAgent: "Substanțe iritante (acizi, baze, solvenți, uleiuri, apă)",
    exposedIndustries: [
      "Curățenie și igienizare (detergenti)",
      "Metalurgie (lichide de răcire)",
      "Construcții (ciment)",
      "Coafură",
      "Medicină și îngrijire (spălări frecvente mâini)",
      "Agricultură (pesticide)"
    ],
    symptoms: [
      "Eritem, xeroza (uscăciune), fisuri",
      "Arsură, înțepătură la contact",
      "Fără perioadă de sensibilizare (apare de la prima expunere)",
      "Localizare strictă la zona de contact",
      "Ameliorare la oprirea expunerii"
    ],
    diagnosis: [
      "Examen dermatologic",
      "Anamneză: apare de la prima expunere (vs. alergic)",
      "Patch test NEGATIV (vs. dermatită alergică)",
      "Îmbunătățire în concediu",
      "Evaluare factori de risc (umiditate, frecare)"
    ],
    prevention: [
      "Substituire cu produse mai puțin iritante",
      "Protecție mâini: mănuși adecvate (nitril, neopren)",
      "Creme barieră înainte de lucru",
      "Emoliiente după lucru",
      "Educație igienă: spălare corectă, uscare bună",
      "Pauze pentru recuperare piele"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare ca dermatoză profesională. ITM evaluează fișele de securitate substanțe."
    },
    minimumExposurePeriod: "Poate apărea de la primele expuneri (zile-săptămâni)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 15"
  },
  {
    id: "23",
    name: "Intoxicație cu pesticide organofosforice",
    code: "BP-23",
    causalAgent: "Insecticide organofosforice (parathion, malathion, diazinon)",
    exposedIndustries: [
      "Agricultură (aplicare pesticide)",
      "Fabricare pesticide",
      "Dezinsecție și deratizare",
      "Depozitare și transport pesticide"
    ],
    symptoms: [
      "Sindrom colinergic muscarinic: mioza, hipersecreție (salivație, transpirație, lacrimare)",
      "Bronhoconstricție, dispnee",
      "Efecte nicotinice: fasciculații musculare, slăbiciune",
      "Efecte SNC: cefalee, confuzie, convulsii, comă",
      "Bradicardie, hipotensiune"
    ],
    diagnosis: [
      "Activitate colinesterază eritrocitară < 70% din normal",
      "Colinesterază plasmatică (mai puțin specific)",
      "Clinic: sindrom colinergic + istoric expunere",
      "Excludere alte cauze neurologice"
    ],
    prevention: [
      "Echipament de protecție complet (combinezon, mănuși, mască)",
      "Respectare interval de reintrare în culturi tratate",
      "Depozitare securizată a pesticidelor",
      "Monitorizare colinesterază pre-sezon și lunar în sezon",
      "Formare aplicatori: utilizare corectă, simptome intoxicație",
      "Disponibilitate antidot (atropină, pralidoximă)"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare urgentă. Intoxicațiile acute sunt cazuri de urgență medicală. Anchetă DSP și ITM."
    },
    minimumExposurePeriod: "Acute (ore) sau cronice (săptămâni-luni expuneri repetate)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 26"
  },
  {
    id: "24",
    name: "Hepatită toxică profesională",
    code: "BP-24",
    causalAgent: "Solvenți organici (CCl4, cloroform), hidrocarburi aromatice, metale (arsenic)",
    exposedIndustries: [
      "Industria chimică",
      "Curățătorii chimice",
      "Vopsitorii",
      "Laboratoare chimice",
      "Fabricare pesticide"
    ],
    symptoms: [
      "Astenie, anorexie, greață",
      "Icter (în cazuri severe)",
      "Hepatomegalie dureroasă",
      "În cazuri severe: insuficiență hepatică acută",
      "Forme cronice: ciroză"
    ],
    diagnosis: [
      "Transaminaze crescute (ALT, AST)",
      "Bilirubină crescută",
      "Timp de protrombină alungit (cazuri severe)",
      "Ecografie abdominală",
      "Excludere cauze virale (VHA, VHB, VHC) și autoimune",
      "Anamneză ocupațională cu hepatotoxice",
      "Îmbunătățire la oprirea expunerii"
    ],
    prevention: [
      "Substituire substanțe hepatotoxice",
      "Sisteme închise și ventilație",
      "Protecție respiratorie și dermică",
      "Monitorizare biologică hepatică (transaminaze) trimestrial",
      "Interdicție consum alcool pentru expuși",
      "Scoatere imediată din expunere la creștere transaminaze"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare după confirmare etiologie toxică. ITM anchetează expunerea la hepatotoxice."
    },
    minimumExposurePeriod: "Variabil: de la expunere acută masivă (zile) la cronică (luni-ani)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 19"
  },
  {
    id: "25",
    name: "Intoxicație cu hidrogen sulfurat (H2S)",
    code: "BP-25",
    causalAgent: "Hidrogen sulfurat (H2S)",
    exposedIndustries: [
      "Industria petrolieră și gaze naturale",
      "Rafinării",
      "Epurare ape uzate",
      "Industria hârtiei (proces sulfat)",
      "Concierii și tăbăcării",
      "Spații confinate cu materie organică în descompunere"
    ],
    symptoms: [
      "Expunere mică: iritație oculară, rinofaringiană",
      "Miros de ouă stricate (pierdere miros la concentrații mari - semn pericol!)",
      "Expunere mare: edempulmonar, insuficiență respiratorie",
      "Expunere masivă: stop respirator imediat, moarte",
      "Efecte neurologice: cefalee, confuzie, convulsii"
    ],
    diagnosis: [
      "Diagnostic clinic + istoric expunere",
      "Sulfhemoglobină (rar utilizat, instabil)",
      "Gazometrie: acidoză metabolică",
      "Radiografie toracică (edem pulmonar)",
      "Evaluare neurologică"
    ],
    prevention: [
      "Detectoare H2S continue în zone cu risc",
      "Ventilație forțată spații confinate",
      "Proceduri permis de lucru pentru spații confinate",
      "Protecție respiratorie cu aer suflat (NU filtre!)",
      "Formare salvare și resuscitare",
      "Interzicere intrare singur în spații confinate",
      "Plan de urgență și echipe de salvare"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare urgentă în caz de intoxicație. ITRSV anchetează dacă accident mortal sau grav."
    },
    minimumExposurePeriod: "Acute (minute-ore) - H2S este toxic acut, nu cronic tipic",
    legalReference: "HG 1425/2006, Anexa 1, poziția 25"
  },
  {
    id: "26",
    name: "Cancer vezicii urinare de origine profesională",
    code: "BP-26",
    causalAgent: "Amine aromatice (benzidinã, β-naftilamină, 4-aminobifenil)",
    exposedIndustries: [
      "Industria coloranților (istoric)",
      "Industria cauciucului",
      "Industria vopselelor și lacurilor",
      "Industria textilă",
      "Laboratoare chimice"
    ],
    symptoms: [
      "Hematurie (sânge în urină) - macroscopică sau microscopică",
      "Discofort pelvin",
      "Polakiurie, urgență micțională",
      "Simptome tardive: durere, pierdere ponderală",
      "Latență lungă: 10-30 ani de la expunere"
    ],
    diagnosis: [
      "Cistoscopie cu biopsie (confirmare)",
      "Citologie urinară",
      "Ecografie vezică urinară",
      "CT urografie",
      "Anamneză ocupațională detaliată (expunere amine aromatice)",
      "Excludere alte cauze (fumat - factor de risc adițional)"
    ],
    prevention: [
      "INTERZICEREA aminelor aromatice cancerigene (benzidinã etc.)",
      "Substituire cu coloranți non-cancerigeni",
      "Pentru expuși istoric: supraveghere medicală pe viață",
      "Cistoscopie la 2-3 ani pentru expuși",
      "Citologie urinară anuală",
      "Încetare fumat (efect sinergic cu amine aromatice)"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare obligatorie ca cancer profesional. Cercetare epidemiologică. Registru național cancere profesionale."
    },
    minimumExposurePeriod: "Ani de expunere, dar latență 10-30 ani până la apariție cancer",
    legalReference: "HG 1425/2006, Anexa 1, poziția 37; Directiva 2004/37/CE"
  },
  {
    id: "27",
    name: "Leucemie acută de origine profesională",
    code: "BP-27",
    causalAgent: "Benzen, radiații ionizante, citostatice",
    exposedIndustries: [
      "Industria petrochimică (benzen)",
      "Radioterapie și radiologie medicală",
      "Industria nucleară",
      "Personal medical oncologie (citostatice)",
      "Laboratoare chimice"
    ],
    symptoms: [
      "Anemie: paliditate, astenie, dispnee",
      "Trombocitopenie: hemoragii, purpură",
      "Leucopenie: infecții recurente",
      "Febră, transpirații nocturne",
      "Organomegalie (splenomegalie, hepatomegalie)",
      "Dureri osoase"
    ],
    diagnosis: [
      "Hemogramă: pancitopenie, blasți circulanți",
      "Medulogramă și biopsie medulară (confirmare)",
      "Imunofenotipare (clasificare LAM, LAL)",
      "Citogenetică și molecular",
      "Anamneză ocupațională: expunere benzen/radiații >5-10 ani",
      "Latență tipică: 5-20 ani de la expunere"
    ],
    prevention: [
      "ELIMINARE benzen din procesele de lucru",
      "Protecție radiologică strictă (timp, distanță, ecranare)",
      "Dozimetrie individuală pentru expuși la radiații",
      "Manipulare citostatice în flux laminar",
      "Supraveghere hematologică strictă (hemogramă trimestrial)",
      "Limite de doză radiații (20 mSv/an lucrători)",
      "Scoatere din expunere la primele anomalii hematologice"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare urgentă ca cancer profesional. Anchetă epidemiologică extinsă. Raportare INSP și registru național."
    },
    minimumExposurePeriod: "Ani de expunere (>5-10 ani tipic), latență 5-20 ani",
    legalReference: "HG 1425/2006, Anexa 1, poziția 38; Directiva 2004/37/CE; NSR-01 (radiații)"
  },
  {
    id: "28",
    name: "Mezoteliom pleural profesional",
    code: "BP-28",
    causalAgent: "Azbest (toate tipurile de fibre)",
    exposedIndustries: [
      "Industria de azbest (interzisă din 2007)",
      "Șantiere navale",
      "Construcții (izolații vechi, decontaminare)",
      "Industria auto (garnituri frână vechi)",
      "Lucrări demolare clădiri vechi"
    ],
    symptoms: [
      "Dispnee progresivă",
      "Dureri toracice persistente",
      "Tuse seacă",
      "Revărsat pleural",
      "Scădere ponderală, astenie",
      "Prognostic foarte rezervat (supraviețuire mediană <1 an)"
    ],
    diagnosis: [
      "CT toracic: îngroșare pleurală neregulată, revărsat",
      "Toracoscopie cu biopsie pleurală (confirmare histologică)",
      "Imunohistochimie (calretinină, WT1 pozitive)",
      "Anamneză ocupațională: expunere azbest (chiar scurtă!)",
      "Latență foarte lungă: 20-50 ani de la expunere",
      "Excludere metastaze pleurale (diagnostic diferențial)"
    ],
    prevention: [
      "INTERZICERE completă azbest (OUG 195/2005)",
      "Proceduri stricte decontaminare (notificare ITRSV)",
      "Echipament protecție complet (combinezoane P3, măști FFP3)",
      "Zone izolate cu presiune negativă",
      "Supraveghere medicală pe viață pentru expuși istoric",
      "Registru național expuși la azbest",
      "Educație: risc persistent decenii după expunere"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare obligatorie ca cancer profesional. Raportare INSP. Cercetare epidemiologică. Căutare activ alți expuși."
    },
    minimumExposurePeriod: "Chiar expunere scurtă poate cauza; latență 20-50 ani",
    legalReference: "HG 1425/2006, Anexa 1, poziția 39; OUG 195/2005; Directiva 2004/37/CE"
  },
  {
    id: "29",
    name: "Sindrom de Raynaud de origine profesională",
    code: "BP-29",
    causalAgent: "Vibrații transmise la mână (component vascular al HAVS) sau substanțe chimice (clorură de vinil)",
    exposedIndustries: [
      "Utilaje vibrante (identic HAVS poziția 16)",
      "Industria PVC (clorură de vinil monomer)"
    ],
    symptoms: [
      "Episoade de albire (pallor) degetelor la frig sau stress",
      "Urmată de cianoză (albăstrire) și apoi rubefoși (roșeață)",
      "Durere, amorțeală în timpul crizei",
      "Frecvență și severitate crescândă în timp",
      "Posibile ulcerații degetelor în stadii avansate"
    ],
    diagnosis: [
      "Anamneză: episoade caracteristice + expunere ocupațională",
      "Test de provocare cu răcire",
      "Pletismografie digitală",
      "Caprilaroscopie ungheală",
      "Excludere Raynaud primar și boli de țesut conjunctiv",
      "Istoric expunere vibrații sau clorură de vinil"
    ],
    prevention: [
      "Pentru vibrații: vezi HAVS (poziția 16)",
      "Pentru clorură de vinil: sisteme închise complet, monitorizare",
      "Menținere căldură mâini și corp",
      "Evitare fumat (vasoconstrictor)",
      "Scoatere din expunere la primele episoade"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: false,
      procedure: "Declarare ITM. Evaluare expunere vibrații sau substanțe chimice vasculotoxice."
    },
    minimumExposurePeriod: "2-10 ani pentru vibrații; variabil pentru substanțe chimice",
    legalReference: "HG 1425/2006, Anexa 1, poziția 34 (vibrații)"
  },
  {
    id: "30",
    name: "Rinită și astm de la animale de laborator (LAA - Laboratory Animal Allergy)",
    code: "BP-30",
    causalAgent: "Alergeni de la animale de laborator (șobolani, șoareci, cobai, iepuri) - proteine din urină, salivă, păr",
    exposedIndustries: [
      "Laboratoare biomedicale și cercetare",
      "Industria farmaceutică (testare animale)",
      "Universități (animaliere)",
      "Institute de cercetare"
    ],
    symptoms: [
      "Rinoconjunctivită alergică: strănut, rinoree, congestie nazală, lăcrimare",
      "Astm: dispnee, wheezing, tuse la contact cu animale",
      "Urticarie de contact (mai rar)",
      "Simptome imediate sau tardive (4-8h)",
      "Agravare progresivă, sensibilizare crescândă"
    ],
    diagnosis: [
      "Anamneză: simptome la contact cu animale de laborator",
      "Spirometrie cu test reversibilitate",
      "Peak flow monitoring",
      "Prick test cutanat cu extracte alergeni animale",
      "IgE specifice serice (șobolan, șoarece, etc.)",
      "Test de provocare nazală/bronșică (centru specializat)"
    ],
    prevention: [
      "Măsuri tehnice: cuști ventilate individual (IVC)",
      "Ventilație cu presiune negativă în animaliere",
      "Echipament protecție: halat, mănuși, mască FFP2/FFP3",
      "Igienă strictă: spălare mâini, schimbare haine",
      "Screening pre-angajare (antecedente atopice - risc crescut)",
      "Supraveghere medicală: chestionar + spirometrie anual",
      "Realocare la primele semne sensibilizare (IgE pozitive)",
      "Educare: risc progresie astm sever"
    ],
    reportingAuthorities: {
      itm: true,
      dsp: true,
      procedure: "Declarare ca astm/rinită profesională. ITM evaluează măsuri de protecție în animaliere."
    },
    minimumExposurePeriod: "6 luni - 3 ani (sensibilizare variabilă; 20-30% expuși se sensibilizează)",
    legalReference: "HG 1425/2006, Anexa 1, poziția 12 (astm profesional)"
  }
];

/**
 * Funcții helper pentru lucrul cu bolile profesionale
 */

export function getDiseaseById(id: string): OccupationalDisease | undefined {
  return occupationalDiseases.find(disease => disease.id === id);
}

export function getDiseasesByIndustry(industry: string): OccupationalDisease[] {
  return occupationalDiseases.filter(disease =>
    disease.exposedIndustries.some(ind =>
      ind.toLowerCase().includes(industry.toLowerCase())
    )
  );
}

export function getDiseasesByCausalAgent(agent: string): OccupationalDisease[] {
  return occupationalDiseases.filter(disease =>
    disease.causalAgent.toLowerCase().includes(agent.toLowerCase())
  );
}

export function getDiseasesRequiringITMReporting(): OccupationalDisease[] {
  return occupationalDiseases.filter(disease => disease.reportingAuthorities.itm);
}

export function getDiseasesRequiringDSPReporting(): OccupationalDisease[] {
  return occupationalDiseases.filter(disease => disease.reportingAuthorities.dsp);
}

export function searchDiseases(searchTerm: string): OccupationalDisease[] {
  const term = searchTerm.toLowerCase();
  return occupationalDiseases.filter(disease =>
    disease.name.toLowerCase().includes(term) ||
    disease.causalAgent.toLowerCase().includes(term) ||
    disease.symptoms.some(symptom => symptom.toLowerCase().includes(term)) ||
    disease.exposedIndustries.some(industry => industry.toLowerCase().includes(term))
  );
}

/**
 * Statistici generale
 */
export const diseaseStats = {
  total: occupationalDiseases.length,
  requiringITM: occupationalDiseases.filter(d => d.reportingAuthorities.itm).length,
  requiringDSP: occupationalDiseases.filter(d => d.reportingAuthorities.dsp).length,
  cancers: occupationalDiseases.filter(d =>
    d.name.toLowerCase().includes('cancer') ||
    d.name.toLowerCase().includes('leucemie') ||
    d.name.toLowerCase().includes('mezoteliom')
  ).length,
  pneumoconioses: occupationalDiseases.filter(d =>
    d.name.toLowerCase().includes('silicoză') ||
    d.name.toLowerCase().includes('asbestoză') ||
    d.name.toLowerCase().includes('antracoză') ||
    d.name.toLowerCase().includes('berilioză')
  ).length
};
