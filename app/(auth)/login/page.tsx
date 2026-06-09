'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!username || !password) {
      setError('Please enter your username and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Invalid username or password.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 360,
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '40px 32px',
      }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{
              fontSize: 28,
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
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1,
            }}>◆</span>
            <span style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              lineHeight: 1,
            }}>
              BUILDERS
            </span>
          </div>
          <div style={{
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginTop: 8,
            fontWeight: 500,
          }}>
            USM Construction &amp; Design
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoComplete="username"
              style={{
                width: '100%',
                height: 44,
                padding: '0 12px',
                fontSize: 14,
                border: `1px solid ${error ? 'var(--color-negative)' : 'var(--color-border)'}`,
                borderRadius: 0,
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoComplete="current-password"
              style={{
                width: '100%',
                height: 44,
                padding: '0 12px',
                fontSize: 14,
                border: `1px solid ${error ? 'var(--color-negative)' : 'var(--color-border)'}`,
                borderRadius: 0,
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{
              fontSize: 12,
              color: 'var(--color-negative)',
              padding: '6px 0',
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              height: 44,
              backgroundColor: loading ? '#C04520' : 'var(--color-accent)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 0,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4,
              transition: 'background-color 120ms ease',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
