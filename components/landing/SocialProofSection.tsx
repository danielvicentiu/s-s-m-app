'use client';

import { useEffect, useRef, useState } from 'react';
import { Building2, Users, Globe, Shield, Lock, Activity, Star, Quote } from 'lucide-react';

// Animated counter hook with intersection observer
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeOutQuad * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, end, duration, start]);

  return { count, ref };
}

// Company logos (using company names as placeholders)
const companies = [
  'S.C. PROD CONSTRUCT S.R.L.',
  'EURO TRANSPORT & LOGISTICS',
  'TECH SOLUTIONS ROMANIA',
  'MEDICAL CARE GROUP',
  'INDUSTRIAL SYSTEMS SRL',
  'GREEN ENERGY SOLUTIONS',
  'AUTO SERVICE PREMIUM',
  'FOOD & BEVERAGE CO.',
];

// Testimonials
const testimonials = [
  {
    quote: 'Am redus timpul pentru documentația SSM de la 3 ore la 30 minute. Platformă excelentă!',
    author: 'Maria Popescu',
    role: 'Consultant SSM',
    company: 'SSM Expert Consulting',
  },
  {
    quote: 'Gestionăm 200+ angajați cu ușurință. Alertele automate ne-au salvat de multe amenzi.',
    author: 'Ion Georgescu',
    role: 'HR Manager',
    company: 'TechCorp Romania',
  },
  {
    quote: 'Soluția perfectă pentru firmele cu mai multe puncte de lucru. Tot într-un singur loc!',
    author: 'Elena Radu',
    role: 'Director Operațional',
    company: 'Retail Solutions SRL',
  },
];

// Trust badges
const badges = [
  {
    icon: Shield,
    label: 'ISO 27001 Ready',
    description: 'Securitate nivel enterprise',
  },
  {
    icon: Lock,
    label: 'GDPR Compliant',
    description: 'Conformitate totală GDPR',
  },
  {
    icon: Activity,
    label: '99.9% Uptime',
    description: 'Disponibilitate garantată',
  },
];

export default function SocialProofSection() {
  const companiesCount = useCountUp(500, 2000);
  const employeesCount = useCountUp(10000, 2500);
  const countriesCount = useCountUp(5, 1500);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Încrederea clienților noștri
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Peste 500 de companii din 5 țări ne folosesc zilnic pentru a gestiona conformitatea SSM/PSI
          </p>
        </div>

        {/* Animated logos bar */}
        <div className="mb-20 overflow-hidden">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />

            <div className="flex animate-scroll-infinite">
              {[...companies, ...companies].map((company, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-8 px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Big numbers with count-up animation */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div ref={companiesCount.ref} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {companiesCount.count}+
            </div>
            <div className="text-lg text-gray-600">Firme active</div>
          </div>

          <div ref={employeesCount.ref} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {employeesCount.count.toLocaleString('ro-RO')}+
            </div>
            <div className="text-lg text-gray-600">Angajați gestionați</div>
          </div>

          <div ref={countriesCount.ref} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {countriesCount.count}
            </div>
            <div className="text-lg text-gray-600">Țări</div>
          </div>
        </div>

        {/* Mini testimonials highlighted */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-8 h-8 text-blue-600/20" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
                <div className="text-sm text-gray-500">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid md:grid-cols-3 gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{badge.label}</div>
                  <div className="text-sm text-gray-600">{badge.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-infinite {
          animation: scroll-infinite 30s linear infinite;
        }

        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
