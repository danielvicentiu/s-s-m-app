'use client';

import * as React from 'react';

export interface SwitchProps {
  /** Whether the switch is checked (on) or unchecked (off) */
  checked?: boolean;
  /** Callback when the switch state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Label text for the switch */
  label?: string;
  /** Description text displayed below the label */
  description?: string;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Additional CSS classes */
  className?: string;
  /** Name attribute for form usage */
  name?: string;
  /** ID for the switch element */
  id?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onCheckedChange,
      label,
      description,
      disabled = false,
      size = 'md',
      className = '',
      name,
      id,
    },
    ref
  ) => {
    const handleToggle = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggle();
      }
    };

    // Size-based dimensions
    const sizes = {
      sm: {
        container: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4',
      },
      md: {
        container: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5',
      },
    };

    const sizeConfig = sizes[size];

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          aria-disabled={disabled}
          disabled={disabled}
          name={name}
          id={id}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={`
            relative inline-flex ${sizeConfig.container} shrink-0 rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${
              checked
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }
            ${
              disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }
          `}
        >
          <span
            className={`
              ${sizeConfig.thumb}
              pointer-events-none inline-block rounded-full bg-white shadow-lg
              transform ring-0 transition duration-200 ease-in-out
              ${checked ? sizeConfig.translate : 'translate-x-0.5'}
            `}
          />
        </button>

        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={id}
                className={`
                  text-sm font-medium text-gray-900
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                onClick={!disabled ? handleToggle : undefined}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className={`
                  text-sm text-gray-500
                  ${disabled ? 'opacity-50' : ''}
                `}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
