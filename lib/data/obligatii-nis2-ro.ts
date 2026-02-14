/**
 * Obligații NIS2 pentru România
 * Directiva UE 2022/2555 privind securitatea rețelelor și a sistemelor informatice
 * Transpunere în legislația RO (conform ANCOM/DNSC)
 */

export interface ObligatieNIS2 {
  id: string;
  title: string;
  description: string;
  legalBasis: string;
  category: 'governance' | 'risk' | 'incident' | 'supply-chain' | 'training' | 'audit';
  deadline: string;
  penalty: string;
  entityType: 'essential' | 'important' | 'both';
}

export const obligatiiNIS2: ObligatieNIS2[] = [
  {
    id: 'nis2-gov-001',
    title: 'Politica de Securitate Cibernetică',
    description: 'Adoptarea unei politici comprehensive de securitate cibernetică aprobată de conducerea entității, care să cuprindă obiective, responsabilități și măsuri de protecție a rețelelor și sistemelor informatice.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(1); Legea transpunere RO (în curs de adoptare)',
    category: 'governance',
    deadline: 'Implementare până la 17 octombrie 2024',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-gov-002',
    title: 'Responsabilitate Management Superior',
    description: 'Membrii organului de conducere trebuie să aprobe măsurile de gestionare a riscurilor de securitate, să supravegheze implementarea și să participe la programe de formare în domeniul securității cibernetice.',
    legalBasis: 'Directiva UE 2022/2555, Art. 20; Legea transpunere RO',
    category: 'governance',
    deadline: 'Implementare până la 17 octombrie 2024',
    penalty: 'Sancțiuni personale pentru manageri: avertisment sau amendă, posibilă interdicție temporară de a exercita funcții de conducere',
    entityType: 'both'
  },
  {
    id: 'nis2-risk-001',
    title: 'Analiza de Risc și Evaluare',
    description: 'Efectuarea periodică a analizelor de risc pentru identificarea amenințărilor la adresa securității rețelelor și sistemelor informatice, cu evaluarea impactului potențial și probabilității de materializare.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(a); Legea transpunere RO',
    category: 'risk',
    deadline: 'Evaluare inițială până la 17 octombrie 2024; re-evaluare cel puțin anual',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-risk-002',
    title: 'Măsuri de Gestionare a Incidentelor',
    description: 'Implementarea unor proceduri adecvate și eficace pentru a face față incidentelor de securitate, inclusiv planuri de continuitate a activității și de recuperare în caz de dezastru.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(b); Legea transpunere RO',
    category: 'risk',
    deadline: 'Implementare până la 17 octombrie 2024',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-inc-001',
    title: 'Raportare Incidente - Alertă Inițială (24h)',
    description: 'Notificarea CERT-RO/DNSC despre incidentele semnificative în termen de 24 ore de la conștientizare, cu indicarea impactului inițial, a tipului de amenințare și a măsurilor de răspuns.',
    legalBasis: 'Directiva UE 2022/2555, Art. 23(1); Legea transpunere RO',
    category: 'incident',
    deadline: 'Maximum 24 ore de la conștientizarea incidentului',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-inc-002',
    title: 'Raportare Incidente - Notificare Detaliată (72h)',
    description: 'Transmiterea unei notificări detaliate în termen de 72 ore, incluzând evaluarea gravității și impactului incidentului, indicatori de compromitere și măsuri de atenuare implementate.',
    legalBasis: 'Directiva UE 2022/2555, Art. 23(4); Legea transpunere RO',
    category: 'incident',
    deadline: 'Maximum 72 ore de la conștientizarea incidentului',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-inc-003',
    title: 'Raportare Incidente - Raport Final (1 lună)',
    description: 'Depunerea unui raport final în termen de o lună de la notificarea incidentului, conținând descrierea detaliată, cauza principală identificată, impactul și măsurile corective implementate.',
    legalBasis: 'Directiva UE 2022/2555, Art. 23(6); Legea transpunere RO',
    category: 'incident',
    deadline: 'Maximum 1 lună de la depunerea notificării inițiale',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-inc-004',
    title: 'Notificare către Destinatari Afectați',
    description: 'Informarea fără întârziere nejustificată a destinatarilor serviciilor afectați de incident, când acesta poate afecta negativ furnizarea serviciului sau protecția datelor personale.',
    legalBasis: 'Directiva UE 2022/2555, Art. 23(8); Legea transpunere RO',
    category: 'incident',
    deadline: 'Fără întârziere nejustificată după identificarea impactului',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-supply-001',
    title: 'Securitatea Lanțului de Aprovizionare',
    description: 'Evaluarea și gestionarea riscurilor de securitate cibernetică în relațiile cu furnizorii și prestatorii de servicii, inclusiv verificarea măsurilor de securitate implementate de aceștia.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(e); Legea transpunere RO',
    category: 'supply-chain',
    deadline: 'Implementare până la 17 octombrie 2024',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-supply-002',
    title: 'Contracte cu Furnizori Externi',
    description: 'Includerea în contractele cu furnizorii de servicii și produse ICT a unor clauze privind obligațiile de securitate, notificarea incidentelor și dreptul de audit.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(e); Legea transpunere RO',
    category: 'supply-chain',
    deadline: 'Pentru contractele noi: imediat; pentru contractele existente: la reînnoire sau până la 17 octombrie 2025',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-train-001',
    title: 'Programe de Formare în Securitate Cibernetică',
    description: 'Organizarea de programe periodice de formare și conștientizare pentru angajați privind riscurile de securitate cibernetică, bunele practici și procedurile de raportare a incidentelor.',
    legalBasis: 'Directiva UE 2022/2555, Art. 20(2); Legea transpunere RO',
    category: 'training',
    deadline: 'Implementare inițială până la 17 octombrie 2024; training recurent anual',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-train-002',
    title: 'Formare Management și Consiliu Administrație',
    description: 'Participarea obligatorie a membrilor organului de conducere la programe de formare specifice în domeniul securității cibernetice, pentru a înțelege riscurile și a lua decizii informate.',
    legalBasis: 'Directiva UE 2022/2555, Art. 20(2); Legea transpunere RO',
    category: 'training',
    deadline: 'Prima formare până la 17 octombrie 2024; actualizare cel puțin o dată la 2 ani',
    penalty: 'Sancțiuni personale pentru manageri: avertisment sau amendă',
    entityType: 'both'
  },
  {
    id: 'nis2-audit-001',
    title: 'Audit de Securitate Periodic',
    description: 'Efectuarea de audituri de securitate regulate pentru a evalua eficacitatea măsurilor de gestionare a riscurilor și conformitatea cu politicile și procedurile de securitate.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(c); Legea transpunere RO',
    category: 'audit',
    deadline: 'Primul audit până la 17 octombrie 2025; audituri ulterioare cel puțin la 2 ani pentru entități importante, anual pentru entități esențiale',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-audit-002',
    title: 'Teste de Securitate și Penetrare',
    description: 'Efectuarea de teste periodice ale măsurilor de securitate, inclusiv teste de penetrare și evaluări ale vulnerabilităților, pentru a identifica și remedia punctele slabe.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(c); Legea transpunere RO',
    category: 'audit',
    deadline: 'Primul test până la 17 octombrie 2025; teste ulterioare cel puțin o dată la 2 ani',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-gov-003',
    title: 'Criptografie și Securitate Comunicații',
    description: 'Implementarea de măsuri criptografice pentru protecția confidențialității și integrității datelor, atât în tranzit cât și în repaus, utilizând standarde recunoscute.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(d); Legea transpunere RO',
    category: 'governance',
    deadline: 'Implementare până la 17 octombrie 2024',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-gov-004',
    title: 'Controlul Accesului și Autentificare',
    description: 'Implementarea de măsuri robuste de control al accesului, inclusiv autentificare multi-factor pentru acces privilegiat și segmentarea rețelei pe baza principiului "cel mai mic privilegiu".',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(d); Legea transpunere RO',
    category: 'governance',
    deadline: 'Implementare până la 17 octombrie 2024',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-gov-005',
    title: 'Backup și Disaster Recovery',
    description: 'Implementarea de politici și proceduri pentru backup-ul regulat al datelor și sistemelor critice, cu testarea periodică a capacității de restaurare și recuperare în caz de dezastru.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(b); Legea transpunere RO',
    category: 'governance',
    deadline: 'Implementare până la 17 octombrie 2024',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-risk-003',
    title: 'Managementul Patch-urilor și Vulnerabilităților',
    description: 'Implementarea unui proces sistematic de identificare, evaluare și remediere a vulnerabilităților, cu aplicarea promptă a patch-urilor de securitate pe toate sistemele critice.',
    legalBasis: 'Directiva UE 2022/2555, Art. 21(2)(d); Legea transpunere RO',
    category: 'risk',
    deadline: 'Implementare până la 17 octombrie 2024; aplicare patch-uri critice în maximum 14 zile',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  },
  {
    id: 'nis2-gov-006',
    title: 'Înregistrare la CERT-RO/DNSC',
    description: 'Înregistrarea obligatorie a entității la autoritatea națională competentă (CERT-RO pentru entități esențiale, DNSC pentru coordonare generală) și menținerea datelor de contact actualizate.',
    legalBasis: 'Directiva UE 2022/2555, Art. 24; Legea transpunere RO',
    category: 'governance',
    deadline: 'Înregistrare până la 17 ianuarie 2025',
    penalty: 'Amendă pentru neînregistrare: până la 50.000 EUR',
    entityType: 'both'
  },
  {
    id: 'nis2-audit-003',
    title: 'Documentare și Evidență Conformitate',
    description: 'Menținerea unei documentații complete privind toate măsurile de securitate implementate, incidentele raportate, auditurile efectuate și acțiunile corective, disponibile pentru inspecții.',
    legalBasis: 'Directiva UE 2022/2555, Art. 32; Legea transpunere RO',
    category: 'audit',
    deadline: 'Implementare continuă; documentația trebuie păstrată minimum 5 ani',
    penalty: 'Entități esențiale: până la 10.000.000 EUR sau 2% din cifra de afaceri; Entități importante: până la 7.000.000 EUR sau 1,4% din cifra de afaceri',
    entityType: 'both'
  }
];

/**
 * Helper functions pentru filtrarea obligațiilor
 */

export function getObligatiiByCategory(category: ObligatieNIS2['category']): ObligatieNIS2[] {
  return obligatiiNIS2.filter(obl => obl.category === category);
}

export function getObligatiiByEntityType(entityType: 'essential' | 'important'): ObligatieNIS2[] {
  return obligatiiNIS2.filter(obl => obl.entityType === entityType || obl.entityType === 'both');
}

export function getObligatieById(id: string): ObligatieNIS2 | undefined {
  return obligatiiNIS2.find(obl => obl.id === id);
}

export const categoriiNIS2 = [
  { value: 'governance', label: 'Guvernanță' },
  { value: 'risk', label: 'Gestionare Risc' },
  { value: 'incident', label: 'Raportare Incidente' },
  { value: 'supply-chain', label: 'Lanț Aprovizionare' },
  { value: 'training', label: 'Formare' },
  { value: 'audit', label: 'Audit & Testare' }
] as const;
