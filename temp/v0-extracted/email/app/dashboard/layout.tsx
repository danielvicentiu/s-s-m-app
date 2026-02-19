import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panou de Control — s-s-m.ro",
  description:
    "Panou de control pentru managementul securității și sănătății în muncă.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
