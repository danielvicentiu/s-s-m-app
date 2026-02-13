'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { useRouter, Link } from '@/i18n/navigation';
import { Mail, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    // Get current user email
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
    };
    getCurrentUser();
  }, [supabase]);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  async function handleResendEmail() {
    if (timeLeft > 0) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!email) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) {
          setError('Nu am putut găsi adresa de email. Vă rugăm să vă autentificați din nou.');
          setLoading(false);
          return;
        }
        setEmail(user.email);
      }

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email!,
      });

      if (resendError) {
        console.error('Resend email error:', resendError);
        setError('Eroare la retrimiterea emailului. Vă rugăm să încercați din nou.');
      } else {
        setSuccess('Email-ul de verificare a fost retrimis cu succes! Verificați inbox-ul și folderul spam.');
        setTimeLeft(60);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('A apărut o eroare neașteptată. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  }

  async function handleChangeEmail() {
    // Sign out and redirect to login
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">s-s-m.ro</h1>
          <p className="text-sm text-gray-500 mt-1">Platformă SSM — Verificare Email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Email icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Main message */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifică-ți emailul
            </h2>
            <p className="text-gray-600">
              Am trimis un link de verificare la adresa:
            </p>
            {email && (
              <p className="text-sm font-medium text-blue-600 mt-2">
                {email}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-4">
              Dă click pe linkul din email pentru a-ți activa contul.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 mb-4">
              {success}
            </div>
          )}

          {/* Resend button */}
          <button
            onClick={handleResendEmail}
            disabled={loading || timeLeft > 0}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {loading ? 'Se trimite...' : timeLeft > 0 ? `Retrimite email (${timeLeft}s)` : 'Retrimite email de verificare'}
          </button>

          {/* Change email link */}
          <button
            onClick={handleChangeEmail}
            className="w-full py-2.5 text-gray-600 font-medium hover:text-gray-900 transition-colors text-sm"
          >
            Schimbă adresa de email
          </button>

          {/* Back to login */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              href="/login"
              className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Înapoi la autentificare
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 s-s-m.ro — Platformă SSM
        </p>
      </div>
    </div>
  );
}
