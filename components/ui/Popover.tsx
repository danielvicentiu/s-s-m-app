'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type PopoverPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
type PopoverWidth = 'sm' | 'md' | 'lg' | 'xl' | 'auto';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: PopoverPosition;
  maxWidth?: PopoverWidth;
  showArrow?: boolean;
  offset?: number;
  className?: string;
}

const widthClasses: Record<PopoverWidth, string> = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
  xl: 'max-w-lg',
  auto: 'max-w-max',
};

export function Popover({
  trigger,
  children,
  position = 'auto',
  maxWidth = 'md',
  showArrow = true,
  offset = 8,
  className = '',
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [computedPosition, setComputedPosition] = useState<Exclude<PopoverPosition, 'auto'>>('bottom');
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Calculate popover position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let finalPosition = position === 'auto' ? 'bottom' : position;
    let top = 0;
    let left = 0;

    // Auto-detect best position if position is 'auto'
    if (position === 'auto') {
      const spaceBottom = viewport.height - triggerRect.bottom;
      const spaceTop = triggerRect.top;
      const spaceRight = viewport.width - triggerRect.right;
      const spaceLeft = triggerRect.left;

      // Determine which position has most space
      const spaces = [
        { position: 'bottom', space: spaceBottom },
        { position: 'top', space: spaceTop },
        { position: 'right', space: spaceRight },
        { position: 'left', space: spaceLeft },
      ];

      const bestSpace = spaces.sort((a, b) => b.space - a.space)[0];
      finalPosition = bestSpace.position as Exclude<PopoverPosition, 'auto'>;
    }

    // Calculate coordinates based on position
    switch (finalPosition) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + offset;
        break;
    }

    // Adjust if popover would go off-screen horizontally
    if (left < 8) {
      left = 8;
    } else if (left + popoverRect.width > viewport.width - 8) {
      left = viewport.width - popoverRect.width - 8;
    }

    // Adjust if popover would go off-screen vertically
    if (top < 8) {
      top = 8;
    } else if (top + popoverRect.height > viewport.height - 8) {
      top = viewport.height - popoverRect.height - 8;
    }

    setComputedPosition(finalPosition as Exclude<PopoverPosition, 'auto'>);
    setCoords({ top, left });
  }, [position, offset]);

  // Toggle popover
  const togglePopover = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Calculate position when popover opens or on scroll/resize
  useEffect(() => {
    if (isOpen) {
      calculatePosition();

      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, calculatePosition]);

  // Arrow position classes
  const getArrowClasses = () => {
    const baseClasses = 'absolute w-3 h-3 bg-white rotate-45 border';

    switch (computedPosition) {
      case 'top':
        return `${baseClasses} border-t-0 border-l-0 border-gray-200 bottom-[-6px] left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} border-b-0 border-r-0 border-gray-200 top-[-6px] left-1/2 -translate-x-1/2`;
      case 'left':
        return `${baseClasses} border-b-0 border-l-0 border-gray-200 right-[-6px] top-1/2 -translate-y-1/2`;
      case 'right':
        return `${baseClasses} border-t-0 border-r-0 border-gray-200 left-[-6px] top-1/2 -translate-y-1/2`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      {/* Trigger */}
      <div ref={triggerRef} onClick={togglePopover} className="inline-block cursor-pointer">
        {trigger}
      </div>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`fixed z-50 ${widthClasses[maxWidth]} ${className}`}
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
        >
          {/* Arrow */}
          {showArrow && <div className={getArrowClasses()} />}

          {/* Content */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
            {children}
          </div>
        </div>
      )}
    </>
  );
}
