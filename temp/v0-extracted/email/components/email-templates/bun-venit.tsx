"use client"

import { Shield, Users, CalendarDays, FileText, ExternalLink, Mail } from "lucide-react"

const steps = [
  {
    number: "1",
    icon: Users,
    title: "Adaugă angajații",
    description: "Importă rapid din REGES/REVISAL sau încarcă un fișier Excel cu datele angajaților.",
  },
  {
    number: "2",
    icon: CalendarDays,
    title: "Completează instruirile",
    description: "Calendarul automat planifică instruirile obligatorii SSM și PSI pentru fiecare angajat.",
  },
  {
    number: "3",
    icon: FileText,
    title: "Generează documente",
    description: "Fișe de instruire, evaluări de risc și rapoarte PDF conforme — generate automat.",
  },
]

export function BunVenit() {
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
      {/* Green accent header */}
      <div
        style={{
          background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
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
            <Shield style={{ width: 20, height: 20, color: "#ffffff" }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
            s-s-m.ro
          </span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
          Bun venit pe s-s-m.ro, Andrei!
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: "6px 0 0", lineHeight: 1.5 }}>
          Contul tău a fost creat cu succes. Iată cum poți începe.
        </p>
      </div>

      {/* Welcome body */}
      <div style={{ padding: "28px 32px 0" }}>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 8px" }}>
          Salut Andrei,
        </p>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 24px" }}>
          {"Felicitări! Ai făcut primul pas către conformitatea completă SSM, PSI, GDPR și NIS2. Platforma s-s-m.ro te va ghida în fiecare etapă. Urmează cei 3 pași de mai jos pentru a configura totul:"}
        </p>
      </div>

      {/* 3-step cards */}
      <div style={{ padding: "0 32px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                display: "flex",
                gap: 16,
                padding: "20px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative" as const,
                }}
              >
                <step.icon style={{ width: 20, height: 20, color: "#16a34a" }} />
                <span
                  style={{
                    position: "absolute" as const,
                    top: -4,
                    right: -4,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    fontSize: 10,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step.number}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account info */}
      <div style={{ padding: "0 32px 24px" }}>
        <div
          style={{
            padding: "16px 20px",
            borderRadius: 10,
            backgroundColor: "#eff6ff",
            border: "1px solid #bfdbfe",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 10 }}>
            Detaliile contului tău
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 6, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Companie</span>
              <span style={{ fontWeight: 600, color: "#1e293b" }}>Construct Group SRL</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Plan</span>
              <span style={{ fontWeight: 600, color: "#1e293b" }}>Professional — 30 zile gratuit</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Email</span>
              <span style={{ fontWeight: 600, color: "#1e293b" }}>andrei@constructgroup.ro</span>
            </div>
          </div>
        </div>
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
            backgroundColor: "#16a34a",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          Mergi la Panoul de Control
          <ExternalLink style={{ width: 14, height: 14 }} />
        </a>
      </div>

      {/* Help line */}
      <div style={{ padding: "0 32px 24px", textAlign: "center" as const }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            borderRadius: 8,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <Mail style={{ width: 14, height: 14, color: "#64748b" }} />
          <span style={{ fontSize: 13, color: "#64748b" }}>
            {"Ai nevoie de ajutor? Scrie-ne la "}
            <a href="mailto:suport@s-s-m.ro" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
              suport@s-s-m.ro
            </a>
          </span>
        </div>
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
