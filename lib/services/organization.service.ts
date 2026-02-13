// lib/services/organization.service.ts
// Service pentru operații CRUD pe organizations
// Data: 13 Februarie 2026

import { createSupabaseServer } from '@/lib/supabase/server'
import type { Organization, Membership } from '@/lib/types'
import type { OrganizationModule, ModuleKey, ModuleStatus } from '@/lib/modules/types'

// ── Tipuri pentru request/response ──

export interface CreateOrganizationData {
  name: string
  cui?: string | null
  address?: string | null
  county?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  preferred_channels?: string[]
}

export interface UpdateOrganizationData {
  name?: string
  cui?: string | null
  address?: string | null
  county?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  preferred_channels?: string[]
  cooperation_status?: 'active' | 'warning' | 'uncooperative'
}

export interface AddMemberData {
  user_id: string
  role: 'consultant' | 'firma_admin' | 'angajat'
  is_active?: boolean
}

export interface UpdateOrganizationSettings {
  [key: string]: any
}

export interface MemberWithProfile extends Membership {
  profile?: {
    id: string
    full_name: string
    phone: string | null
    avatar_url: string | null
  }
}

export interface ActivateModuleData {
  status?: ModuleStatus
  trial_expires_at?: string | null
  expires_at?: string | null
  config?: Record<string, any>
}

// ── OrganizationService Class ──

export class OrganizationService {
  /**
   * Obține o organizație după ID
   * @param organizationId - ID-ul organizației
   * @returns Organization sau null dacă nu există
   */
  static async getById(organizationId: string): Promise<{ data: Organization | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single()

      if (error) {
        console.error('[OrganizationService.getById] Error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.getById] Exception:', err)
      return { data: null, error: message }
    }
  }

