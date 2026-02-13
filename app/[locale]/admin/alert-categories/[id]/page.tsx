import { redirect } from 'next/navigation'
import AdminFormPlaceholder from '@/components/admin/AdminFormPlaceholder'
import { isSuperAdmin, hasRole } from '@/lib/rbac'

export default async function EditAlertCategoryPage() {
  const admin = await isSuperAdmin()
  const consultant = await hasRole('consultant_ssm')

  if (!admin && !consultant) {redirect('/unauthorized')}

  return (
    <AdminFormPlaceholder
      title="Editează Categorie Alertă"
      description="Formular CRUD în dezvoltare — disponibil în versiunea următoare"
      backLink="/admin/alert-categories"
      backLabel="Înapoi la Listă Categorii"
    />
  )
}
