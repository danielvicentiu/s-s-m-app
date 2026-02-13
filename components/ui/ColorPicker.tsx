'use client';

import { useState, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  '#3B82F6', // blue-600
  '#EF4444', // red-600
  '#10B981', // green-600
  '#F59E0B', // amber-600
  '#8B5CF6', // violet-600
  '#EC4899', // pink-600
  '#06B6D4', // cyan-600
  '#84CC16', // lime-600
  '#F97316', // orange-600
  '#6366F1', // indigo-600
  '#14B8A6', // teal-600
  '#A855F7', // purple-600
];

export default function ColorPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
}: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value);
  const [isValidHex, setIsValidHex] = useState(true);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  const validateHex = (hex: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex);
  };

  const handleHexInputChange = (inputValue: string) => {
    let formattedValue = inputValue.trim();

    // Add # if missing
    if (!formattedValue.startsWith('#')) {
      formattedValue = `#${formattedValue}`;
    }

    setHexInput(formattedValue);

    if (validateHex(formattedValue)) {
      setIsValidHex(true);
      onChange(formattedValue.toUpperCase());
    } else {
      setIsValidHex(false);
    }
  };

  const handlePresetClick = (color: string) => {
    setHexInput(color);
    setIsValidHex(true);
    onChange(color);
  };

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value.toUpperCase();
    setHexInput(color);
    setIsValidHex(true);
    onChange(color);
  };

  return (
    <div className="space-y-4">
      {/* Hex Input with Preview */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm flex-shrink-0"
          style={{ backgroundColor: isValidHex ? hexInput : '#FFFFFF' }}
        />
        <div className="flex-1">
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexInputChange(e.target.value)}
            placeholder="#3B82F6"
            className={`w-full px-3 py-2 border rounded-lg font-mono text-sm uppercase ${
              isValidHex
                ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                : 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            }`}
          />
          {!isValidHex && (
            <p className="text-xs text-red-600 mt-1">Cod HEX invalid</p>
          )}
        </div>
      </div>

      {/* Preset Color Swatches */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Culori predefinite
        </label>
        <div className="grid grid-cols-6 gap-2">
          {presets.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handlePresetClick(color)}
              className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                hexInput.toLowerCase() === color.toLowerCase()
                  ? 'border-gray-900 ring-2 ring-blue-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Native Color Input Fallback */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selector culoare
        </label>
        <input
          type="color"
          value={isValidHex ? hexInput : '#3B82F6'}
          onChange={handleNativeColorChange}
          className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
        />
      </div>
    </div>
  );
}
