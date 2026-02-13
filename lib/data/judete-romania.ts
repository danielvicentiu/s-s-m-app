/**
 * Complete list of Romanian counties (județe) and Bucharest
 * Data includes: code, name, capital city, population, area, and region
 * Source: Official Romanian statistics (2021 census data)
 */

export interface County {
  code: string;
  name: string;
  capitalCity: string;
  population: number;
  area: number; // km²
  region: string;
}

export const JUDETE_ROMANIA: County[] = [
  {
    code: 'AB',
    name: 'Alba',
    capitalCity: 'Alba Iulia',
    population: 332042,
    area: 6242,
    region: 'Transilvania'
  },
  {
    code: 'AG',
    name: 'Argeș',
    capitalCity: 'Pitești',
    population: 592062,
    area: 6826,
    region: 'Muntenia'
  },
  {
    code: 'AR',
    name: 'Arad',
    capitalCity: 'Arad',
    population: 418184,
    area: 7754,
    region: 'Crișana'
  },
  {
    code: 'B',
    name: 'București',
    capitalCity: 'București',
    population: 1716983,
    area: 228,
    region: 'Muntenia'
  },
  {
    code: 'BC',
    name: 'Bacău',
    capitalCity: 'Bacău',
    population: 616168,
    area: 6621,
    region: 'Moldova'
  },
  {
    code: 'BH',
    name: 'Bihor',
    capitalCity: 'Oradea',
    population: 575398,
    area: 7544,
    region: 'Crișana'
  },
  {
    code: 'BN',
    name: 'Bistrița-Năsăud',
    capitalCity: 'Bistrița',
    population: 286225,
    area: 5355,
    region: 'Transilvania'
  },
  {
    code: 'BR',
    name: 'Brăila',
    capitalCity: 'Brăila',
    population: 299902,
    area: 4766,
    region: 'Muntenia'
  },
  {
    code: 'BT',
    name: 'Botoșani',
    capitalCity: 'Botoșani',
    population: 408858,
    area: 4986,
    region: 'Moldova'
  },
  {
    code: 'BV',
    name: 'Brașov',
    capitalCity: 'Brașov',
    population: 546615,
    area: 5363,
    region: 'Transilvania'
  },
  {
    code: 'BZ',
    name: 'Buzău',
    capitalCity: 'Buzău',
    population: 432054,
    area: 6103,
    region: 'Muntenia'
  },
  {
    code: 'CJ',
    name: 'Cluj',
    capitalCity: 'Cluj-Napoca',
    population: 691106,
    area: 6674,
    region: 'Transilvania'
  },
  {
    code: 'CL',
    name: 'Călărași',
    capitalCity: 'Călărași',
    population: 270076,
    area: 5088,
    region: 'Muntenia'
  },
  {
    code: 'CS',
    name: 'Caraș-Severin',
    capitalCity: 'Reșița',
    population: 283345,
    area: 8520,
    region: 'Banat'
  },
  {
    code: 'CT',
    name: 'Constanța',
    capitalCity: 'Constanța',
    population: 655997,
    area: 7071,
    region: 'Dobrogea'
  },
  {
    code: 'CV',
    name: 'Covasna',
    capitalCity: 'Sfântu Gheorghe',
    population: 206404,
    area: 3710,
    region: 'Transilvania'
  },
  {
    code: 'DB',
    name: 'Dâmbovița',
    capitalCity: 'Târgoviște',
    population: 504852,
    area: 4054,
    region: 'Muntenia'
  },
  {
    code: 'DJ',
    name: 'Dolj',
    capitalCity: 'Craiova',
    population: 660544,
    area: 7414,
    region: 'Oltenia'
  },
  {
    code: 'GJ',
    name: 'Gorj',
    capitalCity: 'Târgu Jiu',
    population: 334238,
    area: 5602,
    region: 'Oltenia'
  },
  {
    code: 'GL',
    name: 'Galați',
    capitalCity: 'Galați',
    population: 536167,
    area: 4466,
    region: 'Moldova'
  },
  {
    code: 'GR',
    name: 'Giurgiu',
    capitalCity: 'Giurgiu',
    population: 255368,
    area: 3526,
    region: 'Muntenia'
  },
  {
    code: 'HD',
    name: 'Hunedoara',
    capitalCity: 'Deva',
    population: 418565,
    area: 7063,
    region: 'Transilvania'
  },
  {
    code: 'HR',
    name: 'Harghita',
    capitalCity: 'Miercurea Ciuc',
    population: 310867,
    area: 6639,
    region: 'Transilvania'
  },
  {
    code: 'IF',
    name: 'Ilfov',
    capitalCity: 'Buftea',
    population: 542686,
    area: 1583,
    region: 'Muntenia'
  },
  {
    code: 'IL',
    name: 'Ialomița',
    capitalCity: 'Slobozia',
    population: 258312,
    area: 4453,
    region: 'Muntenia'
  },
  {
    code: 'IS',
    name: 'Iași',
    capitalCity: 'Iași',
    population: 772348,
    area: 5476,
    region: 'Moldova'
  },
  {
    code: 'MH',
    name: 'Mehedinți',
    capitalCity: 'Drobeta-Turnu Severin',
    population: 265390,
    area: 4933,
    region: 'Oltenia'
  },
  {
    code: 'MM',
    name: 'Maramureș',
    capitalCity: 'Baia Mare',
    population: 478659,
    area: 6304,
    region: 'Maramureș'
  },
  {
    code: 'MS',
    name: 'Mureș',
    capitalCity: 'Târgu Mureș',
    population: 550846,
    area: 6714,
    region: 'Transilvania'
  },
  {
    code: 'NT',
    name: 'Neamț',
    capitalCity: 'Piatra Neamț',
    population: 470766,
    area: 5896,
    region: 'Moldova'
  },
  {
    code: 'OT',
    name: 'Olt',
    capitalCity: 'Slatina',
    population: 415530,
    area: 5498,
    region: 'Oltenia'
  },
  {
    code: 'PH',
    name: 'Prahova',
    capitalCity: 'Ploiești',
    population: 762886,
    area: 4716,
    region: 'Muntenia'
  },
  {
    code: 'SB',
    name: 'Sibiu',
    capitalCity: 'Sibiu',
    population: 397322,
    area: 5432,
    region: 'Transilvania'
  },
  {
    code: 'SJ',
    name: 'Sălaj',
    capitalCity: 'Zalău',
    population: 224384,
    area: 3864,
    region: 'Transilvania'
  },
  {
    code: 'SM',
    name: 'Satu Mare',
    capitalCity: 'Satu Mare',
    population: 344360,
    area: 4418,
    region: 'Crișana'
  },
  {
    code: 'SV',
    name: 'Suceava',
    capitalCity: 'Suceava',
    population: 626414,
    area: 8553,
    region: 'Moldova'
  },
  {
    code: 'TL',
    name: 'Tulcea',
    capitalCity: 'Tulcea',
    population: 201729,
    area: 8499,
    region: 'Dobrogea'
  },
  {
    code: 'TM',
    name: 'Timiș',
    capitalCity: 'Timișoara',
    population: 683540,
    area: 8697,
    region: 'Banat'
  },
  {
    code: 'TR',
    name: 'Teleorman',
    capitalCity: 'Alexandria',
    population: 355689,
    area: 5790,
    region: 'Muntenia'
  },
  {
    code: 'VL',
    name: 'Vâlcea',
    capitalCity: 'Râmnicu Vâlcea',
    population: 371714,
    area: 5765,
    region: 'Oltenia'
  },
  {
    code: 'VN',
    name: 'Vrancea',
    capitalCity: 'Focșani',
    population: 340310,
    area: 4857,
    region: 'Moldova'
  },
  {
    code: 'VS',
    name: 'Vaslui',
    capitalCity: 'Vaslui',
    population: 395499,
    area: 5318,
    region: 'Moldova'
  }
];

/**
 * Get county by code
 */
export function getCountyByCode(code: string): County | undefined {
  return JUDETE_ROMANIA.find(county => county.code === code);
}

/**
 * Get counties by region
 */
export function getCountiesByRegion(region: string): County[] {
  return JUDETE_ROMANIA.filter(county => county.region === region);
}

/**
 * Get all unique regions
 */
export function getRegions(): string[] {
  return Array.from(new Set(JUDETE_ROMANIA.map(county => county.region))).sort();
}

/**
 * Get total population of Romania
 */
export function getTotalPopulation(): number {
  return JUDETE_ROMANIA.reduce((sum, county) => sum + county.population, 0);
}

/**
 * Get total area of Romania
 */
export function getTotalArea(): number {
  return JUDETE_ROMANIA.reduce((sum, county) => sum + county.area, 0);
}
