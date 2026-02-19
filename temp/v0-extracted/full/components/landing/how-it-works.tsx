import { UserPlus, Upload, CheckCircle } from "lucide-react"

const steps = [
  {
    number: "1",
    icon: UserPlus,
    title: "Creează contul",
    description:
      "Înregistrare rapidă în mai puțin de 2 minute. Fără card de credit necesar.",
  },
  {
    number: "2",
    icon: Upload,
    title: "Importă angajații",
    description:
      "Încarcă lista de angajați din Excel sau adaugă-i manual, unul câte unul.",
  },
  {
    number: "3",
    icon: CheckCircle,
    title: "Conformitate automată",
    description:
      "Platforma generează automat documentația și te notifică la fiecare termen limită.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-muted/50 px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Cum funcționează
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Trei pași simpli pentru conformitate totală.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              {/* Step number */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                {step.number}
              </div>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
