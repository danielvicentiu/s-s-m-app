'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'file';
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  helpText?: string;
  accept?: string; // pentru input file
  min?: number;
  max?: number;
  step?: number;
  rows?: number; // pentru textarea
  autoResize?: boolean; // pentru textarea
  children?: ReactNode; // pentru select options sau custom input
  className?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  hint,
  helpText,
  accept,
  min,
  max,
  step,
  rows = 3,
  autoResize = true,
  children,
  className = '',
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (type === 'textarea' && autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value, type, autoResize]);

  const baseInputClasses = `
    w-full px-4 py-2.5 rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
    ${error
      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500'
      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
    }
  `;

  const renderInput = () => {
    // Dacă există children (ex: select options), renderează-le
    if (children && type === 'select') {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={baseInputClasses}
        >
          {children}
        </select>
      );
    }

    // Custom children (ex: custom input component)
    if (children) {
      return children;
    }

    // Password cu toggle show/hide
    if (type === 'password') {
      return (
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${baseInputClasses} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      );
    }

    // Textarea cu auto-resize
    if (type === 'textarea') {
      return (
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${baseInputClasses} resize-none`}
          style={{ minHeight: `${rows * 1.5}rem` }}
        />
      );
    }

    // File input
    if (type === 'file') {
      return (
        <input
          type="file"
          id={name}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          accept={accept}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
            file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600
            hover:file:bg-blue-100 file:cursor-pointer
            disabled:cursor-not-allowed disabled:opacity-50
            ${error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-white'
            }
          `}
        />
      );
    }

    // Input-uri standard (text, email, number, date)
    return (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
        className={baseInputClasses}
      />
    );
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label cu required asterisk și help icon */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="obligatoriu">
              *
            </span>
          )}
        </label>

        {helpText && (
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Mai multe informații"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute right-0 z-10 w-64 p-3 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg">
                <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45" />
                {helpText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hint text */}
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}

      {/* Input field */}
      {renderInput()}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 flex items-start gap-1.5">
          <span className="mt-0.5">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
