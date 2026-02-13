// lib/services/equipment.service.ts
// Service class pentru gestionarea echipamentelor de siguranță
// Respectă Code Contract: camelCase, TypeScript strict, error handling

import { createSupabaseServer } from '@/lib/supabase/server'
import type { SafetyEquipment } from '@/lib/types'

export interface EquipmentFilters {
  organizationId?: string
  equipmentType?: SafetyEquipment['equipment_type']
  location?: string
  isCompliant?: boolean
}

export interface InspectionData {
  inspectionDate: string
  expiryDate?: string
  nextInspectionDate?: string
  inspectorName?: string
  isCompliant: boolean
  notes?: string
}

export interface RegisterEquipmentData {
  organizationId: string
  equipmentType: SafetyEquipment['equipment_type']
  description?: string
  location?: string
  serialNumber?: string
  expiryDate: string
  nextInspectionDate?: string
  inspectorName?: string
  isCompliant?: boolean
  notes?: string
}

export interface UpdateStatusData {
  isCompliant: boolean
  notes?: string
}

export class EquipmentService {
  /**
   * Returnează toate echipamentele cu filtre opționale
   */
  async getAll(filters?: EquipmentFilters): Promise<{ data: SafetyEquipment[] | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      let query = supabase
        .from('safety_equipment')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.organizationId) {
        query = query.eq('organization_id', filters.organizationId)
      }

      if (filters?.equipmentType) {
        query = query.eq('equipment_type', filters.equipmentType)
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.isCompliant !== undefined) {
        query = query.eq('is_compliant', filters.isCompliant)
      }

      const { data, error } = await query

      if (error) {
        console.error('EquipmentService.getAll error:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SafetyEquipment[], error: null }
    } catch (err) {
      console.error('EquipmentService.getAll exception:', err)
      return { data: null, error: 'Eroare la încărcarea echipamentelor' }
    }
  }

  /**
   * Returnează un echipament specific după ID
   */
  async getById(id: string): Promise<{ data: SafetyEquipment | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data, error } = await supabase
        .from('safety_equipment')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('EquipmentService.getById error:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SafetyEquipment, error: null }
    } catch (err) {
      console.error('EquipmentService.getById exception:', err)
      return { data: null, error: 'Eroare la încărcarea echipamentului' }
    }
  }

  /**
   * Înregistrează un echipament nou
   */
  async register(equipmentData: RegisterEquipmentData): Promise<{ data: SafetyEquipment | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const insertData = {
        organization_id: equipmentData.organizationId,
        equipment_type: equipmentData.equipmentType,
        description: equipmentData.description || null,
        location: equipmentData.location || null,
        serial_number: equipmentData.serialNumber || null,
        expiry_date: equipmentData.expiryDate,
        next_inspection_date: equipmentData.nextInspectionDate || null,
        inspector_name: equipmentData.inspectorName || null,
        is_compliant: equipmentData.isCompliant ?? true,
        notes: equipmentData.notes || null,
        content_version: 1,
        legal_basis_version: 'v1.0',
      }

      const { data, error } = await supabase
        .from('safety_equipment')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('EquipmentService.register error:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SafetyEquipment, error: null }
    } catch (err) {
      console.error('EquipmentService.register exception:', err)
      return { data: null, error: 'Eroare la înregistrarea echipamentului' }
    }
  }

  /**
   * Adaugă o nouă inspecție pentru un echipament existent
   */
  async addInspection(
    equipmentId: string,
    inspectionData: InspectionData
  ): Promise<{ data: SafetyEquipment | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const updateData: Partial<SafetyEquipment> = {
        last_inspection_date: inspectionData.inspectionDate,
        is_compliant: inspectionData.isCompliant,
        inspector_name: inspectionData.inspectorName || null,
        notes: inspectionData.notes || null,
      }

      if (inspectionData.expiryDate) {
        updateData.expiry_date = inspectionData.expiryDate
      }

      if (inspectionData.nextInspectionDate) {
        updateData.next_inspection_date = inspectionData.nextInspectionDate
      }

      const { data, error } = await supabase
        .from('safety_equipment')
        .update(updateData)
        .eq('id', equipmentId)
        .select()
        .single()

      if (error) {
        console.error('EquipmentService.addInspection error:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SafetyEquipment, error: null }
    } catch (err) {
      console.error('EquipmentService.addInspection exception:', err)
      return { data: null, error: 'Eroare la adăugarea inspecției' }
    }
  }

  /**
   * Returnează echipamentele care au inspecția scadentă (în următoarele N zile)
   */
  async getDueInspection(
    organizationId: string,
    daysAhead: number = 30
  ): Promise<{ data: SafetyEquipment[] | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + daysAhead)

      const { data, error } = await supabase
        .from('safety_equipment')
        .select('*')
        .eq('organization_id', organizationId)
        .lte('next_inspection_date', futureDate.toISOString().split('T')[0])
        .not('next_inspection_date', 'is', null)
        .order('next_inspection_date', { ascending: true })

      if (error) {
        console.error('EquipmentService.getDueInspection error:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SafetyEquipment[], error: null }
    } catch (err) {
      console.error('EquipmentService.getDueInspection exception:', err)
      return { data: null, error: 'Eroare la încărcarea inspecțiilor scadente' }
    }
  }

  /**
   * Returnează echipamentele dintr-o anumită locație
   */
  async getByLocation(
    organizationId: string,
    location: string
  ): Promise<{ data: SafetyEquipment[] | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data, error } = await supabase
        .from('safety_equipment')
        .select('*')
        .eq('organization_id', organizationId)
        .ilike('location', `%${location}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('EquipmentService.getByLocation error:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SafetyEquipment[], error: null }
    } catch (err) {
      console.error('EquipmentService.getByLocation exception:', err)
      return { data: null, error: 'Eroare la căutarea echipamentelor după locație' }
    }
  }

  /**
   * Actualizează statusul de conformitate al unui echipament
   */
  async updateStatus(
    equipmentId: string,
    statusData: UpdateStatusData
  ): Promise<{ data: SafetyEquipment | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const updateData: Partial<SafetyEquipment> = {
        is_compliant: statusData.isCompliant,
      }

      if (statusData.notes !== undefined) {
        updateData.notes = statusData.notes
      }

      const { data, error } = await supabase
        .from('safety_equipment')
        .update(updateData)
        .eq('id', equipmentId)
        .select()
        .single()

      if (error) {
        console.error('EquipmentService.updateStatus error:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SafetyEquipment, error: null }
    } catch (err) {
      console.error('EquipmentService.updateStatus exception:', err)
      return { data: null, error: 'Eroare la actualizarea statusului' }
    }
  }
}

// Export singleton instance
export const equipmentService = new EquipmentService()
