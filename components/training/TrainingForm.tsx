'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import type { Training, Employee } from '@/lib/types';

interface TrainingFormProps {
  training?: Training | null;
  organizationId: string;
  mode: 'add' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  training_type: 'initial' | 'periodic' | 'psi' | 'first_aid' | 'pram' | 'other' | '';
  training_date: string;
  training_time: string;
  duration_hours: string;
  instructor_name: string;
  subject: string;
  location: string;
  participant_ids: string[];
  notes: string;
}

interface FormErrors {
  training_type?: string;
  training_date?: string;
  training_time?: string;
  duration_hours?: string;
  instructor_name?: string;
  subject?: string;
  participant_ids?: string;
}

export function TrainingForm({
  training,
  organizationId,
  mode,
  onSuccess,
  onCancel,
}: TrainingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    training_type: '',
    training_date: '',
    training_time: '',
    duration_hours: '',
    instructor_name: '',
    subject: '',
    location: '',
    participant_ids: [],
    notes: '',
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load employees for participant selection
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const supabase = createSupabaseBrowser();
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('is_active', true)
          .eq('employment_status', 'active')
          .is('deleted_at', null)
          .order('last_name', { ascending: true });

        if (error) {
          console.error('Error loading employees:', error);
        } else {
          setEmployees(data || []);
        }
      } catch (error) {
        console.error('Error loading employees:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [organizationId]);

  // Populate form data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && training) {
      setFormData({
        training_type: training.training_type || '',
        training_date: training.training_date || '',
        training_time: training.training_time || '',
        duration_hours: training.duration_hours ? String(training.duration_hours) : '',
        instructor_name: training.instructor_name || '',
        subject: training.subject || '',
        location: training.location || '',
        participant_ids: training.participant_ids || [],
        notes: training.notes || '',
      });
    }
  }, [mode, training]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.training_type) {
      newErrors.training_type = 'Tipul instruirii este obligatoriu';
    }

    if (!formData.training_date) {
      newErrors.training_date = 'Data instruirii este obligatorie';
    } else {
      const selectedDate = new Date(formData.training_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.training_date = 'Data instruirii trebuie să fie în viitor sau astăzi';
      }
    }

    if (!formData.training_time) {
      newErrors.training_time = 'Ora instruirii este obligatorie';
    }

    if (!formData.duration_hours) {
      newErrors.duration_hours = 'Durata este obligatorie';
    } else {
      const duration = parseFloat(formData.duration_hours);
      if (isNaN(duration) || duration <= 0 || duration > 24) {
        newErrors.duration_hours = 'Durata trebuie să fie între 0 și 24 ore';
      }
    }

    if (!formData.instructor_name.trim()) {
      newErrors.instructor_name = 'Numele instructorului este obligatoriu';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Tematica este obligatorie';
    }

    if (formData.participant_ids.length === 0) {
      newErrors.participant_ids = 'Selectați cel puțin un participant';
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

      const trainingData = {
        organization_id: organizationId,
        training_type: formData.training_type,
        training_date: formData.training_date,
        training_time: formData.training_time || null,
        duration_hours: parseFloat(formData.duration_hours),
        instructor_name: formData.instructor_name.trim(),
        subject: formData.subject.trim(),
        location: formData.location.trim() || null,
        participant_ids: formData.participant_ids,
        notes: formData.notes.trim() || null,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (mode === 'edit' && training) {
        // Update existing training
        result = await supabase
          .from('trainings')
          .update(trainingData)
          .eq('id', training.id)
          .select()
          .single();
      } else {
        // Insert new training
        result = await supabase
          .from('trainings')
          .insert({
            ...trainingData,
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
      console.error('Error saving training:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'A apărut o eroare la salvarea instruirii'
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

  // Handle participant selection
  const handleParticipantToggle = (employeeId: string) => {
    setFormData((prev) => {
      const newParticipants = prev.participant_ids.includes(employeeId)
        ? prev.participant_ids.filter((id) => id !== employeeId)
        : [...prev.participant_ids, employeeId];

      return { ...prev, participant_ids: newParticipants };
    });

    // Clear error for participants
    if (errors.participant_ids) {
      setErrors((prev) => ({ ...prev, participant_ids: undefined }));
    }
  };

  // Select/deselect all participants
  const handleSelectAll = () => {
    if (formData.participant_ids.length === employees.length) {
      setFormData((prev) => ({ ...prev, participant_ids: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        participant_ids: employees.map((e) => e.id),
      }));
    }

    if (errors.participant_ids) {
      setErrors((prev) => ({ ...prev, participant_ids: undefined }));
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

      {/* Section 1: Detalii instruire */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Detalii instruire
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tip instruire */}
          <div>
            <label htmlFor="training_type" className="block text-sm font-medium text-gray-700 mb-1">
              Tip instruire <span className="text-red-500">*</span>
            </label>
            <select
              id="training_type"
              name="training_type"
              value={formData.training_type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.training_type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selectează tipul</option>
              <option value="initial">Instruire inițială SSM</option>
              <option value="periodic">Instruire periodică SSM</option>
              <option value="psi">Instruire PSI (prevenire și stingere incendii)</option>
              <option value="first_aid">Prim ajutor</option>
              <option value="pram">PRAM (Prevenire și răspuns la amenințări)</option>
              <option value="other">Altă instruire</option>
            </select>
            {errors.training_type && (
              <p className="mt-1 text-sm text-red-600">{errors.training_type}</p>
            )}
          </div>

          {/* Data instruirii */}
          <div>
            <label htmlFor="training_date" className="block text-sm font-medium text-gray-700 mb-1">
              Data instruirii <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="training_date"
              name="training_date"
              value={formData.training_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.training_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.training_date && (
              <p className="mt-1 text-sm text-red-600">{errors.training_date}</p>
            )}
          </div>

          {/* Ora instruirii */}
          <div>
            <label htmlFor="training_time" className="block text-sm font-medium text-gray-700 mb-1">
              Ora instruirii <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="training_time"
              name="training_time"
              value={formData.training_time}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.training_time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.training_time && (
              <p className="mt-1 text-sm text-red-600">{errors.training_time}</p>
            )}
          </div>

          {/* Durata (ore) */}
          <div>
            <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-700 mb-1">
              Durata (ore) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="duration_hours"
              name="duration_hours"
              value={formData.duration_hours}
              onChange={handleChange}
              step="0.5"
              min="0.5"
              max="24"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.duration_hours ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 2"
            />
            {errors.duration_hours && (
              <p className="mt-1 text-sm text-red-600">{errors.duration_hours}</p>
            )}
          </div>

          {/* Instructor */}
          <div>
            <label htmlFor="instructor_name" className="block text-sm font-medium text-gray-700 mb-1">
              Instructor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="instructor_name"
              name="instructor_name"
              value={formData.instructor_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.instructor_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Ion Popescu"
            />
            {errors.instructor_name && (
              <p className="mt-1 text-sm text-red-600">{errors.instructor_name}</p>
            )}
          </div>

          {/* Locație/Sala */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Locație / Sala
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Sala de conferințe, Etaj 2"
            />
          </div>
        </div>

        {/* Tematică */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Tematica <span className="text-red-500">*</span>
          </label>
          <textarea
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.subject ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descrieți tematica instruirii..."
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>
      </div>

      {/* Section 2: Participanți */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Participanți <span className="text-red-500">*</span>
          </h3>
          {employees.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {formData.participant_ids.length === employees.length
                ? 'Deselectează toți'
                : 'Selectează toți'}
            </button>
          )}
        </div>

        {loadingEmployees ? (
          <div className="text-center py-8 text-gray-500">
            Se încarcă angajații...
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nu există angajați activi. Adăugați mai întâi angajați pentru a putea programa instruiri.
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <label
                  key={employee.id}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.participant_ids.includes(employee.id)}
                    onChange={() => handleParticipantToggle(employee.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.last_name} {employee.first_name}
                    </div>
                    {employee.position && (
                      <div className="text-xs text-gray-500">{employee.position}</div>
                    )}
                  </div>
                  {employee.department && (
                    <div className="text-xs text-gray-500">{employee.department}</div>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {errors.participant_ids && (
          <p className="text-sm text-red-600">{errors.participant_ids}</p>
        )}

        {formData.participant_ids.length > 0 && (
          <p className="text-sm text-gray-600">
            {formData.participant_ids.length} participant
            {formData.participant_ids.length !== 1 ? 'i' : ''} selectat
            {formData.participant_ids.length !== 1 ? 'i' : ''}
          </p>
        )}
      </div>

      {/* Section 3: Observații */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Observații
        </h3>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Observații suplimentare
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notițe adiționale despre instruire..."
          />
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
          disabled={isSubmitting || loadingEmployees}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Se salvează...'
            : mode === 'edit'
            ? 'Actualizează instruirea'
            : 'Programează instruirea'}
        </button>
      </div>
    </form>
  );
}
