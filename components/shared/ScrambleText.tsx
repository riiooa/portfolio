'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|'

interface Props {
  text: string
  className?: string
  trigger?: 'hover' | 'load' | 'always'
  speed?: number
}

/**
 * ScrambleText Component
 * Handles text scrambling animation for a terminal-like visual effect.
 * Optimized to prevent Next.js hydration mismatch errors.
 */
export default function ScrambleText({ text, className = '', trigger = 'hover', speed = 30 }: Props) {
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()
  const iterRef = useRef(0)

  // Initialization to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    if (trigger === 'load' || trigger === 'always') {
      setTimeout(scramble, 200)
    }
    return () => clearInterval(intervalRef.current)
  }, [])

  const scramble = () => {
    if (isScrambling) return
    setIsScrambling(true)
    iterRef.current = 0
    const maxIter = text.length * 3

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i < iterRef.current / 3) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      iterRef.current++
      
      if (iterRef.current >= maxIter) {
        clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsScrambling(false)
      }
    }, speed)
  }

  useEffect(() => {
    if (trigger === 'always') {
      const loop = setInterval(scramble, 4000)
      return () => clearInterval(loop)
    }
  }, [trigger])

  // If not mounted, render plain text to match server-side HTML
  if (!isMounted) {
    return <span className={className}>{text}</span>
  }

  return (
    <span
      className={`scramble-text ${className}`}
      onMouseEnter={trigger === 'hover' ? scramble : undefined}
      style={{ letterSpacing: '0.02em' }}
    >
      {displayText}
    </span>
  )
}