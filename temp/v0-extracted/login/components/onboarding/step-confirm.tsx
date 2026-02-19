"use client"

import { useEffect, useState } from "react"
import {
  Building2,
  User,
  Puzzle,
  Users,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import type { CompanyData } from "./step-company"
import type { AdminData } from "./step-admin"
import type { ImportMethod } from "./step-import"

const moduleLabels: Record<string, string> = {
  ssm: "SSM",
  psi: "PSI",
  gdpr: "GDPR",
  nis2: "NIS2",
  medical: "Medicina Muncii",
  iscir: "ISCIR",
  nearmiss: "Near-Miss",
}

const importLabels: Record<string, string> = {
  reges: "Import din REGES",
  excel: "Upload Excel / CSV",
  manual: "Adaugă manual",
}

interface Props {
  company: CompanyData
  admin: AdminData
  modules: string[]
  importMethod: ImportMethod
  fileName: string | null
  onBack: () => void
  onConfirm: () => void
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

function SummarySection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  )
}

/* Animated checkmark for success state */
function AnimatedCheck() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full bg-green-100 transition-all duration-500 ${
          show ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <svg
          className={`h-10 w-10 text-green-600 transition-all duration-700 delay-200 ${
            show ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
            className="origin-center"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: show ? 0 : 30,
              transition: "stroke-dashoffset 0.6s ease 0.3s",
            }}
          />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          Contul tău este gata!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Totul a fost configurat cu succes. Ești pregătit să începi.
        </p>
      </div>
    </div>
  )
}

export function StepConfirm({
  company,
  admin,
  modules,
  importMethod,
  fileName,
  onBack,
  onConfirm,
}: Props) {
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    setConfirmed(true)
    onConfirm()
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <AnimatedCheck />
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          Mergi la Panou de Control
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Confirmare
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Verifică toate datele înainte de finalizare.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummarySection icon={Building2} title="Compania">
          <SummaryRow label="Denumire" value={company.companyName || "—"} />
          <SummaryRow label="CUI" value={company.cui || "—"} />
          <SummaryRow label="CAEN" value={company.caen || "—"} />
          <SummaryRow
            label="Locație"
            value={
              [company.city, company.county].filter(Boolean).join(", ") || "—"
            }
          />
        </SummarySection>

        <SummarySection icon={User} title="Administrator">
          <SummaryRow label="Nume" value={admin.fullName || "—"} />
          <SummaryRow label="Email" value={admin.email || "—"} />
          <SummaryRow label="Telefon" value={admin.phone || "—"} />
          <SummaryRow label="Rol" value={admin.role || "—"} />
        </SummarySection>

        <SummarySection icon={Puzzle} title="Module active">
          <div className="flex flex-wrap gap-2 py-2">
            {modules.map((m) => (
              <span
                key={m}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {moduleLabels[m] ?? m}
              </span>
            ))}
          </div>
        </SummarySection>

        <SummarySection icon={Users} title="Import angajați">
          <SummaryRow
            label="Metodă"
            value={importLabels[importMethod] ?? "—"}
          />
          {fileName && <SummaryRow label="Fișier" value={fileName} />}
        </SummarySection>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          Finalizează configurarea
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
