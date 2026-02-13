import { Wrench, Clock, Mail, ExternalLink } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 rounded-full p-6">
              <Wrench className="w-16 h-16 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Revenim în curând
          </h1>

          {/* Main Message */}
          <p className="text-lg text-gray-600 mb-8">
            Platforma este în mentenanță programată pentru îmbunătățiri și actualizări.
          </p>

          {/* Time Estimate */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Timp estimat</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">2-3 ore</p>
          </div>

          {/* Contact and Status */}
          <div className="space-y-4">
            {/* Email Contact */}
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>Contact:</span>
              <a
                href="mailto:contact@s-s-m.ro"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                contact@s-s-m.ro
              </a>
            </div>

            {/* Status Page Link */}
            <div className="pt-4">
              <a
                href="https://status.s-s-m.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <span>Verifică statusul platformei</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Îți mulțumim pentru înțelegere!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
