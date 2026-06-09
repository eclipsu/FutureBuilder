'use client'

import { useState, useCallback } from 'react'
import Toast from './Toast'

interface StudentData {
  id: number
  name: string
  totalPoints: number
}

interface PointsSheetProps {
  student: StudentData | null
  onClose: () => void
  onPointsAwarded: (studentId: number, delta: number) => void
}

const POSITIVE_VALS = [1, 2, 5]
const NEGATIVE_VALS = [-1, -2, -5]

export default function PointsSheet({ student, onClose, onPointsAwarded }: PointsSheetProps) {
  const [remaining, setRemaining] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [fetchedRemaining, setFetchedRemaining] = useState(false)

  const fetchRemaining = useCallback(async () => {
    if (fetchedRemaining || !student) return
    setFetchedRemaining(true)
    try {
      const res = await fetch('/api/points/remaining')
      const data = await res.json()
      setRemaining(data.remaining)
    } catch {
      setRemaining(3)
    }
  }, [student, fetchedRemaining])

  // Fetch remaining when sheet opens
  if (student && !fetchedRemaining) {
    fetchRemaining()
  }

  async function awardPoints(points: number) {
    if (!student || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: student.id, points }),
      })
      const data = await res.json()
      if (res.ok) {
        setRemaining(data.remaining)
        onPointsAwarded(student.id, points)
        setToast('Points updated')
        setTimeout(() => onClose(), 300)
      } else if (res.status === 403) {
        setRemaining(0)
      }
    } catch {
      setToast('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!student) return null

  const isLimitReached = remaining === 0
  const displayRemaining = remaining ?? 3

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 100,
        }}
      />

      {/* Sheet */}
      <div
        className="sheet-enter"
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          height: 320,
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px 16px 0 0',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 20px 32px',
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 36,
          height: 4,
          backgroundColor: 'var(--color-border)',
          borderRadius: 2,
          alignSelf: 'center',
          marginBottom: 16,
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {student.name}
            </div>
            <div style={{
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              marginTop: 2,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {student.totalPoints > 0 ? '+' : ''}{student.totalPoints} pts total
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F0EFE9',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Transaction limit */}
        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: isLimitReached ? '#92400E' : 'var(--color-text-muted)',
          backgroundColor: isLimitReached ? '#FEF3C7' : 'transparent',
          padding: isLimitReached ? '6px 10px' : '0',
          borderRadius: isLimitReached ? 'var(--radius-sm)' : 0,
          marginBottom: 14,
          flexShrink: 0,
        }}>
          {isLimitReached
            ? 'Daily limit reached — no more transactions today'
            : `${displayRemaining} of 3 transactions left today`}
        </div>

        {/* Point buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {/* Positive row */}
          <div style={{ display: 'flex', gap: 8 }}>
            {POSITIVE_VALS.map((val) => (
              <button
                key={val}
                disabled={isLimitReached || loading}
                onClick={() => awardPoints(val)}
                style={{
                  flex: 1,
                  height: 64,
                  fontSize: 18,
                  fontWeight: 700,
                  border: '1.5px solid var(--color-positive)',
                  backgroundColor: isLimitReached ? '#F5F4F0' : 'var(--color-positive-bg)',
                  color: isLimitReached ? 'var(--color-text-muted)' : 'var(--color-positive)',
                  borderRadius: 0,
                  cursor: isLimitReached ? 'not-allowed' : 'pointer',
                  opacity: isLimitReached ? 0.5 : 1,
                  transition: 'all 80ms ease',
                }}
                onMouseDown={(e) => {
                  if (!isLimitReached) {
                    const t = e.currentTarget
                    t.style.backgroundColor = 'var(--color-positive)'
                    t.style.color = '#FFFFFF'
                  }
                }}
                onMouseUp={(e) => {
                  if (!isLimitReached) {
                    const t = e.currentTarget
                    t.style.backgroundColor = 'var(--color-positive-bg)'
                    t.style.color = 'var(--color-positive)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLimitReached) {
                    const t = e.currentTarget
                    t.style.backgroundColor = 'var(--color-positive-bg)'
                    t.style.color = 'var(--color-positive)'
                  }
                }}
              >
                +{val}
              </button>
            ))}
          </div>

          {/* Negative row */}
          <div style={{ display: 'flex', gap: 8 }}>
            {NEGATIVE_VALS.map((val) => (
              <button
                key={val}
                disabled={isLimitReached || loading}
                onClick={() => awardPoints(val)}
                style={{
                  flex: 1,
                  height: 64,
                  fontSize: 18,
                  fontWeight: 700,
                  border: '1.5px solid var(--color-negative)',
                  backgroundColor: isLimitReached ? '#F5F4F0' : 'var(--color-negative-bg)',
                  color: isLimitReached ? 'var(--color-text-muted)' : 'var(--color-negative)',
                  borderRadius: 0,
                  cursor: isLimitReached ? 'not-allowed' : 'pointer',
                  opacity: isLimitReached ? 0.5 : 1,
                  transition: 'all 80ms ease',
                }}
                onMouseDown={(e) => {
                  if (!isLimitReached) {
                    const t = e.currentTarget
                    t.style.backgroundColor = 'var(--color-negative)'
                    t.style.color = '#FFFFFF'
                  }
                }}
                onMouseUp={(e) => {
                  if (!isLimitReached) {
                    const t = e.currentTarget
                    t.style.backgroundColor = 'var(--color-negative-bg)'
                    t.style.color = 'var(--color-negative)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLimitReached) {
                    const t = e.currentTarget
                    t.style.backgroundColor = 'var(--color-negative-bg)'
                    t.style.color = 'var(--color-negative)'
                  }
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast}
          onDone={() => setToast(null)}
        />
      )}
    </>
  )
}
