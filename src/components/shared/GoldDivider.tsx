
interface GoldDividerProps {
  className?: string
  label?: string
}

export function GoldDivider({ className = '', label }: GoldDividerProps) {
  if (label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-gold/70" />
        <span className="text-gold/70 text-xs font-body uppercase tracking-widest whitespace-nowrap">
          {label}
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/40 to-gold/70" />
      </div>
    )
  }
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent ${className}`}
    />
  )
}
