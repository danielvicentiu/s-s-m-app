/**
 * Date administrative România: județe și localități
 * 42 județe + București, organizate pe regiuni
 * Top 10 localități per județ (reședință + 9 orașe mari)
 */

export interface Locality {
  name: string;
  type: 'municipiu' | 'oraș' | 'comună';
  isCapital: boolean;
}

export interface County {
  code: string;
  name: string;
  region: string;
  localities: Locality[];
}

const romaniaAdministrative: County[] = [
  // MUNTENIA
  {
    code: 'AB',
    name: 'Alba',
    region: 'Muntenia',
    localities: [
      { name: 'Alba Iulia', type: 'municipiu', isCapital: true },
      { name: 'Sebeș', type: 'municipiu', isCapital: false },
      { name: 'Blaj', type: 'municipiu', isCapital: false },
      { name: 'Aiud', type: 'municipiu', isCapital: false },
      { name: 'Cugir', type: 'oraș', isCapital: false },
      { name: 'Ocna Mureș', type: 'oraș', isCapital: false },
      { name: 'Câmpeni', type: 'oraș', isCapital: false },
      { name: 'Zlatna', type: 'oraș', isCapital: false },
      { name: 'Abrud', type: 'oraș', isCapital: false },
      { name: 'Teiuș', type: 'oraș', isCapital: false },
    ],
  },
  {
    code: 'AG',
    name: 'Argeș',
    region: 'Muntenia',
    localities: [
      { name: 'Pitești', type: 'municipiu', isCapital: true },
      { name: 'Câmpulung', type: 'municipiu', isCapital: false },
      { name: 'Curtea de Argeș', type: 'municipiu', isCapital: false },
      { name: 'Mioveni', type: 'municipiu', isCapital: false },
      { name: 'Costești', type: 'oraș', isCapital: false },
      { name: 'Ștefănești', type: 'oraș', isCapital: false },
      { name: 'Topoloveni', type: 'oraș', isCapital: false },
      { name: 'Costeștii din Vale', type: 'oraș', isCapital: false },
      { name: 'Vedea', type: 'oraș', isCapital: false },
      { name: 'Bascov', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'B',
    name: 'București',
    region: 'Muntenia',
    localities: [
      { name: 'Sector 1', type: 'municipiu', isCapital: true },
      { name: 'Sector 2', type: 'municipiu', isCapital: false },
      { name: 'Sector 3', type: 'municipiu', isCapital: false },
      { name: 'Sector 4', type: 'municipiu', isCapital: false },
      { name: 'Sector 5', type: 'municipiu', isCapital: false },
      { name: 'Sector 6', type: 'municipiu', isCapital: false },
      { name: 'Pipera', type: 'comună', isCapital: false },
      { name: 'Bragadiru', type: 'oraș', isCapital: false },
      { name: 'Otopeni', type: 'oraș', isCapital: false },
      { name: 'Voluntari', type: 'oraș', isCapital: false },
    ],
  },
  {
    code: 'CL',
    name: 'Călărași',
    region: 'Muntenia',
    localities: [
      { name: 'Călărași', type: 'municipiu', isCapital: true },
      { name: 'Oltenița', type: 'municipiu', isCapital: false },
      { name: 'Lehliu Gară', type: 'oraș', isCapital: false },
      { name: 'Budești', type: 'oraș', isCapital: false },
      { name: 'Fundulea', type: 'oraș', isCapital: false },
      { name: 'Chirnogi', type: 'comună', isCapital: false },
      { name: 'Borcea', type: 'comună', isCapital: false },
      { name: 'Modelu', type: 'comună', isCapital: false },
      { name: 'Independența', type: 'comună', isCapital: false },
      { name: 'Șoldanu', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'DB',
    name: 'Dâmbovița',
    region: 'Muntenia',
    localities: [
      { name: 'Târgoviște', type: 'municipiu', isCapital: true },
      { name: 'Moreni', type: 'municipiu', isCapital: false },
      { name: 'Pucioasa', type: 'oraș', isCapital: false },
      { name: 'Găești', type: 'oraș', isCapital: false },
      { name: 'Titu', type: 'oraș', isCapital: false },
      { name: 'Fieni', type: 'oraș', isCapital: false },
      { name: 'Răcari', type: 'oraș', isCapital: false },
      { name: 'Târgoviște', type: 'oraș', isCapital: false },
      { name: 'Pătârlagele', type: 'oraș', isCapital: false },
      { name: 'Șotânga', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'GR',
    name: 'Giurgiu',
    region: 'Muntenia',
    localities: [
      { name: 'Giurgiu', type: 'municipiu', isCapital: true },
      { name: 'Bolintin-Vale', type: 'oraș', isCapital: false },
      { name: 'Mihăilești', type: 'oraș', isCapital: false },
      { name: 'Videle', type: 'oraș', isCapital: false },
      { name: 'Bolintin Deal', type: 'comună', isCapital: false },
      { name: 'Comana', type: 'comună', isCapital: false },
      { name: 'Găiseni', type: 'comună', isCapital: false },
      { name: 'Adunatii-Copăceni', type: 'comună', isCapital: false },
      { name: 'Singureni', type: 'comună', isCapital: false },
      { name: 'Toporu', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'IF',
    name: 'Ilfov',
    region: 'Muntenia',
    localities: [
      { name: 'București', type: 'municipiu', isCapital: true },
      { name: 'Voluntari', type: 'oraș', isCapital: false },
      { name: 'Pantelimon', type: 'oraș', isCapital: false },
      { name: 'Popești-Leordeni', type: 'oraș', isCapital: false },
      { name: 'Chitila', type: 'oraș', isCapital: false },
      { name: 'Bragadiru', type: 'oraș', isCapital: false },
      { name: 'Otopeni', type: 'oraș', isCapital: false },
      { name: 'Buftea', type: 'oraș', isCapital: false },
      { name: 'Măgurele', type: 'oraș', isCapital: false },
      { name: 'Cornetu', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'PH',
    name: 'Prahova',
    region: 'Muntenia',
    localities: [
      { name: 'Ploiești', type: 'municipiu', isCapital: true },
      { name: 'Câmpina', type: 'municipiu', isCapital: false },
      { name: 'Sinaia', type: 'oraș', isCapital: false },
      { name: 'Băicoi', type: 'oraș', isCapital: false },
      { name: 'Breaza', type: 'oraș', isCapital: false },
      { name: 'Mizil', type: 'oraș', isCapital: false },
      { name: 'Vălenii de Munte', type: 'oraș', isCapital: false },
      { name: 'Azuga', type: 'oraș', isCapital: false },
      { name: 'Slănic', type: 'oraș', isCapital: false },
      { name: 'Bușteni', type: 'oraș', isCapital: false },
    ],
  },
  {
    code: 'TR',
    name: 'Teleorman',
    region: 'Muntenia',
    localities: [
      { name: 'Alexandria', type: 'municipiu', isCapital: true },
      { name: 'Turnu Măgurele', type: 'municipiu', isCapital: false },
      { name: 'Roșiorii de Vede', type: 'municipiu', isCapital: false },
      { name: 'Zimnicea', type: 'oraș', isCapital: false },
      { name: 'Videle', type: 'oraș', isCapital: false },
      { name: 'Orbești', type: 'comună', isCapital: false },
      { name: 'Nanov', type: 'comună', isCapital: false },
      { name: 'Poeni', type: 'comună', isCapital: false },
      { name: 'Drăgănești-Vlașca', type: 'comună', isCapital: false },
      { name: 'Cervenia', type: 'comună', isCapital: false },
    ],
  },

  // MOLDOVA
  {
    code: 'BC',
    name: 'Bacău',
    region: 'Moldova',
    localities: [
      { name: 'Bacău', type: 'municipiu', isCapital: true },
      { name: 'Onești', type: 'municipiu', isCapital: false },
      { name: 'Moinești', type: 'municipiu', isCapital: false },
      { name: 'Comănești', type: 'oraș', isCapital: false },
      { name: 'Buhuși', type: 'oraș', isCapital: false },
      { name: 'Târgu Ocna', type: 'oraș', isCapital: false },
      { name: 'Dărmănești', type: 'oraș', isCapital: false },
      { name: 'Slănic-Moldova', type: 'oraș', isCapital: false },
      { name: 'Căiuți', type: 'comună', isCapital: false },
      { name: 'Hemeiuși', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'BT',
    name: 'Botoșani',
    region: 'Moldova',
    localities: [
      { name: 'Botoșani', type: 'municipiu', isCapital: true },
      { name: 'Dorohoi', type: 'municipiu', isCapital: false },
      { name: 'Darabani', type: 'oraș', isCapital: false },
      { name: 'Săveni', type: 'oraș', isCapital: false },
      { name: 'Flămânzi', type: 'oraș', isCapital: false },
      { name: 'Bucecea', type: 'oraș', isCapital: false },
      { name: 'Ștefănești', type: 'comună', isCapital: false },
      { name: 'Trușești', type: 'comună', isCapital: false },
      { name: 'Copalău', type: 'comună', isCapital: false },
      { name: 'Vlădeni', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'BR',
    name: 'Brăila',
    region: 'Moldova',
    localities: [
      { name: 'Brăila', type: 'municipiu', isCapital: true },
      { name: 'Ianca', type: 'oraș', isCapital: false },
      { name: 'Însurăței', type: 'oraș', isCapital: false },
      { name: 'Făurei', type: 'oraș', isCapital: false },
      { name: 'Movila Miresii', type: 'comună', isCapital: false },
      { name: 'Chișcani', type: 'comună', isCapital: false },
      { name: 'Viziru', type: 'comună', isCapital: false },
      { name: 'Tudor Vladimirescu', type: 'comună', isCapital: false },
      { name: 'Vadeni', type: 'comună', isCapital: false },
      { name: 'Gropeni', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'GL',
    name: 'Galați',
    region: 'Moldova',
    localities: [
      { name: 'Galați', type: 'municipiu', isCapital: true },
      { name: 'Tecuci', type: 'municipiu', isCapital: false },
      { name: 'Târgu Bujor', type: 'oraș', isCapital: false },
      { name: 'Berești', type: 'oraș', isCapital: false },
      { name: 'Liești', type: 'comună', isCapital: false },
      { name: 'Independența', type: 'comună', isCapital: false },
      { name: 'Țiglina', type: 'comună', isCapital: false },
      { name: 'Braniștea', type: 'comună', isCapital: false },
      { name: 'Schela', type: 'comună', isCapital: false },
      { name: 'Cudalbi', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'IS',
    name: 'Iași',
    region: 'Moldova',
    localities: [
      { name: 'Iași', type: 'municipiu', isCapital: true },
      { name: 'Pașcani', type: 'municipiu', isCapital: false },
      { name: 'Târgu Frumos', type: 'oraș', isCapital: false },
      { name: 'Hârlău', type: 'oraș', isCapital: false },
      { name: 'Podu Iloaiei', type: 'oraș', isCapital: false },
      { name: 'Târgu Neamț', type: 'oraș', isCapital: false },
      { name: 'Lețcani', type: 'comună', isCapital: false },
      { name: 'Miroslava', type: 'comună', isCapital: false },
      { name: 'Rediu', type: 'comună', isCapital: false },
      { name: 'Tomești', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'NT',
    name: 'Neamț',
    region: 'Moldova',
    localities: [
      { name: 'Piatra Neamț', type: 'municipiu', isCapital: true },
      { name: 'Roman', type: 'municipiu', isCapital: false },
      { name: 'Târgu Neamț', type: 'oraș', isCapital: false },
      { name: 'Roznov', type: 'oraș', isCapital: false },
      { name: 'Bicaz', type: 'oraș', isCapital: false },
      { name: 'Cordun', type: 'comună', isCapital: false },
      { name: 'Săbăoani', type: 'comună', isCapital: false },
      { name: 'Gârcina', type: 'comună', isCapital: false },
      { name: 'Borlești', type: 'comună', isCapital: false },
      { name: 'Dumbrava Roșie', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'SV',
    name: 'Suceava',
    region: 'Moldova',
    localities: [
      { name: 'Suceava', type: 'municipiu', isCapital: true },
      { name: 'Botoșani', type: 'municipiu', isCapital: false },
      { name: 'Fălticeni', type: 'municipiu', isCapital: false },
      { name: 'Rădăuți', type: 'municipiu', isCapital: false },
      { name: 'Câmpulung Moldovenesc', type: 'municipiu', isCapital: false },
      { name: 'Vatra Dornei', type: 'municipiu', isCapital: false },
      { name: 'Gura Humorului', type: 'oraș', isCapital: false },
      { name: 'Siret', type: 'oraș', isCapital: false },
      { name: 'Solca', type: 'oraș', isCapital: false },
      { name: 'Salcea', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'VN',
    name: 'Vrancea',
    region: 'Moldova',
    localities: [
      { name: 'Focșani', type: 'municipiu', isCapital: true },
      { name: 'Adjud', type: 'municipiu', isCapital: false },
      { name: 'Mărășești', type: 'oraș', isCapital: false },
      { name: 'Panciu', type: 'oraș', isCapital: false },
      { name: 'Odobești', type: 'oraș', isCapital: false },
      { name: 'Gugești', type: 'comună', isCapital: false },
      { name: 'Dumitrești', type: 'comună', isCapital: false },
      { name: 'Câmpuri', type: 'comună', isCapital: false },
      { name: 'Vidra', type: 'comună', isCapital: false },
      { name: 'Suraia', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'VS',
    name: 'Vaslui',
    region: 'Moldova',
    localities: [
      { name: 'Vaslui', type: 'municipiu', isCapital: true },
      { name: 'Bârlad', type: 'municipiu', isCapital: false },
      { name: 'Huși', type: 'municipiu', isCapital: false },
      { name: 'Negrești', type: 'oraș', isCapital: false },
      { name: 'Murgeni', type: 'oraș', isCapital: false },
      { name: 'Zorleni', type: 'comună', isCapital: false },
      { name: 'Ivești', type: 'comună', isCapital: false },
      { name: 'Codăești', type: 'comună', isCapital: false },
      { name: 'Alexandru Vlahuță', type: 'comună', isCapital: false },
      { name: 'Dimitrie Cantemir', type: 'comună', isCapital: false },
    ],
  },

  // TRANSILVANIA
  {
    code: 'BN',
    name: 'Bistrița-Năsăud',
    region: 'Transilvania',
    localities: [
      { name: 'Bistrița', type: 'municipiu', isCapital: true },
      { name: 'Năsăud', type: 'oraș', isCapital: false },
      { name: 'Beclean', type: 'oraș', isCapital: false },
      { name: 'Sângeorz-Băi', type: 'oraș', isCapital: false },
      { name: 'Beclean', type: 'comună', isCapital: false },
      { name: 'Bistrița Bârgăului', type: 'comună', isCapital: false },
      { name: 'Țăgșoru', type: 'comună', isCapital: false },
      { name: 'Livezile', type: 'comună', isCapital: false },
      { name: 'Budacu de Jos', type: 'comună', isCapital: false },
      { name: 'Dumitra', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'BV',
    name: 'Brașov',
    region: 'Transilvania',
    localities: [
      { name: 'Brașov', type: 'municipiu', isCapital: true },
      { name: 'Făgăraș', type: 'municipiu', isCapital: false },
      { name: 'Săcele', type: 'municipiu', isCapital: false },
      { name: 'Codlea', type: 'oraș', isCapital: false },
      { name: 'Zărnești', type: 'oraș', isCapital: false },
      { name: 'Predeal', type: 'oraș', isCapital: false },
      { name: 'Rupea', type: 'oraș', isCapital: false },
      { name: 'Ghimbav', type: 'comună', isCapital: false },
      { name: 'Cristian', type: 'comună', isCapital: false },
      { name: 'Hărman', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'CJ',
    name: 'Cluj',
    region: 'Transilvania',
    localities: [
      { name: 'Cluj-Napoca', type: 'municipiu', isCapital: true },
      { name: 'Turda', type: 'municipiu', isCapital: false },
      { name: 'Dej', type: 'municipiu', isCapital: false },
      { name: 'Câmpia Turzii', type: 'oraș', isCapital: false },
      { name: 'Gherla', type: 'oraș', isCapital: false },
      { name: 'Huedin', type: 'oraș', isCapital: false },
      { name: 'Florești', type: 'comună', isCapital: false },
      { name: 'Baciu', type: 'comună', isCapital: false },
      { name: 'Apahida', type: 'comună', isCapital: false },
      { name: 'Gilău', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'CV',
    name: 'Covasna',
    region: 'Transilvania',
    localities: [
      { name: 'Sfântu Gheorghe', type: 'municipiu', isCapital: true },
      { name: 'Târgu Secuiesc', type: 'municipiu', isCapital: false },
      { name: 'Covasna', type: 'oraș', isCapital: false },
      { name: 'Baraolt', type: 'oraș', isCapital: false },
      { name: 'Întorsura Buzăului', type: 'oraș', isCapital: false },
      { name: 'Brețcu', type: 'comună', isCapital: false },
      { name: 'Turia', type: 'comună', isCapital: false },
      { name: 'Ozun', type: 'comună', isCapital: false },
      { name: 'Bodoc', type: 'comună', isCapital: false },
      { name: 'Catalina', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'HD',
    name: 'Hunedoara',
    region: 'Transilvania',
    localities: [
      { name: 'Deva', type: 'municipiu', isCapital: true },
      { name: 'Hunedoara', type: 'municipiu', isCapital: false },
      { name: 'Petroșani', type: 'municipiu', isCapital: false },
      { name: 'Lupeni', type: 'municipiu', isCapital: false },
      { name: 'Vulcan', type: 'municipiu', isCapital: false },
      { name: 'Orăștie', type: 'oraș', isCapital: false },
      { name: 'Brad', type: 'oraș', isCapital: false },
      { name: 'Simeria', type: 'oraș', isCapital: false },
      { name: 'Călan', type: 'oraș', isCapital: false },
      { name: 'Hațeg', type: 'oraș', isCapital: false },
    ],
  },
  {
    code: 'HR',
    name: 'Harghita',
    region: 'Transilvania',
    localities: [
      { name: 'Miercurea Ciuc', type: 'municipiu', isCapital: true },
      { name: 'Odorheiu Secuiesc', type: 'municipiu', isCapital: false },
      { name: 'Gheorgheni', type: 'municipiu', isCapital: false },
      { name: 'Toplița', type: 'municipiu', isCapital: false },
      { name: 'Borsec', type: 'oraș', isCapital: false },
      { name: 'Vlăhița', type: 'oraș', isCapital: false },
      { name: 'Bălan', type: 'oraș', isCapital: false },
      { name: 'Cristuru Secuiesc', type: 'oraș', isCapital: false },
      { name: 'Borsec', type: 'comună', isCapital: false },
      { name: 'Suseni', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'MS',
    name: 'Mureș',
    region: 'Transilvania',
    localities: [
      { name: 'Târgu Mureș', type: 'municipiu', isCapital: true },
      { name: 'Reghin', type: 'municipiu', isCapital: false },
      { name: 'Sighișoara', type: 'municipiu', isCapital: false },
      { name: 'Târnăveni', type: 'municipiu', isCapital: false },
      { name: 'Luduș', type: 'oraș', isCapital: false },
      { name: 'Sovata', type: 'oraș', isCapital: false },
      { name: 'Iernut', type: 'oraș', isCapital: false },
      { name: 'Sărmaș', type: 'comună', isCapital: false },
      { name: 'Ungheni', type: 'comună', isCapital: false },
      { name: 'Sângeorgiu de Pădure', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'SB',
    name: 'Sibiu',
    region: 'Transilvania',
    localities: [
      { name: 'Sibiu', type: 'municipiu', isCapital: true },
      { name: 'Mediaș', type: 'municipiu', isCapital: false },
      { name: 'Cisnădie', type: 'oraș', isCapital: false },
      { name: 'Agnita', type: 'oraș', isCapital: false },
      { name: 'Dumbrăveni', type: 'oraș', isCapital: false },
      { name: 'Avrig', type: 'oraș', isCapital: false },
      { name: 'Tălmaciu', type: 'oraș', isCapital: false },
      { name: 'Copșa Mică', type: 'oraș', isCapital: false },
      { name: 'Miercurea Sibiului', type: 'oraș', isCapital: false },
      { name: 'Șelimbăr', type: 'comună', isCapital: false },
    ],
  },

  // BANAT
  {
    code: 'AR',
    name: 'Arad',
    region: 'Banat',
    localities: [
      { name: 'Arad', type: 'municipiu', isCapital: true },
      { name: 'Ineu', type: 'oraș', isCapital: false },
      { name: 'Chișineu-Criș', type: 'oraș', isCapital: false },
      { name: 'Lipova', type: 'oraș', isCapital: false },
      { name: 'Curtici', type: 'oraș', isCapital: false },
      { name: 'Pecica', type: 'oraș', isCapital: false },
      { name: 'Sântana', type: 'oraș', isCapital: false },
      { name: 'Sebiș', type: 'oraș', isCapital: false },
      { name: 'Pâncota', type: 'oraș', isCapital: false },
      { name: 'Nădlac', type: 'oraș', isCapital: false },
    ],
  },
  {
    code: 'CS',
    name: 'Caraș-Severin',
    region: 'Banat',
    localities: [
      { name: 'Reșița', type: 'municipiu', isCapital: true },
      { name: 'Caransebeș', type: 'municipiu', isCapital: false },
      { name: 'Bocșa', type: 'oraș', isCapital: false },
      { name: 'Moldova Nouă', type: 'oraș', isCapital: false },
      { name: 'Oravița', type: 'oraș', isCapital: false },
      { name: 'Oțelu Roșu', type: 'oraș', isCapital: false },
      { name: 'Anina', type: 'oraș', isCapital: false },
      { name: 'Băile Herculane', type: 'oraș', isCapital: false },
      { name: 'Băuțar', type: 'comună', isCapital: false },
      { name: 'Cornereva', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'TM',
    name: 'Timiș',
    region: 'Banat',
    localities: [
      { name: 'Timișoara', type: 'municipiu', isCapital: true },
      { name: 'Lugoj', type: 'municipiu', isCapital: false },
      { name: 'Sânnicolau Mare', type: 'oraș', isCapital: false },
      { name: 'Jimbolia', type: 'oraș', isCapital: false },
      { name: 'Buziaș', type: 'oraș', isCapital: false },
      { name: 'Făget', type: 'oraș', isCapital: false },
      { name: 'Ciacova', type: 'oraș', isCapital: false },
      { name: 'Deta', type: 'oraș', isCapital: false },
      { name: 'Recaș', type: 'oraș', isCapital: false },
      { name: 'Gătaia', type: 'oraș', isCapital: false },
    ],
  },

  // OLTENIA
  {
    code: 'DJ',
    name: 'Dolj',
    region: 'Oltenia',
    localities: [
      { name: 'Craiova', type: 'municipiu', isCapital: true },
      { name: 'Băilești', type: 'municipiu', isCapital: false },
      { name: 'Calafat', type: 'municipiu', isCapital: false },
      { name: 'Bechet', type: 'oraș', isCapital: false },
      { name: 'Dăbuleni', type: 'oraș', isCapital: false },
      { name: 'Filiași', type: 'oraș', isCapital: false },
      { name: 'Segarcea', type: 'oraș', isCapital: false },
      { name: 'Podari', type: 'comună', isCapital: false },
      { name: 'Işalniţa', type: 'comună', isCapital: false },
      { name: 'Mischii', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'GJ',
    name: 'Gorj',
    region: 'Oltenia',
    localities: [
      { name: 'Târgu Jiu', type: 'municipiu', isCapital: true },
      { name: 'Motru', type: 'municipiu', isCapital: false },
      { name: 'Rovinari', type: 'municipiu', isCapital: false },
      { name: 'Târgu Cărbunești', type: 'oraș', isCapital: false },
      { name: 'Bumbești-Jiu', type: 'oraș', isCapital: false },
      { name: 'Novaci', type: 'oraș', isCapital: false },
      { name: 'Țicleni', type: 'oraș', isCapital: false },
      { name: 'Turceni', type: 'oraș', isCapital: false },
      { name: 'Tismana', type: 'oraș', isCapital: false },
      { name: 'Timiș', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'MH',
    name: 'Mehedinți',
    region: 'Oltenia',
    localities: [
      { name: 'Drobeta-Turnu Severin', type: 'municipiu', isCapital: true },
      { name: 'Orșova', type: 'municipiu', isCapital: false },
      { name: 'Strehaia', type: 'oraș', isCapital: false },
      { name: 'Baia de Aramă', type: 'oraș', isCapital: false },
      { name: 'Vânju Mare', type: 'oraș', isCapital: false },
      { name: 'Ștubei', type: 'comună', isCapital: false },
      { name: 'Gruia', type: 'comună', isCapital: false },
      { name: 'Dănceu', type: 'comună', isCapital: false },
      { name: 'Șimian', type: 'comună', isCapital: false },
      { name: 'Pristol', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'OT',
    name: 'Olt',
    region: 'Oltenia',
    localities: [
      { name: 'Slatina', type: 'municipiu', isCapital: true },
      { name: 'Caracal', type: 'municipiu', isCapital: false },
      { name: 'Balș', type: 'municipiu', isCapital: false },
      { name: 'Corabia', type: 'municipiu', isCapital: false },
      { name: 'Scornicești', type: 'oraș', isCapital: false },
      { name: 'Piatra-Olt', type: 'oraș', isCapital: false },
      { name: 'Drăgănești-Olt', type: 'oraș', isCapital: false },
      { name: 'Potcoava', type: 'oraș', isCapital: false },
      { name: 'Deveselu', type: 'comună', isCapital: false },
      { name: 'Slătioara', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'VL',
    name: 'Vâlcea',
    region: 'Oltenia',
    localities: [
      { name: 'Râmnicu Vâlcea', type: 'municipiu', isCapital: true },
      { name: 'Drăgășani', type: 'municipiu', isCapital: false },
      { name: 'Băbeni', type: 'oraș', isCapital: false },
      { name: 'Brezoi', type: 'oraș', isCapital: false },
      { name: 'Băile Olănești', type: 'oraș', isCapital: false },
      { name: 'Băile Govora', type: 'oraș', isCapital: false },
      { name: 'Călimănești', type: 'oraș', isCapital: false },
      { name: 'Horezu', type: 'oraș', isCapital: false },
      { name: 'Ocnele Mari', type: 'oraș', isCapital: false },
      { name: 'Berislăvești', type: 'comună', isCapital: false },
    ],
  },

  // DOBROGEA
  {
    code: 'CT',
    name: 'Constanța',
    region: 'Dobrogea',
    localities: [
      { name: 'Constanța', type: 'municipiu', isCapital: true },
      { name: 'Mangalia', type: 'municipiu', isCapital: false },
      { name: 'Medgidia', type: 'municipiu', isCapital: false },
      { name: 'Năvodari', type: 'oraș', isCapital: false },
      { name: 'Cernavodă', type: 'oraș', isCapital: false },
      { name: 'Techirghiol', type: 'oraș', isCapital: false },
      { name: 'Eforie', type: 'oraș', isCapital: false },
      { name: 'Murfatlar', type: 'oraș', isCapital: false },
      { name: 'Hârșova', type: 'oraș', isCapital: false },
      { name: 'Ovidiu', type: 'oraș', isCapital: false },
    ],
  },
  {
    code: 'TL',
    name: 'Tulcea',
    region: 'Dobrogea',
    localities: [
      { name: 'Tulcea', type: 'municipiu', isCapital: true },
      { name: 'Babadag', type: 'oraș', isCapital: false },
      { name: 'Măcin', type: 'oraș', isCapital: false },
      { name: 'Isaccea', type: 'oraș', isCapital: false },
      { name: 'Sulina', type: 'oraș', isCapital: false },
      { name: 'Bechet', type: 'oraș', isCapital: false },
      { name: 'Sfântu Gheorghe', type: 'comună', isCapital: false },
      { name: 'Mihail Kogălniceanu', type: 'comună', isCapital: false },
      { name: 'Crișan', type: 'comună', isCapital: false },
      { name: 'Jurilovca', type: 'comună', isCapital: false },
    ],
  },

  // CRIȘANA
  {
    code: 'BH',
    name: 'Bihor',
    region: 'Crișana',
    localities: [
      { name: 'Oradea', type: 'municipiu', isCapital: true },
      { name: 'Salonta', type: 'municipiu', isCapital: false },
      { name: 'Beiuș', type: 'municipiu', isCapital: false },
      { name: 'Marghita', type: 'municipiu', isCapital: false },
      { name: 'Aleșd', type: 'oraș', isCapital: false },
      { name: 'Valea lui Mihai', type: 'oraș', isCapital: false },
      { name: 'Nucet', type: 'oraș', isCapital: false },
      { name: 'Ștei', type: 'oraș', isCapital: false },
      { name: 'Vașcău', type: 'oraș', isCapital: false },
      { name: 'Săcuieni', type: 'oraș', isCapital: false },
    ],
  },
  {
    code: 'SM',
    name: 'Satu Mare',
    region: 'Crișana',
    localities: [
      { name: 'Satu Mare', type: 'municipiu', isCapital: true },
      { name: 'Carei', type: 'municipiu', isCapital: false },
      { name: 'Negrești-Oaș', type: 'municipiu', isCapital: false },
      { name: 'Ardud', type: 'oraș', isCapital: false },
      { name: 'Livada', type: 'oraș', isCapital: false },
      { name: 'Tășnad', type: 'oraș', isCapital: false },
      { name: 'Negreștii-Oaș', type: 'comună', isCapital: false },
      { name: 'Tăutii-Măgherăuș', type: 'comună', isCapital: false },
      { name: 'Medieșu Aurit', type: 'comună', isCapital: false },
      { name: 'Turt', type: 'comună', isCapital: false },
    ],
  },
  {
    code: 'SJ',
    name: 'Sălaj',
    region: 'Crișana',
    localities: [
      { name: 'Zalău', type: 'municipiu', isCapital: true },
      { name: 'Jibou', type: 'municipiu', isCapital: false },
      { name: 'Șimleu Silvaniei', type: 'municipiu', isCapital: false },
      { name: 'Cehu Silvaniei', type: 'oraș', isCapital: false },
      { name: 'Nușfalău', type: 'oraș', isCapital: false },
      { name: 'Sărmășag', type: 'comună', isCapital: false },
      { name: 'Mirșid', type: 'comună', isCapital: false },
      { name: 'Cristolțel', type: 'comună', isCapital: false },
      { name: 'Băbeni', type: 'comună', isCapital: false },
      { name: 'Bocșa', type: 'comună', isCapital: false },
    ],
  },

  // MARAMUREȘ
  {
    code: 'MM',
    name: 'Maramureș',
    region: 'Maramureș',
    localities: [
      { name: 'Baia Mare', type: 'municipiu', isCapital: true },
      { name: 'Sighetu Marmației', type: 'municipiu', isCapital: false },
      { name: 'Borșa', type: 'oraș', isCapital: false },
      { name: 'Vișeu de Sus', type: 'oraș', isCapital: false },
      { name: 'Târgu Lăpuș', type: 'oraș', isCapital: false },
      { name: 'Seini', type: 'oraș', isCapital: false },
      { name: 'Cavnic', type: 'oraș', isCapital: false },
      { name: 'Ulmeni', type: 'oraș', isCapital: false },
      { name: 'Săliștea de Sus', type: 'comună', isCapital: false },
      { name: 'Tăuții-Măgherăuș', type: 'comună', isCapital: false },
    ],
  },
];

/**
 * Returnează lista tuturor județelor
 */
export function getJudete(): County[] {
  return romaniaAdministrative;
}

/**
 * Returnează localitățile pentru un județ specific
 * @param judetCode - Codul județului (ex: "AB", "CJ", "B")
 * @returns Array de localități sau array gol dacă județul nu e găsit
 */
export function getLocalitati(judetCode: string): Locality[] {
  const judet = romaniaAdministrative.find((j) => j.code.toUpperCase() === judetCode.toUpperCase());
  return judet ? judet.localities : [];
}

/**
 * Returnează un județ specific după cod
 * @param judetCode - Codul județului (ex: "AB", "CJ", "B")
 * @returns County sau undefined dacă nu e găsit
 */
export function getJudet(judetCode: string): County | undefined {
  return romaniaAdministrative.find((j) => j.code.toUpperCase() === judetCode.toUpperCase());
}

/**
 * Returnează toate județele dintr-o regiune
 * @param region - Numele regiunii (ex: "Transilvania", "Moldova")
 * @returns Array de județe
 */
export function getJudeteByRegion(region: string): County[] {
  return romaniaAdministrative.filter((j) => j.region === region);
}

/**
 * Returnează toate regiunile disponibile
 * @returns Array de regiuni unice
 */
export function getRegiuni(): string[] {
  return Array.from(new Set(romaniaAdministrative.map((j) => j.region)));
}
