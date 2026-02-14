import { Metadata } from 'next';
import AdminHealthClient from './AdminHealthClient';

export const metadata: Metadata = {
  title: 'System Health | Admin',
  description: 'Monitorizare stare sistem și servicii',
};

export default function AdminHealthPage() {
  return <AdminHealthClient />;
}
