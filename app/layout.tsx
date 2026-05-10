'use client'

import './globals.css'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const rippleContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // ── Custom Cursor ──
    const cursor = cursorRef.current
    const follower = followerRef.current
    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursor) {
        cursor.style.left = mouseX - 6 + 'px'
        cursor.style.top = mouseY - 6 + 'px'
      }
    }

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12
      followerY += (mouseY - followerY) * 0.12
      if (follower) {
        follower.style.left = followerX - 20 + 'px'
        follower.style.top = followerY - 20 + 'px'
      }
      requestAnimationFrame(animateFollower)
    }

    window.addEventListener('mousemove', moveCursor)
    animateFollower()

    // ── Water Ripple on Click ──
    const container = rippleContainerRef.current
    const createRipple = (e: MouseEvent) => {
      if (!container) return
      const x = e.clientX
      const y = e.clientY

      for (let i = 0; i < 3; i++) {
        const ripple = document.createElement('div')
        ripple.className = `water-ripple water-ripple-${i + 1}`
        ripple.style.left = x + 'px'
        ripple.style.top = y + 'px'
        container.appendChild(ripple)
        setTimeout(() => ripple.remove(), 2400)
      }
    }

    window.addEventListener('click', createRipple)

    // ── Binary Wave Canvas ──
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cols = Math.floor(canvas.width / 20)
    const rows = Math.floor(canvas.height / 20)
    let time = 0
    const chars = ['0', '1', '·', '—', '|']

    const drawBinary = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = '12px JetBrains Mono, monospace'

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const wave = Math.sin(c * 0.3 + time * 0.8) * Math.cos(r * 0.2 + time * 0.5)
          const opacity = (wave + 1) / 2 * 0.8 + 0.1
          const char = chars[Math.floor((wave + 1) * 2) % chars.length]

          ctx.globalAlpha = opacity
          ctx.fillStyle = '#ffffff'
          ctx.fillText(char, c * 20, r * 20)
        }
      }
      ctx.globalAlpha = 1
      time += 0.015
      requestAnimationFrame(drawBinary)
    }

    drawBinary()

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('click', createRipple)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <title>Rio Al Fandi — Junior Data Engineer</title>
        <meta name="description" content="Portfolio of Rio Al Fandi — Data Engineer & Solofounder" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Background Effects */}
        <canvas ref={canvasRef} id="binary-canvas" aria-hidden="true" />
        <div className="grid-lines" aria-hidden="true" />
        <div ref={rippleContainerRef} className="ripple-container" aria-hidden="true" />
        
        {/* Custom Cursor */}
        <div ref={cursorRef} className="cursor" />
        <div ref={followerRef} className="cursor-follower" />

        {/* App */}
        <main>{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#ffffff',
              border: '1px solid #2c2c2c',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            }
          }}
        />
      </body>
    </html>
  )
}
