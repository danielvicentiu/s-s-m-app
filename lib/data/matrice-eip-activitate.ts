/**
 * Matrice de legătură între activități și echipamentul individual de protecție (EIP) obligatoriu
 * Conform legislației SSM românești
 */

export interface RequiredEIP {
  eipId: string;
  eipName: string;
  mandatory: boolean; // true = obligatoriu, false = recomandat
}

export interface AdditionalMeasure {
  id: string;
  description: string;
}

export interface ActivityEIPMatrix {
  activityId: string;
  activityName: string;
  requiredEIP: RequiredEIP[];
  additionalMeasures: AdditionalMeasure[];
}

export const MATRICE_EIP_ACTIVITATE: ActivityEIPMatrix[] = [
  {
    activityId: 'sudura',
    activityName: 'Sudură electrică sau autogenă',
    requiredEIP: [
      { eipId: 'masca_sudura', eipName: 'Mască de sudură cu filtru automat', mandatory: true },
      { eipId: 'manusi_sudura', eipName: 'Mănuși de sudură termorezistente', mandatory: true },
      { eipId: 'sort_piele', eipName: 'Șort din piele', mandatory: true },
      { eipId: 'bocanci_s3', eipName: 'Bocanci de protecție S3', mandatory: true },
      { eipId: 'ochelari_protectie', eipName: 'Ochelari de protecție', mandatory: false },
      { eipId: 'masca_praf', eipName: 'Mască antipraf FFP2', mandatory: false },
    ],
    additionalMeasures: [
      { id: 'ventilatie', description: 'Asigurarea ventilației adecvate' },
      { id: 'izolare_zona', description: 'Izolarea zonei de lucru cu paravane' },
      { id: 'extinctor', description: 'Extinctor la îndemână' },
    ],
  },
  {
    activityId: 'lucru_inaltime',
    activityName: 'Lucru la înălțime (peste 2m)',
    requiredEIP: [
      { eipId: 'ham_protectie', eipName: 'Ham de protecție cu 2 puncte de ancorare', mandatory: true },
      { eipId: 'lant_siguranta', eipName: 'Lanț de siguranță cu absorbant', mandatory: true },
      { eipId: 'casca_protectie', eipName: 'Cască de protecție', mandatory: true },
      { eipId: 'bocanci_s3', eipName: 'Bocanci antiderapanți S3', mandatory: true },
      { eipId: 'manusi_antiderapante', eipName: 'Mănuși antiderapante', mandatory: true },
    ],
    additionalMeasures: [
      { id: 'verificare_ham', description: 'Verificarea zilnică a hamului și accesoriilor' },
      { id: 'delimitare_zona', description: 'Delimitarea zonei de dedesubt' },
      { id: 'instruire_salvare', description: 'Plan de salvare la înălțime' },
    ],
  },
  {
    activityId: 'manipulare_chimicale',
    activityName: 'Manipulare substanțe chimice periculoase',
    requiredEIP: [
      { eipId: 'manusi_chimice', eipName: 'Mănuși rezistente la chimicale', mandatory: true },
      { eipId: 'ochelari_etans', eipName: 'Ochelari de protecție etanși', mandatory: true },
      { eipId: 'masca_gaze', eipName: 'Mască cu filtre pentru gaze/vapori', mandatory: true },
      { eipId: 'combinezon_protectie', eipName: 'Combinezon de protecție chimică', mandatory: true },
      { eipId: 'cizme_cauciuc', eipName: 'Cizme din cauciuc', mandatory: true },
    ],
    additionalMeasures: [
      { id: 'fisa_siguranta', description: 'Consultarea fișei de siguranță' },
      { id: 'dus_urgenta', description: 'Duș de urgență și spălător ochi disponibil' },
      { id: 'ventilatie_locala', description: 'Ventilație locală de aspirație' },
    ],
  },
  {
    activityId: 'taiere_lemn',
    activityName: 'Tăiere lemn cu ferăstrău',
    requiredEIP: [
      { eipId: 'casca_viziera', eipName: 'Cască forestieră cu vizieră și protecție auditivă', mandatory: true },
      { eipId: 'pantaloni_protectie', eipName: 'Pantaloni cu protecție antiferă', mandatory: true },
      { eipId: 'manusi_antivibrante', eipName: 'Mănuși antivibrante', mandatory: true },
      { eipId: 'bocanci_s3', eipName: 'Bocanci forestieri S3', mandatory: true },
      { eipId: 'vesta_reflectorizanta', eipName: 'Vestă reflectorizantă', mandatory: false },
    ],
    additionalMeasures: [
      { id: 'verificare_ferastrau', description: 'Verificarea stării ferăstrăului' },
      { id: 'delimitare_perimetru', description: 'Delimitarea perimetrului de lucru' },
      { id: 'trusa_prim_ajutor', description: 'Trusă prim ajutor la îndemână' },
    ],
  },
  {
    activityId: 'constructii',
    activityName: 'Lucrări de construcții',
    requiredEIP: [
      { eipId: 'casca_protectie', eipName: 'Cască de protecție', mandatory: true },
      { eipId: 'vesta_reflectorizanta', eipName: 'Vestă reflectorizantă', mandatory: true },
      { eipId: 'bocanci_s3', eipName: 'Bocanci de protecție S3', mandatory: true },
      { eipId: 'manusi_constructii', eipName: 'Mănuși de protecție mecanică', mandatory: true },
      { eipId: 'ochelari_protectie', eipName: 'Ochelari de protecție', mandatory: false },
      { eipId: 'centura_lombara', eipName: 'Centură lombară', mandatory: false },
    ],
    additionalMeasures: [
      { id: 'semnalizare_santier', description: 'Semnalizare corespunzătoare șantier' },
      { id: 'verificare_scule', description: 'Verificarea zilnică a sculelor și utilajelor' },
      { id: 'instruire_ssr', description: 'Instruire SSM specifică șantier' },
    ],
  },
  {
    activityId: 'electricitate',
    activityName: 'Lucrări la instalații electrice',
    requiredEIP: [
      { eipId: 'manusi_dielectrice', eipName: 'Mănuși dielectrice certificate', mandatory: true },
      { eipId: 'bocanci_dielectrici', eipName: 'Bocanci dielectrici', mandatory: true },
      { eipId: 'casca_protectie', eipName: 'Cască de protecție', mandatory: true },
      { eipId: 'ochelari_protectie', eipName: 'Ochelari de protecție', mandatory: true },
      { eipId: 'combinezon_ignifug', eipName: 'Combinezon ignifug', mandatory: false },
    ],
    additionalMeasures: [
      { id: 'consemnare', description: 'Consemnarea instalației electrice' },
      { id: 'verificare_tensiune', description: 'Verificarea absenței tensiunii' },
      { id: 'scule_izolate', description: 'Utilizare scule izolate certificate' },
    ],
  },
  {
    activityId: 'vopsitorie',
    activityName: 'Vopsitorie și aplicare lacuri',
    requiredEIP: [
      { eipId: 'masca_vapori', eipName: 'Mască cu filtru pentru vapori organici', mandatory: true },
      { eipId: 'ochelari_protectie', eipName: 'Ochelari de protecție', mandatory: true },
      { eipId: 'manusi_chimice', eipName: 'Mănuși rezistente la solvenți', mandatory: true },
      { eipId: 'combinezon_protectie', eipName: 'Combinezon de protecție', mandatory: true },
      { eipId: 'bocanci_s2', eipName: 'Bocanci de protecție S2', mandatory: true },
    ],
    additionalMeasures: [
      { id: 'ventilatie_fortata', description: 'Ventilație forțată obligatorie' },
      { id: 'interzicere_foc', description: 'Interzicerea focului deschis' },
      { id: 'depozitare_chimicale', description: 'Depozitare corespunzătoare a materialelor' },
    ],
  },
  {
    activityId: 'macarale',
    activityName: 'Operare macarale și utilaje de ridicat',
    requiredEIP: [
      { eipId: 'casca_protectie', eipName: 'Cască de protecție', mandatory: true },
      { eipId: 'vesta_reflectorizanta', eipName: 'Vestă reflectorizantă', mandatory: true },
      { eipId: 'bocanci_s3', eipName: 'Bocanci de protecție S3', mandatory: true },
      { eipId: 'manusi_protectie', eipName: 'Mănuși de protecție', mandatory: true },
      { eipId: 'protectie_auditiva', eipName: 'Protecție auditivă', mandatory: false },
    ],
    additionalMeasures: [
      { id: 'autorizare_utilaj', description: 'Autorizare pentru operare utilaj' },
      { id: 'verificare_macaraua', description: 'Verificare tehnică periodică' },
      { id: 'delimitare_zona_lucru', description: 'Delimitare zonă de lucru' },
    ],
  },
  {
    activityId: 'demolare',
    activityName: 'Lucrări de demolare',
    requiredEIP: [
      { eipId: 'casca_protectie', eipName: 'Cască de protecție renforsată', mandatory: true },
      { eipId: 'masca_praf', eipName: 'Mască antipraf FFP3', mandatory: true },
      { eipId: 'ochelari_protectie', eipName: 'Ochelari de protecție', mandatory: true },
      { eipId: 'manusi_rezistente', eipName: 'Mănuși rezistente la impact', mandatory: true },
      { eipId: 'bocanci_s3', eipName: 'Bocanci S3 cu protecție metatarsală', mandatory: true },
      { eipId: 'protectie_auditiva', eipName: 'Protecție auditivă', mandatory: true },
    ],
    additionalMeasures: [
      { id: 'analiza_risc', description: 'Analiză de risc prealabilă' },
      { id: 'verificare_structura', description: 'Verificare stabilitate structură' },
      { id: 'udare_praf', description: 'Udare pentru reducerea prafului' },
    ],
  },
  {
    activityId: 'spatii_confinate',
    activityName: 'Lucru în spații confinate',
    requiredEIP: [
      { eipId: 'aparat_respirator', eipName: 'Aparat respirator autonom', mandatory: true },
      { eipId: 'ham_salvare', eipName: 'Ham de salvare cu ansă dorsală', mandatory: true },
      { eipId: 'detector_gaze', eipName: 'Detector portabil gaze', mandatory: true },
      { eipId: 'lanterna_antiex', eipName: 'Lanternă antiex', mandatory: true },
      { eipId: 'combinezon_protectie', eipName: 'Combinezon de protecție', mandatory: true },
    ],
    additionalMeasures: [
      { id: 'permis_lucru', description: 'Permis de lucru în spațiu confinat' },
      { id: 'supraveghetor', description: 'Supraveghetor exterior permanent' },
      { id: 'ventilatie_prealabila', description: 'Ventilare prealabilă obligatorie' },
    ],
  },
  {
    activityId: 'prelucrare_metal',
    activityName: 'Prelucrare metale (strung, frezat)',
    requiredEIP: [
      { eipId: 'ochelari_protectie', eipName: 'Ochelari de protecție împotriva așchiilor', mandatory: true },
      { eipId: 'manusi_mecanice', eipName: 'Mănuși de protecție mecanică', mandatory: true },
      { eipId: 'bocanci_s1', eipName: 'Bocanci de protecție S1', mandatory: true },
      { eipId: 'sort_protectie', eipName: 'Șort de protecție', mandatory: true },
      { eipId: 'protectie_auditiva', eipName: 'Protecție auditivă', mandatory: false },
    ],
    additionalMeasures: [
      { id: 'aparat_solidificare', description: 'Aparate cu dispozitive de protecție funcționale' },
      { id: 'iluminare', description: 'Iluminare corespunzătoare' },
      { id: 'intretinere_masini', description: 'Întreținere periodică mașini-unelte' },
    ],
  },
  {
    activityId: 'agricultura',
    activityName: 'Lucrări agricole (pesticide, fertilizatori)',
    requiredEIP: [
      { eipId: 'combinezon_chimice', eipName: 'Combinezon protecție substanțe chimice', mandatory: true },
      { eipId: 'masca_pesticide', eipName: 'Mască cu filtru pentru pesticide', mandatory: true },
      { eipId: 'manusi_chimice', eipName: 'Mănuși rezistente la chimicale', mandatory: true },
      { eipId: 'cizme_cauciuc', eipName: 'Cizme din cauciuc', mandatory: true },
      { eipId: 'ochelari_etans', eipName: 'Ochelari de protecție etanși', mandatory: true },
    ],
    additionalMeasures: [
      { id: 'etichetare', description: 'Verificare etichetare produse' },
      { id: 'interval_reintrare', description: 'Respectare interval de reintrare' },
      { id: 'depozitare_sigura', description: 'Depozitare în spații autorizate' },
    ],
  },
  {
    activityId: 'frigorific',
    activityName: 'Lucrări în depozite frigorifice',
    requiredEIP: [
      { eipId: 'imbracaminte_termica', eipName: 'Îmbrăcăminte termică (-20°C)', mandatory: true },
      { eipId: 'bocanci_termici', eipName: 'Bocanci termoizolați', mandatory: true },
      { eipId: 'manusi_termice', eipName: 'Mănuși termice', mandatory: true },
      { eipId: 'caciula_termica', eipName: 'Căciulă termică', mandatory: true },
      { eipId: 'ochelari_anti_aburire', eipName: 'Ochelari anti-aburire', mandatory: false },
    ],
    additionalMeasures: [
      { id: 'limitare_timp', description: 'Limitare timp expunere la frig' },
      { id: 'sistem_alarma', description: 'Sistem de alarmă de urgență' },
      { id: 'monitorizare_sanatate', description: 'Monitorizare stare de sănătate' },
    ],
  },
  {
    activityId: 'azbest',
    activityName: 'Decontaminare azbest',
    requiredEIP: [
      { eipId: 'combinezon_azbest', eipName: 'Combinezon tip 5/6 pentru azbest', mandatory: true },
      { eipId: 'masca_ffp3', eipName: 'Mască FFP3 sau aparat filtrare', mandatory: true },
      { eipId: 'manusi_azbest', eipName: 'Mănuși de unică folosință', mandatory: true },
      { eipId: 'cizme_protectie', eipName: 'Cizme de protecție', mandatory: true },
      { eipId: 'ochelari_etans', eipName: 'Ochelari etanși', mandatory: true },
    ],
    additionalMeasures: [
      { id: 'autorizare_speciala', description: 'Autorizare specială pentru lucrări azbest' },
      { id: 'zona_decontaminare', description: 'Zonă de decontaminare obligatorie' },
      { id: 'saci_speciali', description: 'Ambalare în saci speciali marcați' },
    ],
  },
  {
    activityId: 'sanitar_medical',
    activityName: 'Activități sanitare/medicale',
    requiredEIP: [
      { eipId: 'manusi_latex', eipName: 'Mănuși de unică folosință (latex/nitril)', mandatory: true },
      { eipId: 'masca_medicala', eipName: 'Mască medicală/FFP2', mandatory: true },
      { eipId: 'halat_protectie', eipName: 'Halat de protecție', mandatory: true },
      { eipId: 'ochelari_protectie', eipName: 'Ochelari de protecție', mandatory: false },
      { eipId: 'viziera', eipName: 'Vizieră de protecție', mandatory: false },
    ],
    additionalMeasures: [
      { id: 'igienizare_maini', description: 'Protocol igienizare mâini' },
      { id: 'container_intepatoare', description: 'Container pentru obiecte ascuțite/înțepătoare' },
      { id: 'vaccinare', description: 'Vaccinare conform legislației' },
    ],
  },
];

