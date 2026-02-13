/**
 * Database of Occupational Medicine Clinics in Romania
 * Used for medical examinations required by SSM legislation
 */

export interface MedicalClinic {
  id: string;
  name: string;
  city: string;
  county: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  services: string[];
  averageCost: number; // RON
  rating: number; // 1-5
}

export const cliniciMedicinaMuncii: MedicalClinic[] = [
  // București - 5 clinici
  {
    id: 'clinic-001',
    name: 'Clinica MedWork București',
    city: 'București',
    county: 'București',
    address: 'Bd. Unirii nr. 45, Sector 3',
    phone: '021.315.7890',
    email: 'contact@medwork.ro',
    website: 'https://medwork.ro',
    services: [
      'Examen medical medicina muncii',
      'Psihologic aptitudini profesionale',
      'Audiometrie',
      'Spirometrie',
      'EKG',
      'Analize de laborator',
    ],
    averageCost: 180,
    rating: 4.7,
  },
  {
    id: 'clinic-002',
    name: 'Centrul Medical SSM Pro',
    city: 'București',
    county: 'București',
    address: 'Str. Aviator Popișteanu nr. 12, Sector 1',
    phone: '021.222.4567',
    email: 'office@ssmpro.ro',
    website: 'https://ssmpro.ro',
    services: [
      'Examen medical medicina muncii',
      'Testare aptitudini înălțime',
      'Oftalmologie ocupațională',
      'Audiometrie',
      'Spirometrie',
      'Radiologie',
    ],
    averageCost: 210,
    rating: 4.8,
  },
  {
    id: 'clinic-003',
    name: 'SafeHealth Medical Center',
    city: 'București',
    county: 'București',
    address: 'Calea Victoriei nr. 155, Sector 2',
    phone: '021.318.2345',
    email: 'info@safehealth.ro',
    website: 'https://safehealth.ro',
    services: [
      'Examen medical medicina muncii',
      'Testare antidrog',
      'Testare alcool',
      'EKG',
      'Analize de laborator',
      'Vaccinări ocupaționale',
    ],
    averageCost: 195,
    rating: 4.6,
  },
  {
    id: 'clinic-004',
    name: 'Policlinica MedSSM Titan',
    city: 'București',
    county: 'București',
    address: 'Bd. Nicolae Grigorescu nr. 78, Sector 3',
    phone: '021.345.6789',
    email: 'program@medssm-titan.ro',
    website: 'https://medssm-titan.ro',
    services: [
      'Examen medical medicina muncii',
      'Psihologic aptitudini profesionale',
      'Audiometrie',
      'Spirometrie',
      'Analize clinice',
    ],
    averageCost: 165,
    rating: 4.5,
  },
  {
    id: 'clinic-005',
    name: 'WorkHealth Clinic Berceni',
    city: 'București',
    county: 'București',
    address: 'Șos. Olteniței nr. 234, Sector 4',
    phone: '021.460.1234',
    email: 'contact@workhealth.ro',
    website: 'https://workhealth.ro',
    services: [
      'Examen medical medicina muncii',
      'Dermatologie profesională',
      'Oftalmologie',
      'EKG',
      'Spirometrie',
      'Testare psihologică',
    ],
    averageCost: 175,
    rating: 4.4,
  },

  // Cluj-Napoca - 3 clinici
  {
    id: 'clinic-006',
    name: 'MedLab Medicina Muncii Cluj',
    city: 'Cluj-Napoca',
    county: 'Cluj',
    address: 'Str. Moților nr. 67',
    phone: '0264.590.123',
    email: 'office@medlab-cluj.ro',
    website: 'https://medlab-cluj.ro',
    services: [
      'Examen medical medicina muncii',
      'Audiometrie',
      'Spirometrie',
      'EKG',
      'Analize de laborator',
      'Testare antidrog',
    ],
    averageCost: 190,
    rating: 4.8,
  },
  {
    id: 'clinic-007',
    name: 'Clinica SSM Transilvania',
    city: 'Cluj-Napoca',
    county: 'Cluj',
    address: 'Calea Turzii nr. 89',
    phone: '0264.445.678',
    email: 'contact@ssm-transilvania.ro',
    website: 'https://ssm-transilvania.ro',
    services: [
      'Examen medical medicina muncii',
      'Psihologic aptitudini profesionale',
      'Oftalmologie ocupațională',
      'Audiometrie',
      'Radiologie',
      'Vaccinări',
    ],
    averageCost: 200,
    rating: 4.7,
  },
  {
    id: 'clinic-008',
    name: 'SafeWork Medical Cluj',
    city: 'Cluj-Napoca',
    county: 'Cluj',
    address: 'Str. Fabricii nr. 12',
    phone: '0264.501.890',
    email: 'program@safework-cluj.ro',
    website: 'https://safework-cluj.ro',
    services: [
      'Examen medical medicina muncii',
      'Testare antidrog și alcool',
      'Spirometrie',
      'EKG',
      'Analize clinice',
    ],
    averageCost: 185,
    rating: 4.6,
  },

  // Timișoara - 2 clinici
  {
    id: 'clinic-009',
    name: 'MedWork Timișoara',
    city: 'Timișoara',
    county: 'Timiș',
    address: 'Bd. Revoluției nr. 45',
    phone: '0256.490.234',
    email: 'office@medwork-tm.ro',
    website: 'https://medwork-tm.ro',
    services: [
      'Examen medical medicina muncii',
      'Psihologic aptitudini profesionale',
      'Audiometrie',
      'Spirometrie',
      'EKG',
      'Analize de laborator',
      'Radiologie',
    ],
    averageCost: 195,
    rating: 4.7,
  },
  {
    id: 'clinic-010',
    name: 'Policlinica SSM Banat',
    city: 'Timișoara',
    county: 'Timiș',
    address: 'Str. Circumvalațiunii nr. 78',
    phone: '0256.301.567',
    email: 'contact@ssm-banat.ro',
    website: 'https://ssm-banat.ro',
    services: [
      'Examen medical medicina muncii',
      'Testare antidrog',
      'Oftalmologie',
      'Audiometrie',
      'Spirometrie',
      'Analize clinice',
    ],
    averageCost: 180,
    rating: 4.5,
  },

  // Iași - 2 clinici
  {
    id: 'clinic-011',
    name: 'Clinica Medicina Muncii Moldova',
    city: 'Iași',
    county: 'Iași',
    address: 'Bd. Independenței nr. 56',
    phone: '0232.267.890',
    email: 'program@mm-moldova.ro',
    website: 'https://mm-moldova.ro',
    services: [
      'Examen medical medicina muncii',
      'Psihologic aptitudini profesionale',
      'Audiometrie',
      'Spirometrie',
      'EKG',
      'Analize de laborator',
    ],
    averageCost: 170,
    rating: 4.6,
  },
  {
    id: 'clinic-012',
    name: 'SafeHealth Iași',
    city: 'Iași',
    county: 'Iași',
    address: 'Str. Arcu nr. 23',
    phone: '0232.315.456',
    email: 'office@safehealth-iasi.ro',
    website: 'https://safehealth-iasi.ro',
    services: [
      'Examen medical medicina muncii',
      'Testare antidrog și alcool',
      'Oftalmologie ocupațională',
      'Audiometrie',
      'Radiologie',
      'Vaccinări',
    ],
    averageCost: 175,
    rating: 4.5,
  },

  // Restul orașelor - 8 clinici
  {
    id: 'clinic-013',
    name: 'MedSSM Constanța',
    city: 'Constanța',
    county: 'Constanța',
    address: 'Bd. Tomis nr. 145',
    phone: '0241.615.789',
    email: 'contact@medssm-ct.ro',
    website: 'https://medssm-ct.ro',
    services: [
      'Examen medical medicina muncii',
      'Audiometrie',
      'Spirometrie',
      'EKG',
      'Analize de laborator',
      'Testare psihologică',
    ],
    averageCost: 165,
    rating: 4.4,
  },
  {
    id: 'clinic-014',
    name: 'Clinica WorkHealth Brașov',
    city: 'Brașov',
    county: 'Brașov',
    address: 'Str. Nicolae Bălcescu nr. 34',
    phone: '0268.470.123',
    email: 'office@workhealth-bv.ro',
    website: 'https://workhealth-bv.ro',
    services: [
      'Examen medical medicina muncii',
      'Psihologic aptitudini profesionale',
      'Testare înălțime',
      'Audiometrie',
      'Spirometrie',
      'Radiologie',
    ],
    averageCost: 185,
    rating: 4.7,
  },
  {
    id: 'clinic-015',
    name: 'Policlinica SSM Craiova',
    city: 'Craiova',
    county: 'Dolj',
    address: 'Calea București nr. 112',
    phone: '0251.530.456',
    email: 'program@ssm-craiova.ro',
    website: 'https://ssm-craiova.ro',
    services: [
      'Examen medical medicina muncii',
      'Testare antidrog',
      'Oftalmologie',
      'Audiometrie',
      'EKG',
      'Analize clinice',
    ],
    averageCost: 160,
    rating: 4.3,
  },
  {
    id: 'clinic-016',
    name: 'MedWork Ploiești',
    city: 'Ploiești',
    county: 'Prahova',
    address: 'Bd. Republicii nr. 89',
    phone: '0244.590.234',
    email: 'contact@medwork-ph.ro',
    website: 'https://medwork-ph.ro',
    services: [
      'Examen medical medicina muncii',
      'Audiometrie',
      'Spirometrie',
      'EKG',
      'Analize de laborator',
    ],
    averageCost: 170,
    rating: 4.5,
  },
  {
    id: 'clinic-017',
    name: 'Clinica Medicina Muncii Galați',
    city: 'Galați',
    county: 'Galați',
    address: 'Str. Brăilei nr. 67',
    phone: '0236.460.890',
    email: 'office@mm-galati.ro',
    website: 'https://mm-galati.ro',
    services: [
      'Examen medical medicina muncii',
      'Psihologic aptitudini profesionale',
      'Oftalmologie ocupațională',
      'Audiometrie',
      'Spirometrie',
      'Testare antidrog',
    ],
    averageCost: 165,
    rating: 4.4,
  },
  {
    id: 'clinic-018',
    name: 'SafeWork Medical Sibiu',
    city: 'Sibiu',
    county: 'Sibiu',
    address: 'Str. Avram Iancu nr. 23',
    phone: '0269.230.567',
    email: 'program@safework-sibiu.ro',
    website: 'https://safework-sibiu.ro',
    services: [
      'Examen medical medicina muncii',
      'Audiometrie',
      'Spirometrie',
      'EKG',
      'Analize clinice',
      'Radiologie',
    ],
    averageCost: 175,
    rating: 4.6,
  },
  {
    id: 'clinic-019',
    name: 'MedSSM Bacău',
    city: 'Bacău',
    county: 'Bacău',
    address: 'Str. Mărășești nr. 45',
    phone: '0234.580.123',
    email: 'contact@medssm-bc.ro',
    website: 'https://medssm-bc.ro',
    services: [
      'Examen medical medicina muncii',
      'Testare antidrog și alcool',
      'Audiometrie',
      'Spirometrie',
      'Analize de laborator',
    ],
    averageCost: 160,
    rating: 4.3,
  },
  {
    id: 'clinic-020',
    name: 'Clinica SSM Oradea',
    city: 'Oradea',
    county: 'Bihor',
    address: 'Calea Aradului nr. 78',
    phone: '0259.440.789',
    email: 'office@ssm-oradea.ro',
    website: 'https://ssm-oradea.ro',
    services: [
      'Examen medical medicina muncii',
      'Psihologic aptitudini profesionale',
      'Oftalmologie',
      'Audiometrie',
      'Spirometrie',
      'EKG',
      'Vaccinări ocupaționale',
    ],
    averageCost: 180,
    rating: 4.6,
  },
];

