// lib/services/compliance.service.ts
// Serviciu centralizat pentru calcularea scorului de compliance SSM/PSI
// Bazat pe medicina muncii, echipamente, instruiri și alerte
// Data: 13 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import type {
  MedicalExamination,
  SafetyEquipment,
  ExpiryStatus
} from '@/lib/types'
import type {
  TrainingAssignment,
  AssignmentStatus
} from '@/lib/training-types'

// ============================================================
// TIPURI
// ============================================================

export interface ComplianceScore {
  overall: number // 0-100
  medical: number // 0-100
  equipment: number // 0-100
  training: number // 0-100
  alerts: number // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  status: 'compliant' | 'warning' | 'critical' | 'non_compliant'
  lastCalculatedAt: string
}

export interface ScoreBreakdown {
  category: 'medical' | 'equipment' | 'training' | 'alerts'
  score: number
  weight: number
  total: number
  expired: number
  expiring: number
  valid: number
  details: string
}

export interface ComplianceHistory {
  date: string
  overall: number
  medical: number
  equipment: number
  training: number
  alerts: number
}

export interface NonCompliantItem {
  id: string
  type: 'medical' | 'equipment' | 'training'
  description: string
  status: 'expired' | 'expiring' | 'missing'
  daysOverdue: number | null
  expiryDate: string | null
  urgency: 'low' | 'medium' | 'high' | 'critical'
  recommendation: string
}

export interface ComplianceRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'medical' | 'equipment' | 'training' | 'general'
  title: string
  description: string
  actionItems: string[]
  estimatedImpact: number // impact pe scor (0-100)
  deadline?: string
}

export interface SectorBenchmark {
  sector: string
  avgScore: number
  topQuartile: number
  medianScore: number
  bottomQuartile: number
  organizationScore: number
  ranking: 'top' | 'above_average' | 'average' | 'below_average' | 'bottom'
  percentile: number
}

interface ComplianceWeights {
  medical: number
  equipment: number
  training: number
  alerts: number
}

// Greutăți default pentru calculul scorului
const DEFAULT_WEIGHTS: ComplianceWeights = {
  medical: 0.35,    // 35% - medicina muncii este critică
  equipment: 0.30,  // 30% - echipamente PSI/SSM obligatorii
  training: 0.25,   // 25% - instruiri obligatorii
  alerts: 0.10      // 10% - răspuns la alerte
}

// ============================================================
// CLASA COMPLIANCE SERVICE
// ============================================================

export class ComplianceService {
  private weights: ComplianceWeights

  constructor(weights: ComplianceWeights = DEFAULT_WEIGHTS) {
    this.weights = weights
  }

