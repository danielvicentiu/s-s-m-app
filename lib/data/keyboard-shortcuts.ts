/**
 * Keyboard shortcuts configuration for the SSM platform
 * Organized by context: global, dashboard, table, form
 */

export type ShortcutContext = 'global' | 'dashboard' | 'table' | 'form' | 'modal';

export interface KeyboardShortcut {
  key: string;
  description: string;
  context: ShortcutContext[];
  action: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  // Global shortcuts
  {
    key: 'k',
    ctrl: true,
    description: 'Deschide căutare globală',
    context: ['global'],
    action: 'openGlobalSearch',
  },
  {
    key: 'Escape',
    description: 'Închide modal/dialog/meniu deschis',
    context: ['global', 'modal'],
    action: 'closeOverlay',
  },
  {
    key: '/',
    description: 'Focus pe câmp de căutare',
    context: ['global', 'dashboard', 'table'],
    action: 'focusSearch',
  },
  {
    key: 'h',
    ctrl: true,
    description: 'Afișează lista de comenzi rapide',
    context: ['global'],
    action: 'showShortcutsHelp',
  },
  {
    key: 'd',
    ctrl: true,
    description: 'Navigare la Dashboard',
    context: ['global'],
    action: 'navigateToDashboard',
  },

  // Dashboard shortcuts
  {
    key: 'n',
    ctrl: true,
    description: 'Creează intrare nouă (depinde de context)',
    context: ['dashboard', 'table'],
    action: 'createNew',
  },
  {
    key: 'r',
    ctrl: true,
    description: 'Reîmprospătează datele curente',
    context: ['dashboard', 'table'],
    action: 'refresh',
  },
  {
    key: 'f',
    ctrl: true,
    description: 'Deschide filtre avansate',
    context: ['dashboard', 'table'],
    action: 'openFilters',
  },
  {
    key: 'e',
    ctrl: true,
    description: 'Exportă date (CSV/PDF)',
    context: ['dashboard', 'table'],
    action: 'exportData',
  },
  {
    key: 'p',
    ctrl: true,
    description: 'Imprimă pagina curentă',
    context: ['dashboard'],
    action: 'printPage',
  },

  // Table navigation shortcuts
  {
    key: 'ArrowDown',
    description: 'Navigare la rândul următor',
    context: ['table'],
    action: 'navigateDown',
  },
  {
    key: 'ArrowUp',
    description: 'Navigare la rândul anterior',
    context: ['table'],
    action: 'navigateUp',
  },
  {
    key: 'Enter',
    description: 'Deschide detalii rând selectat',
    context: ['table'],
    action: 'openSelectedRow',
  },
  {
    key: 'a',
    ctrl: true,
    description: 'Selectează toate rândurile',
    context: ['table'],
    action: 'selectAll',
  },
  {
    key: 'Delete',
    description: 'Șterge rândurile selectate',
    context: ['table'],
    action: 'deleteSelected',
  },

  // Form shortcuts
  {
    key: 's',
    ctrl: true,
    description: 'Salvează formularul',
    context: ['form'],
    action: 'saveForm',
  },
  {
    key: 'Enter',
    ctrl: true,
    description: 'Trimite formularul',
    context: ['form'],
    action: 'submitForm',
  },
  {
    key: 'Tab',
    description: 'Navigare la câmpul următor',
    context: ['form'],
    action: 'nextField',
  },
  {
    key: 'Tab',
    shift: true,
    description: 'Navigare la câmpul anterior',
    context: ['form'],
    action: 'previousField',
  },
  {
    key: 'z',
    ctrl: true,
    description: 'Anulează ultima modificare',
    context: ['form'],
    action: 'undo',
  },
];

/**
 * Get keyboard shortcuts filtered by context
 * @param context - The context to filter shortcuts by
 * @returns Array of shortcuts applicable to the given context
 */
export function getShortcutsForContext(context: ShortcutContext): KeyboardShortcut[] {
  return KEYBOARD_SHORTCUTS.filter((shortcut) =>
    shortcut.context.includes(context)
  );
}

/**
 * Get all keyboard shortcuts that apply to multiple contexts
 * @param contexts - Array of contexts to filter by
 * @returns Array of shortcuts applicable to any of the given contexts
 */
export function getShortcutsForContexts(contexts: ShortcutContext[]): KeyboardShortcut[] {
  return KEYBOARD_SHORTCUTS.filter((shortcut) =>
    shortcut.context.some((ctx) => contexts.includes(ctx))
  );
}

/**
 * Format a keyboard shortcut for display
 * @param shortcut - The shortcut to format
 * @returns Formatted string like "Ctrl+K" or "Shift+Tab"
 */
export function formatShortcutKey(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  parts.push(shortcut.key);

  return parts.join('+');
}

/**
 * Check if a keyboard event matches a shortcut
 * @param event - The keyboard event to check
 * @param shortcut - The shortcut to match against
 * @returns true if the event matches the shortcut
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: KeyboardShortcut
): boolean {
  return (
    event.key === shortcut.key &&
    !!event.ctrlKey === !!shortcut.ctrl &&
    !!event.shiftKey === !!shortcut.shift &&
    !!event.altKey === !!shortcut.alt
  );
}

/**
 * Get grouped shortcuts by context for display
 * @returns Object with contexts as keys and shortcuts as values
 */
export function getGroupedShortcuts(): Record<ShortcutContext, KeyboardShortcut[]> {
  const contexts: ShortcutContext[] = ['global', 'dashboard', 'table', 'form', 'modal'];
  const grouped: Record<ShortcutContext, KeyboardShortcut[]> = {
    global: [],
    dashboard: [],
    table: [],
    form: [],
    modal: [],
  };

  contexts.forEach((context) => {
    grouped[context] = getShortcutsForContext(context);
  });

  return grouped;
}
