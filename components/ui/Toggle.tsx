'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    switch: 'h-5 w-9',
    circle: 'h-4 w-4',
    translate: 'translate-x-4',
    text: 'text-sm',
  },
  md: {
    switch: 'h-6 w-11',
    circle: 'h-5 w-5',
    translate: 'translate-x-5',
    text: 'text-base',
  },
  lg: {
    switch: 'h-7 w-14',
    circle: 'h-6 w-6',
    translate: 'translate-x-7',
    text: 'text-lg',
  },
};

export default function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: ToggleProps) {
  const sizes = sizeClasses[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const switchClasses = [
    'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    sizes.switch,
    checked
      ? disabled
        ? 'bg-blue-300 cursor-not-allowed'
        : 'bg-blue-600 cursor-pointer'
      : disabled
      ? 'bg-gray-300 cursor-not-allowed'
      : 'bg-gray-200 cursor-pointer hover:bg-gray-300',
  ].join(' ');

  const circleClasses = [
    'inline-block transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out',
    sizes.circle,
    checked ? sizes.translate : 'translate-x-0.5',
  ].join(' ');

  const labelClasses = [
    'select-none',
    sizes.text,
    disabled ? 'text-gray-400' : 'text-gray-700',
  ].join(' ');

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={switchClasses}
      >
        <span className={circleClasses} />
      </button>
      {label && <span className={labelClasses}>{label}</span>}
    </div>
  );
}
