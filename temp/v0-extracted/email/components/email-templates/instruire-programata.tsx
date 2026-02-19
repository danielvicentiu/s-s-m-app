"use client"

import { CalendarDays, MapPin, User, Users, Clock, ExternalLink, CalendarPlus } from "lucide-react"

interface Participant {
  name: string
  department: string
  status: "confirmed" | "pending"
}

const participants: Participant[] = [
  { name: "Popescu Maria", department: "Producție", status: "confirmed" },
  { name: "Ionescu Adrian", department: "Logistică", status: "pending" },
  { name: "Dumitrescu Ion", department: "Mentenanță", status: "confirmed" },
  { name: "Georgescu Ana", department: "Administrare", status: "confirmed" },
  { name: "Moldovan Radu", department: "Depozit", status: "pending" },
  { name: "Stan Elena", department: "Producție", status: "confirmed" },
  { name: "Popa Cristian", department: "Logistică", status: "pending" },
  { name: "Radu Alexandra", department: "Calitate", status: "confirmed" },
]

const trainingDetails = [
  { icon: CalendarDays, label: "Data și ora", value: "15 martie 2026, ora 09:00" },
  { icon: Clock, label: "Durată", value: "4 ore (09:00 — 13:00)" },
  { icon: MapPin, label: "Locația", value: "Sala de conferințe — Corp A, etaj 2" },
  { icon: User, label: "Instructor", value: "Dr. Mihai Constantinescu" },
  { icon: Users, label: "Participanți", value: `${participants.length} angajați convocați` },
]

export function InstruireProgramata() {
  const confirmed = participants.filter((p) => p.status === "confirmed").length

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "'Inter', Arial, sans-serif",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Blue accent header */}
      <div
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          padding: "28px 32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarDays style={{ width: 20, height: 20, color: "#ffffff" }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
            s-s-m.ro
          </span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
          Instruire Programată
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "6px 0 0", lineHeight: 1.5 }}>
          Instruire periodică SSM — Securitate și sănătate în muncă
        </p>
      </div>

      {/* Training details card */}
      <div style={{ padding: "24px 32px 0" }}>
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            padding: "20px 24px",
          }}
        >
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: "0 0 16px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
            Detalii instruire
          </h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
            {trainingDetails.map((d) => (
              <div key={d.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <d.icon style={{ width: 16, height: 16, color: "#2563eb" }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>
                    {d.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "20px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Confirmări primite</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
            {confirmed}/{participants.length}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, backgroundColor: "#e2e8f0", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${(confirmed / participants.length) * 100}%`,
              borderRadius: 3,
              backgroundColor: "#2563eb",
            }}
          />
        </div>
      </div>

      {/* Participants table */}
      <div style={{ padding: "20px 32px 24px" }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: "0 0 12px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
          Lista participanți
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse" as const,
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              {["Nume", "Departament", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left" as const,
                    padding: "10px 8px",
                    fontWeight: 700,
                    fontSize: 11,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.06em",
                    color: "#64748b",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {participants.map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600, color: "#1e293b" }}>
                  {p.name}
                </td>
                <td style={{ padding: "12px 8px", color: "#475569" }}>
                  {p.department}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 10px",
                      borderRadius: 20,
                      backgroundColor: p.status === "confirmed" ? "#f0fdf4" : "#fffbeb",
                      color: p.status === "confirmed" ? "#16a34a" : "#d97706",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {p.status === "confirmed" ? "Confirmat" : "Așteaptă"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA buttons */}
      <div style={{ padding: "0 32px 8px", textAlign: "center" as const }}>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 32px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          Confirmă Participarea
          <ExternalLink style={{ width: 14, height: 14 }} />
        </a>
      </div>
      <div style={{ padding: "8px 32px 28px", textAlign: "center" as const }}>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#2563eb",
            textDecoration: "none",
          }}
        >
          <CalendarPlus style={{ width: 14, height: 14 }} />
          Adaugă în calendar
        </a>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "20px 32px",
          textAlign: "center" as const,
          backgroundColor: "#f8fafc",
        }}
      >
        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>
          {"Primit de la "}
          <span style={{ fontWeight: 600, color: "#64748b" }}>s-s-m.ro</span>
          {" | "}
          <a href="#" style={{ color: "#2563eb", textDecoration: "underline" }}>
            Dezabonare
          </a>
          {" | "}
          <a href="mailto:alerte@s-s-m.ro" style={{ color: "#2563eb", textDecoration: "underline" }}>
            alerte@s-s-m.ro
          </a>
        </p>
      </div>
    </div>
  )
}
