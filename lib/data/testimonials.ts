export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companySize: string;
  sector: string;
  quote: string;
  rating: 4 | 5;
  avatar: string;
  country: 'RO' | 'BG' | 'HU' | 'DE' | 'PL';
}

export const testimonials: Testimonial[] = [
  // Romania - 4 testimonials
  {
    id: 'ro-1',
    name: 'Andrei Popescu',
    role: 'Director HR',
    company: 'TechVision Solutions',
    companySize: '50-100 angajați',
    sector: 'CAEN 6201 - Activități de realizare a soft-ului la comandă',
    quote: 'Platforma a simplificat enorm gestionarea documentației SSM. Tot ce avem nevoie este acum la un click distanță, iar alertele automate ne ajută să nu mai ratăm nicio scadență. Colaborarea cu consultantul nostru SSM nu a fost niciodată mai eficientă.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Andrei+Popescu&background=2563eb&color=fff',
    country: 'RO'
  },
  {
    id: 'ro-2',
    name: 'Elena Ionescu',
    role: 'Manager Operațiuni',
    company: 'ProConstruct & Build',
    companySize: '100-250 angajați',
    sector: 'CAEN 4120 - Lucrări de construcții a clădirilor rezidențiale și nerezidențiale',
    quote: 'În industria construcțiilor, conformitatea SSM este vitală. Această platformă ne-a redus timpul administrativ cu 60% și ne oferă siguranța că totul este în ordine. Rapoartele detaliate ne ajută la audituri și inspecții.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Elena+Ionescu&background=2563eb&color=fff',
    country: 'RO'
  },
  {
    id: 'ro-3',
    name: 'Mihai Dumitrescu',
    role: 'Consultant SSM',
    company: 'SafeWork Consulting',
    companySize: '5-10 consultanți',
    sector: 'CAEN 7022 - Activități de consultanță pentru afaceri și management',
    quote: 'Gestionez peste 40 de clienți și această platformă mi-a revoluționat munca. Pot monitoriza toate firmele dintr-un singur loc, generez rapoarte instant și comunic eficient cu fiecare client. Indispensabilă pentru orice consultant SSM modern.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Mihai+Dumitrescu&background=2563eb&color=fff',
    country: 'RO'
  },
  {
    id: 'ro-4',
    name: 'Carmen Stanciu',
    role: 'Administrator',
    company: 'FreshMart Distribution',
    companySize: '30-50 angajați',
    sector: 'CAEN 4639 - Comerț cu ridicata nespecializat de produse alimentare',
    quote: 'Interfața este intuitivă și echipa noastră s-a adaptat rapid. Apreciem foarte mult funcționalitatea de gestionare a echipamentelor de protecție și urmărirea ușoară a certificatelor medicale ale angajaților.',
    rating: 4,
    avatar: 'https://ui-avatars.com/api/?name=Carmen+Stanciu&background=2563eb&color=fff',
    country: 'RO'
  },

  // Bulgaria - 2 testimonials
  {
    id: 'bg-1',
    name: 'Georgi Petrov',
    role: 'Operations Director',
    company: 'LogiTrans Bulgaria',
    companySize: '150-200 employees',
    sector: 'CAEN 4941 - Transporturi rutiere de mărfuri',
    quote: 'The platform has transformed how we manage safety compliance across our fleet. Real-time tracking of driver certifications and vehicle safety checks has improved our audit scores significantly. The multilingual support is excellent for our international operations.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Georgi+Petrov&background=2563eb&color=fff',
    country: 'BG'
  },
  {
    id: 'bg-2',
    name: 'Maria Dimitrova',
    role: 'HR Manager',
    company: 'BulgarTech Industries',
    companySize: '80-120 employees',
    sector: 'CAEN 2712 - Fabricarea aparatelor de distribuție și control a electricității',
    quote: 'Managing occupational health and safety documentation used to be overwhelming. Now everything is organized, automated reminders keep us compliant, and our consultant can access everything they need remotely. Highly recommended for manufacturing companies.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Maria+Dimitrova&background=2563eb&color=fff',
    country: 'BG'
  },

  // Hungary - 2 testimonials
  {
    id: 'hu-1',
    name: 'László Kovács',
    role: 'Safety Coordinator',
    company: 'Magyar AutoParts Kft.',
    companySize: '200-300 alkalmazott',
    sector: 'CAEN 2932 - Fabricarea altor părți și accesorii pentru autovehicule',
    quote: 'A platform hatékonysága lenyűgöző. Az automatikus riasztások és a részletes jelentések segítenek megfelelni a szigorú biztonsági előírásoknak. Az ügyfélszolgálat is kiváló, gyorsan reagálnak minden kérdésre.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Laszlo+Kovacs&background=2563eb&color=fff',
    country: 'HU'
  },
  {
    id: 'hu-2',
    name: 'Katalin Nagy',
    role: 'Quality & Safety Manager',
    company: 'FoodPro Hungary',
    companySize: '60-90 alkalmazott',
    sector: 'CAEN 1089 - Fabricarea altor produse alimentare',
    quote: 'Kiváló eszköz az élelmiszeriparban dolgozó cégek számára. A munkavédelmi képzések nyomon követése és a balesetek dokumentálása sokkal egyszerűbb lett. A rendszer megbízható és felhasználóbarát.',
    rating: 4,
    avatar: 'https://ui-avatars.com/api/?name=Katalin+Nagy&background=2563eb&color=fff',
    country: 'HU'
  },

  // Germany - 2 testimonials
  {
    id: 'de-1',
    name: 'Stefan Müller',
    role: 'Arbeitssicherheit Leiter',
    company: 'Deutsche Maschinenbau GmbH',
    companySize: '300-500 Mitarbeiter',
    sector: 'CAEN 2822 - Fabricarea echipamentelor de ridicat și manipulat',
    quote: 'Die Plattform erfüllt alle deutschen Arbeitsschutzanforderungen und mehr. Die Dokumentation ist lückenlos, die Berichterstattung ist ausgezeichnet, und die Integration mit unserem bestehenden System war reibungslos. Ein Muss für jedes produzierende Unternehmen.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Stefan+Muller&background=2563eb&color=fff',
    country: 'DE'
  },
  {
    id: 'de-2',
    name: 'Anna Schmidt',
    role: 'HR Director',
    company: 'EuroLogistics Solutions',
    companySize: '120-180 Mitarbeiter',
    sector: 'CAEN 5210 - Depozitări',
    quote: 'Wir nutzen die Plattform seit einem Jahr und sind sehr zufrieden. Die Verwaltung von Schulungen, Gesundheitsuntersuchungen und Schutzausrüstung ist nun zentral und transparent. Der Support ist kompetent und hilfsbereit.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Anna+Schmidt&background=2563eb&color=fff',
    country: 'DE'
  },

  // Poland - 2 testimonials
  {
    id: 'pl-1',
    name: 'Piotr Kowalski',
    role: 'Kierownik BHP',
    company: 'PolskaBuild Construction',
    companySize: '150-250 pracowników',
    sector: 'CAEN 4312 - Lucrări de pregătire a terenului',
    quote: 'Doskonałe narzędzie do zarządzania bezpieczeństwem na budowach. System przypomnień pomaga nam być zawsze zgodnymi z przepisami, a dokumentacja jest łatwo dostępna podczas inspekcji. Platforma naprawdę ułatwiła nam pracę.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Piotr+Kowalski&background=2563eb&color=fff',
    country: 'PL'
  },
  {
    id: 'pl-2',
    name: 'Magdalena Nowak',
    role: 'HR Manager',
    company: 'TechServe Polska',
    companySize: '70-100 pracowników',
    sector: 'CAEN 6202 - Activități de consultanță în tehnologia informației',
    quote: 'Mimo że jesteśmy firmą IT, bezpieczeństwo pracy jest dla nas ważne. Platforma jest intuicyjna i nie wymaga dużego nakładu czasu. Cyfryzacja dokumentów BHP zaoszczędziła nam wiele godzin pracy administracyjnej.',
    rating: 4,
    avatar: 'https://ui-avatars.com/api/?name=Magdalena+Nowak&background=2563eb&color=fff',
    country: 'PL'
  }
];

// Helper function to get testimonials by country
export function getTestimonialsByCountry(country: Testimonial['country']): Testimonial[] {
  return testimonials.filter(t => t.country === country);
}

// Helper function to get testimonials by rating
export function getTestimonialsByRating(minRating: 4 | 5): Testimonial[] {
  return testimonials.filter(t => t.rating >= minRating);
}

// Helper function to get random testimonials
export function getRandomTestimonials(count: number): Testimonial[] {
  const shuffled = [...testimonials].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
