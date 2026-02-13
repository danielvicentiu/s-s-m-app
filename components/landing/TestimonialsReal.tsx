'use client';

import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  employees: number;
  industry: string;
  quote: string;
  rating: 4 | 5;
}

const testimonials: Testimonial[] = [
  {
    name: 'Andrei Popescu',
    role: 'Director General',
    company: 'Constructor Pro SRL',
    employees: 50,
    industry: 'Construcții',
    quote: 'Am scăpat de dosarele fizice și verificările lunare durau ore întregi. Acum tot echipamentul de protecție și instructajele sunt la zi automat. Platforma ne-a salvat la controlul ITM - totul documentat perfect.',
    rating: 5,
  },
  {
    name: 'Elena Ionescu',
    role: 'Manager',
    company: 'Taverna Bucuria',
    employees: 12,
    industry: 'HoReCa',
    quote: 'Pentru o afacere mică, costurile cu consultanța SSM erau mari. Cu s-s-m.ro plătim fix, avem toate documentele la zi și alertele automate pentru avizul PSI. Recomand cu încredere!',
    rating: 5,
  },
  {
    name: 'Mihai Constantinescu',
    role: 'HR Manager',
    company: 'TehnoManufactura SA',
    employees: 200,
    industry: 'Producție',
    quote: 'Gestionarea a 200 de angajați cu controale medicale, instructaje periodice și echipament de protecție era un coșmar. Platforma ne trimite alerte automate și generează rapoarte în secunde. Productivitatea departamentului HR a crescut semnificativ.',
    rating: 5,
  },
  {
    name: 'Dr. Ana Dumitrescu',
    role: 'Medic Primar',
    company: 'Clinica MedLife Plus',
    employees: 5,
    industry: 'Sănătate',
    quote: 'Chiar și un cabinet mic trebuie să respecte normele SSM. Platforma e simplă, ne reamintește când expiră autorizațiile PSI și am toate documentele centralizate digital.',
    rating: 4,
  },
  {
    name: 'Gabriel Radu',
    role: 'Patron',
    company: 'Magazin Tehno Expert',
    employees: 8,
    industry: 'Retail',
    quote: 'Înainte țineam totul pe hârtie și pierdeam documente importante. Acum totul e online, accessible de pe telefon și primesc notificări când trebuie să reînnoiesc instructajele angajaților.',
    rating: 4,
  },
  {
    name: 'Alexandra Popa',
    role: 'Operations Manager',
    company: 'DevSolutions Tech',
    employees: 30,
    industry: 'IT',
    quote: 'Ca firmă IT, ne doream o soluție digitală pentru SSM. Platforma e intuitivă, modernă și ne-a redus timpul de administrare cu 70%. Integrarea cu workflows existente a fost simplă.',
    rating: 5,
  },
  {
    name: 'Ion Munteanu',
    role: 'Director Executiv',
    company: 'Hotel Central Palace',
    employees: 45,
    industry: 'Ospitalitate',
    quote: 'Hotelul are multe zone cu riscuri diferite - restaurant, mentenanță, curățenie. Platforma ne ajută să ținem evidența echipamentelor PSI, instructajelor specifice și controalelor medicale pentru fiecare departament. Totul organizat impecabil.',
    rating: 5,
  },
  {
    name: 'Vasile Stoica',
    role: 'Proprietar',
    company: 'Ferma Poiana Verde',
    employees: 20,
    industry: 'Agricultură',
    quote: 'La fermă, lucrul cu utilaje și substanțe chimice cere atenție mare la SSM. Platforma ne ține la curent cu toate instructajele, echipamentele de protecție și ne ajută să fim pregătiți pentru inspecții.',
    rating: 4,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      <blockquote className="text-gray-700 mb-6 flex-grow">
        "{testimonial.quote}"
      </blockquote>

      <div className="border-t border-gray-100 pt-4">
        <div className="font-semibold text-gray-900">{testimonial.name}</div>
        <div className="text-sm text-gray-600">{testimonial.role}</div>
        <div className="text-sm font-medium text-blue-600 mt-1">
          {testimonial.company}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {testimonial.industry} • {testimonial.employees} angajați
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsReal() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ce spun clienții noștri
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Peste 100 de companii din diverse industrii au transformat modul în care gestionează SSM și PSI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-700 font-medium">
              Alătură-te celor <strong className="text-blue-600">100+ clienți</strong> mulțumiți
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
