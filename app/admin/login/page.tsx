'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import ScrambleText from '@/components/shared/ScrambleText'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
    }}>
      <div style={{
        background: 'var(--gray-950)',
        border: '1px solid var(--gray-800)',
        padding: '48px',
        width: '400px',
        textAlign: 'center',
      }}>
        {/* Header bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          padding: '0 0 20px',
          borderBottom: '1px solid var(--gray-800)',
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
          <span style={{ marginLeft: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
            ADMIN_AUTH_PORTAL
          </span>
        </div>

        <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.2em', marginBottom: '16px' }}>
          // SECURE_LOGIN
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
          <ScrambleText text="CONTROL_ROOM" trigger="load" speed={25} />
        </h1>

        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '40px', lineHeight: 1.6 }}>
          Authorized personnel only.<br />Authentication required to proceed.
        </p>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(255,100,100,0.05)',
            border: '1px solid rgba(255,100,100,0.15)',
            marginBottom: '20px',
            fontSize: '12px',
            color: 'rgba(255,150,150,0.7)',
          }}>
            ERROR: {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? 'rgba(255,255,255,0.05)' : 'white',
            color: loading ? 'rgba(255,255,255,0.3)' : 'black',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.1em',
            cursor: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? 'AUTHENTICATING...' : '[ SIGN_IN WITH GOOGLE ]'}
        </button>

        <div style={{ marginTop: '24px', fontSize: '10px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
          <span className="terminal-cursor">ACCESS_LOG MONITORING ACTIVE</span>
        </div>
      </div>
    </div>
  )
}
