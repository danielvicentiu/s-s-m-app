import React from 'react';
import { Check, X } from 'lucide-react';

interface ComparisonFeature {
  feature: string;
  ssm: boolean | string;
  excel: boolean | string;
  consultant: boolean | string;
  other: boolean | string;
}

const comparisonData: ComparisonFeature[] = [
  {
    feature: 'Preț lunar',
    ssm: '99 RON',
    excel: 'Gratuit',
    consultant: '500-2000 RON',
    other: '200-500 RON',
  },
  {
    feature: 'Actualizare legislativă',
    ssm: true,
    excel: false,
    consultant: true,
    other: false,
  },
  {
    feature: 'Alerte automate',
    ssm: true,
    excel: false,
    consultant: false,
    other: true,
  },
  {
    feature: 'Multi-țară (RO, BG, HU, DE)',
    ssm: true,
    excel: false,
    consultant: false,
    other: false,
  },
  {
    feature: 'Rapoarte PDF',
    ssm: true,
    excel: false,
    consultant: true,
    other: true,
  },
  {
    feature: 'Suport dedicat',
    ssm: true,
    excel: false,
    consultant: true,
    other: false,
  },
  {
    feature: 'Conformitate GDPR',
    ssm: true,
    excel: false,
    consultant: true,
    other: true,
  },
];

const ComparisonTable = () => {
  const renderCell = (value: boolean | string, isHighlighted: boolean = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className={`w-6 h-6 mx-auto ${isHighlighted ? 'text-green-600' : 'text-green-500'}`} />
      ) : (
        <X className="w-6 h-6 mx-auto text-red-400" />
      );
    }
    return <span className={`font-semibold ${isHighlighted ? 'text-green-700' : 'text-gray-700'}`}>{value}</span>;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Caracteristici
                </th>
                <th className="px-6 py-4 text-center bg-green-50 border-l-2 border-r-2 border-green-200">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-green-700">s-s-m.ro</span>
                    <span className="text-xs text-green-600 mt-1">Recomandat</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Excel / Documente
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Consultant Tradițional
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Altă Platformă
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {comparisonData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-center bg-green-50/50 border-l-2 border-r-2 border-green-100">
                    {renderCell(row.ssm, true)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderCell(row.excel)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderCell(row.consultant)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderCell(row.other)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile-friendly version */}
      <div className="md:hidden mt-6 space-y-4">
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-4 shadow-lg">
          <h3 className="text-lg font-bold text-green-700 mb-3 text-center">
            s-s-m.ro (Recomandat)
          </h3>
          {comparisonData.map((row, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-green-100 last:border-b-0">
              <span className="text-sm font-medium text-gray-700">{row.feature}</span>
              <div>{renderCell(row.ssm, true)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Excel / Documente
          </h3>
          {comparisonData.map((row, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm font-medium text-gray-700">{row.feature}</span>
              <div>{renderCell(row.excel)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Consultant Tradițional
          </h3>
          {comparisonData.map((row, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm font-medium text-gray-700">{row.feature}</span>
              <div>{renderCell(row.consultant)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Altă Platformă
          </h3>
          {comparisonData.map((row, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm font-medium text-gray-700">{row.feature}</span>
              <div>{renderCell(row.other)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
