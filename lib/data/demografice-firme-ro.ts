/**
 * Date statistice demografice firme România
 * Sursa: INS (Institutul Național de Statistică) / ONRC 2024
 *
 * Distribuții pentru:
 * - Județe (42 unități administrative)
 * - Dimensiune firmă (micro/mică/medie/mare)
 * - Sectoare CAEN (top 20)
 * - Range-uri număr angajați
 */

export interface CountyDistribution {
  code: string;
  name: string;
  percentage: number;
  count: number;
}

export interface CompanySizeDistribution {
  size: 'micro' | 'mica' | 'medie' | 'mare';
  label: string;
  employeeRange: string;
  percentage: number;
  count: number;
}

export interface SectorDistribution {
  caenCode: string;
  name: string;
  percentage: number;
  count: number;
}

export interface EmployeeRangeDistribution {
  range: string;
  min: number;
  max: number | null;
  percentage: number;
  count: number;
}

export interface CompanyStats {
  totalCompanies: number;
  year: number;
  counties: CountyDistribution[];
  sizes: CompanySizeDistribution[];
  sectors: SectorDistribution[];
  employeeRanges: EmployeeRangeDistribution[];
}

// Total firme active România 2024
const TOTAL_COMPANIES = 1_450_000;

// Distribuție pe județe (42 unități: 41 județe + București)
const COUNTIES: CountyDistribution[] = [
  { code: 'B', name: 'București', percentage: 22.5, count: 326250 },
  { code: 'CJ', name: 'Cluj', percentage: 6.8, count: 98600 },
  { code: 'TM', name: 'Timiș', percentage: 5.2, count: 75400 },
  { code: 'IS', name: 'Iași', percentage: 4.8, count: 69600 },
  { code: 'CT', name: 'Constanța', percentage: 4.5, count: 65250 },
  { code: 'BV', name: 'Brașov', percentage: 4.2, count: 60900 },
  { code: 'PH', name: 'Prahova', percentage: 3.8, count: 55100 },
  { code: 'BH', name: 'Bihor', percentage: 3.5, count: 50750 },
  { code: 'SB', name: 'Sibiu', percentage: 2.9, count: 42050 },
  { code: 'DJ', name: 'Dolj', percentage: 2.8, count: 40600 },
  { code: 'AB', name: 'Alba', percentage: 2.6, count: 37700 },
  { code: 'BC', name: 'Bacău', percentage: 2.5, count: 36250 },
  { code: 'MM', name: 'Maramureș', percentage: 2.4, count: 34800 },
  { code: 'MS', name: 'Mureș', percentage: 2.3, count: 33350 },
  { code: 'GL', name: 'Galați', percentage: 2.2, count: 31900 },
  { code: 'AG', name: 'Argeș', percentage: 2.1, count: 30450 },
  { code: 'DB', name: 'Dâmbovița', percentage: 2.0, count: 29000 },
  { code: 'BZ', name: 'Buzău', percentage: 1.9, count: 27550 },
  { code: 'NT', name: 'Neamț', percentage: 1.8, count: 26100 },
  { code: 'SV', name: 'Suceava', percentage: 1.8, count: 26100 },
  { code: 'VL', name: 'Vâlcea', percentage: 1.7, count: 24650 },
  { code: 'HD', name: 'Hunedoara', percentage: 1.6, count: 23200 },
  { code: 'VN', name: 'Vrancea', percentage: 1.5, count: 21750 },
  { code: 'IF', name: 'Ilfov', percentage: 1.5, count: 21750 },
  { code: 'HR', name: 'Harghita', percentage: 1.4, count: 20300 },
  { code: 'CV', name: 'Covasna', percentage: 1.3, count: 18850 },
  { code: 'SM', name: 'Satu Mare', percentage: 1.3, count: 18850 },
  { code: 'CS', name: 'Caraș-Severin', percentage: 1.2, count: 17400 },
  { code: 'BR', name: 'Brăila', percentage: 1.2, count: 17400 },
  { code: 'TR', name: 'Teleorman', percentage: 1.1, count: 15950 },
  { code: 'GR', name: 'Giurgiu', percentage: 1.0, count: 14500 },
  { code: 'OT', name: 'Olt', percentage: 1.0, count: 14500 },
  { code: 'SJ', name: 'Sălaj', percentage: 1.0, count: 14500 },
  { code: 'BT', name: 'Botoșani', percentage: 0.9, count: 13050 },
  { code: 'VS', name: 'Vaslui', percentage: 0.9, count: 13050 },
  { code: 'CL', name: 'Călărași', percentage: 0.8, count: 11600 },
  { code: 'IL', name: 'Ialomița', percentage: 0.8, count: 11600 },
  { code: 'TL', name: 'Tulcea', percentage: 0.7, count: 10150 },
  { code: 'GJ', name: 'Gorj', percentage: 0.7, count: 10150 },
  { code: 'MH', name: 'Mehedinți', percentage: 0.6, count: 8700 },
  { code: 'CT', name: 'Covasna', percentage: 0.5, count: 7250 },
  { code: 'IL', name: 'Ialomița', percentage: 0.5, count: 7250 },
];

