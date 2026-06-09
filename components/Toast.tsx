'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDone: () => void
}

export default function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 200)
    }, 2500)
    return () => clearTimeout(timer)
  }, [onDone])

  if (!visible) return null

  return (
    <div
      className="toast-enter"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        backgroundColor: '#1A1A1A',
        color: '#FFFFFF',
        padding: '0 16px',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 4,
        fontSize: 13,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}
