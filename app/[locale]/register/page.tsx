'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nume, setNume] = useState('');
  const [telefon, setTelefon] = useState('');
  const [numeFirma, setNumeFirma] = useState('');
  const [cui, setCui] = useState('');
  const [acceptTermeni, setAcceptTermeni] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const supabase = createSupabaseBrowser();

  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    // Validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email-ul este obligatoriu.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email-ul nu este valid.';
    }

    // Validare parolă
    if (!password) {
      errors.password = 'Parola este obligatorie.';
    } else if (password.length < 8) {
      errors.password = 'Parola trebuie să aibă minim 8 caractere.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Parola trebuie să conțină litere mici, mari și cifre.';
    }

    // Validare confirmare parolă
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmarea parolei este obligatorie.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Parolele nu coincid.';
    }

    // Validare nume
    if (!nume || nume.trim().length < 3) {
      errors.nume = 'Numele trebuie să aibă minim 3 caractere.';
    }

    // Validare telefon
    const phoneRegex = /^(\+4|0)[0-9]{9}$/;
    if (!telefon) {
      errors.telefon = 'Telefonul este obligatoriu.';
    } else if (!phoneRegex.test(telefon.replace(/\s/g, ''))) {
      errors.telefon = 'Formatul telefonului nu este valid (ex: 0722123456).';
    }

    // Validare nume firmă
    if (!numeFirma || numeFirma.trim().length < 2) {
      errors.numeFirma = 'Numele firmei este obligatoriu (minim 2 caractere).';
    }

    // Validare CUI (opțional, dar dacă este completat, să fie valid)
    if (cui && cui.trim()) {
      const cuiCleaned = cui.replace(/[^0-9]/g, '');
      if (cuiCleaned.length < 6 || cuiCleaned.length > 10) {
        errors.cui = 'CUI-ul trebuie să aibă între 6 și 10 cifre.';
      }
    }

    // Validare termeni
    if (!acceptTermeni) {
      errors.acceptTermeni = 'Trebuie să accepți termenii și condițiile.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Validare client-side
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Creare cont Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nume,
            telefon,
            nume_firma: numeFirma,
            cui: cui || null,
          },
        },
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);

        if (signUpError.message.includes('already registered')) {
          setError('Acest email este deja înregistrat. Te rugăm să te autentifici.');
        } else if (signUpError.message.includes('Password')) {
          setError('Parola nu respectă cerințele de securitate.');
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Eroare la crearea contului. Te rugăm să încerci din nou.');
        setLoading(false);
        return;
      }

      // Redirect către onboarding după înregistrare reușită
      router.push('/onboarding');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Eroare la înregistrare. Te rugăm să încerci din nou.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">s-s-m.ro</h1>
          <p className="text-sm text-gray-500 mt-1">Platformă SSM — Înregistrare</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                validationErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="email@exemplu.ro"
            />
            {validationErrors.email && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Parolă */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parolă <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                validationErrors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Minim 8 caractere"
            />
            {validationErrors.password && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirmare Parolă */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmă Parola <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirmă parola"
            />
            {validationErrors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* Nume */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nume și Prenume <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                validationErrors.nume ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ion Popescu"
            />
            {validationErrors.nume && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.nume}</p>
            )}
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                validationErrors.telefon ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0722123456"
            />
            {validationErrors.telefon && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.telefon}</p>
            )}
          </div>

          {/* Nume Firmă */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nume Firmă <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={numeFirma}
              onChange={(e) => setNumeFirma(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                validationErrors.numeFirma ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="SC Exemplu SRL"
            />
            {validationErrors.numeFirma && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.numeFirma}</p>
            )}
          </div>

          {/* CUI (Opțional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CUI (opțional)
            </label>
            <input
              type="text"
              value={cui}
              onChange={(e) => setCui(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                validationErrors.cui ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="RO12345678"
            />
            {validationErrors.cui && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.cui}</p>
            )}
          </div>

          {/* Accept Termeni */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="acceptTermeni"
              checked={acceptTermeni}
              onChange={(e) => setAcceptTermeni(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="acceptTermeni" className="ml-2 text-sm text-gray-700">
              Accept{' '}
              <a href="/termeni" target="_blank" className="text-blue-600 hover:underline">
                termenii și condițiile
              </a>{' '}
              și{' '}
              <a href="/confidentialitate" target="_blank" className="text-blue-600 hover:underline">
                politica de confidențialitate
              </a>
              <span className="text-red-500">*</span>
            </label>
          </div>
          {validationErrors.acceptTermeni && (
            <p className="text-xs text-red-600 -mt-2">{validationErrors.acceptTermeni}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Se înregistrează...' : 'Creează cont'}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Ai deja cont?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Autentifică-te
            </Link>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 s-s-m.ro — Platformă SSM
        </p>
      </div>
    </div>
  );
}
