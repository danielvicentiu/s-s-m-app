'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export default function DropdownMenu({
  trigger,
  items,
  position = 'bottom-left',
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      const validItems = items.filter((item) => !item.divider && !item.disabled);
      const validIndices = items
        .map((item, index) => (!item.divider && !item.disabled ? index : -1))
        .filter((index) => index !== -1);

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => {
            const currentValidIndex = validIndices.indexOf(prev);
            const nextValidIndex =
              currentValidIndex < validIndices.length - 1
                ? validIndices[currentValidIndex + 1]
                : validIndices[0];
            return nextValidIndex;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => {
            const currentValidIndex = validIndices.indexOf(prev);
            const prevValidIndex =
              currentValidIndex > 0
                ? validIndices[currentValidIndex - 1]
                : validIndices[validIndices.length - 1];
            return prevValidIndex;
          });
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < items.length) {
            const item = items[focusedIndex];
            if (!item.divider && !item.disabled && item.onClick) {
              item.onClick();
              setIsOpen(false);
              setFocusedIndex(-1);
            }
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, focusedIndex, items]);

  const handleItemClick = (item: DropdownMenuItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      case 'bottom-left':
      default:
        return 'top-full left-0 mt-2';
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-50 ${getPositionClasses()} w-56 rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="menu"
        >
          <div className="py-1">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="my-1 h-px bg-gray-200"
                    role="separator"
                  />
                );
              }

              return (
                <button
                  key={`item-${index}`}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={`
                    flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm
                    ${
                      item.disabled
                        ? 'cursor-not-allowed text-gray-400'
                        : 'cursor-pointer text-gray-700 hover:bg-gray-50'
                    }
                    ${focusedIndex === index && !item.disabled ? 'bg-blue-50' : ''}
                    transition-colors duration-150
                  `}
                  role="menuitem"
                  tabIndex={item.disabled ? -1 : 0}
                >
                  {item.icon && (
                    <span className="flex-shrink-0 text-gray-500">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
