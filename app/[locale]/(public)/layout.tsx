// app/[locale]/(public)/layout.tsx
// Layout minimal pentru pagini publice (fara auth, fara sidebar)
// Mosteneste ThemeProvider + NextIntlClientProvider din [locale]/layout.tsx

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
