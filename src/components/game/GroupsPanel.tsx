import type { Group } from '../../types'

interface GroupsPanelProps {
  groups: Group[]
  className?: string
}

export function GroupsPanel({
  groups,
  className = '',
}: GroupsPanelProps) {
  return (
    <div
      className={[
        'relative overflow-hidden bg-white border border-muted-line rounded-lg shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/20 to-transparent" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-muted-line">
          <div className="flex items-center gap-2.5">
            <div className="w-[2px] h-4 bg-navy/30" />
            <span className="font-heading text-ink text-base font-medium tracking-wide">
              Tim Bertanding
            </span>
          </div>
          <span className="text-[10px] font-body text-ink/40 uppercase tracking-widest">
            {groups.length} Tim
          </span>
        </div>

        {/* Team list */}
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between py-2 px-3 border border-transparent hover:border-muted-line hover:bg-surface-container transition-all duration-150 group rounded"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-2.5 h-2.5 rotate-45 shrink-0 transition-transform duration-200 group-hover:rotate-[90deg]"
                  style={{ backgroundColor: group.color || '#D97706' }}
                />
                <span className="font-body text-xs text-ink/70 truncate group-hover:text-ink transition-colors">
                  {group.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-ink/30 font-mono">
                  {group.correctCount}✓
                </span>
                <span className="font-body text-xs font-bold text-navy tabular-nums">
                  {group.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
