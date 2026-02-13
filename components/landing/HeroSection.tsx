'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Globe, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Digitalizează SSM-ul firmei tale
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
              Conformitate 100% cu legislația românească în 5 minute
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Începe gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-white rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Cere demo
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-blue-200">firme active</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">5 țări</div>
                  <div className="text-sm text-blue-200">acoperite</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">GDPR</div>
                  <div className="text-sm text-blue-200">compliant</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content - Illustration placeholder */}
          <div className="relative lg:block">
            <div className="relative">
              {/* Placeholder illustration - can be replaced with actual image */}
              <div className="aspect-square bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl p-8">
                <div className="w-full h-full bg-white/10 rounded-2xl flex items-center justify-center">
                  {/* Decorative dashboard preview */}
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="h-12 bg-white/20 rounded-xl animate-pulse" />
                    <div className="h-8 bg-white/15 rounded-lg animate-pulse delay-75" />
                    <div className="h-8 bg-white/15 rounded-lg animate-pulse delay-150" />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="h-24 bg-white/20 rounded-xl animate-pulse delay-200" />
                      <div className="h-24 bg-white/20 rounded-xl animate-pulse delay-300" />
                    </div>
                    <div className="h-32 bg-white/15 rounded-xl animate-pulse delay-400" />
                  </div>
                </div>
              </div>

              {/* Decorative floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/30 rounded-2xl backdrop-blur-sm border border-white/20 animate-float" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-300/30 rounded-2xl backdrop-blur-sm border border-white/20 animate-float-delayed" />
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
