"use client"

import { useState, useCallback } from "react"
import { ProgressBar } from "./progress-bar"
import { StepCompany, type CompanyData } from "./step-company"
import { StepAdmin, type AdminData } from "./step-admin"
import { StepModules } from "./step-modules"
import { StepImport, type ImportMethod } from "./step-import"
import { StepConfirm } from "./step-confirm"

const STEP_LABELS = [
  "Compania Ta",
  "Administrator",
  "Module",
  "Import",
  "Confirmare",
]

const initialCompany: CompanyData = {
  companyName: "",
  cui: "",
  caen: "",
  county: "",
  city: "",
  address: "",
}

const initialAdmin: AdminData = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  password: "",
  confirmPassword: "",
}

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<"forward" | "back">("forward")

  const [company, setCompany] = useState<CompanyData>(initialCompany)
  const [admin, setAdmin] = useState<AdminData>(initialAdmin)
  const [modules, setModules] = useState<string[]>(["ssm", "psi"])
  const [importMethod, setImportMethod] = useState<ImportMethod>("")
  const [importFile, setImportFile] = useState<File | null>(null)

  const goNext = useCallback(() => {
    setDirection("forward")
    setStep((s) => Math.min(s + 1, 5))
  }, [])

  const goBack = useCallback(() => {
    setDirection("back")
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top branding bar */}
      <header className="flex items-center justify-center border-b border-border bg-card px-6 py-4">
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          s-s-m<span className="text-primary">.ro</span>
        </span>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
        {/* Progress bar */}
        <div className="mb-10">
          <ProgressBar currentStep={step} steps={STEP_LABELS} />
        </div>

        {/* Step content with animated transitions */}
        <div className="relative flex-1">
          <div
            key={step}
            className="animate-in fade-in duration-300"
            style={{
              animationName:
                direction === "forward" ? "slideInRight" : "slideInLeft",
              animationDuration: "300ms",
              animationFillMode: "both",
            }}
          >
            {step === 1 && (
              <StepCompany
                data={company}
                onChange={setCompany}
                onNext={goNext}
              />
            )}
            {step === 2 && (
              <StepAdmin
                data={admin}
                onChange={setAdmin}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 3 && (
              <StepModules
                selected={modules}
                onChange={setModules}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 4 && (
              <StepImport
                method={importMethod}
                file={importFile}
                onMethodChange={setImportMethod}
                onFileChange={setImportFile}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 5 && (
              <StepConfirm
                company={company}
                admin={admin}
                modules={modules}
                importMethod={importMethod}
                fileName={importFile?.name ?? null}
                onBack={goBack}
                onConfirm={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
