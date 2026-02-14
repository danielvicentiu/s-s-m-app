"use client";

import Link from "next/link";
import { ArrowRight, Shield, Lock, Zap } from "lucide-react";

export default function CTAFinalSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main heading */}
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Pregătit să digitalizezi SSM-ul?
          </h2>

          {/* Subtitle */}
          <p className="mb-10 text-lg text-blue-100 sm:text-xl">
            Începe gratuit fără card de credit și descoperă cum poți simplifica
            compliance-ul SSM/PSI pentru firma ta.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              Creează cont gratuit
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/demo"
              className="group inline-flex items-center gap-2 rounded-xl border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Solicită demo
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100 sm:gap-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-200" />
              <span>GDPR Compliant</span>
            </div>

            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-200" />
              <span>SSL Secured</span>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-200" />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
