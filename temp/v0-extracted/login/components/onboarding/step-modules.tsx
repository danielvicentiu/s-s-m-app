"use client"

import {
  Shield,
  Flame,
  Lock,
  Network,
  HeartPulse,
  Cog,
  AlertTriangle,
} from "lucide-react"
import { StepWrapper } from "./step-wrapper"

const modules = [
  {
    id: "ssm",
    icon: Shield,
    label: "SSM",
    description: "Securitatea și sănătatea în muncă",
  },
  {
    id: "psi",
    icon: Flame,
    label: "PSI",
    description: "Prevenirea și stingerea incendiilor",
  },
  {
    id: "gdpr",
    icon: Lock,
    label: "GDPR",
    description: "Protecția datelor cu caracter personal",
  },
  {
    id: "nis2",
    icon: Network,
    label: "NIS2",
    description: "Securitatea rețelelor și sistemelor informatice",
  },
  {
    id: "medical",
    icon: HeartPulse,
    label: "Medicina Muncii",
    description: "Fișe de aptitudine, programări examene",
  },
  {
    id: "iscir",
    icon: Cog,
    label: "ISCIR",
    description: "Evidența echipamentelor sub presiune",
  },
  {
    id: "nearmiss",
    icon: AlertTriangle,
    label: "Near-Miss",
    description: "Raportarea incidentelor și aproape-accidentelor",
  },
]

interface Props {
  selected: string[]
  onChange: (selected: string[]) => void
  onNext: () => void
  onBack: () => void
}

export function StepModules({ selected, onChange, onNext, onBack }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <StepWrapper
      title="Module Dorite"
      subtitle="Selectează modulele de conformitate pe care dorești să le activezi."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={selected.length === 0}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => {
          const isChecked = selected.includes(mod.id)
          const Icon = mod.icon

          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => toggle(mod.id)}
              className={`
                group relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200
                ${
                  isChecked
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-accent/50"
                }
              `}
            >
              {/* Custom checkbox */}
              <div
                className={`
                  mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded
                  border-2 transition-all duration-200
                  ${
                    isChecked
                      ? "border-primary bg-primary"
                      : "border-border group-hover:border-primary/40"
                  }
                `}
              >
                {isChecked && (
                  <svg
                    className="h-3 w-3 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 ${
                      isChecked ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {mod.label}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {mod.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </StepWrapper>
  )
}
