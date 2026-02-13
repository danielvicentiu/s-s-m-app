'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createSupabaseBrowser();

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Reset password error:', error);
        setError('A apărut o eroare. Te rugăm să încerci din nou.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('A apărut o eroare neașteptată.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">s-s-m.ro</h1>
          <p className="text-sm text-gray-500 mt-1">Platformă SSM — Resetare parolă</p>
        </div>

        {success ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800 mb-1">Email trimis cu succes!</h3>
                  <p className="text-sm text-green-700">
                    Am trimis un email cu link de resetare la adresa <strong>{email}</strong>.
                    Verifică inbox-ul și urmează instrucțiunile din email.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/login"
              className="block w-full py-2.5 text-center bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Înapoi la autentificare
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="mb-2">
              <p className="text-sm text-gray-600">
                Introdu adresa ta de email și îți vom trimite un link pentru resetarea parolei.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="email@exemplu.ro"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Se trimite...' : 'Trimite link resetare'}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Înapoi la autentificare
              </Link>
            </div>
          </form>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 s-s-m.ro — Platformă SSM
        </p>
      </div>
    </div>
  );
}
