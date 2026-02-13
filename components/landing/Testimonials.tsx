import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Maria Popescu',
    role: 'Director HR',
    company: 'TechConstruct SRL',
    content: 'Platforma a transformat complet modul în care gestionăm documentele SSM. Am redus timpul de procesare cu 70% și avem totul centralizat într-un singur loc.',
    rating: 5,
    avatar: 'MP'
  },
  {
    id: 2,
    name: 'Alexandru Ionescu',
    role: 'CEO',
    company: 'Industrial Solutions',
    content: 'Servicii de consultanță SSM de top. Echipa este profesionistă, răspunde prompt și ne ajută să fim mereu în conformitate cu legislația în vigoare.',
    rating: 5,
    avatar: 'AI'
  },
  {
    id: 3,
    name: 'Elena Dumitrescu',
    role: 'Manager Operațiuni',
    company: 'LogiTrans Group',
    content: 'Sistemul de alerte automate ne-a salvat de nenumărate ori. Nu mai pierdem nicio scadență pentru avize PSI sau controale medicale periodice.',
    rating: 5,
    avatar: 'ED'
  },
  {
    id: 4,
    name: 'Cristian Munteanu',
    role: 'Responsabil SSM',
    company: 'ProManufacturing',
    content: 'Interfața intuitivă și rapoartele detaliate ne permit să avem o viziune completă asupra statusului SSM al companiei. Recomand cu încredere!',
    rating: 5,
    avatar: 'CM'
  },
  {
    id: 5,
    name: 'Andreea Stanciu',
    role: 'Director General',
    company: 'EcoBuilding SRL',
    content: 'Colaborarea cu echipa s-s-m.ro este excelentă. Digitalizarea proceselor SSM ne-a simplificat mult munca și ne-a redus costurile administrative.',
    rating: 5,
    avatar: 'AS'
  },
  {
    id: 6,
    name: 'Mihai Constantin',
    role: 'Plant Manager',
    company: 'AutoParts Industries',
    content: 'Platforma este exact ce aveam nevoie pentru a gestiona 200+ angajați și echipamente. Totul este organizat, securizat și accesibil oricând.',
    rating: 5,
    avatar: 'MC'
  }
];

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, index) => (
        <StarIcon key={index} filled={index < testimonial.rating} />
      ))}
    </div>

    <p className="text-gray-700 mb-6 leading-relaxed">
      "{testimonial.content}"
    </p>

    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
        {testimonial.avatar}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
        <p className="text-sm text-gray-600">{testimonial.role}</p>
        <p className="text-sm text-gray-500">{testimonial.company}</p>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ce spun clienții noștri
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Peste 100 de companii au digitalizat procesele SSM/PSI cu platforma noastră
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
