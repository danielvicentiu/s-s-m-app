import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helper?: string;
  options: RadioOption[];
  name: string;
  orientation?: 'vertical' | 'horizontal';
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ label, error, helper, options, name, orientation = 'vertical', className = '', id, ...props }, ref) => {
    const groupId = id || `radio-group-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${groupId}-error` : undefined;
    const helperId = helper ? `${groupId}-helper` : undefined;

    const orientationClasses = orientation === 'horizontal'
      ? 'flex flex-wrap gap-4'
      : 'space-y-3';

    return (
      <div>
        {label && (
          <div className="mb-3">
            <label
              id={`${groupId}-label`}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
              {props.required && <span className="ml-1 text-red-500">*</span>}
            </label>
          </div>
        )}

        <div
          role="radiogroup"
          aria-labelledby={label ? `${groupId}-label` : undefined}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={orientationClasses}
        >
          {options.map((option, index) => {
            const optionId = `${groupId}-option-${index}`;
            const descriptionId = option.description ? `${optionId}-description` : undefined;
            const isDisabled = option.disabled || props.disabled;

            return (
              <div key={option.value} className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    ref={index === 0 ? ref : undefined}
                    type="radio"
                    id={optionId}
                    name={name}
                    value={option.value}
                    disabled={isDisabled}
                    className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                      error ? 'border-red-300' : ''
                    } ${className}`}
                    aria-describedby={descriptionId}
                    {...props}
                  />
                </div>

                <div className="ml-3">
                  <label
                    htmlFor={optionId}
                    className={`block text-sm font-medium ${
                      isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'
                    }`}
                  >
                    {option.label}
                  </label>

                  {option.description && (
                    <p
                      id={descriptionId}
                      className={`text-xs ${
                        isDisabled ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {helper && !error && (
          <p
            id={helperId}
            className="mt-2 text-xs text-gray-500"
          >
            {helper}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="mt-2 text-xs text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
