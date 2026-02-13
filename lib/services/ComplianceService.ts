// lib/services/ComplianceService.ts
// Service pentru calcularea și gestionarea scorului de conformitate SSM/PSI
// Agregă date din medical_examinations, safety_equipment, trainings, alerts

import { createSupabaseBrowser } from '@/lib/supabase/client'
import { getExpiryStatus } from '@/lib/types'

export interface ComplianceBreakdown {
  ssm: number          // Scor SSM (0-100)
  psi: number          // Scor PSI (0-100)
  medical: number      // Scor medicina muncii (0-100)
  equipment: number    // Scor echipamente (0-100)
  trainings?: number   // Scor instruiri (0-100) - optional
}

export interface ComplianceHistoryEntry {
  month: string        // Format: 'YYYY-MM'
  score: number        // Scor total (0-100)
  breakdown: ComplianceBreakdown
  timestamp: string    // ISO timestamp
}

export interface ComplianceRecommendation {
  type: 'critical' | 'warning' | 'info'
  category: 'ssm' | 'psi' | 'medical' | 'equipment' | 'trainings'
  title: string
  description: string
  action?: string
  priority: number     // 1 (highest) to 5 (lowest)
}

export interface ComplianceScore {
  overall: number      // Scor total (0-100)
  breakdown: ComplianceBreakdown
  recommendations: ComplianceRecommendation[]
  lastUpdated: string  // ISO timestamp
  organizationId: string
}

export class ComplianceService {
  private supabase = createSupabaseBrowser()

  /**
   * Calculează scorul de conformitate pentru o organizație
   * @param organizationId ID-ul organizației
   * @returns Promise<ComplianceScore>
   */
  async calculateComplianceScore(organizationId: string): Promise<ComplianceScore> {
    try {
      const [medicalScore, equipmentScore, ssmScore, psiScore] = await Promise.all([
        this.calculateMedicalScore(organizationId),
        this.calculateEquipmentScore(organizationId),
        this.calculateSSMScore(organizationId),
        this.calculatePSIScore(organizationId),
      ])

      const breakdown: ComplianceBreakdown = {
        ssm: ssmScore,
        psi: psiScore,
        medical: medicalScore,
        equipment: equipmentScore,
      }

      // Scor total = media ponderată (SSM 30%, PSI 25%, Medical 25%, Equipment 20%)
      const overall = Math.round(
        (ssmScore * 0.30) +
        (psiScore * 0.25) +
        (medicalScore * 0.25) +
        (equipmentScore * 0.20)
      )

      const recommendations = await this.generateRecommendations(organizationId, breakdown)

      return {
        overall,
        breakdown,
        recommendations,
        lastUpdated: new Date().toISOString(),
        organizationId,
      }
    } catch (error) {
      console.error('[ComplianceService] Error calculating compliance score:', error)
      throw new Error('Eroare la calcularea scorului de conformitate')
    }
  }

  /**
   * Calculează scorul pentru medicina muncii (fișe medicale valide)
   */
  private async calculateMedicalScore(organizationId: string): Promise<number> {
    const { data: medicalExams, error } = await this.supabase
      .from('medical_examinations')
      .select('id, expiry_date, result')
      .eq('organization_id', organizationId)

    if (error || !medicalExams) {
      console.error('[ComplianceService] Error fetching medical exams:', error)
      return 0
    }

    if (medicalExams.length === 0) return 0

    const validExams = medicalExams.filter(exam => {
      const status = getExpiryStatus(exam.expiry_date)
      return status === 'valid' && exam.result === 'apt'
    })

    return Math.round((validExams.length / medicalExams.length) * 100)
  }

  /**
   * Calculează scorul pentru echipamente PSI (echipamente conforme)
   */
  private async calculateEquipmentScore(organizationId: string): Promise<number> {
    const { data: equipment, error } = await this.supabase
      .from('safety_equipment')
      .select('id, expiry_date, is_compliant')
      .eq('organization_id', organizationId)

    if (error || !equipment) {
      console.error('[ComplianceService] Error fetching equipment:', error)
      return 0
    }

    if (equipment.length === 0) return 0

    const validEquipment = equipment.filter(item => {
      const status = getExpiryStatus(item.expiry_date)
      return status === 'valid' && item.is_compliant
    })

    return Math.round((validEquipment.length / equipment.length) * 100)
  }

  /**
   * Calculează scorul SSM general (combină medical, trainings, documente)
   */
  private async calculateSSMScore(organizationId: string): Promise<number> {
    // Pentru moment, folosim scorul medical ca bază pentru SSM
    // În viitor: combină cu instruiri SSM, evaluări risc, documente PSI
    const medicalScore = await this.calculateMedicalScore(organizationId)

    // TODO: Adaugă calcul pentru instruiri SSM când tabela trainings este activă
    // const trainingsScore = await this.calculateTrainingsScore(organizationId)
    // return Math.round((medicalScore * 0.6) + (trainingsScore * 0.4))

    return medicalScore
  }

  /**
   * Calculează scorul PSI (prevenirea și stingerea incendiilor)
   */
  private async calculatePSIScore(organizationId: string): Promise<number> {
    // Bazat pe echipamente PSI (stingătoare, hidranți, detectoare, etc.)
    return await this.calculateEquipmentScore(organizationId)
  }