  /**
   * Calculează scorul general de compliance pentru o organizație
   */
  async calculateScore(
    organizationId: string,
    useServerClient = true
  ): Promise<ComplianceScore> {
    try {
      const supabase = useServerClient
        ? await createSupabaseServer()
        : createSupabaseBrowser()

      // Fetch medical records
      const { data: medicalRecords } = await supabase
        .from('medical_records')
        .select('*')
        .eq('organization_id', organizationId)

      // Fetch equipment
      const { data: equipment } = await supabase
        .from('equipment')
        .select('*')
        .eq('organization_id', organizationId)

      // Fetch training assignments
      const { data: trainings } = await supabase
        .from('training_assignments')
        .select('*')
        .eq('organization_id', organizationId)

      // Fetch notifications log (pentru alerts score)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: notifications } = await supabase
        .from('notification_log')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('sent_at', thirtyDaysAgo.toISOString())

      // Calculează scoruri pe categorii
      const medicalScore = this.calculateMedicalScore(medicalRecords || [])
      const equipmentScore = this.calculateEquipmentScore(equipment || [])
      const trainingScore = this.calculateTrainingScore(trainings || [])
      const alertsScore = this.calculateAlertsScore(notifications || [])

      // Scor general ponderat
      const overall = Math.round(
        medicalScore * this.weights.medical +
        equipmentScore * this.weights.equipment +
        trainingScore * this.weights.training +
        alertsScore * this.weights.alerts
      )

      // Determină grade și status
      const grade = this.getGrade(overall)
      const status = this.getStatus(overall)

      return {
        overall,
        medical: medicalScore,
        equipment: equipmentScore,
        training: trainingScore,
        alerts: alertsScore,
        grade,
        status,
        lastCalculatedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error calculating compliance score:', error)
      throw new Error('Nu s-a putut calcula scorul de compliance')
    }
  }

  /**
   * Returnează detalii pe categorii pentru scor
   */
  async getScoreBreakdown(
    organizationId: string,
    useServerClient = true
  ): Promise<ScoreBreakdown[]> {
    try {
      const supabase = useServerClient
        ? await createSupabaseServer()
        : createSupabaseBrowser()

      const breakdown: ScoreBreakdown[] = []

      // Medical breakdown
      const { data: medicalRecords } = await supabase
        .from('medical_records')
        .select('*')
        .eq('organization_id', organizationId)

      const medicalStats = this.getMedicalStats(medicalRecords || [])
      breakdown.push({
        category: 'medical',
        score: this.calculateMedicalScore(medicalRecords || []),
        weight: this.weights.medical,
        total: medicalStats.total,
        expired: medicalStats.expired,
        expiring: medicalStats.expiring,
        valid: medicalStats.valid,
        details: `${medicalStats.valid}/${medicalStats.total} examene medicale valide`
      })

      // Equipment breakdown
      const { data: equipment } = await supabase
        .from('equipment')
        .select('*')
        .eq('organization_id', organizationId)

      const equipmentStats = this.getEquipmentStats(equipment || [])
      breakdown.push({
        category: 'equipment',
        score: this.calculateEquipmentScore(equipment || []),
        weight: this.weights.equipment,
        total: equipmentStats.total,
        expired: equipmentStats.expired,
        expiring: equipmentStats.expiring,
        valid: equipmentStats.valid,
        details: `${equipmentStats.valid}/${equipmentStats.total} echipamente conforme`
      })

      // Training breakdown
      const { data: trainings } = await supabase
        .from('training_assignments')
        .select('*')
        .eq('organization_id', organizationId)

      const trainingStats = this.getTrainingStats(trainings || [])
      breakdown.push({
        category: 'training',
        score: this.calculateTrainingScore(trainings || []),
        weight: this.weights.training,
        total: trainingStats.total,
        expired: trainingStats.overdue,
        expiring: trainingStats.dueSoon,
        valid: trainingStats.completed,
        details: `${trainingStats.completed}/${trainingStats.total} instruiri completate`
      })

      // Alerts breakdown
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: notifications } = await supabase
        .from('notification_log')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('sent_at', thirtyDaysAgo.toISOString())

      const alertStats = this.getAlertStats(notifications || [])
      breakdown.push({
        category: 'alerts',
        score: this.calculateAlertsScore(notifications || []),
        weight: this.weights.alerts,
        total: alertStats.total,
        expired: 0,
        expiring: 0,
        valid: alertStats.actioned,
        details: `${alertStats.actioned}/${alertStats.total} alerte acționate în 30 zile`
      })

      return breakdown
    } catch (error) {
      console.error('Error getting score breakdown:', error)
      throw new Error('Nu s-au putut încărca detaliile scorului')
    }
  }

  /**
   * Returnează istoric compliance pentru ultimele N luni
   */
  async getHistory(
    organizationId: string,
    months = 6,
    useServerClient = true
  ): Promise<ComplianceHistory[]> {
    try {
      const supabase = useServerClient
        ? await createSupabaseServer()
        : createSupabaseBrowser()

      // În MVP returnăm doar scorul curent pentru fiecare lună
      // Într-o implementare completă, ar trebui să stocăm istoricul în DB
      const history: ComplianceHistory[] = []
      const currentDate = new Date()

      for (let i = 0; i < months; i++) {
        const monthDate = new Date(currentDate)
        monthDate.setMonth(monthDate.getMonth() - i)

        // Pentru MVP, folosim scorul curent (în viitor, din tabel compliance_history)
        const score = await this.calculateScore(organizationId, useServerClient)

        history.push({
          date: monthDate.toISOString().split('T')[0],
          overall: score.overall,
          medical: score.medical,
          equipment: score.equipment,
          training: score.training,
          alerts: score.alerts
        })
      }

      return history.reverse() // Cronologic (vechi → recent)
    } catch (error) {
      console.error('Error getting compliance history:', error)
      throw new Error('Nu s-a putut încărca istoricul compliance')
    }
  }

