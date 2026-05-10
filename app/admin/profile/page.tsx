'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ScrambleText from '@/components/shared/ScrambleText'
import type { Profile, AboutContact } from '@/types'

export default function AdminProfile() {
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const [about, setAbout] = useState<Partial<AboutContact>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'landing' | 'about'>('landing')

  // Log editor state
  const [newLog, setNewLog] = useState({ timestamp: '', event: '', message: '' })
  // Tech editor state
  const [newTech, setNewTech] = useState({ name: '', category: '', connected_to: '' })

  useEffect(() => {
    const fetchData = async () => {
      const [profRes, aboutRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/about'),
      ])
      const profData = await profRes.json()
      const aboutData = await aboutRes.json()
      setProfile(profData || {})
      setAbout(aboutData || {})
      setLoading(false)
    }
    fetchData()
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    setSaving(false)
    if (res.ok) toast.success('Profile saved!')
    else toast.error('Failed to save profile')
  }

  const saveAbout = async () => {
    setSaving(true)
    const res = await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(about),
    })
    setSaving(false)
    if (res.ok) toast.success('About saved!')
    else toast.error('Failed to save about')
  }

  const addLog = () => {
    if (!newLog.timestamp || !newLog.event || !newLog.message) return
    setAbout(p => ({
      ...p,
      about_logs: [...(p.about_logs || []), newLog],
    }))
    setNewLog({ timestamp: '', event: '', message: '' })
  }

  const removeLog = (i: number) => {
    setAbout(p => ({ ...p, about_logs: (p.about_logs || []).filter((_, idx) => idx !== i) }))
  }

  const addTech = () => {
    if (!newTech.name || !newTech.category) return
    setAbout(p => ({
      ...p,
      tech_circuits: [...(p.tech_circuits || []), {
        ...newTech,
        connected_to: newTech.connected_to.split(',').map(s => s.trim()).filter(Boolean),
      }],
    }))
    setNewTech({ name: '', category: '', connected_to: '' })
  }

  const removeTech = (i: number) => {
    setAbout(p => ({ ...p, tech_circuits: (p.tech_circuits || []).filter((_, idx) => idx !== i) }))
  }

  const updateBackMeta = (key: string, value: string | string[]) => {
    setProfile(p => ({
      ...p,
      photo_back_metadata: {
        ...(p.photo_back_metadata || { status: '', role: '', location: '', skills: [] }),
        [key]: value,
      },
    }))
  }

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

  if (loading) {
    return (
      <div style={{ padding: '40px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
        LOADING_DATA...
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.2em', marginBottom: '8px' }}>
          // PROFILE_EDITOR
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          <ScrambleText text="EDIT_PROFILE" trigger="load" speed={20} />
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '32px', borderBottom: '1px solid var(--gray-800)' }}>
        {(['landing', 'about'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid white' : '2px solid transparent',
              color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: 'none',
              marginBottom: '-1px',
            }}
          >
            {tab === 'landing' ? 'LANDING_PAGE' : 'ABOUT_&_CONTACT'}
          </button>
        ))}
      </div>

      {/* Landing Tab */}
      {activeTab === 'landing' && (
        <div style={{ background: 'var(--gray-950)', border: '1px solid var(--gray-800)', padding: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>FULL_NAME</label>
            <input
              style={inputStyle}
              value={profile.full_name || ''}
              onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
              placeholder="Rio Al Fandi"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>SHORT_INTRO (tagline below name)</label>
            <textarea
              style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
              value={profile.short_intro || ''}
              onChange={e => setProfile(p => ({ ...p, short_intro: e.target.value }))}
              placeholder="Building data infrastructures for the future..."
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>PHOTO_FRONT_URL (link to your photo)</label>
            <input
              style={inputStyle}
              value={profile.photo_front_url || ''}
              onChange={e => setProfile(p => ({ ...p, photo_front_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.15em', marginBottom: '16px' }}>
              CARD_BACK_METADATA (shown when photo card is flipped)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { key: 'status', label: 'STATUS', placeholder: 'ACTIVE' },
                { key: 'role', label: 'ROLE', placeholder: 'DATA_ENGINEER' },
                { key: 'location', label: 'LOCATION', placeholder: 'ID' },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    style={inputStyle}
                    value={((profile.photo_back_metadata as unknown) as Record<string, string>)?.[f.key] || ''}
                    onChange={e => updateBackMeta(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              <div>
                <label style={labelStyle}>SKILLS (comma-separated)</label>
                <input
                  style={inputStyle}
                  value={(profile.photo_back_metadata?.skills || []).join(', ')}
                  onChange={e => updateBackMeta('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Python, SQL, AWS"
                />
              </div>
            </div>
          </div>

          <button onClick={saveProfile} disabled={saving} className="btn-primary">
            {saving ? 'SAVING...' : '[SAVE_LANDING] →'}
          </button>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div style={{ background: 'var(--gray-950)', border: '1px solid var(--gray-800)', padding: '32px' }}>
          {/* Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {[
              { key: 'github_url', label: 'GITHUB_URL' },
              { key: 'linkedin_url', label: 'LINKEDIN_URL' },
              { key: 'resume_url', label: 'RESUME_URL (PDF link)' },
              { key: 'contact_email', label: 'CONTACT_EMAIL' },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  style={inputStyle}
                  value={(about as Record<string, string>)[f.key] || ''}
                  onChange={e => setAbout(p => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          {/* Career Logs */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.15em', marginBottom: '16px' }}>
              CAREER_LOGS (System Log Timeline)
            </div>

            {(about.about_logs || []).map((log, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '140px 130px 1fr 40px',
                gap: '8px',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                alignItems: 'center',
                fontSize: '12px',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>[{log.timestamp}]</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{log.event}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{log.message}</span>
                <button onClick={() => removeLog(i)} style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.5)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'none' }}>×</button>
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '140px 130px 1fr auto', gap: '8px', marginTop: '12px' }}>
              <input style={inputStyle} value={newLog.timestamp} onChange={e => setNewLog(p => ({ ...p, timestamp: e.target.value }))} placeholder="2024-01-15" />
              <input style={inputStyle} value={newLog.event} onChange={e => setNewLog(p => ({ ...p, event: e.target.value }))} placeholder="INITIALIZED" />
              <input style={inputStyle} value={newLog.message} onChange={e => setNewLog(p => ({ ...p, message: e.target.value }))} placeholder="Started journey..." />
              <button onClick={addLog} className="btn-outline" style={{ whiteSpace: 'nowrap' }}>ADD</button>
            </div>
          </div>

          {/* Tech Circuits */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.15em', marginBottom: '16px' }}>
              TECH_CIRCUITS (Skills Circuit Diagram)
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {(about.tech_circuits || []).map((t, i) => (
                <span
                  key={i}
                  className="tech-badge"
                  onClick={() => removeTech(i)}
                  style={{ cursor: 'none' }}
                >
                  {t.name} ({t.category}) ×
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '8px' }}>
              <input style={inputStyle} value={newTech.name} onChange={e => setNewTech(p => ({ ...p, name: e.target.value }))} placeholder="Python" />
              <input style={inputStyle} value={newTech.category} onChange={e => setNewTech(p => ({ ...p, category: e.target.value }))} placeholder="Language" />
              <input style={inputStyle} value={newTech.connected_to} onChange={e => setNewTech(p => ({ ...p, connected_to: e.target.value }))} placeholder="Airflow, dbt, PostgreSQL" />
              <button onClick={addTech} className="btn-outline">ADD</button>
            </div>
          </div>

          <button onClick={saveAbout} disabled={saving} className="btn-primary">
            {saving ? 'SAVING...' : '[SAVE_ABOUT] →'}
          </button>
        </div>
      )}
    </div>
  )
}
