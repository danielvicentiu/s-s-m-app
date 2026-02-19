import { Check } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export interface PlanData {
  name: string
  monthlyPrice: number
  annualPrice: number
  audience: string
  features: string[]
  cta: string
  ctaHref: string
  highlighted?: boolean
  badge?: string
}

interface PlanCardProps {
  plan: PlanData
  isAnnual: boolean
}

export function PlanCard({ plan, isAnnual }: PlanCardProps) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
  const isHighlighted = plan.highlighted

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-shadow ${
        isHighlighted
          ? 'border-primary bg-card shadow-xl shadow-primary/10 ring-1 ring-primary'
          : 'border-border bg-card shadow-sm hover:shadow-md'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className={`text-lg font-bold ${
            isHighlighted ? 'text-primary' : 'text-foreground'
          }`}
        >
          {plan.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{plan.audience}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {price.toLocaleString('ro-RO')}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            &nbsp;LEI{isAnnual ? '/an' : '/lună'}
          </span>
        </div>
        {isAnnual && (
          <p className="mt-1 text-xs text-muted-foreground">
            echivalent {Math.round(plan.annualPrice / 12).toLocaleString('ro-RO')} LEI/lună
          </p>
        )}
      </div>

      {plan.name === 'Enterprise' ? (
        <a
          href={plan.ctaHref}
          className={`mb-8 block rounded-lg py-3 text-center text-sm font-semibold transition-all bg-header-bg text-header-foreground hover:opacity-90`}
        >
          {plan.cta}
        </a>
      ) : (
        <Link
          href={plan.ctaHref as any}
          className={`mb-8 block rounded-lg py-3 text-center text-sm font-semibold transition-all ${
            isHighlighted
              ? 'bg-primary text-primary-foreground hover:opacity-90'
              : 'border border-primary bg-card text-primary hover:bg-primary/5'
          }`}
        >
          {plan.cta}
        </Link>
      )}

      <div className="flex flex-1 flex-col">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ce este inclus
        </p>
        <ul className="flex flex-col gap-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  isHighlighted ? 'text-primary' : 'text-primary/70'
                }`}
              />
              <span className="text-sm leading-snug text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