  /**
   * Returnează lista itemelor non-compliant
   */
  async getNonCompliant(
    organizationId: string,
    useServerClient = true
  ): Promise<NonCompliantItem[]> {
    try {
      const supabase = useServerClient
        ? await createSupabaseServer()
        : createSupabaseBrowser()

      const items: NonCompliantItem[] = []
      const today = new Date()

      // Medical records expirate/expirând
      const { data: medicalRecords } = await supabase
        .from('medical_records')
        .select('*')
        .eq('organization_id', organizationId)

      medicalRecords?.forEach((record: any) => {
        const expiryDate = new Date(record.expiry_date)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry <= 30) {
          items.push({
            id: record.id,
            type: 'medical',
            description: `Examen medical ${record.employee_name} (${record.job_title || 'N/A'})`,
            status: daysUntilExpiry < 0 ? 'expired' : 'expiring',
            daysOverdue: daysUntilExpiry < 0 ? Math.abs(daysUntilExpiry) : null,
            expiryDate: record.expiry_date,
            urgency: this.getUrgency(daysUntilExpiry),
            recommendation: daysUntilExpiry < 0
              ? 'Programați urgent examen medical periodic'
              : `Programați examen medical în următoarele ${daysUntilExpiry} zile`
          })
        }
      })

      // Equipment expirat/expirând
      const { data: equipment } = await supabase
        .from('equipment')
        .select('*')
        .eq('organization_id', organizationId)

      equipment?.forEach((item: any) => {
        const expiryDate = new Date(item.expiry_date)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry <= 30 || !item.is_compliant) {
          items.push({
            id: item.id,
            type: 'equipment',
            description: `${item.equipment_type} - ${item.location || 'Locație necunoscută'}`,
            status: daysUntilExpiry < 0 ? 'expired' : 'expiring',
            daysOverdue: daysUntilExpiry < 0 ? Math.abs(daysUntilExpiry) : null,
            expiryDate: item.expiry_date,
            urgency: this.getUrgency(daysUntilExpiry),
            recommendation: daysUntilExpiry < 0
              ? 'Verificare/înlocuire urgentă necesară'
              : `Programați verificare în următoarele ${daysUntilExpiry} zile`
          })
        }
      })

      // Training assignments overdue
      const { data: trainings } = await supabase
        .from('training_assignments')
        .select('*, training_modules(title), workers(name)')
        .eq('organization_id', organizationId)
        .in('status', ['assigned', 'in_progress'])

      trainings?.forEach((training: any) => {
        if (training.due_date) {
          const dueDate = new Date(training.due_date)
          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

          if (daysUntilDue <= 7) {
            items.push({
              id: training.id,
              type: 'training',
              description: `Instruire ${training.training_modules?.title || 'N/A'} - ${training.workers?.name || 'Lucrător necunoscut'}`,
              status: daysUntilDue < 0 ? 'expired' : 'expiring',
              daysOverdue: daysUntilDue < 0 ? Math.abs(daysUntilDue) : null,
              expiryDate: training.due_date,
              urgency: this.getUrgency(daysUntilDue),
              recommendation: daysUntilDue < 0
                ? 'Completați instruirea urgentă depășită'
                : `Completați instruirea în următoarele ${daysUntilDue} zile`
            })
          }
        }
      })

