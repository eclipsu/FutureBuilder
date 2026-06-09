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

  function makeButtonHandlers(colorKey: 'positive' | 'negative', isDisabled: boolean) {
    const setStyle = (el: HTMLButtonElement, pressed: boolean) => {
      el.style.backgroundColor = pressed
        ? `var(--color-${colorKey})`
        : isDisabled ? '#F5F4F0' : `var(--color-${colorKey}-bg)`
      el.style.color = pressed
        ? '#FFFFFF'
        : isDisabled ? 'var(--color-text-muted)' : `var(--color-${colorKey})`
    }
    const get = (e: { currentTarget: HTMLButtonElement }) => e.currentTarget
    return {
      onMouseDown:   (e: React.MouseEvent<HTMLButtonElement>)  => { if (!isDisabled) setStyle(get(e), true) },
      onMouseUp:     (e: React.MouseEvent<HTMLButtonElement>)  => { if (!isDisabled) setStyle(get(e), false) },
      onMouseLeave:  (e: React.MouseEvent<HTMLButtonElement>)  => { if (!isDisabled) setStyle(get(e), false) },
      onTouchStart:  (e: React.TouchEvent<HTMLButtonElement>)  => { if (!isDisabled) setStyle(get(e), true) },
      onTouchEnd:    (e: React.TouchEvent<HTMLButtonElement>)  => { if (!isDisabled) setStyle(get(e), false) },
      onTouchCancel: (e: React.TouchEvent<HTMLButtonElement>)  => { if (!isDisabled) setStyle(get(e), false) },
    }
  }

  function renderButtonRow(vals: number[], colorKey: 'positive' | 'negative') {
    const isDisabled = isLimitReached || loading
    const handlers = makeButtonHandlers(colorKey, isDisabled)
    return (
      <div style={{ display: 'flex', gap: 10 }}>
        {vals.map((val) => (
          <button
            key={val}
            disabled={isDisabled}
            onClick={() => awardPoints(val)}
            {...handlers}
            style={{
              flex: 1,
              height: 72,
              fontSize: 20,
              fontWeight: 700,
              border: `1.5px solid var(--color-${colorKey})`,
              backgroundColor: isDisabled ? '#F5F4F0' : `var(--color-${colorKey}-bg)`,
              color: isDisabled ? 'var(--color-text-muted)' : `var(--color-${colorKey})`,
              borderRadius: 10,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.5 : 1,
              transition: 'background-color 80ms ease, color 80ms ease',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
            }}
          >
            {val > 0 ? '+' : ''}{val}
          </button>
        ))}
      </div>
    )
  }

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

      {/* Sheet — uses left/right/margin centering so the slide-up animation doesn't conflict with a horizontal transform */}
      <div
        className="sheet-enter"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          margin: '0 auto',
          width: '100%',
          maxWidth: 480,
          backgroundColor: 'var(--color-surface)',
          borderRadius: '20px 20px 0 0',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 20px',
          paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 40,
          height: 4,
          backgroundColor: 'var(--color-border)',
          borderRadius: 2,
          alignSelf: 'center',
          marginBottom: 20,
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
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
          {/* 44×44 tap target — Apple's minimum recommended size */}
          <button
            onClick={onClose}
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F0EFE9',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              fontSize: 20,
              lineHeight: 1,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              flexShrink: 0,
              marginTop: -6,
              marginRight: -4,
            }}
          >
            ×
          </button>
        </div>

        {/* Transaction limit */}
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: isLimitReached ? '#92400E' : 'var(--color-text-muted)',
          backgroundColor: isLimitReached ? '#FEF3C7' : 'transparent',
          padding: isLimitReached ? '8px 12px' : '0',
          borderRadius: isLimitReached ? 'var(--radius-md)' : 0,
          marginBottom: 16,
          flexShrink: 0,
        }}>
          {isLimitReached
            ? 'Daily limit reached — no more transactions today'
            : `${displayRemaining} of 3 transactions left today`}
        </div>

        {/* Point buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {renderButtonRow(POSITIVE_VALS, 'positive')}
          {renderButtonRow(NEGATIVE_VALS, 'negative')}
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
