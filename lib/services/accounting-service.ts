/**
 * AccountingService - Business logic for accounting module
 * Created: 2026-02-16
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  AccountingContract,
  AccountingDeadline,
  AccountingDashboardStats,
  CreateContractInput,
  UpdateContractInput,
  CreateDeadlineInput,
  UpdateDeadlineInput,
  DeadlineFilters,
  ContractFilters,
  DEADLINE_LABELS,
  AccountingService as AccountingServiceType,
} from './accounting-types';

export class AccountingService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  // ==================== CONTRACTS ====================

  async getContracts(orgId: string, filters?: ContractFilters): Promise<AccountingContract[]> {
    try {
      let query = this.supabase
        .from('accounting_contracts')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters?.search) {
        query = query.or(`client_name.ilike.%${filters.search}%,client_cui.ilike.%${filters.search}%,contract_number.ilike.%${filters.search}%`);
      }

      if (filters?.currency) {
        query = query.eq('currency', filters.currency);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw new Error('Nu s-au putut încărca contractele');
    }
  }

  async getContractById(id: string): Promise<AccountingContract | null> {
    try {
      const { data, error } = await this.supabase
        .from('accounting_contracts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching contract:', error);
      throw new Error('Nu s-a putut încărca contractul');
    }
  }

  async createContract(input: CreateContractInput): Promise<AccountingContract> {
    try {
      const { data, error } = await this.supabase
        .from('accounting_contracts')
        .insert(input)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity({
        org_id: input.org_id,
        contract_id: data.id,
        action: 'contract_created',
        details: { client_name: input.client_name },
      });

      return data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw new Error('Nu s-a putut crea contractul');
    }
  }

  async updateContract(id: string, input: UpdateContractInput): Promise<AccountingContract> {
    try {
      const { data, error } = await this.supabase
        .from('accounting_contracts')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      if (data) {
        await this.logActivity({
          org_id: data.org_id,
          contract_id: id,
          action: 'contract_updated',
          details: { changes: input },
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw new Error('Nu s-a putut actualiza contractul');
    }
  }

  async deleteContract(id: string): Promise<void> {
    try {
      // Soft delete by setting status to terminated
      const { data, error } = await this.supabase
        .from('accounting_contracts')
        .update({ status: 'terminated' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      if (data) {
        await this.logActivity({
          org_id: data.org_id,
          contract_id: id,
          action: 'contract_terminated',
          details: {},
        });
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw new Error('Nu s-a putut șterge contractul');
    }
  }

  // ==================== DEADLINES ====================

  async getDeadlines(orgId: string, filters?: DeadlineFilters): Promise<AccountingDeadline[]> {
    try {
      let query = this.supabase
        .from('accounting_deadlines')
        .select(`
          *,
          accounting_contracts!left(client_name, client_cui, contract_number)
        `)
        .eq('org_id', orgId)
        .order('due_date', { ascending: true });

      if (filters?.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters?.contract_id) {
        query = query.eq('contract_id', filters.contract_id);
      }

      if (filters?.from_date) {
        query = query.gte('due_date', filters.from_date);
      }

      if (filters?.to_date) {
        query = query.lte('due_date', filters.to_date);
      }

      if (filters?.deadline_type) {
        query = query.eq('deadline_type', filters.deadline_type);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Flatten joined data
      return (data || []).map((item: any) => ({
        ...item,
        client_name: item.accounting_contracts?.client_name,
        client_cui: item.accounting_contracts?.client_cui,
        contract_number: item.accounting_contracts?.contract_number,
        accounting_contracts: undefined,
      }));
    } catch (error) {
      console.error('Error fetching deadlines:', error);
      throw new Error('Nu s-au putut încărca termenele');
    }
  }

  async getUpcomingDeadlines(orgId: string, days: number = 7): Promise<AccountingDeadline[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      return await this.getDeadlines(orgId, {
        status: ['pending', 'in_progress'],
        from_date: today,
        to_date: futureDate,
      });
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
      throw new Error('Nu s-au putut încărca termenele viitoare');
    }
  }

  async getOverdueDeadlines(orgId: string): Promise<AccountingDeadline[]> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await this.supabase
        .from('accounting_deadlines')
        .select(`
          *,
          accounting_contracts!left(client_name, client_cui, contract_number)
        `)
        .eq('org_id', orgId)
        .lt('due_date', today)
        .not('status', 'in', '(completed,not_applicable)')
        .order('due_date', { ascending: true });

      if (error) throw error;

      // Flatten joined data
      return (data || []).map((item: any) => ({
        ...item,
        client_name: item.accounting_contracts?.client_name,
        client_cui: item.accounting_contracts?.client_cui,
        contract_number: item.accounting_contracts?.contract_number,
        accounting_contracts: undefined,
      }));
    } catch (error) {
      console.error('Error fetching overdue deadlines:', error);
      throw new Error('Nu s-au putut încărca termenele restante');
    }
  }

  async createDeadline(input: CreateDeadlineInput): Promise<AccountingDeadline> {
    try {
      const { data, error } = await this.supabase
        .from('accounting_deadlines')
        .insert(input)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity({
        org_id: input.org_id,
        contract_id: input.contract_id,
        deadline_id: data.id,
        action: 'deadline_created',
        details: { title: input.title, due_date: input.due_date },
      });

      return data;
    } catch (error) {
      console.error('Error creating deadline:', error);
      throw new Error('Nu s-a putut crea termenul');
    }
  }

  async updateDeadlineStatus(
    id: string,
    status: string,
    userId?: string
  ): Promise<AccountingDeadline> {
    try {
      const updateData: UpdateDeadlineInput = { status: status as any };

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.completed_by = userId;
      }

      const { data, error } = await this.supabase
        .from('accounting_deadlines')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      if (data) {
        await this.logActivity({
          org_id: data.org_id,
          contract_id: data.contract_id,
          deadline_id: id,
          action: 'deadline_status_changed',
          details: { old_status: data.status, new_status: status },
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating deadline status:', error);
      throw new Error('Nu s-a putut actualiza statusul termenului');
    }
  }

  async bulkCreateDeadlines(deadlines: CreateDeadlineInput[]): Promise<AccountingDeadline[]> {
    try {
      const { data, error } = await this.supabase
        .from('accounting_deadlines')
        .insert(deadlines)
        .select();

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error bulk creating deadlines:', error);
      throw new Error('Nu s-au putut crea termenele');
    }
  }

  // ==================== AUTO-GENERATE DEADLINES ====================

  async generateStandardDeadlines(
    contractId: string,
    orgId: string,
    services: AccountingServiceType[],
    startYear?: number
  ): Promise<AccountingDeadline[]> {
    const year = startYear || new Date().getFullYear();
    const deadlinesToCreate: CreateDeadlineInput[] = [];

    // Check which services are included
    const hasPayroll = services.some((s) => s.type === 'salarizare');
    const hasTVA = services.some((s) => s.type === 'TVA');
    const hasFiscalDeclarations = services.some((s) => s.type === 'declaratii_fiscale');
    const hasBilant = services.some((s) => s.type === 'bilant');

    // D112 - Monthly if payroll service
    if (hasPayroll) {
      for (let month = 1; month <= 12; month++) {
        const dueDate = new Date(year, month, 25);
        deadlinesToCreate.push({
          org_id: orgId,
          contract_id: contractId,
          deadline_type: 'D112',
          title: `${DEADLINE_LABELS.D112.label} - ${this.getMonthName(month)} ${year}`,
          description: DEADLINE_LABELS.D112.description,
          due_date: dueDate.toISOString().split('T')[0],
          recurrence: 'monthly',
        });
      }
    }

    // D300 - Monthly if TVA service
    if (hasTVA) {
      for (let month = 1; month <= 12; month++) {
        const dueDate = new Date(year, month, 25);
        deadlinesToCreate.push({
          org_id: orgId,
          contract_id: contractId,
          deadline_type: 'D300',
          title: `${DEADLINE_LABELS.D300.label} - ${this.getMonthName(month)} ${year}`,
          description: DEADLINE_LABELS.D300.description,
          due_date: dueDate.toISOString().split('T')[0],
          recurrence: 'monthly',
        });
      }
    }

    // Pontaj - Monthly if payroll
    if (hasPayroll) {
      for (let month = 1; month <= 12; month++) {
        const dueDate = new Date(year, month, 5);
        deadlinesToCreate.push({
          org_id: orgId,
          contract_id: contractId,
          deadline_type: 'pontaj',
          title: `${DEADLINE_LABELS.pontaj.label} - ${this.getMonthName(month)} ${year}`,
          description: DEADLINE_LABELS.pontaj.description,
          due_date: dueDate.toISOString().split('T')[0],
          recurrence: 'monthly',
        });
      }
    }

    // Bilanț - Annual if has bilant service
    if (hasBilant) {
      const bilantDate = new Date(year + 1, 4, 30); // May 30 next year
      deadlinesToCreate.push({
        org_id: orgId,
        contract_id: contractId,
        deadline_type: 'bilant',
        title: `${DEADLINE_LABELS.bilant.label} - ${year}`,
        description: DEADLINE_LABELS.bilant.description,
        due_date: bilantDate.toISOString().split('T')[0],
        recurrence: 'annual',
      });
    }

    // D100 - Quarterly profit tax (if fiscal declarations)
    if (hasFiscalDeclarations) {
      const quarters = [
        { month: 3, quarter: 'T1' },
        { month: 6, quarter: 'T2' },
        { month: 9, quarter: 'T3' },
        { month: 12, quarter: 'T4' },
      ];

      quarters.forEach((q) => {
        const dueDate = new Date(year, q.month, 25);
        deadlinesToCreate.push({
          org_id: orgId,
          contract_id: contractId,
          deadline_type: 'D100',
          title: `${DEADLINE_LABELS.D100.label} - ${q.quarter} ${year}`,
          description: DEADLINE_LABELS.D100.description,
          due_date: dueDate.toISOString().split('T')[0],
          recurrence: 'quarterly',
        });
      });
    }

    if (deadlinesToCreate.length === 0) {
      return [];
    }

    return await this.bulkCreateDeadlines(deadlinesToCreate);
  }

  // ==================== DASHBOARD STATS ====================

  async getDashboardStats(orgId: string): Promise<AccountingDashboardStats> {
    try {
      // Total contracts
      const { count: totalContracts } = await this.supabase
        .from('accounting_contracts')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId);

      // Active contracts
      const { count: activeContracts } = await this.supabase
        .from('accounting_contracts')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .eq('status', 'active');

      // Total monthly revenue (sum of all active contracts)
      const { data: revenueData } = await this.supabase
        .from('accounting_contracts')
        .select('monthly_fee, currency')
        .eq('org_id', orgId)
        .eq('status', 'active');

      const totalMonthlyRevenue = (revenueData || [])
        .filter((c: any) => c.currency === 'RON')
        .reduce((sum: number, c: any) => sum + (Number(c.monthly_fee) || 0), 0);

      // Upcoming deadlines (7 days)
      const upcomingDeadlines = await this.getUpcomingDeadlines(orgId, 7);
      const upcomingDeadlines7days = upcomingDeadlines.length;

      // Overdue count
      const overdueDeadlines = await this.getOverdueDeadlines(orgId);
      const overdueCount = overdueDeadlines.length;

      // Completion rate (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const { data: recentDeadlines } = await this.supabase
        .from('accounting_deadlines')
        .select('status')
        .eq('org_id', orgId)
        .gte('due_date', thirtyDaysAgo);

      const totalRecent = recentDeadlines?.length || 0;
      const completedRecent = recentDeadlines?.filter((d: any) => d.status === 'completed').length || 0;
      const completionRate = totalRecent > 0 ? Math.round((completedRecent / totalRecent) * 100) : 0;

      return {
        totalContracts: totalContracts || 0,
        activeContracts: activeContracts || 0,
        totalMonthlyRevenue,
        upcomingDeadlines7days,
        overdueCount,
        completionRate,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Nu s-au putut încărca statisticile');
    }
  }

  // ==================== ACTIVITY LOG ====================

  private async logActivity(input: {
    org_id?: string;
    contract_id?: string;
    deadline_id?: string;
    action: string;
    details?: Record<string, any>;
  }): Promise<void> {
    try {
      const { data: userData } = await this.supabase.auth.getUser();

      await this.supabase.from('accounting_activity_log').insert({
        ...input,
        performed_by: userData?.user?.id,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw - activity log failure shouldn't block operations
    }
  }

  async getActivityLog(orgId: string, contractId?: string, limit: number = 50): Promise<any[]> {
    try {
      let query = this.supabase
        .from('accounting_activity_log')
        .select('*')
        .eq('org_id', orgId)
        .order('performed_at', { ascending: false })
        .limit(limit);

      if (contractId) {
        query = query.eq('contract_id', contractId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching activity log:', error);
      throw new Error('Nu s-a putut încărca jurnalul de activitate');
    }
  }

  // ==================== UTILITIES ====================

  private getMonthName(month: number): string {
    const months = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
    ];
    return months[month - 1];
  }
}
