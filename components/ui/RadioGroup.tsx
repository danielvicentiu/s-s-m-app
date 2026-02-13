'use client';

import React from 'react';

interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export default function RadioGroup({
  options,
  value,
  onChange,
  name,
  orientation = 'vertical',
  className = '',
}: RadioGroupProps) {
  return (
    <div
      className={`flex ${
        orientation === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-3'
      } ${className}`}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const radioId = `${name}-${option.value}`;

        return (
          <label
            key={option.value}
            htmlFor={radioId}
            className={`relative flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-all ${
              isSelected
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              id={radioId}
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center justify-center w-5 h-5 mt-0.5 flex-shrink-0">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <div
                className={`text-sm font-medium ${
                  isSelected ? 'text-blue-900' : 'text-gray-900'
                }`}
              >
                {option.label}
              </div>
              {option.description && (
                <div
                  className={`text-sm mt-1 ${
                    isSelected ? 'text-blue-700' : 'text-gray-500'
                  }`}
                >
                  {option.description}
                </div>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
