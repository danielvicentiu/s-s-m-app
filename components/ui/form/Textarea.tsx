import React, { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, fullWidth = false, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helper ? `${textareaId}-helper` : undefined;

    const baseClasses = 'rounded-lg border bg-white px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y';
    const borderClasses = error
      ? 'border-red-300 focus:border-red-500'
      : 'border-gray-300 focus:border-blue-500';
    const widthClasses = fullWidth ? 'w-full' : '';

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`${baseClasses} ${borderClasses} ${widthClasses} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          {...props}
        />

        {helper && !error && (
          <p
            id={helperId}
            className="mt-1.5 text-xs text-gray-500"
          >
            {helper}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-xs text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
