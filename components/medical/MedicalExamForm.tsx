'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';

interface MedicalExamFormProps {
  medicalExam?: MedicalExam | null;
  organizationId: string;
  mode: 'add' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface MedicalExam {
  id: string;
  organization_id: string;
  employee_id: string | null;
  employee_name: string;
  examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere' | 'adaptare';
  examination_date: string;
  scheduled_date: string | null;
  expiry_date: string;
  result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt';
  restrictions: string | null;
  doctor_name: string | null;
  clinic_name: string | null;
  notes: string | null;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  position: string | null;
  organization_id: string;
}

interface FormData {
  employee_id: string;
  employee_name: string;
  examination_type: 'periodic' | 'angajare' | 'reluare' | 'la_cerere' | 'supraveghere' | 'adaptare';
  scheduled_date: string;
  examination_date: string;
  clinic_name: string;
  doctor_name: string;
  result: 'apt' | 'apt_conditionat' | 'inapt_temporar' | 'inapt';
  restrictions: string;
  expiry_date: string;
  notes: string;
}

interface FormErrors {
  employee_id?: string;
  employee_name?: string;
  examination_type?: string;
  scheduled_date?: string;
  examination_date?: string;
  clinic_name?: string;
  result?: string;
  expiry_date?: string;
}

export function MedicalExamForm({
  medicalExam,
  organizationId,
  mode,
  onSuccess,
  onCancel,
}: MedicalExamFormProps) {
  const [formData, setFormData] = useState<FormData>({
    employee_id: '',
    employee_name: '',
    examination_type: 'periodic',
    scheduled_date: '',
    examination_date: '',
    clinic_name: '',
    doctor_name: '',
    result: 'apt',
    restrictions: '',
    expiry_date: '',
    notes: '',
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load employees for the organization
  useEffect(() => {
    async function loadEmployees() {
      try {
        setLoadingEmployees(true);
        const supabase = createSupabaseBrowser();
        const { data, error } = await supabase
          .from('employees')
          .select('id, first_name, last_name, position, organization_id')
          .eq('organization_id', organizationId)
          .eq('is_active', true)
          .order('last_name', { ascending: true });

        if (error) throw error;
        setEmployees(data || []);
      } catch (error) {
        console.error('Error loading employees:', error);
      } finally {
        setLoadingEmployees(false);
      }
    }

    if (organizationId) {
      loadEmployees();
    }
  }, [organizationId]);

  // Populate form data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && medicalExam) {
      setFormData({
        employee_id: medicalExam.employee_id || '',
        employee_name: medicalExam.employee_name || '',
        examination_type: medicalExam.examination_type || 'periodic',
        scheduled_date: medicalExam.scheduled_date || '',
        examination_date: medicalExam.examination_date || '',
        clinic_name: medicalExam.clinic_name || '',
        doctor_name: medicalExam.doctor_name || '',
        result: medicalExam.result || 'apt',
        restrictions: medicalExam.restrictions || '',
        expiry_date: medicalExam.expiry_date || '',
        notes: medicalExam.notes || '',
      });
    }
  }, [mode, medicalExam]);

