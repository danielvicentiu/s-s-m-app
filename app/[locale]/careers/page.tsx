'use client';

import { useState } from 'react';
import { Upload, Briefcase, Globe, Clock, TrendingUp, Send } from 'lucide-react';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    message: '',
    cv: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    alert('Aplicația a fost trimisă cu succes! Vă vom contacta în curând.');
    setFormData({
      name: '',
      email: '',
      position: '',
      message: '',
      cv: null,
    });
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, cv: e.target.files[0] });
    }
  };

  const openPositions = [
    {
      id: 1,
      title: 'Frontend Developer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Dezvoltăm interfețe moderne cu React, Next.js și TypeScript pentru platforme SSM/PSI.',
    },
    {
      id: 2,
      title: 'Backend Developer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Construim arhitecturi scalabile cu Node.js, Supabase și integrări API complexe.',
    },
    {
      id: 3,
      title: 'SSM Consultant',
      type: 'Part-time / Full-time',
      location: 'Hybrid',
      description: 'Oferim consultanță de specialitate în SSM/PSI pentru clienți din România și Europa.',
    },
  ];

  const benefits = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Remote First',
      description: 'Lucrează de oriunde din lume, cu flexibilitate totală.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Program Flexibil',
      description: 'Alege-ți orele și adaptează munca la stilul tău de viață.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Equity & Growth',
      description: 'Opțiuni de acțiuni și oportunități de creștere în cadrul companiei.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Alătură-te Echipei Noastre
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            Construim viitorul digitalizării SSM/PSI în România și Europa
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Misiunea Noastră</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Transformăm modul în care consultanții SSM și firmele gestionează conformitatea și
              securitatea muncii. Cu peste 20 de ani de experiență și 100+ clienți activi, dezvoltăm
              soluții digitale inovatoare care simplifică procesele complexe de compliance.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ne extindem în România, Bulgaria, Ungaria și Germania, oferind o platformă multilingvă
              care face diferența în industrie. Alătură-te nouă pentru a crea viitorul SSM/PSI digital!
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            De Ce Să Lucrezi Cu Noi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Poziții Deschise
          </h2>
          <div className="space-y-6">
            {openPositions.map((position) => (
              <div
                key={position.id}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {position.title}
                      </h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-sm text-gray-600">{position.type}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{position.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {position.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Aplică Acum
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Completează formularul de mai jos și vei fi contactat în curând.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nume Complet *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ion Popescu"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="ion.popescu@example.com"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Poziție *
                </label>
                <select
                  id="position"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Selectează poziția</option>
                  {openPositions.map((pos) => (
                    <option key={pos.id} value={pos.title}>
                      {pos.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-2">
                  CV (PDF, DOC, DOCX) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="cv"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="cv"
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {formData.cv ? formData.cv.name : 'Încarcă CV-ul tău'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Spune-ne de ce vrei să te alături echipei noastre..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Trimite Aplicația
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">
            Ai întrebări? Contactează-ne la{' '}
            <a href="mailto:careers@s-s-m.ro" className="text-blue-600 hover:underline">
              careers@s-s-m.ro
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
