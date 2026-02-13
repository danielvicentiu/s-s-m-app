// lib/services/medical.service.ts
// Medical Examinations Service — CRUD și business logic pentru fișe medicina muncii
// Data: 13 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import { MedicalExamination } from '@/lib/types'

export interface MedicalStatistics {
  total: number
  apt: number
  aptConditionat: number
  inaptTempor: number
  inapt: number
  expiringSoon: number
  expired: number
  byType: {
    periodic: number
    angajare: number
    reluare: number
    la_cerere: number
    supraveghere: number
  }
}

export interface MedicalExaminationWithOrg extends MedicalExamination {
  organizations?: {
    id: string
    name: string
    cui: string | null
  }
}

export interface ScheduleMedicalParams {
  organizationId: string
  employeeName: string
  cnpHash?: string | null
  jobTitle?: string | null
  examinationType: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
  examinationDate: string
  expiryDate: string
  result?: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
  restrictions?: string | null
  doctorName?: string | null
  clinicName?: string | null
  notes?: string | null
}

export interface UpdateResultParams {
  result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
  restrictions?: string | null
  doctorName?: string | null
  clinicName?: string | null
  notes?: string | null
}

export class MedicalService {
  /**
   * Obține toate examinările medicale
   * @param organizationId - Optional: filtrează după organizație
   * @returns Lista completă de examinări cu relații
   */
  static async getAll(organizationId?: string): Promise<MedicalExaminationWithOrg[]> {
    try {
      const supabase = await createSupabaseServer()
      let query = supabase
        .from('medical_examinations')
        .select('*, organizations(id, name, cui)')
        .order('examination_date', { ascending: false })

      if (organizationId) {
        query = query.eq('organization_id', organizationId)
      }

      const { data, error } = await query

      if (error) {
        console.error('[MedicalService.getAll] Error:', error)
        throw new Error(`Eroare la obținerea examinărilor: ${error.message}`)
      }

      return data || []
    } catch (err) {
      console.error('[MedicalService.getAll] Unexpected error:', err)
      throw err
    }
  }

  /**
   * Obține o examinare după ID
   * @param id - ID-ul examinării
   * @returns Examinarea medicală cu relații
   */
  static async getById(id: string): Promise<MedicalExaminationWithOrg | null> {
    try {
      const supabase = await createSupabaseServer()
      const { data, error } = await supabase
        .from('medical_examinations')
        .select('*, organizations(id, name, cui)')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Not found
        }
        console.error('[MedicalService.getById] Error:', error)
        throw new Error(`Eroare la obținerea examinării: ${error.message}`)
      }

