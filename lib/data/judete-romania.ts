/**
 * Date complete despre județele României
 * Include informații despre ITM (Inspectoratul Teritorial de Muncă)
 */

export interface Judet {
  code: string;
  name: string;
  region: string;
  capitalCity: string;
  population: number;
  itm_phone: string;
  itm_email: string;
  itm_address: string;
}

export const JUDETE_ROMANIA: Judet[] = [
  {
    code: 'AB',
    name: 'Alba',
    region: 'Transilvania',
    capitalCity: 'Alba Iulia',
    population: 342376,
    itm_phone: '0258 811 212',
    itm_email: 'office@itmalbaiulia.ro',
    itm_address: 'Str. Republicii nr. 1, Alba Iulia, 510009'
  },
  {
    code: 'AR',
    name: 'Arad',
    region: 'Banat',
    capitalCity: 'Arad',
    population: 430629,
    itm_phone: '0257 280 596',
    itm_email: 'itm@itmarad.ro',
    itm_address: 'Bd. Revoluției nr. 75, Arad, 310130'
  },
  {
    code: 'AG',
    name: 'Argeș',
    region: 'Muntenia',
    capitalCity: 'Pitești',
    population: 612431,
    itm_phone: '0248 219 898',
    itm_email: 'office@itmarges.ro',
    itm_address: 'Str. Victoriei nr. 26, Pitești, 110017'
  },
  {
    code: 'BC',
    name: 'Bacău',
    region: 'Moldova',
    capitalCity: 'Bacău',
    population: 616168,
    itm_phone: '0234 513 980',
    itm_email: 'itmbacau@itmbacau.ro',
    itm_address: 'Str. Pieței nr. 9, Bacău, 600017'
  },
  {
    code: 'BH',
    name: 'Bihor',
    region: 'Crișana',
    capitalCity: 'Oradea',
    population: 575398,
    itm_phone: '0259 432 294',
    itm_email: 'itm@itmbihor.ro',
    itm_address: 'Str. Aurel Lazăr nr. 94-96, Oradea, 410338'
  },
  {
    code: 'BN',
    name: 'Bistrița-Năsăud',
    region: 'Transilvania',
    capitalCity: 'Bistrița',
    population: 286225,
    itm_phone: '0263 234 217',
    itm_email: 'itmbistrita@itmbistrita.ro',
    itm_address: 'Str. Piața Petru Rareș nr. 1, Bistrița, 420008'
  },
  {
    code: 'BT',
    name: 'Botoșani',
    region: 'Moldova',
    capitalCity: 'Botoșani',
    population: 412626,
    itm_phone: '0231 531 556',
    itm_email: 'office@itmbotosani.ro',
    itm_address: 'Str. Calea Națională nr. 31, Botoșani, 710067'
  },
  {
    code: 'BV',
    name: 'Brașov',
    region: 'Transilvania',
    capitalCity: 'Brașov',
    population: 549217,
    itm_phone: '0268 407 107',
    itm_email: 'office@itmbrasov.ro',
    itm_address: 'Str. Long nr. 2, Brașov, 500025'
  },
  {
    code: 'BR',
    name: 'Brăila',
    region: 'Muntenia',
    capitalCity: 'Brăila',
    population: 321212,
    itm_phone: '0239 613 406',
    itm_email: 'itm@itmbraila.ro',
    itm_address: 'Str. Împăratul Traian nr. 243, Brăila, 810153'
  },
  {
    code: 'B',
    name: 'București',
    region: 'Muntenia',
    capitalCity: 'București',
    population: 1883425,
    itm_phone: '021 650 2600',
    itm_email: 'itm@itmbucuresti.ro',
    itm_address: 'Str. Știrbei Vodă nr. 7-9, Sector 1, București, 010111'
  },
  {
    code: 'BZ',
    name: 'Buzău',
    region: 'Muntenia',
    capitalCity: 'Buzău',
    population: 451069,
    itm_phone: '0238 710 177',
    itm_email: 'office@itmbuzau.ro',
    itm_address: 'Str. Unirii nr. 160, Buzău, 120227'
  },
  {
    code: 'CS',
    name: 'Caraș-Severin',
    region: 'Banat',
    capitalCity: 'Reșița',
    population: 295579,
    itm_phone: '0255 221 328',
    itm_email: 'itmcs@itmcarasseverin.ro',
    itm_address: 'Bd. Revoluția din Decembrie nr. 46-48, Reșița, 320097'
  },
  {
    code: 'CL',
    name: 'Călărași',
    region: 'Muntenia',
    capitalCity: 'Călărași',
    population: 306691,
    itm_phone: '0242 331 954',
    itm_email: 'office@itmcalarasi.ro',
    itm_address: 'Bd. 1 Decembrie 1918 nr. 1, Călărași, 910039'
  },
  {
    code: 'CJ',
    name: 'Cluj',
    region: 'Transilvania',
    capitalCity: 'Cluj-Napoca',
    population: 691106,
    itm_phone: '0264 418 973',
    itm_email: 'office@itmcluj.ro',
    itm_address: 'Str. Traian Vuia nr. 45, Cluj-Napoca, 400397'
  },
  {
    code: 'CT',
    name: 'Constanța',
    region: 'Dobrogea',
    capitalCity: 'Constanța',
    population: 684082,
    itm_phone: '0241 618 620',
    itm_email: 'office@itmconstanta.ro',
    itm_address: 'Bd. Tomis nr. 295, Constanța, 900178'
  },
  {
    code: 'CV',
    name: 'Covasna',
    region: 'Transilvania',
    capitalCity: 'Sfântu Gheorghe',
    population: 210177,
    itm_phone: '0267 351 076',
    itm_email: 'itm@itmcovasna.ro',
    itm_address: 'Str. Gábor Áron nr. 36, Sfântu Gheorghe, 520008'
  },
  {
    code: 'DB',
    name: 'Dâmbovița',
    region: 'Muntenia',
    capitalCity: 'Târgoviște',
    population: 518745,
    itm_phone: '0245 206 906',
    itm_email: 'office@itmdambovita.ro',
    itm_address: 'Bd. Independenței nr. 42, Târgoviște, 130029'
  },
  {
    code: 'DJ',
    name: 'Dolj',
    region: 'Oltenia',
    capitalCity: 'Craiova',
    population: 660544,
    itm_phone: '0251 414 242',
    itm_email: 'itm@itmdolj.ro',
    itm_address: 'Str. Brestei nr. 116A, Craiova, 200690'
  },
  {
    code: 'GL',
    name: 'Galați',
    region: 'Moldova',
    capitalCity: 'Galați',
    population: 536167,
    itm_phone: '0236 460 158',
    itm_email: 'itm@itmgalati.ro',
    itm_address: 'Str. Brăilei nr. 168, Galați, 800320'
  },
  {
    code: 'GR',
    name: 'Giurgiu',
    region: 'Muntenia',
    capitalCity: 'Giurgiu',
    population: 281422,
    itm_phone: '0246 213 696',
    itm_email: 'itm@itmgiurgiu.ro',
    itm_address: 'Str. Portului nr. 42, Giurgiu, 080065'
  },
  {
    code: 'GJ',
    name: 'Gorj',
    region: 'Oltenia',
    capitalCity: 'Târgu Jiu',
    population: 341594,
    itm_phone: '0253 214 747',
    itm_email: 'office@itmgorj.ro',
    itm_address: 'Str. Tudor Vladimirescu nr. 83, Târgu Jiu, 210136'
  },
  {
    code: 'HR',
    name: 'Harghita',
    region: 'Transilvania',
    capitalCity: 'Miercurea Ciuc',
    population: 310867,
    itm_phone: '0266 207 840',
    itm_email: 'itm@itmharghita.ro',
    itm_address: 'Str. Márton Áron nr. 44, Miercurea Ciuc, 530140'
  },
  {
    code: 'HD',
    name: 'Hunedoara',
    region: 'Transilvania',
    capitalCity: 'Deva',
    population: 418565,
    itm_phone: '0254 211 363',
    itm_email: 'office@itmhunedoara.ro',
    itm_address: 'Str. 1 Decembrie 1918 nr. 24, Deva, 330018'
  },
  {
    code: 'IL',
    name: 'Ialomița',
    region: 'Muntenia',
    capitalCity: 'Slobozia',
    population: 274148,
    itm_phone: '0243 230 464',
    itm_email: 'office@itmialomita.ro',
    itm_address: 'Bd. Matei Basarab nr. 93, Slobozia, 920037'
  },
  {
    code: 'IS',
    name: 'Iași',
    region: 'Moldova',
    capitalCity: 'Iași',
    population: 772348,
    itm_phone: '0232 213 570',
    itm_email: 'office@itmiasi.ro',
    itm_address: 'Str. Sf. Lazar nr. 2-4, Iași, 700045'
  },
  {
    code: 'IF',
    name: 'Ilfov',
    region: 'Muntenia',
    capitalCity: 'București',
    population: 388738,
    itm_phone: '021 350 3013',
    itm_email: 'itmilfov@itmilfov.ro',
    itm_address: 'Șos. București-Ploiești nr. 7-9, Voluntari, 077190'
  },
  {
    code: 'MM',
    name: 'Maramureș',
    region: 'Transilvania',
    capitalCity: 'Baia Mare',
    population: 478659,
    itm_phone: '0262 212 567',
    itm_email: 'itm@itmmaramures.ro',
    itm_address: 'Str. Someșului nr. 22, Baia Mare, 430293'
  },
  {
    code: 'MH',
    name: 'Mehedinți',
    region: 'Oltenia',
    capitalCity: 'Drobeta-Turnu Severin',
    population: 265390,
    itm_phone: '0252 325 492',
    itm_email: 'office@itmmehedinti.ro',
    itm_address: 'Str. Theodor Costescu nr. 2, Drobeta-Turnu Severin, 220113'
  },
  {
    code: 'MS',
    name: 'Mureș',
    region: 'Transilvania',
    capitalCity: 'Târgu Mureș',
    population: 550846,
    itm_phone: '0265 260 949',
    itm_email: 'office@itmmures.ro',
    itm_address: 'Str. Gheorghe Doja nr. 115, Târgu Mureș, 540343'
  },
  {
    code: 'NT',
    name: 'Neamț',
    region: 'Moldova',
    capitalCity: 'Piatra Neamț',
    population: 470766,
    itm_phone: '0233 218 181',
    itm_email: 'office@itmneamt.ro',
    itm_address: 'Str. Ștefan cel Mare nr. 8, Piatra Neamț, 610101'
  },
  {
    code: 'OT',
    name: 'Olt',
    region: 'Oltenia',
    capitalCity: 'Slatina',
    population: 436400,
    itm_phone: '0249 434 488',
    itm_email: 'itm@itmolt.ro',
    itm_address: 'Str. Mihail Kogălniceanu nr. 6, Slatina, 230116'
  },
  {
    code: 'PH',
    name: 'Prahova',
    region: 'Muntenia',
    capitalCity: 'Ploiești',
    population: 762886,
    itm_phone: '0244 546 298',
    itm_email: 'office@itmprahova.ro',
    itm_address: 'Bd. Republicii nr. 5-7, Ploiești, 100066'
  },
  {
    code: 'SM',
    name: 'Satu Mare',
    region: 'Crișana',
    capitalCity: 'Satu Mare',
    population: 344360,
    itm_phone: '0261 768 810',
    itm_email: 'itm@itmsatumare.ro',
    itm_address: 'Bd. Vasile Lucaciu nr. 29, Satu Mare, 440026'
  },
  {
    code: 'SJ',
    name: 'Sălaj',
    region: 'Transilvania',
    capitalCity: 'Zalău',
    population: 224384,
    itm_phone: '0260 616 212',
    itm_email: 'office@itmsalaj.ro',
    itm_address: 'Str. Simion Bărnuțiu nr. 23, Zalău, 450042'
  },
  {
    code: 'SB',
    name: 'Sibiu',
    region: 'Transilvania',
    capitalCity: 'Sibiu',
    population: 397322,
    itm_phone: '0269 210 471',
    itm_email: 'itm@itmsibiu.ro',
    itm_address: 'Str. George Barițiu nr. 16, Sibiu, 550178'
  },
  {
    code: 'SV',
    name: 'Suceava',
    region: 'Moldova',
    capitalCity: 'Suceava',
    population: 634810,
    itm_phone: '0230 214 506',
    itm_email: 'office@itmsuceava.ro',
    itm_address: 'Str. Vasile Alecsandri nr. 4, Suceava, 720224'
  },
  {
    code: 'TR',
    name: 'Teleorman',
    region: 'Muntenia',
    capitalCity: 'Alexandria',
    population: 380123,
    itm_phone: '0247 311 806',
    itm_email: 'office@itmteleorman.ro',
    itm_address: 'Str. Dunării nr. 113, Alexandria, 140033'
  },
  {
    code: 'TM',
    name: 'Timiș',
    region: 'Banat',
    capitalCity: 'Timișoara',
    population: 683540,
    itm_phone: '0256 491 801',
    itm_email: 'office@itmtimis.ro',
    itm_address: 'Str. Martir Marius Ciopec nr. 2, Timișoara, 300023'
  },
  {
    code: 'TL',
    name: 'Tulcea',
    region: 'Dobrogea',
    capitalCity: 'Tulcea',
    population: 213083,
    itm_phone: '0240 516 277',
    itm_email: 'office@itmtulcea.ro',
    itm_address: 'Str. Păcii nr. 16, Tulcea, 820009'
  },
  {
    code: 'VS',
    name: 'Vaslui',
    region: 'Moldova',
    capitalCity: 'Vaslui',
    population: 395499,
    itm_phone: '0235 315 155',
    itm_email: 'office@itmvaslui.ro',
    itm_address: 'Str. Ștefan cel Mare nr. 182, Vaslui, 730012'
  },
  {
    code: 'VL',
    name: 'Vâlcea',
    region: 'Oltenia',
    capitalCity: 'Râmnicu Vâlcea',
    population: 371714,
    itm_phone: '0250 740 985',
    itm_email: 'office@itmvalcea.ro',
    itm_address: 'Str. General Praporgescu nr. 7, Râmnicu Vâlcea, 240169'
  },
  {
    code: 'VN',
    name: 'Vrancea',
    region: 'Moldova',
    capitalCity: 'Focșani',
    population: 340310,
    itm_phone: '0237 223 709',
    itm_email: 'office@itmvrancea.ro',
    itm_address: 'Str. Maior Șonțu nr. 2-4, Focșani, 620084'
  }
];

