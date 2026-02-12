import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Params = {
  params: {
    locale: string;
  };
};

export default function PrivacyPage({ params: { locale } }: Params) {
  setRequestLocale(locale);
  const t = useTranslations('privacy');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-600">
            {t('lastUpdated')}: {t('updateDate')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

          {/* 1. Operator Date */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. {t('sections.operator.title')}
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">{t('sections.operator.intro')}</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-700">
                  <strong>{t('sections.operator.companyName')}:</strong> [NUME COMPANIE]
                </p>
                <p className="text-gray-700">
                  <strong>{t('sections.operator.cui')}:</strong> [CUI]
                </p>
                <p className="text-gray-700">
                  <strong>{t('sections.operator.address')}:</strong> [ADRESĂ COMPLETĂ]
                </p>
                <p className="text-gray-700">
                  <strong>{t('sections.operator.email')}:</strong> [EMAIL CONTACT]
                </p>
                <p className="text-gray-700">
                  <strong>{t('sections.operator.phone')}:</strong> [TELEFON]
                </p>
              </div>
            </div>
          </section>

          {/* 2. Date Colectate */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. {t('sections.dataCollected.title')}
            </h2>
            <p className="text-gray-700 mb-4">{t('sections.dataCollected.intro')}</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('sections.dataCollected.categories.identification.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>{t('sections.dataCollected.categories.identification.items.name')}</li>
                  <li>{t('sections.dataCollected.categories.identification.items.email')}</li>
                  <li>{t('sections.dataCollected.categories.identification.items.phone')}</li>
                  <li>{t('sections.dataCollected.categories.identification.items.cui')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('sections.dataCollected.categories.professional.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>{t('sections.dataCollected.categories.professional.items.company')}</li>
                  <li>{t('sections.dataCollected.categories.professional.items.position')}</li>
                  <li>{t('sections.dataCollected.categories.professional.items.department')}</li>
                  <li>{t('sections.dataCollected.categories.professional.items.role')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('sections.dataCollected.categories.medical.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>{t('sections.dataCollected.categories.medical.items.records')}</li>
                  <li>{t('sections.dataCollected.categories.medical.items.exams')}</li>
                  <li>{t('sections.dataCollected.categories.medical.items.aptitude')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('sections.dataCollected.categories.technical.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>{t('sections.dataCollected.categories.technical.items.ip')}</li>
                  <li>{t('sections.dataCollected.categories.technical.items.browser')}</li>
                  <li>{t('sections.dataCollected.categories.technical.items.logs')}</li>
                  <li>{t('sections.dataCollected.categories.technical.items.cookies')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Scop și Temei Legal */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. {t('sections.purpose.title')}
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  {t('sections.purpose.items.contract.title')}
                </h3>
                <p className="text-blue-800 mb-2">{t('sections.purpose.items.contract.desc')}</p>
                <p className="text-sm text-blue-700">
                  <strong>{t('sections.purpose.legalBasis')}:</strong> {t('sections.purpose.items.contract.basis')}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  {t('sections.purpose.items.compliance.title')}
                </h3>
                <p className="text-blue-800 mb-2">{t('sections.purpose.items.compliance.desc')}</p>
                <p className="text-sm text-blue-700">
                  <strong>{t('sections.purpose.legalBasis')}:</strong> {t('sections.purpose.items.compliance.basis')}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  {t('sections.purpose.items.security.title')}
                </h3>
                <p className="text-blue-800 mb-2">{t('sections.purpose.items.security.desc')}</p>
                <p className="text-sm text-blue-700">
                  <strong>{t('sections.purpose.legalBasis')}:</strong> {t('sections.purpose.items.security.basis')}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  {t('sections.purpose.items.marketing.title')}
                </h3>
                <p className="text-blue-800 mb-2">{t('sections.purpose.items.marketing.desc')}</p>
                <p className="text-sm text-blue-700">
                  <strong>{t('sections.purpose.legalBasis')}:</strong> {t('sections.purpose.items.marketing.basis')}
                </p>
              </div>
            </div>
          </section>

          {/* 4. Destinatari */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. {t('sections.recipients.title')}
            </h2>
            <p className="text-gray-700 mb-4">{t('sections.recipients.intro')}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{t('sections.recipients.items.supabase')}</li>
              <li>{t('sections.recipients.items.vercel')}</li>
              <li>{t('sections.recipients.items.authorities')}</li>
              <li>{t('sections.recipients.items.consultants')}</li>
              <li>{t('sections.recipients.items.medical')}</li>
            </ul>
          </section>

          {/* 5. Transfer Internațional */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. {t('sections.internationalTransfer.title')}
            </h2>
            <p className="text-gray-700 mb-4">{t('sections.internationalTransfer.intro')}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900">
                <strong>{t('sections.internationalTransfer.supabase.title')}:</strong>{' '}
                {t('sections.internationalTransfer.supabase.desc')}
              </p>
              <p className="text-amber-900 mt-2">
                <strong>{t('sections.internationalTransfer.vercel.title')}:</strong>{' '}
                {t('sections.internationalTransfer.vercel.desc')}
              </p>
            </div>
            <p className="text-gray-700 mt-4">{t('sections.internationalTransfer.guarantees')}</p>
          </section>

          {/* 6. Durata Stocare */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. {t('sections.retention.title')}
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-32 font-medium text-gray-700 flex-shrink-0">
                  {t('sections.retention.items.contractData.period')}
                </div>
                <div className="text-gray-600">
                  {t('sections.retention.items.contractData.desc')}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-32 font-medium text-gray-700 flex-shrink-0">
                  {t('sections.retention.items.medicalData.period')}
                </div>
                <div className="text-gray-600">
                  {t('sections.retention.items.medicalData.desc')}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-32 font-medium text-gray-700 flex-shrink-0">
                  {t('sections.retention.items.marketingData.period')}
                </div>
                <div className="text-gray-600">
                  {t('sections.retention.items.marketingData.desc')}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-32 font-medium text-gray-700 flex-shrink-0">
                  {t('sections.retention.items.technicalData.period')}
                </div>
                <div className="text-gray-600">
                  {t('sections.retention.items.technicalData.desc')}
                </div>
              </div>
            </div>
          </section>

          {/* 7. Drepturi Persoane Vizate */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. {t('sections.rights.title')}
            </h2>
            <p className="text-gray-700 mb-4">{t('sections.rights.intro')}</p>
            <div className="grid gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.rights.items.access.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.rights.items.access.desc')}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.rights.items.rectification.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.rights.items.rectification.desc')}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.rights.items.erasure.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.rights.items.erasure.desc')}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.rights.items.restriction.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.rights.items.restriction.desc')}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.rights.items.portability.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.rights.items.portability.desc')}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.rights.items.objection.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.rights.items.objection.desc')}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.rights.items.withdraw.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.rights.items.withdraw.desc')}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.rights.items.complaint.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.rights.items.complaint.desc')}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <p className="text-blue-900">
                <strong>{t('sections.rights.exercise')}:</strong>{' '}
                {t('sections.rights.exerciseDesc')}
              </p>
            </div>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. {t('sections.cookies.title')}
            </h2>
            <p className="text-gray-700 mb-4">{t('sections.cookies.intro')}</p>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.cookies.types.essential.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.cookies.types.essential.desc')}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.cookies.types.functional.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.cookies.types.functional.desc')}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('sections.cookies.types.analytics.title')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('sections.cookies.types.analytics.desc')}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mt-4">{t('sections.cookies.management')}</p>
          </section>

          {/* 9. Securitate */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. {t('sections.security.title')}
            </h2>
            <p className="text-gray-700 mb-4">{t('sections.security.intro')}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{t('sections.security.measures.encryption')}</li>
              <li>{t('sections.security.measures.access')}</li>
              <li>{t('sections.security.measures.monitoring')}</li>
              <li>{t('sections.security.measures.backup')}</li>
              <li>{t('sections.security.measures.training')}</li>
            </ul>
          </section>

          {/* 10. DPO Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. {t('sections.dpo.title')}
            </h2>
            <p className="text-gray-700 mb-4">{t('sections.dpo.intro')}</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>{t('sections.dpo.email')}:</strong> [DPO EMAIL]
              </p>
              <p className="text-gray-700 mt-2">
                <strong>{t('sections.dpo.address')}:</strong> [DPO ADDRESS]
              </p>
            </div>
          </section>

          {/* 11. ANSPDCP */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. {t('sections.anspdcp.title')}
            </h2>
            <p className="text-gray-700 mb-4">{t('sections.anspdcp.intro')}</p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700">
                <strong>{t('sections.anspdcp.name')}:</strong> Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
              </p>
              <p className="text-gray-700">
                <strong>{t('sections.anspdcp.address')}:</strong> B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București
              </p>
              <p className="text-gray-700">
                <strong>{t('sections.anspdcp.website')}:</strong>{' '}
                <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.dataprotection.ro
                </a>
              </p>
            </div>
          </section>

          {/* 12. Modificări */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. {t('sections.changes.title')}
            </h2>
            <p className="text-gray-700">
              {t('sections.changes.desc')}
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href={`/${locale}/dashboard`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('backToDashboard')}
          </a>
        </div>
      </div>
    </div>
  );
}
