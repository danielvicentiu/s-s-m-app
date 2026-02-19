"use client"

import { AlertTriangle, ExternalLink } from "lucide-react"

interface AlertRow {
  tip: string
  detalii: string
  dataExpirare: string
  zileRamase: number
}

const mockRows: AlertRow[] = [
  { tip: "Fișă medicală", detalii: "Popescu Maria — Departament Producție", dataExpirare: "12.01.2026", zileRamase: -15 },
  { tip: "Echipament PSI", detalii: "Stingător CO2 — Hala B, etaj 2", dataExpirare: "28.01.2026", zileRamase: -2 },
  { tip: "Instruire SSM", detalii: "Ionescu Adrian — Instruire periodică", dataExpirare: "05.02.2026", zileRamase: 0 },
  { tip: "Fișă medicală", detalii: "Dumitrescu Ion — Departament Logistică", dataExpirare: "18.02.2026", zileRamase: 7 },
  { tip: "Echipament PSI", detalii: "Hidrant interior — Corp A", dataExpirare: "22.02.2026", zileRamase: 11 },
  { tip: "Instruire PSI", detalii: "Georgescu Ana — Instruire introductivă", dataExpirare: "01.03.2026", zileRamase: 18 },
  { tip: "Autorizație ISCIR", detalii: "Elevator marfă — Depozit central", dataExpirare: "05.03.2026", zileRamase: 4 },
  { tip: "Instruire SSM", detalii: "Moldovan Radu — Instruire la locul de muncă", dataExpirare: "08.03.2026", zileRamase: 14 },
  { tip: "Echipament PSI", detalii: "Detector fum — Birou administrativ", dataExpirare: "10.03.2026", zileRamase: 22 },
  { tip: "Fișă medicală", detalii: "Stan Elena — Departament Vânzări", dataExpirare: "15.03.2026", zileRamase: 28 },
]

function getBadge(zile: number) {
  if (zile < 0)
    return { label: `${Math.abs(zile)} zile expirat`, bg: "#fef2f2", text: "#dc2626", dot: "#dc2626" }
  if (zile <= 7)
    return { label: `${zile} zile rămase`, bg: "#fff7ed", text: "#ea580c", dot: "#ea580c" }
  return { label: `${zile} zile rămase`, bg: "#fefce8", text: "#ca8a04", dot: "#ca8a04" }
}

const expired = mockRows.filter((r) => r.zileRamase < 0).length
const critical = mockRows.filter((r) => r.zileRamase >= 0 && r.zileRamase <= 7).length
const warning = mockRows.filter((r) => r.zileRamase > 7).length

export function AlerteConformitate() {
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
      {/* Red accent header */}
      <div
        style={{
          background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
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
            <AlertTriangle style={{ width: 20, height: 20, color: "#ffffff" }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
            s-s-m.ro
          </span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
          Alerte Conformitate — Construct Group SRL
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "6px 0 0", lineHeight: 1.5 }}>
          Aveți documente și termene care necesită atenție imediată.
        </p>
      </div>

      {/* Stats summary */}
      <div style={{ padding: "20px 32px 0" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap" as const,
          }}
        >
          {[
            { count: expired, label: "expirate", bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
            { count: critical, label: "critice", bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
            { count: warning, label: "atenție", bg: "#fefce8", text: "#ca8a04", border: "#fef08a" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: "1 1 0",
                minWidth: 100,
                textAlign: "center" as const,
                padding: "14px 12px",
                borderRadius: 10,
                backgroundColor: s.bg,
                border: `1px solid ${s.border}`,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: s.text, lineHeight: 1 }}>
                {s.count}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: s.text, marginTop: 4, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: "24px 32px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse" as const,
            fontSize: 13,
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "2px solid #e2e8f0",
              }}
            >
              {["Tip", "Detalii", "Data expirare", "Status"].map((h) => (
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
            {mockRows.map((row, i) => {
              const badge = getBadge(row.zileRamase)
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 8px",
                      fontWeight: 600,
                      color: "#1e293b",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {row.tip}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#475569",
                      maxWidth: 200,
                    }}
                  >
                    {row.detalii}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#475569",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {row.dataExpirare}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px",
                        borderRadius: 20,
                        backgroundColor: badge.bg,
                        color: badge.text,
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: badge.dot,
                          display: "inline-block",
                        }}
                      />
                      {badge.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 32px 28px", textAlign: "center" as const }}>
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
          Accesează Panoul de Control
          <ExternalLink style={{ width: 14, height: 14 }} />
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
