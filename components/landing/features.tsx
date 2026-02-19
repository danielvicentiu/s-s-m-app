import {
  Shield,
  Flame,
  Lock,
  Network,
  HeartPulse,
  Cog,
  AlertTriangle,
  CalendarDays,
  FileText,
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Securitate în Muncă (SSM)',
    description:
      'Evaluarea riscurilor, fișele de instruire și documentația completă SSM, generate automat.',
  },
  {
    icon: Flame,
    title: 'Prevenirea Incendiilor (PSI)',
    description:
      'Planuri de evacuare, instruiri periodice și verificări ale echipamentelor PSI.',
  },
  {
    icon: Lock,
    title: 'Protecția Datelor (GDPR)',
    description:
      'Registru de prelucrări, politici de confidențialitate și managementul consimțămintelor.',
  },
  {
    icon: Network,
    title: 'Directiva NIS2',
    description:
      'Conformitate cu cerințele NIS2 pentru securitatea rețelelor și a sistemelor informatice.',
  },
  {
    icon: HeartPulse,
    title: 'Medicina Muncii',
    description:
      'Programări automate, fișele de aptitudine și urmărirea examenelor medicale.',
  },
  {
    icon: Cog,
    title: 'ISCIR & Echipamente',
    description:
      'Evidența echipamentelor sub incidența ISCIR, cu notificări pentru verificări periodice.',
  },
  {
    icon: AlertTriangle,
    title: 'Near-Miss Reporting',
    description:
      'Raportarea rapidă a incidentelor și aproape-accidentelor, cu analiza cauzelor.',
  },
  {
    icon: CalendarDays,
    title: 'Instruiri & Calendar',
    description:
      'Planificarea și urmărirea instruirilor obligatorii, cu reminder-e automate.',
  },
  {
    icon: FileText,
    title: 'Rapoarte PDF & Export',
    description:
      'Generarea automată de rapoarte conforme, gata de tipărit sau de trimis autorităților.',
  },
]

export function Features() {
  return (
    <section id="functionalitati" className="bg-background px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Tot ce ai nevoie pentru conformitate
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            O singură platformă care acoperă toate cerințele legale pentru
            securitatea și sănătatea în muncă.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