      return data
    } catch (err) {
      console.error('[MedicalService.getById] Unexpected error:', err)
      throw err
    }
  }

  /**
   * Programează o nouă examinare medicală
   * @param params - Parametrii examinării
   * @returns Examinarea creată
   */
  static async schedule(params: ScheduleMedicalParams): Promise<MedicalExamination> {
    try {
      const supabase = await createSupabaseServer()

      const payload = {
        organization_id: params.organizationId,
        employee_name: params.employeeName,
        cnp_hash: params.cnpHash || null,
        job_title: params.jobTitle || null,
        examination_type: params.examinationType,
        examination_date: params.examinationDate,
        expiry_date: params.expiryDate,
        result: params.result || 'apt',
        restrictions: params.restrictions || null,
        doctor_name: params.doctorName || null,
        clinic_name: params.clinicName || null,
        notes: params.notes || null,
        content_version: 1,
        legal_basis_version: 'RO_2024'
      }

      const { data, error } = await supabase
        .from('medical_examinations')
        .insert(payload)
        .select()
        .single()

      if (error) {
        console.error('[MedicalService.schedule] Error:', error)
        throw new Error(`Eroare la programarea examinării: ${error.message}`)
      }

      return data
    } catch (err) {
      console.error('[MedicalService.schedule] Unexpected error:', err)
      throw err
    }
  }

  /**
   * Actualizează rezultatul unei examinări
   * @param id - ID-ul examinării
   * @param params - Parametrii de actualizat
   * @returns Examinarea actualizată
   */
  static async updateResult(id: string, params: UpdateResultParams): Promise<MedicalExamination> {
    try {
      const supabase = await createSupabaseServer()

      const payload = {
        result: params.result,
        restrictions: params.restrictions || null,
        doctor_name: params.doctorName || null,
        clinic_name: params.clinicName || null,
        notes: params.notes || null,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('medical_examinations')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('[MedicalService.updateResult] Error:', error)
        throw new Error(`Eroare la actualizarea rezultatului: ${error.message}`)
      }

      return data
    } catch (err) {
      console.error('[MedicalService.updateResult] Unexpected error:', err)
      throw err
    }
  }

  /**
   * Obține examinările care expiră în următoarele X zile
   * @param days - Numărul de zile (default: 30)
   * @param organizationId - Optional: filtrează după organizație
   * @returns Lista examinărilor care expiră
   */
  static async getExpiring(days: number = 30, organizationId?: string): Promise<MedicalExaminationWithOrg[]> {
    try {
      const supabase = await createSupabaseServer()
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + days)

      let query = supabase
        .from('medical_examinations')
        .select('*, organizations(id, name, cui)')
        .gte('expiry_date', today.toISOString().split('T')[0])
        .lte('expiry_date', futureDate.toISOString().split('T')[0])
        .order('expiry_date', { ascending: true })

      if (organizationId) {
        query = query.eq('organization_id', organizationId)
      }

      const { data, error } = await query

      if (error) {
        console.error('[MedicalService.getExpiring] Error:', error)
        throw new Error(`Eroare la obținerea examinărilor care expiră: ${error.message}`)
      }

      return data || []
    } catch (err) {
      console.error('[MedicalService.getExpiring] Unexpected error:', err)
      throw err
    }
  }

  /**
   * Obține toate examinările pentru un angajat specific
   * @param employeeName - Numele angajatului
   * @param organizationId - Optional: filtrează după organizație
   * @returns Lista examinărilor angajatului
   */
  static async getByEmployee(employeeName: string, organizationId?: string): Promise<MedicalExaminationWithOrg[]> {
    try {
      const supabase = await createSupabaseServer()
      let query = supabase
        .from('medical_examinations')
        .select('*, organizations(id, name, cui)')
        .eq('employee_name', employeeName)
        .order('examination_date', { ascending: false })

      if (organizationId) {
        query = query.eq('organization_id', organizationId)
      }

      const { data, error } = await query

      if (error) {
        console.error('[MedicalService.getByEmployee] Error:', error)
        throw new Error(`Eroare la obținerea examinărilor angajatului: ${error.message}`)
      }

      return data || []
    } catch (err) {
      console.error('[MedicalService.getByEmployee] Unexpected error:', err)
      throw err
    }
  }

  /**
   * Calculează statistici pentru examinările medicale
   * @param organizationId - Optional: filtrează după organizație
   * @returns Statistici detaliate
   */
  static async getStatistics(organizationId?: string): Promise<MedicalStatistics> {
    try {
      const examinations = await this.getAll(organizationId)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const stats: MedicalStatistics = {
        total: examinations.length,
        apt: 0,
        aptConditionat: 0,
        inaptTempor: 0,
        inapt: 0,
        expiringSoon: 0,
        expired: 0,
        byType: {
          periodic: 0,
          angajare: 0,
          reluare: 0,
          la_cerere: 0,
          supraveghere: 0
        }
      }

      examinations.forEach(exam => {
        // Statistici pe rezultat
        switch (exam.result) {
          case 'apt':
            stats.apt++
            break
          case 'apt_conditionat':
            stats.aptConditionat++
            break
          case 'inapt_temporar':
            stats.inaptTempor++
            break
          case 'inapt':
            stats.inapt++
            break
        }

        // Statistici pe tip examinare
        if (exam.examination_type in stats.byType) {
          stats.byType[exam.examination_type]++
        }

        // Statistici expirare
        const expiryDate = new Date(exam.expiry_date)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry < 0) {
          stats.expired++
        } else if (daysUntilExpiry <= 30) {
          stats.expiringSoon++
        }
      })

      return stats
    } catch (err) {
      console.error('[MedicalService.getStatistics] Unexpected error:', err)
      throw err
    }
  }
}
