/**
 * KeyboardNavigationManager
 *
 * Centralized keyboard navigation system for the application.
 * Supports context-aware shortcuts, global navigation, and accessibility features.
 */

export type KeyboardContext = 'global' | 'dashboard' | 'form' | 'table' | 'modal' | 'dropdown';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  context?: KeyboardContext;
  action: (event: KeyboardEvent) => void;
  description?: string;
  preventDefault?: boolean;
}

export class KeyboardNavigationManager {
  private shortcuts: KeyboardShortcut[] = [];
  private currentContext: KeyboardContext = 'global';
  private contextStack: KeyboardContext[] = ['global'];
  private isEnabled: boolean = true;
  private boundHandleKeyDown: (event: KeyboardEvent) => void;

  constructor() {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.registerDefaultShortcuts();
  }

  /**
   * Initialize the keyboard navigation system
   */
  public init(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.boundHandleKeyDown, true);
    }
  }

  /**
   * Cleanup and remove event listeners
   */
  public destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.boundHandleKeyDown, true);
    }
  }

  /**
   * Register a new keyboard shortcut
   */
  public registerShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.push(shortcut);
  }

  /**
   * Unregister a keyboard shortcut
   */
  public unregisterShortcut(key: string, context?: KeyboardContext): void {
    this.shortcuts = this.shortcuts.filter(
      s => !(s.key === key && (!context || s.context === context))
    );
  }

  /**
   * Set the current keyboard context
   */
  public setContext(context: KeyboardContext): void {
    this.currentContext = context;
    if (!this.contextStack.includes(context)) {
      this.contextStack.push(context);
    }
  }

  /**
   * Push a new context onto the stack
   */
  public pushContext(context: KeyboardContext): void {
    this.contextStack.push(context);
    this.currentContext = context;
  }

  /**
   * Pop the current context from the stack
   */
  public popContext(): void {
    if (this.contextStack.length > 1) {
      this.contextStack.pop();
      this.currentContext = this.contextStack[this.contextStack.length - 1];
    }
  }

  /**
   * Get the current context
   */
  public getContext(): KeyboardContext {
    return this.currentContext;
  }

  /**
   * Enable or disable keyboard navigation
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Main keyboard event handler
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    // Don't handle shortcuts when typing in inputs (unless explicitly allowed)
    const target = event.target as HTMLElement;
    const isInputElement = target.tagName === 'INPUT' ||
                          target.tagName === 'TEXTAREA' ||
                          target.isContentEditable;

    // Find matching shortcuts
    const matchingShortcuts = this.shortcuts.filter(shortcut => {
      // Check key match
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      if (!keyMatch) return false;

      // Check modifiers
      if (shortcut.ctrlKey !== undefined && shortcut.ctrlKey !== event.ctrlKey) return false;
      if (shortcut.shiftKey !== undefined && shortcut.shiftKey !== event.shiftKey) return false;
      if (shortcut.altKey !== undefined && shortcut.altKey !== event.altKey) return false;
      if (shortcut.metaKey !== undefined && shortcut.metaKey !== event.metaKey) return false;

      // Check context
      if (shortcut.context && shortcut.context !== 'global') {
        return this.contextStack.includes(shortcut.context);
      }

      return true;
    });

    // Execute matching shortcuts (most specific context first)
    if (matchingShortcuts.length > 0) {
      // Sort by context specificity
      matchingShortcuts.sort((a, b) => {
        const aIndex = a.context ? this.contextStack.indexOf(a.context) : -1;
        const bIndex = b.context ? this.contextStack.indexOf(b.context) : -1;
        return bIndex - aIndex;
      });

      const shortcut = matchingShortcuts[0];

      // Allow Ctrl+K even in input fields
      if (shortcut.key === 'k' && event.ctrlKey) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action(event);
        return;
      }

      // Skip if typing in input (unless it's a modal/dropdown escape)
      if (isInputElement && event.key !== 'Escape') {
        return;
      }

      if (shortcut.preventDefault !== false) {
        event.preventDefault();
      }
      shortcut.action(event);
    }
  }

  /**
   * Register default application shortcuts
   */
  private registerDefaultShortcuts(): void {
    // Global: Ctrl+K to focus search
    this.registerShortcut({
      key: 'k',
      ctrlKey: true,
      context: 'global',
      description: 'Focus search',
      action: () => {
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[placeholder*="Search"], input[placeholder*="Căutare"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });

    // Global: Escape to close modals/dropdowns
    this.registerShortcut({
      key: 'Escape',
      context: 'global',
      description: 'Close modal/dropdown',
      action: () => {
        // Trigger close on modal backdrop or dropdown
        const modal = document.querySelector('[role="dialog"]');
        const dropdown = document.querySelector('[role="menu"][data-state="open"]');

        if (modal) {
          const closeButton = modal.querySelector<HTMLButtonElement>('[aria-label*="Close"], button[aria-label*="Închide"]');
          if (closeButton) {
            closeButton.click();
          }
        } else if (dropdown) {
          // Close dropdown by clicking outside or triggering blur
          const trigger = document.querySelector('[aria-expanded="true"]') as HTMLElement;
          if (trigger) {
            trigger.click();
          }
        }
      }
    });

    // Table context: Arrow navigation
    this.registerShortcut({
      key: 'ArrowDown',
      context: 'table',
      description: 'Navigate to next row',
      action: (event) => {
        this.navigateTable(event, 'down');
      }
    });

    this.registerShortcut({
      key: 'ArrowUp',
      context: 'table',
      description: 'Navigate to previous row',
      action: (event) => {
        this.navigateTable(event, 'up');
      }
    });

    this.registerShortcut({
      key: 'Enter',
      context: 'table',
      description: 'Select/open row',
      action: (event) => {
        const focusedRow = document.querySelector<HTMLElement>('[data-table-row]:focus, tr:focus');
        if (focusedRow) {
          focusedRow.click();
        }
      }
    });

    // Form context: Ctrl+Enter to submit
    this.registerShortcut({
      key: 'Enter',
      ctrlKey: true,
      context: 'form',
      description: 'Submit form',
      action: () => {
        const form = document.querySelector<HTMLFormElement>('form');
        const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
        if (submitButton && !submitButton.disabled) {
          submitButton.click();
        }
      }
    });

    // Dashboard context: Number keys for quick navigation
    for (let i = 1; i <= 9; i++) {
      this.registerShortcut({
        key: i.toString(),
        altKey: true,
        context: 'dashboard',
        description: `Navigate to section ${i}`,
        action: () => {
          const sections = document.querySelectorAll<HTMLElement>('[data-nav-section]');
          if (sections[i - 1]) {
            sections[i - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
            sections[i - 1].focus();
          }
        }
      });
    }

    // Global: ? to show keyboard shortcuts help
    this.registerShortcut({
      key: '?',
      shiftKey: true,
      context: 'global',
      description: 'Show keyboard shortcuts',
      action: () => {
        this.showShortcutsHelp();
      }
    });
  }

  /**
   * Navigate within a table using arrow keys
   */
  private navigateTable(event: KeyboardEvent, direction: 'up' | 'down'): void {
    const target = event.target as HTMLElement;
    const currentRow = target.closest<HTMLElement>('[data-table-row], tr');

    if (!currentRow) return;

    const table = currentRow.closest('table, [role="table"]');
    if (!table) return;

    const rows = Array.from(table.querySelectorAll<HTMLElement>('[data-table-row], tbody tr'));
    const currentIndex = rows.indexOf(currentRow);

    if (currentIndex === -1) return;

    const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < rows.length) {
      const nextRow = rows[nextIndex];

      // Make row focusable if not already
      if (!nextRow.hasAttribute('tabindex')) {
        nextRow.setAttribute('tabindex', '0');
      }

      nextRow.focus();

      // Ensure row is visible
      nextRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Show keyboard shortcuts help dialog
   */
  private showShortcutsHelp(): void {
    // Group shortcuts by context
    const shortcutsByContext: Record<string, KeyboardShortcut[]> = {};

    this.shortcuts.forEach(shortcut => {
      const context = shortcut.context || 'global';
      if (!shortcutsByContext[context]) {
        shortcutsByContext[context] = [];
      }
      if (shortcut.description) {
        shortcutsByContext[context].push(shortcut);
      }
    });

    // Build help text
    let helpText = '⌨️ Keyboard Shortcuts\n\n';

    Object.entries(shortcutsByContext).forEach(([context, shortcuts]) => {
      helpText += `${context.toUpperCase()}:\n`;
      shortcuts.forEach(shortcut => {
        const keys = [];
        if (shortcut.ctrlKey) keys.push('Ctrl');
        if (shortcut.shiftKey) keys.push('Shift');
        if (shortcut.altKey) keys.push('Alt');
        if (shortcut.metaKey) keys.push('Meta');
        keys.push(shortcut.key.toUpperCase());

        helpText += `  ${keys.join('+')} - ${shortcut.description}\n`;
      });
      helpText += '\n';
    });

    console.log(helpText);

    // Could also show in a modal/toast if UI component available
    if (typeof window !== 'undefined' && window.alert) {
      alert(helpText);
    }
  }

  /**
   * Get all registered shortcuts
   */
  public getShortcuts(): KeyboardShortcut[] {
    return [...this.shortcuts];
  }

  /**
   * Clear all custom shortcuts (keeps defaults)
   */
  public clearCustomShortcuts(): void {
    this.shortcuts = [];
    this.registerDefaultShortcuts();
  }
}

// Singleton instance
let keyboardNavigationManager: KeyboardNavigationManager | null = null;

/**
 * Get or create the singleton KeyboardNavigationManager instance
 */
export function getKeyboardNavigationManager(): KeyboardNavigationManager {
  if (typeof window === 'undefined') {
    // Return a dummy instance for SSR
    return new KeyboardNavigationManager();
  }

  if (!keyboardNavigationManager) {
    keyboardNavigationManager = new KeyboardNavigationManager();
  }

  return keyboardNavigationManager;
}

/**
 * Helper function for React components to register shortcuts
 * Note: Use this inside useEffect in your components
 */
export function registerComponentShortcut(
  shortcut: KeyboardShortcut
): () => void {
  const manager = getKeyboardNavigationManager();
  manager.registerShortcut(shortcut);

  // Return cleanup function
  return () => {
    manager.unregisterShortcut(shortcut.key, shortcut.context);
  };
}

// For non-React usage
export default KeyboardNavigationManager;
