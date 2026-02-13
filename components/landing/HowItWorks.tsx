'use client';

import { useEffect, useRef, useState } from 'react';
import { ClipboardList, Users, ShieldCheck } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Înregistrează firma',
    description: 'Creează cont și adaugă informațiile companiei tale în platformă',
    icon: ClipboardList,
    duration: '2 min',
  },
  {
    number: 2,
    title: 'Importă angajații',
    description: 'Adaugă echipa ta și configurează structura organizațională',
    icon: Users,
    duration: '5 min',
  },
  {
    number: 3,
    title: 'Monitorizează conformitatea',
    description: 'Primești automat alertele și rapoartele pentru compliance SSM/PSI',
    icon: ShieldCheck,
    duration: 'automat',
  },
];

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate steps one by one
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...prev, index]);
              }, index * 200);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cum funcționează?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Începe să folosești platforma în doar câțiva pași simpli
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 transform -translate-y-1/2 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isVisible = visibleSteps.includes(index);

              return (
                <div
                  key={step.number}
                  className={`relative transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative">
                    {/* Animated Number Badge */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform duration-500 ${
                            isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                          }`}
                        >
                          {step.number}
                        </div>
                        {/* Pulse effect */}
                        {isVisible && (
                          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
                        )}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mt-6 mb-6 flex justify-center">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center transition-all duration-500 ${
                          isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
                        }`}
                      >
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {step.duration}
                      </div>
                    </div>

                    {/* Connector dot for mobile */}
                    {index < steps.length - 1 && (
                      <div className="md:hidden flex justify-center mt-6">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Începe gratuit
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Nu este necesar card bancar • Setup complet în sub 10 minute
          </p>
        </div>
      </div>
    </section>
  );
}
