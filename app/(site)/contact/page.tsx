"use client"
import { useState } from 'react'

const NAME_MAX = 100
const MESSAGE_MAX = 1000

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
    })

    if (res.ok) {
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } else {
      const data = await res.json().catch(() => ({}))
      setErrorMsg(data.error || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const msgPct = message.length / MESSAGE_MAX
  const msgCountColor = msgPct >= 1 ? 'text-red-500' : msgPct >= 0.8 ? 'text-terracotta' : 'text-muted'

  return (
    <section className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif mb-3">Get in touch</h1>
        <p className="text-muted text-lg">We'd love to hear from you. Send us a message and we'll get back to you shortly.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* Contact form */}
        <div className="card p-6 no-hover-card">
          <h2 className="text-xl font-serif mb-5">Send a message</h2>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
              <div className="text-3xl">✓</div>
              <p className="font-medium">Message sent!</p>
              <p className="text-muted text-sm">We'll get back to you shortly.</p>
              <button onClick={() => setStatus('idle')} className="btn btn-secondary text-sm mt-2">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-3">
              <input
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="field"
                required
                minLength={2}
                maxLength={NAME_MAX}
                autoComplete="name"
                pattern="[A-Za-zÀ-ɏ '\-]{2,}"
                title="Name must be at least 2 characters and contain only letters, spaces, hyphens or apostrophes"
              />
              <input
                placeholder="Email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="field"
                required
                maxLength={100}
                autoComplete="email"
                inputMode="email"
              />
              <div>
                <textarea
                  placeholder="Your message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="field min-h-[140px] resize-none"
                  required
                  minLength={10}
                  maxLength={MESSAGE_MAX}
                />
                <p className={`text-xs mt-1 text-right ${msgCountColor}`}>
                  {message.length} / {MESSAGE_MAX}
                </p>
              </div>
              {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact info + map */}
        <div className="flex flex-col gap-4 h-full">
          <div className="card p-4 no-hover-card">
            <h2 className="text-lg font-serif mb-3">Find us</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-terracotta text-xs">&#9679;</span>
                <span className="text-muted">Trg svetog Stjepana 18, 21450 Hvar, Croatia</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-terracotta text-xs">&#9679;</span>
                <a href="tel:+38598168786" className="text-muted hover:text-terracotta transition-colors">+385 98 168 7864</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-terracotta text-xs">&#9679;</span>
                <a href="mailto:madeinhvar@gmail.com" className="text-muted hover:text-terracotta transition-colors">madeinhvar@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-terracotta text-xs">&#9679;</span>
                <a href="https://instagram.com/madeinhvar" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-terracotta transition-colors">@madeinhvar</a>
              </li>
            </ul>
          </div>

          <div className="flex-1 rounded-2xl overflow-hidden border border-black/6 shadow-sm min-h-[180px]">
            <iframe
              title="Made in Hvar location"
              src="https://maps.google.com/maps?q=Trg+svetog+Stjepana+18,+21450+Hvar,+Croatia&output=embed&hl=en"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: '180px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  )
}
