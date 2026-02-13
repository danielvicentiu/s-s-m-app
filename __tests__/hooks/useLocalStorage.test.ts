import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/lib/utils/useLocalStorage';

describe('useLocalStorage', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial value handling', () => {
    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial-value')
      );

      expect(result.current[0]).toBe('initial-value');
    });

    it('should return initial value for objects when localStorage is empty', () => {
      const initialObject = { name: 'test', count: 0 };
      const { result } = renderHook(() =>
        useLocalStorage('test-object', initialObject)
      );

      expect(result.current[0]).toEqual(initialObject);
    });

    it('should return initial value for arrays when localStorage is empty', () => {
      const initialArray = [1, 2, 3];
      const { result } = renderHook(() =>
        useLocalStorage('test-array', initialArray)
      );

      expect(result.current[0]).toEqual(initialArray);
    });

    it('should return initial value for booleans when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-boolean', true)
      );

      expect(result.current[0]).toBe(true);
    });
  });

  describe('Writing to localStorage', () => {
    it('should write value to localStorage when setValue is called', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        result.current[1]('updated-value');
      });

      expect(localStorage.getItem('test-key')).toBe(
        JSON.stringify('updated-value')
      );
      expect(result.current[0]).toBe('updated-value');
    });

    it('should write object to localStorage when setValue is called', () => {
      const initialObject = { name: 'test', count: 0 };
      const updatedObject = { name: 'updated', count: 5 };

      const { result } = renderHook(() =>
        useLocalStorage('test-object', initialObject)
      );

      act(() => {
        result.current[1](updatedObject);
      });

      expect(localStorage.getItem('test-object')).toBe(
        JSON.stringify(updatedObject)
      );
      expect(result.current[0]).toEqual(updatedObject);
    });

    it('should write array to localStorage when setValue is called', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-array', [1, 2, 3])
      );

      act(() => {
        result.current[1]([4, 5, 6]);
      });

      expect(localStorage.getItem('test-array')).toBe(
        JSON.stringify([4, 5, 6])
      );
      expect(result.current[0]).toEqual([4, 5, 6]);
    });

    it('should support functional updates like useState', () => {
      const { result } = renderHook(() => useLocalStorage('test-count', 0));

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);
      expect(localStorage.getItem('test-count')).toBe(JSON.stringify(1));

      act(() => {
        result.current[1]((prev) => prev + 2);
      });

      expect(result.current[0]).toBe(3);
      expect(localStorage.getItem('test-count')).toBe(JSON.stringify(3));
    });
  });

  describe('Reading existing localStorage values', () => {
    it('should read existing string value from localStorage on mount', () => {
      localStorage.setItem('existing-key', JSON.stringify('existing-value'));

      const { result } = renderHook(() =>
        useLocalStorage('existing-key', 'initial')
      );

      expect(result.current[0]).toBe('existing-value');
    });

    it('should read existing object value from localStorage on mount', () => {
      const existingObject = { name: 'existing', count: 10 };
      localStorage.setItem('existing-object', JSON.stringify(existingObject));

      const { result } = renderHook(() =>
        useLocalStorage('existing-object', { name: 'initial', count: 0 })
      );

      expect(result.current[0]).toEqual(existingObject);
    });

    it('should read existing array value from localStorage on mount', () => {
      const existingArray = [7, 8, 9];
      localStorage.setItem('existing-array', JSON.stringify(existingArray));

      const { result } = renderHook(() =>
        useLocalStorage('existing-array', [1, 2, 3])
      );

      expect(result.current[0]).toEqual(existingArray);
    });

    it('should read existing boolean value from localStorage on mount', () => {
      localStorage.setItem('existing-boolean', JSON.stringify(false));

      const { result } = renderHook(() =>
        useLocalStorage('existing-boolean', true)
      );

      expect(result.current[0]).toBe(false);
    });

    it('should read existing number value from localStorage on mount', () => {
      localStorage.setItem('existing-number', JSON.stringify(42));

      const { result } = renderHook(() =>
        useLocalStorage('existing-number', 0)
      );

      expect(result.current[0]).toBe(42);
    });
  });

  describe('Corrupt JSON handling', () => {
    it('should return initial value when localStorage contains corrupt JSON', () => {
      // Set invalid JSON directly
      localStorage.setItem('corrupt-key', '{invalid json}');

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage('corrupt-key', 'fallback-value')
      );

      expect(result.current[0]).toBe('fallback-value');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error reading localStorage key "corrupt-key":',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should return initial value when localStorage contains malformed data', () => {
      localStorage.setItem('malformed-key', 'not-json-at-all');

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage('malformed-key', { valid: 'object' })
      );

      expect(result.current[0]).toEqual({ valid: 'object' });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should log error to console when encountering corrupt JSON', () => {
      localStorage.setItem('corrupt-key', '{bad: json}');

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      renderHook(() => useLocalStorage('corrupt-key', 'default'));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error reading localStorage key'),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('SSR and window undefined handling', () => {
    it('should return initial value when window is undefined (SSR)', () => {
      // Mock window as undefined
      const originalWindow = global.window;
      // @ts-ignore - deliberately setting to undefined for SSR test
      delete global.window;

      const { result } = renderHook(() =>
        useLocalStorage('ssr-key', 'ssr-initial')
      );

      expect(result.current[0]).toBe('ssr-initial');

      // Restore window
      global.window = originalWindow;
    });

    it('should not throw error when setting value in SSR environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const { result } = renderHook(() =>
        useLocalStorage('ssr-key', 'initial')
      );

      expect(() => {
        act(() => {
          result.current[1]('updated');
        });
      }).not.toThrow();

      expect(result.current[0]).toBe('updated');

      global.window = originalWindow;
    });

    it('should handle transition from SSR to client-side gracefully', () => {
      // Start with window undefined
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const { result, rerender } = renderHook(() =>
        useLocalStorage('transition-key', 'initial')
      );

      expect(result.current[0]).toBe('initial');

      // Restore window (simulating hydration)
      global.window = originalWindow;

      // Rerender should still work
      rerender();

      act(() => {
        result.current[1]('client-value');
      });

      expect(result.current[0]).toBe('client-value');
      expect(localStorage.getItem('transition-key')).toBe(
        JSON.stringify('client-value')
      );
    });
  });

  describe('Updates across components', () => {
    it('should allow multiple hooks with the same key to coexist', () => {
      const { result: result1 } = renderHook(() =>
        useLocalStorage('shared-key', 'initial')
      );
      const { result: result2 } = renderHook(() =>
        useLocalStorage('shared-key', 'initial')
      );

      // Both should read the same initial value
      expect(result1.current[0]).toBe('initial');
      expect(result2.current[0]).toBe('initial');

      // Update from first hook
      act(() => {
        result1.current[1]('updated-from-hook1');
      });

      expect(result1.current[0]).toBe('updated-from-hook1');
      expect(localStorage.getItem('shared-key')).toBe(
        JSON.stringify('updated-from-hook1')
      );

      // Note: result2 won't auto-update as localStorage doesn't trigger
      // re-renders across hooks. This is expected behavior.
      // To sync across tabs/components, you'd need to listen to storage events.
    });

    it('should persist data when hook unmounts and remounts', () => {
      const { result, unmount } = renderHook(() =>
        useLocalStorage('persist-key', 'initial')
      );

      act(() => {
        result.current[1]('persisted-value');
      });

      expect(localStorage.getItem('persist-key')).toBe(
        JSON.stringify('persisted-value')
      );

      // Unmount the hook
      unmount();

      // Remount the hook
      const { result: newResult } = renderHook(() =>
        useLocalStorage('persist-key', 'initial')
      );

      // Should read the persisted value
      expect(newResult.current[0]).toBe('persisted-value');
    });

    it('should handle different keys independently', () => {
      const { result: result1 } = renderHook(() =>
        useLocalStorage('key1', 'value1')
      );
      const { result: result2 } = renderHook(() =>
        useLocalStorage('key2', 'value2')
      );

      expect(result1.current[0]).toBe('value1');
      expect(result2.current[0]).toBe('value2');

      act(() => {
        result1.current[1]('updated1');
      });

      expect(result1.current[0]).toBe('updated1');
      expect(result2.current[0]).toBe('value2'); // Should not change

      act(() => {
        result2.current[1]('updated2');
      });

      expect(result1.current[0]).toBe('updated1'); // Should not change
      expect(result2.current[0]).toBe('updated2');
    });
  });

  describe('Edge cases', () => {
    it('should handle null as initial value', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string | null>('null-key', null)
      );

      expect(result.current[0]).toBeNull();

      act(() => {
        result.current[1]('not-null');
      });

      expect(result.current[0]).toBe('not-null');
      expect(localStorage.getItem('null-key')).toBe(
        JSON.stringify('not-null')
      );
    });

    it('should handle undefined as stored value', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string | undefined>('undefined-key', undefined)
      );

      expect(result.current[0]).toBeUndefined();

      act(() => {
        result.current[1]('defined');
      });

      expect(result.current[0]).toBe('defined');
    });

    it('should handle empty string as value', () => {
      const { result } = renderHook(() => useLocalStorage('empty-key', ''));

      expect(result.current[0]).toBe('');

      act(() => {
        result.current[1]('not-empty');
      });

      expect(result.current[0]).toBe('not-empty');
    });

    it('should handle zero as value', () => {
      const { result } = renderHook(() => useLocalStorage('zero-key', 0));

      expect(result.current[0]).toBe(0);

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });

    it('should handle complex nested objects', () => {
      const complexObject = {
        user: {
          name: 'John',
          settings: {
            theme: 'dark',
            notifications: {
              email: true,
              push: false,
            },
          },
        },
        items: [{ id: 1 }, { id: 2 }],
      };

      const { result } = renderHook(() =>
        useLocalStorage('complex-key', complexObject)
      );

      expect(result.current[0]).toEqual(complexObject);

      const updatedObject = {
        ...complexObject,
        user: {
          ...complexObject.user,
          settings: {
            ...complexObject.user.settings,
            theme: 'light',
          },
        },
      };

      act(() => {
        result.current[1](updatedObject);
      });

      expect(result.current[0]).toEqual(updatedObject);
      expect(localStorage.getItem('complex-key')).toBe(
        JSON.stringify(updatedObject)
      );
    });
  });
});
