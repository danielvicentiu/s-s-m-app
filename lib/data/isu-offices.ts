/**
 * ISU (Inspectoratul pentru Situații de Urgență) offices in Romania
 * Emergency services offices by county
 */

export interface IsuOffice {
  id: string;
  county: string;
  name: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  email: string;
}

export const isuOffices: IsuOffice[] = [
  {
    id: 'isu-alba',
    county: 'Alba',
    name: 'ISU "Unirea" Alba',
    address: 'Str. Pompierilor nr. 1, Alba Iulia, județul Alba',
    phone: '0258 811 515',
    emergencyPhone: '112',
    email: 'office@isuab.ro'
  },
  {
    id: 'isu-arad',
    county: 'Arad',
    name: 'ISU "Vasile Goldiș" Arad',
    address: 'Str. Andrenyi Karoly nr. 16-18, Arad, județul Arad',
    phone: '0257 281 001',
    emergencyPhone: '112',
    email: 'office@isuarad.ro'
  },
  {
    id: 'isu-arges',
    county: 'Argeș',
    name: 'ISU "Vedea" Argeș',
    address: 'Str. Mușcel nr. 40, Pitești, județul Argeș',
    phone: '0248 212 004',
    emergencyPhone: '112',
    email: 'office@isuarges.ro'
  },
  {
    id: 'isu-bacau',
    county: 'Bacău',
    name: 'ISU "Grigore Ghica Voievod" Bacău',
    address: 'Str. Ștefan cel Mare nr. 4, Bacău, județul Bacău',
    phone: '0234 513 800',
    emergencyPhone: '112',
    email: 'office@isubacau.ro'
  },
  {
    id: 'isu-bihor',
    county: 'Bihor',
    name: 'ISU "Crișana" Bihor',
    address: 'Calea Aradului nr. 12, Oradea, județul Bihor',
    phone: '0259 452 020',
    emergencyPhone: '112',
    email: 'office@isubh.ro'
  },
  {
    id: 'isu-bistrita-nasaud',
    county: 'Bistrița-Năsăud',
    name: 'ISU "Someș" Bistrița-Năsăud',
    address: 'Str. Piața Petru Rareș nr. 1, Bistrița, județul Bistrița-Năsăud',
    phone: '0263 234 800',
    emergencyPhone: '112',
    email: 'office@isubn.ro'
  },
  {
    id: 'isu-botosani',
    county: 'Botoșani',
    name: 'ISU "Nicolae Iorga" Botoșani',
    address: 'Str. Marchian nr. 22, Botoșani, județul Botoșani',
    phone: '0231 514 001',
    emergencyPhone: '112',
    email: 'office@isubt.ro'
  },
  {
    id: 'isu-brasov',
    county: 'Brașov',
    name: 'ISU "Șerban Cantacuzino" Brașov',
    address: 'Str. Zizinului nr. 3, Brașov, județul Brașov',
    phone: '0268 418 777',
    emergencyPhone: '112',
    email: 'office@isubv.ro'
  },
  {
    id: 'isu-braila',
    county: 'Brăila',
    name: 'ISU "Dunărea" Brăila',
    address: 'Str. Radu Portocală nr. 18, Brăila, județul Brăila',
    phone: '0239 613 600',
    emergencyPhone: '112',
    email: 'office@isubr.ro'
  },
  {
    id: 'isu-buzau',
    county: 'Buzău',
    name: 'ISU "Răsărit" Buzău',
    address: 'Str. Unirii nr. 160, Buzău, județul Buzău',
    phone: '0238 710 800',
    emergencyPhone: '112',
    email: 'office@isubuzau.ro'
  },
  {
    id: 'isu-caras-severin',
    county: 'Caraș-Severin',
    name: 'ISU "Semenic" Caraș-Severin',
    address: 'B-dul Republicii nr. 47, Reșița, județul Caraș-Severin',
    phone: '0255 211 212',
    emergencyPhone: '112',
    email: 'office@isucs.ro'
  },
  {
    id: 'isu-calarasi',
    county: 'Călărași',
    name: 'ISU "Barbu Știrbey" Călărași',
    address: 'Str. Progresului nr. 1, Călărași, județul Călărași',
    phone: '0242 313 333',
    emergencyPhone: '112',
    email: 'office@isucl.ro'
  },
  {
    id: 'isu-cluj',
    county: 'Cluj',
    name: 'ISU "Avram Iancu" Cluj',
    address: 'Str. Gheorghe Dima nr. 5, Cluj-Napoca, județul Cluj',
    phone: '0264 431 212',
    emergencyPhone: '112',
    email: 'office@isucj.ro'
  },
  {
    id: 'isu-constanta',
    county: 'Constanța',
    name: 'ISU "Dobrogea" Constanța',
    address: 'B-dul Aurel Vlaicu nr. 179, Constanța, județul Constanța',
    phone: '0241 619 200',
    emergencyPhone: '112',
    email: 'office@isuct.ro'
  },
  {
    id: 'isu-covasna',
    county: 'Covasna',
    name: 'ISU "Oltul" Covasna',
    address: 'Str. Closca nr. 2, Sfântu Gheorghe, județul Covasna',
    phone: '0267 311 900',
    emergencyPhone: '112',
    email: 'office@isucv.ro'
  },
  {
    id: 'isu-dambovita',
    county: 'Dâmbovița',
    name: 'ISU "Basarab I" Dâmbovița',
    address: 'Str. Depozitelor nr. 2, Târgoviște, județul Dâmbovița',
    phone: '0245 206 801',
    emergencyPhone: '112',
    email: 'office@isudb.ro'
  },
  {
    id: 'isu-dolj',
    county: 'Dolj',
    name: 'ISU "Oltenia" Dolj',
    address: 'Str. Brestei nr. 142, Craiova, județul Dolj',
    phone: '0251 408 200',
    emergencyPhone: '112',
    email: 'office@isudj.ro'
  },
  {
    id: 'isu-galati',
    county: 'Galați',
    name: 'ISU "Dunărea de Jos" Galați',
    address: 'Str. Basarabiei nr. 33, Galați, județul Galați',
    phone: '0236 478 900',
    emergencyPhone: '112',
    email: 'office@isugl.ro'
  },
  {
    id: 'isu-giurgiu',
    county: 'Giurgiu',
    name: 'ISU "Vlaicu Vodă" Giurgiu',
    address: 'Str. Portului nr. 42, Giurgiu, județul Giurgiu',
    phone: '0246 213 333',
    emergencyPhone: '112',
    email: 'office@isugr.ro'
  },
  {
    id: 'isu-gorj',
    county: 'Gorj',
    name: 'ISU "Locotenent colonel Grigore Ghițescu" Gorj',
    address: 'Str. Tudor Vladimirescu nr. 165, Târgu Jiu, județul Gorj',
    phone: '0253 214 242',
    emergencyPhone: '112',
    email: 'office@isugj.ro'
  },
  {
    id: 'isu-harghita',
    county: 'Harghita',
    name: 'ISU "Harghita" Harghita',
    address: 'Str. Remetea nr. 11, Miercurea Ciuc, județul Harghita',
    phone: '0266 207 900',
    emergencyPhone: '112',
    email: 'office@isuhr.ro'
  },
  {
    id: 'isu-hunedoara',
    county: 'Hunedoara',
    name: 'ISU "Iancu de Hunedoara" Hunedoara',
    address: 'Str. Libertății nr. 24, Deva, județul Hunedoara',
    phone: '0254 221 515',
    emergencyPhone: '112',
    email: 'office@isuhd.ro'
  },
  {
    id: 'isu-ialomita',
    county: 'Ialomița',
    name: 'ISU "Codrii Vlăsiei" Ialomița',
    address: 'Str. Matei Basarab nr. 120, Slobozia, județul Ialomița',
    phone: '0243 230 800',
    emergencyPhone: '112',
    email: 'office@isuil.ro'
  },
  {
    id: 'isu-iasi',
    county: 'Iași',
    name: 'ISU "Basarab Independența" Iași',
    address: 'Str. Silvestru nr. 15, Iași, județul Iași',
    phone: '0232 217 004',
    emergencyPhone: '112',
    email: 'office@isuis.ro'
  },
  {
    id: 'isu-ilfov',
    county: 'Ilfov',
    name: 'ISU "Codrii Vlăsiei" Ilfov',
    address: 'Str. Pompierului nr. 1A, Cornetu, județul Ilfov',
    phone: '021 350 2000',
    emergencyPhone: '112',
    email: 'office@isuif.ro'
  },
  {
    id: 'isu-maramures',
    county: 'Maramureș',
    name: 'ISU "Maramureș" Maramureș',
    address: 'Str. Cuza Vodă nr. 2, Baia Mare, județul Maramureș',
    phone: '0262 276 800',
    emergencyPhone: '112',
    email: 'office@isumm.ro'
  },
  {
    id: 'isu-mehedinti',
    county: 'Mehedinți',
    name: 'ISU "Mehedinți" Mehedinți',
    address: 'Str. Victoriei nr. 45, Drobeta-Turnu Severin, județul Mehedinți',
    phone: '0252 326 800',
    emergencyPhone: '112',
    email: 'office@isumh.ro'
  },
  {
    id: 'isu-mures',
    county: 'Mureș',
    name: 'ISU "Horea" Mureș',
    address: 'Str. Vânătorului nr. 2, Târgu Mureș, județul Mureș',
    phone: '0265 269 800',
    emergencyPhone: '112',
    email: 'office@isums.ro'
  },
  {
    id: 'isu-neamt',
    county: 'Neamț',
    name: 'ISU "Petrodava" Neamț',
    address: 'Str. Avram Iancu nr. 1, Piatra Neamț, județul Neamț',
    phone: '0233 218 900',
    emergencyPhone: '112',
    email: 'office@isuneamt.ro'
  },
  {
    id: 'isu-olt',
    county: 'Olt',
    name: 'ISU "Matei Basarab" Olt',
    address: 'Str. Tineretului nr. 2, Slatina, județul Olt',
    phone: '0249 434 900',
    emergencyPhone: '112',
    email: 'office@isuolt.ro'
  },
  {
    id: 'isu-prahova',
    county: 'Prahova',
    name: 'ISU "Șerban Cantacuzino" Prahova',
    address: 'Str. Toma Caragiu nr. 10-12, Ploiești, județul Prahova',
    phone: '0244 516 800',
    emergencyPhone: '112',
    email: 'office@isuph.ro'
  },
  {
    id: 'isu-satu-mare',
    county: 'Satu Mare',
    name: 'ISU "Someș" Satu Mare',
    address: 'Str. Gării nr. 7, Satu Mare, județul Satu Mare',
    phone: '0261 767 900',
    emergencyPhone: '112',
    email: 'office@isusm.ro'
  },
  {
    id: 'isu-salaj',
    county: 'Sălaj',
    name: 'ISU "Porolissum" Sălaj',
    address: 'Str. Fabricii nr. 2, Zalău, județul Sălaj',
    phone: '0260 616 900',
    emergencyPhone: '112',
    email: 'office@isusj.ro'
  },
  {
    id: 'isu-sibiu',
    county: 'Sibiu',
    name: 'ISU "Oltul" Sibiu',
    address: 'Str. Șelimbărului nr. 2, Sibiu, județul Sibiu',
    phone: '0269 234 900',
    emergencyPhone: '112',
    email: 'office@isusibiu.ro'
  },
  {
    id: 'isu-suceava',
    county: 'Suceava',
    name: 'ISU "Bucovina" Suceava',
    address: 'Str. Mărășești nr. 3, Suceava, județul Suceava',
    phone: '0230 523 900',
    emergencyPhone: '112',
    email: 'office@isusv.ro'
  },
  {
    id: 'isu-teleorman',
    county: 'Teleorman',
    name: 'ISU "Valeriu Cortez" Teleorman',
    address: 'Str. Dunării nr. 187, Alexandria, județul Teleorman',
    phone: '0247 313 900',
    emergencyPhone: '112',
    email: 'office@isutr.ro'
  },
  {
    id: 'isu-timis',
    county: 'Timiș',
    name: 'ISU "Banat" Timiș',
    address: 'Str. Ion Mihalache de Apșa nr. 2, Timișoara, județul Timiș',
    phone: '0256 295 900',
    emergencyPhone: '112',
    email: 'office@isutimis.ro'
  },
  {
    id: 'isu-tulcea',
    county: 'Tulcea',
    name: 'ISU "Delta" Tulcea',
    address: 'Str. Portului nr. 28, Tulcea, județul Tulcea',
    phone: '0240 516 900',
    emergencyPhone: '112',
    email: 'office@isutulcea.ro'
  },
  {
    id: 'isu-vaslui',
    county: 'Vaslui',
    name: 'ISU "Mihail Sturdza" Vaslui',
    address: 'Str. Ștefan cel Mare nr. 130, Vaslui, județul Vaslui',
    phone: '0235 314 900',
    emergencyPhone: '112',
    email: 'office@isuvs.ro'
  },
  {
    id: 'isu-valcea',
    county: 'Vâlcea',
    name: 'ISU "Vâlcea" Vâlcea',
    address: 'Str. General Praporgescu nr. 8, Râmnicu Vâlcea, județul Vâlcea',
    phone: '0250 741 900',
    emergencyPhone: '112',
    email: 'office@isuvl.ro'
  },
  {
    id: 'isu-vrancea',
    county: 'Vrancea',
    name: 'ISU "Anghel Saligny" Vrancea',
    address: 'Str. Spiru Haret nr. 18, Focșani, județul Vrancea',
    phone: '0237 613 900',
    emergencyPhone: '112',
    email: 'office@isuvn.ro'
  },
  {
    id: 'isu-bucuresti',
    county: 'București',
    name: 'ISU "Dealul Spirii" București-Ilfov',
    address: 'Str. Italiană nr. 32, București',
    phone: '021 316 0300',
    emergencyPhone: '112',
    email: 'office@isubif.ro'
  }
];

/**
 * Get ISU office by county name
 */
export function getIsuOfficeByCounty(county: string): IsuOffice | undefined {
  return isuOffices.find(
    (office) => office.county.toLowerCase() === county.toLowerCase()
  );
}

/**
 * Get all ISU offices sorted by county name
 */
export function getAllIsuOfficesSorted(): IsuOffice[] {
  return [...isuOffices].sort((a, b) => a.county.localeCompare(b.county, 'ro'));
}
