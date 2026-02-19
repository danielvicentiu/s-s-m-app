const companyNames = [
  "MedLife",
  "AutoTehnic Pro",
  "Construct Group SRL",
  "Alimentara Plus",
  "TransLog România",
  "Eco Steel Industries",
]

export function TrustedBy() {
  return (
    <section className="border-y border-border bg-muted/50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {"Peste 100 de companii au ales s-s-m.ro"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companyNames.map((name) => (
            <div
              key={name}
              className="text-lg font-bold tracking-tight text-muted-foreground/50"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
