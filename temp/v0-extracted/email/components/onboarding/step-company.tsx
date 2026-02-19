"use client"

import { Building2 } from "lucide-react"
import { StepWrapper } from "./step-wrapper"

const counties = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
  "Brăila", "Brașov", "București", "Buzău", "Călărași", "Caraș-Severin",
  "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
  "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
  "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare",
  "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea",
  "Vrancea",
]

export interface CompanyData {
  companyName: string
  cui: string
  caen: string
  county: string
  city: string
  address: string
}

interface Props {
  data: CompanyData
  onChange: (data: CompanyData) => void
  onNext: () => void
}

function InputField({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}

export function StepCompany({ data, onChange, onNext }: Props) {
  const update = (field: keyof CompanyData, value: string) =>
    onChange({ ...data, [field]: value })

  const isValid =
    data.companyName.trim() !== "" &&
    data.cui.trim() !== "" &&
    data.county !== ""

  return (
    <StepWrapper
      title="Compania Ta"
      subtitle="Completează datele companiei pentru configurarea contului."
      onNext={onNext}
      nextDisabled={!isValid}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <InputField
            label="Denumirea companiei"
            id="companyName"
            value={data.companyName}
            onChange={(v) => update("companyName", v)}
            placeholder="SC Exemplu SRL"
          />
        </div>
        <InputField
          label="CUI (Cod Unic de Înregistrare)"
          id="cui"
          value={data.cui}
          onChange={(v) => update("cui", v)}
          placeholder="RO12345678"
        />
        <InputField
          label="Cod CAEN"
          id="caen"
          value={data.caen}
          onChange={(v) => update("caen", v)}
          placeholder="4520"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="county" className="text-sm font-medium text-foreground">
            Județ
          </label>
          <div className="relative">
            <select
              id="county"
              value={data.county}
              onChange={(e) => update("county", e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-card px-3.5 py-2.5 pr-10 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selectează județul</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Building2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <InputField
          label="Oraș"
          id="city"
          value={data.city}
          onChange={(v) => update("city", v)}
          placeholder="Cluj-Napoca"
        />
        <div className="sm:col-span-2">
          <InputField
            label="Adresă"
            id="address"
            value={data.address}
            onChange={(v) => update("address", v)}
            placeholder="Str. Exemplu nr. 10, et. 2"
          />
        </div>
      </div>
    </StepWrapper>
  )
}
