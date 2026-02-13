/**
 * NIS2 Directive Requirements Database
 * EU Directive (EU) 2022/2555 on cybersecurity measures
 *
 * Comprehensive requirements for essential and important entities
 * across all applicable sectors in Romania and EU
 */

export type ComplianceLevel = 'easy' | 'medium' | 'hard';

export interface NIS2Requirement {
  id: string;
  article: string;
  requirement: string;
  description: string;
  applicableSectors: string[];
  deadline: string;
  penalty: string;
  implementationSteps: string[];
  complianceLevel: ComplianceLevel;
}

export const nis2Requirements: NIS2Requirement[] = [
  {
    id: 'nis2-001',
    article: 'Art. 21(1)(a)',
    requirement: 'Politici de analiza a riscurilor în securitatea cibernetică',
    description: 'Entitățile trebuie să implementeze politici cuprinzătoare de analiză și evaluare a riscurilor de securitate cibernetică, identificând amenințările și vulnerabilitățile sistemelor informaționale.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Ape uzate',
      'Infrastructuri digitale',
      'Administrație publică',
      'Spațiu'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri anuală globală (entități esențiale)',
    implementationSteps: [
      'Identificarea și inventarierea tuturor activelor IT și OT critice',
      'Evaluarea amenințărilor specifice sectorului de activitate',
      'Analiza vulnerabilităților tehnice și organizaționale',
      'Calcularea nivelului de risc pentru fiecare activ critic',
      'Dezvoltarea unei matrice risc-impact',
      'Documentarea metodologiei de analiză a riscurilor',
      'Stabilirea frecvenței de revizuire (minim anual)'
    ],
    complianceLevel: 'hard'
  },
  {
    id: 'nis2-002',
    article: 'Art. 21(1)(b)',
    requirement: 'Politici de securitate a sistemelor informaționale',
    description: 'Implementarea de politici și proceduri clare pentru securitatea sistemelor informaționale, inclusiv controlul accesului, criptarea datelor și segmentarea rețelelor.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Ape uzate',
      'Infrastructuri digitale',
      'Administrație publică',
      'Spațiu',
      'Poștă și curierat',
      'Managementul deșeurilor',
      'Industrie chimică',
      'Producție alimentară',
      'Industria prelucrătoare',
      'Furnizori digitali'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri anuală globală',
    implementationSteps: [
      'Elaborarea politicii de securitate informațională (ISO 27001 alignment)',
      'Implementarea controlului accesului bazat pe roluri (RBAC)',
      'Configurarea autentificării multi-factor (MFA) pentru accesul privilegiat',
      'Implementarea criptării datelor în tranzit și în repaus',
      'Segmentarea rețelei în zone de securitate (DMZ, LAN intern, OT)',
      'Implementarea firewall-urilor și IDS/IPS',
      'Documentarea și comunicarea politicilor către angajați'
    ],
    complianceLevel: 'hard'
  },
  {
    id: 'nis2-003',
    article: 'Art. 21(2)(a)',
    requirement: 'Planuri de continuitate a activității (BCP)',
    description: 'Entitățile trebuie să dezvolte și testeze planuri de continuitate a activității pentru a asigura funcționarea serviciilor esențiale în cazul unui incident de securitate cibernetică.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Infrastructuri digitale',
      'Administrație publică'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 7.000.000 EUR sau 1.4% din cifra de afaceri (entități importante)',
    implementationSteps: [
      'Identificarea funcțiilor și proceselor critice de business',
      'Analiza impactului asupra activității (BIA - Business Impact Analysis)',
      'Stabilirea obiectivelor de recuperare (RTO și RPO)',
      'Dezvoltarea procedurilor de continuitate pentru fiecare funcție critică',
      'Identificarea resurselor necesare (personal, echipamente, locații alternative)',
      'Testarea planului BCP prin simulări și exerciții (minim anual)',
      'Actualizarea planului bazat pe lecțiile învățate'
    ],
    complianceLevel: 'medium'
  },
  {
    id: 'nis2-004',
    article: 'Art. 21(2)(b)',
    requirement: 'Planuri de recuperare în caz de dezastru (DRP)',
    description: 'Implementarea și testarea regulată a planurilor de recuperare pentru restaurarea rapidă a sistemelor IT și a datelor după un incident major.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Infrastructuri digitale',
      'Furnizori digitali'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri anuală globală',
    implementationSteps: [
      'Identificarea sistemelor IT critice și a datelor esențiale',
      'Implementarea soluțiilor de backup automat (3-2-1 rule)',
      'Configurarea site-ului de recuperare (hot, warm sau cold site)',
      'Documentarea procedurilor pas-cu-pas de restaurare',
      'Testarea procesului de recuperare trimestrial',
      'Măsurarea timpilor de recuperare efectivi vs. obiective',
      'Menținerea inventarului de hardware/software de rezervă'
    ],
    complianceLevel: 'hard'
  },
  {
    id: 'nis2-005',
    article: 'Art. 21(2)(c)',
    requirement: 'Securitatea lanțului de aprovizionare',
    description: 'Evaluarea și gestionarea riscurilor de securitate cibernetică în relațiile cu furnizorii și partenerii, inclusiv auditul furnizorilor critici.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Infrastructuri digitale',
      'Industrie chimică',
      'Industria prelucrătoare',
      'Furnizori digitali'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri anuală globală',
    implementationSteps: [
      'Inventarierea tuturor furnizorilor cu acces la sisteme/date critice',
      'Clasificarea furnizorilor pe nivel de risc (critic, ridicat, mediu, scăzut)',
      'Dezvoltarea chestionarelor de evaluare a securității furnizorilor',
      'Includerea clauzelor de securitate cibernetică în contracte',
      'Auditarea furnizorilor critici (minim anual)',
      'Implementarea mecanismelor de monitorizare continuă',
      'Dezvoltarea planurilor de contingență pentru furnizorii critici'
    ],
    complianceLevel: 'medium'
  },
  {
    id: 'nis2-006',
    article: 'Art. 21(2)(d)',
    requirement: 'Proceduri de evaluare a eficacității măsurilor',
    description: 'Stabilirea și executarea regulată a procedurilor de testare și evaluare a eficacității măsurilor de gestionare a riscurilor de securitate cibernetică.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Infrastructuri digitale',
      'Administrație publică',
      'Furnizori digitali'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri anuală globală',
    implementationSteps: [
      'Definirea indicatorilor cheie de performanță (KPI) pentru securitate',
      'Implementarea testelor de penetrare (pentesting) anual',
      'Efectuarea de scanări de vulnerabilități lunare',
      'Realizarea de exerciții tabletop și simulări de criză',
      'Audit intern al controalelor de securitate (trimestrial)',
      'Evaluarea conformității cu standardele ISO 27001/IEC 62443',
      'Raportarea rezultatelor către management și board'
    ],
    complianceLevel: 'medium'
  },
  {
    id: 'nis2-007',
    article: 'Art. 21(2)(e)',
    requirement: 'Practici de igienă cibernetică și formare',
    description: 'Implementarea programelor de conștientizare și formare continuă a personalului în domeniul securității cibernetice și igienei digitale.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Ape uzate',
      'Infrastructuri digitale',
      'Administrație publică',
      'Spațiu',
      'Poștă și curierat',
      'Managementul deșeurilor',
      'Industrie chimică',
      'Producție alimentară',
      'Industria prelucrătoare',
      'Furnizori digitali'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 7.000.000 EUR sau 1.4% din cifra de afaceri',
    implementationSteps: [
      'Dezvoltarea programului anual de training în securitate cibernetică',
      'Training obligatoriu pentru toți angajații (minim anual)',
      'Training specializat pentru echipele IT și securitate (trimestrial)',
      'Simulări de phishing pentru testarea vigilenței angajaților',
      'Crearea ghidurilor de bune practici (parole, email, USB, BYOD)',
      'Campanii de conștientizare prin postere, newsletter, intranet',
      'Măsurarea eficacității training-urilor prin teste și metrici'
    ],
    complianceLevel: 'easy'
  },
  {
    id: 'nis2-008',
    article: 'Art. 21(2)(f)',
    requirement: 'Politici privind utilizarea criptografiei',
    description: 'Implementarea politicilor și tehnologiilor criptografice pentru protecția datelor sensibile, atât în tranzit cât și în repaus.',
    applicableSectors: [
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Infrastructuri digitale',
      'Administrație publică',
      'Furnizori digitali'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri anuală globală',
    implementationSteps: [
      'Dezvoltarea politicii de criptare a datelor',
      'Inventarierea datelor care necesită criptare (GDPR alignment)',
      'Implementarea TLS 1.3 pentru traficul web și API',
      'Criptarea bazelor de date cu informații sensibile (AES-256)',
      'Implementarea sistemului de management al cheilor (KMS)',
      'Criptarea dispozitivelor mobile și laptopurilor (BitLocker, FileVault)',
      'Documentarea algoritmilor și protocoalelor utilizate'
    ],
    complianceLevel: 'medium'
  },
  {
    id: 'nis2-009',
    article: 'Art. 21(2)(g)',
    requirement: 'Securitatea resurselor umane',
    description: 'Implementarea procedurilor de verificare a personalului cu acces la sisteme critice și gestionarea accesului de-a lungul ciclului de viață al angajatului.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Infrastructuri digitale',
      'Administrație publică'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 7.000.000 EUR sau 1.4% din cifra de afaceri',
    implementationSteps: [
      'Verificarea antecedentelor pentru poziții cu acces privilegiat',
      'Semnarea acordurilor de confidențialitate (NDA) de către toți angajații',
      'Definirea politicii de acces minim necesar (principle of least privilege)',
      'Proceduri formale de onboarding cu training de securitate',
      'Revizuirea periodică a drepturilor de acces (trimestrial)',
      'Proceduri de offboarding cu dezactivarea imediată a accesului',
      'Gestionarea accesului pentru contractori și terți'
    ],
    complianceLevel: 'easy'
  },
  {
    id: 'nis2-010',
    article: 'Art. 21(2)(h)',
    requirement: 'Controlul accesului și gestionarea activelor',
    description: 'Implementarea sistemelor robuste de control al accesului și menținerea unui inventar complet și actualizat al tuturor activelor IT și OT.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Infrastructuri digitale',
      'Administrație publică',
      'Spațiu'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri anuală globală',
    implementationSteps: [
      'Implementarea soluției de inventariere automată a activelor',
      'Clasificarea activelor pe nivel de criticitate (critic, important, normal)',
      'Implementarea autentificării multi-factor (MFA) pentru toate sistemele',
      'Configurarea controlului accesului bazat pe roluri (RBAC)',
      'Implementarea sistemului de logging pentru accesele privilegiate',
      'Revizuirea și actualizarea lunară a inventarului de active',
      'Implementarea procesului de decommissioning sigur'
    ],
    complianceLevel: 'medium'
  },
  {
    id: 'nis2-011',
    article: 'Art. 23(1)',
    requirement: 'Raportarea incidentelor semnificative - notificare inițială',
    description: 'Notificarea CSIRT sau autorității competente în termen de 24 ore de la luarea la cunoștință a unui incident semnificativ de securitate cibernetică.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Ape uzate',
      'Infrastructuri digitale',
      'Administrație publică',
      'Spațiu',
      'Poștă și curierat'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri (neraportare sau raportare tardivă)',
    implementationSteps: [
      'Definirea criteriilor de clasificare a incidentelor (semnificativ vs. minor)',
      'Implementarea sistemului de detectare și alertare 24/7',
      'Dezvoltarea procedurilor de escaladare internă',
      'Crearea template-urilor de raportare către autorități',
      'Stabilirea canalelor de comunicare cu CERT-RO',
      'Desemnarea persoanelor responsabile cu raportarea',
      'Simulări trimestriale de incident response'
    ],
    complianceLevel: 'hard'
  },
  {
    id: 'nis2-012',
    article: 'Art. 23(4)',
    requirement: 'Raportarea incidentelor - raport intermediar',
    description: 'Transmiterea unui raport intermediar actualizat în termen de 72 ore, cu informații despre incident, severitate, impact și măsuri de atenuare.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Infrastructuri digitale',
      'Administrație publică'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri',
    implementationSteps: [
      'Dezvoltarea template-ului de raport intermediar conform Anexei NIS2',
      'Proceduri de investigare rapidă a incidentelor (primele 72h)',
      'Documentarea impactului tehnic și de business',
      'Evaluarea indicatorilor de compromitere (IoC)',
      'Identificarea cauzei radăcină preliminare',
      'Documentarea măsurilor de contenție și remediere aplicate',
      'Coordonarea cu echipele tehnice și juridice pentru raportare'
    ],
    complianceLevel: 'hard'
  },
  {
    id: 'nis2-013',
    article: 'Art. 23(6)',
    requirement: 'Raportarea incidentelor - raport final',
    description: 'Transmiterea raportului final detaliat în termen de o lună, cu analiza completă a incidentului, cauzele radăcină și măsurile corective implementate.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Infrastructuri digitale',
      'Administrație publică'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri',
    implementationSteps: [
      'Finalizarea investigației forensice complete',
      'Documentarea cronologiei detaliate a incidentului',
      'Analiza cauzei radăcină (Root Cause Analysis - RCA)',
      'Evaluarea completă a impactului (financiar, operațional, reputațional)',
      'Documentarea lecțiilor învățate',
      'Planul de acțiuni corective și preventive (CAPA)',
      'Transmiterea raportului final către autorități'
    ],
    complianceLevel: 'medium'
  },
  {
    id: 'nis2-014',
    article: 'Art. 20(1)',
    requirement: 'Responsabilitatea organelor de conducere',
    description: 'Managementul de vârf trebuie să aprobe măsurile de securitate cibernetică, să supravegheze implementarea și să participe la training-uri de specialitate.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Ape uzate',
      'Infrastructuri digitale',
      'Administrație publică',
      'Spațiu',
      'Poștă și curierat',
      'Managementul deșeurilor',
      'Industrie chimică',
      'Producție alimentară',
      'Industria prelucrătoare',
      'Furnizori digitali'
    ],
    deadline: '2024-10-17',
    penalty: 'Sancțiuni personale pentru membrii conducerii (interzicerea exercitării funcțiilor)',
    implementationSteps: [
      'Desemnarea unui membru al conducerii ca responsabil pentru securitate cibernetică',
      'Includerea securității cibernetice în agenda board meetings (trimestrial)',
      'Aprobarea formală a politicilor și bugetului de securitate',
      'Participarea conducerii la training-uri de cyber awareness (anual)',
      'Raportări regulate către board despre starea securității',
      'Revizuirea și aprobarea planurilor de răspuns la incidente',
      'Monitorizarea KPI-urilor de securitate cibernetică'
    ],
    complianceLevel: 'easy'
  },
  {
    id: 'nis2-015',
    article: 'Art. 24',
    requirement: 'Înregistrarea entităților în registrul național',
    description: 'Entitățile esențiale și importante trebuie să se înregistreze în registrul național al entităților și să furnizeze informații actualizate despre activități și măsuri de securitate.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Ape uzate',
      'Infrastructuri digitale',
      'Administrație publică',
      'Spațiu',
      'Poștă și curierat',
      'Managementul deșeurilor',
      'Industrie chimică',
      'Producție alimentară',
      'Industria prelucrătoare',
      'Furnizori digitali'
    ],
    deadline: '2025-01-17',
    penalty: 'Până la 7.000.000 EUR sau 1.4% din cifra de afaceri (neînregistrare)',
    implementationSteps: [
      'Verificarea încadrării în categoria entitate esențială sau importantă',
      'Pregătirea documentației necesare înregistrării',
      'Completarea formularului de înregistrare pe platforma DNSC',
      'Furnizarea informațiilor despre servicii critice furnizate',
      'Listarea sistemelor informaționale critice',
      'Desemnarea punctului de contact pentru securitate cibernetică',
      'Actualizarea anuală a informațiilor în registru'
    ],
    complianceLevel: 'easy'
  },
  {
    id: 'nis2-016',
    article: 'Art. 21(3)',
    requirement: 'Utilizarea soluțiilor europene de criptografie',
    description: 'Preferința pentru utilizarea produselor și soluțiilor criptografice certificate conform standardelor europene (ex: eIDAS, Common Criteria).',
    applicableSectors: [
      'Administrație publică',
      'Infrastructuri digitale',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 7.000.000 EUR sau 1.4% din cifra de afaceri',
    implementationSteps: [
      'Inventarierea soluțiilor criptografice utilizate curent',
      'Verificarea certificărilor produselor (Common Criteria, FIPS 140-2/3)',
      'Prioritizarea furnizorilor europeni de soluții criptografice',
      'Evaluarea conformității cu Regulamentul eIDAS',
      'Implementarea semnăturii electronice calificate',
      'Documentarea justificărilor pentru soluții non-europene',
      'Plan de migrare către soluții certificate europene'
    ],
    complianceLevel: 'medium'
  },
  {
    id: 'nis2-017',
    article: 'Art. 22',
    requirement: 'Utilizarea responsabilă a vulnerabilităților',
    description: 'Implementarea unui proces de divulgare coordonată a vulnerabilităților (CVD - Coordinated Vulnerability Disclosure) și un punct de contact pentru raportarea responsabilă.',
    applicableSectors: [
      'Infrastructuri digitale',
      'Furnizori digitali',
      'Bancă',
      'Sănátate',
      'Energie'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 7.000.000 EUR sau 1.4% din cifra de afaceri',
    implementationSteps: [
      'Crearea politicii de Responsible Disclosure',
      'Publicarea adresei de contact security@ sau bug bounty program',
      'Dezvoltarea procesului de triaj al vulnerabilităților raportate',
      'Stabilirea SLA-urilor pentru răspuns și remediere',
      'Implementarea sistemului de tracking pentru vulnerabilități',
      'Coordonarea cu CERT-RO pentru vulnerabilități critice',
      'Publicarea acknowledgment-urilor pentru cercetători'
    ],
    complianceLevel: 'medium'
  },
  {
    id: 'nis2-018',
    article: 'Art. 32',
    requirement: 'Supravegherea și audituri de securitate',
    description: 'Cooperarea cu autoritățile naționale în cadrul activităților de supraveghere, inspecție și auditare a măsurilor de securitate cibernetică implementate.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Infrastructuri digitale',
      'Administrație publică'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 10.000.000 EUR sau 2% din cifra de afaceri (obstrucționare)',
    implementationSteps: [
      'Pregătirea documentației pentru auditurile de conformitate',
      'Desemnarea persoanei de legătură cu autoritățile',
      'Menținerea evidenței măsurilor de securitate implementate',
      'Pregătirea accesului controlat la sisteme pentru inspecții',
      'Documentarea procedurilor și politicilor de securitate',
      'Raportări periodice către DNSC conform cerințelor',
      'Implementarea recomandărilor post-audit'
    ],
    complianceLevel: 'medium'
  },
  {
    id: 'nis2-019',
    article: 'Art. 21(2)(i)',
    requirement: 'Securitatea comunicațiilor vocale și video',
    description: 'Protejarea sistemelor de comunicații unificate (VoIP, videoconferințe) împotriva interceptării și compromiterii, inclusiv criptarea end-to-end.',
    applicableSectors: [
      'Administrație publică',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Infrastructuri digitale',
      'Furnizori digitali'
    ],
    deadline: '2024-10-17',
    penalty: 'Până la 7.000.000 EUR sau 1.4% din cifra de afaceri',
    implementationSteps: [
      'Auditarea sistemelor de comunicații utilizate (Teams, Zoom, VoIP)',
      'Implementarea criptării end-to-end pentru comunicații sensibile',
      'Configurarea autentificării pentru participanți la videoconferințe',
      'Dezactivarea funcționalităților nesigure (ex: dial-in neautentificat)',
      'Segregarea traficului VoIP pe VLAN dedicat',
      'Implementarea soluțiilor anti-eavesdropping pentru săli de conferințe',
      'Training pentru utilizare securizată a platformelor de comunicații'
    ],
    complianceLevel: 'easy'
  },
  {
    id: 'nis2-020',
    article: 'Art. 7',
    requirement: 'Partajarea informațiilor despre amenințări',
    description: 'Participarea activă la schimbul de informații despre amenințări, vulnerabilități și incidente de securitate cibernetică prin comunitățile sectoriale și CSIRT.',
    applicableSectors: [
      'Energie',
      'Transport',
      'Bancă',
      'Infrastructuri financiare',
      'Sănătate',
      'Apă potabilă',
      'Infrastructuri digitale',
      'Administrație publică',
      'Spațiu',
      'Furnizori digitali'
    ],
    deadline: '2024-10-17',
    penalty: 'Fără penalități directe, dar afectează evaluarea conformității',
    implementationSteps: [
      'Înscrierea în comunitățile de partajare a informațiilor sectoriale (ISAC)',
      'Configurarea feed-urilor de threat intelligence (STIX/TAXII)',
      'Implementarea platformei de Threat Intelligence (MISP, ThreatConnect)',
      'Participarea la grupurile de lucru sectoriale DNSC',
      'Partajarea anonimizată a IoC-urilor cu comunitatea',
      'Consumul și integrarea threat feeds în sistemele de securitate',
      'Raportarea vulnerabilităților 0-day către CERT-RO'
    ],
    complianceLevel: 'medium'
  }
];

/**
 * Helper function to get requirements by sector
 */
export function getRequirementsBySector(sector: string): NIS2Requirement[] {
  return nis2Requirements.filter(req =>
    req.applicableSectors.includes(sector)
  );
}

/**
 * Helper function to get requirements by compliance level
 */
export function getRequirementsByCompliance(level: ComplianceLevel): NIS2Requirement[] {
  return nis2Requirements.filter(req => req.complianceLevel === level);
}

/**
 * Helper function to get requirements by deadline
 */
export function getRequirementsBeforeDeadline(date: string): NIS2Requirement[] {
  return nis2Requirements.filter(req => req.deadline <= date);
}

/**
 * All applicable sectors under NIS2
 */
export const nis2Sectors = [
  'Energie',
  'Transport',
  'Bancă',
  'Infrastructuri financiare',
  'Sănătate',
  'Apă potabilă',
  'Ape uzate',
  'Infrastructuri digitale',
  'Administrație publică',
  'Spațiu',
  'Poștă și curierat',
  'Managementul deșeurilor',
  'Industrie chimică',
  'Producție alimentară',
  'Industria prelucrătoare',
  'Furnizori digitali'
] as const;
