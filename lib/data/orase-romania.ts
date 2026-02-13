/**
 * Top 50 orașe din România după populație
 * Date actualizate conform recensământului 2021
 */

export interface City {
  id: number;
  name: string;
  county: string;
  population: number;
  postalCodePrefix: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const romanianCities: City[] = [
  {
    id: 1,
    name: "București",
    county: "București",
    population: 1716961,
    postalCodePrefix: "0",
    coordinates: { lat: 44.4268, lng: 26.1025 }
  },
  {
    id: 2,
    name: "Cluj-Napoca",
    county: "Cluj",
    population: 286598,
    postalCodePrefix: "400",
    coordinates: { lat: 46.7712, lng: 23.6236 }
  },
  {
    id: 3,
    name: "Timișoara",
    county: "Timiș",
    population: 250849,
    postalCodePrefix: "300",
    coordinates: { lat: 45.7489, lng: 21.2087 }
  },
  {
    id: 4,
    name: "Iași",
    county: "Iași",
    population: 271692,
    postalCodePrefix: "700",
    coordinates: { lat: 47.1585, lng: 27.6014 }
  },
  {
    id: 5,
    name: "Constanța",
    county: "Constanța",
    population: 263707,
    postalCodePrefix: "900",
    coordinates: { lat: 44.1598, lng: 28.6348 }
  },
  {
    id: 6,
    name: "Craiova",
    county: "Dolj",
    population: 234140,
    postalCodePrefix: "200",
    coordinates: { lat: 44.3302, lng: 23.7949 }
  },
  {
    id: 7,
    name: "Brașov",
    county: "Brașov",
    population: 237589,
    postalCodePrefix: "500",
    coordinates: { lat: 45.6427, lng: 25.5887 }
  },
  {
    id: 8,
    name: "Galați",
    county: "Galați",
    population: 217851,
    postalCodePrefix: "800",
    coordinates: { lat: 45.4353, lng: 28.0080 }
  },
  {
    id: 9,
    name: "Ploiești",
    county: "Prahova",
    population: 180540,
    postalCodePrefix: "100",
    coordinates: { lat: 44.9406, lng: 26.0230 }
  },
  {
    id: 10,
    name: "Oradea",
    county: "Bihor",
    population: 183105,
    postalCodePrefix: "410",
    coordinates: { lat: 47.0465, lng: 21.9189 }
  },
  {
    id: 11,
    name: "Brăila",
    county: "Brăila",
    population: 154686,
    postalCodePrefix: "810",
    coordinates: { lat: 45.2692, lng: 27.9575 }
  },
  {
    id: 12,
    name: "Arad",
    county: "Arad",
    population: 145078,
    postalCodePrefix: "310",
    coordinates: { lat: 46.1865, lng: 21.3123 }
  },
  {
    id: 13,
    name: "Pitești",
    county: "Argeș",
    population: 141275,
    postalCodePrefix: "110",
    coordinates: { lat: 44.8565, lng: 24.8692 }
  },
  {
    id: 14,
    name: "Sibiu",
    county: "Sibiu",
    population: 134308,
    postalCodePrefix: "550",
    coordinates: { lat: 45.7983, lng: 24.1256 }
  },
  {
    id: 15,
    name: "Bacău",
    county: "Bacău",
    population: 144307,
    postalCodePrefix: "600",
    coordinates: { lat: 46.5670, lng: 26.9146 }
  },
  {
    id: 16,
    name: "Târgu Mureș",
    county: "Mureș",
    population: 116033,
    postalCodePrefix: "540",
    coordinates: { lat: 46.5423, lng: 24.5574 }
  },
  {
    id: 17,
    name: "Baia Mare",
    county: "Maramureș",
    population: 108759,
    postalCodePrefix: "430",
    coordinates: { lat: 47.6567, lng: 23.5678 }
  },
  {
    id: 18,
    name: "Buzău",
    county: "Buzău",
    population: 115494,
    postalCodePrefix: "120",
    coordinates: { lat: 45.1500, lng: 26.8167 }
  },
  {
    id: 19,
    name: "Botoșani",
    county: "Botoșani",
    population: 106847,
    postalCodePrefix: "710",
    coordinates: { lat: 47.7486, lng: 26.6581 }
  },
  {
    id: 20,
    name: "Satu Mare",
    county: "Satu Mare",
    population: 102441,
    postalCodePrefix: "440",
    coordinates: { lat: 47.7914, lng: 22.8853 }
  },
  {
    id: 21,
    name: "Râmnicu Vâlcea",
    county: "Vâlcea",
    population: 90193,
    postalCodePrefix: "240",
    coordinates: { lat: 45.1000, lng: 24.3667 }
  },
  {
    id: 22,
    name: "Suceava",
    county: "Suceava",
    population: 84308,
    postalCodePrefix: "720",
    coordinates: { lat: 47.6514, lng: 26.2542 }
  },
  {
    id: 23,
    name: "Piatra Neamț",
    county: "Neamț",
    population: 76729,
    postalCodePrefix: "610",
    coordinates: { lat: 46.9333, lng: 26.3667 }
  },
  {
    id: 24,
    name: "Drobeta-Turnu Severin",
    county: "Mehedinți",
    population: 77893,
    postalCodePrefix: "220",
    coordinates: { lat: 44.6316, lng: 22.6561 }
  },
  {
    id: 25,
    name: "Focșani",
    county: "Vrancea",
    population: 72763,
    postalCodePrefix: "620",
    coordinates: { lat: 45.6942, lng: 27.1833 }
  },
  {
    id: 26,
    name: "Târgoviște",
    county: "Dâmbovița",
    population: 73329,
    postalCodePrefix: "130",
    coordinates: { lat: 44.9333, lng: 25.4500 }
  },
  {
    id: 27,
    name: "Târgu Jiu",
    county: "Gorj",
    population: 71532,
    postalCodePrefix: "210",
    coordinates: { lat: 45.0333, lng: 23.2667 }
  },
  {
    id: 28,
    name: "Tulcea",
    county: "Tulcea",
    population: 65624,
    postalCodePrefix: "820",
    coordinates: { lat: 45.1667, lng: 28.8000 }
  },
  {
    id: 29,
    name: "Bistrița",
    county: "Bistrița-Năsăud",
    population: 69470,
    postalCodePrefix: "420",
    coordinates: { lat: 47.1333, lng: 24.5000 }
  },
  {
    id: 30,
    name: "Reșița",
    county: "Caraș-Severin",
    population: 63333,
    postalCodePrefix: "320",
    coordinates: { lat: 45.3000, lng: 21.8833 }
  },
  {
    id: 31,
    name: "Slatina",
    county: "Olt",
    population: 63487,
    postalCodePrefix: "230",
    coordinates: { lat: 44.4333, lng: 24.3667 }
  },
  {
    id: 32,
    name: "Călărași",
    county: "Călărași",
    population: 58350,
    postalCodePrefix: "910",
    coordinates: { lat: 44.2000, lng: 27.3333 }
  },
  {
    id: 33,
    name: "Giurgiu",
    county: "Giurgiu",
    population: 52403,
    postalCodePrefix: "080",
    coordinates: { lat: 43.9000, lng: 25.9667 }
  },
  {
    id: 34,
    name: "Deva",
    county: "Hunedoara",
    population: 56647,
    postalCodePrefix: "330",
    coordinates: { lat: 45.8833, lng: 22.9000 }
  },
  {
    id: 35,
    name: "Hunedoara",
    county: "Hunedoara",
    population: 56691,
    postalCodePrefix: "331",
    coordinates: { lat: 45.7500, lng: 22.9000 }
  },
  {
    id: 36,
    name: "Zalău",
    county: "Sălaj",
    population: 54321,
    postalCodePrefix: "450",
    coordinates: { lat: 47.2000, lng: 23.0500 }
  },
  {
    id: 37,
    name: "Alba Iulia",
    county: "Alba",
    population: 63536,
    postalCodePrefix: "510",
    coordinates: { lat: 46.0667, lng: 23.5667 }
  },
  {
    id: 38,
    name: "Mediaș",
    county: "Sibiu",
    population: 47204,
    postalCodePrefix: "551",
    coordinates: { lat: 46.1667, lng: 24.3500 }
  },
  {
    id: 39,
    name: "Vaslui",
    county: "Vaslui",
    population: 55407,
    postalCodePrefix: "730",
    coordinates: { lat: 46.6333, lng: 27.7333 }
  },
  {
    id: 40,
    name: "Roman",
    county: "Neamț",
    population: 50713,
    postalCodePrefix: "611",
    coordinates: { lat: 46.9167, lng: 26.9167 }
  },
  {
    id: 41,
    name: "Turda",
    county: "Cluj",
    population: 47744,
    postalCodePrefix: "401",
    coordinates: { lat: 46.5667, lng: 23.7833 }
  },
  {
    id: 42,
    name: "Slobozia",
    county: "Ialomița",
    population: 45891,
    postalCodePrefix: "920",
    coordinates: { lat: 44.5667, lng: 27.3667 }
  },
  {
    id: 43,
    name: "Miercurea Ciuc",
    county: "Harghita",
    population: 34866,
    postalCodePrefix: "530",
    coordinates: { lat: 46.3586, lng: 25.8042 }
  },
  {
    id: 44,
    name: "Petroșani",
    county: "Hunedoara",
    population: 32262,
    postalCodePrefix: "332",
    coordinates: { lat: 45.4167, lng: 23.3667 }
  },
  {
    id: 45,
    name: "Sfântu Gheorghe",
    county: "Covasna",
    population: 48759,
    postalCodePrefix: "520",
    coordinates: { lat: 45.8667, lng: 25.7833 }
  },
  {
    id: 46,
    name: "Mangalia",
    county: "Constanța",
    population: 36364,
    postalCodePrefix: "905",
    coordinates: { lat: 43.8167, lng: 28.5833 }
  },
  {
    id: 47,
    name: "Tecuci",
    county: "Galați",
    population: 34871,
    postalCodePrefix: "805",
    coordinates: { lat: 45.8500, lng: 27.4333 }
  },
  {
    id: 48,
    name: "Onești",
    county: "Bacău",
    population: 44153,
    postalCodePrefix: "601",
    coordinates: { lat: 46.2500, lng: 26.7500 }
  },
  {
    id: 49,
    name: "Pașcani",
    county: "Iași",
    population: 33745,
    postalCodePrefix: "705",
    coordinates: { lat: 47.2500, lng: 26.7167 }
  },
  {
    id: 50,
    name: "Alexandria",
    county: "Teleorman",
    population: 38839,
    postalCodePrefix: "140",
    coordinates: { lat: 43.9833, lng: 25.3333 }
  }
];

/**
 * Obține orașele după județ
 */
export function getCitiesByCounty(county: string): City[] {
  return romanianCities.filter(city => city.county === county);
}

/**
 * Obține orașele după prefix cod poștal
 */
export function getCitiesByPostalPrefix(prefix: string): City[] {
  return romanianCities.filter(city => city.postalCodePrefix.startsWith(prefix));
}

/**
 * Caută orașe după nume (case-insensitive, partial match)
 */
export function searchCitiesByName(query: string): City[] {
  const normalizedQuery = query.toLowerCase();
  return romanianCities.filter(city =>
    city.name.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Obține oraș după ID
 */
export function getCityById(id: number): City | undefined {
  return romanianCities.find(city => city.id === id);
}
