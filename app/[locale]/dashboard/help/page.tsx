import { Metadata } from 'next';
import HelpCenterClient from './HelpCenterClient';

export const metadata: Metadata = {
  title: 'Centru de ajutor | s-s-m.ro',
  description: 'Găsește răspunsuri rapid la întrebările tale despre platforma SSM',
};

export default function HelpPage() {
  return <HelpCenterClient />;
}
