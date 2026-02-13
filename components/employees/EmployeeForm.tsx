'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  cnp: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  department: string | null;
  hire_date: string | null;
  contract_type: 'indefinite' | 'fixed_term' | 'part_time' | 'temporary' | null;
  workplace_risks: string | null;
  ppe_required: string | null;
  employment_status: string;
  is_active: boolean;
}

interface EmployeeFormProps {
  employee?: Employee | null;
  organizationId: string;
  mode: 'add' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  first_name: string;
  last_name: string;
  cnp: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  contract_type: 'indefinite' | 'fixed_term' | 'part_time' | 'temporary' | '';
  workplace_risks: string;
  ppe_required: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  cnp?: string;
  email?: string;
  phone?: string;
  hire_date?: string;
}

export function EmployeeForm({
  employee,
  organizationId,
  mode,
  onSuccess,
  onCancel,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    cnp: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hire_date: '',
    contract_type: '',
    workplace_risks: '',
    ppe_required: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Populate form data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && employee) {
      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        cnp: employee.cnp || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || '',
        hire_date: employee.hire_date || '',
        contract_type: employee.contract_type || '',
        workplace_risks: employee.workplace_risks || '',
        ppe_required: employee.ppe_required || '',
      });
    }
  }, [mode, employee]);

  // Validate CNP (Romanian Personal Identification Number)
  const validateCNP = (cnp: string): boolean => {
    // Basic validation: must be 13 digits
    if (!/^\d{13}$/.test(cnp)) {
      return false;
    }
    return true;
  };

  // Validate email
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone
  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    // Romanian phone: 10 digits starting with 0
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Prenumele este obligatoriu';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Numele este obligatoriu';
    }

    if (!formData.cnp.trim()) {
      newErrors.cnp = 'CNP-ul este obligatoriu';
    } else if (!validateCNP(formData.cnp)) {
      newErrors.cnp = 'CNP invalid (trebuie să conțină 13 cifre)';
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Email invalid';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Telefon invalid (format: 0712345678)';
    }

    if (formData.hire_date) {
      const hireDate = new Date(formData.hire_date);
      const today = new Date();
      if (hireDate > today) {
        newErrors.hire_date = 'Data angajării nu poate fi în viitor';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowser();

      const employeeData = {
        organization_id: organizationId,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        cnp: formData.cnp.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        position: formData.position.trim() || null,
        department: formData.department.trim() || null,
        hire_date: formData.hire_date || null,
        contract_type: formData.contract_type || null,
        workplace_risks: formData.workplace_risks.trim() || null,
        ppe_required: formData.ppe_required.trim() || null,
        employment_status: 'active' as const,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (mode === 'edit' && employee) {
        // Update existing employee
        result = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', employee.id)
          .select()
          .single();
      } else {
        // Insert new employee
        result = await supabase
          .from('employees')
          .insert({
            ...employeeData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      // Success
      onSuccess?.();
    } catch (error) {
      console.error('Error saving employee:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'A apărut o eroare la salvarea angajatului'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {submitError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      {/* Section 1: Date personale */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Date personale
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prenume */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              Prenume <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.first_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ion"
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
            )}
          </div>

          {/* Nume */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nume <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.last_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Popescu"
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
            )}
          </div>

          {/* CNP */}
          <div>
            <label htmlFor="cnp" className="block text-sm font-medium text-gray-700 mb-1">
              CNP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cnp"
              name="cnp"
              value={formData.cnp}
              onChange={handleChange}
              maxLength={13}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cnp ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1234567890123"
            />
            {errors.cnp && <p className="mt-1 text-sm text-red-600">{errors.cnp}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ion.popescu@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Telefon */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0712345678"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Date angajare */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Date angajare
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Funcție */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Funcție
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Manager, Operator, Contabil"
            />
          </div>

          {/* Departament */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Departament
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Producție, Vânzări, HR"
            />
          </div>

          {/* Data angajării */}
          <div>
            <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700 mb-1">
              Data angajării
            </label>
            <input
              type="date"
              id="hire_date"
              name="hire_date"
              value={formData.hire_date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.hire_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.hire_date && (
              <p className="mt-1 text-sm text-red-600">{errors.hire_date}</p>
            )}
          </div>

          {/* Tip contract */}
          <div>
            <label htmlFor="contract_type" className="block text-sm font-medium text-gray-700 mb-1">
              Tip contract
            </label>
            <select
              id="contract_type"
              name="contract_type"
              value={formData.contract_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selectează</option>
              <option value="indefinite">Nedeterminat</option>
              <option value="fixed_term">Determinat</option>
              <option value="part_time">Part-time</option>
              <option value="temporary">Temporar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: SSM */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Date SSM
        </h3>

        <div className="space-y-4">
          {/* Riscuri loc muncă */}
          <div>
            <label
              htmlFor="workplace_risks"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Riscuri la locul de muncă
            </label>
            <textarea
              id="workplace_risks"
              name="workplace_risks"
              value={formData.workplace_risks}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: zgomot, vibrații, praf, substanțe chimice..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Enumerați riscurile identificate la locul de muncă al angajatului
            </p>
          </div>

          {/* EIP necesar */}
          <div>
            <label htmlFor="ppe_required" className="block text-sm font-medium text-gray-700 mb-1">
              EIP necesar (Echipament Individual de Protecție)
            </label>
            <textarea
              id="ppe_required"
              name="ppe_required"
              value={formData.ppe_required}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: mănuși, ochelari protecție, cască, pantofi cu bombeu..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Specificați echipamentele de protecție necesare pentru această poziție
            </p>
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Anulează
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Se salvează...'
            : mode === 'edit'
            ? 'Actualizează angajatul'
            : 'Adaugă angajatul'}
        </button>
      </div>
    </form>
  );
}
