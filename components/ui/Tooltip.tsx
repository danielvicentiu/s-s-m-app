'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string | ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  delay?: number;
  children: ReactNode;
}

export default function Tooltip({
  content,
  position = 'auto',
  delay = 200,
  children,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(position);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 8; // Space between trigger and tooltip
    const arrowSize = 6;

    let finalPosition = position;
    let top = 0;
    let left = 0;

    // Auto-detect best position if 'auto'
    if (position === 'auto') {
      const spaceTop = triggerRect.top;
      const spaceBottom = window.innerHeight - triggerRect.bottom;
      const spaceLeft = triggerRect.left;
      const spaceRight = window.innerWidth - triggerRect.right;

      if (spaceTop > tooltipRect.height + gap) {
        finalPosition = 'top';
      } else if (spaceBottom > tooltipRect.height + gap) {
        finalPosition = 'bottom';
      } else if (spaceRight > tooltipRect.width + gap) {
        finalPosition = 'right';
      } else if (spaceLeft > tooltipRect.width + gap) {
        finalPosition = 'left';
      } else {
        finalPosition = 'top'; // Default fallback
      }
    }

    // Calculate coordinates based on position
    switch (finalPosition) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap - arrowSize;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap + arrowSize;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - gap - arrowSize;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + gap + arrowSize;
        break;
    }

    // Keep tooltip within viewport bounds
    const padding = 8;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top < padding) top = padding;
    if (top + tooltipRect.height > window.innerHeight - padding) {
      top = window.innerHeight - tooltipRect.height - padding;
    }

    setTooltipPosition(finalPosition);
    setCoords({ top, left });
  };

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition, true);
      window.addEventListener('resize', calculatePosition);

      return () => {
        window.removeEventListener('scroll', calculatePosition, true);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-0 h-0 border-solid';
    switch (tooltipPosition) {
      case 'top':
        return `${baseClasses} bottom-[-6px] left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900`;
      case 'bottom':
        return `${baseClasses} top-[-6px] left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-900`;
      case 'left':
        return `${baseClasses} right-[-6px] top-1/2 -translate-y-1/2 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-900`;
      case 'right':
        return `${baseClasses} left-[-6px] top-1/2 -translate-y-1/2 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-gray-900`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-[9999] pointer-events-none animate-in fade-in duration-200"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
          >
            <div className="relative bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-[250px] break-words">
              {content}
              <div className={getArrowClasses()} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
