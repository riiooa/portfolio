'use client'

import { useState, useEffect } from 'react'
import ScrambleText from '../shared/ScrambleText'

const NAV_ITEMS = [
  { label: 'HOME', href: '#home' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'ABOUT', href: '#about' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sections = ['home', 'projects', 'about']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActive(id)
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(0,0,0,0.9)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Logo */}
      <a href="#home" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', letterSpacing: '0.1em' }}>
        <ScrambleText text="RA.DEV" trigger="hover" />
      </a>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {NAV_ITEMS.map(item => (
          <a
            key={item.label}
            href={item.href}
            style={{
              color: active === item.href.slice(1) ? 'white' : 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              fontSize: '15px',
              letterSpacing: '0.15em',
              transition: 'color 0.2s ease',
            }}
          >
            <ScrambleText text={item.label} trigger="hover" speed={20} />
          </a>
        ))}
        
        <a
          href="/admin"
          style={{
            color: 'rgb(0, 0, 0)',
            textDecoration: 'none',
            fontSize: '15px',
            letterSpacing: '0.1em',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            paddingLeft: '20px',
          }}
        >
           ADMIN_ 
        </a>
      </div>
    </nav>
  )
}
