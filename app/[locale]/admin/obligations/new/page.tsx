import { redirect } from 'next/navigation'
import { isSuperAdmin, hasRole } from '@/lib/rbac'
import AdminFormPlaceholder from '@/components/admin/AdminFormPlaceholder'

export default async function NewObligationPage() {
  const admin = await isSuperAdmin()
  const consultant = await hasRole('consultant_ssm')

  if (!admin && !consultant) redirect('/unauthorized')

  return (
    <AdminFormPlaceholder
      title="Adaugă Obligație Nouă"
      description="Formular CRUD în dezvoltare — disponibil în versiunea următoare"
      backLink="/admin/obligations"
      backLabel="Înapoi la Listă Obligații"
    />
  )
}
