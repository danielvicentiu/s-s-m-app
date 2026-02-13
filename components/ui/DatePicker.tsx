'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
}

const DAYS_IN_WEEK = 7;
const MONTHS_IN_YEAR = 12;

export default function DatePicker({
  value,
  onChange,
  locale = 'ro-RO',
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Selectează data',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return '';

    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  };

  const getMonthName = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
    } catch {
      return date.toLocaleString('default', { month: 'long' });
    }
  };

  const getDayNames = (): string[] => {
    const days: string[] = [];
    const baseDate = new Date(2024, 0, 1); // Monday, January 1, 2024

    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);

      try {
        days.push(
          new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)
        );
      } catch {
        days.push(date.toLocaleDateString('default', { weekday: 'short' }));
      }
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };

  const isSelected = (date: Date): boolean => {
    return value ? isSameDay(date, value) : false;
  };

  const isDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const getMonthDays = (year: number, month: number): (Date | null)[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay();
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handlePrevYear = () => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() - 1);
      return newDate;
    });
  };

  const handleNextYear = () => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    if (!isDisabled(date)) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const handleToday = () => {
    const today = new Date();
    if (!isDisabled(today)) {
      onChange(today);
      setViewDate(today);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  const days = getMonthDays(viewDate.getFullYear(), viewDate.getMonth());
  const dayNames = getDayNames();

  return (
    <div ref={containerRef} className="relative">
      {/* Input Field */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2 text-left border rounded-lg
          flex items-center justify-between
          transition-colors
          ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
        `}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {formatDate(value) || placeholder}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </button>

      {/* Calendar Popup */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 w-80">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevYear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Anul anterior"
            >
              <ChevronLeft className="w-4 h-4" />
              <ChevronLeft className="w-4 h-4 -ml-3" />
            </button>

            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Luna anterioară"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 text-center font-semibold text-gray-900">
              {getMonthName(viewDate)} {viewDate.getFullYear()}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Luna următoare"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNextYear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Anul următor"
            >
              <ChevronRight className="w-4 h-4" />
              <ChevronRight className="w-4 h-4 -ml-3" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, index) => (
              <div
                key={index}
                className="text-center text-xs font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const disabled = isDisabled(date);
              const selected = isSelected(date);
              const today = isToday(date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateClick(date)}
                  disabled={disabled}
                  className={`
                    aspect-square rounded-lg text-sm font-medium
                    transition-colors
                    ${
                      disabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-gray-100 cursor-pointer'
                    }
                    ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                    ${today && !selected ? 'border-2 border-blue-400 text-blue-600' : ''}
                    ${!selected && !today && !disabled ? 'text-gray-700' : ''}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              Astăzi
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Șterge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
