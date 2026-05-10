'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ScrambleText from '@/components/shared/ScrambleText'

const NAV = [
  { label: 'DASHBOARD', href: '/admin', icon: '▣' },
  { label: 'PROJECTS', href: '/admin/projects', icon: '◈' },
  { label: 'INBOX', href: '/admin/inbox', icon: '◎' },
  { label: 'PROFILE', href: '/admin/profile', icon: '◉' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && pathname !== '/admin/login') {
        router.push('/admin/login')
      } else {
        setUser(data.session?.user || null)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') router.push('/admin/login')
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [router, pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '13px',
        letterSpacing: '0.1em',
      }}>
        INITIALIZING_SYSTEM...
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <div className="admin-sidebar">
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--gray-800)',
          fontFamily: 'var(--font-mono)',
        }}>
          <div style={{ fontSize: '12px', color: 'white', letterSpacing: '0.1em', marginBottom: '4px' }}>
            <ScrambleText text="ADMIN_CONTROL" trigger="hover" speed={20} />
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            {user?.email}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 0' }}>
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.35)',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                background: pathname === item.href ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderLeft: pathname === item.href ? '2px solid white' : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', borderTop: '1px solid var(--gray-800)' }}>
          <a
            href="/"
            target="_blank"
            style={{
              display: 'block',
              marginBottom: '8px',
              padding: '8px 12px',
              color: 'rgba(255,255,255,0.3)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}
          >
            VIEW_SITE ↗
          </a>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              cursor: 'none',
            }}
          >
            SIGN_OUT
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  )
}
