"use client"

import { useState, useRef, useCallback } from "react"
import { GraduationCap, ArrowRight, HelpCircle } from "lucide-react"

const PIN_LENGTH = 6

export function TabQuickAccess() {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return
      const next = [...digits]
      next[index] = value.slice(-1)
      setDigits(next)
      if (value && index < PIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    },
    [digits],
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    },
    [digits],
  )

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH)
    if (!text) return
    const next = Array(PIN_LENGTH).fill("")
    text.split("").forEach((ch, i) => {
      next[i] = ch
    })
    setDigits(next)
    const focusIdx = Math.min(text.length, PIN_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
  }, [])

  const isFilled = digits.every((d) => d !== "")

  return (
    <div
      className="flex flex-col items-center gap-6 text-center"
      style={{ animation: "slideInRight .3s ease-out" }}
    >
      {/* Title */}
      <div>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Acces instruire</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Pentru angajații care accesează modulul de instruire
        </p>
      </div>

      {/* PIN inputs */}
      <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`Cifra ${i + 1} din ${PIN_LENGTH}`}
            className="h-14 w-12 rounded-lg border-2 border-border bg-background text-center text-xl font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        ))}
      </div>

      {/* Submit */}
      <button
        type="button"
        disabled={!isFilled}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {"Intră în instruire"}
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Help text */}
      <p className="text-xs text-muted-foreground/70">
        PIN-ul a fost primit de la angajatorul tău sau de la responsabilul SSM
      </p>

      {/* Contact admin link */}
      <a
        href="#"
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        {"Nu ai PIN? Contactează administratorul companiei."}
      </a>
    </div>
  )
}
