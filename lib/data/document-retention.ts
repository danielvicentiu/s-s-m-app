/**
 * Document Retention Database
 *
 * Legal retention periods for SSM/PSI documents in Romania
 * Based on Romanian labor law, archive legislation, and SSM/PSI regulations
 */

export interface DocumentRetention {
  id: string;
  documentType: string;
  category: 'ssm' | 'psi' | 'medical' | 'personal' | 'administrative' | 'financial';
  retentionYears: number;
  legalBasis: string;
  afterEvent: string; // Event after which retention period starts
  archiveMethod: 'physical' | 'digital' | 'both';
  destructionMethod: string;
  notes?: string;
}

export const documentRetentionData: DocumentRetention[] = [
  // SSM Documents
  {
    id: 'ssm-001',
    documentType: 'Fișa de instruire SSM',
    category: 'ssm',
    retentionYears: 5,
    legalBasis: 'HG 1425/2006, art. 18',
    afterEvent: 'încetare contract de muncă',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată - tocător documente / ștergere digitală cu certificat',
    notes: 'Se păstrează 5 ani de la încetarea raporturilor de muncă ale salariatului'
  },
  {
    id: 'ssm-002',
    documentType: 'Registru general de instruire SSM',
    category: 'ssm',
    retentionYears: 50,
    legalBasis: 'Legea nr. 319/2006, art. 16',
    afterEvent: 'ultima înregistrare în registru',
    archiveMethod: 'both',
    destructionMethod: 'Arhivare permanentă - transfer către Arhivele Naționale',
    notes: 'Document de importanță istorică pentru organizație'
  },
  {
    id: 'ssm-003',
    documentType: 'Registru de accidente de muncă',
    category: 'ssm',
    retentionYears: 50,
    legalBasis: 'HG 1425/2006, art. 28',
    afterEvent: 'ultima înregistrare',
    archiveMethod: 'both',
    destructionMethod: 'Arhivare permanentă - transfer către Arhivele Naționale',
    notes: 'Perioadă permanentă din considerente legale și istorice'
  },
  {
    id: 'ssm-004',
    documentType: 'Declarații de accident de muncă',
    category: 'ssm',
    retentionYears: 50,
    legalBasis: 'HG 1425/2006, Anexa 2',
    afterEvent: 'data accidentului',
    archiveMethod: 'both',
    destructionMethod: 'Arhivare permanentă - transfer către Arhivele Naționale',
    notes: 'Include toate anexele și documentele de anchetă'
  },
  {
    id: 'ssm-005',
    documentType: 'Plan de prevenire și protecție',
    category: 'ssm',
    retentionYears: 10,
    legalBasis: 'Legea nr. 319/2006, art. 10',
    afterEvent: 'actualizare sau înlocuire',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Se păstrează și versiunile anterioare pentru audit'
  },
  {
    id: 'ssm-006',
    documentType: 'Raport anual de activitate SSM',
    category: 'ssm',
    retentionYears: 10,
    legalBasis: 'HG 1425/2006',
    afterEvent: 'anul raportării',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Rapoarte anuale prezentate conducerii'
  },
  {
    id: 'ssm-007',
    documentType: 'Evaluări de risc (IEVR)',
    category: 'ssm',
    retentionYears: 10,
    legalBasis: 'HG 1425/2006, art. 7-8',
    afterEvent: 'actualizare',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Se păstrează versiunea curentă și ultimele 2 versiuni anterioare'
  },
  {
    id: 'ssm-008',
    documentType: 'Procese verbale contravenții ITM',
    category: 'ssm',
    retentionYears: 10,
    legalBasis: 'Cod Procedură Civilă',
    afterEvent: 'data procesului verbal',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Include și dovezile de remediere'
  },

  // PSI Documents
  {
    id: 'psi-001',
    documentType: 'Autorizație PSI',
    category: 'psi',
    retentionYears: 10,
    legalBasis: 'Legea nr. 307/2006',
    afterEvent: 'expirare autorizație',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Se păstrează și după expirare pentru istoric'
  },
  {
    id: 'psi-002',
    documentType: 'Scenarii de securitate la incendiu',
    category: 'psi',
    retentionYears: 10,
    legalBasis: 'Legea nr. 307/2006, art. 10',
    afterEvent: 'actualizare',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Document actualizat la schimbări semnificative'
  },
  {
    id: 'psi-003',
    documentType: 'Registru de instruire PSI',
    category: 'psi',
    retentionYears: 10,
    legalBasis: 'Legea nr. 307/2006',
    afterEvent: 'ultima înregistrare',
    archiveMethod: 'both',
    destructionMethod: 'Arhivare de lungă durată',
    notes: 'Evidență instruiri periodice și inițiale'
  },
  {
    id: 'psi-004',
    documentType: 'Procese verbale verificare stingătoare',
    category: 'psi',
    retentionYears: 5,
    legalBasis: 'Reglementări tehnice PSI',
    afterEvent: 'data verificării',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Verificări anuale obligatorii'
  },
  {
    id: 'psi-005',
    documentType: 'Rapoarte simulări/exerciții evacuare',
    category: 'psi',
    retentionYears: 5,
    legalBasis: 'Legea nr. 307/2006',
    afterEvent: 'data exercițiului',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Minim un exercițiu anual obligatoriu'
  },

  // Medical Documents
  {
    id: 'med-001',
    documentType: 'Fișa de aptitudine medicală',
    category: 'medical',
    retentionYears: 10,
    legalBasis: 'HG 355/2007',
    afterEvent: 'încetare contract de muncă',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată confidențială',
    notes: 'Date medicale sensibile - GDPR'
  },
  {
    id: 'med-002',
    documentType: 'Registru medicina muncii',
    category: 'medical',
    retentionYears: 10,
    legalBasis: 'HG 355/2007',
    afterEvent: 'ultima înregistrare',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată confidențială',
    notes: 'Evidență controale medicale periodice'
  },
  {
    id: 'med-003',
    documentType: 'Declarații boli profesionale',
    category: 'medical',
    retentionYears: 50,
    legalBasis: 'HG 1425/2006',
    afterEvent: 'data declarației',
    archiveMethod: 'both',
    destructionMethod: 'Arhivare permanentă',
    notes: 'Import deosebit pentru dosare medicale și litigii'
  },

  // Personal Documents
  {
    id: 'pers-001',
    documentType: 'Contracte individuale de muncă',
    category: 'personal',
    retentionYears: 50,
    legalBasis: 'Codul Muncii, art. 40',
    afterEvent: 'încetare contract',
    archiveMethod: 'both',
    destructionMethod: 'Arhivare permanentă - transfer Arhivele Naționale',
    notes: 'Include toate actele adiționale'
  },
  {
    id: 'pers-002',
    documentType: 'Decizii încetare contract de muncă',
    category: 'personal',
    retentionYears: 50,
    legalBasis: 'Codul Muncii',
    afterEvent: 'data deciziei',
    archiveMethod: 'both',
    destructionMethod: 'Arhivare permanentă',
    notes: 'Import pentru litigii de muncă'
  },
  {
    id: 'pers-003',
    documentType: 'State de plată',
    category: 'personal',
    retentionYears: 10,
    legalBasis: 'Cod Fiscal',
    afterEvent: 'anul fiscal',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Obligație fiscală - verificări ANAF'
  },
  {
    id: 'pers-004',
    documentType: 'Pontaje și foi de prezență',
    category: 'personal',
    retentionYears: 5,
    legalBasis: 'Codul Muncii, art. 119',
    afterEvent: 'anul înregistrării',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Evidență program de lucru și ore suplimentare'
  },

  // Administrative Documents
  {
    id: 'admin-001',
    documentType: 'Regulament intern',
    category: 'administrative',
    retentionYears: 10,
    legalBasis: 'Codul Muncii, art. 241-243',
    afterEvent: 'actualizare sau înlocuire',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Se păstrează versiunile anterioare pentru referință'
  },
  {
    id: 'admin-002',
    documentType: 'Registru de evidență salariați (REVISAL)',
    category: 'administrative',
    retentionYears: 50,
    legalBasis: 'Legea nr. 53/2003',
    afterEvent: 'ultima înregistrare',
    archiveMethod: 'digital',
    destructionMethod: 'Arhivare permanentă',
    notes: 'Evidență electronică obligatorie ITM'
  },
  {
    id: 'admin-003',
    documentType: 'Proces verbal de predare-primire',
    category: 'administrative',
    retentionYears: 5,
    legalBasis: 'Cod Civil',
    afterEvent: 'data procesului verbal',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Predare dotări, utilaje, documente'
  },

  // Financial Documents
  {
    id: 'fin-001',
    documentType: 'Facturi și documente contabile',
    category: 'financial',
    retentionYears: 10,
    legalBasis: 'Legea nr. 82/1991, art. 25',
    afterEvent: 'anul fiscal',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Obligație contabilă - verificări ANAF'
  },
  {
    id: 'fin-002',
    documentType: 'Declarații fiscale (D112, D394)',
    category: 'financial',
    retentionYears: 10,
    legalBasis: 'Cod Procedură Fiscală',
    afterEvent: 'anul depunerii',
    archiveMethod: 'both',
    destructionMethod: 'Distrugere securizată după expirare',
    notes: 'Perioadă prescripție fiscală'
  }
];

