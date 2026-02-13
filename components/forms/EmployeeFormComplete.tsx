'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Briefcase,
  ShieldCheck,
  Stethoscope,
  FileCheck,
  Search,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// CNP VALIDATION ALGORITHM (Romanian Personal Identification Number)
// ═══════════════════════════════════════════════════════════════════════════

function validateCNP(cnp: string): boolean {
  if (!/^\d{13}$/.test(cnp)) return false;

  const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  const digits = cnp.split('').map(Number);
  const checkDigit = digits[12];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * weights[i];
  }

  const remainder = sum % 11;
  const expectedCheckDigit = remainder === 10 ? 1 : remainder;

  // Validate gender digit (1-8)
  if (digits[0] < 1 || digits[0] > 8) return false;

  // Validate month (01-12)
  const month = digits[3] * 10 + digits[4];
  if (month < 1 || month > 12) return false;

  // Validate day (01-31)
  const day = digits[5] * 10 + digits[6];
  if (day < 1 || day > 31) return false;

  return checkDigit === expectedCheckDigit;
}

// ═══════════════════════════════════════════════════════════════════════════
// COR CODES (Romanian Occupational Classification)
// ═══════════════════════════════════════════════════════════════════════════

const COR_CODES = [
  { code: '1120', name: 'Director general' },
  { code: '1210', name: 'Director financiar-contabil' },
  { code: '1330', name: 'Director IT' },
  { code: '1420', name: 'Director comercial' },
  { code: '2141', name: 'Inginer industrial' },
  { code: '2142', name: 'Inginer civil' },
  { code: '2143', name: 'Inginer agronom' },
  { code: '2144', name: 'Inginer mecanic' },
  { code: '2145', name: 'Inginer chimist' },
  { code: '2149', name: 'Inginer în alte domenii' },
  { code: '2221', name: 'Asistent medical generalist' },
  { code: '2230', name: 'Medic medicina muncii' },
  { code: '2411', name: 'Contabil' },
  { code: '2412', name: 'Consilier financiar' },
  { code: '2511', name: 'Analist de sistem informatic' },
  { code: '2512', name: 'Dezvoltator de software' },
  { code: '2513', name: 'Programator web' },
  { code: '3119', name: 'Tehnician' },
  { code: '3311', name: 'Expert în domeniul protecției muncii' },
  { code: '3312', name: 'Expert prevenire și stingere incendii' },
  { code: '3324', name: 'Agent de securitate' },
  { code: '4110', name: 'Secretar' },
  { code: '4120', name: 'Operator introducere, validare și prelucrare date' },
  { code: '4211', name: 'Casier' },
  { code: '4321', name: 'Gestionar depozit' },
  { code: '5120', name: 'Bucătar' },
  { code: '5223', name: 'Vânzător' },
  { code: '7111', name: 'Zidar' },
  { code: '7112', name: 'Tencuitor' },
  { code: '7115', name: 'Dulgher' },
  { code: '7121', name: 'Acoperitor' },
  { code: '7131', name: 'Zugrav' },
  { code: '7211', name: 'Sudor' },
  { code: '7233', name: 'Lăcătuș mecanic' },
  { code: '7411', name: 'Electrician' },
  { code: '7421', name: 'Electronist' },
  { code: '8111', name: 'Miner' },
  { code: '8157', name: 'Operator mașini de curățare' },
  { code: '8322', name: 'Șofer auto' },
  { code: '9111', name: 'Îngrijitor clădiri' },
  { code: '9112', name: 'Muncitor necalificat' },
  { code: '9329', name: 'Muncitor auxiliar' },
];

// ═══════════════════════════════════════════════════════════════════════════
// ZOD VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

const step1Schema = z.object({
  full_name: z.string().min(3, 'Numele trebuie să aibă minim 3 caractere'),
  cnp: z
    .string()
    .length(13, 'CNP-ul trebuie să aibă 13 cifre')
    .regex(/^\d+$/, 'CNP-ul trebuie să conțină doar cifre')
    .refine(validateCNP, 'CNP invalid (verificare algoritm eșuată)'),
  email: z.string().email('Email invalid').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefon invalid').optional().or(z.literal('')),
  address: z.string().optional(),
});

