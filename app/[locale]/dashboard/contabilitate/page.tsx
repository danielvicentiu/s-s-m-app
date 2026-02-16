/**
 * Accounting Module Page - Server Component Wrapper
 * Route: /dashboard/contabilitate
 * Created: 2026-02-16
 */

import { Metadata } from 'next';
import ContabilitateClient from './ContabilitateClient';

export const metadata: Metadata = {
  title: 'Contabilitate & Fiscal | s-s-m.ro',
  description: 'Gestionare contracte contabilitate, termene fiscale și monitorizare KPI',
};

export default function ContabilitatePage() {
  return <ContabilitateClient />;
}
