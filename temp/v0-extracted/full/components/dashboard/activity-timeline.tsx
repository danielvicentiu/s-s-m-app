import { FileText, UserPlus, CheckCircle, AlertTriangle, Upload } from "lucide-react"

const activities = [
  {
    icon: CheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    text: "Instruire SSM finalizată - Echipa Vânzări",
    time: "Acum 25 min",
  },
  {
    icon: Upload,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    text: "Import REVISAL - 12 angajați noi adăugați",
    time: "Acum 1 oră",
  },
  {
    icon: FileText,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    text: "Raport PDF generat - Evaluare riscuri Q1",
    time: "Acum 2 ore",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    text: "Alertă: Fișa medicală expiră pentru 3 angajați",
    time: "Acum 4 ore",
  },
  {
    icon: UserPlus,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    text: "Utilizator nou: Maria Ionescu (HR Manager)",
    time: "Ieri, 16:30",
  },
  {
    icon: CheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    text: "Verificare ISCIR completată - Elevator #2",
    time: "Ieri, 11:15",
  },
]

export function ActivityTimeline() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Activitate Recentă
        </h3>
        <a
          href="#"
          className="text-xs font-medium text-primary hover:underline"
        >
          Vezi tot
        </a>
      </div>
      <ul className="flex flex-1 flex-col gap-0">
        {activities.map((act, i) => (
          <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
            {/* Vertical line connector */}
            {i < activities.length - 1 && (
              <span className="absolute top-7 left-[15px] h-[calc(100%-16px)] w-px bg-border" />
            )}
            <div
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${act.iconBg}`}
            >
              <act.icon className={`h-3.5 w-3.5 ${act.iconColor}`} />
            </div>
            <div className="min-w-0 pt-1">
              <p className="text-sm leading-snug text-foreground">
                {act.text}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {act.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
