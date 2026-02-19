"use client"

import { useState } from "react"
import { Mail, Building2, ArrowRight, Lock, Info } from "lucide-react"

export function TabRegister() {
  const [email, setEmail] = useState("")
  const [cui, setCui] = useState("")
  const [terms, setTerms] = useState(false)

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-5"
      style={{ animation: "slideInRight .3s ease-out" }}
    >
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-email" className="text-sm font-medium text-foreground">
          Email <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="reg-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adresa@companie.ro"
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* CUI */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-cui" className="text-sm font-medium text-foreground">
          {"CUI (opțional \u2014 completăm automat datele firmei)"}
        </label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="reg-cui"
            type="text"
            value={cui}
            onChange={(e) => setCui(e.target.value)}
            placeholder="RO12345678"
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Terms checkbox */}
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          {"Accept "}
          <a href="#" className="font-medium text-primary hover:underline">Termenii și Condițiile</a>
          {" și "}
          <a href="#" className="font-medium text-primary hover:underline">Politica de Confidențialitate</a>
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={!terms}
        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Creează contul
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Confirmation info */}
      <div className="flex items-start gap-2 rounded-lg bg-secondary/60 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>Vei primi un email de confirmare. Configurarea contului durează 2 minute.</span>
      </div>

      {/* Data protection text */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        <span>Datele tale sunt protejate. Nu cerem informații sensibile la înregistrare.</span>
      </div>
    </form>
  )
}
