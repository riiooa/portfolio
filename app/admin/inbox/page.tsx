'use client'

import { useEffect, useState } from 'react'
import ScrambleText from '@/components/shared/ScrambleText'
import type { Message } from '@/types'

export default function AdminInbox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  const fetchMessages = async () => {
    const res = await fetch('/api/messages')
    const data = await res.json()
    setMessages(data)
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const markRead = async (id: string) => {
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_read: true }),
    })
    setMessages(p => p.map(m => m.id === id ? { ...m, is_read: true } : m))
  }

  const handleSelect = (msg: Message) => {
    setSelected(msg)
    if (!msg.is_read) markRead(msg.id)
  }

  const unread = messages.filter(m => !m.is_read).length

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '10px', color: 'rgb(253, 252, 252)', letterSpacing: '0.2em', marginBottom: '8px' }}>
          // INBOX_SYSTEM
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          <ScrambleText text="MESSAGES" trigger="load" speed={20} />
        </h1>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
          {unread} unread / {messages.length} total
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Message list */}
        <div style={{ background: 'var(--gray-950)', border: '1px solid var(--gray-800)' }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--gray-800)',
            fontSize: '10px',
            color: 'rgb(253, 252, 252)',
            letterSpacing: '0.15em',
          }}>
            SELECT * FROM messages ORDER BY sent_at DESC
          </div>

          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              FETCHING_DATA...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              No messages received yet.
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'none',
                  background: selected?.id === msg.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    color: !msg.is_read ? 'white' : 'rgba(255,255,255,0.5)',
                    fontWeight: !msg.is_read ? 600 : 400,
                  }}>
                    {msg.sender_name}
                  </span>
                  {!msg.is_read && (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                  {msg.subject}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(msg.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message detail */}
        <div style={{ background: 'var(--gray-950)', border: '1px solid var(--gray-800)' }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--gray-800)',
            fontSize: '10px',
            color: 'rgb(253, 252, 252)',
            letterSpacing: '0.15em',
            display: 'flex',
            gap: '8px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56', marginTop: '1px' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e', marginTop: '1px' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f', marginTop: '1px' }} />
            MESSAGE_VIEWER
          </div>

          {selected ? (
            <div style={{ padding: '24px', fontFamily: 'var(--font-mono)' }}>
              {[
                { key: 'FROM', val: `${selected.sender_name} <${selected.sender_email}>` },
                { key: 'SUBJECT', val: selected.subject },
                { key: 'DATE', val: new Date(selected.sent_at).toISOString() },
              ].map(item => (
                <div key={item.key} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '9px', color: 'rgb(253, 252, 252)', letterSpacing: '0.15em', marginBottom: '4px' }}>
                    {item.key}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{item.val}</div>
                </div>
              ))}

              <div>
                <div style={{ fontSize: '9px', color: 'rgb(253, 252, 252)', letterSpacing: '0.15em', marginBottom: '8px' }}>
                  MESSAGE
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {selected.message}
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <a
                  href={`mailto:${selected.sender_email}?subject=Re: ${selected.subject}`}
                  className="btn-outline"
                  style={{ textDecoration: 'none', fontSize: '11px' }}
                >
                  [REPLY] →
                </a>
              </div>
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)', fontSize: '12px', marginTop: '40px' }}>
              // Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
