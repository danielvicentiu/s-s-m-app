// app/[locale]/(admin)/layout.tsx
// Layout pentru sectiunea admin (super_admin only)
// Auth check si AdminSidebar sunt delegate in admin/layout.tsx
// Mosteneste ThemeProvider + NextIntlClientProvider din [locale]/layout.tsx

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