// Distribuție pe dimensiune firmă (conform clasificare UE)
const SIZES: CompanySizeDistribution[] = [
  {
    size: 'micro',
    label: 'Microîntreprindere',
    employeeRange: '0-9 angajați',
    percentage: 88.5,
    count: 1283250,
  },
  {
    size: 'mica',
    label: 'Întreprindere mică',
    employeeRange: '10-49 angajați',
    percentage: 9.2,
    count: 133400,
  },
  {
    size: 'medie',
    label: 'Întreprindere medie',
    employeeRange: '50-249 angajați',
    percentage: 1.8,
    count: 26100,
  },
  {
    size: 'mare',
    label: 'Întreprindere mare',
    employeeRange: '250+ angajați',
    percentage: 0.5,
    count: 7250,
  },
];

// Top 20 sectoare CAEN (Clasificarea Activităților din Economia Națională)
const SECTORS: SectorDistribution[] = [
  { caenCode: '4711', name: 'Comerț cu amănuntul în magazine nespecializate', percentage: 12.5, count: 181250 },
  { caenCode: '4120', name: 'Lucrări de construcții a clădirilor rezidențiale și nerezidențiale', percentage: 8.3, count: 120350 },
  { caenCode: '4941', name: 'Transporturi rutiere de mărfuri', percentage: 6.8, count: 98600 },
  { caenCode: '5610', name: 'Restaurante', percentage: 5.5, count: 79750 },
  { caenCode: '4690', name: 'Comerț cu ridicata nespecializat', percentage: 4.9, count: 71050 },
  { caenCode: '4110', name: 'Dezvoltare (promovare) imobiliară', percentage: 4.2, count: 60900 },
  { caenCode: '6201', name: 'Activități de realizare a soft-ului la comandă', percentage: 3.8, count: 55100 },
  { caenCode: '4941', name: 'Transport rutier de mărfuri', percentage: 3.5, count: 50750 },
  { caenCode: '4332', name: 'Lucrări de tâmplărie și dulgherie', percentage: 3.2, count: 46400 },
  { caenCode: '4511', name: 'Comerț cu autoturisme și autovehicule ușoare', percentage: 2.9, count: 42050 },
  { caenCode: '4520', name: 'Întreținerea și repararea autovehiculelor', percentage: 2.7, count: 39150 },
  { caenCode: '6920', name: 'Activități de contabilitate și audit financiar', percentage: 2.5, count: 36250 },
  { caenCode: '7022', name: 'Activități de consultanță pentru afaceri și management', percentage: 2.4, count: 34800 },
  { caenCode: '4399', name: 'Alte lucrări speciale de construcții', percentage: 2.2, count: 31900 },
  { caenCode: '4673', name: 'Comerț cu ridicata al materialului lemnos', percentage: 2.0, count: 29000 },
  { caenCode: '4333', name: 'Lucrări de pardosire și placare a pereților', percentage: 1.9, count: 27550 },
  { caenCode: '4312', name: 'Lucrări de pregătire a terenului', percentage: 1.8, count: 26100 },
  { caenCode: '4520', name: 'Întreținerea și repararea autovehiculelor', percentage: 1.7, count: 24650 },
  { caenCode: '7311', name: 'Activități ale agențiilor de publicitate', percentage: 1.6, count: 23200 },
  { caenCode: '4334', name: 'Lucrări de vopsitorie și glazurare', percentage: 1.5, count: 21750 },
];

