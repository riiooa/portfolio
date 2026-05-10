'use client'

import { useEffect, useState } from 'react'
import ScrambleText from '@/components/shared/ScrambleText'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0 })
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, msgRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/messages'),
        ])
        const projects = await projRes.json()
        const messages = await msgRes.json()
        setStats({
          projects: projects.length || 0,
          messages: messages.length || 0,
          unread: messages.filter((m: { is_read: boolean }) => !m.is_read).length || 0,
        })
      } catch {}
      setLoading(false)
    }
    fetchStats()

    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.2em', marginBottom: '8px' }}>
          // SYSTEM_DASHBOARD
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
          <ScrambleText text="CONTROL_ROOM" trigger="load" speed={20} />
        </h1>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
          {time.toISOString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
        {[
          { label: 'TOTAL_PROJECTS', value: stats.projects, sub: 'in database' },
          { label: 'TOTAL_MESSAGES', value: stats.messages, sub: 'received' },
          { label: 'UNREAD_MESSAGES', value: stats.unread, sub: 'pending review' },
        ].map(stat => (
          <div key={stat.label} style={{
            padding: '24px',
            background: 'var(--gray-950)',
            border: '1px solid var(--gray-800)',
            fontFamily: 'var(--font-mono)',
          }}>
            <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.15em', marginBottom: '12px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '40px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
              {loading ? '—' : stat.value}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.2em', marginBottom: '20px' }}>
          // QUICK_ACTIONS
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="/admin/projects?new=1" className="btn-primary" style={{ textDecoration: 'none' }}>
            + ADD_PROJECT
          </a>
          <a href="/admin/profile" className="btn-outline" style={{ textDecoration: 'none' }}>
            EDIT_PROFILE
          </a>
          <a href="/admin/inbox" className="btn-outline" style={{ textDecoration: 'none' }}>
            VIEW_INBOX ({stats.unread} unread)
          </a>
        </div>
      </div>

      {/* System info */}
      <div style={{
        padding: '20px',
        background: 'var(--gray-950)',
        border: '1px solid var(--gray-800)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
      }}>
        <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.15em', marginBottom: '16px' }}>
          // SYSTEM_STATUS
        </div>
        {[
          { key: 'DATABASE', val: 'CONNECTED // Supabase PostgreSQL', ok: true },
          { key: 'EMAIL_SERVICE', val: 'ACTIVE // Resend', ok: true },
          { key: 'AUTH', val: 'ACTIVE // Google OAuth', ok: true },
          { key: 'DEPLOYMENT', val: 'ONLINE // Next.js', ok: true },
        ].map(item => (
          <div key={item.key} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>{item.key}</span>
            <span style={{ color: item.ok ? 'rgba(255,255,255,0.7)' : 'rgba(255,100,100,0.7)' }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
