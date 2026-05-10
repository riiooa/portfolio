'use client'

import { useState } from 'react'
import ScrambleText from '@/components/shared/ScrambleText'
import ContactModal from './ContactModal'
import type { AboutContact } from '@/types'

interface Props {
  about: AboutContact | null
}

export default function AboutSection({ about }: Props) {
  const [showContact, setShowContact] = useState(false)
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)

  const logs = about?.about_logs || [
    { timestamp: '2021-01-01', event: 'INITIALIZED', message: 'Started journey as Data Engineer' },
    { timestamp: '2023-06-01', event: 'UPGRADED', message: 'Launched first project as Solofounder' },
    { timestamp: 'CURRENT', event: 'STATUS', message: 'Open for high-impact collaborations' },
  ]

  const techs = about?.tech_circuits || [
    { name: 'Python', category: 'Language', connected_to: ['Airflow', 'PostgreSQL'] },
    { name: 'SQL', category: 'Language', connected_to: ['PostgreSQL', 'BigQuery'] },
    { name: 'Airflow', category: 'Orchestration', connected_to: ['Python', 'AWS'] },
    { name: 'PostgreSQL', category: 'Database', connected_to: ['Python', 'dbt'] },
    { name: 'AWS', category: 'Cloud', connected_to: ['Airflow', 'Python'] },
    { name: 'dbt', category: 'Transform', connected_to: ['SQL', 'PostgreSQL'] },
    { name: 'BigQuery', category: 'Warehouse', connected_to: ['dbt', 'SQL'] },
    { name: 'Spark', category: 'Processing', connected_to: ['Python', 'AWS'] },
  ]

  const socials = [
    { key: 'github', value: about?.github_url || 'https://github.com/rioalfandi', href: about?.github_url || '#' },
    { key: 'linkedin', value: about?.linkedin_url || 'https://linkedin.com/in/rioalfandi', href: about?.linkedin_url || '#' },
    { key: 'email', value: about?.contact_email || 'riiooalfandi@gmail.com', href: `mailto:${about?.contact_email || 'riiooalfandi@gmail.com'}` },
    ...(about?.resume_url ? [{ key: 'resume', value: about.resume_url, href: about.resume_url }] : []),
  ]

  const contactEmail = about?.contact_email || 'riiooalfandi@gmail.com'

  return (
    <section
      id="about"
      className="section"
      style={{
        minHeight: '100vh',
        padding: '80px 40px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="section-separator" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.25em', marginBottom: '16px' }}>
          SELECT * FROM about_contact // SYSTEM_CORE
        </div>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          <ScrambleText text="THE_CORE" trigger="always" speed={40} />
        </h2>
      </div>

      <div style={{ maxWidth: '1100px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
        {/* Left: System Logs */}
        <div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: '24px' }}>
            // SYSTEM_LOG — CAREER_TIMELINE
          </div>

          <div style={{ fontFamily: 'var(--font-mono)' }}>
            {logs.map((log, i) => (
              <div key={i} className="log-entry">
                <span style={{ color: 'rgb(253, 252, 252)', fontSize: '11px' }}>
                  [{log.timestamp}]
                </span>
                <span style={{
                  color: log.event === 'STATUS' ? 'rgba(255,255,255,0.9)' : log.event === 'UPGRADED' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                }}>
                  {log.event}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', lineHeight: 1.5 }}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>

          {/* Social Links as JSON */}
          <div style={{ marginTop: '48px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: '16px' }}>
              // SOCIAL_LINKS — JSON_FORMAT
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: 2,
            }}>
              <div style={{ color: 'rgba(255,255,255,0.3)' }}>{'{'}</div>
              <div style={{ paddingLeft: '20px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>&quot;socials&quot;</span>
                <span style={{ color: 'rgb(253, 252, 252)' }}>: {'{'}</span>
                {socials.map(s => (
                  <div key={s.key} style={{ paddingLeft: '20px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>&quot;{s.key}&quot;</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>: </span>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                    >
                      &quot;{s.value}&quot;
                    </a>
                  </div>
                ))}
                <div style={{ color: 'rgb(253, 252, 252)' }}>{'}'}</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)' }}>{'}'}</div>
            </div>
          </div>

          {/* Contact Button */}
          <div style={{ marginTop: '32px' }}>
            <button
              onClick={() => setShowContact(true)}
              className="btn-primary"
              style={{ fontSize: '11px' }}
            >
              [COMPOSE_MESSAGE] →
            </button>
          </div>
        </div>

        {/* Right: Tech Circuits */}
        <div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: '24px' }}>
            // TECH_STACK — CIRCUIT_DIAGRAM
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {techs.map(tech => {
              const isHovered = hoveredTech === tech.name
              const isConnected = hoveredTech ? tech.connected_to?.includes(hoveredTech) || techs.find(t => t.name === hoveredTech)?.connected_to?.includes(tech.name) : false

              return (
                <div
                  key={tech.name}
                  onMouseEnter={() => setHoveredTech(tech.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                  style={{
                    padding: '12px 8px',
                    background: isHovered ? 'rgba(255,255,255,0.1)' : isConnected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isHovered ? 'rgba(255,255,255,0.4)' : isConnected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'none',
                  }}
                >
                  <div style={{ fontSize: '12px', color: isHovered ? 'white' : isConnected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)', marginBottom: '4px', fontWeight: 600 }}>
                    {tech.name}
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                    {tech.category}
                  </div>
                  {isHovered && tech.connected_to?.length > 0 && (
                    <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
                      → {tech.connected_to.join(', ')}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginTop: '8px' }}>
            // HOVER over a tool to see connections
          </div>

          {/* Footer system info */}
          <div style={{
            marginTop: '48px',
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontFamily: 'var(--font-mono)',
          }}>
            <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.15em', marginBottom: '12px' }}>
              // SYSTEM_INFO
            </div>
            {[
              { key: 'NODE', val: 'Rio Al Fandi' },
              
              { key: 'UPTIME', val: '<1 years' },
              { key: 'STATUS', val: 'READY_FOR_HIRE' },
              { key: 'LOCATION', val: 'ID_REG-21' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '12px' }}>
                <span style={{ color: 'rgb(253, 252, 252)' }}>{item.key}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '80px',
        textAlign: 'center',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.15)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.1em',
      }}>
        © {new Date().getFullYear()} Rio Al Fandi // Built with Next.js + Supabase // All rights reserved
      </div>

      {/* Contact Modal */}
      {showContact && (
        <ContactModal
          onClose={() => setShowContact(false)}
          contactEmail={contactEmail}
        />
      )}
    </section>
  )
}
