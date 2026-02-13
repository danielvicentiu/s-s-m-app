import React from 'react';

// Card variant types
type CardVariant = 'default' | 'bordered' | 'elevated' | 'flat';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// Base Card Props
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
}

// CardHeader Props
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

// CardBody Props
interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  children: React.ReactNode;
}

// CardFooter Props
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  children: React.ReactNode;
}

// Variant styles mapping
const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-gray-200 shadow-sm',
  bordered: 'bg-white border-2 border-gray-300',
  elevated: 'bg-white border border-gray-100 shadow-lg',
  flat: 'bg-gray-50 border-0',
};

// Padding styles mapping
const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

/**
 * Card - Base card component with variants and customizable padding
 */
export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  const baseClasses = 'rounded-2xl transition-all';
  const variantClass = variantStyles[variant];
  const paddingClass = paddingStyles[padding];

  return (
    <div
      className={`${baseClasses} ${variantClass} ${paddingClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader - Card header with optional title and actions
 */
export function CardHeader({
  title,
  actions,
  className = '',
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${className}`.trim()}
      {...props}
    >
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        )}
        {children}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

/**
 * CardBody - Card body content area with customizable padding
 */
export function CardBody({
  padding,
  className = '',
  children,
  ...props
}: CardBodyProps) {
  const paddingClass = padding ? paddingStyles[padding] : '';

  return (
    <div
      className={`${paddingClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardFooter - Card footer area with customizable padding
 */
export function CardFooter({
  padding,
  className = '',
  children,
  ...props
}: CardFooterProps) {
  const paddingClass = padding ? paddingStyles[padding] : '';

  return (
    <div
      className={`flex items-center gap-3 ${paddingClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

// Export all components as named exports
export default Card;
