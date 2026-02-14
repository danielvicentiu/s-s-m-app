'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format: string;
  placeholder: string;
  maxLength: number;
}

const COUNTRIES: Country[] = [
  {
    code: 'RO',
    name: 'România',
    dialCode: '+40',
    flag: '🇷🇴',
    format: 'XXX XXX XXX',
    placeholder: '712 345 678',
    maxLength: 9,
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    dialCode: '+359',
    flag: '🇧🇬',
    format: 'XX XXX XXXX',
    placeholder: '87 123 4567',
    maxLength: 9,
  },
  {
    code: 'HU',
    name: 'Ungaria',
    dialCode: '+36',
    flag: '🇭🇺',
    format: 'XX XXX XXXX',
    placeholder: '20 123 4567',
    maxLength: 9,
  },
  {
    code: 'DE',
    name: 'Germania',
    dialCode: '+49',
    flag: '🇩🇪',
    format: 'XXXX XXXXXXX',
    placeholder: '1512 3456789',
    maxLength: 11,
  },
  {
    code: 'PL',
    name: 'Polonia',
    dialCode: '+48',
    flag: '🇵🇱',
    format: 'XXX XXX XXX',
    placeholder: '501 234 567',
    maxLength: 9,
  },
];

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  defaultCountry?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function PhoneInput({
  value = '',
  onChange,
  onValidChange,
  defaultCountry = 'RO',
  disabled = false,
  error,
  label,
  required = false,
  className = '',
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const country = COUNTRIES.find((c) => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        const number = value.replace(country.dialCode, '').trim();
        setPhoneNumber(formatPhoneNumber(number, country));
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPhoneNumber = (input: string, country: Country): string => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');

    // Limit to max length
    const limited = digits.slice(0, country.maxLength);

    // Apply formatting based on country
    let formatted = '';
    let digitIndex = 0;

    for (const char of country.format) {
      if (char === 'X') {
        if (digitIndex < limited.length) {
          formatted += limited[digitIndex];
          digitIndex++;
        } else {
          break;
        }
      } else {
        if (digitIndex < limited.length) {
          formatted += char;
        }
      }
    }

    return formatted;
  };

  const validatePhoneNumber = (number: string, country: Country): boolean => {
    const digits = number.replace(/\D/g, '');
    return digits.length === country.maxLength;
  };

  const handlePhoneChange = (input: string) => {
    const formatted = formatPhoneNumber(input, selectedCountry);
    setPhoneNumber(formatted);

    // Build full phone number
    const digits = formatted.replace(/\D/g, '');
    const fullNumber = digits ? `${selectedCountry.dialCode}${digits}` : '';

    // Call callbacks
    onChange?.(fullNumber);

    const isValid = validatePhoneNumber(formatted, selectedCountry);
    onValidChange?.(isValid);
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);

    // Reformat existing number for new country
    if (phoneNumber) {
      const digits = phoneNumber.replace(/\D/g, '');
      const formatted = formatPhoneNumber(digits, country);
      setPhoneNumber(formatted);

      const fullNumber = digits ? `${country.dialCode}${digits}` : '';
      onChange?.(fullNumber);

      const isValid = validatePhoneNumber(formatted, country);
      onValidChange?.(isValid);
    }
  };

  const isValid = phoneNumber
    ? validatePhoneNumber(phoneNumber, selectedCountry)
    : true;

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={`flex items-center overflow-hidden rounded-xl border ${
            error
              ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200'
              : !isValid && phoneNumber
                ? 'border-orange-300 focus-within:ring-2 focus-within:ring-orange-200'
                : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'
          } bg-white transition-all`}
        >
          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
              disabled={disabled}
              className={`flex items-center gap-2 border-r border-gray-300 bg-gray-50 px-3 py-2.5 transition-colors hover:bg-gray-100 ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
              aria-label="Selectează țara"
            >
              <span className="text-xl leading-none">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-gray-700">
                {selectedCountry.dialCode}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountryChange(country)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                      selectedCountry.code === country.code
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="text-xl leading-none">{country.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{country.name}</div>
                      <div className="text-xs text-gray-500">
                        {country.dialCode} • {country.placeholder}
                      </div>
                    </div>
                    {selectedCountry.code === country.code && (
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone Input */}
          <div className="relative flex-1">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder={selectedCountry.placeholder}
              disabled={disabled}
              className={`w-full border-0 bg-transparent py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none ${
                disabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            />
          </div>
        </div>

        {/* Error or validation message */}
        {error && (
          <p className="mt-1.5 text-xs text-red-600">{error}</p>
        )}
        {!error && !isValid && phoneNumber && (
          <p className="mt-1.5 text-xs text-orange-600">
            Număr incomplet pentru {selectedCountry.name}
          </p>
        )}
      </div>
    </div>
  );
}
