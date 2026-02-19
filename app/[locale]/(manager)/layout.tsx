// app/[locale]/(manager)/layout.tsx
// Layout pentru sectiunea manager/consultant
// Auth check si DashboardSidebar sunt delegate in dashboard/layout.tsx
// Mosteneste ThemeProvider + NextIntlClientProvider din [locale]/layout.tsx

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
