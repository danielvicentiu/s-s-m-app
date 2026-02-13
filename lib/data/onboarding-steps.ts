/**
 * Onboarding Wizard Configuration
 *
 * Definește pașii pentru wizard-ul de onboarding organizații noi
 * 5 pași: Date firmă, Date contact, Selectare module, Import angajați (opțional), Confirmare
 */

export interface OnboardingField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'multiselect' | 'checkbox' | 'file' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean | string;
  };
  options?: Array<{ value: string; label: string }>;
  helpText?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  fields: OnboardingField[];
  nextCondition?: (formData: Record<string, any>) => boolean;
  skipCondition?: (formData: Record<string, any>) => boolean;
}

export const onboardingSteps: OnboardingStep[] = [
  // STEP 1: Date firmă
  {
    id: 'company-info',
    title: 'Date firmă',
    description: 'Introduceți datele de identificare ale organizației dumneavoastră',
    fields: [
      {
        name: 'organizationName',
        type: 'text',
        label: 'Denumire firmă',
        placeholder: 'Ex: SC Example SRL',
        required: true,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
        helpText: 'Denumirea completă a organizației',
      },
      {
        name: 'cui',
        type: 'text',
        label: 'CUI',
        placeholder: 'Ex: RO12345678',
        required: true,
        validation: {
          pattern: '^(RO)?[0-9]{6,10}$',
          minLength: 6,
          maxLength: 12,
        },
        helpText: 'Cod Unic de Înregistrare (cu sau fără prefix RO)',
      },
      {
        name: 'registrationNumber',
        type: 'text',
        label: 'Nr. Registrul Comerțului',
        placeholder: 'Ex: J40/1234/2020',
        required: true,
        validation: {
          pattern: '^J[0-9]{1,2}/[0-9]{1,5}/[0-9]{4}$',
        },
        helpText: 'Format: J[cod județ]/[număr]/[an]',
      },
      {
        name: 'address',
        type: 'textarea',
        label: 'Adresă sediu social',
        placeholder: 'Ex: Str. Exemplu nr. 1, București, Sector 1',
        required: true,
        validation: {
          minLength: 10,
          maxLength: 200,
        },
      },
      {
        name: 'industry',
        type: 'select',
        label: 'Domeniu de activitate',
        placeholder: 'Selectați domeniul principal',
        required: true,
        options: [
          { value: 'construction', label: 'Construcții' },
          { value: 'manufacturing', label: 'Producție' },
          { value: 'services', label: 'Servicii' },
          { value: 'retail', label: 'Comerț' },
          { value: 'transport', label: 'Transport' },
          { value: 'it', label: 'IT & Telecomunicații' },
          { value: 'healthcare', label: 'Sănătate' },
          { value: 'education', label: 'Educație' },
          { value: 'other', label: 'Altele' },
        ],
      },
      {
        name: 'employeeCount',
        type: 'select',
        label: 'Număr aproximativ de angajați',
        required: true,
        options: [
          { value: '1-10', label: '1-10 angajați' },
          { value: '11-50', label: '11-50 angajați' },
          { value: '51-100', label: '51-100 angajați' },
          { value: '101-250', label: '101-250 angajați' },
          { value: '251-500', label: '251-500 angajați' },
          { value: '501+', label: 'Peste 500 angajați' },
        ],
      },
    ],
    nextCondition: (formData) => {
      return !!(
        formData.organizationName &&
        formData.cui &&
        formData.registrationNumber &&
        formData.address &&
        formData.industry &&
        formData.employeeCount
      );
    },
  },

  // STEP 2: Date contact
  {
    id: 'contact-info',
    title: 'Date contact',
    description: 'Informații de contact pentru administrator și persoană de contact SSM/PSI',
    fields: [
      {
        name: 'adminFullName',
        type: 'text',
        label: 'Nume complet administrator',
        placeholder: 'Ex: Popescu Ion',
        required: true,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        name: 'adminEmail',
        type: 'email',
        label: 'Email administrator',
        placeholder: 'Ex: admin@example.com',
        required: true,
        validation: {
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        },
        helpText: 'Adresa de email pentru contul de administrator',
      },
      {
        name: 'adminPhone',
        type: 'tel',
        label: 'Telefon administrator',
        placeholder: 'Ex: 0712345678',
        required: true,
        validation: {
          pattern: '^0[0-9]{9}$',
        },
        helpText: 'Format: 07xxxxxxxx sau 02xxxxxxxx',
      },
      {
        name: 'contactPerson',
        type: 'text',
        label: 'Persoană de contact SSM/PSI',
        placeholder: 'Ex: Ionescu Maria',
        required: false,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
        helpText: 'Opțional - poate fi aceeași cu administratorul',
      },
      {
        name: 'contactEmail',
        type: 'email',
        label: 'Email contact SSM/PSI',
        placeholder: 'Ex: ssm@example.com',
        required: false,
        validation: {
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        },
      },
      {
        name: 'contactPhone',
        type: 'tel',
        label: 'Telefon contact SSM/PSI',
        placeholder: 'Ex: 0712345678',
        required: false,
        validation: {
          pattern: '^0[0-9]{9}$',
        },
      },
    ],
    nextCondition: (formData) => {
      return !!(
        formData.adminFullName &&
        formData.adminEmail &&
        formData.adminPhone
      );
    },
  },

  // STEP 3: Selectare module
  {
    id: 'module-selection',
    title: 'Selectare module',
    description: 'Alegeți modulele SSM/PSI pe care doriți să le activați pentru organizația dumneavoastră',
    fields: [
      {
        name: 'modules',
        type: 'multiselect',
        label: 'Module disponibile',
        required: true,
        options: [
          { value: 'employees', label: 'Gestionare angajați' },
          { value: 'trainings', label: 'Instruiri SSM/PSI' },
          { value: 'medical', label: 'Controale medicale' },
          { value: 'equipment', label: 'Echipamente protecție (EPI/EPS)' },
          { value: 'documents', label: 'Documente și proceduri' },
          { value: 'risks', label: 'Evaluare riscuri' },
          { value: 'incidents', label: 'Raportare incidente' },
          { value: 'inspections', label: 'Inspecții și verificări' },
          { value: 'alerts', label: 'Alerte și notificări' },
        ],
        helpText: 'Selectați minimum un modul. Puteți modifica selecția ulterior.',
      },
      {
        name: 'ssmConsultant',
        type: 'checkbox',
        label: 'Beneficiez de servicii consultant SSM extern',
        required: false,
      },
      {
        name: 'psiConsultant',
        type: 'checkbox',
        label: 'Beneficiez de servicii consultant PSI extern',
        required: false,
      },
      {
        name: 'consultantName',
        type: 'text',
        label: 'Nume consultant (dacă este cazul)',
        placeholder: 'Ex: Cabinet SSM Example',
        required: false,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
      },
    ],
    nextCondition: (formData) => {
      return !!(formData.modules && formData.modules.length > 0);
    },
  },

  // STEP 4: Import angajați (opțional)
  {
    id: 'employee-import',
    title: 'Import angajați',
    description: 'Importați lista de angajați (opțional - puteți adăuga angajați și ulterior)',
    fields: [
      {
        name: 'importMethod',
        type: 'select',
        label: 'Metodă de import',
        required: false,
        options: [
          { value: 'skip', label: 'Omite acest pas (adaug angajați mai târziu)' },
          { value: 'manual', label: 'Adaug manual câțiva angajați acum' },
          { value: 'file', label: 'Import din fișier Excel/CSV' },
        ],
        helpText: 'Puteți adăuga angajați oricând după finalizarea configurării',
      },
      {
        name: 'employeeFile',
        type: 'file',
        label: 'Fișier import angajați',
        required: false,
        helpText: 'Format acceptat: .xlsx, .csv. Descărcați template-ul pentru format corect.',
      },
      {
        name: 'manualEmployees',
        type: 'textarea',
        label: 'Angajați (manual)',
        placeholder: 'Introduceți câte un angajat pe linie: Nume, Prenume, CNP, Email, Telefon',
        required: false,
        validation: {
          maxLength: 2000,
        },
        helpText: 'Opțional - pentru adăugare rapidă a câțiva angajați',
      },
    ],
    skipCondition: (formData) => {
      return formData.importMethod === 'skip';
    },
  },

  // STEP 5: Confirmare
  {
    id: 'confirmation',
    title: 'Confirmare',
    description: 'Verificați datele introduse și finalizați configurarea organizației',
    fields: [
      {
        name: 'termsAccepted',
        type: 'checkbox',
        label: 'Accept termenii și condițiile platformei s-s-m.ro',
        required: true,
      },
      {
        name: 'gdprAccepted',
        type: 'checkbox',
        label: 'Confirm că am citit și înțeles Politica de confidențialitate (GDPR)',
        required: true,
      },
      {
        name: 'dataProcessingAccepted',
        type: 'checkbox',
        label: 'Sunt de acord cu prelucrarea datelor cu caracter personal conform legislației în vigoare',
        required: true,
      },
      {
        name: 'notifications',
        type: 'checkbox',
        label: 'Doresc să primesc notificări email pentru alerte SSM/PSI importante',
        required: false,
      },
      {
        name: 'additionalNotes',
        type: 'textarea',
        label: 'Note suplimentare (opțional)',
        placeholder: 'Informații adiționale, cerințe speciale, întrebări...',
        required: false,
        validation: {
          maxLength: 500,
        },
      },
    ],
    nextCondition: (formData) => {
      return !!(
        formData.termsAccepted &&
        formData.gdprAccepted &&
        formData.dataProcessingAccepted
      );
    },
  },
];

