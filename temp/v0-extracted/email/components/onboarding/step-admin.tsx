"use client"

import { Eye, EyeOff, UserCog } from "lucide-react"
import { useState } from "react"
import { StepWrapper } from "./step-wrapper"

const roles = [
  "Administrator",
  "Inspector SSM",
  "Responsabil PSI",
  "Manager HR",
]

export interface AdminData {
  fullName: string
  email: string
  phone: string
  role: string
  password: string
  confirmPassword: string
}

interface Props {
  data: AdminData
  onChange: (data: AdminData) => void
  onNext: () => void
  onBack: () => void
}

export function StepAdmin({ data, onChange, onNext, onBack }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const update = (field: keyof AdminData, value: string) =>
    onChange({ ...data, [field]: value })

  const passwordsMatch =
    data.password.length >= 8 && data.password === data.confirmPassword
  const isValid =
    data.fullName.trim() !== "" &&
    data.email.includes("@") &&
    data.role !== "" &&
    passwordsMatch

  return (
    <StepWrapper
      title="Primul Administrator"
      subtitle="Creează contul de administrator principal."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Nume complet
          </label>
          <input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Ion Popescu"
            className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="ion@compania.ro"
            className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+40 7XX XXX XXX"
            className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="role" className="text-sm font-medium text-foreground">
            Rol
          </label>
          <div className="relative">
            <select
              id="role"
              value={data.role}
              onChange={(e) => update("role", e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-card px-3.5 py-2.5 pr-10 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selectează rolul</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <UserCog className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Parolă
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Min. 8 caractere"
              className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {data.password.length > 0 && data.password.length < 8 && (
            <p className="text-xs text-destructive">
              Parola trebuie să aibă cel puțin 8 caractere.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirmă parola
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={data.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Repetă parola"
              className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showConfirm ? "Ascunde parola" : "Arată parola"}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {data.confirmPassword.length > 0 &&
            data.password !== data.confirmPassword && (
              <p className="text-xs text-destructive">
                Parolele nu se potrivesc.
              </p>
            )}
        </div>
      </div>
    </StepWrapper>
  )
}
