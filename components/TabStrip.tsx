'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface Tab {
  label: string
  value: string
}

interface TabStripProps {
  tabs: Tab[]
}

export default function TabStrip({ tabs }: TabStripProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const activeTab = searchParams.get('tab') ?? 'all'

  function handleTab(value: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'all') {
        params.delete('tab')
      } else {
        params.set('tab', value)
      }
      const qs = params.toString()
      router.push(`${pathname}${qs ? `?${qs}` : ''}`)
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        overflowX: 'auto',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        height: 40,
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        opacity: isPending ? 0.7 : 1,
        transition: 'opacity 150ms ease',
      }}
      className="scrollbar-hide"
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.value === activeTab
        const isFirst = idx === 0
        const isLast = idx === tabs.length - 1
        return (
          <button
            key={tab.value}
            onClick={() => handleTab(tab.value)}
            style={{
              flexShrink: 0,
              height: '100%',
              padding: '0 12px',
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              border: 'none',
              borderRight: isLast ? 'none' : '1px solid var(--color-border)',
              cursor: 'pointer',
              backgroundColor: isActive ? '#1A1A1A' : 'transparent',
              color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
              borderRadius: isFirst
                ? 'var(--radius-sm) 0 0 var(--radius-sm)'
                : isLast
                ? '0 var(--radius-sm) var(--radius-sm) 0'
                : 0,
              transition: 'background-color 100ms ease, color 100ms ease',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
