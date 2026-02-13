/**
 * Chemical Hazards Database
 *
 * Database of 20 common hazardous substances in Romanian workplaces
 * with GHS classification, exposure limits, and safety information.
 */

export interface ChemicalHazard {
  id: string;
  name: string;
  nameRo: string;
  casNumber: string;
  ghsPictograms: string[]; // GHS01-GHS09
  hazardStatements: string[]; // H-codes
  precautionaryStatements: string[]; // P-codes
  wel: {
    // Workplace Exposure Limits
    twa?: number; // Time-Weighted Average (8h) in mg/m³ or ppm
    stel?: number; // Short-Term Exposure Limit (15min) in mg/m³ or ppm
    unit: 'mg/m³' | 'ppm' | 'fibre/cm³';
    notes?: string;
  };
  requiredEIP: string[]; // Required Personal Protective Equipment
  firstAid: {
    inhalation: string;
    skinContact: string;
    eyeContact: string;
    ingestion: string;
  };
  storageRequirements: string;
  incompatibilities: string[];
}

export const CHEMICAL_HAZARDS: ChemicalHazard[] = [
  {
    id: 'acetone',
    name: 'Acetone',
    nameRo: 'Acetonă',
    casNumber: '67-64-1',
    ghsPictograms: ['GHS02', 'GHS07'],
    hazardStatements: ['H225', 'H319', 'H336'],
    precautionaryStatements: ['P210', 'P233', 'P240', 'P305+P351+P338', 'P403+P235'],
    wel: {
      twa: 500,
      stel: 1000,
      unit: 'ppm',
    },
    requiredEIP: ['Mănuși rezistente la chimicale', 'Ochelari de protecție', 'Ventilație adecvată'],
    firstAid: {
      inhalation: 'Mutați victima la aer curat. Dacă respirația este dificilă, administrați oxigen. Solicitați asistență medicală.',
      skinContact: 'Spălați imediat cu apă abundentă timp de cel puțin 15 minute. Îndepărtați îmbrăcămintea contaminată. Consultați medicul dacă iritația persistă.',
      eyeContact: 'Clătiți imediat cu apă abundentă timp de cel puțin 15 minute, ridicând pleoapele. Consultați un oftalmolog.',
      ingestion: 'Clătiți gura cu apă. NU provocați vărsături. Solicitați imediat asistență medicală.',
    },
    storageRequirements: 'Depozitați la loc răcoros, bine ventilat, departe de surse de aprindere și oxidanți.',
    incompatibilities: ['Oxidanți puternici', 'Acizi puternici', 'Halogeni'],
  },
  {
    id: 'ammonia',
    name: 'Ammonia',
    nameRo: 'Amoniac',
    casNumber: '7664-41-7',
    ghsPictograms: ['GHS04', 'GHS05', 'GHS06', 'GHS09'],
    hazardStatements: ['H221', 'H280', 'H314', 'H331', 'H400'],
    precautionaryStatements: ['P210', 'P260', 'P280', 'P303+P361+P353', 'P304+P340', 'P305+P351+P338', 'P410+P403'],
    wel: {
      twa: 25,
      stel: 35,
      unit: 'ppm',
    },
    requiredEIP: ['Mănuși de protecție chimică', 'Ochelari ermetici', 'Mască cu filtru ABEK', 'Îmbrăcăminte de protecție'],
    firstAid: {
      inhalation: 'Mutați victima imediat la aer curat. Dacă respirația s-a oprit, aplicați resuscitare cardio-respiratorie. Solicitați urgent asistență medicală.',
      skinContact: 'Îndepărtați îmbrăcămintea contaminată. Spălați imediat cu apă abundentă timp de minimum 30 minute. Consultați urgent un medic - risc de arsuri severe.',
      eyeContact: 'Clătiți IMEDIAT cu apă abundentă timp de minimum 30 minute. Consultați URGENT un oftalmolog - risc de orbire.',
      ingestion: 'Clătiți gura cu apă. NU provocați vărsături. Dați să bea apă sau lapte. Solicitați URGENT asistență medicală.',
    },
    storageRequirements: 'Depozitați în butelii sub presiune, la loc răcoros, ventilat, departe de surse de căldură și incompatibili.',
    incompatibilities: ['Halogeni', 'Oxizi de azot', 'Acizi', 'Metale grele'],
  },
  {
    id: 'benzene',
    name: 'Benzene',
    nameRo: 'Benzen',
    casNumber: '71-43-2',
    ghsPictograms: ['GHS02', 'GHS07', 'GHS08'],
    hazardStatements: ['H225', 'H304', 'H315', 'H319', 'H340', 'H350', 'H372'],
    precautionaryStatements: ['P201', 'P210', 'P280', 'P301+P310', 'P308+P313'],
    wel: {
      twa: 1,
      stel: 5,
      unit: 'ppm',
      notes: 'Substanță cancerigenă - limită minimă de expunere',
    },
    requiredEIP: ['Mănuși nitril', 'Ochelari de protecție', 'Mască cu filtru organic', 'Halat de laborator'],
    firstAid: {
      inhalation: 'Mutați victima la aer curat imediat. Supraveghere medicală obligatorie chiar dacă nu apar simptome. Risc cancerigen.',
      skinContact: 'Spălați imediat cu apă și săpun timp de 15 minute. Consultați medicul. Evitați absorbția prin piele - risc cancerigen.',
      eyeContact: 'Clătiți cu apă abundentă timp de 15 minute. Consultați un oftalmolog.',
      ingestion: 'NU provocați vărsături - risc de aspirație pulmonară. Solicitați URGENT asistență medicală. Risc de intoxicație severă.',
    },
    storageRequirements: 'Depozitați în spațiu dedicat, ventilat, cu monitorizare vapori, departe de oxidanți și surse de aprindere.',
    incompatibilities: ['Oxidanți puternici', 'Halogeni', 'Acid azotic'],
  },
  {
    id: 'chlorine',
    name: 'Chlorine',
    nameRo: 'Clor',
    casNumber: '7782-50-5',
    ghsPictograms: ['GHS04', 'GHS05', 'GHS06', 'GHS09'],
    hazardStatements: ['H270', 'H280', 'H315', 'H319', 'H331', 'H335', 'H400'],
    precautionaryStatements: ['P220', 'P244', 'P260', 'P280', 'P304+P340', 'P403+P233'],
    wel: {
      twa: 0.5,
      stel: 1,
      unit: 'ppm',
    },
    requiredEIP: ['Mască cu filtru B2', 'Mănuși cauciuc', 'Ochelari ermetici', 'Costum de protecție chimică'],
    firstAid: {
      inhalation: 'Mutați victima IMEDIAT la aer curat. Poziție semi-șezândă. Oxigen dacă este disponibil. Asistență medicală URGENTĂ - risc edem pulmonar.',
      skinContact: 'Spălați imediat cu apă abundentă 20-30 minute. Îndepărtați îmbrăcămintea contaminată. Consultați medicul - risc arsuri chimice.',
      eyeContact: 'Clătiți IMEDIAT cu apă abundentă 30 minute. Consultați URGENT oftalmolog - risc leziuni severe corneene.',
      ingestion: 'Puțin probabil (gaz). Dacă s-a întâmplat: clătiți gura, dați apă. NU provocați vărsături. Asistență medicală urgentă.',
    },
    storageRequirements: 'Butelii sub presiune, depozitare răcoroasă, ventilată, separată de combustibili și amoniac.',
    incompatibilities: ['Amoniac', 'Hidrocarburi', 'Hidrogen', 'Metale pulbere'],
  },
  {
    id: 'formaldehyde',
    name: 'Formaldehyde',
    nameRo: 'Formaldehidă',
    casNumber: '50-00-0',
    ghsPictograms: ['GHS02', 'GHS05', 'GHS06', 'GHS08'],
    hazardStatements: ['H226', 'H301', 'H311', 'H314', 'H317', 'H330', 'H334', 'H335', 'H341', 'H350'],
    precautionaryStatements: ['P201', 'P210', 'P260', 'P280', 'P284', 'P301+P310', 'P303+P361+P353', 'P304+P340'],
    wel: {
      twa: 0.3,
      stel: 0.6,
      unit: 'ppm',
      notes: 'Cancerigenă - expunere minimă obligatorie',
    },
    requiredEIP: ['Mască cu filtru ABEK', 'Mănuși nitril', 'Ochelari ermetici', 'Halat de protecție', 'Ventilație cu aspirație'],
    firstAid: {
      inhalation: 'Mutați la aer curat IMEDIAT. Risc edem pulmonar întârziat - supraveghere medicală 48h obligatorie. Asistență medicală urgentă.',
      skinContact: 'Spălați IMEDIAT cu apă abundentă minimum 20 minute. Risc arsuri severe. Consultați urgent medicul. Posibil sensibilizare alergică.',
      eyeContact: 'Clătiți IMEDIAT cu apă 30 minute ridicând pleoapele. Risc leziuni severe. Consultați URGENT oftalmolog.',
      ingestion: 'Clătiți gura cu apă. NU provocați vărsături. Dați apă sau lapte. URGENT la spital - risc intoxicație mortală.',
    },
    storageRequirements: 'Depozitare la loc răcoros (sub 25°C), ventilat, protejat de lumină, separat de baze și oxidanți.',
    incompatibilities: ['Baze puternice', 'Oxidanți', 'Acizi puternici', 'Fenoli'],
  },
  {
    id: 'hydrochloric-acid',
    name: 'Hydrochloric Acid',
    nameRo: 'Acid Clorhidric',
    casNumber: '7647-01-0',
    ghsPictograms: ['GHS05', 'GHS07'],
    hazardStatements: ['H290', 'H314', 'H335'],
    precautionaryStatements: ['P260', 'P280', 'P303+P361+P353', 'P304+P340', 'P305+P351+P338', 'P310'],
    wel: {
      twa: 5,
      stel: 10,
      unit: 'ppm',
      notes: 'Limită pentru vapori HCl',
    },
    requiredEIP: ['Mănuși cauciuc acid-rezistent', 'Ochelari ermetici', 'Șorț de protecție chimică', 'Mască cu filtru E'],
    firstAid: {
      inhalation: 'Mutați victima la aer curat. Poziție confortabilă pentru respirație. Dacă tuse severă sau dificultăți respiratorii - asistență medicală urgentă.',
      skinContact: 'Spălați IMEDIAT cu apă abundentă minimum 20 minute. Îndepărtați îmbrăcămintea contaminată. Risc arsuri chimice - consultați medicul.',
      eyeContact: 'Clătiți IMEDIAT cu apă abundentă minimum 30 minute ridicând pleoapele. Consultați URGENT oftalmolog - risc leziuni permanente.',
      ingestion: 'Clătiți gura cu apă. NU provocați vărsături - risc perforație. Dați să bea apă sau lapte. Asistență medicală URGENTĂ.',
    },
    storageRequirements: 'Depozitați în recipiente rezistente la coroziune, la loc ventilat, separat de baze, metale și oxidanți.',
    incompatibilities: ['Baze', 'Metale', 'Amoniac', 'Carbonați', 'Permanganați'],
  },
  {
    id: 'hydrogen-peroxide',
    name: 'Hydrogen Peroxide',
    nameRo: 'Apă Oxigenată (concentrată)',
    casNumber: '7722-84-1',
    ghsPictograms: ['GHS03', 'GHS05', 'GHS07'],
    hazardStatements: ['H271', 'H302', 'H314', 'H332'],
    precautionaryStatements: ['P220', 'P280', 'P283', 'P305+P351+P338', 'P310', 'P370+P378'],
    wel: {
      twa: 1,
      stel: 2,
      unit: 'ppm',
      notes: 'Pentru soluții > 30%',
    },
    requiredEIP: ['Mănuși PVC sau cauciuc', 'Ochelari ermetici', 'Șorț impermeabil', 'Ventilație'],
    firstAid: {
      inhalation: 'Mutați la aer curat. Dacă apar dificultăți respiratorii - asistență medicală. Risc iritație căi respiratorii.',
      skinContact: 'Spălați IMEDIAT cu apă abundentă 15-20 minute. Îndepărtați îmbrăcămintea contaminată. Risc arsuri chimice severe - consultați medicul.',
      eyeContact: 'Clătiți IMEDIAT cu apă abundentă minimum 30 minute. Consultați URGENT oftalmolog - risc leziuni severe, orbire.',
      ingestion: 'Clătiți gura. NU provocați vărsături - risc perforație gastrică. Dați apă. Asistență medicală URGENTĂ - risc embolie gazoasă.',
    },
    storageRequirements: 'Recipiente ventilate (risc presiune), loc răcoros, umbrit, departe de combustibili și metale.',
    incompatibilities: ['Metale', 'Combustibili organici', 'Agenți reducători', 'Baze'],
  },
  {
    id: 'methanol',
    name: 'Methanol',
    nameRo: 'Metanol (Alcool metilic)',
    casNumber: '67-56-1',
    ghsPictograms: ['GHS02', 'GHS06', 'GHS08'],
    hazardStatements: ['H225', 'H301', 'H311', 'H331', 'H370'],
    precautionaryStatements: ['P210', 'P233', 'P240', 'P260', 'P280', 'P301+P310', 'P302+P352', 'P304+P340'],
    wel: {
      twa: 200,
      stel: 250,
      unit: 'ppm',
    },
    requiredEIP: ['Mănuși nitril', 'Ochelari de protecție', 'Mască cu filtru A', 'Halat de laborator'],
    firstAid: {
      inhalation: 'Mutați la aer curat. Supraveghere medicală obligatorie - risc orbire/deces chiar după expunere aparent minoră. Asistență medicală urgentă.',
      skinContact: 'Spălați imediat cu apă și săpun 15 minute. Îndepărtați îmbrăcămintea contaminată. Consultați medicul - absorbție prin piele poate cauza intoxicație.',
      eyeContact: 'Clătiți cu apă abundentă 15 minute. Consultați oftalmolog - risc leziuni.',
      ingestion: 'NU provocați vărsături. Clătiți gura. Asistență medicală URGENTĂ - risc orbire permanentă și deces. Etanol ca antidot (doar sub supraveghere medicală).',
    },
    storageRequirements: 'Depozitare la loc răcoros, ventilat, departe de surse de aprindere și oxidanți.',
    incompatibilities: ['Oxidanți puternici', 'Acizi', 'Metale alcaline'],
  },
  {
    id: 'sodium-hydroxide',
    name: 'Sodium Hydroxide',
    nameRo: 'Hidroxid de Sodiu (Sodă caustică)',
    casNumber: '1310-73-2',
    ghsPictograms: ['GHS05'],
    hazardStatements: ['H290', 'H314'],
    precautionaryStatements: ['P260', 'P280', 'P303+P361+P353', 'P305+P351+P338', 'P310'],
    wel: {
      twa: 2,
      unit: 'mg/m³',
      notes: 'Limită pentru pulberi și aerosoli',
    },
    requiredEIP: ['Mănuși cauciuc', 'Ochelari ermetici obligatoriu', 'Șorț/halat acid-rezistent', 'Mască anti-praf'],
    firstAid: {
      inhalation: 'Mutați la aer curat. Dacă dificultăți respiratorii - asistență medicală. Risc edem pulmonar.',
      skinContact: 'Spălați IMEDIAT cu apă abundentă minimum 30 minute - NU întrerupeți spălarea! Îndepărtați îmbrăcămintea. Risc arsuri severe profunde - URGENT la medic.',
      eyeContact: 'Clătiți IMEDIAT cu apă abundentă minimum 30-60 minute ridicând pleoapele. Consultați URGENT oftalmolog - risc ORBIRE PERMANENTĂ.',
      ingestion: 'Clătiți gura cu apă. NU provocați vărsături - risc perforație esofag. Dați să bea apă sau lapte. URGENT la spital - risc leziuni interne severe.',
    },
    storageRequirements: 'Recipiente etanșe, depozitare uscată (reacționează violent cu apa), separat de acizi și metale.',
    incompatibilities: ['Acizi', 'Metale (Al, Zn, Sn)', 'Substanțe organice halogenate'],
  },
  {
    id: 'sulfuric-acid',
    name: 'Sulfuric Acid',
    nameRo: 'Acid Sulfuric',
    casNumber: '7664-93-9',
    ghsPictograms: ['GHS05'],
    hazardStatements: ['H290', 'H314'],
    precautionaryStatements: ['P260', 'P280', 'P303+P361+P353', 'P304+P340', 'P305+P351+P338', 'P310'],
    wel: {
      twa: 0.2,
      unit: 'mg/m³',
      notes: 'Thoracic fraction - pentru aerosoli',
    },
    requiredEIP: ['Mănuși cauciuc acid-rezistent', 'Ochelari ermetici obligatoriu', 'Șorț de protecție chimică', 'Mască filtru E'],
    firstAid: {
      inhalation: 'Mutați la aer curat imediat. Poziție semi-șezândă. Risc edem pulmonar - supraveghere medicală 48h. Asistență medicală urgentă.',
      skinContact: 'Spălați IMEDIAT cu apă abundentă minimum 30 minute continuu. Arsuri chimice severe posibile - URGENT la medic. NU aplicați neutralizanți.',
      eyeContact: 'Clătiți IMEDIAT cu apă abundentă 30-60 minute ridicând pleoapele. URGENT oftalmolog - risc orbire și cicatrici permanente.',
      ingestion: 'Clătiți gura cu apă. NU provocați vărsături - risc perforație. Dați apă sau lapte (dacă victima este conștientă). URGENT spital - risc deces.',
    },
    storageRequirements: 'Recipiente rezistente la coroziune, ventilate, loc răcoros (risc polimerizare la căldură), separat de baze și metale.',
    incompatibilities: ['Baze', 'Metale', 'Apa (adăugare violentă)', 'Carbonați', 'Permanganați'],
  },
  {
    id: 'toluene',
    name: 'Toluene',
    nameRo: 'Toluen',
    casNumber: '108-88-3',
    ghsPictograms: ['GHS02', 'GHS07', 'GHS08'],
    hazardStatements: ['H225', 'H304', 'H315', 'H336', 'H361d', 'H373'],
    precautionaryStatements: ['P210', 'P233', 'P240', 'P260', 'P280', 'P301+P310', 'P303+P361+P353'],
    wel: {
      twa: 50,
      stel: 100,
      unit: 'ppm',
      notes: 'Limită abateri cutanată - absorbție prin piele',
    },
    requiredEIP: ['Mănuși nitril', 'Ochelari de protecție', 'Mască cu filtru A', 'Ventilație adecvată'],
    firstAid: {
      inhalation: 'Mutați la aer curat. Simptome: amețeli, confuzie, somnolență. Supraveghere medicală dacă simptomele persistă - risc toxicitate neurologică.',
      skinContact: 'Spălați cu apă și săpun 15 minute. Îndepărtați îmbrăcămintea contaminată. Consultați medicul dacă iritația persistă. Risc absorbție cutanată.',
      eyeContact: 'Clătiți cu apă abundentă 15 minute ridicând pleoapele. Consultați oftalmolog dacă iritația persistă.',
      ingestion: 'NU provocați vărsături - risc aspirație pulmonară (pneumonie chimică). Clătiți gura. Asistență medicală URGENTĂ.',
    },
    storageRequirements: 'Loc răcoros, ventilat, departe de surse de aprindere și oxidanți. Container metalic pământat.',
    incompatibilities: ['Oxidanți puternici', 'Acid azotic', 'Acid sulfuric concentrat'],
  },
  {
    id: 'xylene',
    name: 'Xylene',
    nameRo: 'Xilen (amestec izomeri)',
    casNumber: '1330-20-7',
    ghsPictograms: ['GHS02', 'GHS07', 'GHS08'],
    hazardStatements: ['H226', 'H304', 'H312', 'H315', 'H332', 'H335', 'H373'],
    precautionaryStatements: ['P210', 'P233', 'P240', 'P260', 'P280', 'P301+P310', 'P302+P352'],
    wel: {
      twa: 50,
      stel: 100,
      unit: 'ppm',
      notes: 'Limită abateri cutanată',
    },
    requiredEIP: ['Mănuși nitril', 'Ochelari de protecție', 'Mască filtru A', 'Halat de protecție'],
    firstAid: {
      inhalation: 'Mutați la aer curat. Simptome: amețeli, greață, iritație. Dacă simptomele persistă - asistență medicală.',
      skinContact: 'Spălați cu apă și săpun 15 minute. Îndepărtați îmbrăcămintea contaminată. Risc absorbție cutanată - consultați medicul dacă iritația este severă.',
      eyeContact: 'Clătiți cu apă abundentă 15 minute. Consultați oftalmolog dacă iritația persistă.',
      ingestion: 'NU provocați vărsături - risc aspirație pulmonară. Clătiți gura. Asistență medicală urgentă - risc pneumonie chimică.',
    },
    storageRequirements: 'Depozitare la loc răcoros, ventilat, departe de surse de aprindere și oxidanți.',
    incompatibilities: ['Oxidanți puternici', 'Acid azotic', 'Acid sulfuric'],
  },
  {
    id: 'acetylene',
    name: 'Acetylene',
    nameRo: 'Acetilenă',
    casNumber: '74-86-2',
    ghsPictograms: ['GHS02', 'GHS04'],
    hazardStatements: ['H220', 'H280'],
    precautionaryStatements: ['P210', 'P377', 'P381', 'P403'],
    wel: {
      twa: 2500,
      unit: 'ppm',
      notes: 'Asfixiant simplu - risc deplasare oxigen',
    },
    requiredEIP: ['Mască în spații confinate', 'Echipament anti-static', 'Detector gaz combustibil'],
    firstAid: {
      inhalation: 'Mutați la aer curat IMEDIAT. Oxigen dacă disponibil. Dacă respirația s-a oprit - resuscitare cardio-respiratorie. Asistență medicală urgentă.',
      skinContact: 'Nu aplicabil (gaz). În caz de contact cu gaz lichefiat - tratament pentru degerături. NU frecați zona afectată.',
      eyeContact: 'Nu aplicabil în mod normal. În caz de contact cu gaz lichefiat - clătire cu apă călduță, consultați oftalmolog.',
      ingestion: 'Nu aplicabil (gaz).',
    },
    storageRequirements: 'Butelii speciale cu acetonă și material poros. Vertical, securizate, departe de oxidanți, cupru, argint, mercur.',
    incompatibilities: ['Cupru', 'Argint', 'Mercur', 'Halogeni', 'Oxidanți'],
  },
  {
    id: 'carbon-monoxide',
    name: 'Carbon Monoxide',
    nameRo: 'Monoxid de Carbon',
    casNumber: '630-08-0',
    ghsPictograms: ['GHS02', 'GHS04', 'GHS06'],
    hazardStatements: ['H220', 'H280', 'H331', 'H360'],
    precautionaryStatements: ['P210', 'P260', 'P271', 'P280', 'P304+P340', 'P403'],
    wel: {
      twa: 25,
      stel: 200,
      unit: 'ppm',
      notes: 'Gaz extrem toxic - detector obligatoriu',
    },
    requiredEIP: ['Detector CO personal obligatoriu', 'Aparat respirator autonom (SCBA) în concentrații mari', 'Ventilație forțată'],
    firstAid: {
      inhalation: 'Mutați IMEDIAT la aer curat. Poziție orizontală. Oxigen 100% cât mai repede (antidot specific). Asistență medicală URGENTĂ - risc deces sau sechele neurologice.',
      skinContact: 'Nu aplicabil (gaz).',
      eyeContact: 'Nu aplicabil (gaz).',
      ingestion: 'Nu aplicabil (gaz).',
    },
    storageRequirements: 'Butelii sub presiune, depozitare exterioară sau ventilată, detectoare CO obligatorii, departe de oxidanți.',
    incompatibilities: ['Oxigen', 'Oxidanți', 'Halogeni'],
  },
  {
    id: 'nitrogen-dioxide',
    name: 'Nitrogen Dioxide',
    nameRo: 'Dioxid de Azot',
    casNumber: '10102-44-0',
    ghsPictograms: ['GHS03', 'GHS04', 'GHS05', 'GHS06'],
    hazardStatements: ['H270', 'H280', 'H314', 'H330'],
    precautionaryStatements: ['P220', 'P260', 'P280', 'P284', 'P304+P340', 'P310', 'P403'],
    wel: {
      twa: 3,
      stel: 5,
      unit: 'ppm',
    },
    requiredEIP: ['Aparat respirator autonom', 'Mănuși de protecție chimică', 'Costum de protecție chimică completă'],
    firstAid: {
      inhalation: 'Mutați la aer curat IMEDIAT. Poziție semi-șezândă. Risc edem pulmonar ÎNTÂRZIAT (până la 48h) - supraveghere medicală obligatorie. URGENT la spital.',
      skinContact: 'Spălați cu apă abundentă 20-30 minute. Risc arsuri chimice severe. Consultați urgent medicul.',
      eyeContact: 'Clătiți IMEDIAT cu apă abundentă minimum 30 minute. Consultați URGENT oftalmolog - risc leziuni severe.',
      ingestion: 'Puțin probabil (gaz toxic). Dacă expunere - asistență medicală urgentă.',
    },
    storageRequirements: 'Butelii sub presiune, ventilație excelentă, departe de combustibili și agenți reducători.',
    incompatibilities: ['Combustibili', 'Amoniac', 'Hidrogen', 'Pulberi metalice'],
  },
  {
    id: 'lead',
    name: 'Lead and compounds',
    nameRo: 'Plumb și compuși',
    casNumber: '7439-92-1',
    ghsPictograms: ['GHS07', 'GHS08', 'GHS09'],
    hazardStatements: ['H302', 'H332', 'H360Df', 'H373', 'H410'],
    precautionaryStatements: ['P201', 'P260', 'P273', 'P280', 'P308+P313'],
    wel: {
      twa: 0.15,
      unit: 'mg/m³',
      notes: 'Limită plumb anorganic - supraveghere medicală obligatorie',
    },
    requiredEIP: ['Mască anti-praf P3', 'Mănuși de protecție', 'Îmbrăcăminte de lucru separată', 'Igienă strictă - spălat mâini obligatoriu'],
    firstAid: {
      inhalation: 'Mutați la aer curat. Consultați medicul - risc intoxicație cronică cu plumb (saturnism).',
      skinContact: 'Spălați cu apă și săpun. Îndepărtați îmbrăcămintea contaminată și spălați separat.',
      eyeContact: 'Clătiți cu apă abundentă 15 minute. Consultați medicul dacă iritația persistă.',
      ingestion: 'Clătiți gura. NU provocați vărsături. Consultați medicul - risc intoxicație cu plumb. Analize medicale obligatorii (plumbemie).',
    },
    storageRequirements: 'Recipiente etanșe, etichetate clar, spațiu dedicat, igiena mâinilor strictă după manipulare.',
    incompatibilities: ['Oxidanți puternici', 'Acizi', 'Peracizi'],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    nameRo: 'Mercur',
    casNumber: '7439-97-6',
    ghsPictograms: ['GHS06', 'GHS08', 'GHS09'],
    hazardStatements: ['H330', 'H360D', 'H372', 'H410'],
    precautionaryStatements: ['P201', 'P260', 'P273', 'P280', 'P284', 'P308+P313'],
    wel: {
      twa: 0.02,
      unit: 'mg/m³',
      notes: 'Mercur metalic vapori - limită foarte scăzută, toxic cumulativ',
    },
    requiredEIP: ['Aparat respirator cu filtru Hg', 'Mănuși nitril', 'Ochelari protecție', 'Halat de laborator', 'Detector vapori Hg'],
    firstAid: {
      inhalation: 'Mutați IMEDIAT la aer curat. Asistență medicală URGENTĂ - risc intoxicație severă neurologică (hidrargirism). Monitorizare mercur urinar obligatorie.',
      skinContact: 'Spălați imediat cu apă și săpun 15 minute. Consultați medicul - risc absorbție. Îndepărtați îmbrăcămintea contaminată.',
      eyeContact: 'Clătiți cu apă abundentă 15 minute. Consultați oftalmolog.',
      ingestion: 'Clătiți gura. NU provocați vărsături. Asistență medicală URGENTĂ - risc intoxicație severă. Analize mercur urinar obligatorii.',
    },
    storageRequirements: 'Recipiente etanșe, bine ventilate, tavă de retenție, kit urgență Hg disponibil, departe de surse căldură.',
    incompatibilities: ['Amoniac', 'Metale alcaline', 'Acetilen', 'Acid azotic'],
  },
  {
    id: 'asbestos',
    name: 'Asbestos',
    nameRo: 'Azbest (toate formele)',
    casNumber: '1332-21-4',
    ghsPictograms: ['GHS08'],
    hazardStatements: ['H350', 'H372'],
    precautionaryStatements: ['P201', 'P260', 'P280', 'P284', 'P308+P313'],
    wel: {
      twa: 0.1,
      unit: 'fibre/cm³',
      notes: 'INTERZIS în România - manipulare doar cu autorizație specială decontaminare',
    },
    requiredEIP: ['Aparat respirator P3 obligatoriu', 'Costum protecție de unică folosință', 'Mănuși', 'Duș decontaminare obligatoriu'],
    firstAid: {
      inhalation: 'Mutați la aer curat. Consultați IMEDIAT medicul - risc cancerigen (mezoteliom, cancer pulmonar). Supraveghere medicală pe viață obligatorie după expunere.',
      skinContact: 'Spălați cu apă abundentă. Duș decontaminare complet. Îmbrăcămintea contaminată - sac etanș pentru eliminare controlată.',
      eyeContact: 'Clătiți cu apă abundentă 15 minute. Consultați oftalmolog.',
      ingestion: 'Clătiți gura. Consultați medicul. Risc cancerigen gastro-intestinal.',
    },
    storageRequirements: 'INTERZIS manipularea fără autorizație. Depozitare etanșă, etichetare clară AZBEST - CANCERIGEN, zonă restricționată.',
    incompatibilities: ['Nu aplicabil - material solid fibros'],
  },
  {
    id: 'phenol',
    name: 'Phenol',
    nameRo: 'Fenol (Acid carbolic)',
    casNumber: '108-95-2',
    ghsPictograms: ['GHS05', 'GHS06', 'GHS08'],
    hazardStatements: ['H301', 'H311', 'H314', 'H331', 'H341', 'H373'],
    precautionaryStatements: ['P260', 'P280', 'P301+P310', 'P303+P361+P353', 'P304+P340', 'P305+P351+P338'],
    wel: {
      twa: 2,
      unit: 'ppm',
      notes: 'Limită abateri cutanată - absorbție rapidă prin piele',
    },
    requiredEIP: ['Mănuși cauciuc butyl sau nitril', 'Ochelari ermetici obligatoriu', 'Șorț de protecție chimică', 'Ventilație cu aspirație'],
    firstAid: {
      inhalation: 'Mutați la aer curat. Asistență medicală urgentă - risc intoxicație sistemică severă.',
      skinContact: 'Îndepărtați IMEDIAT îmbrăcămintea. Spălați cu POLIETILENGLICOL 400 sau GLICERINĂ (NU apă inițial - crește absorbția!). Apoi apă abundentă 30 min. URGENT la medic - risc arsuri profunde și intoxicație sistemică mortală.',
      eyeContact: 'Clătiți IMEDIAT cu apă abundentă minimum 30 minute. Consultați URGENT oftalmolog - risc leziuni severe corneene.',
      ingestion: 'Clătiți gura. NU provocați vărsături. Dați apă sau lapte. Asistență medicală URGENTĂ - risc intoxicație mortală, arsuri interne severe.',
    },
    storageRequirements: 'Recipiente etanșe, loc răcoros (solidifică sub 41°C), ventilat, departe de oxidanți și baze.',
    incompatibilities: ['Oxidanți puternici', 'Baze', 'Clorură de aluminiu', 'Formaldehidă'],
  },
  {
    id: 'propane',
    name: 'Propane',
    nameRo: 'Propan',
    casNumber: '74-98-6',
    ghsPictograms: ['GHS02', 'GHS04'],
    hazardStatements: ['H220', 'H280'],
    precautionaryStatements: ['P210', 'P377', 'P381', 'P403'],
    wel: {
      twa: 1000,
      unit: 'ppm',
      notes: 'Asfixiant simplu - limită mare, risc principal explozie',
    },
    requiredEIP: ['Echipament anti-static', 'Detector gaz combustibil obligatoriu', 'Ventilație adecvată', 'Fără surse de aprindere'],
    firstAid: {
      inhalation: 'Mutați la aer curat. În concentrații mari - risc asfixie prin deplasare oxigen. Oxigen dacă disponibil. Asistență medicală dacă simptome persistă.',
      skinContact: 'Contact cu gaz lichefiat - risc degerături severe. NU frecați. Încălziți treptat zona cu apă călduță (NU fierbinte). Consultați medicul pentru degerături severe.',
      eyeContact: 'Contact cu gaz lichefiat - clătire cu apă călduță, consultați oftalmolog.',
      ingestion: 'Nu aplicabil (gaz).',
    },
    storageRequirements: 'Butelii sub presiune, vertical, securizate, exterior sau loc foarte bine ventilat, departe de surse aprindere și oxidanți.',
    incompatibilities: ['Oxidanți puternici', 'Halogeni', 'Surse de aprindere'],
  },
  {
    id: 'chromium-vi',
    name: 'Chromium VI compounds',
    nameRo: 'Compuși de Crom VI (hexavalent)',
    casNumber: '18540-29-9',
    ghsPictograms: ['GHS03', 'GHS05', 'GHS06', 'GHS08', 'GHS09'],
    hazardStatements: ['H271', 'H301', 'H310', 'H314', 'H317', 'H330', 'H334', 'H340', 'H350', 'H360F', 'H372', 'H410'],
    precautionaryStatements: ['P201', 'P260', 'P273', 'P280', 'P284', 'P301+P310', 'P308+P313'],
    wel: {
      twa: 0.005,
      unit: 'mg/m³',
      notes: 'Cancerigen - limită extrem de scăzută, supraveghere medicală strictă',
    },
    requiredEIP: ['Aparat respirator P3', 'Mănuși de protecție chimică', 'Ochelari ermetici', 'Costum de protecție', 'Ventilație cu aspirație locală'],
    firstAid: {
      inhalation: 'Mutați IMEDIAT la aer curat. Asistență medicală URGENTĂ - risc cancerigen (cancer pulmonar), risc edem pulmonar, sensibilizare respiratorie.',
      skinContact: 'Spălați IMEDIAT cu apă abundentă minimum 30 minute. Risc arsuri severe, ulcere cutanate ("crom holes"), sensibilizare alergică. URGENT la medic.',
      eyeContact: 'Clătiți IMEDIAT cu apă abundentă minimum 30 minute. URGENT oftalmolog - risc leziuni severe, ulcerații corneene.',
      ingestion: 'Clătiți gura. NU provocați vărsături. Dați apă. Asistență medicală URGENTĂ - risc intoxicație acută mortală, efecte cancerigenă long-term.',
    },
    storageRequirements: 'Recipiente etanșe, etichetare CANCERIGEN obligatorie, zonă restricționată, separat de agenți reducători și acizi.',
    incompatibilities: ['Agenți reducători', 'Combustibili organici', 'Hidrazină', 'Alcool'],
  },
];

