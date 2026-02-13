'use client';

import { useEffect } from 'react';
import { getKeyboardNavigationManager } from '@/lib/utils/keyboard-navigation';

/**
 * KeyboardNavigationProvider
 *
 * Client component that initializes the global keyboard navigation system.
 * Should be included once in the root layout.
 */
export function KeyboardNavigationProvider() {
  useEffect(() => {
    const manager = getKeyboardNavigationManager();
    manager.init();

    // Cleanup on unmount
    return () => {
      manager.destroy();
    };
  }, []);

  // This component doesn't render anything
  return null;
}
