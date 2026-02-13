/**
 * ISU/PSI Inspection Preparation Checklist
 *
 * Comprehensive checklist for preparing Fire Safety (PSI) inspections
 * by ISU (Inspectoratul pentru Situații de Urgență)
 */

export interface InspectionItem {
  id: string;
  requirement: string;
  legalBasis: string;
  frequency: string;
  category: 'documentation' | 'equipment' | 'infrastructure' | 'training' | 'procedures';
  critical: boolean;
  notes?: string;
}

export const isuInspectionChecklist: InspectionItem[] = [
  // DOCUMENTATION
  {
    id: 'psi-001',
    requirement: 'Autorizație PSI valabilă',
    legalBasis: 'Legea 307/2006, art. 21-22',
    frequency: 'La modificări construcție sau destinație',
    category: 'documentation',
    critical: true,
    notes: 'Verificare termen valabilitate și conformitate cu destinația actuală'
  },
  {
    id: 'psi-002',
    requirement: 'Plan de evacuare afișat',
    legalBasis: 'Legea 307/2006, art. 24, HG 571/2016',
    frequency: 'Permanent, actualizare la modificări',
    category: 'documentation',
    critical: true,
    notes: 'Planuri de evacuare pe fiecare nivel, vizibile, cu marcaj "Dvs. vă aflați aici"'
  },
  {
    id: 'psi-003',
    requirement: 'Instrucțiuni PSI proprii',
    legalBasis: 'Legea 307/2006, art. 10, HG 571/2016',
    frequency: 'Actualizare anuală și la modificări',
    category: 'documentation',
    critical: true,
    notes: 'Aprobate de conducere, comunicate tuturor angajaților'
  },
  {
    id: 'psi-004',
    requirement: 'Registrul de evidență PSI',
    legalBasis: 'HG 571/2016, anexa 4',
    frequency: 'Completare permanentă',
    category: 'documentation',
    critical: true,
    notes: 'Include verificări, instruiri, defecțiuni, măsuri luate'
  },
  {
    id: 'psi-005',
    requirement: 'Declarație de securitate la incendiu',
    legalBasis: 'Legea 307/2006, art. 19',
    frequency: 'La începutul activității și la modificări',
    category: 'documentation',
    critical: true
  },
  {
    id: 'psi-006',
    requirement: 'Avize ISU pentru modificări construcție',
    legalBasis: 'Legea 50/1991, Legea 307/2006',
    frequency: 'La fiecare modificare',
    category: 'documentation',
    critical: true,
    notes: 'Păstrare toate avizele și autorizațiile de construire'
  },
  {
    id: 'psi-007',
    requirement: 'Scenarii de securitate la incendiu',
    legalBasis: 'Legea 307/2006, art. 10(1)',
    frequency: 'Actualizare anuală',
    category: 'documentation',
    critical: true,
    notes: 'Pentru fiecare zonă cu risc specific'
  },

  // EQUIPMENT - STINGĂTOARE
  {
    id: 'psi-008',
    requirement: 'Stingătoare verificate și întreținute',
    legalBasis: 'SR EN 3, HG 571/2016',
    frequency: 'Control lunar, revizie anuală',
    category: 'equipment',
    critical: true,
    notes: 'Etichete verificare vizibile, presiune corectă, acces liber'
  },
  {
    id: 'psi-009',
    requirement: 'Dotare conformă cu normativul P118',
    legalBasis: 'Normativ P118/2-2013',
    frequency: 'Verificare la modificări spații',
    category: 'equipment',
    critical: true,
    notes: 'Număr și capacitate stingătoare conform calculului P118'
  },
  {
    id: 'psi-010',
    requirement: 'Locație stingătoare marcată și accesibilă',
    legalBasis: 'HG 571/2016, SR EN 3',
    frequency: 'Verificare lunară',
    category: 'equipment',
    critical: true,
    notes: 'Marcaj vizibil, înălțime max 1.50m, fără obstacole'
  },

  // EQUIPMENT - HIDRANȚI
  {
    id: 'psi-011',
    requirement: 'Hidranți interiori verificați funcțional',
    legalBasis: 'SR EN 671-3, HG 571/2016',
    frequency: 'Verificare trimestrială, revizie anuală',
    category: 'equipment',
    critical: true,
    notes: 'Presiune apă, furtun în stare bună, jetul funcțional'
  },
  {
    id: 'psi-012',
    requirement: 'Hidranți exteriori identificați și funcționali',
    legalBasis: 'STAS 8295/1, HG 571/2016',
    frequency: 'Verificare semestrială',
    category: 'equipment',
    critical: true,
    notes: 'Marcare clară, debitul conform normativ'
  },

  // INFRASTRUCTURE - DETECȚIE ȘI ALARMĂ
  {
    id: 'psi-013',
    requirement: 'Sistem de detecție incendiu funcțional',
    legalBasis: 'SR EN 54, Legea 307/2006',
    frequency: 'Verificare lunară, revizie anuală',
    category: 'infrastructure',
    critical: true,
    notes: 'Detectori curați, baterii auxiliare verificate, semnalizare clară'
  },
  {
    id: 'psi-014',
    requirement: 'Sistem de alarmă incendiu funcțional',
    legalBasis: 'SR EN 54-3, HG 571/2016',
    frequency: 'Test lunar',
    category: 'infrastructure',
    critical: true,
    notes: 'Semnal sonor audibil în toate zonele'
  },
  {
    id: 'psi-015',
    requirement: 'Butoane manuale de alarmare accesibile',
    legalBasis: 'SR EN 54-11',
    frequency: 'Verificare lunară',
    category: 'infrastructure',
    critical: true,
    notes: 'Montate pe căile de evacuare, vizibile, funcționale'
  },

  // INFRASTRUCTURE - EVACUARE
  {
    id: 'psi-016',
    requirement: 'Iluminat de siguranță/urgență funcțional',
    legalBasis: 'SR EN 1838, HG 571/2016',
    frequency: 'Test lunar, revizie anuală',
    category: 'infrastructure',
    critical: true,
    notes: 'Autonomie min 1h, iluminat căi evacuare și puncte critice'
  },
  {
    id: 'psi-017',
    requirement: 'Semnalizare căi de evacuare conformă',
    legalBasis: 'SR ISO 3864, SR EN ISO 7010',
    frequency: 'Verificare permanentă',
    category: 'infrastructure',
    critical: true,
    notes: 'Panouri fotoluminiscente sau iluminate, vizibile permanent'
  },
  {
    id: 'psi-018',
    requirement: 'Căi de evacuare libere și funcționale',
    legalBasis: 'Legea 307/2006, art. 24, HG 571/2016',
    frequency: 'Verificare zilnică',
    category: 'infrastructure',
    critical: true,
    notes: 'Fără obstacole, lățime conformă, uși deschidere spre exterior'
  },
  {
    id: 'psi-019',
    requirement: 'Uși antifoc verificate și funcționale',
    legalBasis: 'SR EN 1634-1, Legea 307/2006',
    frequency: 'Verificare lunară, revizie anuală',
    category: 'infrastructure',
    critical: true,
    notes: 'Închidere automată, garnituri intacte, fără blocaje'
  },

  // TRAINING & PROCEDURES
  {
    id: 'psi-020',
    requirement: 'Exerciții de evacuare efectuate',
    legalBasis: 'Legea 307/2006, art. 10, HG 571/2016',
    frequency: 'Minim o dată pe an',
    category: 'training',
    critical: true,
    notes: 'Documentat proces verbal, participare min 80% personal'
  },
  {
    id: 'psi-021',
    requirement: 'Instruire PSI initială și periodică',
    legalBasis: 'Legea 307/2006, art. 16, HG 1425/2006',
    frequency: 'Anuală, la angajare, la schimbare loc muncă',
    category: 'training',
    critical: true,
    notes: 'Fișe de instruire semnate, test de verificare cunoștințe'
  },
  {
    id: 'psi-022',
    requirement: 'Responsabil PSI desemnat',
    legalBasis: 'Legea 307/2006, art. 10(2)',
    frequency: 'Permanent',
    category: 'training',
    critical: true,
    notes: 'Decizie scrisă, atribuții clare, pregătire corespunzătoare'
  },
  {
    id: 'psi-023',
    requirement: 'Echipă de intervenție formată și instruită',
    legalBasis: 'HG 571/2016, art. 8',
    frequency: 'Instruire trimestrială',
    category: 'training',
    critical: false,
    notes: 'Pentru organizații cu risc ridicat sau >50 angajați'
  },

  // PROCEDURES
  {
    id: 'psi-024',
    requirement: 'Proceduri de lucru cu foc deschis',
    legalBasis: 'HG 571/2016, anexa 3',
    frequency: 'La fiecare lucrare',
    category: 'procedures',
    critical: true,
    notes: 'Permis de lucru cu foc, măsuri preventive, supraveghere'
  },
  {
    id: 'psi-025',
    requirement: 'Verificare instalații electrice',
    legalBasis: 'Legea 319/2006, PE 107',
    frequency: 'Anuală (min) sau conform ISCIR',
    category: 'procedures',
    critical: true,
    notes: 'Buletine de verificare, remedieri defecțiuni'
  }
];

