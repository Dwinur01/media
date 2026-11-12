
interface ProgressBarProps {
  value: number    // 0-100
  color?: 'gold' | 'right' | 'wrong'
  className?: string
  showLabel?: boolean
}

const colorMap = {
  gold:  'bg-gold',
  right: 'bg-right',
  wrong: 'bg-wrong',
}

export function ProgressBar({
  value,
  color = 'gold',
  className = '',
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={['w-full', className].join(' ')}>
      <div className="w-full h-2 bg-muted-line rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-paper-text/70 mt-1 text-right font-body">
          {clamped.toFixed(0)}%
        </p>
      )}
    </div>
  )
}
