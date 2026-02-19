"use client"

import { useState } from "react"
import { PricingToggle } from "./pricing-toggle"
import { PlanCard } from "./plan-card"
import type { PlanData } from "./plan-card"

const plans: PlanData[] = [
  {
    name: "Start",
    monthlyPrice: 29,
    annualPrice: 350,
    audience: "Până la 10 angajați",
    features: [
      "SSM de bază",
      "PSI de bază",
      "1 utilizator admin",
      "Rapoarte PDF",
      "Suport email",
    ],
    cta: "Începe gratuit",
  },
  {
    name: "Professional",
    monthlyPrice: 58,
    annualPrice: 700,
    audience: "Până la 50 angajați",
    highlighted: true,
    badge: "Recomandat",
    features: [
      "Tot din Start, plus:",
      "Modul GDPR",
      "Medicina Muncii",
      "Near-Miss Reporting",
      "Calendar instruiri",
      "Import REGES/REVISAL",
      "5 utilizatori",
      "Suport prioritar",
    ],
    cta: "Alege Professional",
  },
  {
    name: "Enterprise",
    monthlyPrice: 100,
    annualPrice: 1200,
    audience: "Angajați nelimitați",
    features: [
      "Tot din Professional, plus:",
      "NIS2 compliance",
      "ISCIR management",
      "Asistent VA-AI",
      "Acces API",
      "Utilizatori nelimitați",
      "Manager dedicat",
      "SLA 99.9%",
    ],
    cta: "Contactează-ne",
  },
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <section id="preturi" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {"Prețuri simple, fără surprize"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {"Alege planul potrivit pentru compania ta. Toate includ 30 de zile gratuit."}
          </p>
        </div>

        <div className="mb-10">
          <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>
      </div>
    </section>
  )
}
