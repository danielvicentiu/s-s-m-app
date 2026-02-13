'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  disabled?: boolean;
  marks?: boolean | number[];
  showTooltip?: boolean;
  className?: string;
  label?: string;
  formatValue?: (value: number) => string;
}

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  disabled = false,
  marks = false,
  showTooltip = true,
  className = '',
  label,
  formatValue = (val) => val.toString(),
}: SliderProps) {
  const isControlled = value !== undefined;
  const isDual = Array.isArray(value) || Array.isArray(defaultValue);

  const getInitialValue = () => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return isDual ? [min, max] : min;
  };

  const [internalValue, setInternalValue] = useState<number | [number, number]>(getInitialValue());
  const [activeHandle, setActiveHandle] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const currentValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (isControlled && value !== undefined) {
      setInternalValue(value);
    }
  }, [value, isControlled]);

  const handleValueChange = useCallback(
    (newValue: number | [number, number]) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  const getPercentage = useCallback(
    (val: number) => {
      return ((val - min) / (max - min)) * 100;
    },
    [min, max]
  );

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return min;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percentage * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    },
    [min, max, step]
  );

  const handleMouseDown = useCallback(
    (handle: 'min' | 'max' | 'single') => (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setActiveHandle(handle === 'single' ? 'min' : handle);
    },
    [disabled]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!activeHandle || disabled) return;

      const newValue = getValueFromPosition(e.clientX);

      if (isDual && Array.isArray(currentValue)) {
        const [minVal, maxVal] = currentValue;
        if (activeHandle === 'min') {
          handleValueChange([Math.min(newValue, maxVal), maxVal]);
        } else {
          handleValueChange([minVal, Math.max(newValue, minVal)]);
        }
      } else {
        handleValueChange(newValue);
      }
    },
    [activeHandle, disabled, currentValue, isDual, getValueFromPosition, handleValueChange]
  );

  const handleMouseUp = useCallback(() => {
    setActiveHandle(null);
  }, []);

  useEffect(() => {
    if (activeHandle) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [activeHandle, handleMouseMove, handleMouseUp]);

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || e.target !== e.currentTarget) return;

      const newValue = getValueFromPosition(e.clientX);

      if (isDual && Array.isArray(currentValue)) {
        const [minVal, maxVal] = currentValue;
        const distToMin = Math.abs(newValue - minVal);
        const distToMax = Math.abs(newValue - maxVal);

        if (distToMin < distToMax) {
          handleValueChange([newValue, maxVal]);
        } else {
          handleValueChange([minVal, newValue]);
        }
      } else {
        handleValueChange(newValue);
      }
    },
    [disabled, isDual, currentValue, getValueFromPosition, handleValueChange]
  );

  const renderMarks = () => {
    if (!marks) return null;

    const markValues = Array.isArray(marks)
      ? marks
      : Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step);

    return (
      <div className="absolute w-full top-1/2 -translate-y-1/2 pointer-events-none">
        {markValues.map((mark) => (
          <div
            key={mark}
            className="absolute w-1 h-1 bg-gray-300 rounded-full -translate-x-1/2"
            style={{ left: `${getPercentage(mark)}%` }}
          />
        ))}
      </div>
    );
  };

  const renderHandle = (val: number, handleType: 'min' | 'max' | 'single') => {
    const isActive = activeHandle === handleType || (activeHandle === 'min' && handleType === 'single');
    const percentage = getPercentage(val);

    return (
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
        style={{ left: `${percentage}%` }}
        onMouseDown={handleMouseDown(handleType)}
      >
        <div
          className={`
            w-5 h-5 rounded-full border-2 transition-all cursor-grab active:cursor-grabbing
            ${
              disabled
                ? 'bg-gray-300 border-gray-400 cursor-not-allowed'
                : isActive
                ? 'bg-blue-600 border-blue-600 scale-110 shadow-lg'
                : 'bg-white border-blue-600 hover:scale-110 shadow-md'
            }
          `}
        />
        {showTooltip && (isActive || activeHandle === null) && (
          <div
            className={`
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
              bg-gray-900 text-white text-xs rounded whitespace-nowrap
              transition-opacity
              ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `}
          >
            {formatValue(val)}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>
    );
  };

  const minVal = isDual && Array.isArray(currentValue) ? currentValue[0] : (currentValue as number);
  const maxVal = isDual && Array.isArray(currentValue) ? currentValue[1] : (currentValue as number);

  const leftPercentage = getPercentage(minVal);
  const rightPercentage = isDual ? getPercentage(maxVal) : 100;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="group relative pt-6 pb-2">
        <div
          ref={sliderRef}
          className="relative h-2 cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Background track */}
          <div className="absolute w-full h-2 bg-gray-200 rounded-full" />

          {/* Active track */}
          <div
            className={`absolute h-2 rounded-full ${
              disabled ? 'bg-gray-400' : 'bg-blue-600'
            }`}
            style={{
              left: `${isDual ? leftPercentage : 0}%`,
              width: `${isDual ? rightPercentage - leftPercentage : leftPercentage}%`,
            }}
          />

          {/* Marks */}
          {renderMarks()}

          {/* Handles */}
          {isDual && Array.isArray(currentValue) ? (
            <>
              {renderHandle(currentValue[0], 'min')}
              {renderHandle(currentValue[1], 'max')}
            </>
          ) : (
            renderHandle(minVal, 'single')
          )}
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
}
