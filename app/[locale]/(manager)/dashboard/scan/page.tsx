/**
 * Scan Page - Universal Document Scan with OCR + AI Extraction
 * Server component wrapper pentru ScanClient
 */

import { Metadata } from 'next';
import ScanClient from './ScanClient';

export const metadata: Metadata = {
  title: 'Scan Documente | s-s-m.ro',
  description: 'Extrage automat date din documente SSM/PSI folosind AI și OCR',
};

export default function ScanPage() {
  return (
    <div className="p-6">
      <ScanClient />
    </div>
  );
}
