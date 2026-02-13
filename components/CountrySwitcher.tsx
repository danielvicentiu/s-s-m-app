'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type Country = {
  code: string;
  name: string;
  flag: string;
  defaultLanguage: string;
  currency: string;
  legislation: string;
};

const COUNTRIES: Country[] = [
  {
    code: 'RO',
    name: 'România',
    flag: '🇷🇴',
    defaultLanguage: 'ro',
    currency: 'RON',
    legislation: 'Legea 319/2006',
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    flag: '🇧🇬',
    defaultLanguage: 'bg',
    currency: 'BGN',
    legislation: 'Закон за здравословни и безопасни условия на труд',
  },
  {
    code: 'HU',
    name: 'Magyarország',
    flag: '🇭🇺',
    defaultLanguage: 'hu',
    currency: 'HUF',
    legislation: 'Munka törvénykönyve',
  },
  {
    code: 'DE',
    name: 'Deutschland',
    flag: '🇩🇪',
    defaultLanguage: 'de',
    currency: 'EUR',
    legislation: 'Arbeitsschutzgesetz (ArbSchG)',
  },
  {
    code: 'PL',
    name: 'Polska',
    flag: '🇵🇱',
    defaultLanguage: 'pl',
    currency: 'PLN',
    legislation: 'Kodeks pracy',
  },
];

const COOKIE_NAME = 'selected_country';
const COOKIE_EXPIRY_DAYS = 365;

export default function CountrySwitcher() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isOpen, setIsOpen] = useState(false);

  // Load country from cookie on mount
  useEffect(() => {
    const savedCountryCode = getCookie(COOKIE_NAME);
    if (savedCountryCode) {
      const country = COUNTRIES.find((c) => c.code === savedCountryCode);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, []);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);

    // Save to cookie
    setCookie(COOKIE_NAME, country.code, COOKIE_EXPIRY_DAYS);

    // Emit custom event for other components to react to country change
    window.dispatchEvent(
      new CustomEvent('countryChanged', {
        detail: {
          country: country.code,
          language: country.defaultLanguage,
          currency: country.currency,
          legislation: country.legislation,
        },
      })
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        aria-label="Selectează țara"
        aria-expanded={isOpen}
      >
        <span className="text-2xl" role="img" aria-label={`Flag of ${selectedCountry.name}`}>
          {selectedCountry.flag}
        </span>
        <span className="font-medium text-gray-900">{selectedCountry.name}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 overflow-hidden">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountryChange(country)}
                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                  selectedCountry.code === country.code ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-2xl flex-shrink-0" role="img" aria-label={`Flag of ${country.name}`}>
                  {country.flag}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{country.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {country.defaultLanguage.toUpperCase()} • {country.currency}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 truncate" title={country.legislation}>
                    {country.legislation}
                  </div>
                </div>
                {selectedCountry.code === country.code && (
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Cookie helper functions
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
