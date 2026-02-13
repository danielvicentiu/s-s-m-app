// lib/data/dashboard-widgets.ts
// Configurare widget-uri dashboard — 12 widget-uri configurabile
// Data: 13 Februarie 2026

export type WidgetType = 'stat' | 'chart' | 'list' | 'calendar' | 'actions' | 'feed'
export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl'
export type DashboardModule =
  | 'medical'
  | 'equipment'
  | 'training'
  | 'employees'
  | 'documents'
  | 'alerts'
  | 'calendar'
  | 'compliance'
  | 'all' // disponibil pentru toate modulele

export interface DashboardWidget {
  id: string
  title: string
  titleRO: string
  titleEN: string
  type: WidgetType
  size: WidgetSize
  module: DashboardModule
  refreshInterval?: number // în secunde, undefined = nu se reîmprospătează automat
  description?: string
  icon?: string // Lucide icon name
  isEnabled: boolean
  order: number
  minRole?: 'consultant' | 'firma_admin' | 'angajat' // rol minim necesar
}

/**
 * Configurare centrală a celor 12 widget-uri dashboard
 * Fiecare widget poate fi activat/dezactivat, reordonat și configurat
 */
export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  // 1. Compliance Score — scor general conformitate
  {
    id: 'compliance-score',
    title: 'Compliance Score',
    titleRO: 'Scor Conformitate',
    titleEN: 'Compliance Score',
    type: 'stat',
    size: 'md',
    module: 'compliance',
    refreshInterval: 300, // 5 minute
    description: 'Scorul general de conformitate SSM/PSI bazat pe expirări și alerte',
    icon: 'Shield',
    isEnabled: true,
    order: 1,
    minRole: 'angajat'
  },

  // 2. Expiring Trainings — instruiri care expiră
  {
    id: 'expiring-trainings',
    title: 'Expiring Trainings',
    titleRO: 'Instruiri Expirând',
    titleEN: 'Expiring Trainings',
    type: 'list',
    size: 'md',
    module: 'training',
    refreshInterval: 600, // 10 minute
    description: 'Lista instruirilor SSM/PSI care expiră în următoarele 30 de zile',
    icon: 'GraduationCap',
    isEnabled: true,
    order: 2,
    minRole: 'angajat'
  },

  // 3. Expiring Medical — medicina muncii expirând
  {
    id: 'expiring-medical',
    title: 'Expiring Medical',
    titleRO: 'Medicală Expirând',
    titleEN: 'Expiring Medical',
    type: 'list',
    size: 'md',
    module: 'medical',
    refreshInterval: 600, // 10 minute
    description: 'Fișe medicale care expiră în următoarele 30 de zile',
    icon: 'HeartPulse',
    isEnabled: true,
    order: 3,
    minRole: 'angajat'
  },

  // 4. Equipment Due — echipamente pentru verificare
  {
    id: 'equipment-due',
    title: 'Equipment Due',
    titleRO: 'Echipamente Scadente',
    titleEN: 'Equipment Due',
    type: 'list',
    size: 'md',
    module: 'equipment',
    refreshInterval: 600, // 10 minute
    description: 'Echipamente PSI care necesită verificare în următoarele 30 de zile',
    icon: 'Wrench',
    isEnabled: true,
    order: 4,
    minRole: 'angajat'
  },

  // 5. Recent Alerts — alerte recente
  {
    id: 'recent-alerts',
    title: 'Recent Alerts',
    titleRO: 'Alerte Recente',
    titleEN: 'Recent Alerts',
    type: 'list',
    size: 'md',
    module: 'alerts',
    refreshInterval: 120, // 2 minute
    description: 'Ultimele 5 alerte generate pentru organizație',
    icon: 'Bell',
    isEnabled: true,
    order: 5,
    minRole: 'angajat'
  },

  // 6. Employee Count — număr angajați
  {
    id: 'employee-count',
    title: 'Employee Count',
    titleRO: 'Număr Angajați',
    titleEN: 'Employee Count',
    type: 'stat',
    size: 'sm',
    module: 'employees',
    refreshInterval: 1800, // 30 minute
    description: 'Număr total angajați în organizație',
    icon: 'Users',
    isEnabled: true,
    order: 6,
    minRole: 'firma_admin'
  },

  // 7. Active Trainings — instruiri active
  {
    id: 'active-trainings',
    title: 'Active Trainings',
    titleRO: 'Instruiri Active',
    titleEN: 'Active Trainings',
    type: 'stat',
    size: 'sm',
    module: 'training',
    refreshInterval: 1800, // 30 minute
    description: 'Număr instruiri programate în următoarele 7 zile',
    icon: 'Calendar',
    isEnabled: true,
    order: 7,
    minRole: 'angajat'
  },

  // 8. Documents Count — număr documente generate
  {
    id: 'documents-count',
    title: 'Documents Count',
    titleRO: 'Documente Generate',
    titleEN: 'Documents Count',
    type: 'stat',
    size: 'sm',
    module: 'documents',
    refreshInterval: 1800, // 30 minute
    description: 'Număr total documente generate în ultima lună',
    icon: 'FileText',
    isEnabled: true,
    order: 8,
    minRole: 'firma_admin'
  },

  // 9. Calendar Next Events — următoarele evenimente
  {
    id: 'calendar-next-events',
    title: 'Calendar Next Events',
    titleRO: 'Următoarele Evenimente',
    titleEN: 'Calendar Next Events',
    type: 'calendar',
    size: 'lg',
    module: 'calendar',
    refreshInterval: 300, // 5 minute
    description: 'Următoarele 10 evenimente din calendar (instruiri, verificări, expirări)',
    icon: 'CalendarDays',
    isEnabled: true,
    order: 9,
    minRole: 'angajat'
  },

  // 10. Quick Actions — acțiuni rapide
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    titleRO: 'Acțiuni Rapide',
    titleEN: 'Quick Actions',
    type: 'actions',
    size: 'md',
    module: 'all',
    description: 'Butoane pentru acțiunile cele mai frecvente: adaugă angajat, generează document, etc.',
    icon: 'Zap',
    isEnabled: true,
    order: 10,
    minRole: 'firma_admin'
  },

  // 11. Module Status — status module active
  {
    id: 'module-status',
    title: 'Module Status',
    titleRO: 'Status Module',
    titleEN: 'Module Status',
    type: 'chart',
    size: 'md',
    module: 'all',
    refreshInterval: 600, // 10 minute
    description: 'Vizualizare status module SSM: medicală, instruiri, echipamente, REGES',
    icon: 'LayoutGrid',
    isEnabled: true,
    order: 11,
    minRole: 'firma_admin'
  },

  // 12. Activity Feed — flux activitate recentă
  {
    id: 'activity-feed',
    title: 'Activity Feed',
    titleRO: 'Activitate Recentă',
    titleEN: 'Activity Feed',
    type: 'feed',
    size: 'lg',
    module: 'all',
    refreshInterval: 180, // 3 minute
    description: 'Audit log cu ultimele 10 acțiuni efectuate în platformă',
    icon: 'Activity',
    isEnabled: true,
    order: 12,
    minRole: 'consultant'
  }
]

