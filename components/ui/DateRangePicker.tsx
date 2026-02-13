'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
}

type PresetKey = 'today' | 'last7days' | 'last30days' | 'last3months';

interface Preset {
  label: string;
  getValue: () => DateRange;
}

const PRESETS: Record<PresetKey, Preset> = {
  today: {
    label: 'Azi',
    getValue: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return { start: today, end: today };
    },
  },
  last7days: {
    label: 'Ultima săptămână',
    getValue: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    },
  },
  last30days: {
    label: 'Ultima lună',
    getValue: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    },
  },
  last3months: {
    label: 'Ultimele 3 luni',
    getValue: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    },
  },
};

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTHS = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
];

function formatDate(date: Date | null): string {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
}

interface CalendarProps {
  year: number;
  month: number;
  selectedRange: DateRange;
  onDateClick: (date: Date) => void;
  onMonthChange: (offset: number) => void;
  minDate?: Date;
  maxDate?: Date;
}

function Calendar({
  year,
  month,
  selectedRange,
  onDateClick,
  onMonthChange,
  minDate,
  maxDate,
}: CalendarProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days: (number | null)[] = [];

  // Add empty slots for days before the first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => onMonthChange(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Luna anterioară"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-base font-semibold text-gray-900">
          {MONTHS[month]} {year}
        </h3>
        <button
          type="button"
          onClick={() => onMonthChange(1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Luna următoare"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-9" />;
          }

          const date = new Date(year, month, day);
          const isStart = isSameDay(date, selectedRange.start);
          const isEnd = isSameDay(date, selectedRange.end);
          const inRange = isInRange(date, selectedRange.start, selectedRange.end);
          const isDisabled = isDateDisabled(date);
          const isToday = isSameDay(date, new Date());

          let className = 'h-9 flex items-center justify-center text-sm rounded-lg transition-colors ';

          if (isDisabled) {
            className += 'text-gray-300 cursor-not-allowed';
          } else if (isStart || isEnd) {
            className += 'bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700';
          } else if (inRange) {
            className += 'bg-blue-100 text-blue-900 cursor-pointer hover:bg-blue-200';
          } else if (isToday) {
            className += 'border-2 border-blue-600 text-gray-900 cursor-pointer hover:bg-gray-100';
          } else {
            className += 'text-gray-700 cursor-pointer hover:bg-gray-100';
          }

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => !isDisabled && onDateClick(date)}
              disabled={isDisabled}
              className={className}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState(() => {
    const date = value.start || new Date();
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  const rightMonth = useMemo(() => {
    const date = new Date(leftMonth.year, leftMonth.month + 1, 1);
    return { year: date.getFullYear(), month: date.getMonth() };
  }, [leftMonth]);

  const handleDateClick = (date: Date) => {
    if (!value.start || (value.start && value.end)) {
      // Start new selection
      onChange({ start: date, end: null });
    } else if (date < value.start) {
      // Clicked before start, make it the new start
      onChange({ start: date, end: value.start });
    } else {
      // Complete the range
      onChange({ start: value.start, end: date });
    }
  };

  const handleLeftMonthChange = (offset: number) => {
    const newDate = new Date(leftMonth.year, leftMonth.month + offset, 1);
    setLeftMonth({ year: newDate.getFullYear(), month: newDate.getMonth() });
  };

  const handleRightMonthChange = (offset: number) => {
    const newDate = new Date(leftMonth.year, leftMonth.month + offset, 1);
    setLeftMonth({ year: newDate.getFullYear(), month: newDate.getMonth() });
  };

  const handlePresetClick = (preset: Preset) => {
    onChange(preset.getValue());
  };

  const displayValue = useMemo(() => {
    if (value.start && value.end) {
      return `${formatDate(value.start)} - ${formatDate(value.end)}`;
    } else if (value.start) {
      return formatDate(value.start);
    }
    return 'Selectează interval';
  }, [value]);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
      >
        <CalendarIcon className="h-4 w-4 text-gray-500" />
        <span>{displayValue}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker */}
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex gap-6">
              {/* Presets */}
              <div className="flex flex-col gap-2 border-r border-gray-200 pr-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Rapidă
                </h4>
                {Object.values(PRESETS).map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Calendars */}
              <div className="flex gap-6">
                <Calendar
                  year={leftMonth.year}
                  month={leftMonth.month}
                  selectedRange={value}
                  onDateClick={handleDateClick}
                  onMonthChange={handleLeftMonthChange}
                  minDate={minDate}
                  maxDate={maxDate}
                />
                <Calendar
                  year={rightMonth.year}
                  month={rightMonth.month}
                  selectedRange={value}
                  onDateClick={handleDateClick}
                  onMonthChange={handleRightMonthChange}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
