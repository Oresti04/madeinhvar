import { NextResponse } from 'next/server'

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  const body = await request.json()
  const { name, email, message } = body as { name?: unknown; email?: unknown; message?: unknown }

  if (typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@yourdomain.com'
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || ''

  if (!notifyEmail) {
    return NextResponse.json({ error: 'Notification email not configured' }, { status: 500 })
  }

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; background:#F7F3EF; color:#222; padding:24px;">
        <h2>New contact message — Made in Hvar</h2>
        <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${escapeHtml(message.trim())}</p>
      </body>
    </html>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
    body: JSON.stringify({
      from: fromEmail,
      to: [notifyEmail],
      reply_to: email,
      subject: `Made in Hvar — Contact from ${name.trim()}`,
      html,
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
