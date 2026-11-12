
type BadgeColor = 'gold' | 'right' | 'wrong' | 'muted'

interface BadgeProps {
  label: string
  color?: BadgeColor
  className?: string
}

const colorMap: Record<BadgeColor, string> = {
  gold:  'bg-gold/20 text-gold border-gold/40',
  right: 'bg-right/20 text-right border-right/40',
  wrong: 'bg-wrong/20 text-wrong border-wrong/40',
  muted: 'bg-muted-line/20 text-paper-text/70 border-muted-line/40',
}

export function Badge({ label, color = 'muted', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-block text-xs font-body font-medium px-2 py-0.5 rounded border',
        colorMap[color],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  )
}
