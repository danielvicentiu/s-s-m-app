'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const ROTATING_KEYWORDS = ['SSM', 'PSI', 'GDPR', 'NIS2'];

export default function HeroSection() {
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Typewriter effect with improved timing
  useEffect(() => {
    const currentKeyword = ROTATING_KEYWORDS[currentKeywordIndex];
    const typingSpeed = isDeleting ? 75 : 150;
    const pauseAfterComplete = 2000;
    const pauseAfterDelete = 500;

    if (!isDeleting && displayedText === currentKeyword) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseAfterComplete);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentKeywordIndex((prev) => (prev + 1) % ROTATING_KEYWORDS.length);
      const timeout = setTimeout(() => {}, pauseAfterDelete);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setDisplayedText((prev) => {
        if (isDeleting) {
          return currentKeyword.substring(0, prev.length - 1);
        } else {
          return currentKeyword.substring(0, prev.length + 1);
        }
      });
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentKeywordIndex]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-cyan-400/20 animate-gradient-shift" />
      </div>

      {/* Animated blob shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Content */}
          <div className="text-white space-y-8 animate-fade-in-up">
            {/* Title with typewriter */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Compliance{' '}
                <span className="inline-block min-w-[200px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                  {displayedText}
                  <span className="animate-blink">|</span>
                </span>
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Digitalizat
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl leading-relaxed">
              Platforma digitală completă pentru consultanți SSM/PSI.
              Gestionează clienți, documentație, training-uri și alerte dintr-un singur loc.
            </p>

            {/* CTA Buttons with pulse animation */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/auth/register"
                className="group relative px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-center animate-pulse-cta"
              >
                <span className="relative z-10">Încearcă Gratuit</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>

              <Link
                href="/demo"
                className="group relative px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:border-white hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300 text-center animate-pulse-cta animation-delay-300"
              >
                <span className="relative z-10">Solicită Demo</span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-blue-100 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>100+ clienți activi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-500" />
                <span>Conformitate 100%</span>
              </div>
            </div>
          </div>

          {/* Floating mockup with parallax effect */}
          <div
            className="hidden lg:block relative"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="relative animate-float">
              {/* Glow effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-400/40 rounded-3xl blur-3xl" />

              {/* Mockup container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
                {/* Dashboard mockup */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 overflow-hidden">
                  {/* Mock header */}
                  <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 animate-slide-in-right">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-32 bg-blue-200 rounded animate-pulse" />
                      <div className="flex gap-2">
                        <div className="h-3 w-3 bg-green-400 rounded-full" />
                        <div className="h-3 w-3 bg-yellow-400 rounded-full animation-delay-200" />
                        <div className="h-3 w-3 bg-red-400 rounded-full animation-delay-400" />
                      </div>
                    </div>
                  </div>

                  {/* Mock cards grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm p-4 animate-slide-in-right animation-delay-200">
                      <div className="h-2 w-16 bg-gray-200 rounded mb-3" />
                      <div className="h-6 w-20 bg-blue-100 rounded-lg" />
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-4 animate-slide-in-right animation-delay-400">
                      <div className="h-2 w-16 bg-gray-200 rounded mb-3" />
                      <div className="h-6 w-20 bg-green-100 rounded-lg" />
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-4 animate-slide-in-right animation-delay-600">
                      <div className="h-2 w-16 bg-gray-200 rounded mb-3" />
                      <div className="h-6 w-20 bg-purple-100 rounded-lg" />
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-4 animate-slide-in-right animation-delay-800">
                      <div className="h-2 w-16 bg-gray-200 rounded mb-3" />
                      <div className="h-6 w-20 bg-orange-100 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400/50 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400/50 rounded-full blur-2xl animate-pulse animation-delay-1000" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with bounce animation */}
      <button
        onClick={handleScrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/80 hover:text-white transition-colors cursor-pointer group"
        aria-label="Scroll to content"
      >
        <div className="flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-sm font-medium">Descoperă mai mult</span>
          <ChevronDown className="w-6 h-6 group-hover:transform group-hover:scale-110 transition-transform" />
        </div>
      </button>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-cta {
          0%, 100% { transform: scale(1); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
          50% { transform: scale(1.02); box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
        }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-cta {
          animation: pulse-cta 3s ease-in-out infinite;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </section>
  );
}
