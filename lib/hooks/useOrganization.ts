import { useOrganizationContext } from '@/lib/contexts/OrganizationContext'

/**
 * Hook pentru accesul la contextul organizației curente
 *
 * Returnează:
 * - currentOrg: organizația curentă selectată cu toate detaliile
 * - organizations: lista tuturor organizațiilor la care utilizatorul are acces
 * - switchOrg: funcție pentru schimbarea organizației curente
 * - refreshOrganizations: funcție pentru reîncărcarea listei de organizații
 * - isLoading: stare de încărcare
 * - error: mesaj de eroare (dacă există)
 * - orgId: ID-ul organizației curente (shortcut)
 * - orgName: numele organizației curente (shortcut)
 * - plan: planul organizației curente (shortcut)
 * - modules: modulele activate pentru organizația curentă (shortcut)
 * - settings: setările organizației curente (shortcut)
 *
 * @throws Error dacă este folosit în afara OrganizationProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentOrg, orgName, switchOrg, modules } = useOrganization()
 *
 *   if (!currentOrg) {
 *     return <div>Nicio organizație selectată</div>
 *   }
 *
 *   return (
 *     <div>
 *       <h1>{orgName}</h1>
 *       {modules?.medical && <MedicalModule />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useOrganization() {
  return useOrganizationContext()
}

export default useOrganization
