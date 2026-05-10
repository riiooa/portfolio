'use client'

import { useEffect } from 'react'
import ScrambleText from '@/components/shared/ScrambleText'
import type { Project } from '@/types'

interface Props {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window"
        onClick={e => e.stopPropagation()}
        style={{ borderRadius: 0 }}
      >
        {/* Window Header */}
        <div className="modal-header">
          <div className="modal-dot" style={{ background: '#ff5f56' }} />
          <div className="modal-dot" style={{ background: '#ffbd2e' }} />
          <div className="modal-dot" style={{ background: '#27c93f' }} />
          <span style={{ marginLeft: '8px', color: 'rgba(255,255,255,0.3)' }}>
            PROJECT_VIEWER // {project.slug}.data
          </span>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              cursor: 'none',
            }}
          >
            [ESC] CLOSE
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Title */}
          <h2 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'white',
          }}>
            <ScrambleText text={project.title} trigger="load" speed={20} />
          </h2>

          {/* Overview */}
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '32px',
            lineHeight: 1.7,
          }}>
            {project.overview}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Left column */}
            <div>
              {/* Architecture Image */}
              {project.architecture_image && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '12px' }}>
                    ARCHITECTURE_DIAGRAM
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.architecture_image}
                    alt="Architecture"
                    style={{
                      width: '100%',
                      border: '1px solid rgba(255,255,255,0.1)',
                      filter: 'grayscale(30%)',
                    }}
                  />
                </div>
              )}

              {/* Key Metrics */}
              {project.key_metrics?.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '12px' }}>
                    KEY_METRICS
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {project.key_metrics.map((m, i) => (
                      <div key={i} style={{
                        padding: '16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                          {m.value}
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div>
              {/* Tech Stack */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '12px' }}>
                  TECH_STACK
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {project.tech_stack.map(t => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>

              {/* Problem Statement */}
              {project.problem_statement && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '12px' }}>
                    PROBLEM_STATEMENT
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                    {project.problem_statement}
                  </p>
                </div>
              )}

              {/* Technical Challenge */}
              {project.technical_challenge && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '12px' }}>
                    TECHNICAL_CHALLENGE
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                    {project.technical_challenge}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div style={{
            display: 'flex',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}>
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ textDecoration: 'none' }}
              >
                [VIEW_CODE] ↗
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                [LIVE_DEMO] ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