/**
 * Helper function: obține un step după ID
 */
export function getStepById(stepId: string): OnboardingStep | undefined {
  return onboardingSteps.find(step => step.id === stepId);
}

/**
 * Helper function: obține index-ul unui step
 */
export function getStepIndex(stepId: string): number {
  return onboardingSteps.findIndex(step => step.id === stepId);
}

/**
 * Helper function: obține step-ul următor
 */
export function getNextStep(currentStepId: string, formData: Record<string, any>): OnboardingStep | null {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex === -1 || currentIndex >= onboardingSteps.length - 1) {
    return null;
  }

  const nextStep = onboardingSteps[currentIndex + 1];

  // Verifică dacă step-ul următor poate fi sărit
  if (nextStep.skipCondition && nextStep.skipCondition(formData)) {
    return getNextStep(nextStep.id, formData);
  }

  return nextStep;
}

/**
 * Helper function: obține step-ul anterior
 */
export function getPreviousStep(currentStepId: string): OnboardingStep | null {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex <= 0) {
    return null;
  }

  return onboardingSteps[currentIndex - 1];
}

/**
 * Helper function: validează dacă toate câmpurile obligatorii sunt completate
 */
export function validateStep(stepId: string, formData: Record<string, any>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const step = getStepById(stepId);
  if (!step) {
    return { isValid: false, errors: { general: 'Step invalid' } };
  }

  const errors: Record<string, string> = {};

  step.fields.forEach(field => {
    const value = formData[field.name];

    // Verifică câmpuri obligatorii
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      errors[field.name] = `${field.label} este obligatoriu`;
      return;
    }

    // Validări specifice
    if (value && field.validation) {
      // Pattern validation
      if (field.validation.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          errors[field.name] = `${field.label} nu respectă formatul corect`;
          return;
        }
      }

      // Length validation
      if (field.validation.minLength && value.length < field.validation.minLength) {
        errors[field.name] = `${field.label} trebuie să aibă minim ${field.validation.minLength} caractere`;
        return;
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        errors[field.name] = `${field.label} trebuie să aibă maxim ${field.validation.maxLength} caractere`;
        return;
      }

      // Custom validation
      if (field.validation.custom) {
        const result = field.validation.custom(value);
        if (result !== true) {
          errors[field.name] = typeof result === 'string' ? result : `${field.label} nu este valid`;
          return;
        }
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Helper function: calculează progresul wizard-ului (0-100%)
 */
export function calculateProgress(currentStepId: string): number {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex === -1) return 0;

  return Math.round(((currentIndex + 1) / onboardingSteps.length) * 100);
}
