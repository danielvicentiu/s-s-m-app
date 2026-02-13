import { useState, useEffect } from 'react';

interface KeyPressOptions {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

/**
 * Hook to detect keyboard shortcuts
 * @param targetKey - The key to listen for (e.g., 'k', 'Escape', 'Enter')
 * @param options - Optional modifier keys (ctrl, alt, shift, meta)
 * @returns boolean indicating if the key combination is currently pressed
 *
 * @example
 * // Simple key press
 * const escapePressed = useKeyPress('Escape');
 *
 * @example
 * // Key combination
 * const ctrlKPressed = useKeyPress('k', { ctrl: true });
 */
export function useKeyPress(
  targetKey: string,
  options: KeyPressOptions = {}
): boolean {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatches = event.key.toLowerCase() === targetKey.toLowerCase();
      const ctrlMatches = options.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const altMatches = options.alt ? event.altKey : !event.altKey;
      const shiftMatches = options.shift ? event.shiftKey : !event.shiftKey;
      const metaMatches = options.meta ? event.metaKey : true;

      if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
        setIsPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === targetKey.toLowerCase()) {
        setIsPressed(false);
      }
    };

    // Reset when window loses focus
    const handleBlur = () => {
      setIsPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [targetKey, options.ctrl, options.alt, options.shift, options.meta]);

  return isPressed;
}
