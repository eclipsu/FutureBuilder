interface StudentCardProps {
  id: number
  name: string
  totalPoints: number
  roomId?: number | null
  chaperone?: string
  showChaperone?: boolean
  onClick?: () => void
}

function getPointsBadgeStyle(points: number) {
  if (points > 0) {
    return {
      background: 'var(--color-positive-bg)',
      color: 'var(--color-positive)',
    }
  }
  if (points < 0) {
    return {
      background: 'var(--color-negative-bg)',
      color: 'var(--color-negative)',
    }
  }
  return {
    background: '#F0EFE9',
    color: 'var(--color-text-muted)',
  }
}

export default function StudentCard({
  name,
  totalPoints,
  roomId,
  chaperone,
  showChaperone = false,
  onClick,
}: StudentCardProps) {
  const badgeStyle = getPointsBadgeStyle(totalPoints)

  return (
    <button
      onClick={onClick}
      className="card-hover"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1.1',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        cursor: 'pointer',
        textAlign: 'center',
        minHeight: 44,
        gap: 4,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 6,
        right: 6,
        ...badgeStyle,
        borderRadius: 99,
        padding: '2px 7px',
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1.4,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {totalPoints > 0 ? '+' : ''}{totalPoints}
      </div>

      {roomId != null && (
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
        }}>
          Room {roomId}
        </span>
      )}

      <span style={{
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        lineHeight: 1.3,
        wordBreak: 'break-word',
      }}>
        {name}
      </span>

      {showChaperone && chaperone && (
        <span style={{
          fontSize: 10,
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          lineHeight: 1.2,
        }}>
          {chaperone}
        </span>
      )}
    </button>
  )
}
