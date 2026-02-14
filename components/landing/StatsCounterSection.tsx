'use client';

import { useEffect, useRef, useState } from 'react';

interface StatItem {
  endValue: number;
  suffix: string;
  label: string;
  decimals?: number;
}

const stats: StatItem[] = [
  {
    endValue: 100,
    suffix: '+',
    label: 'Clienți',
    decimals: 0,
  },
  {
    endValue: 5000,
    suffix: '+',
    label: 'Angajați gestiona ți',
    decimals: 0,
  },
  {
    endValue: 15000,
    suffix: '+',
    label: 'Instruiri completate',
    decimals: 0,
  },
  {
    endValue: 99.9,
    suffix: '%',
    label: 'Uptime',
    decimals: 1,
  },
];

function StatCounter({
  endValue,
  suffix,
  label,
  decimals = 0,
  isVisible,
}: StatItem & { isVisible: boolean }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    hasAnimated.current = true;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = endValue / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(stepValue * currentStep);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, endValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
        {count.toFixed(decimals)}
        {suffix}
      </div>
      <div className="text-gray-600 text-sm md:text-base font-medium">
        {label}
      </div>
    </div>
  );
}

export default function StatsCounterSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Optional header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Rezultate măsurabile
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Peste 20 de ani de experiență în domeniul SSM și PSI, cu o
            platformă de încredere folosită de sute de companii
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              endValue={stat.endValue}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