  /**
   * Creează o organizație nouă
   * @param organizationData - Datele organizației
   * @param creatorUserId - ID-ul userului care creează (va fi adăugat automat ca membru)
   * @returns Organization creată
   */
  static async create(
    organizationData: CreateOrganizationData,
    creatorUserId: string
  ): Promise<{ data: Organization | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      // Creează organizația
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationData.name,
          cui: organizationData.cui || null,
          address: organizationData.address || null,
          county: organizationData.county || null,
          contact_email: organizationData.contact_email || null,
          contact_phone: organizationData.contact_phone || null,
          preferred_channels: organizationData.preferred_channels || [],
          data_completeness: 0,
          exposure_score: 'necalculat',
          cooperation_status: 'active',
        })
        .select()
        .single()

      if (orgError || !org) {
        console.error('[OrganizationService.create] Error creating org:', orgError)
        return { data: null, error: orgError?.message || 'Nu s-a putut crea organizația' }
      }

      // Adaugă creatorul ca membru (consultant sau firma_admin)
      const { error: memberError } = await supabase
        .from('memberships')
        .insert({
          user_id: creatorUserId,
          organization_id: org.id,
          role: 'consultant',
          is_active: true,
        })

      if (memberError) {
        console.error('[OrganizationService.create] Error adding creator as member:', memberError)
        // Nu facem rollback, dar logăm eroarea
      }

      return { data: org, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.create] Exception:', err)
      return { data: null, error: message }
    }
  }

  /**
   * Actualizează o organizație
   * @param organizationId - ID-ul organizației
   * @param updateData - Datele de actualizat
   * @returns Organization actualizată
   */
  static async update(
    organizationId: string,
    updateData: UpdateOrganizationData
  ): Promise<{ data: Organization | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data, error } = await supabase
        .from('organizations')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', organizationId)
        .select()
        .single()

      if (error) {
        console.error('[OrganizationService.update] Error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.update] Exception:', err)
      return { data: null, error: message }
    }
  }

  /**
   * Obține membrii unei organizații cu profile-urile lor
   * @param organizationId - ID-ul organizației
   * @returns Array de memberships cu profile
   */
  static async getMembers(
    organizationId: string
  ): Promise<{ data: MemberWithProfile[]; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data, error } = await supabase
        .from('memberships')
        .select(`
          *,
          profile:profiles!user_id (
            id,
            full_name,
            phone,
            avatar_url
          )
        `)
        .eq('organization_id', organizationId)
        .order('joined_at', { ascending: false })

      if (error) {
        console.error('[OrganizationService.getMembers] Error:', error)
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.getMembers] Exception:', err)
      return { data: [], error: message }
    }
  }

  /**
   * Adaugă un membru la organizație
   * @param organizationId - ID-ul organizației
   * @param memberData - Datele membrului
   * @returns Membership creat
   */
  static async addMember(
    organizationId: string,
    memberData: AddMemberData
  ): Promise<{ data: Membership | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      // Verifică dacă userul există în profiles
      const { data: profileExists, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', memberData.user_id)
        .single()

      if (profileError || !profileExists) {
        return { data: null, error: 'Utilizatorul nu există' }
      }

      // Verifică dacă membership-ul există deja
      const { data: existingMembership } = await supabase
        .from('memberships')
        .select('id')
        .eq('user_id', memberData.user_id)
        .eq('organization_id', organizationId)
        .single()

      if (existingMembership) {
        return { data: null, error: 'Utilizatorul este deja membru' }
      }

      // Creează membership
      const { data, error } = await supabase
        .from('memberships')
        .insert({
          user_id: memberData.user_id,
          organization_id: organizationId,
          role: memberData.role,
          is_active: memberData.is_active !== undefined ? memberData.is_active : true,
        })
        .select()
        .single()

      if (error) {
        console.error('[OrganizationService.addMember] Error:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.addMember] Exception:', err)
      return { data: null, error: message }
    }
  }

  /**
   * Elimină un membru din organizație (soft delete prin is_active = false)
   * @param organizationId - ID-ul organizației
   * @param userId - ID-ul userului de eliminat
   * @returns Success status
   */
  static async removeMember(
    organizationId: string,
    userId: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      // Soft delete: setează is_active = false
      const { error } = await supabase
        .from('memberships')
        .update({ is_active: false })
        .eq('organization_id', organizationId)
        .eq('user_id', userId)

      if (error) {
        console.error('[OrganizationService.removeMember] Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.removeMember] Exception:', err)
      return { success: false, error: message }
    }
  }

  /**
   * Actualizează setările unei organizații (tabel separat organization_settings daca există)
   * Deocamdată, folosim câmpuri din organizations
   * @param organizationId - ID-ul organizației
   * @param settings - Setările de actualizat
   * @returns Success status
   */
  static async updateSettings(
    organizationId: string,
    settings: UpdateOrganizationSettings
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      // Deocamdată actualizăm direct în organizations
      // În viitor, dacă există tabel organization_settings, folosim acel tabel
      const { error } = await supabase
        .from('organizations')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', organizationId)

      if (error) {
        console.error('[OrganizationService.updateSettings] Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.updateSettings] Exception:', err)
      return { success: false, error: message }
    }
  }

  /**
   * Obține modulele active ale unei organizații
   * @param organizationId - ID-ul organizației
   * @returns Array de organization_modules
   */
  static async getModules(
    organizationId: string
  ): Promise<{ data: OrganizationModule[]; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { data, error } = await supabase
        .from('organization_modules')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('[OrganizationService.getModules] Error:', error)
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.getModules] Exception:', err)
      return { data: [], error: message }
    }
  }

  /**
   * Activează un modul pentru organizație
   * @param organizationId - ID-ul organizației
   * @param moduleKey - Cheia modulului (ex: 'ssm', 'psi')
   * @param activationData - Datele de activare (status, expires_at, etc.)
   * @param activatedBy - ID-ul userului care activează modulul
   * @returns OrganizationModule creat sau actualizat
   */
  static async activateModule(
    organizationId: string,
    moduleKey: ModuleKey,
    activationData?: ActivateModuleData,
    activatedBy?: string
  ): Promise<{ data: OrganizationModule | null; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      // Verifică dacă modulul există deja
      const { data: existingModule } = await supabase
        .from('organization_modules')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('module_key', moduleKey)
        .single()

      const now = new Date().toISOString()

      if (existingModule) {
        // Actualizează modulul existent
        const { data, error } = await supabase
          .from('organization_modules')
          .update({
            status: activationData?.status || 'active',
            trial_expires_at: activationData?.trial_expires_at || null,
            expires_at: activationData?.expires_at || null,
            config: activationData?.config || existingModule.config,
            activated_at: now,
            activated_by: activatedBy || existingModule.activated_by,
            updated_at: now,
          })
          .eq('id', existingModule.id)
          .select()
          .single()

        if (error) {
          console.error('[OrganizationService.activateModule] Error updating:', error)
          return { data: null, error: error.message }
        }

        return { data, error: null }
      } else {
        // Creează modul nou
        const { data, error } = await supabase
          .from('organization_modules')
          .insert({
            organization_id: organizationId,
            module_key: moduleKey,
            status: activationData?.status || 'active',
            trial_expires_at: activationData?.trial_expires_at || null,
            expires_at: activationData?.expires_at || null,
            config: activationData?.config || {},
            activated_at: now,
            activated_by: activatedBy || null,
          })
          .select()
          .single()

        if (error) {
          console.error('[OrganizationService.activateModule] Error creating:', error)
          return { data: null, error: error.message }
        }

        return { data, error: null }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.activateModule] Exception:', err)
      return { data: null, error: message }
    }
  }

  /**
   * Dezactivează un modul pentru organizație
   * @param organizationId - ID-ul organizației
   * @param moduleKey - Cheia modulului
   * @returns Success status
   */
  static async deactivateModule(
    organizationId: string,
    moduleKey: ModuleKey
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabase = await createSupabaseServer()

      const { error } = await supabase
        .from('organization_modules')
        .update({
          status: 'inactive',
          updated_at: new Date().toISOString(),
        })
        .eq('organization_id', organizationId)
        .eq('module_key', moduleKey)

      if (error) {
        console.error('[OrganizationService.deactivateModule] Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare necunoscută'
      console.error('[OrganizationService.deactivateModule] Exception:', err)
      return { success: false, error: message }
    }
  }
}
