import type { Group } from '../../types'
import { teamNumber } from '../../utils'

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
            <div className="w-[3px] h-5 bg-navy/30" />
            <span className="font-heading text-ink text-xl font-semibold tracking-wide">
              Tim Bertanding
            </span>
          </div>
          <span className="text-sm font-body text-ink/70">
            {groups.length} tim
          </span>
        </div>

        {/* Team list */}
        <ul className="space-y-1.5">
          {groups.map((group, i) => (
            <li
              key={group.id}
              className="flex items-center justify-between py-2 px-3 hover:bg-surface-container transition-colors duration-150 rounded"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: group.color || '#0369A1' }}
                  aria-hidden="true"
                >
                  {teamNumber(group.id) ?? i + 1}
                </span>
                <span className="font-body text-base text-ink truncate">
                  {group.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-ink/70">
                  {group.correctCount}✓
                </span>
                <span className="font-body text-lg font-bold text-navy tabular-nums">
                  {group.score}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
