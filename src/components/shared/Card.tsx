import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  dark?: boolean   // dark = bg-base, light = bg-panel
  bordered?: boolean
  padded?: boolean
}

export function Card({
  children,
  className = '',
  dark = false,
  bordered = true,
  padded = true,
}: CardProps) {
  return (
    <div
      className={[
        'rounded-xl transition-all duration-200',
        dark
          ? 'bg-bg-base text-paper-text'
          : 'bg-bg-panel text-ink',
        bordered ? 'border border-muted-line' : '',
        padded ? 'p-6' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
