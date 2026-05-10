'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import ScrambleText from '@/components/shared/ScrambleText'
import type { Project } from '@/types'

type FormData = Omit<Project, 'id' | 'slug' | 'created_at' | 'updated_at'>

const EMPTY: FormData = {
  title: '',
  overview: '',
  problem_statement: '',
  tech_stack: [],
  architecture_image: '',
  technical_challenge: '',
  key_metrics: [],
  repo_url: '',
  demo_url: '',
  is_featured: false,
  priority_order: 0,
}

export default function AdminProjects() {
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [techInput, setTechInput] = useState('')
  const [metricsInput, setMetricsInput] = useState({ label: '', value: '' })

  const fetchProjects = async () => {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.overview) {
      toast.error('Title and overview are required')
      return
    }

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/projects/${editingId}` : '/api/projects'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      toast.success(editingId ? 'Project updated!' : 'Project created!')
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY)
      fetchProjects()
    } else {
      toast.error('Failed to save project')
    }
  }

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      overview: project.overview,
      problem_statement: project.problem_statement || '',
      tech_stack: project.tech_stack,
      architecture_image: project.architecture_image || '',
      technical_challenge: project.technical_challenge || '',
      key_metrics: project.key_metrics || [],
      repo_url: project.repo_url || '',
      demo_url: project.demo_url || '',
      is_featured: project.is_featured,
      priority_order: project.priority_order,
    })
    setEditingId(project.id)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Project deleted'); fetchProjects() }
    else toast.error('Failed to delete')
  }

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
      setForm(p => ({ ...p, tech_stack: [...p.tech_stack, techInput.trim()] }))
      setTechInput('')
    }
  }

  const removeTech = (t: string) => setForm(p => ({ ...p, tech_stack: p.tech_stack.filter(x => x !== t) }))

  const addMetric = () => {
    if (metricsInput.label && metricsInput.value) {
      setForm(p => ({ ...p, key_metrics: [...p.key_metrics, metricsInput] }))
      setMetricsInput({ label: '', value: '' })
    }
  }

  const removeMetric = (i: number) => setForm(p => ({ ...p, key_metrics: p.key_metrics.filter((_, idx) => idx !== i) }))

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--gray-900)',
    border: '1px solid var(--gray-800)',
    color: 'white',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    outline: 'none',
  }

  const labelStyle = {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.15em',
    marginBottom: '6px',
    display: 'block' as const,
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.2em', marginBottom: '8px' }}>
            // PROJECT_MANAGER
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            <ScrambleText text="THE_VAULT" trigger="load" speed={20} />
          </h1>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY) }}
          className="btn-primary"
        >
          + ADD_PROJECT
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'var(--gray-950)',
          border: '1px solid var(--gray-700)',
          padding: '32px',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.7)' }}>
              {editingId ? '// EDIT_PROJECT' : '// NEW_PROJECT'}
            </div>
            <button
              onClick={() => { setShowForm(false); setEditingId(null) }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'none' }}
            >
              [CANCEL]
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>PROJECT_TITLE *</label>
              <input
                style={inputStyle}
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Real-time ETL Pipeline"
              />
            </div>
            <div>
              <label style={labelStyle}>PRIORITY_ORDER (carousel position)</label>
              <input
                type="number"
                style={inputStyle}
                value={form.priority_order}
                onChange={e => setForm(p => ({ ...p, priority_order: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>OVERVIEW * (1-2 sentences)</label>
            <textarea
              style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
              value={form.overview}
              onChange={e => setForm(p => ({ ...p, overview: e.target.value }))}
              placeholder="End-to-end data pipeline processing 1TB+ daily..."
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>PROBLEM_STATEMENT</label>
            <textarea
              style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
              value={form.problem_statement || ''}
              onChange={e => setForm(p => ({ ...p, problem_statement: e.target.value }))}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>TECHNICAL_CHALLENGE</label>
            <textarea
              style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
              value={form.technical_challenge || ''}
              onChange={e => setForm(p => ({ ...p, technical_challenge: e.target.value }))}
            />
          </div>

          {/* Tech Stack */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>TECH_STACK</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTech()}
                placeholder="Python, Airflow, dbt... (press Enter)"
              />
              <button onClick={addTech} className="btn-outline" style={{ whiteSpace: 'nowrap' }}>ADD</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {form.tech_stack.map(t => (
                <span
                  key={t}
                  className="tech-badge"
                  style={{ cursor: 'none' }}
                  onClick={() => removeTech(t)}
                >
                  {t} ×
                </span>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>KEY_METRICS</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={metricsInput.label}
                onChange={e => setMetricsInput(p => ({ ...p, label: e.target.value }))}
                placeholder="Label (e.g. Latency Reduced)"
              />
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={metricsInput.value}
                onChange={e => setMetricsInput(p => ({ ...p, value: e.target.value }))}
                placeholder="Value (e.g. -85%)"
              />
              <button onClick={addMetric} className="btn-outline">ADD</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {form.key_metrics.map((m, i) => (
                <div
                  key={i}
                  className="tech-badge"
                  style={{ cursor: 'none' }}
                  onClick={() => removeMetric(i)}
                >
                  {m.label}: {m.value} ×
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>REPO_URL</label>
              <input style={inputStyle} value={form.repo_url || ''} onChange={e => setForm(p => ({ ...p, repo_url: e.target.value }))} placeholder="https://github.com/..." />
            </div>
            <div>
              <label style={labelStyle}>DEMO_URL</label>
              <input style={inputStyle} value={form.demo_url || ''} onChange={e => setForm(p => ({ ...p, demo_url: e.target.value }))} placeholder="https://..." />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>ARCHITECTURE_IMAGE_URL</label>
            <input style={inputStyle} value={form.architecture_image || ''} onChange={e => setForm(p => ({ ...p, architecture_image: e.target.value }))} placeholder="https://..." />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <input
              type="checkbox"
              id="featured"
              checked={form.is_featured}
              onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
            />
            <label htmlFor="featured" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', cursor: 'none' }}>
              IS_FEATURED (appears first in carousel)
            </label>
          </div>

          <button onClick={handleSubmit} className="btn-primary">
            {editingId ? '[UPDATE_PROJECT]' : '[CREATE_PROJECT]'} →
          </button>
        </div>
      )}

      {/* Projects table */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
        SELECT * FROM projects // {projects.length} rows returned
      </div>

      <div style={{ background: 'var(--gray-950)', border: '1px solid var(--gray-800)' }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 200px 80px 100px',
          padding: '12px 16px',
          borderBottom: '1px solid var(--gray-800)',
          fontSize: '10px',
          color: 'rgb(253, 252, 252)',
          letterSpacing: '0.15em',
        }}>
          <span>#</span>
          <span>TITLE</span>
          <span>TECH_STACK</span>
          <span>FEATURED</span>
          <span>ACTIONS</span>
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            FETCHING_DATA...
          </div>
        ) : projects.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            No projects found. Add your first project →
          </div>
        ) : (
          projects.map((project, idx) => (
            <div
              key={project.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 200px 80px 100px',
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                alignItems: 'center',
                fontSize: '12px',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>{String(idx + 1).padStart(2, '0')}</span>
              <div>
                <div style={{ color: 'white', marginBottom: '2px' }}>{project.title}</div>
                <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)' }}>{project.slug}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {project.tech_stack.slice(0, 3).map(t => (
                  <span key={t} className="tech-badge" style={{ fontSize: '9px' }}>{t}</span>
                ))}
                {project.tech_stack.length > 3 && <span className="tech-badge" style={{ fontSize: '9px' }}>+{project.tech_stack.length - 3}</span>}
              </div>
              <span style={{ color: project.is_featured ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)' }}>
                {project.is_featured ? '◉ YES' : '○ NO'}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(project)}
                  style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '4px 10px', cursor: 'none' }}
                >
                  EDIT
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  style={{ background: 'none', border: '1px solid rgba(255,80,80,0.2)', color: 'rgba(255,100,100,0.5)', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '4px 10px', cursor: 'none' }}
                >
                  DEL
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