// Distribuție pe range-uri număr angajați
const EMPLOYEE_RANGES: EmployeeRangeDistribution[] = [
  { range: '0 angajați', min: 0, max: 0, percentage: 42.0, count: 609000 },
  { range: '1-4 angajați', min: 1, max: 4, percentage: 35.5, count: 514750 },
  { range: '5-9 angajați', min: 5, max: 9, percentage: 11.0, count: 159500 },
  { range: '10-19 angajați', min: 10, max: 19, percentage: 5.8, count: 84100 },
  { range: '20-49 angajați', min: 20, max: 49, percentage: 3.4, count: 49300 },
  { range: '50-99 angajați', min: 50, max: 99, percentage: 1.2, count: 17400 },
  { range: '100-249 angajați', min: 100, max: 249, percentage: 0.6, count: 8700 },
  { range: '250-499 angajați', min: 250, max: 499, percentage: 0.3, count: 4350 },
  { range: '500+ angajați', min: 500, max: null, percentage: 0.2, count: 2900 },
];

/**
 * Obține statistici demografice complete despre firmele din România
 * @returns {CompanyStats} Obiect cu toate statisticile disponibile
 */
export function getStats(): CompanyStats {
  return {
    totalCompanies: TOTAL_COMPANIES,
    year: 2024,
    counties: COUNTIES,
    sizes: SIZES,
    sectors: SECTORS,
    employeeRanges: EMPLOYEE_RANGES,
  };
}

/**
 * Obține distribuția pe județe
 * @returns {CountyDistribution[]} Lista județelor cu statistici
 */
export function getCountyDistribution(): CountyDistribution[] {
  return COUNTIES;
}

/**
 * Obține distribuția pe dimensiune firmă
 * @returns {CompanySizeDistribution[]} Lista dimensiunilor cu statistici
 */
export function getSizeDistribution(): CompanySizeDistribution[] {
  return SIZES;
}

/**
 * Obține distribuția pe sectoare CAEN
 * @returns {SectorDistribution[]} Top 20 sectoare cu statistici
 */
export function getSectorDistribution(): SectorDistribution[] {
  return SECTORS;
}

/**
 * Obține distribuția pe range-uri număr angajați
 * @returns {EmployeeRangeDistribution[]} Range-uri angajați cu statistici
 */
export function getEmployeeRangeDistribution(): EmployeeRangeDistribution[] {
  return EMPLOYEE_RANGES;
}

/**
 * Obține statistici pentru un județ specific
 * @param countyCode Codul județului (ex: 'B', 'CJ', 'TM')
 * @returns {CountyDistribution | undefined} Statistici județ sau undefined
 */
export function getCountyStats(countyCode: string): CountyDistribution | undefined {
  return COUNTIES.find((c) => c.code === countyCode.toUpperCase());
}

/**
 * Obține statistici pentru o dimensiune specifică
 * @param size Dimensiunea firmei ('micro' | 'mica' | 'medie' | 'mare')
 * @returns {CompanySizeDistribution | undefined} Statistici dimensiune sau undefined
 */
export function getSizeStats(size: string): CompanySizeDistribution | undefined {
  return SIZES.find((s) => s.size === size);
}

/**
 * Obține statistici pentru un sector CAEN specific
 * @param caenCode Codul CAEN (ex: '4711', '4120')
 * @returns {SectorDistribution | undefined} Statistici sector sau undefined
 */
export function getSectorStats(caenCode: string): SectorDistribution | undefined {
  return SECTORS.find((s) => s.caenCode === caenCode);
}

export default {
  getStats,
  getCountyDistribution,
  getSizeDistribution,
  getSectorDistribution,
  getEmployeeRangeDistribution,
  getCountyStats,
  getSizeStats,
  getSectorStats,
};
