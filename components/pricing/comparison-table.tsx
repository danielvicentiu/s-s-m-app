import { Check, Minus } from 'lucide-react'

interface Feature {
  name: string
  starter: boolean
  professional: boolean
  enterprise: boolean
}

const comparisonFeatures: Feature[] = [
  { name: 'SSM de bază', starter: true, professional: true, enterprise: true },
  { name: 'PSI de bază', starter: true, professional: true, enterprise: true },
  { name: 'Rapoarte PDF', starter: true, professional: true, enterprise: true },
  { name: 'Alerte email automate', starter: true, professional: true, enterprise: true },
  { name: 'Suport email', starter: true, professional: true, enterprise: true },
  { name: 'Modul GDPR', starter: false, professional: true, enterprise: true },
  { name: 'Medicina Muncii', starter: false, professional: true, enterprise: true },
  { name: 'Near-Miss Reporting', starter: false, professional: true, enterprise: true },
  { name: 'Calendar instruiri', starter: false, professional: true, enterprise: true },
  { name: 'Import REGES/REVISAL', starter: false, professional: true, enterprise: true },
  { name: 'Suport prioritar', starter: false, professional: true, enterprise: true },
  { name: 'NIS2 compliance', starter: false, professional: false, enterprise: true },
  { name: 'ISCIR management', starter: false, professional: false, enterprise: true },
  { name: 'Automatizări avansate', starter: false, professional: false, enterprise: true },
  { name: 'Acces API', starter: false, professional: false, enterprise: true },
  { name: 'Utilizatori nelimitați', starter: false, professional: false, enterprise: true },
  { name: 'Manager dedicat', starter: false, professional: false, enterprise: true },
  { name: 'SLA 99.9%', starter: false, professional: false, enterprise: true },
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
          Compară toate funcționalitățile
        </h2>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Funcționalitate
                </th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Starter</th>
                <th className="px-6 py-4 text-center font-semibold text-primary">Professional</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, i) => (
                <tr
                  key={feature.name}
                  className={`border-b border-border last:border-b-0 ${
                    i % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                  }`}
                >
                  <td className="px-6 py-3.5 text-foreground/80">{feature.name}</td>
                  <td className="px-6 py-3.5">
                    <CellIcon included={feature.starter} />
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
          {(['Starter', 'Professional', 'Enterprise'] as const).map((planName) => {
            const key = planName === 'Starter' ? 'starter' : planName === 'Professional' ? 'professional' : 'enterprise'
            return (
              <div key={planName} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className={`px-5 py-3 font-semibold text-sm ${planName === 'Professional' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground'}`}>
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
