'use client'

import { useState, useCallback, useEffect } from 'react'

interface Student {
  id: number
  name: string
  gender: 'M' | 'F'
  roomId: number | null
  chaperone: string
  totalPoints: number
}

interface HeadcountGridProps {
  students: Student[]
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function HeadcountGrid({ students }: HeadcountGridProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  useEffect(() => {
    setChecked(new Set())
  }, [students])

  const toggle = useCallback((id: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const reset = useCallback(() => setChecked(new Set()), [])

  const count = checked.size
  const total = students.length

  return (
    <div>
      <div
        style={{
          position: 'sticky',
          top: 100,
          zIndex: 20,
          backgroundColor: 'var(--color-bg)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontSize: 'clamp(32px, 8vw, 48px)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {count}
          </span>
          <span style={{
            fontSize: 'clamp(18px, 4vw, 24px)',
            fontWeight: 800,
            color: 'var(--color-text-muted)',
            lineHeight: 1,
          }}>
            / {total}
          </span>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            marginLeft: 4,
          }}>
            counted
          </span>
        </div>

        <button
          onClick={reset}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            background: 'none',
            border: '1px solid var(--color-border)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            minHeight: 44,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Reset
        </button>
      </div>

      {students.length === 0 ? (
        <div style={{
          padding: '48px 16px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 14,
        }}>
          No students in this group
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          padding: '12px 16px 32px',
        }}>
          {students.map((s) => {
            const isChecked = checked.has(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1.1',
                  backgroundColor: isChecked ? '#1A1A1A' : 'var(--color-surface)',
                  border: `1px solid ${isChecked ? '#1A1A1A' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '8px',
                  gap: 4,
                  transition: 'background-color 120ms ease, border-color 120ms ease',
                  minHeight: 44,
                }}
              >
                {isChecked && (
                  <div style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    color: 'rgba(255,255,255,0.7)',
                  }}>
                    <CheckIcon />
                  </div>
                )}
                {s.roomId != null && (
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: isChecked ? 'rgba(255,255,255,0.6)' : 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                  }}>
                    Room {s.roomId}
                  </span>
                )}
                <span style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: isChecked ? '#FFFFFF' : 'var(--color-text-primary)',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                  textAlign: 'center',
                }}>
                  {s.name}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
