import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCaseStudyBySlug, getAllCaseStudySlugs } from '@/lib/data/case-studies-ro';
import { ArrowLeft, Building2, Users, MapPin, Calendar, CheckCircle2, TrendingUp, Quote } from 'lucide-react';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllCaseStudySlugs();
  const locales = ['ro', 'en', 'bg', 'hu', 'de'];

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const caseStudy = getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return {
      title: 'Studiu de Caz Negăsit',
    };
  }

  return {
    title: `${caseStudy.title} | s-s-m.ro`,
    description: caseStudy.challenge.description,
  };
}

export default function CaseStudyPage({ params }: PageProps) {
  const caseStudy = getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Înapoi la Studii de Caz
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            {caseStudy.industry}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {caseStudy.title}
          </h1>

          {/* Company Info */}
          <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
            <div className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-gray-400" />
              <span>{caseStudy.companyName}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-400" />
              <span>{caseStudy.companySize}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-400" />
              <span>{caseStudy.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-400" />
              <span>{new Date(caseStudy.date).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>

        {/* Challenge Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {caseStudy.challenge.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {caseStudy.challenge.description}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {caseStudy.challenge.problems.map((problem, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-red-50 rounded-xl border border-red-100"
                >
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-700 text-sm font-medium">✕</span>
                  </div>
                  <p className="ml-3 text-gray-700">{problem}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {caseStudy.solution.title}
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {caseStudy.solution.description}
            </p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Funcționalități Implementate
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {caseStudy.solution.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-white rounded-xl shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="ml-3 text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-blue-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Implementare
              </h3>
              <p className="text-gray-700">{caseStudy.solution.implementation}</p>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <div className="flex items-center mb-8">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                {caseStudy.results.title}
              </h2>
            </div>

            {/* Metrics Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {caseStudy.results.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
                >
                  <div className="text-4xl font-bold text-green-700 mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    {metric.label}
                  </div>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              ))}
            </div>

            {/* Additional Benefits */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Beneficii Adiționale
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {caseStudy.results.additionalBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                    <p className="ml-3 text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <Quote className="w-12 h-12 text-blue-200 mb-6" />
            <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
              "{caseStudy.testimonial.quote}"
            </blockquote>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold mr-4">
                {caseStudy.testimonial.author.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-lg">
                  {caseStudy.testimonial.author}
                </div>
                <div className="text-blue-200">
                  {caseStudy.testimonial.role}, {caseStudy.testimonial.companyName}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pregătit să Transformi Conformitatea SSM?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Alătură-te companiilor care au automatizat conformitatea SSM și au eliminat amenzile.
              Începe gratuit astăzi!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                Începe Gratuit
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-300"
              >
                Solicită Demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
