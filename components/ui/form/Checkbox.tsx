import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helper?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helper, description, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const helperId = helper ? `${checkboxId}-helper` : undefined;
    const descriptionId = description ? `${checkboxId}-description` : undefined;

    const baseClasses = 'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors';
    const errorClasses = error ? 'border-red-300' : '';

    return (
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`${baseClasses} ${errorClasses} ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={[errorId, helperId, descriptionId].filter(Boolean).join(' ') || undefined}
            {...props}
          />
        </div>

        {(label || description || helper || error) && (
          <div className="ml-3 flex-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className="block text-sm font-medium text-gray-700 cursor-pointer"
              >
                {label}
                {props.required && <span className="ml-1 text-red-500">*</span>}
              </label>
            )}

            {description && (
              <p
                id={descriptionId}
                className="text-xs text-gray-500"
              >
                {description}
              </p>
            )}

            {helper && !error && (
              <p
                id={helperId}
                className="mt-1 text-xs text-gray-500"
              >
                {helper}
              </p>
            )}

            {error && (
              <p
                id={errorId}
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