/**
 * Get clinics filtered by city
 */
export function getClinicsByCity(city: string): MedicalClinic[] {
  return cliniciMedicinaMuncii.filter(
    (clinic) => clinic.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Get clinics filtered by county
 */
export function getClinicsByCounty(county: string): MedicalClinic[] {
  return cliniciMedicinaMuncii.filter(
    (clinic) => clinic.county.toLowerCase() === county.toLowerCase()
  );
}

/**
 * Get clinic by ID
 */
export function getClinicById(id: string): MedicalClinic | undefined {
  return cliniciMedicinaMuncii.find((clinic) => clinic.id === id);
}

/**
 * Get clinics sorted by rating (descending)
 */
export function getClinicsByRating(): MedicalClinic[] {
  return [...cliniciMedicinaMuncii].sort((a, b) => b.rating - a.rating);
}

/**
 * Get clinics filtered by service
 */
export function getClinicsByService(service: string): MedicalClinic[] {
  return cliniciMedicinaMuncii.filter((clinic) =>
    clinic.services.some((s) => s.toLowerCase().includes(service.toLowerCase()))
  );
}

/**
 * Get average cost range
 */
export function getAverageCostRange(): { min: number; max: number; avg: number } {
  const costs = cliniciMedicinaMuncii.map((c) => c.averageCost);
  return {
    min: Math.min(...costs),
    max: Math.max(...costs),
    avg: Math.round(costs.reduce((a, b) => a + b, 0) / costs.length),
  };
}
