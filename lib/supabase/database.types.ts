// S-S-M.RO — SUPABASE DATABASE TYPES
// Auto-generated TypeScript interfaces for all database tables
// Last updated: 2026-02-13
// Project: uhccxfyvhjeudkexcgiq

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ============================================================
      // CORE TABLES
      // ============================================================

      organizations: {
        Row: {
          id: string
          name: string
          cui: string | null
          address: string | null
          county: string | null
          contact_email: string | null
          contact_phone: string | null
          data_completeness: number
          employee_count?: number
          exposure_score: 'necalculat' | 'scazut' | 'mediu' | 'ridicat' | 'critic'
          preferred_channels: string[]
          cooperation_status: 'active' | 'warning' | 'uncooperative'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          cui?: string | null
          address?: string | null
          county?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          data_completeness?: number
          employee_count?: number
          exposure_score?: 'necalculat' | 'scazut' | 'mediu' | 'ridicat' | 'critic'
          preferred_channels?: string[]
          cooperation_status?: 'active' | 'warning' | 'uncooperative'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          cui?: string | null
          address?: string | null
          county?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          data_completeness?: number
          employee_count?: number
          exposure_score?: 'necalculat' | 'scazut' | 'mediu' | 'ridicat' | 'critic'
          preferred_channels?: string[]
          cooperation_status?: 'active' | 'warning' | 'uncooperative'
          created_at?: string
          updated_at?: string
        }
      }

      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }

      memberships: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          role: 'consultant' | 'firma_admin' | 'angajat'
          is_active: boolean
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          role: 'consultant' | 'firma_admin' | 'angajat'
          is_active?: boolean
          joined_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          role?: 'consultant' | 'firma_admin' | 'angajat'
          is_active?: boolean
          joined_at?: string
        }
      }

      employees: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          full_name: string
          email: string | null
          phone: string | null
          position: string | null
          cnp_hash: string | null
          cor_code: string | null
          employment_status: string | null
          start_date: string | null
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id?: string | null
          full_name: string
          email?: string | null
          phone?: string | null
          position?: string | null
          cnp_hash?: string | null
          cor_code?: string | null
          employment_status?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string | null
          full_name?: string
          email?: string | null
          phone?: string | null
          position?: string | null
          cnp_hash?: string | null
          cor_code?: string | null
          employment_status?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      locations: {
        Row: {
          id: string
          organization_id: string
          name: string
          address: string | null
          county: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          address?: string | null
          county?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          address?: string | null
          county?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================================
      // MEDICAL & SAFETY
      // ============================================================

      medical_examinations: {
        Row: {
          id: string
          organization_id: string
          employee_name: string
          cnp_hash: string | null
          job_title: string | null
          examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
          examination_date: string
          expiry_date: string
          result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
          restrictions: string | null
          doctor_name: string | null
          clinic_name: string | null
          notes: string | null
          content_version: number
          legal_basis_version: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          employee_name: string
          cnp_hash?: string | null
          job_title?: string | null
          examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
          examination_date: string
          expiry_date: string
          result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
          restrictions?: string | null
          doctor_name?: string | null
          clinic_name?: string | null
          notes?: string | null
          content_version?: number
          legal_basis_version?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          employee_name?: string
          cnp_hash?: string | null
          job_title?: string | null
          examination_type?: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
          examination_date?: string
          expiry_date?: string
          result?: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
          restrictions?: string | null
          doctor_name?: string | null
          clinic_name?: string | null
          notes?: string | null
          content_version?: number
          legal_basis_version?: string
          created_at?: string
          updated_at?: string
        }
      }

      safety_equipment: {
        Row: {
          id: string
          organization_id: string
          equipment_type: 'stingator' | 'trusa_prim_ajutor' | 'hidrant' | 'detector_fum' |
            'detector_gaz' | 'iluminat_urgenta' | 'panou_semnalizare' | 'trusa_scule' | 'eip' | 'altul'
          description: string | null
          location: string | null
          serial_number: string | null
          last_inspection_date: string | null
          expiry_date: string
          next_inspection_date: string | null
          inspector_name: string | null
          is_compliant: boolean
          notes: string | null
          content_version: number
          legal_basis_version: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          equipment_type: 'stingator' | 'trusa_prim_ajutor' | 'hidrant' | 'detector_fum' |
            'detector_gaz' | 'iluminat_urgenta' | 'panou_semnalizare' | 'trusa_scule' | 'eip' | 'altul'
          description?: string | null
          location?: string | null
          serial_number?: string | null
          last_inspection_date?: string | null
          expiry_date: string
          next_inspection_date?: string | null
          inspector_name?: string | null
          is_compliant?: boolean
          notes?: string | null
          content_version?: number
          legal_basis_version?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          equipment_type?: 'stingator' | 'trusa_prim_ajutor' | 'hidrant' | 'detector_fum' |
            'detector_gaz' | 'iluminat_urgenta' | 'panou_semnalizare' | 'trusa_scule' | 'eip' | 'altul'
          description?: string | null
          location?: string | null
          serial_number?: string | null
          last_inspection_date?: string | null
          expiry_date?: string
          next_inspection_date?: string | null
          inspector_name?: string | null
          is_compliant?: boolean
          notes?: string | null
          content_version?: number
          legal_basis_version?: string
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================================
      // TRAINING SYSTEM
      // ============================================================

      training_modules: {
        Row: {
          id: string
          organization_id: string | null
          title: string
          description: string | null
          content: string | null
          order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          title: string
          description?: string | null
          content?: string | null
          order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          title?: string
          description?: string | null
          content?: string | null
          order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      training_assignments: {
        Row: {
          id: string
          employee_id: string
          module_id: string
          assigned_at: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          module_id: string
          assigned_at?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          module_id?: string
          assigned_at?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }

      training_sessions: {
        Row: {
          id: string
          assignment_id: string
          employee_id: string
          progress: number
          completed_at: string | null
          quiz_results: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          employee_id: string
          progress?: number
          completed_at?: string | null
          quiz_results?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          employee_id?: string
          progress?: number
          completed_at?: string | null
          quiz_results?: Json | null
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================================
      // RBAC SYSTEM (Implemented 8 Feb 2026)
      // ============================================================

      roles: {
        Row: {
          id: string
          role_key: string
          role_name: string
          description: string | null
          country_code: string | null
          is_system: boolean
          is_active: boolean
          created_by: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          role_key: string
          role_name: string
          description?: string | null
          country_code?: string | null
          is_system?: boolean
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          role_key?: string
          role_name?: string
          description?: string | null
          country_code?: string | null
          is_system?: boolean
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          metadata?: Json
        }
      }

      permissions: {
        Row: {
          id: string
          role_id: string
          resource: string
          action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'delegate'
          field_restrictions: Json
          conditions: Json
          country_code: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          role_id: string
          resource: string
          action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'delegate'
          field_restrictions?: Json
          conditions?: Json
          country_code?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          role_id?: string
          resource?: string
          action?: 'create' | 'read' | 'update' | 'delete' | 'export' | 'delegate'
          field_restrictions?: Json
          conditions?: Json
          country_code?: string | null
          is_active?: boolean
        }
      }

      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          company_id: string | null
          location_id: string | null
          granted_by: string | null
          granted_at: string
          expires_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          company_id?: string | null
          location_id?: string | null
          granted_by?: string | null
          granted_at?: string
          expires_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          company_id?: string | null
          location_id?: string | null
          granted_by?: string | null
          granted_at?: string
          expires_at?: string | null
          is_active?: boolean
        }
      }

      // ============================================================
      // NOTIFICATIONS & ALERTS
      // ============================================================

      notification_log: {
        Row: {
          id: string
          organization_id: string
          notification_type: 'alert_mm_30d' | 'alert_mm_15d' | 'alert_mm_7d' | 'alert_mm_expired' |
            'alert_psi_30d' | 'alert_psi_15d' | 'alert_psi_expired' |
            'report_monthly' | 'fraud_alert' | 'system_alert'
          channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'calendar'
          recipient: string
          status: 'sent' | 'delivered' | 'opened' | 'actioned' | 'ignored' | 'failed'
          sent_at: string
          delivered_at: string | null
          opened_at: string | null
          actioned_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          organization_id: string
          notification_type: 'alert_mm_30d' | 'alert_mm_15d' | 'alert_mm_7d' | 'alert_mm_expired' |
            'alert_psi_30d' | 'alert_psi_15d' | 'alert_psi_expired' |
            'report_monthly' | 'fraud_alert' | 'system_alert'
          channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'calendar'
          recipient: string
          status?: 'sent' | 'delivered' | 'opened' | 'actioned' | 'ignored' | 'failed'
          sent_at?: string
          delivered_at?: string | null
          opened_at?: string | null
          actioned_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          organization_id?: string
          notification_type?: 'alert_mm_30d' | 'alert_mm_15d' | 'alert_mm_7d' | 'alert_mm_expired' |
            'alert_psi_30d' | 'alert_psi_15d' | 'alert_psi_expired' |
            'report_monthly' | 'fraud_alert' | 'system_alert'
          channel?: 'email' | 'sms' | 'whatsapp' | 'push' | 'calendar'
          recipient?: string
          status?: 'sent' | 'delivered' | 'opened' | 'actioned' | 'ignored' | 'failed'
          sent_at?: string
          delivered_at?: string | null
          opened_at?: string | null
          actioned_at?: string | null
          metadata?: Json
        }
      }

      alerts: {
        Row: {
          id: string
          organization_id: string
          alert_type: string
          severity: 'info' | 'warning' | 'critical' | 'expired'
          title: string
          description: string | null
          entity_type: string | null
          entity_id: string | null
          is_resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          alert_type: string
          severity?: 'info' | 'warning' | 'critical' | 'expired'
          title: string
          description?: string | null
          entity_type?: string | null
          entity_id?: string | null
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          alert_type?: string
          severity?: 'info' | 'warning' | 'critical' | 'expired'
          title?: string
          description?: string | null
          entity_type?: string | null
          entity_id?: string | null
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================================
      // DOCUMENTS & AUDIT
      // ============================================================

      documents: {
        Row: {
          id: string
          organization_id: string
          document_type: 'fisa_medicina_muncii' | 'fisa_echipamente' | 'raport_conformitate' |
            'fisa_instruire' | 'raport_neactiune' | 'altul'
          storage_path: string
          file_name: string
          file_size_bytes: number | null
          content_version: number
          legal_basis_version: string
          sha256_hash: string | null
          is_locked: boolean
          generated_by: string | null
          generation_context: Json
          ignored_notifications_count: number
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          document_type: 'fisa_medicina_muncii' | 'fisa_echipamente' | 'raport_conformitate' |
            'fisa_instruire' | 'raport_neactiune' | 'altul'
          storage_path: string
          file_name: string
          file_size_bytes?: number | null
          content_version?: number
          legal_basis_version?: string
          sha256_hash?: string | null
          is_locked?: boolean
          generated_by?: string | null
          generation_context?: Json
          ignored_notifications_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          document_type?: 'fisa_medicina_muncii' | 'fisa_echipamente' | 'raport_conformitate' |
            'fisa_instruire' | 'raport_neactiune' | 'altul'
          storage_path?: string
          file_name?: string
          file_size_bytes?: number | null
          content_version?: number
          legal_basis_version?: string
          sha256_hash?: string | null
          is_locked?: boolean
          generated_by?: string | null
          generation_context?: Json
          ignored_notifications_count?: number
          created_at?: string
        }
      }

      audit_log: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          metadata: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }

      // ============================================================
      // CONFIGURATION TABLES (Multi-tenant, 9 Feb 2026)
      // ============================================================

      obligation_types: {
        Row: {
          id: string
          country_code: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
          name: string
          description: string | null
          frequency: 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once'
          authority_name: string
          legal_reference: string | null
          penalty_min: number | null
          penalty_max: number | null
          currency: 'RON' | 'BGN' | 'HUF' | 'EUR' | 'PLN'
          is_active: boolean
          is_system: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country_code: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
          name: string
          description?: string | null
          frequency: 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once'
          authority_name: string
          legal_reference?: string | null
          penalty_min?: number | null
          penalty_max?: number | null
          currency: 'RON' | 'BGN' | 'HUF' | 'EUR' | 'PLN'
          is_active?: boolean
          is_system?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country_code?: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
          name?: string
          description?: string | null
          frequency?: 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once'
          authority_name?: string
          legal_reference?: string | null
          penalty_min?: number | null
          penalty_max?: number | null
          currency?: 'RON' | 'BGN' | 'HUF' | 'EUR' | 'PLN'
          is_active?: boolean
          is_system?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }

      alert_categories: {
        Row: {
          id: string
          country_code: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
          name: string
          description: string | null
          severity: 'info' | 'warning' | 'critical' | 'expired'
          warning_days_before: number
          critical_days_before: number
          obligation_id: string | null
          notify_channels: ('email' | 'whatsapp' | 'sms' | 'push')[]
          is_active: boolean
          is_system: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country_code: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
          name: string
          description?: string | null
          severity?: 'info' | 'warning' | 'critical' | 'expired'
          warning_days_before?: number
          critical_days_before?: number
          obligation_id?: string | null
          notify_channels?: ('email' | 'whatsapp' | 'sms' | 'push')[]
          is_active?: boolean
          is_system?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country_code?: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
          name?: string
          description?: string | null
          severity?: 'info' | 'warning' | 'critical' | 'expired'
          warning_days_before?: number
          critical_days_before?: number
          obligation_id?: string | null
          notify_channels?: ('email' | 'whatsapp' | 'sms' | 'push')[]
          is_active?: boolean
          is_system?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }

      equipment_types: {
        Row: {
          id: string
          country_code: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
          name: string
          description: string | null
          category: 'fire_safety' | 'first_aid' | 'ppe' | 'emergency_exit' | 'detection' | 'pressure_equipment' | 'lifting_equipment' | 'other'
          subcategory: string | null
          inspection_frequency: 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once'
          legal_standard: string | null
          obligation_id: string | null
          max_lifespan_years: number | null
          requires_certification: boolean
          certification_authority: string | null
          is_active: boolean
          is_system: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country_code: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
          name: string
          description?: string | null
          category: 'fire_safety' | 'first_aid' | 'ppe' | 'emergency_exit' | 'detection' | 'pressure_equipment' | 'lifting_equipment' | 'other'
          subcategory?: string | null
          inspection_frequency: 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once'
          legal_standard?: string | null
          obligation_id?: string | null
          max_lifespan_years?: number | null
          requires_certification?: boolean
          certification_authority?: string | null
          is_active?: boolean
          is_system?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country_code?: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
          name?: string
          description?: string | null
          category?: 'fire_safety' | 'first_aid' | 'ppe' | 'emergency_exit' | 'detection' | 'pressure_equipment' | 'lifting_equipment' | 'other'
          subcategory?: string | null
          inspection_frequency?: 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once'
          legal_standard?: string | null
          obligation_id?: string | null
          max_lifespan_years?: number | null
          requires_certification?: boolean
          certification_authority?: string | null
          is_active?: boolean
          is_system?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================================
      // REGES INTEGRATION (6-7 Feb 2026)
      // ============================================================

      reges_connections: {
        Row: {
          id: string
          organization_id: string
          cui: string
          reges_user_id: string
          reges_employer_id: string
          status: 'active' | 'inactive' | 'error'
          encrypted_credentials: string | null
          encryption_key_version: string
          last_sync_at: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          cui: string
          reges_user_id: string
          reges_employer_id: string
          status?: 'active' | 'inactive' | 'error'
          encrypted_credentials?: string | null
          encryption_key_version?: string
          last_sync_at?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          cui?: string
          reges_user_id?: string
          reges_employer_id?: string
          status?: 'active' | 'inactive' | 'error'
          encrypted_credentials?: string | null
          encryption_key_version?: string
          last_sync_at?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      reges_outbox: {
        Row: {
          id: string
          organization_id: string
          connection_id: string
          message_type: 'employee_create' | 'employee_update' | 'employee_delete' | 'contract_create' | 'contract_update' | 'contract_end'
          payload: Json
          status: 'queued' | 'sending' | 'sent' | 'accepted' | 'rejected' | 'error'
          priority: number
          attempts: number
          max_attempts: number
          scheduled_at: string
          sent_at: string | null
          completed_at: string | null
          error_message: string | null
          receipt_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          connection_id: string
          message_type: 'employee_create' | 'employee_update' | 'employee_delete' | 'contract_create' | 'contract_update' | 'contract_end'
          payload: Json
          status?: 'queued' | 'sending' | 'sent' | 'accepted' | 'rejected' | 'error'
          priority?: number
          attempts?: number
          max_attempts?: number
          scheduled_at?: string
          sent_at?: string | null
          completed_at?: string | null
          error_message?: string | null
          receipt_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          connection_id?: string
          message_type?: 'employee_create' | 'employee_update' | 'employee_delete' | 'contract_create' | 'contract_update' | 'contract_end'
          payload?: Json
          status?: 'queued' | 'sending' | 'sent' | 'accepted' | 'rejected' | 'error'
          priority?: number
          attempts?: number
          max_attempts?: number
          scheduled_at?: string
          sent_at?: string | null
          completed_at?: string | null
          error_message?: string | null
          receipt_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      reges_receipts: {
        Row: {
          id: string
          outbox_id: string
          receipt_number: string | null
          receipt_date: string
          status: 'accepted' | 'rejected' | 'pending_validation'
          validation_errors: Json | null
          raw_response: Json
          created_at: string
        }
        Insert: {
          id?: string
          outbox_id: string
          receipt_number?: string | null
          receipt_date: string
          status: 'accepted' | 'rejected' | 'pending_validation'
          validation_errors?: Json | null
          raw_response: Json
          created_at?: string
        }
        Update: {
          id?: string
          outbox_id?: string
          receipt_number?: string | null
          receipt_date?: string
          status?: 'accepted' | 'rejected' | 'pending_validation'
          validation_errors?: Json | null
          raw_response?: Json
          created_at?: string
        }
      }

      reges_results: {
        Row: {
          id: string
          receipt_id: string
          result_type: 'success' | 'partial_success' | 'failure'
          employee_external_id: string | null
          contract_external_id: string | null
          reges_employee_id: string | null
          reges_contract_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          receipt_id: string
          result_type: 'success' | 'partial_success' | 'failure'
          employee_external_id?: string | null
          contract_external_id?: string | null
          reges_employee_id?: string | null
          reges_contract_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          receipt_id?: string
          result_type?: 'success' | 'partial_success' | 'failure'
          employee_external_id?: string | null
          contract_external_id?: string | null
          reges_employee_id?: string | null
          reges_contract_id?: string | null
          details?: Json | null
          created_at?: string
        }
      }

      reges_employee_snapshots: {
        Row: {
          id: string
          connection_id: string
          organization_id: string
          cnp: string
          full_name: string
          reges_employee_id: string | null
          position: string | null
          contract_type: string | null
          employment_status: 'active' | 'departed' | 'suspended'
          start_date: string | null
          end_date: string | null
          snapshot_date: string
          raw_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          connection_id: string
          organization_id: string
          cnp: string
          full_name: string
          reges_employee_id?: string | null
          position?: string | null
          contract_type?: string | null
          employment_status?: 'active' | 'departed' | 'suspended'
          start_date?: string | null
          end_date?: string | null
          snapshot_date?: string
          raw_data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          connection_id?: string
          organization_id?: string
          cnp?: string
          full_name?: string
          reges_employee_id?: string | null
          position?: string | null
          contract_type?: string | null
          employment_status?: 'active' | 'departed' | 'suspended'
          start_date?: string | null
          end_date?: string | null
          snapshot_date?: string
          raw_data?: Json
          created_at?: string
          updated_at?: string
        }
      }

      // ============================================================
      // USER PREFERENCES (13 Feb 2026)
      // ============================================================

      user_preferences: {
        Row: {
          id: string
          user_id: string
          key: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          key: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          key?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      country_code: 'RO' | 'BG' | 'HU' | 'DE' | 'PL'
      currency: 'RON' | 'BGN' | 'HUF' | 'EUR' | 'PLN'
      obligation_frequency: 'annual' | 'biannual' | 'monthly' | 'quarterly' | 'on_demand' | 'once'
      alert_severity: 'info' | 'warning' | 'critical' | 'expired'
      notification_channel: 'email' | 'whatsapp' | 'sms' | 'push'
      equipment_category: 'fire_safety' | 'first_aid' | 'ppe' | 'emergency_exit' | 'detection' | 'pressure_equipment' | 'lifting_equipment' | 'other'
      rbac_action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'delegate'
      membership_role: 'consultant' | 'firma_admin' | 'angajat'
      examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere'
      examination_result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt'
      exposure_score: 'necalculat' | 'scazut' | 'mediu' | 'ridicat' | 'critic'
      cooperation_status: 'active' | 'warning' | 'uncooperative'
      reges_status: 'active' | 'inactive' | 'error'
      reges_message_type: 'employee_create' | 'employee_update' | 'employee_delete' | 'contract_create' | 'contract_update' | 'contract_end'
      reges_outbox_status: 'queued' | 'sending' | 'sent' | 'accepted' | 'rejected' | 'error'
      reges_receipt_status: 'accepted' | 'rejected' | 'pending_validation'
      reges_result_type: 'success' | 'partial_success' | 'failure'
      employment_status: 'active' | 'departed' | 'suspended'
      document_type: 'fisa_medicina_muncii' | 'fisa_echipamente' | 'raport_conformitate' | 'fisa_instruire' | 'raport_neactiune' | 'altul'
    }
  }
}
