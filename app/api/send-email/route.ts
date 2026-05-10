import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    // 1. Save to database
    const supabase = createAdminClient()
    await supabase.from('messages').insert({
      sender_name: name,
      sender_email: email,
      subject,
      message,
      is_read: false,
    })

    // 2. Send email via Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL || 'riiooalfandi@gmail.com',
      reply_to: email,
      subject: `[PORTFOLIO] ${subject}`,
      html: `
        <div style="background:#000;color:#fff;padding:32px;font-family:'Courier New',monospace;max-width:600px;">
          <div style="border:1px solid #333;padding:24px;">
            <div style="color:#555;font-size:11px;letter-spacing:0.2em;margin-bottom:20px;">
              // INCOMING_MESSAGE // PORTFOLIO_SYSTEM
            </div>
            
            <div style="margin-bottom:16px;">
              <div style="color:#555;font-size:10px;letter-spacing:0.15em;margin-bottom:4px;">FROM</div>
              <div style="color:#fff;font-size:14px;">${name} &lt;${email}&gt;</div>
            </div>
            
            <div style="margin-bottom:16px;">
              <div style="color:#555;font-size:10px;letter-spacing:0.15em;margin-bottom:4px;">SUBJECT</div>
              <div style="color:#fff;font-size:14px;">${subject}</div>
            </div>
            
            <div style="margin-bottom:24px;">
              <div style="color:#555;font-size:10px;letter-spacing:0.15em;margin-bottom:4px;">MESSAGE</div>
              <div style="color:#ccc;font-size:14px;line-height:1.8;white-space:pre-wrap;">${message}</div>
            </div>
            
            <div style="border-top:1px solid #222;padding-top:16px;font-size:10px;color:#444;letter-spacing:0.1em;">
              Sent from your portfolio website at ${new Date().toISOString()}
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
