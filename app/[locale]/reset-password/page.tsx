'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const supabase = createSupabaseBrowser();

  function validatePassword(password: string): string | null {
    if (password.length < 8) {
      return 'Parola trebuie să conțină minim 8 caractere.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Parola trebuie să conțină cel puțin o literă majusculă.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Parola trebuie să conțină cel puțin o cifră.';
    }
    return null;
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validare parolă nouă
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    // Verificare parole identice
    if (newPassword !== confirmPassword) {
      setError('Parolele nu se potrivesc.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        setError('Eroare la actualizarea parolei: ' + updateError.message);
        setLoading(false);
        return;
      }

      // Succes
      setSuccess(true);

      // Redirect după 2 secunde
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('A apărut o eroare neașteptată. Te rugăm să încerci din nou.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">s-s-m.ro</h1>
          <p className="text-sm text-gray-500 mt-1">Resetare parolă</p>
        </div>

        <form onSubmit={handleResetPassword} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              Parola a fost schimbată cu succes! Redirecționare către login...
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parolă nouă
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={success}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minim 8 caractere, 1 majusculă, 1 cifră
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmă parola
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={success}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Se procesează...' : success ? 'Parola schimbată!' : 'Schimbă parola'}
          </button>

          {!success && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Înapoi la login
              </button>
            </div>
          )}
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 s-s-m.ro — Platformă SSM
        </p>
      </div>
    </div>
  );
}
