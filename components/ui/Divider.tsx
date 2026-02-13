import React from 'react';

interface DividerProps {
  /**
   * Orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Optional label to display in the middle of the divider
   */
  label?: string;

  /**
   * Style variant of the divider line
   * @default 'solid'
   */
  variant?: 'solid' | 'dashed' | 'dotted';

  /**
   * Color of the divider
   * @default 'gray'
   */
  color?: 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple';

  /**
   * Spacing around the divider (margin)
   * @default 'md'
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Additional CSS classes
   */
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  variant = 'solid',
  color = 'gray',
  spacing = 'md',
  className = '',
}) => {
  // Border style based on variant
  const borderStyles = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  // Color classes
  const colorClasses = {
    gray: 'border-gray-300',
    blue: 'border-blue-400',
    red: 'border-red-400',
    green: 'border-green-400',
    yellow: 'border-yellow-400',
    purple: 'border-purple-400',
  };

  // Spacing classes for horizontal
  const horizontalSpacing = {
    none: '',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
  };

  // Spacing classes for vertical
  const verticalSpacing = {
    none: '',
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-6',
    xl: 'mx-8',
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={`
          flex items-center
          ${verticalSpacing[spacing]}
          ${className}
        `.trim()}
      >
        <div
          className={`
            h-full border-l
            ${borderStyles[variant]}
            ${colorClasses[color]}
            ${label ? 'flex-1' : ''}
          `.trim()}
        />
        {label && (
          <>
            <span className="px-3 text-sm text-gray-600 whitespace-nowrap">
              {label}
            </span>
            <div
              className={`
                h-full border-l flex-1
                ${borderStyles[variant]}
                ${colorClasses[color]}
              `.trim()}
            />
          </>
        )}
      </div>
    );
  }

  // Horizontal divider
  if (label) {
    return (
      <div
        className={`
          flex items-center
          ${horizontalSpacing[spacing]}
          ${className}
        `.trim()}
      >
        <div
          className={`
            flex-1 border-t
            ${borderStyles[variant]}
            ${colorClasses[color]}
          `.trim()}
        />
        <span className="px-4 text-sm text-gray-600 whitespace-nowrap">
          {label}
        </span>
        <div
          className={`
            flex-1 border-t
            ${borderStyles[variant]}
            ${colorClasses[color]}
          `.trim()}
        />
      </div>
    );
  }

  return (
    <hr
      className={`
        border-t
        ${borderStyles[variant]}
        ${colorClasses[color]}
        ${horizontalSpacing[spacing]}
        ${className}
      `.trim()}
    />
  );
};

export default Divider;
