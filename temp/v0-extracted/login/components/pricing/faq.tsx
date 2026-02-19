"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqItems = [
  {
    question: "Pot testa platforma înainte de a plăti?",
    answer:
      "Da, oferim o perioadă de test gratuită de 30 de zile pentru toate planurile, fără a fi necesar un card de credit. Ai acces complet la funcționalitățile planului ales și poți anula oricând.",
  },
  {
    question: "Ce metode de plată acceptați?",
    answer:
      "Acceptăm plăți prin card bancar (Visa, Mastercard), transfer bancar și facturare cu plată la termen pentru planul Enterprise. Toate facturile sunt emise în conformitate cu legislația fiscală din România.",
  },
  {
    question: "Pot anula sau schimba planul oricând?",
    answer:
      "Absolut. Poți face upgrade sau downgrade oricând, iar diferența de preț se calculează proporțional. La anulare, ai acces până la sfârșitul perioadei de facturare curente. Nu există penalizări sau taxe ascunse.",
  },
  {
    question: "Cum sunt protejate datele companiei mele?",
    answer:
      "Datele sunt stocate pe servere securizate în UE, cu criptare end-to-end (AES-256). Suntem conformi GDPR și deținem certificarea ISO 27001. Efectuăm backup-uri zilnice automate și audituri de securitate trimestriale.",
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-muted/30 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-10 text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          {"Întrebări frecvente"}
        </h2>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