/**
 * Helper: filtrează widget-urile active pentru un modul specific
 */
export function getWidgetsForModule(module: DashboardModule): DashboardWidget[] {
  return DASHBOARD_WIDGETS
    .filter(w => w.isEnabled && (w.module === module || w.module === 'all'))
    .sort((a, b) => a.order - b.order)
}

/**
 * Helper: filtrează widget-urile pe baza rolului utilizatorului
 */
export function getWidgetsForRole(
  role: 'consultant' | 'firma_admin' | 'angajat'
): DashboardWidget[] {
  const roleHierarchy = {
    consultant: 3,
    firma_admin: 2,
    angajat: 1
  }

  return DASHBOARD_WIDGETS
    .filter(w => {
      if (!w.isEnabled) return false
      if (!w.minRole) return true
      return roleHierarchy[role] >= roleHierarchy[w.minRole]
    })
    .sort((a, b) => a.order - b.order)
}

/**
 * Helper: obține widget după ID
 */
export function getWidgetById(id: string): DashboardWidget | undefined {
  return DASHBOARD_WIDGETS.find(w => w.id === id)
}

/**
 * Helper: obține widget-uri care necesită refresh automat
 */
export function getAutoRefreshWidgets(): DashboardWidget[] {
  return DASHBOARD_WIDGETS.filter(w => w.isEnabled && w.refreshInterval !== undefined)
}

/**
 * Helper: obține widget-uri pentru pagina principală dashboard
 */
export function getMainDashboardWidgets(
  role: 'consultant' | 'firma_admin' | 'angajat'
): DashboardWidget[] {
  return getWidgetsForRole(role)
    .filter(w => ['compliance-score', 'recent-alerts', 'calendar-next-events', 'quick-actions', 'module-status'].includes(w.id))
}
