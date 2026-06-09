'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Suspense } from 'react'

interface TopNavProps {
  userName: string
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21" />
      <line x1="12" y1="17" x2="12" y2="11" />
      <path d="M7 4H17V9a5 5 0 01-10 0V4z" />
      <path d="M4 7H7" />
      <path d="M17 7H20" />
    </svg>
  )
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: StarIcon },
  { href: '/headcount', label: 'Headcount', icon: ListIcon },
  { href: '/leaderboard', label: 'Leaderboard', icon: TrophyIcon },
]

function TopNavInner({ userName }: TopNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabQuery = searchParams.toString()

  return (
    <nav
      style={{
        height: 60,
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
            lineHeight: 1,
          }}>
            FUTURE
          </span>
          <span style={{
            color: 'var(--color-accent)',
            fontSize: 11,
            lineHeight: 1,
            fontWeight: 800,
          }}>◆</span>
          <span style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
            lineHeight: 1,
          }}>
            BUILDERS
          </span>
        </div>
        <span style={{
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginTop: 2,
          lineHeight: 1,
        }}>
          USM Construction &amp; Design
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href)
          const preserveTab = href !== '/leaderboard' && tabQuery
          const linkHref = preserveTab ? `${href}?${tabQuery}` : href

          return (
            <Link
              key={href}
              href={linkHref}
              title={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 8px',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                textDecoration: 'none',
                minHeight: 44,
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Icon />
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>
                {label}
              </span>
            </Link>
          )
        })}

        <div style={{
          width: 1,
          height: 24,
          backgroundColor: 'var(--color-border)',
          margin: '0 4px',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            maxWidth: 80,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {userName}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              fontSize: 12,
              color: 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              textDecoration: 'underline',
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default function TopNav(props: TopNavProps) {
  return (
    <Suspense>
      <TopNavInner {...props} />
    </Suspense>
  )
}
