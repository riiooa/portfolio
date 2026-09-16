'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ScrambleText from '@/components/shared/ScrambleText'
import ProjectModal from './ProjectModal'
import type { Project } from '@/types'

interface Props {
  projects: Project[]
}

export default function ProjectsSection({ projects }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const total = projects.length
  if (total === 0) return null

  const getPosition = (index: number) => {
    const diff = ((index - activeIndex) % total + total) % total
    const normalizedDiff = diff > total / 2 ? diff - total : diff
    return normalizedDiff
  }

  const next = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + total) % total)
  }, [total])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev])

  // Touch / drag
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
    const diff = dragStartX.current - endX
    if (diff > 50) next()
    else if (diff < -50) prev()
    setIsDragging(false)
  }

  const getCardStyle = (pos: number): React.CSSProperties => {
    const absPos = Math.abs(pos)
    if (absPos > 2) return { display: 'none' }

    const translateX = pos * 240
    const rotateY = pos * -25
    const scale = pos === 0 ? 1 : 0.78
    const opacity = pos === 0 ? 1 : absPos === 1 ? 0.5 : 0.2
    const zIndex = pos === 0 ? 10 : absPos === 1 ? 5 : 1

    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translateX(calc(-50% + ${translateX}px)) translateY(-50%) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      cursor: pos === 0 ? 'none' : 'none',
      width: '300px',
    }
  }

  return (
    <section
      id="projects"
      className="section"
      style={{
        minHeight: '100vh',
        padding: 'clamp(40px, 6vh, 80px) 5%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <div className="section-separator" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vh, 64px)' }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: '5px' }}>
          SELECT * FROM projects ORDER BY priority_order ASC
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 64px)', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: 0 }}>
          <ScrambleText text="THE_VAULT" trigger="always" speed={40} />
        </h2>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '5px' }}>
          {total} records found // drag or use ← → keys
        </div>
      </div>

      {/* 3D Carousel */}
      <div
        className="carousel-stage"
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(340px, 48vh, 460px)',
          maxWidth: '900px',
        }}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        {projects.map((project, i) => {
          const pos = getPosition(i)
          return (
            <div key={project.id} style={getCardStyle(pos)}>
              <ProjectCard
                project={project}
                isActive={pos === 0}
                onClick={() => pos === 0 && setSelectedProject(project)}
              />
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: 'clamp(25px, 3vh, 40px)' }}>
        <button onClick={prev} className="btn-outline" style={{ padding: '10px 24px', fontSize: '14px' }}>
          ←
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width: i === activeIndex ? '24px' : '6px',
                height: '6px',
                background: i === activeIndex ? 'white' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'none',
                transition: 'all 0.3s ease',
                borderRadius: 0,
              }}
            />
          ))}
        </div>

        <button onClick={next} className="btn-outline" style={{ padding: '10px 24px', fontSize: '14px' }}>
          →
        </button>
      </div>

      {/* Active project metadata */}
      <div style={{
        marginTop: 'clamp(16px, 2.5vh, 32px)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.2)',
        textAlign: 'center',
      }}>
        PROJECT_ID: {String(activeIndex + 1).padStart(3, '0')} // STATUS: {projects[activeIndex]?.is_featured ? 'FEATURED' : 'INDEXED'}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}

function ProjectCard({ project, isActive, onClick }: {
  project: Project
  isActive: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--gray-950)',
        border: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
        padding: '24px',
        width: '260px',
        height: '380px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease',
        userSelect: 'none',
      }}
    >
      {/* Corner accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '40px',
        height: '40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
      }} />

      {/* Featured badge */}
      {project.is_featured && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          fontSize: '9px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.2em',
          background: 'rgba(255,255,255,0.05)',
          padding: '2px 8px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          FEATURED
        </div>
      )}

      <div style={{ marginTop: project.is_featured ? '32px' : '0', flex: 1 }}>
        {/* Number */}
        <div style={{ fontSize: '48px', fontWeight: 700, color: 'rgba(255,255,255,0.06)', lineHeight: 1, marginBottom: '16px' }}>
          {String(project.priority_order || 0).padStart(2, '0')}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          marginBottom: '12px',
          lineHeight: 1.4,
          color: 'white',
        }}>
          {isActive
            ? <ScrambleText text={project.title} trigger="load" speed={25} />
            : project.title
          }
        </h3>

        {/* Overview */}
        <p style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.7,
          marginBottom: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.overview}
        </p>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '20px' }}>
          {project.tech_stack.slice(0, 4).map(t => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
          {project.tech_stack.length > 4 && (
            <span className="tech-badge">+{project.tech_stack.length - 4}</span>
          )}
        </div>

        {/* Metrics preview */}
        {project.key_metrics?.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}>
            {project.key_metrics.slice(0, 2).map((m, i) => (
              <div key={i}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{m.value}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      /* {/* Click hint (active only) */}

    </div>
  )
}
