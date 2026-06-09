'use client'

import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import TabStrip from './TabStrip'

interface Chaperone {
  id: number
  name: string
}

interface TabStripWrapperProps {
  chaperones: Chaperone[]
}

const LEADERBOARD_PATH = '/leaderboard'

export default function TabStripWrapper({ chaperones }: TabStripWrapperProps) {
  const pathname = usePathname()

  if (pathname === LEADERBOARD_PATH) return null

  const baseTabs = [
    { label: 'All', value: 'all' },
    { label: 'Girls', value: 'girls' },
    { label: 'Boys', value: 'boys' },
  ]

  const chaperoneTabs = chaperones.map((c) => ({
    label: `${c.name}'s Group`,
    value: `chaperone_${c.id}`,
  }))

  const tabs = [...baseTabs, ...chaperoneTabs]

  return (
    <div style={{
      position: 'fixed',
      top: 60,
      left: 0,
      right: 0,
      zIndex: 40,
    }}>
      <Suspense>
        <TabStrip tabs={tabs} />
      </Suspense>
    </div>
  )
}
