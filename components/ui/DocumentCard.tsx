import React from 'react';
import { FileText, Shield, Lock, Server, Download } from 'lucide-react';

type DocumentType = 'SSM' | 'PSI' | 'GDPR' | 'NIS2';
type DocumentStatus = 'valid' | 'expiring' | 'expired';

interface DocumentCardProps {
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  expiryDate: string;
  downloadUrl: string;
}

const getTypeIcon = (type: DocumentType) => {
  switch (type) {
    case 'SSM':
      return <Shield className="w-6 h-6" />;
    case 'PSI':
      return <FileText className="w-6 h-6" />;
    case 'GDPR':
      return <Lock className="w-6 h-6" />;
    case 'NIS2':
      return <Server className="w-6 h-6" />;
  }
};

const getTypeColor = (type: DocumentType) => {
  switch (type) {
    case 'SSM':
      return 'bg-blue-100 text-blue-600';
    case 'PSI':
      return 'bg-orange-100 text-orange-600';
    case 'GDPR':
      return 'bg-purple-100 text-purple-600';
    case 'NIS2':
      return 'bg-green-100 text-green-600';
  }
};

const getStatusBadge = (status: DocumentStatus) => {
  switch (status) {
    case 'valid':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Valid
        </span>
      );
    case 'expiring':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Expiră curând
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Expirat
        </span>
      );
  }
};

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  type,
  status,
  expiryDate,
  downloadUrl,
}) => {
  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-xl ${getTypeColor(type)}`}>
            {getTypeIcon(type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">Tip: {type}</p>
          </div>
        </div>
        {getStatusBadge(status)}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Data expirare</p>
          <p className="text-sm font-medium text-gray-900">{expiryDate}</p>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Descarcă
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
