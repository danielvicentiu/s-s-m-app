const stats = [
  { value: "38+", label: "Module live" },
  { value: "100+", label: "Clienți activi" },
  { value: "6", label: "Limbi suportate" },
  { value: "5", label: "Țări CEE" },
]

export function Stats() {
  return (
    <section className="bg-header-bg px-6 py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-4xl font-extrabold tracking-tight text-header-foreground md:text-5xl">
              {stat.value}
            </div>
            <div className="mt-2 text-sm font-medium text-header-foreground/60">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