/**
 * Helper functions for document retention management
 */

export function getRetentionByCategory(category: DocumentRetention['category']): DocumentRetention[] {
  return documentRetentionData.filter(doc => doc.category === category);
}

export function getRetentionByDocumentType(documentType: string): DocumentRetention | undefined {
  return documentRetentionData.find(
    doc => doc.documentType.toLowerCase().includes(documentType.toLowerCase())
  );
}

export function calculateDestructionDate(
  documentId: string,
  eventDate: Date
): Date | null {
  const retention = documentRetentionData.find(doc => doc.id === documentId);
  if (!retention) return null;

  const destructionDate = new Date(eventDate);
  destructionDate.setFullYear(destructionDate.getFullYear() + retention.retentionYears);

  return destructionDate;
}

export function getExpiredDocuments(documents: { id: string; eventDate: Date }[]): {
  id: string;
  documentType: string;
  eventDate: Date;
  destructionDate: Date;
  daysOverdue: number;
}[] {
  const today = new Date();
  const expired: any[] = [];

  documents.forEach(doc => {
    const retention = documentRetentionData.find(r => r.id === doc.id);
    if (!retention) return;

    const destructionDate = calculateDestructionDate(doc.id, doc.eventDate);
    if (!destructionDate) return;

    if (destructionDate < today) {
      const daysOverdue = Math.floor(
        (today.getTime() - destructionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      expired.push({
        id: doc.id,
        documentType: retention.documentType,
        eventDate: doc.eventDate,
        destructionDate,
        daysOverdue
      });
    }
  });

  return expired;
}

export function getDocumentsNearingRetention(
  documents: { id: string; eventDate: Date }[],
  daysThreshold: number = 90
): {
  id: string;
  documentType: string;
  eventDate: Date;
  destructionDate: Date;
  daysUntilDestruction: number;
}[] {
  const today = new Date();
  const nearing: any[] = [];

  documents.forEach(doc => {
    const retention = documentRetentionData.find(r => r.id === doc.id);
    if (!retention) return;

    const destructionDate = calculateDestructionDate(doc.id, doc.eventDate);
    if (!destructionDate) return;

    const daysUntil = Math.floor(
      (destructionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil > 0 && daysUntil <= daysThreshold) {
      nearing.push({
        id: doc.id,
        documentType: retention.documentType,
        eventDate: doc.eventDate,
        destructionDate,
        daysUntilDestruction: daysUntil
      });
    }
  });

  return nearing;
}

export const RETENTION_CATEGORIES = [
  { value: 'ssm', label: 'SSM (Securitate și Sănătate în Muncă)' },
  { value: 'psi', label: 'PSI (Prevenire și Stingere Incendii)' },
  { value: 'medical', label: 'Medical' },
  { value: 'personal', label: 'Resurse Umane' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'financial', label: 'Financiar-Contabile' }
] as const;