// GHS Pictogram descriptions for reference
export const GHS_PICTOGRAMS = {
  GHS01: 'Explozivi',
  GHS02: 'Inflamabile',
  GHS03: 'Oxidanți',
  GHS04: 'Gaze sub presiune',
  GHS05: 'Corozive',
  GHS06: 'Toxice acute',
  GHS07: 'Nocive/Iritante',
  GHS08: 'Pericol sănătate (cancerigen, mutagene, toxice organe)',
  GHS09: 'Pericol mediu',
} as const;

// Helper function to find chemical by CAS number
export function findChemicalByCAS(casNumber: string): ChemicalHazard | undefined {
  return CHEMICAL_HAZARDS.find(chem => chem.casNumber === casNumber);
}

// Helper function to find chemicals by name (partial match)
export function findChemicalsByName(searchTerm: string): ChemicalHazard[] {
  const search = searchTerm.toLowerCase();
  return CHEMICAL_HAZARDS.filter(
    chem =>
      chem.name.toLowerCase().includes(search) ||
      chem.nameRo.toLowerCase().includes(search)
  );
}

// Helper function to get chemicals with specific hazard statement
export function findChemicalsByHazardCode(hCode: string): ChemicalHazard[] {
  return CHEMICAL_HAZARDS.filter(chem =>
    chem.hazardStatements.includes(hCode)
  );
}

// Helper function to get all carcinogens (H350)
export function getCarcinogens(): ChemicalHazard[] {
  return findChemicalsByHazardCode('H350');
}

// Helper function to get chemicals requiring very low exposure limits
export function getHighRiskChemicals(): ChemicalHazard[] {
  return CHEMICAL_HAZARDS.filter(chem => {
    if (chem.wel.unit === 'ppm') {
      return (chem.wel.twa !== undefined && chem.wel.twa < 5);
    } else {
      return (chem.wel.twa !== undefined && chem.wel.twa < 1);
    }
  });
}
