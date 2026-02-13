import { ReactNode } from 'react'

// Utility function pentru merge className
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// ========== HEADING ==========

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold'

interface HeadingProps {
  level?: HeadingLevel
  size?: HeadingSize
  weight?: HeadingWeight
  children: ReactNode
  className?: string
}

const headingSizeClasses: Record<HeadingSize, string> = {
  xs: 'text-base',
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl',
  '3xl': 'text-5xl',
}

const headingWeightClasses: Record<HeadingWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const defaultHeadingConfig: Record<HeadingLevel, { size: HeadingSize; weight: HeadingWeight }> = {
  h1: { size: '3xl', weight: 'bold' },
  h2: { size: '2xl', weight: 'bold' },
  h3: { size: 'xl', weight: 'semibold' },
  h4: { size: 'lg', weight: 'semibold' },
  h5: { size: 'md', weight: 'medium' },
  h6: { size: 'sm', weight: 'medium' },
}

export function Heading({
  level = 'h2',
  size,
  weight,
  children,
  className
}: HeadingProps) {
  const Tag = level
  const config = defaultHeadingConfig[level]
  const finalSize = size || config.size
  const finalWeight = weight || config.weight

  const classes = cn(
    headingSizeClasses[finalSize],
    headingWeightClasses[finalWeight],
    'text-gray-900',
    className
  )

  return <Tag className={classes}>{children}</Tag>
}

// ========== TEXT ==========

type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type TextColor = 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'danger' | 'accent'

interface TextProps {
  size?: TextSize
  color?: TextColor
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  children: ReactNode
  className?: string
  as?: 'p' | 'span' | 'div'
}

const textSizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

const textColorClasses: Record<TextColor, string> = {
  primary: 'text-gray-900',
  secondary: 'text-gray-700',
  muted: 'text-gray-500',
  success: 'text-green-700',
  warning: 'text-orange-700',
  danger: 'text-red-700',
  accent: 'text-blue-600',
}

const textWeightClasses: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

export function Text({
  size = 'md',
  color = 'primary',
  weight = 'normal',
  children,
  className,
  as = 'p'
}: TextProps) {
  const Tag = as

  const classes = cn(
    textSizeClasses[size],
    textColorClasses[color],
    textWeightClasses[weight],
    className
  )

  return <Tag className={classes}>{children}</Tag>
}

// ========== LABEL ==========

interface LabelProps {
  htmlFor?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function Label({ htmlFor, required, children, className }: LabelProps) {
  const classes = cn(
    'block text-sm font-medium text-gray-700 mb-1',
    className
  )

  return (
    <label htmlFor={htmlFor} className={classes}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

// ========== CAPTION ==========

interface CaptionProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'error' | 'success' | 'muted'
}

const captionVariantClasses: Record<string, string> = {
  default: 'text-gray-600',
  error: 'text-red-600',
  success: 'text-green-600',
  muted: 'text-gray-500',
}

export function Caption({ children, className, variant = 'default' }: CaptionProps) {
  const classes = cn(
    'text-xs',
    captionVariantClasses[variant],
    className
  )

  return <span className={classes}>{children}</span>
}

// ========== CODE ==========

interface CodeProps {
  children: ReactNode
  className?: string
  block?: boolean
}

export function Code({ children, className, block = false }: CodeProps) {
  if (block) {
    return (
      <pre className={cn(
        'bg-gray-50 border border-gray-200 rounded-2xl p-4 overflow-x-auto',
        'text-sm font-mono text-gray-800',
        className
      )}>
        <code>{children}</code>
      </pre>
    )
  }

  return (
    <code className={cn(
      'bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono',
      className
    )}>
      {children}
    </code>
  )
}