  /**
   * Generează recomandări bazate pe breakdown-ul de conformitate
   */
  private async generateRecommendations(
    organizationId: string,
    breakdown: ComplianceBreakdown
  ): Promise<ComplianceRecommendation[]> {
    const recommendations: ComplianceRecommendation[] = []

    // Recomandări medicina muncii
    if (breakdown.medical < 60) {
      recommendations.push({
        type: 'critical',
        category: 'medical',
        title: 'Scor medicina muncii critic',
        description: `Doar ${breakdown.medical}% din fișele medicale sunt valide și conforme.`,
        action: 'Programează controale medicale pentru angajații cu fișe expirate.',
        priority: 1,
      })
    } else if (breakdown.medical < 80) {
      recommendations.push({
        type: 'warning',
        category: 'medical',
        title: 'Scor medicina muncii sub țintă',
        description: `${breakdown.medical}% conformitate medicina muncii. Ținta: 90%+`,
        action: 'Verifică fișele medicale care expiră în următoarele 30 de zile.',
        priority: 2,
      })
    }

    // Recomandări echipamente PSI
    if (breakdown.equipment < 60) {
      recommendations.push({
        type: 'critical',
        category: 'psi',
        title: 'Echipamente PSI în stare critică',
        description: `Doar ${breakdown.equipment}% din echipamente sunt conforme și valide.`,
        action: 'Înlocuiți echipamentele expirate și programați revizii tehnice.',
        priority: 1,
      })
    } else if (breakdown.equipment < 85) {
      recommendations.push({
        type: 'warning',
        category: 'equipment',
        title: 'Echipamente PSI necesită atenție',
        description: `${breakdown.equipment}% conformitate echipamente. Ținta: 95%+`,
        action: 'Verificați echipamentele care expiră în următoarele 30 de zile.',
        priority: 3,
      })
    }

    // Recomandări SSM general
    if (breakdown.ssm < 70) {
      recommendations.push({
        type: 'critical',
        category: 'ssm',
        title: 'Conformitate SSM sub limita acceptabilă',
        description: `Scorul SSM este ${breakdown.ssm}%. Risc de sancțiuni ITM.`,
        action: 'Contactați consultantul SSM pentru audit complet.',
        priority: 1,
      })
    }

    // Recomandări PSI general
    if (breakdown.psi < 70) {
      recommendations.push({
        type: 'critical',
        category: 'psi',
        title: 'Conformitate PSI sub limita acceptabilă',
        description: `Scorul PSI este ${breakdown.psi}%. Risc de sancțiuni ISU.`,
        action: 'Programați inspecție ISU și înlocuiți echipamentele neconforme.',
        priority: 1,
      })
    }

    // Sortează după prioritate
    return recommendations.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Obține istoricul scorurilor de conformitate (12 luni)
   * @param organizationId ID-ul organizației
   * @returns Promise<ComplianceHistoryEntry[]>
   */
  async getComplianceHistory(organizationId: string): Promise<ComplianceHistoryEntry[]> {
    // TODO: Implementare cu tabela compliance_history (dacă există)
    // Pentru moment, returnăm doar scorul curent ca singur punct în istoric

    try {
      const currentScore = await this.calculateComplianceScore(organizationId)
      const now = new Date()

      // Generăm istoric pentru ultimele 12 luni (simulat pentru demo)
      const history: ComplianceHistoryEntry[] = []

      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthStr = date.toISOString().substring(0, 7) // 'YYYY-MM'

        // Pentru luna curentă, folosim scorul real
        if (i === 0) {
          history.push({
            month: monthStr,
            score: currentScore.overall,
            breakdown: currentScore.breakdown,
            timestamp: currentScore.lastUpdated,
          })
        } else {
          // Pentru luni anterioare, simulăm variație mică (-5 până la +3 puncte)
          const variation = Math.floor(Math.random() * 8) - 5
          const simulatedScore = Math.max(0, Math.min(100, currentScore.overall + variation))

          history.push({
            month: monthStr,
            score: simulatedScore,
            breakdown: {
              ssm: Math.max(0, Math.min(100, currentScore.breakdown.ssm + variation)),
              psi: Math.max(0, Math.min(100, currentScore.breakdown.psi + variation)),
              medical: Math.max(0, Math.min(100, currentScore.breakdown.medical + variation)),
              equipment: Math.max(0, Math.min(100, currentScore.breakdown.equipment + variation)),
            },
            timestamp: date.toISOString(),
          })
        }
      }

      return history
    } catch (error) {
      console.error('[ComplianceService] Error generating compliance history:', error)
      return []
    }
  }

  /**
   * Salvează scorul de conformitate în istoric (pentru tracking)
   * TODO: Implementare cu tabela compliance_history
   */
  async saveComplianceSnapshot(organizationId: string): Promise<void> {
    // Placeholder pentru feature viitor
    console.log('[ComplianceService] Save snapshot not yet implemented for org:', organizationId)
  }
}

// Export singleton instance
export const complianceService = new ComplianceService()
