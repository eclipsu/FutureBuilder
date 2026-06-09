import { getDataSource } from '@/lib/db/data-source'

export const revalidate = 60

interface LeaderboardEntry {
  id: number
  name: string
  room_id: number | null
  total_points: number
}

function CrownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M2 19l3-10 4.5 5L12 4l2.5 10L19 9l3 10H2z" />
    </svg>
  )
}

function getRankLabel(rank: number): string {
  if (rank === 1) return '1st'
  if (rank === 2) return '2nd'
  if (rank === 3) return '3rd'
  return `${rank}th`
}

export default async function LeaderboardPage() {
  const ds = await getDataSource()

  const results: LeaderboardEntry[] = await ds.query(`
    SELECT s.id, s.name, s.room_id, COALESCE(SUM(p.points), 0)::int AS total_points
    FROM students s
    LEFT JOIN points p ON p.student_id = s.id
    GROUP BY s.id, s.name, s.room_id
    ORDER BY total_points DESC
  `)

  const total = results.length

  return (
    <div style={{ padding: '16px 16px 48px', maxWidth: 640, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginBottom: 4,
        }}>
          Leaderboard
        </div>
        <div style={{
          fontSize: 22,
          fontWeight: 800,
          color: 'var(--color-text-primary)',
        }}>
          {total} camper{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Rankings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {results.map((entry, idx) => {
          const rank = idx + 1
          const isFirst = rank === 1
          const isTop3 = rank <= 3

          if (isFirst) {
            return (
              <div
                key={entry.id}
                style={{
                  backgroundColor: 'var(--color-gold-bg)',
                  border: '2px solid var(--color-gold)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 8,
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 40,
                  color: 'var(--color-gold)',
                }}>
                  <CrownIcon />
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    marginTop: 4,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    1ST
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                    {entry.name}
                  </div>
                  {entry.room_id && (
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 3 }}>
                      Room {entry.room_id}
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: entry.total_points >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {entry.total_points > 0 ? '+' : ''}{entry.total_points}
                </div>
              </div>
            )
          }

          if (isTop3) {
            const bgColor = rank === 2 ? '#F4F4F2' : '#FBF5F0'
            const borderColor = rank === 2 ? '#C0BDB5' : '#C8A882'

            return (
              <div
                key={entry.id}
                style={{
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 2,
                }}
              >
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: 'var(--color-text-muted)',
                  minWidth: 36,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {getRankLabel(rank).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {entry.name}
                  </div>
                  {entry.room_id && (
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      Room {entry.room_id}
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: entry.total_points >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {entry.total_points > 0 ? '+' : ''}{entry.total_points}
                </div>
              </div>
            )
          }

          // Rank 4+
          return (
            <div
              key={entry.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                minHeight: 44,
              }}
            >
              <div style={{
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'monospace',
                color: 'var(--color-text-muted)',
                minWidth: 36,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {rank}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {entry.name}
                </span>
                {entry.room_id && (
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 8 }}>
                    Rm {entry.room_id}
                  </span>
                )}
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: entry.total_points > 0
                  ? 'var(--color-positive)'
                  : entry.total_points < 0
                  ? 'var(--color-negative)'
                  : 'var(--color-text-muted)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {entry.total_points > 0 ? '+' : ''}{entry.total_points}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
