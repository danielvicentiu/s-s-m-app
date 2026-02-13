import { redirect } from 'next/navigation'
import AdminFormPlaceholder from '@/components/admin/AdminFormPlaceholder'
import { isSuperAdmin, hasRole } from '@/lib/rbac'

export default async function EditObligationPage() {
  const admin = await isSuperAdmin()
  const consultant = await hasRole('consultant_ssm')

  if (!admin && !consultant) {redirect('/unauthorized')}

  return (
    <AdminFormPlaceholder
      title="Editează Obligație"
      description="Formular CRUD în dezvoltare — disponibil în versiunea următoare"
      backLink="/admin/obligations"
      backLabel="Înapoi la Listă Obligații"
    />
  )
}
