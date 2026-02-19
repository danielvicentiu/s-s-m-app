import { Check, Minus } from "lucide-react"

interface Feature {
  name: string
  start: boolean
  professional: boolean
  enterprise: boolean
}

const comparisonFeatures: Feature[] = [
  { name: "SSM de bază", start: true, professional: true, enterprise: true },
  { name: "PSI de bază", start: true, professional: true, enterprise: true },
  { name: "Rapoarte PDF", start: true, professional: true, enterprise: true },
  { name: "Suport email", start: true, professional: true, enterprise: true },
  { name: "Modul GDPR", start: false, professional: true, enterprise: true },
  { name: "Medicina Muncii", start: false, professional: true, enterprise: true },
  { name: "Near-Miss Reporting", start: false, professional: true, enterprise: true },
  { name: "Calendar instruiri", start: false, professional: true, enterprise: true },
  { name: "Import REGES/REVISAL", start: false, professional: true, enterprise: true },
  { name: "Suport prioritar", start: false, professional: true, enterprise: true },
  { name: "NIS2 compliance", start: false, professional: false, enterprise: true },
  { name: "ISCIR management", start: false, professional: false, enterprise: true },
  { name: "Asistent VA-AI", start: false, professional: false, enterprise: true },
  { name: "Acces API", start: false, professional: false, enterprise: true },
  { name: "Utilizatori nelimitați", start: false, professional: false, enterprise: true },
  { name: "Manager dedicat", start: false, professional: false, enterprise: true },
  { name: "SLA 99.9%", start: false, professional: false, enterprise: true },
]

function CellIcon({ included }: { included: boolean }) {
  return included ? (
    <Check className="mx-auto h-5 w-5 text-primary" aria-label="Inclus" />
  ) : (
    <Minus className="mx-auto h-5 w-5 text-muted-foreground/30" aria-label="Nu este inclus" />
  )
}

export function ComparisonTable() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          {"Compară toate funcționalitățile"}
        </h2>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  {"Funcționalitate"}
                </th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Start</th>
                <th className="px-6 py-4 text-center font-semibold text-primary">Professional</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, i) => (
                <tr
                  key={feature.name}
                  className={`border-b border-border last:border-b-0 ${
                    i % 2 === 0 ? "bg-card" : "bg-muted/20"
                  }`}
                >
                  <td className="px-6 py-3.5 text-foreground/80">{feature.name}</td>
                  <td className="px-6 py-3.5">
                    <CellIcon included={feature.start} />
                  </td>
                  <td className="px-6 py-3.5 bg-primary/[0.03]">
                    <CellIcon included={feature.professional} />
                  </td>
                  <td className="px-6 py-3.5">
                    <CellIcon included={feature.enterprise} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked view */}
        <div className="flex flex-col gap-8 md:hidden">
          {(["Start", "Professional", "Enterprise"] as const).map((planName) => {
            const key = planName === "Start" ? "start" : planName === "Professional" ? "professional" : "enterprise"
            return (
              <div key={planName} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className={`px-5 py-3 font-semibold text-sm ${planName === "Professional" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"}`}>
                  {planName}
                </div>
                <ul className="divide-y divide-border">
                  {comparisonFeatures.map((feature) => (
                    <li key={feature.name} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-foreground/80">{feature.name}</span>
                      <CellIcon included={feature[key]} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
