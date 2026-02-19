import { redirect } from 'next/navigation'
import { isSuperAdmin, hasRole } from '@/lib/rbac'
import AdminFormPlaceholder from '@/components/admin/AdminFormPlaceholder'

export default async function NewAlertCategoryPage() {
  const admin = await isSuperAdmin()
  const consultant = await hasRole('consultant_ssm')

  if (!admin && !consultant) redirect('/unauthorized')

  return (
    <AdminFormPlaceholder
      title="Adaugă Categorie Alertă Nouă"
      description="Formular CRUD în dezvoltare — disponibil în versiunea următoare"
      backLink="/admin/alert-categories"
      backLabel="Înapoi la Listă Categorii"
    />
  )
}
