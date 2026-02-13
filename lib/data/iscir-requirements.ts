/**
 * ISCIR Requirements Database
 *
 * Cerințe legislative ISCIR pentru echipamente sub presiune și echipamente de ridicat
 * conform legislației din România (Ordinul 75/2002, Ordinul 537/2010, etc.)
 */

export interface IscirRequirement {
  id: string;
  equipmentType: string;
  requirement: string;
  verificationFrequencyMonths: number;
  authorizedBody: string;
  penalty: string;
  requiredPersonnel: string;
  documentationRequired: string[];
}

export const iscirRequirements: IscirRequirement[] = [
  {
    id: 'ISCIR-ESP-001',
    equipmentType: 'Cazane de abur',
    requirement: 'Verificare tehnică periodică obligatorie pentru cazanele de abur cu suprafață de încălzire > 2 m²',
    verificationFrequencyMonths: 12,
    authorizedBody: 'ISCIR - Inspectoratul de Stat pentru Controlul Cazanelor, Recipientelor sub Presiune și Instalațiilor de Ridicat',
    penalty: 'Amendă de la 10.000 RON la 50.000 RON și suspendarea activității până la remedierea neconformităților',
    requiredPersonnel: 'RSVTI - Responsabil cu Supravegherea și Verificarea Tehnică a Instalațiilor',
    documentationRequired: [
      'Carte de identitate a cazanului',
      'Autorizație de funcționare ISCIR',
      'Procese verbale de verificare tehnică periodică',
      'Certificat RSVTI valabil',
      'Registru de exploatare',
      'Instrucțiuni de exploatare',
      'Plan de amplasament',
    ],
  },
  {
    id: 'ISCIR-ESP-002',
    equipmentType: 'Recipiente sub presiune fixe',
    requirement: 'Verificare tehnică periodică pentru recipiente sub presiune fixe cu volum > 50 litri și presiune > 0,5 bar',
    verificationFrequencyMonths: 24,
    authorizedBody: 'ISCIR sau organisme notificate autorizate',
    penalty: 'Amendă de la 5.000 RON la 30.000 RON și oprirea din funcționare',
    requiredPersonnel: 'RSVTI atestat ISCIR categoria corespunzătoare',
    documentationRequired: [
      'Carte de identitate a recipientului',
      'Autorizație de funcționare ISCIR',
      'Proces verbal de verificare tehnică',
      'Certificat de calificare RSVTI',
      'Registru de evidență',
      'Schemă tehnologică',
    ],
  },
  {
    id: 'ISCIR-ESP-003',
    equipmentType: 'Butelii de gaz comprimat/lichefiat',
    requirement: 'Verificare tehnică și reîncercare hidraulică periodică pentru butelii de gaz cu presiune > 1 bar',
    verificationFrequencyMonths: 60,
    authorizedBody: 'ISCIR sau stații autorizate de reîncercare',
    penalty: 'Amendă de la 3.000 RON la 15.000 RON și confiscarea buteliilor neconforme',
    requiredPersonnel: 'RSVTI pentru depozitare, personal atestat pentru manipulare',
    documentationRequired: [
      'Buletine de verificare și reîncercare',
      'Registru de evidență butelii',
      'Autorizație depozitare',
      'Fișe de securitate gaze',
      'Proceduri de manipulare',
      'Plan de amplasare',
    ],
  },
  {
    id: 'ISCIR-ESP-004',
    equipmentType: 'Instalații frigorifice cu amoniac',
    requirement: 'Verificare tehnică periodică pentru instalații frigorifice cu amoniac (NH3) indiferent de cantitate',
    verificationFrequencyMonths: 12,
    authorizedBody: 'ISCIR - verificare obligatorie anuală',
    penalty: 'Amendă de la 15.000 RON la 75.000 RON și oprirea imediată a instalației',
    requiredPersonnel: 'RSVTI cu atestare pentru instalații frigorifice cu amoniac + frigoriști autorizați',
    documentationRequired: [
      'Carte de identitate a instalației',
      'Autorizație ISCIR specială',
      'Certificat RSVTI pentru amoniac',
      'Plan de intervenție situații de urgență',
      'Avize ISU și Mediu',
      'Fișă de securitate amoniac',
      'Registru de exploatare zilnic',
    ],
  },
  {
    id: 'ISCIR-RID-001',
    equipmentType: 'Macarale turn',
    requirement: 'Verificare tehnică periodică și verificare la instalare/relocare pentru macarale turn cu capacitate > 1 tonă',
    verificationFrequencyMonths: 12,
    authorizedBody: 'ISCIR sau organisme de inspecție acreditate RENAR',
    penalty: 'Amendă de la 20.000 RON la 100.000 RON și interzicerea folosirii',
    requiredPersonnel: 'RSVTI pentru instalații de ridicat + macaragii cu certificat ISCIR',
    documentationRequired: [
      'Carte de identitate macara',
      'Autorizație de funcționare ISCIR',
      'Procese verbale verificare periodică',
      'Proces verbal verificare după montaj',
      'Certificat RSVTI',
      'Certificate macaragii',
      'Registru de verificări',
      'Cartea de comenzi',
    ],
  },
  {
    id: 'ISCIR-RID-002',
    equipmentType: 'Poduri rulante și macarale portal',
    requirement: 'Verificare tehnică periodică pentru poduri rulante și macarale portal cu capacitate > 1 tonă',
    verificationFrequencyMonths: 12,
    authorizedBody: 'ISCIR sau organisme acreditate',
    penalty: 'Amendă de la 10.000 RON la 50.000 RON și oprirea din funcționare',
    requiredPersonnel: 'RSVTI + operatori certificați (pontiști)',
    documentationRequired: [
      'Carte de identitate pod rulant',
      'Autorizație ISCIR',
      'Proces verbal verificare anuală',
      'Certificate pontiști',
      'Registru de exploatare',
      'Instrucțiuni de exploatare',
      'Schemă electrică',
    ],
  },
  {
    id: 'ISCIR-RID-003',
    equipmentType: 'Electropalan și palan manual',
    requirement: 'Verificare tehnică periodică pentru electropalane și palane manuale cu capacitate > 250 kg',
    verificationFrequencyMonths: 12,
    authorizedBody: 'ISCIR sau persoane autorizate',
    penalty: 'Amendă de la 5.000 RON la 25.000 RON',
    requiredPersonnel: 'RSVTI + operatori instruiți',
    documentationRequired: [
      'Declarație de conformitate',
      'Certificat de verificare',
      'Registru de evidență',
      'Fișe de instruire personal',
      'Proces verbal verificare',
    ],
  },
  {
    id: 'ISCIR-RID-004',
    equipmentType: 'Lifturi și ascensoare',
    requirement: 'Verificare tehnică periodică obligatorie pentru lifturi de persoane și marfă cu cursă > 3 metri',
    verificationFrequencyMonths: 12,
    authorizedBody: 'ISCIR sau organisme notificate autorizate',
    penalty: 'Amendă de la 15.000 RON la 75.000 RON și blocarea liftului',
    requiredPersonnel: 'RSVTI pentru lifturi + personal service autorizat',
    documentationRequired: [
      'Carte de identitate lift',
      'Autorizație de funcționare',
      'Proces verbal verificare anuală',
      'Contract mentenanță cu firmă autorizată',
      'Registru de intervenții',
      'Certificat RSVTI',
      'Asigurare răspundere civilă',
    ],
  },
  {
    id: 'ISCIR-RID-005',
    equipmentType: 'Platforme elevatoare automotoare (nacele)',
    requirement: 'Verificare tehnică periodică pentru platforme elevatoare cu înălțime de lucru > 3 metri',
    verificationFrequencyMonths: 12,
    authorizedBody: 'ISCIR sau organisme de inspecție acreditate',
    penalty: 'Amendă de la 10.000 RON la 50.000 RON și retragere din exploatare',
    requiredPersonnel: 'RSVTI + operatori cu certificat ISCIR pentru platforme elevatoare',
    documentationRequired: [
      'Carte de identitate platformă',
      'Autorizație ISCIR',
      'Certificat verificare tehnică',
      'Certificate operatori',
      'Registru de verificări zilnice',
      'Manual de utilizare',
      'Declarație de conformitate CE',
    ],
  },
  {
    id: 'ISCIR-ESP-005',
    equipmentType: 'Compresoare de aer',
    requirement: 'Verificare tehnică periodică pentru compresoare cu presiune > 0,5 bar și putere motor > 10 kW',
    verificationFrequencyMonths: 24,
    authorizedBody: 'ISCIR sau organisme notificate',
    penalty: 'Amendă de la 5.000 RON la 30.000 RON',
    requiredPersonnel: 'RSVTI categoria corespunzătoare + operator instruit',
    documentationRequired: [
      'Carte de identitate compresor',
      'Autorizație de funcționare',
      'Proces verbal verificare',
      'Certificat RSVTI',
      'Registru de exploatare',
      'Schema instalației',
      'Fișe de verificare zilnică',
    ],
  },
];

/**
 * Helper function to get requirement by ID
 */
export function getRequirementById(id: string): IscirRequirement | undefined {
  return iscirRequirements.find((req) => req.id === id);
}

/**
 * Helper function to get requirements by equipment type
 */
export function getRequirementsByType(equipmentType: string): IscirRequirement[] {
  return iscirRequirements.filter((req) =>
    req.equipmentType.toLowerCase().includes(equipmentType.toLowerCase())
  );
}

/**
 * Helper function to get requirements by verification frequency
 */
export function getRequirementsByFrequency(months: number): IscirRequirement[] {
  return iscirRequirements.filter((req) => req.verificationFrequencyMonths === months);
}

/**
 * Get all equipment types
 */
export function getAllEquipmentTypes(): string[] {
  return iscirRequirements.map((req) => req.equipmentType);
}
