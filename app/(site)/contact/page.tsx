"use client"
import { useState } from 'react'

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
      body: JSON.stringify({ name, email, message }),
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

  return (
    <section>
      <h1 className="text-2xl font-serif mb-4">Contact</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-muted">Email: hello@madeinhvar.com</p>
          <p className="mt-2">Phone: +385 99 000 0000</p>

          {status === 'success' ? (
            <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
              Message sent! We will get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-3 max-w-md">
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
                required
              />
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                required
              />
              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="field min-h-[160px] resize-none"
                required
              />
              {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>

        <div>
          <iframe
            title="Hvar map"
            src="https://www.google.com/maps?q=Hvar,+Croatia&output=embed"
            className="w-full h-64 rounded"
          />
        </div>
      </div>
    </section>
  )
}
