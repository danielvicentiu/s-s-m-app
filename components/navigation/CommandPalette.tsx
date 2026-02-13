'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  MagnifyingGlassIcon,
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  UserPlusIcon,
  DocumentTextIcon,
  UserCircleIcon,
  LanguageIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Command {
  id: string;
  label: string;
  category: 'navigation' | 'actions' | 'settings';
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const locale = useLocale();

  // Define all available commands
  const commands: Command[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-dashboard',
        label: 'Dashboard',
        category: 'navigation',
        icon: HomeIcon,
        action: () => router.push(`/${locale}/dashboard`),
        keywords: ['home', 'acasa', 'panou'],
      },
      {
        id: 'nav-employees',
        label: 'Angajați',
        category: 'navigation',
        icon: UserGroupIcon,
        action: () => router.push(`/${locale}/dashboard/employees`),
        keywords: ['employees', 'angajati', 'personal', 'staff'],
      },
      {
        id: 'nav-trainings',
        label: 'Instruiri',
        category: 'navigation',
        icon: AcademicCapIcon,
        action: () => router.push(`/${locale}/dashboard/trainings`),
        keywords: ['trainings', 'instruiri', 'cursuri', 'training'],
      },
      {
        id: 'nav-medical',
        label: 'Control Medical',
        category: 'navigation',
        icon: DocumentTextIcon,
        action: () => router.push(`/${locale}/dashboard/medical`),
        keywords: ['medical', 'sanatate', 'health'],
      },
      // Actions
      {
        id: 'action-add-employee',
        label: 'Adaugă angajat',
        category: 'actions',
        icon: UserPlusIcon,
        action: () => router.push(`/${locale}/dashboard/employees?action=add`),
        keywords: ['add', 'adauga', 'angajat', 'employee', 'nou', 'new'],
      },
      {
        id: 'action-generate-report',
        label: 'Generează raport',
        category: 'actions',
        icon: DocumentTextIcon,
        action: () => router.push(`/${locale}/dashboard/reports`),
        keywords: ['report', 'raport', 'genereaza', 'generate', 'export'],
      },
      // Settings
      {
        id: 'settings-profile',
        label: 'Profil',
        category: 'settings',
        icon: UserCircleIcon,
        action: () => router.push(`/${locale}/dashboard/profile`),
        keywords: ['profile', 'profil', 'cont', 'account', 'setari'],
      },
      {
        id: 'settings-language',
        label: 'Limbă',
        category: 'settings',
        icon: LanguageIcon,
        action: () => router.push(`/${locale}/dashboard/settings?tab=language`),
        keywords: ['language', 'limba', 'locale', 'translation'],
      },
    ],
    [router, locale]
  );

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;

    const query = search.toLowerCase();
    return commands.filter((cmd) => {
      const labelMatch = cmd.label.toLowerCase().includes(query);
      const keywordMatch = cmd.keywords?.some((kw) =>
        kw.toLowerCase().includes(query)
      );
      return labelMatch || keywordMatch;
    });
  }, [search, commands]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {
      navigation: [],
      actions: [],
      settings: [],
    };

    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd);
    });

    return groups;
  }, [filteredCommands]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch('');
        setSelectedIndex(0);
      }

      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(0);
      }

      // Arrow navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
        }

        // Enter to execute
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          executeCommand(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Execute command
  const executeCommand = useCallback((command: Command) => {
    command.action();
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  }, []);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  const categoryLabels: Record<string, string> = {
    navigation: 'Navigare',
    actions: 'Acțiuni',
    settings: 'Setări',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Caută comenzi sau acțiuni..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              Nu s-au găsit comenzi
            </div>
          ) : (
            <div className="py-2">
              {(Object.keys(groupedCommands) as Array<keyof typeof groupedCommands>).map(
                (category) => {
                  const categoryCommands = groupedCommands[category];
                  if (categoryCommands.length === 0) return null;

                  return (
                    <div key={category} className="mb-4 last:mb-0">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {categoryLabels[category]}
                      </div>
                      <div>
                        {categoryCommands.map((command, idx) => {
                          const globalIndex = filteredCommands.indexOf(command);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={command.id}
                              onClick={() => executeCommand(command)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <command.icon
                                className={`w-5 h-5 ${
                                  isSelected ? 'text-blue-600' : 'text-gray-400'
                                }`}
                              />
                              <span className="flex-1 text-left font-medium">
                                {command.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">
                ↑↓
              </kbd>
              <span>Navigare</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">
                Enter
              </kbd>
              <span>Execută</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">
              Esc
            </kbd>
            <span>Închide</span>
          </span>
        </div>
      </div>
    </div>
  );
}
