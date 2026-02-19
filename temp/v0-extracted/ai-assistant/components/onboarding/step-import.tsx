"use client"

import { useState, useRef, type DragEvent } from "react"
import {
  Database,
  FileSpreadsheet,
  UserPlus,
  Upload,
  Star,
  FileUp,
  X,
} from "lucide-react"
import { StepWrapper } from "./step-wrapper"

const importMethods = [
  {
    id: "reges",
    icon: Database,
    label: "Import din REGES",
    description: "Importă automat datele angajaților din registrul REGES / REVISAL.",
    recommended: true,
  },
  {
    id: "excel",
    icon: FileSpreadsheet,
    label: "Upload Excel / CSV",
    description: "Încarcă un fișier Excel (.xlsx) sau CSV cu lista angajaților.",
    recommended: false,
  },
  {
    id: "manual",
    icon: UserPlus,
    label: "Adaugă manual",
    description: "Adaugă angajații manual, unul câte unul, din interfață.",
    recommended: false,
  },
]

export type ImportMethod = "reges" | "excel" | "manual" | ""

interface Props {
  method: ImportMethod
  file: File | null
  onMethodChange: (method: ImportMethod) => void
  onFileChange: (file: File | null) => void
  onNext: () => void
  onBack: () => void
}

export function StepImport({
  method,
  file,
  onMethodChange,
  onFileChange,
  onNext,
  onBack,
}: Props) {
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) onFileChange(droppedFile)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) onFileChange(selectedFile)
  }

  const isValid = method !== "" && (method !== "excel" || file !== null)

  return (
    <StepWrapper
      title="Import Angajați"
      subtitle="Alege cum dorești să adaugi angajații în platformă."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid}
    >
      <div className="flex flex-col gap-4">
        {/* Method cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {importMethods.map((m) => {
            const isSelected = method === m.id
            const Icon = m.icon

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onMethodChange(m.id as ImportMethod)
                  if (m.id !== "excel") onFileChange(null)
                }}
                className={`
                  relative flex flex-col items-center gap-3 rounded-xl border-2 px-4 py-5 text-center transition-all duration-200
                  ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/40 hover:bg-accent/50"
                  }
                `}
              >
                {m.recommended && (
                  <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    <Star className="h-3 w-3" fill="currentColor" />
                    Recomandat
                  </span>
                )}

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                    isSelected ? "bg-primary/10" : "bg-accent"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {m.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* File dropzone (shown only for excel method) */}
        {method === "excel" && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200
              ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40"
              }
            `}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="sr-only"
              id="file-upload"
            />

            {file ? (
              <div className="flex items-center gap-3 rounded-lg bg-accent px-4 py-3">
                <FileUp className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onFileChange(null)}
                  className="ml-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Elimină fișierul"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground/50" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Trage fișierul aici sau{" "}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      alege de pe disc
                    </button>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    .xlsx, .xls sau .csv (max. 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </StepWrapper>
  )
}