      // Sortează după urgență și zile overdue
      return items.sort((a, b) => {
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
        }
        return (b.daysOverdue || 0) - (a.daysOverdue || 0)
      })
    } catch (error) {
      console.error('Error getting non-compliant items:', error)
      throw new Error('Nu s-au putut încărca itemele non-conforme')
    }
  }

  /**
   * Returnează recomandări pentru îmbunătățirea scorului
   */
  async getRecommendations(
    organizationId: string,
    useServerClient = true
  ): Promise<ComplianceRecommendation[]> {
    try {
      const score = await this.calculateScore(organizationId, useServerClient)
      const breakdown = await this.getScoreBreakdown(organizationId, useServerClient)
      const nonCompliant = await this.getNonCompliant(organizationId, useServerClient)

      const recommendations: ComplianceRecommendation[] = []

      // Recomandări bazate pe scor
      if (score.overall < 70) {
        recommendations.push({
          priority: 'critical',
          category: 'general',
          title: 'Scor general de compliance sub pragul acceptabil',
          description: `Scorul dvs. actual de ${score.overall}% este sub pragul minim recomandat de 70%. Acest lucru poate conduce la sancțiuni și riscuri majore.`,
          actionItems: [
            'Analizați itemele expirate și programați remedierile urgent',
            'Alocați resurse pentru actualizarea documentelor expirate',
            'Stabilizați un plan de acțiune cu termene clare'
          ],
          estimatedImpact: 30
        })
      }

      // Recomandări pe categoria medicală
      const medicalBreakdown = breakdown.find(b => b.category === 'medical')
      if (medicalBreakdown && medicalBreakdown.score < 80) {
        const expiredCount = medicalBreakdown.expired
        recommendations.push({
          priority: expiredCount > 5 ? 'critical' : 'high',
          category: 'medical',
          title: 'Examene medicale periodice expirate',
          description: `Aveți ${expiredCount} examene medicale expirate. Conform Legii 319/2006, toți angajații trebuie să aibă examen medical valid.`,
          actionItems: [
            `Programați urgent ${expiredCount} examene medicale`,
            'Verificați termenele de expirare pentru toate examenele',
            'Implementați sistem de notificări automate pentru expirări viitoare'
          ],
          estimatedImpact: 15,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      }

      // Recomandări pe echipamente
      const equipmentBreakdown = breakdown.find(b => b.category === 'equipment')
      if (equipmentBreakdown && equipmentBreakdown.score < 80) {
        const expiredCount = equipmentBreakdown.expired
        recommendations.push({
          priority: expiredCount > 3 ? 'high' : 'medium',
          category: 'equipment',
          title: 'Echipamente de siguranță expirate',
          description: `Aveți ${expiredCount} echipamente PSI/SSM expirate sau neconforme. Acest lucru reprezintă risc direct pentru siguranța angajaților.`,
          actionItems: [
            `Verificați/înlocuiți ${expiredCount} echipamente expirate`,
            'Programați inspecții periodice pentru toate echipamentele',
            'Actualizați fișele de verificare conform normelor în vigoare'
          ],
          estimatedImpact: 12,
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      }

      // Recomandări pe instruiri
      const trainingBreakdown = breakdown.find(b => b.category === 'training')
      if (trainingBreakdown && trainingBreakdown.score < 75) {
        const overdueCount = trainingBreakdown.expired
        recommendations.push({
          priority: overdueCount > 10 ? 'high' : 'medium',
          category: 'training',
          title: 'Instruiri SSM incomplete',
          description: `Aveți ${overdueCount} instruiri obligatorii necompletate. Toate angajații trebuie să aibă instruiri valide conform legislației.`,
          actionItems: [
            `Completați ${overdueCount} instruiri restante`,
            'Programați sesiuni de instruire pentru angajații noi',
            'Verificați periodicitatea instruirilor pentru fiecare post'
          ],
          estimatedImpact: 10,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      }

      // Recomandare pentru itemele critice non-compliant
      const criticalItems = nonCompliant.filter(item => item.urgency === 'critical')
      if (criticalItems.length > 0) {
        recommendations.push({
          priority: 'critical',
          category: 'general',
          title: `${criticalItems.length} item(e) critice necesită atenție imediată`,
          description: 'Aceste items sunt expirate de mai mult timp și reprezintă risc imediat de non-conformitate.',
          actionItems: criticalItems.slice(0, 5).map(item => item.recommendation),
          estimatedImpact: 20
        })
      }

      // Recomandare pentru răspunsul la alerte
      if (score.alerts < 60) {
        recommendations.push({
          priority: 'medium',
          category: 'general',
          title: 'Rata de răspuns la alerte este scăzută',
          description: 'Răspunsul rapid la alerte este esențial pentru menținerea compliance-ului.',
          actionItems: [
            'Verificați zilnic alertele din platformă',
            'Configurați notificări pe email/WhatsApp',
            'Desemnați persoană responsabilă pentru monitorizare alerte'
          ],
          estimatedImpact: 5
        })
      }

      // Sortează după prioritate și impact
      return recommendations.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        return b.estimatedImpact - a.estimatedImpact
      })
    } catch (error) {
      console.error('Error getting recommendations:', error)
      throw new Error('Nu s-au putut genera recomandările')
    }
  }

  /**
   * Compară scorul organizației cu benchmark-ul pe sector
   */
  async compareWithBenchmark(
    organizationId: string,
    sector: string,
    useServerClient = true
  ): Promise<SectorBenchmark> {
    try {
      const supabase = useServerClient
        ? await createSupabaseServer()
        : createSupabaseBrowser()

      // Obține scorul organizației curente
      const orgScore = await this.calculateScore(organizationId, useServerClient)

      // În MVP, generăm benchmark-uri simulate bazate pe sector
      // Într-o implementare completă, ar trebui să calculăm din DB toate org din sector
      const benchmarks = this.generateSectorBenchmarks(sector)

      // Calculează ranking și percentile
      const ranking = this.getRanking(orgScore.overall, benchmarks)
      const percentile = this.getPercentile(orgScore.overall, benchmarks)

      return {
        sector,
        avgScore: benchmarks.avgScore,
        topQuartile: benchmarks.topQuartile,
        medianScore: benchmarks.medianScore,
        bottomQuartile: benchmarks.bottomQuartile,
        organizationScore: orgScore.overall,
        ranking,
        percentile
      }
    } catch (error) {
      console.error('Error comparing with benchmark:', error)
      throw new Error('Nu s-a putut face comparația cu benchmark-ul')
    }
  }

  // ============================================================
  // METODE PRIVATE - CALCUL SCORURI
  // ============================================================

  private calculateMedicalScore(records: any[]): number {
    if (records.length === 0) return 0

    const today = new Date()
    const valid = records.filter(r => {
      const expiryDate = new Date(r.expiry_date)
      return expiryDate >= today && r.result === 'apt'
    })

    const score = (valid.length / records.length) * 100
    return Math.round(score)
  }

  private calculateEquipmentScore(equipment: any[]): number {
    if (equipment.length === 0) return 0

    const today = new Date()
    const valid = equipment.filter(e => {
      const expiryDate = new Date(e.expiry_date)
      return expiryDate >= today && e.is_compliant
    })

    const score = (valid.length / equipment.length) * 100
    return Math.round(score)
  }

  private calculateTrainingScore(trainings: any[]): number {
    if (trainings.length === 0) return 0

    const completed = trainings.filter(t => t.status === 'completed')
    const score = (completed.length / trainings.length) * 100
    return Math.round(score)
  }

  private calculateAlertsScore(notifications: any[]): number {
    if (notifications.length === 0) return 100 // Dacă nu sunt alerte, scorul e maxim

    const actioned = notifications.filter(n =>
      n.status === 'actioned' || n.status === 'opened'
    )

    const score = (actioned.length / notifications.length) * 100
    return Math.round(score)
  }

  // ============================================================
  // METODE PRIVATE - STATISTICI
  // ============================================================

  private getMedicalStats(records: any[]) {
    const today = new Date()
    const valid = records.filter(r => {
      const expiryDate = new Date(r.expiry_date)
      return expiryDate >= today
    })
    const expiring = records.filter(r => {
      const expiryDate = new Date(r.expiry_date)
      const daysUntil = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil > 0 && daysUntil <= 30
    })
    const expired = records.filter(r => {
      const expiryDate = new Date(r.expiry_date)
      return expiryDate < today
    })

    return {
      total: records.length,
      valid: valid.length,
      expiring: expiring.length,
      expired: expired.length
    }
  }

  private getEquipmentStats(equipment: any[]) {
    const today = new Date()
    const valid = equipment.filter(e => {
      const expiryDate = new Date(e.expiry_date)
      return expiryDate >= today && e.is_compliant
    })
    const expiring = equipment.filter(e => {
      const expiryDate = new Date(e.expiry_date)
      const daysUntil = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil > 0 && daysUntil <= 30
    })
    const expired = equipment.filter(e => {
      const expiryDate = new Date(e.expiry_date)
      return expiryDate < today || !e.is_compliant
    })

    return {
      total: equipment.length,
      valid: valid.length,
      expiring: expiring.length,
      expired: expired.length
    }
  }

  private getTrainingStats(trainings: any[]) {
    const today = new Date()
    const completed = trainings.filter(t => t.status === 'completed')
    const overdue = trainings.filter(t => {
      if (!t.due_date) return false
      const dueDate = new Date(t.due_date)
      return dueDate < today && t.status !== 'completed'
    })
    const dueSoon = trainings.filter(t => {
      if (!t.due_date) return false
      const dueDate = new Date(t.due_date)
      const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil > 0 && daysUntil <= 7 && t.status !== 'completed'
    })

    return {
      total: trainings.length,
      completed: completed.length,
      overdue: overdue.length,
      dueSoon: dueSoon.length
    }
  }

  private getAlertStats(notifications: any[]) {
    const actioned = notifications.filter(n =>
      n.status === 'actioned' || n.status === 'opened'
    )
    const ignored = notifications.filter(n => n.status === 'ignored')

    return {
      total: notifications.length,
      actioned: actioned.length,
      ignored: ignored.length
    }
  }

  // ============================================================
  // METODE PRIVATE - HELPERS
  // ============================================================

  private getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  private getStatus(score: number): 'compliant' | 'warning' | 'critical' | 'non_compliant' {
    if (score >= 80) return 'compliant'
    if (score >= 70) return 'warning'
    if (score >= 60) return 'critical'
    return 'non_compliant'
  }

  private getUrgency(daysUntilExpiry: number): 'low' | 'medium' | 'high' | 'critical' {
    if (daysUntilExpiry < 0) return 'critical'
    if (daysUntilExpiry <= 7) return 'high'
    if (daysUntilExpiry <= 30) return 'medium'
    return 'low'
  }

  private generateSectorBenchmarks(sector: string) {
    // Benchmark-uri simulate pe sector (în viitor, din DB real)
    const baselines: Record<string, any> = {
      'productie': { avg: 72, top: 88, median: 75, bottom: 60 },
      'constructii': { avg: 68, top: 85, median: 70, bottom: 55 },
      'transport': { avg: 70, top: 86, median: 72, bottom: 58 },
      'servicii': { avg: 75, top: 90, median: 78, bottom: 65 },
      'comert': { avg: 73, top: 87, median: 76, bottom: 62 },
      'default': { avg: 72, top: 88, median: 75, bottom: 60 }
    }

    const baseline = baselines[sector.toLowerCase()] || baselines.default

    return {
      avgScore: baseline.avg,
      topQuartile: baseline.top,
      medianScore: baseline.median,
      bottomQuartile: baseline.bottom
    }
  }

  private getRanking(
    score: number,
    benchmarks: { topQuartile: number; medianScore: number; bottomQuartile: number }
  ): 'top' | 'above_average' | 'average' | 'below_average' | 'bottom' {
    if (score >= benchmarks.topQuartile) return 'top'
    if (score >= benchmarks.medianScore) return 'above_average'
    if (score >= benchmarks.bottomQuartile) return 'average'
    if (score >= benchmarks.bottomQuartile - 10) return 'below_average'
    return 'bottom'
  }

  private getPercentile(
    score: number,
    benchmarks: { topQuartile: number; medianScore: number; bottomQuartile: number }
  ): number {
    // Simplificat: calculăm percentila bazată pe quartile
    if (score >= benchmarks.topQuartile) return 90
    if (score >= benchmarks.medianScore) return 70
    if (score >= benchmarks.bottomQuartile) return 50
    return 25
  }
}

// Export instanță singleton cu weights default
export const complianceService = new ComplianceService()
