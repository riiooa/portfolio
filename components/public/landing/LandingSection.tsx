'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ScrambleText from '@/components/shared/ScrambleText'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

export default function LandingSection({ profile }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const name = profile?.full_name || 'Rio Al Fandi'
  const intro = profile?.short_intro || 'Building data infrastructures for the future. Scaling ideas from zero to production.'
  const backMeta = profile?.photo_back_metadata || {
    status: 'ACTIVE',
    role: 'DATA_ENGINEER',
    location: 'ID',
    skills: ['Python', 'SQL', 'AWS', 'Airflow']
  }

  return (
    <section
      id="home"
      className="section"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '80px 40px 40px',
        position: 'relative',
      }}
    >
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '80px',
        alignItems: 'center',
      }}>
        {/* Left: Text */}
        <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.3s' }}>
          {/* Greeting label */}
          <div style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.2em',
            marginBottom: '24px',
            fontFamily: 'var(--font-mono)',
          }}>
            PORTFOLIO // JUNIOR DATA_ENGINEER
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: 'clamp(48px, 7vw, 96px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-mono)',
            marginBottom: '24px',
            color: 'white',
          }}>
            <ScrambleText text={name.split(' ')[0]} trigger="load" speed={25} />
            <br />
            <ScrambleText text={name.split(' ').slice(1).join(' ')} trigger="load" speed={25} />
          </h1>

          {/* Divider */}
          <div style={{
            width: '60px',
            height: '1px',
            background: 'rgba(255,255,255,0.3)',
            marginBottom: '24px',
          }} />

          {/* Intro */}
          <p style={{
            fontSize: '15px',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '480px',
            fontFamily: 'var(--font-mono)',
            marginBottom: '48px',
          }}>
            {intro}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#projects" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              VIEW_PROJECTS →
            </a>
            <a href="#about" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
              ABOUT_ME
            </a>
          </div>

          {/* Status indicator */}
          <div style={{
            marginTop: '56px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'white',
              animation: 'blink 2s step-end infinite',
            }} />
            AVAILABLE_FOR_COLLABORATION
          </div>
        </div>

        {/* Right: 3D Flip Card */}
        <div
          className="flip-card floating"
          style={{
            width: '340px',
            height: '420px',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.6s ease 0.6s',
          }}
        >
          <div className="flip-card-inner">
            {/* Front */}
            <div
              className="flip-card-front"
              style={{
                background: 'var(--gray-900)',
                border: '1px solid var(--gray-700)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Foto statis — file ada di /public/images/photoprofile.jpeg */}
              <Image
                src="/images/photoprofile.jpeg"
                alt={name}
                fill
                priority
                style={{ objectFit: 'cover', filter: 'grayscale(30%)' }}
              />
              {/* Hover hint */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.1em',
              }}>
                HOVER →
              </div>
            </div>

            {/* Back */}
            <div
              className="flip-card-back"
              style={{
                background: 'var(--gray-950)',
                border: '1px solid var(--gray-700)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '16px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '8px' }}>
                // SYSTEM_IDENTITY
              </div>

              {[
                { key: 'STATUS', val: backMeta.status },
                { key: 'ROLE', val: backMeta.role },
                { key: 'LOCATION', val: backMeta.location },
              ].map(item => (
                <div key={item.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '4px' }}>
                    {item.key}
                  </div>
                  <div style={{ fontSize: '13px', color: 'white', letterSpacing: '0.05em' }}>
                    {item.val}
                  </div>
                </div>
              ))}

              <div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '8px' }}>
                  SKILLS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {backMeta.skills?.map(skill => (
                    <span key={skill} className="tech-badge">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: 0.3,
        fontSize: '9px',
        letterSpacing: '0.2em',
        color: 'white',
      }}>
        SCROLL
        <div style={{
          width: '1px',
          height: '40px',
          background: 'white',
          animation: 'float 2s ease-in-out infinite',
        }} />
      </div>
    </section>
  )
}
