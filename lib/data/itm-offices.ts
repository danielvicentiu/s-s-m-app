/**
 * ITM (Inspectoratul Teritorial de Muncă) Offices Database
 *
 * Complete list of all 42 county-level ITM offices in Romania + ITM Bucharest
 * Each office handles labor inspection, workplace safety (SSM), and employment relations
 *
 * Data structure:
 * - id: unique identifier (county code)
 * - county: county name (Romanian)
 * - name: official ITM office name
 * - address: street address
 * - phone: contact phone number(s)
 * - email: official email address
 * - website: official website URL
 * - jurisdiction: counties/areas covered by this ITM office
 */

export interface ITMOffice {
  id: string;
  county: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  jurisdiction: string[];
}

export const itmOffices: ITMOffice[] = [
  {
    id: 'AB',
    county: 'Alba',
    name: 'Inspectoratul Teritorial de Muncă Alba',
    address: 'Str. I.C. Brătianu, nr. 2, Alba Iulia, 510118',
    phone: '0258 811 212',
    email: 'office@itmalbaiulia.ro',
    website: 'https://www.itmalbaiulia.ro',
    jurisdiction: ['Alba']
  },
  {
    id: 'AR',
    county: 'Arad',
    name: 'Inspectoratul Teritorial de Muncă Arad',
    address: 'Str. Cloșca, nr. 17, Arad, 310326',
    phone: '0257 280 870',
    email: 'itmarad@itmarad.ro',
    website: 'https://www.itmarad.ro',
    jurisdiction: ['Arad']
  },
  {
    id: 'AG',
    county: 'Argeș',
    name: 'Inspectoratul Teritorial de Muncă Argeș',
    address: 'Str. Negru Vodă, nr. 4, Pitești, 110028',
    phone: '0248 213 090',
    email: 'itm@itmarges.ro',
    website: 'https://www.itmarges.ro',
    jurisdiction: ['Argeș']
  },
  {
    id: 'BC',
    county: 'Bacău',
    name: 'Inspectoratul Teritorial de Muncă Bacău',
    address: 'Str. Ștefan cel Mare, nr. 3, Bacău, 600362',
    phone: '0234 588 520',
    email: 'itmbacau@itmbacau.ro',
    website: 'https://www.itmbacau.ro',
    jurisdiction: ['Bacău']
  },
  {
    id: 'BH',
    county: 'Bihor',
    name: 'Inspectoratul Teritorial de Muncă Bihor',
    address: 'Str. General Berthelot, nr. 11, Oradea, 410168',
    phone: '0259 479 900',
    email: 'itm.bihor@itmbihor.ro',
    website: 'https://www.itmbihor.ro',
    jurisdiction: ['Bihor']
  },
  {
    id: 'BN',
    county: 'Bistrița-Năsăud',
    name: 'Inspectoratul Teritorial de Muncă Bistrița-Năsăud',
    address: 'Str. Piața Petru Rareș, nr. 11, Bistrița, 420021',
    phone: '0263 237 000',
    email: 'itmbistrita@itmbistrita.ro',
    website: 'https://www.itmbistrita.ro',
    jurisdiction: ['Bistrița-Năsăud']
  },
  {
    id: 'BT',
    county: 'Botoșani',
    name: 'Inspectoratul Teritorial de Muncă Botoșani',
    address: 'Str. Marchian, nr. 18, Botoșani, 710303',
    phone: '0231 531 940',
    email: 'itmbotosani@itmbotosani.ro',
    website: 'https://www.itmbotosani.ro',
    jurisdiction: ['Botoșani']
  },
  {
    id: 'BV',
    county: 'Brașov',
    name: 'Inspectoratul Teritorial de Muncă Brașov',
    address: 'Str. Lungă, nr. 68, Brașov, 500036',
    phone: '0268 413 570',
    email: 'itmbrasov@itmbrasov.ro',
    website: 'https://www.itmbrasov.ro',
    jurisdiction: ['Brașov']
  },
  {
    id: 'BR',
    county: 'Brăila',
    name: 'Inspectoratul Teritorial de Muncă Brăila',
    address: 'Str. Împăratul Traian, nr. 243, Brăila, 810153',
    phone: '0239 612 020',
    email: 'braila@itmbraila.ro',
    website: 'https://www.itmbraila.ro',
    jurisdiction: ['Brăila']
  },
  {
    id: 'B',
    county: 'București',
    name: 'Inspectoratul Teritorial de Muncă al Municipiului București',
    address: 'Str. Avrig, nr. 8-10, Sector 2, București, 020281',
    phone: '021 209 6700',
    email: 'office@itmbucuresti.ro',
    website: 'https://www.itmbucuresti.ro',
    jurisdiction: ['București', 'Ilfov']
  },
  {
    id: 'BZ',
    county: 'Buzău',
    name: 'Inspectoratul Teritorial de Muncă Buzău',
    address: 'B-dul Unirii, nr. 161, Buzău, 120218',
    phone: '0238 710 570',
    email: 'itmbuzau@itmbuzau.ro',
    website: 'https://www.itmbuzau.ro',
    jurisdiction: ['Buzău']
  },
  {
    id: 'CS',
    county: 'Caraș-Severin',
    name: 'Inspectoratul Teritorial de Muncă Caraș-Severin',
    address: 'Str. Take Ionescu, nr. 2A, Reșița, 320058',
    phone: '0255 221 831',
    email: 'itmcs@itmcarasseverin.ro',
    website: 'https://www.itmcarasseverin.ro',
    jurisdiction: ['Caraș-Severin']
  },
  {
    id: 'CL',
    county: 'Călărași',
    name: 'Inspectoratul Teritorial de Muncă Călărași',
    address: 'Str. București, nr. 36, Călărași, 910025',
    phone: '0242 331 363',
    email: 'itmcalarasi@itmcalarasi.ro',
    website: 'https://www.itmcalarasi.ro',
    jurisdiction: ['Călărași']
  },
  {
    id: 'CJ',
    county: 'Cluj',
    name: 'Inspectoratul Teritorial de Muncă Cluj',
    address: 'Str. Avram Iancu, nr. 24, Cluj-Napoca, 400098',
    phone: '0264 432 330',
    email: 'itmcluj@itmcluj.ro',
    website: 'https://www.itmcluj.ro',
    jurisdiction: ['Cluj']
  },
  {
    id: 'CT',
    county: 'Constanța',
    name: 'Inspectoratul Teritorial de Muncă Constanța',
    address: 'B-dul Mamaia, nr. 151, Constanța, 900545',
    phone: '0241 664 870',
    email: 'itmconstanta@itmct.ro',
    website: 'https://www.itmct.ro',
    jurisdiction: ['Constanța']
  },
  {
    id: 'CV',
    county: 'Covasna',
    name: 'Inspectoratul Teritorial de Muncă Covasna',
    address: 'Str. Gábor Áron, nr. 14, Sfântu Gheorghe, 520008',
    phone: '0267 351 313',
    email: 'itmcovasna@itmcovasna.ro',
    website: 'https://www.itmcovasna.ro',
    jurisdiction: ['Covasna']
  },
  {
    id: 'DB',
    county: 'Dâmbovița',
    name: 'Inspectoratul Teritorial de Muncă Dâmbovița',
    address: 'Str. Preot Popescu, nr. 2A, Târgoviște, 130018',
    phone: '0245 206 906',
    email: 'itmdambovita@itmdambovita.ro',
    website: 'https://www.itmdambovita.ro',
    jurisdiction: ['Dâmbovița']
  },
  {
    id: 'DJ',
    county: 'Dolj',
    name: 'Inspectoratul Teritorial de Muncă Dolj',
    address: 'Str. A.I. Cuza, nr. 5, Craiova, 200585',
    phone: '0251 413 010',
    email: 'itmdolj@itmdolj.ro',
    website: 'https://www.itmdolj.ro',
    jurisdiction: ['Dolj']
  },
  {
    id: 'GL',
    county: 'Galați',
    name: 'Inspectoratul Teritorial de Muncă Galați',
    address: 'Str. Brăilei, nr. 181A, Galați, 800318',
    phone: '0236 413 030',
    email: 'itmgalati@itmgalati.ro',
    website: 'https://www.itmgalati.ro',
    jurisdiction: ['Galați']
  },
  {
    id: 'GR',
    county: 'Giurgiu',
    name: 'Inspectoratul Teritorial de Muncă Giurgiu',
    address: 'Str. Portului, nr. 42, Giurgiu, 080110',
    phone: '0246 212 003',
    email: 'itmgiurgiu@itmgiurgiu.ro',
    website: 'https://www.itmgiurgiu.ro',
    jurisdiction: ['Giurgiu']
  },
  {
    id: 'GJ',
    county: 'Gorj',
    name: 'Inspectoratul Teritorial de Muncă Gorj',
    address: 'Str. Nicolae Titulescu, nr. 16, Târgu Jiu, 210206',
    phone: '0253 218 181',
    email: 'itmgorj@itmgorj.ro',
    website: 'https://www.itmgorj.ro',
    jurisdiction: ['Gorj']
  },
  {
    id: 'HR',
    county: 'Harghita',
    name: 'Inspectoratul Teritorial de Muncă Harghita',
    address: 'Str. Progresului, nr. 11, Miercurea Ciuc, 530140',
    phone: '0266 371 212',
    email: 'itmharghita@itmharghita.ro',
    website: 'https://www.itmharghita.ro',
    jurisdiction: ['Harghita']
  },
  {
    id: 'HD',
    county: 'Hunedoara',
    name: 'Inspectoratul Teritorial de Muncă Hunedoara',
    address: 'Str. Libertății, nr. 1-3, Deva, 330008',
    phone: '0254 211 278',
    email: 'itmhunedoara@itmhd.ro',
    website: 'https://www.itmhd.ro',
    jurisdiction: ['Hunedoara']
  },
  {
    id: 'IL',
    county: 'Ialomița',
    name: 'Inspectoratul Teritorial de Muncă Ialomița',
    address: 'Str. Matei Basarab, nr. 100, Slobozia, 920025',
    phone: '0243 230 303',
    email: 'itmialomita@itmialomita.ro',
    website: 'https://www.itmialomita.ro',
    jurisdiction: ['Ialomița']
  },
  {
    id: 'IS',
    county: 'Iași',
    name: 'Inspectoratul Teritorial de Muncă Iași',
    address: 'B-dul Tudor Vladimirescu, nr. 2A, Iași, 700310',
    phone: '0232 213 313',
    email: 'itmiasi@itmiasi.ro',
    website: 'https://www.itmiasi.ro',
    jurisdiction: ['Iași']
  },
  {
    id: 'MM',
    county: 'Maramureș',
    name: 'Inspectoratul Teritorial de Muncă Maramureș',
    address: 'Str. Someșului, nr. 22-24, Baia Mare, 430313',
    phone: '0262 221 717',
    email: 'itmmaramures@itmmaramures.ro',
    website: 'https://www.itmmaramures.ro',
    jurisdiction: ['Maramureș']
  },
  {
    id: 'MH',
    county: 'Mehedinți',
    name: 'Inspectoratul Teritorial de Muncă Mehedinți',
    address: 'Str. Orly, nr. 12, Drobeta-Turnu Severin, 220114',
    phone: '0252 325 646',
    email: 'itmmehedinti@itmmehedinti.ro',
    website: 'https://www.itmmehedinti.ro',
    jurisdiction: ['Mehedinți']
  },
  {
    id: 'MS',
    county: 'Mureș',
    name: 'Inspectoratul Teritorial de Muncă Mureș',
    address: 'Str. Primăriei, nr. 2, Târgu Mureș, 540073',
    phone: '0265 268 421',
    email: 'itmmures@itmmures.ro',
    website: 'https://www.itmmures.ro',
    jurisdiction: ['Mureș']
  },
  {
    id: 'NT',
    county: 'Neamț',
    name: 'Inspectoratul Teritorial de Muncă Neamț',
    address: 'Str. Ștefan cel Mare, nr. 3, Piatra Neamț, 610101',
    phone: '0233 212 727',
    email: 'itmneamt@itmneamt.ro',
    website: 'https://www.itmneamt.ro',
    jurisdiction: ['Neamț']
  },
  {
    id: 'OT',
    county: 'Olt',
    name: 'Inspectoratul Teritorial de Muncă Olt',
    address: 'Str. Nicolae Bălcescu, nr. 24, Slatina, 230025',
    phone: '0249 434 040',
    email: 'itmolt@itmolt.ro',
    website: 'https://www.itmolt.ro',
    jurisdiction: ['Olt']
  },
  {
    id: 'PH',
    county: 'Prahova',
    name: 'Inspectoratul Teritorial de Muncă Prahova',
    address: 'Str. Gh. Doja, nr. 93, Ploiești, 100308',
    phone: '0244 542 020',
    email: 'itmprahova@itmprahova.ro',
    website: 'https://www.itmprahova.ro',
    jurisdiction: ['Prahova']
  },
  {
    id: 'SM',
    county: 'Satu Mare',
    name: 'Inspectoratul Teritorial de Muncă Satu Mare',
    address: 'Str. Mircea cel Bătrân, nr. 16, Satu Mare, 440012',
    phone: '0261 768 500',
    email: 'itmsatumare@itmsatumare.ro',
    website: 'https://www.itmsatumare.ro',
    jurisdiction: ['Satu Mare']
  },
  {
    id: 'SJ',
    county: 'Sălaj',
    name: 'Inspectoratul Teritorial de Muncă Sălaj',
    address: 'Str. Corneliu Coposu, nr. 3, Zalău, 450057',
    phone: '0260 613 141',
    email: 'itmsalaj@itmsalaj.ro',
    website: 'https://www.itmsalaj.ro',
    jurisdiction: ['Sălaj']
  },
  {
    id: 'SB',
    county: 'Sibiu',
    name: 'Inspectoratul Teritorial de Muncă Sibiu',
    address: 'Str. General Magheru, nr. 35, Sibiu, 550185',
    phone: '0269 210 803',
    email: 'itmsibiu@itmsibiu.ro',
    website: 'https://www.itmsibiu.ro',
    jurisdiction: ['Sibiu']
  },
  {
    id: 'SV',
    county: 'Suceava',
    name: 'Inspectoratul Teritorial de Muncă Suceava',
    address: 'Str. Universității, nr. 10, Suceava, 720229',
    phone: '0230 520 590',
    email: 'itmsuceava@itmsuceava.ro',
    website: 'https://www.itmsuceava.ro',
    jurisdiction: ['Suceava']
  },
  {
    id: 'TR',
    county: 'Teleorman',
    name: 'Inspectoratul Teritorial de Muncă Teleorman',
    address: 'Str. Dunării, nr. 111, Alexandria, 140033',
    phone: '0247 311 818',
    email: 'itmteleorman@itmteleorman.ro',
    website: 'https://www.itmteleorman.ro',
    jurisdiction: ['Teleorman']
  },
  {
    id: 'TM',
    county: 'Timiș',
    name: 'Inspectoratul Teritorial de Muncă Timiș',
    address: 'Str. Gib Mihăescu, nr. 7, Timișoara, 300016',
    phone: '0256 491 800',
    email: 'itmtimis@itmtimis.ro',
    website: 'https://www.itmtimis.ro',
    jurisdiction: ['Timiș']
  },
  {
    id: 'TL',
    county: 'Tulcea',
    name: 'Inspectoratul Teritorial de Muncă Tulcea',
    address: 'Str. Babadag, nr. 30, Tulcea, 820009',
    phone: '0240 513 030',
    email: 'itmtulcea@itmtulcea.ro',
    website: 'https://www.itmtulcea.ro',
    jurisdiction: ['Tulcea']
  },
  {
    id: 'VS',
    county: 'Vaslui',
    name: 'Inspectoratul Teritorial de Muncă Vaslui',
    address: 'Str. Ștefan cel Mare, nr. 203, Vaslui, 730084',
    phone: '0235 313 030',
    email: 'itmvaslui@itmvaslui.ro',
    website: 'https://www.itmvaslui.ro',
    jurisdiction: ['Vaslui']
  },
  {
    id: 'VL',
    county: 'Vâlcea',
    name: 'Inspectoratul Teritorial de Muncă Vâlcea',
    address: 'Str. General Praporgescu, nr. 2, Râmnicu Vâlcea, 240050',
    phone: '0250 734 040',
    email: 'itmvalcea@itmvalcea.ro',
    website: 'https://www.itmvalcea.ro',
    jurisdiction: ['Vâlcea']
  },
  {
    id: 'VN',
    county: 'Vrancea',
    name: 'Inspectoratul Teritorial de Muncă Vrancea',
    address: 'Str. Mihail Kogălniceanu, nr. 1, Focșani, 620094',
    phone: '0237 230 390',
    email: 'itmvrancea@itmvrancea.ro',
    website: 'https://www.itmvrancea.ro',
    jurisdiction: ['Vrancea']
  },
  {
    id: 'IF',
    county: 'Ilfov',
    name: 'Inspectoratul Teritorial de Muncă al Municipiului București',
    address: 'Str. Avrig, nr. 8-10, Sector 2, București, 020281',
    phone: '021 209 6700',
    email: 'office@itmbucuresti.ro',
    website: 'https://www.itmbucuresti.ro',
    jurisdiction: ['București', 'Ilfov']
  }
];

/**
 * Helper function to find ITM office by county code
 */
export function getITMOfficeByCounty(countyCode: string): ITMOffice | undefined {
  return itmOffices.find(office => office.id === countyCode.toUpperCase());
}

/**
 * Helper function to get all ITM offices sorted by county name
 */
export function getAllITMOfficesSorted(): ITMOffice[] {
  return [...itmOffices].sort((a, b) => a.county.localeCompare(b.county, 'ro'));
}

/**
 * Helper function to search ITM offices by county name or city
 */
export function searchITMOffices(searchTerm: string): ITMOffice[] {
  const term = searchTerm.toLowerCase();
  return itmOffices.filter(office =>
    office.county.toLowerCase().includes(term) ||
    office.name.toLowerCase().includes(term) ||
    office.address.toLowerCase().includes(term)
  );
}