/**
 * Găsește matricea EIP pentru o activitate specifică
 */
export function getEIPForActivity(activityId: string): ActivityEIPMatrix | undefined {
  return MATRICE_EIP_ACTIVITATE.find(item => item.activityId === activityId);
}

/**
 * Obține lista de EIP-uri obligatorii pentru o activitate
 */
export function getMandatoryEIP(activityId: string): RequiredEIP[] {
  const activity = getEIPForActivity(activityId);
  return activity?.requiredEIP.filter(eip => eip.mandatory) || [];
}

/**
 * Obține lista de EIP-uri recomandate pentru o activitate
 */
export function getRecommendedEIP(activityId: string): RequiredEIP[] {
  const activity = getEIPForActivity(activityId);
  return activity?.requiredEIP.filter(eip => !eip.mandatory) || [];
}

/**
 * Verifică dacă toate EIP-urile obligatorii sunt asigurate
 */
export function validateEIPCompliance(
  activityId: string,
  providedEIP: string[]
): { compliant: boolean; missing: RequiredEIP[] } {
  const mandatoryEIP = getMandatoryEIP(activityId);
  const missing = mandatoryEIP.filter(eip => !providedEIP.includes(eip.eipId));

  return {
    compliant: missing.length === 0,
    missing,
  };
}
