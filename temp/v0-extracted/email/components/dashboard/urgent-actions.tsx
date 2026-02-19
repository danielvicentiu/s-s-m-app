import { AlertCircle, Clock, ChevronRight } from "lucide-react"

const actions = [
  {
    title: "Fișa SSM - Departament Logistică",
    detail: "Expiră în 2 zile",
    priority: "red" as const,
  },
  {
    title: "Instruire PSI - Echipa Producție",
    detail: "Termen depășit cu 3 zile",
    priority: "red" as const,
  },
  {
    title: "Examen medical - Pop Ioana",
    detail: "Expiră în 7 zile",
    priority: "yellow" as const,
  },
  {
    title: "Verificare ISCIR - Stivuitor #4",
    detail: "Expiră în 14 zile",
    priority: "yellow" as const,
  },
  {
    title: "Actualizare politică GDPR",
    detail: "Revizuire anuală planificată",
    priority: "green" as const,
  },
]

const priorityStyles = {
  red: "bg-red-50 text-red-700 border-red-200",
  yellow: "bg-amber-50 text-amber-700 border-amber-200",
  green: "bg-green-50 text-green-700 border-green-200",
}

const priorityLabels = {
  red: "Urgent",
  yellow: "Atenție",
  green: "Normal",
}

export function UrgentActions() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Acțiuni Urgente
        </h3>
        <span className="text-xs text-muted-foreground">5 acțiuni</span>
      </div>
      <ul className="flex flex-1 flex-col gap-2.5">
        {actions.map((action, i) => (
          <li
            key={i}
            className="group flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-accent"
          >
            <AlertCircle
              className={`h-4 w-4 shrink-0 ${
                action.priority === "red"
                  ? "text-red-500"
                  : action.priority === "yellow"
                    ? "text-amber-500"
                    : "text-green-500"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {action.title}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {action.detail}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priorityStyles[action.priority]}`}
            >
              {priorityLabels[action.priority]}
            </span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </li>
        ))}
      </ul>
    </div>
  )
}
