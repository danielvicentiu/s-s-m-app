'use client'

import Link from 'next/link'
import { Shield, Clock, Award } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Gradient Container */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 text-center shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative z-10">
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Începe gratuit azi
            </h2>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Digitalizează conformitatea SSM/PSI în 5 minute.
              Fără costuri inițiale, fără carduri necesare.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Începe gratuit
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-800 bg-opacity-50 backdrop-blur-sm border-2 border-white border-opacity-30 rounded-xl hover:bg-opacity-70 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Cere demo
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">GDPR Compliant</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-blue-300" />
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">ISO Ready</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-blue-300" />
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