  // Auto-calculate expiry date based on examination date and type
  useEffect(() => {
    if (formData.examination_date) {
      const examDate = new Date(formData.examination_date);
      let monthsToAdd = 12; // Default for periodic

      // Adjust based on examination type
      if (formData.examination_type === 'angajare') {
        monthsToAdd = 12;
      } else if (formData.examination_type === 'periodic') {
        monthsToAdd = 12;
      } else if (formData.examination_type === 'reluare') {
        monthsToAdd = 12;
      } else if (formData.examination_type === 'supraveghere') {
        monthsToAdd = 6;
      }

      const expiryDate = new Date(examDate);
      expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);

      setFormData((prev) => ({
        ...prev,
        expiry_date: expiryDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.examination_date, formData.examination_type]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.employee_id && !formData.employee_name.trim()) {
      newErrors.employee_name = 'Selectați un angajat sau introduceți numele manual';
    }

    if (!formData.examination_type) {
      newErrors.examination_type = 'Tipul examenului este obligatoriu';
    }

    if (!formData.examination_date) {
      newErrors.examination_date = 'Data examinării este obligatorie';
    } else {
      const examDate = new Date(formData.examination_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (examDate > today) {
        newErrors.examination_date = 'Data examinării nu poate fi în viitor';
      }
    }

    if (!formData.result) {
      newErrors.result = 'Rezultatul este obligatoriu';
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = 'Data expirării următorului examen este obligatorie';
    } else if (formData.examination_date) {
      const examDate = new Date(formData.examination_date);
      const expiryDate = new Date(formData.expiry_date);

      if (expiryDate <= examDate) {
        newErrors.expiry_date = 'Data expirării trebuie să fie după data examinării';
      }
    }

    if (formData.scheduled_date) {
      const scheduledDate = new Date(formData.scheduled_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        newErrors.scheduled_date = 'Data programării trebuie să fie în viitor sau astăzi';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle employee selection
  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employee_id: employeeId,
        employee_name: `${employee.last_name} ${employee.first_name}`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        employee_id: employeeId,
      }));
    }
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

      const examData = {
        organization_id: organizationId,
        employee_id: formData.employee_id || null,
        employee_name: formData.employee_name.trim(),
        examination_type: formData.examination_type,
        scheduled_date: formData.scheduled_date || null,
        examination_date: formData.examination_date,
        clinic_name: formData.clinic_name.trim() || null,
        doctor_name: formData.doctor_name.trim() || null,
        result: formData.result,
        restrictions: formData.restrictions.trim() || null,
        expiry_date: formData.expiry_date,
        notes: formData.notes.trim() || null,
        content_version: 1,
        legal_basis_version: '2024',
        updated_at: new Date().toISOString(),
      };

      let result;

      if (mode === 'edit' && medicalExam) {
        // Update existing medical exam
        result = await supabase
          .from('medical_examinations')
          .update(examData)
          .eq('id', medicalExam.id)
          .select()
          .single();
      } else {
        // Insert new medical exam
        result = await supabase
          .from('medical_examinations')
          .insert({
            ...examData,
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
      console.error('Error saving medical exam:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'A apărut o eroare la salvarea examenului medical'
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

      {/* Section 1: Date angajat */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Date angajat
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {/* Selectare angajat */}
          <div>
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">
              Selectează angajat
            </label>
            {loadingEmployees ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-500">
                Se încarcă angajații...
              </div>
            ) : (
              <select
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectează angajat sau completează manual</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.last_name} {emp.first_name} {emp.position ? `- ${emp.position}` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Nume angajat (manual) */}
          <div>
            <label htmlFor="employee_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nume angajat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="employee_name"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.employee_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Popescu Ion"
            />
            {errors.employee_name && (
              <p className="mt-1 text-sm text-red-600">{errors.employee_name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Se completează automat la selectarea angajatului sau manual
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Detalii examen */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Detalii examen medical
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tip examen */}
          <div>
            <label htmlFor="examination_type" className="block text-sm font-medium text-gray-700 mb-1">
              Tip examen <span className="text-red-500">*</span>
            </label>
            <select
              id="examination_type"
              name="examination_type"
              value={formData.examination_type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.examination_type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="periodic">Periodic</option>
              <option value="angajare">Angajare</option>
              <option value="reluare">Reluare</option>
              <option value="la_cerere">La cerere</option>
              <option value="supraveghere">Supraveghere</option>
              <option value="adaptare">Adaptare</option>
            </select>
            {errors.examination_type && (
              <p className="mt-1 text-sm text-red-600">{errors.examination_type}</p>
            )}
          </div>

          {/* Data programare */}
          <div>
            <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-1">
              Data programare
            </label>
            <input
              type="date"
              id="scheduled_date"
              name="scheduled_date"
              value={formData.scheduled_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.scheduled_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.scheduled_date && (
              <p className="mt-1 text-sm text-red-600">{errors.scheduled_date}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Data la care este programat examenul (opțional)
            </p>
          </div>

          {/* Data examinare */}
          <div>
            <label htmlFor="examination_date" className="block text-sm font-medium text-gray-700 mb-1">
              Data examinare <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="examination_date"
              name="examination_date"
              value={formData.examination_date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.examination_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.examination_date && (
              <p className="mt-1 text-sm text-red-600">{errors.examination_date}</p>
            )}
          </div>

          {/* Clinica/Centrul medical */}
          <div>
            <label htmlFor="clinic_name" className="block text-sm font-medium text-gray-700 mb-1">
              Clinica / Centrul medical
            </label>
            <input
              type="text"
              id="clinic_name"
              name="clinic_name"
              value={formData.clinic_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Policlinica Sănătatea"
            />
          </div>

          {/* Medic */}
          <div>
            <label htmlFor="doctor_name" className="block text-sm font-medium text-gray-700 mb-1">
              Medic de medicina muncii
            </label>
            <input
              type="text"
              id="doctor_name"
              name="doctor_name"
              value={formData.doctor_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Dr. Popescu Maria"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Rezultat și validitate */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Rezultat și validitate
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rezultat */}
          <div>
            <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-1">
              Rezultat <span className="text-red-500">*</span>
            </label>
            <select
              id="result"
              name="result"
              value={formData.result}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.result ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="apt">Apt</option>
              <option value="apt_conditionat">Apt condiționat</option>
              <option value="inapt_temporar">Inapt temporar</option>
              <option value="inapt">Inapt</option>
            </select>
            {errors.result && (
              <p className="mt-1 text-sm text-red-600">{errors.result}</p>
            )}
          </div>

          {/* Data expirare urmatorul examen */}
          <div>
            <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-1">
              Data expirare / Următorul examen <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="expiry_date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.expiry_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.expiry_date && (
              <p className="mt-1 text-sm text-red-600">{errors.expiry_date}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Se calculează automat în funcție de tipul examenului
            </p>
          </div>
        </div>

        {/* Restricții */}
        <div>
          <label htmlFor="restrictions" className="block text-sm font-medium text-gray-700 mb-1">
            Restricții și recomandări
          </label>
          <textarea
            id="restrictions"
            name="restrictions"
            value={formData.restrictions}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Fără efort fizic intens, fără lucru la înălțime, necesită ochelari de protecție..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Restricții medicale sau recomandări pentru locul de muncă
          </p>
        </div>
      </div>

      {/* Section 4: Observații */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Observații suplimentare
        </h3>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Observații
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Note suplimentare despre examenul medical..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Informații suplimentare relevante pentru acest examen
          </p>
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
            ? 'Actualizează examenul'
            : 'Adaugă examenul'}
        </button>
      </div>
    </form>
  );
}