const step2Schema = z.object({
  cor_code: z.string().min(1, 'Selectează codul COR'),
  job_title: z.string().min(2, 'Funcția este obligatorie'),
  department: z.string().optional(),
  hire_date: z.string().min(1, 'Data angajării este obligatorie'),
  employment_type: z.enum(['full_time', 'part_time', 'contract']),
  work_schedule: z.string().optional(),
});

const step3Schema = z.object({
  risk_level: z.enum(['scazut', 'mediu', 'ridicat']),
  eip_required: z.array(z.string()),
  ssm_training_date: z.string().optional(),
  psi_training_date: z.string().optional(),
});

const step4Schema = z.object({
  medical_exam_date: z.string().optional(),
  medical_doctor: z.string().optional(),
  medical_result: z
    .enum(['apt', 'apt_conditionat', 'inapt_temporar', 'inapt'])
    .optional()
    .or(z.literal('')),
  medical_expiry_date: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

type CompleteFormData = Step1Data & Step2Data & Step3Data & Step4Data & { organization_id: string };

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface EmployeeFormCompleteProps {
  organizationId?: string;
  onSuccess?: (employeeId: string) => void;
}

export default function EmployeeFormComplete({
  organizationId,
  onSuccess,
}: EmployeeFormCompleteProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CompleteFormData>>({
    organization_id: organizationId || '',
    eip_required: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [corSearch, setCorSearch] = useState('');

  const totalSteps = 5;

  // Get current step schema
  const getCurrentSchema = () => {
    switch (currentStep) {
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      case 3:
        return step3Schema;
      case 4:
        return step4Schema;
      default:
        return step1Schema;
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: formData,
    mode: 'onChange',
  });

  // Handle Next step
  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const stepData = form.getValues();
      setFormData({ ...formData, ...stepData });
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      form.reset(stepData);
    }
  };

  // Handle Previous step
  const handleBack = () => {
    const stepData = form.getValues();
    setFormData({ ...formData, ...stepData });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Handle final submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowser();

      // Hash CNP for privacy
      const cnpHash = formData.cnp
        ? await crypto.subtle
            .digest('SHA-256', new TextEncoder().encode(formData.cnp))
            .then((hash) =>
              Array.from(new Uint8Array(hash))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('')
            )
        : null;

      // Insert employee
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .insert([
          {
            organization_id: formData.organization_id,
            full_name: formData.full_name,
            cnp: formData.cnp,
            cnp_hash: cnpHash,
            email: formData.email || null,
            phone: formData.phone || null,
            cor_code: formData.cor_code,
            job_title: formData.job_title,
            department: formData.department || null,
            hire_date: formData.hire_date,
            employment_type: formData.employment_type,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (employeeError) throw employeeError;

      // Insert medical examination if data provided
      if (formData.medical_exam_date && formData.medical_result) {
        const { error: medicalError } = await supabase.from('medical_examinations').insert([
          {
            organization_id: formData.organization_id,
            employee_name: formData.full_name!,
            cnp_hash: cnpHash,
            job_title: formData.job_title,
            examination_type: 'angajare',
            examination_date: formData.medical_exam_date,
            expiry_date:
              formData.medical_expiry_date ||
              new Date(
                new Date(formData.medical_exam_date).setFullYear(
                  new Date(formData.medical_exam_date).getFullYear() + 1
                )
              )
                .toISOString()
                .split('T')[0],
            result: formData.medical_result,
            doctor_name: formData.medical_doctor || null,
            content_version: 1,
            legal_basis_version: '1.0',
          },
        ]);

        if (medicalError) console.error('Medical exam insert error:', medicalError);
      }

      // Show success toast
      if (onSuccess && employee) {
        onSuccess(employee.id);
      } else {
        router.push(`/dashboard/angajati/${employee.id}`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(`Eroare: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered COR codes for search
  const filteredCorCodes = COR_CODES.filter(
    (cor) =>
      cor.code.includes(corSearch.toLowerCase()) ||
      cor.name.toLowerCase().includes(corSearch.toLowerCase())
  );

  // Toggle EIP checkbox
  const toggleEIP = (eip: string) => {
    const current = formData.eip_required || [];
    if (current.includes(eip)) {
      setFormData({
        ...formData,
        eip_required: current.filter((e) => e !== eip),
      });
    } else {
      setFormData({
        ...formData,
        eip_required: [...current, eip],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    ${
                      step < currentStep
                        ? 'bg-green-600 text-white'
                        : step === currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${step < currentStep ? 'bg-green-600' : 'bg-gray-200'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Date personale</span>
            <span>Angajare</span>
            <span>SSM</span>
            <span>Medical</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <form onSubmit={form.handleSubmit(() => {})}>
            {/* STEP 1: Personal Data */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Date Personale</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nume Complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...form.register('full_name')}
                    type="text"
                    placeholder="ex: Popescu Ion Marian"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {form.formState.errors.full_name && (
                    <p className="text-red-600 text-xs mt-1">
                      {form.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CNP (Cod Numeric Personal) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...form.register('cnp')}
                    type="text"
                    maxLength={13}
                    placeholder="1234567890123"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  {form.formState.errors.cnp && (
                    <p className="text-red-600 text-xs mt-1">{form.formState.errors.cnp.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    CNP-ul va fi validat conform algoritmului oficial
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      {...form.register('email')}
                      type="email"
                      placeholder="angajat@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-600 text-xs mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                    <input
                      {...form.register('phone')}
                      type="tel"
                      placeholder="+40 721 234 567"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-600 text-xs mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresa (opțional)
                  </label>
                  <input
                    {...form.register('address')}
                    type="text"
                    placeholder="Str. Exemplu nr. 123, București"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Employment Data */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Date Angajare</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Căutare Cod COR <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={corSearch}
                      onChange={(e) => setCorSearch(e.target.value)}
                      placeholder="Caută după cod sau denumire..."
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Selectează Ocupația COR <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...form.register('cor_code', {
                      onChange: (e) => {
                        const selected = COR_CODES.find((c) => c.code === e.target.value);
                        if (selected) {
                          form.setValue('job_title', selected.name);
                        }
                      },
                    })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selectează...</option>
                    {filteredCorCodes.map((cor) => (
                      <option key={cor.code} value={cor.code}>
                        {cor.code} — {cor.name}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.cor_code && (
                    <p className="text-red-600 text-xs mt-1">
                      {form.formState.errors.cor_code.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Funcția (Titlul Postului) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...form.register('job_title')}
                    type="text"
                    placeholder="Se completează automat din COR"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {form.formState.errors.job_title && (
                    <p className="text-red-600 text-xs mt-1">
                      {form.formState.errors.job_title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Departament / Locație
                  </label>
                  <input
                    {...form.register('department')}
                    type="text"
                    placeholder="ex: Producție, Administrativ"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data Angajării <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...form.register('hire_date')}
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.hire_date && (
                      <p className="text-red-600 text-xs mt-1">
                        {form.formState.errors.hire_date.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tip Contract <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...form.register('employment_type')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează...</option>
                      <option value="full_time">Normă întreagă</option>
                      <option value="part_time">Normă parțială</option>
                      <option value="contract">Contract colaborare</option>
                    </select>
                    {form.formState.errors.employment_type && (
                      <p className="text-red-600 text-xs mt-1">
                        {form.formState.errors.employment_type.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Program de Lucru (opțional)
                  </label>
                  <input
                    {...form.register('work_schedule')}
                    type="text"
                    placeholder="ex: 08:00 - 16:00, L-V"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: SSM/PSI Data */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Date SSM / PSI</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nivel Risc Post <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...form.register('risk_level')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selectează...</option>
                    <option value="scazut">Scăzut (birou, administrativ)</option>
                    <option value="mediu">Mediu (producție, logistică)</option>
                    <option value="ridicat">Ridicat (construcții, chimie)</option>
                  </select>
                  {form.formState.errors.risk_level && (
                    <p className="text-red-600 text-xs mt-1">
                      {form.formState.errors.risk_level.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    EIP Necesar (Echipament Individual de Protecție)
                  </label>
                  <div className="space-y-2">
                    {[
                      'Cască protecție',
                      'Mănuși de protecție',
                      'Ochelari protecție',
                      'Măști respiratorii',
                      'Vesta reflectorizantă',
                      'Încălțăminte de protecție',
                      'Antifoane',
                      'Ham siguranță',
                    ].map((eip) => (
                      <label key={eip} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(formData.eip_required || []).includes(eip)}
                          onChange={() => toggleEIP(eip)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{eip}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data Instruire SSM Inițială
                    </label>
                    <input
                      {...form.register('ssm_training_date')}
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data Instruire PSI Inițială
                    </label>
                    <input
                      {...form.register('psi_training_date')}
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Medical Data */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Date Medicale</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    Completează dacă angajatul a efectuat deja examenul medical la angajare.
                    Altfel, poți sări acest pas.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data Examen Angajare
                    </label>
                    <input
                      {...form.register('medical_exam_date')}
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data Expirare
                    </label>
                    <input
                      {...form.register('medical_expiry_date')}
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Implicit: 1 an de la examen</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medic Medicina Muncii
                  </label>
                  <input
                    {...form.register('medical_doctor')}
                    type="text"
                    placeholder="Dr. Popescu Ion"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rezultat Examen
                  </label>
                  <select
                    {...form.register('medical_result')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nu este disponibil încă</option>
                    <option value="apt">Apt</option>
                    <option value="apt_conditionat">Apt condiționat</option>
                    <option value="inapt_temporar">Inapt temporar</option>
                    <option value="inapt">Inapt</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Verificare Date</h2>
                </div>

                <div className="space-y-6">
                  {/* Personal Data Review */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Date Personale
                    </h3>
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-gray-500">Nume complet:</dt>
                        <dd className="font-semibold text-gray-900">{formData.full_name}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">CNP:</dt>
                        <dd className="font-mono text-gray-900">{formData.cnp}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Email:</dt>
                        <dd className="text-gray-900">{formData.email || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Telefon:</dt>
                        <dd className="text-gray-900">{formData.phone || '—'}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Employment Data Review */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Date Angajare
                    </h3>
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-gray-500">Cod COR:</dt>
                        <dd className="font-semibold text-gray-900">{formData.cor_code}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Funcție:</dt>
                        <dd className="text-gray-900">{formData.job_title}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Departament:</dt>
                        <dd className="text-gray-900">{formData.department || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Data angajării:</dt>
                        <dd className="text-gray-900">{formData.hire_date}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Tip contract:</dt>
                        <dd className="text-gray-900">
                          {formData.employment_type === 'full_time'
                            ? 'Normă întreagă'
                            : formData.employment_type === 'part_time'
                              ? 'Normă parțială'
                              : 'Contract colaborare'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* SSM Data Review */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Date SSM/PSI
                    </h3>
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-gray-500">Nivel risc:</dt>
                        <dd className="font-semibold text-gray-900 capitalize">
                          {formData.risk_level}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">EIP necesar:</dt>
                        <dd className="text-gray-900">
                          {formData.eip_required?.length || 0} articole
                        </dd>
                      </div>
                    </dl>
                    {formData.eip_required && formData.eip_required.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {formData.eip_required.map((eip) => (
                          <span
                            key={eip}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                          >
                            {eip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Medical Data Review */}
                  {formData.medical_exam_date && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Date Medicale
                      </h3>
                      <dl className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <dt className="text-gray-500">Data examen:</dt>
                          <dd className="text-gray-900">{formData.medical_exam_date}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Rezultat:</dt>
                          <dd className="font-semibold text-gray-900 capitalize">
                            {formData.medical_result?.replace(/_/g, ' ') || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Medic:</dt>
                          <dd className="text-gray-900">{formData.medical_doctor || '—'}</dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Înapoi
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Următorul
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    'Se salvează...'
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Salvează Angajat
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
