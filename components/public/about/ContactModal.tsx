'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
  contactEmail: string
}

type Stage = 'name' | 'email' | 'subject' | 'message' | 'sending' | 'sent'

export default function ContactModal({ onClose, contactEmail }: Props) {
  const [stage, setStage] = useState<Stage>('name')
  const [inputs, setInputs] = useState({ name: '', email: '', subject: '', message: '' })
  const [current, setCurrent] = useState('')
  const [log, setLog] = useState<string[]>(['// SYSTEM_MAIL // COMPOSE', ''])
  const [sendStatus, setSendStatus] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [stage, log])

  const prompts: Record<Stage, string> = {
    name: 'guest@rio-alfandi:~$ input_name: ',
    email: 'guest@rio-alfandi:~$ input_email: ',
    subject: 'guest@rio-alfandi:~$ input_subject: ',
    message: 'guest@rio-alfandi:~$ input_message: ',
    sending: '',
    sent: '',
  }

  const handleSubmit = async () => {
    if (stage === 'name') {
      if (!current.trim()) return
      setInputs(p => ({ ...p, name: current }))
      setLog(p => [...p, prompts.name + current, ''])
      setCurrent('')
      setStage('email')
    } else if (stage === 'email') {
      if (!current.includes('@')) {
        setLog(p => [...p, '// ERROR: Invalid email format', ''])
        return
      }
      setInputs(p => ({ ...p, email: current }))
      setLog(p => [...p, prompts.email + current, ''])
      setCurrent('')
      setStage('subject')
    } else if (stage === 'subject') {
      if (!current.trim()) return
      setInputs(p => ({ ...p, subject: current }))
      setLog(p => [...p, prompts.subject + current, ''])
      setCurrent('')
      setStage('message')
    } else if (stage === 'message') {
      if (!current.trim()) return
      const finalInputs = { ...inputs, message: current }
      setInputs(finalInputs)
      setLog(p => [...p, prompts.message + current, ''])
      setCurrent('')
      setStage('sending')

      // Send
      const steps = ['ENCRYPTING_DATA...', 'ESTABLISHING_SECURE_CHANNEL...', 'UPLOADING_MESSAGE...']
      for (const step of steps) {
        setSendStatus(step)
        setLog(p => [...p, `> ${step}`])
        await new Promise(r => setTimeout(r, 700))
      }

      try {
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalInputs),
        })

        if (res.ok) {
          setLog(p => [...p, '', '[SUCCESS]: Message delivered to Rio\'s Core.', '// Connection terminated.'])
          setSendStatus('SUCCESS')
          setStage('sent')
          toast.success('Message sent successfully!')
        } else {
          setLog(p => [...p, '[ERROR]: Transmission failed. Try again.'])
          setSendStatus('ERROR')
          setStage('message')
        }
      } catch {
        setLog(p => [...p, '[ERROR]: Network failure. Try again.'])
        setStage('message')
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px', borderRadius: 0 }}
      >
        {/* Window Header */}
        <div className="modal-header">
          <div className="modal-dot" style={{ background: '#ff5f56' }} />
          <div className="modal-dot" style={{ background: '#ffbd2e' }} />
          <div className="modal-dot" style={{ background: '#27c93f' }} />
          <span style={{ marginLeft: '8px' }}>
            SYSTEM_MAIL // TO: {contactEmail}
          </span>
          <button
            onClick={onClose}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'none' }}
          >
            [ESC]
          </button>
        </div>

        {/* Terminal Body */}
        <div
          ref={logRef}
          style={{
            padding: '24px',
            minHeight: '320px',
            maxHeight: '500px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: 1.8,
          }}
        >
          {log.map((line, i) => (
            <div key={i} style={{ color: line.startsWith('[SUCCESS]') ? 'rgba(255,255,255,0.9)' : line.startsWith('[ERROR]') ? 'rgba(255,255,255,0.6)' : line.startsWith('>') ? 'rgba(255,255,255,0.5)' : line.startsWith('//') ? 'rgb(253, 252, 252)' : 'rgba(255,255,255,0.7)' }}>
              {line || '\u00A0'}
            </div>
          ))}

          {/* Active input line */}
          {stage !== 'sending' && stage !== 'sent' && (
            <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
              <span style={{ whiteSpace: 'nowrap' }}>{prompts[stage]}</span>
              <input
                ref={inputRef}
                value={current}
                onChange={e => setCurrent(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  flex: 1,
                  caretColor: 'white',
                }}
              />
            </div>
          )}

          {stage === 'sending' && (
            <div style={{ color: 'rgba(255,255,255,0.5)' }}>&gt; {sendStatus}_</div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
        }}>
          <span>Press ENTER to confirm each field</span>
          {stage !== 'sending' && stage !== 'sent' && (
            <button
              onClick={handleSubmit}
              className="btn-primary"
              style={{ fontSize: '10px', padding: '8px 16px' }}
            >
              [SEND_COMMAND]
            </button>
          )}
          {stage === 'sent' && (
            <button onClick={onClose} className="btn-outline" style={{ fontSize: '10px', padding: '8px 16px' }}>
              CLOSE_TERMINAL
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
