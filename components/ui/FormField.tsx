import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  error,
  required = false,
  helpText,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      {children}

      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