/**
 * Găsește un județ după codul său (AB, AR, AG, etc.)
 * @param code Codul județului (case-insensitive)
 * @returns Obiectul județului sau undefined dacă nu este găsit
 */
export function getJudetByCode(code: string): Judet | undefined {
  return JUDETE_ROMANIA.find(
    judet => judet.code.toLowerCase() === code.toLowerCase()
  );
}

/**
 * Returnează toate județele sortate alfabetic după nume
 */
export function getJudeteAlphabetically(): Judet[] {
  return [...JUDETE_ROMANIA].sort((a, b) => a.name.localeCompare(b.name, 'ro'));
}

/**
 * Returnează județele grupate pe regiuni
 */
export function getJudeteByRegion(): Record<string, Judet[]> {
  return JUDETE_ROMANIA.reduce((acc, judet) => {
    if (!acc[judet.region]) {
      acc[judet.region] = [];
    }
    acc[judet.region].push(judet);
    return acc;
  }, {} as Record<string, Judet[]>);
}

/**
 * Caută județe după nume (partial match)
 */
export function searchJudete(query: string): Judet[] {
  const lowerQuery = query.toLowerCase();
  return JUDETE_ROMANIA.filter(
    judet =>
      judet.name.toLowerCase().includes(lowerQuery) ||
      judet.code.toLowerCase().includes(lowerQuery) ||
      judet.capitalCity.toLowerCase().includes(lowerQuery)
  );
}
