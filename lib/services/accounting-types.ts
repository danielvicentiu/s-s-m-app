/**
 * TypeScript types for Accounting Module
 * Created: 2026-02-16
 */

export type DeadlineType =
  | 'D112'
  | 'D394'
  | 'D300'
  | 'D100'
  | 'D101'
  | 'D390'
  | 'D205'
  | 'declaratie_unica'
  | 'bilant'
  | 'raportare_semestriala'
  | 'TVA'
  | 'impozit_profit'
  | 'impozit_micro'
  | 'CIM_registru'
  | 'pontaj'
  | 'alte';

export type DeadlineRecurrence = 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'one_time';

export type DeadlineStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'not_applicable';

export type ContractStatus = 'active' | 'suspended' | 'terminated';

export type Currency = 'RON' | 'EUR' | 'HUF';

export type AccountingServiceType =
  | 'contabilitate_primara'
  | 'salarizare'
  | 'TVA'
  | 'declaratii_fiscale'
  | 'bilant'
  | 'consultanta_fiscala'
  | 'revisal'
  | 'administrare_documente';

export interface AccountingService {
  type: AccountingServiceType;
  label: string;
  enabled: boolean;
}

export interface AccountingContract {
  id: string;
  org_id: string;
  client_name: string;
  client_cui?: string | null;
  client_j_number?: string | null;
  contract_number?: string | null;
  contract_date?: string | null;
  services: AccountingService[];
  monthly_fee?: number | null;
  currency: Currency;
  payment_day?: number | null;
  status: ContractStatus;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccountingDeadline {
  id: string;
  org_id: string;
  contract_id?: string | null;
  deadline_type: DeadlineType;
  title: string;
  description?: string | null;
  due_date: string;
  recurrence?: DeadlineRecurrence | null;
  status: DeadlineStatus;
  completed_at?: string | null;
  completed_by?: string | null;
  reminder_days: number[];
  created_at: string;
  // Joined fields from view
  client_name?: string;
  client_cui?: string;
  contract_number?: string;
}

export interface AccountingActivityLog {
  id: string;
  org_id?: string | null;
  contract_id?: string | null;
  deadline_id?: string | null;
  action: string;
  details?: Record<string, any> | null;
  performed_by?: string | null;
  performed_at: string;
}

export interface AccountingDashboardStats {
  totalContracts: number;
  activeContracts: number;
  totalMonthlyRevenue: number;
  upcomingDeadlines7days: number;
  overdueCount: number;
  completionRate: number;
}

export interface DeadlineLabel {
  label: string;
  description: string;
  defaultDay: number;
  recurrence: DeadlineRecurrence;
}

export const DEADLINE_LABELS: Record<DeadlineType, DeadlineLabel> = {
  D112: {
    label: 'D112 - Declarație CAS/CASS',
    description: 'Declarație privind obligațiile de plată la bugetul de stat',
    defaultDay: 25,
    recurrence: 'monthly',
  },
  D394: {
    label: 'D394 - Declarație privind obligațiile de plată la bugetul de stat',
    description: 'Declarație informativă privind impozitul reținut la sursă și câștigurile/pierderile realizate',
    defaultDay: 25,
    recurrence: 'annual',
  },
  D300: {
    label: 'D300 - Declarație TVA',
    description: 'Declarație privind taxa pe valoarea adăugată',
    defaultDay: 25,
    recurrence: 'monthly',
  },
  D100: {
    label: 'D100 - Declarație privind impozitul pe profit',
    description: 'Declarație privind obligațiile de plată la bugetul de stat - impozit pe profit',
    defaultDay: 25,
    recurrence: 'quarterly',
  },
  D101: {
    label: 'D101 - Declarație privind impozitul pe veniturile microîntreprinderilor',
    description: 'Declarație privind impozitul pe veniturile microîntreprinderilor',
    defaultDay: 25,
    recurrence: 'quarterly',
  },
  D390: {
    label: 'D390 - Declarație anuală privind impozitul pe profit',
    description: 'Declarație anuală privind impozitul pe profit',
    defaultDay: 25,
    recurrence: 'annual',
  },
  D205: {
    label: 'D205 - Declarație privind impozitul pe dividende',
    description: 'Declarație informativă privind impozitul reținut la sursă din dividende',
    defaultDay: 25,
    recurrence: 'annual',
  },
  declaratie_unica: {
    label: 'Declarație unică',
    description: 'Declarație unică privind impozitul pe venit și contribuțiile sociale datorate de persoane fizice',
    defaultDay: 25,
    recurrence: 'annual',
  },
  bilant: {
    label: 'Bilanț contabil',
    description: 'Situații financiare anuale',
    defaultDay: 150,
    recurrence: 'annual',
  },
  raportare_semestriala: {
    label: 'Raportare semestrială',
    description: 'Raportare contabilă semestrială',
    defaultDay: 45,
    recurrence: 'semi_annual',
  },
  TVA: {
    label: 'Decontare TVA',
    description: 'Decontare TVA și plată',
    defaultDay: 25,
    recurrence: 'monthly',
  },
  impozit_profit: {
    label: 'Impozit pe profit',
    description: 'Plată impozit pe profit trimestrial',
    defaultDay: 25,
    recurrence: 'quarterly',
  },
  impozit_micro: {
    label: 'Impozit microîntreprindere',
    description: 'Plată impozit pe venit microîntreprindere',
    defaultDay: 25,
    recurrence: 'quarterly',
  },
  CIM_registru: {
    label: 'Registru CIM',
    description: 'Actualizare registru evidență contabilă pentru microîntreprinderi',
    defaultDay: 31,
    recurrence: 'monthly',
  },
  pontaj: {
    label: 'Pontaj salariați',
    description: 'Întocmire și depunere pontaj salariați',
    defaultDay: 5,
    recurrence: 'monthly',
  },
  alte: {
    label: 'Alte obligații',
    description: 'Alte termene fiscale sau contabile',
    defaultDay: 25,
    recurrence: 'one_time',
  },
};

export const ACCOUNTING_SERVICES: Record<AccountingServiceType, string> = {
  contabilitate_primara: 'Contabilitate primară',
  salarizare: 'Salarizare',
  TVA: 'TVA',
  declaratii_fiscale: 'Declarații fiscale',
  bilant: 'Bilanț',
  consultanta_fiscala: 'Consultanță fiscală',
  revisal: 'Revisal',
  administrare_documente: 'Administrare documente',
};

export interface CreateContractInput {
  org_id: string;
  client_name: string;
  client_cui?: string;
  client_j_number?: string;
  contract_number?: string;
  contract_date?: string;
  services: AccountingService[];
  monthly_fee?: number;
  currency?: Currency;
  payment_day?: number;
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_by?: string;
}

export interface UpdateContractInput {
  client_name?: string;
  client_cui?: string;
  client_j_number?: string;
  contract_number?: string;
  contract_date?: string;
  services?: AccountingService[];
  monthly_fee?: number;
  currency?: Currency;
  payment_day?: number;
  status?: ContractStatus;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export interface CreateDeadlineInput {
  org_id: string;
  contract_id?: string;
  deadline_type: DeadlineType;
  title: string;
  description?: string;
  due_date: string;
  recurrence?: DeadlineRecurrence;
  reminder_days?: number[];
}

export interface UpdateDeadlineInput {
  status?: DeadlineStatus;
  completed_at?: string;
  completed_by?: string;
  due_date?: string;
  title?: string;
  description?: string;
}

export interface DeadlineFilters {
  status?: DeadlineStatus | DeadlineStatus[];
  contract_id?: string;
  from_date?: string;
  to_date?: string;
  deadline_type?: DeadlineType;
}

export interface ContractFilters {
  status?: ContractStatus | ContractStatus[];
  search?: string;
  currency?: Currency;
}
