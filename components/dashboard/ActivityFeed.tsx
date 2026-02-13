'use client';

import Link from 'next/link';
import {
  UserCheck,
  Wrench,
  FileText,
  AlertTriangle,
  Calendar,
  Building2,
  Users,
  ClipboardCheck,
  Activity,
  Shield,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'training' | 'equipment' | 'medical' | 'alert' | 'document' | 'employee' | 'inspection' | 'other';
  description: string;
  timestamp: Date;
  link?: string;
}

const activityIcons = {
  training: UserCheck,
  equipment: Wrench,
  medical: Activity,
  alert: AlertTriangle,
  document: FileText,
  employee: Users,
  inspection: ClipboardCheck,
  other: Shield,
};

const activityColors = {
  training: 'text-blue-600 bg-blue-50',
  equipment: 'text-amber-600 bg-amber-50',
  medical: 'text-red-600 bg-red-50',
  alert: 'text-orange-600 bg-orange-50',
  document: 'text-green-600 bg-green-50',
  employee: 'text-purple-600 bg-purple-50',
  inspection: 'text-indigo-600 bg-indigo-50',
  other: 'text-gray-600 bg-gray-50',
};

// Placeholder data
const placeholderActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'training',
    description: 'Ion Popescu a fost instruit SSM - Protecția Muncii',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    link: '/dashboard/trainings',
  },
  {
    id: '2',
    type: 'equipment',
    description: 'Echipament de protecție "Mănuși de lucru" verificat',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    link: '/dashboard/equipment',
  },
  {
    id: '3',
    type: 'medical',
    description: 'Maria Ionescu - Control medical periodic efectuat',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    link: '/dashboard/medical',
  },
  {
    id: '4',
    type: 'alert',
    description: 'Alertă: 3 angajați cu control medical expirat',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    link: '/dashboard/alerts',
  },
  {
    id: '5',
    type: 'document',
    description: 'Document "Plan de evacuare" încărcat',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    link: '/dashboard/documents',
  },
  {
    id: '6',
    type: 'employee',
    description: 'Angajat nou adăugat: Andrei Georgescu',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    link: '/dashboard/employees',
  },
  {
    id: '7',
    type: 'inspection',
    description: 'Inspecție SSM lunară finalizată',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    link: '/dashboard/inspections',
  },
  {
    id: '8',
    type: 'training',
    description: 'Elena Dumitrescu a fost instruită PSI - Stingerea Incendiilor',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    link: '/dashboard/trainings',
  },
  {
    id: '9',
    type: 'equipment',
    description: 'Echipament de protecție "Cască de protecție" adăugat',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    link: '/dashboard/equipment',
  },
  {
    id: '10',
    type: 'other',
    description: 'Raport lunar SSM generat',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    link: '/dashboard/reports',
  },
];

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'acum câteva secunde';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `acum ${diffInMinutes} ${diffInMinutes === 1 ? 'minut' : 'minute'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `acum ${diffInHours} ${diffInHours === 1 ? 'oră' : 'ore'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'ieri';
  }

  if (diffInDays < 7) {
    return `acum ${diffInDays} zile`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `acum ${diffInWeeks} ${diffInWeeks === 1 ? 'săptămână' : 'săptămâni'}`;
  }

  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Activitate Recentă</h2>
        <Link
          href="/dashboard/activity"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Vezi tot
        </Link>
      </div>

      <div className="space-y-4">
        {placeholderActivities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const colorClasses = activityColors[activity.type];

          const content = (
            <>
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 line-clamp-2">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getRelativeTime(activity.timestamp)}
                </p>
              </div>
            </>
          );

          if (activity.link) {
            return (
              <Link
                key={activity.id}
                href={activity.link}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3"
            >
              {content}
            </div>
          );
        })}
      </div>

      {placeholderActivities.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Nicio activitate recentă</p>
        </div>
      )}
    </div>
  );
}
