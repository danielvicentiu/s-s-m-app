'use client'

import { Check, Minus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Feature {
  name: string
  starter: boolean
  professional: boolean
  enterprise: boolean
}

const FEATURE_BOOLEANS = [
  { starter: true,  professional: true,  enterprise: true  },
  { starter: true,  professional: true,  enterprise: true  },
  { starter: true,  professional: true,  enterprise: true  },
  { starter: true,  professional: true,  enterprise: true  },
  { starter: true,  professional: true,  enterprise: true  },
  { starter: false, professional: true,  enterprise: true  },
  { starter: false, professional: true,  enterprise: true  },
  { starter: false, professional: true,  enterprise: true  },
  { starter: false, professional: true,  enterprise: true  },
  { starter: false, professional: true,  enterprise: true  },
  { starter: false, professional: true,  enterprise: true  },
  { starter: false, professional: false, enterprise: true  },
  { starter: false, professional: false, enterprise: true  },
  { starter: false, professional: false, enterprise: true  },
  { starter: false, professional: false, enterprise: true  },
  { starter: false, professional: false, enterprise: true  },
  { starter: false, professional: false, enterprise: true  },
  { starter: false, professional: false, enterprise: true  },
]

function CellIcon({ included }: { included: boolean }) {
  return included ? (
    <Check className="mx-auto h-5 w-5 text-primary" aria-label="Inclus" />
  ) : (
    <Minus className="mx-auto h-5 w-5 text-muted-foreground/30" aria-label="Nu este inclus" />
  )
}

export function ComparisonTable() {
  const t = useTranslations('pricing')

  const featureNames = t.raw('comparisonFeatures') as string[]
  const comparisonFeatures: Feature[] = featureNames.map((name, i) => ({
    name,
    ...FEATURE_BOOLEANS[i],
  }))

  const planNames = {
    starter: t('starter.name'),
    professional: t('professional.name'),
    enterprise: t('enterprise.name'),
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          {t('compareTitle')}
        </h2>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  {t('featureCol')}
                </th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">{planNames.starter}</th>
                <th className="px-6 py-4 text-center font-semibold text-primary">{planNames.professional}</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">{planNames.enterprise}</th>
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
          {(Object.entries(planNames) as Array<[keyof typeof planNames, string]>).map(([key, name]) => (
            <div key={key} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className={`px-5 py-3 font-semibold text-sm ${key === 'professional' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground'}`}>
                {name}
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
          ))}
        </div>
      </div>
    </section>
  )
}
