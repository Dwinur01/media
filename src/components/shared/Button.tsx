import React from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-navy text-white font-semibold hover:bg-navy-hover focus:ring-2 focus:ring-brass focus:ring-offset-2 h-[44px]',
  secondary:
    'bg-brass-soft text-brass-text border border-gold-soft hover:bg-[#FDE68A] h-[44px]',
  danger:
    'bg-wrong text-white border border-wrong hover:opacity-90 h-[44px]',
  ghost:
    'bg-white text-ink border border-[#CBD5E1] hover:bg-[#F1F5F9] h-[44px]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded',
  md: 'px-5 py-2.5 text-base rounded-md',
  lg: 'px-8 py-3.5 text-lg rounded-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={[
        'font-body transition-all duration-200 cursor-pointer select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
