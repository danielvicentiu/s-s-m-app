'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to API endpoint
    this.logErrorToAPI(error, errorInfo);
  }

  async logErrorToAPI(error: Error, errorInfo: ErrorInfo) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
          url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        }),
      });
    } catch (loggingError) {
      console.error('Failed to log error to API:', loggingError);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  getErrorMessage(error: Error): string {
    // Different messages based on error type
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Eroare de conexiune. Verificați conexiunea la internet și încercați din nou.';
    }

    if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      return 'Nu aveți permisiunea necesară pentru această acțiune.';
    }

    if (error.message.includes('not found') || error.message.includes('404')) {
      return 'Resursa solicitată nu a fost găsită.';
    }

    if (error.message.includes('timeout')) {
      return 'Cererea a expirat. Încercați din nou.';
    }

    if (error.message.includes('validation')) {
      return 'Date invalide. Verificați informațiile introduse.';
    }

    // Generic error message
    return 'A apărut o eroare neașteptată. Vă rugăm să încercați din nou.';
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      const errorMessage = this.state.error
        ? this.getErrorMessage(this.state.error)
        : 'A apărut o eroare neașteptată.';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Error Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Ceva nu a mers bine
              </h2>

              {/* Error Message */}
              <p className="text-gray-600 mb-6">{errorMessage}</p>

              {/* Error Details (in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="w-full mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                    Detalii tehnice
                  </summary>
                  <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-700 overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Încearcă din nou
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Înapoi la Dashboard
                </button>
              </div>

              {/* Support Link */}
              <p className="mt-6 text-sm text-gray-500">
                Dacă problema persistă,{' '}
                <a
                  href="mailto:support@s-s-m.ro"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  contactați echipa de suport
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