/**
 * Get checklist items by category
 */
export function getItemsByCategory(category: InspectionItem['category']): InspectionItem[] {
  return isuInspectionChecklist.filter(item => item.category === category);
}

/**
 * Get critical items only
 */
export function getCriticalItems(): InspectionItem[] {
  return isuInspectionChecklist.filter(item => item.critical);
}

/**
 * Get items by search term
 */
export function searchItems(searchTerm: string): InspectionItem[] {
  const term = searchTerm.toLowerCase();
  return isuInspectionChecklist.filter(item =>
    item.requirement.toLowerCase().includes(term) ||
    item.legalBasis.toLowerCase().includes(term) ||
    item.notes?.toLowerCase().includes(term)
  );
}

/**
 * Category labels for UI
 */
export const categoryLabels: Record<InspectionItem['category'], string> = {
  documentation: 'Documentație',
  equipment: 'Echipamente',
  infrastructure: 'Infrastructură',
  training: 'Instruire',
  procedures: 'Proceduri'
};

/**
 * Get statistics
 */
export function getChecklistStats() {
  return {
    total: isuInspectionChecklist.length,
    critical: isuInspectionChecklist.filter(item => item.critical).length,
    byCategory: {
      documentation: getItemsByCategory('documentation').length,
      equipment: getItemsByCategory('equipment').length,
      infrastructure: getItemsByCategory('infrastructure').length,
      training: getItemsByCategory('training').length,
      procedures: getItemsByCategory('procedures').length
    }
  };
}
