'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/mail/Sidebar'
import { EmailView } from '@/components/mail/EmailView'
import { ComposeWindow } from '@/components/mail/ComposeWindow'
import { MailMessage, SessionUser } from '@/types'

export default function EmailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [message, setMessage] = useState<MailMessage | null>(null)
  const [composing, setComposing] = useState(false)
  const [composeDefaults, setComposeDefaults] = useState<{ to?: string; subject?: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [u, m] = await Promise.all([fetch('/api/auth/me'), fetch(`/api/mail/${id}/read`, { method: 'PUT' }).then(() => fetch(`/api/mail/inbox`))])
      if (u.ok) { const d = await u.json(); setUser(d.user) }
      if (m.ok) { const d = await m.json(); const msg = (d.messages || []).find((x: MailMessage) => x.id === id); if (msg) setMessage(msg) }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading || !user) return <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 36, height: 36, border: '3px solid #2a2a4a', borderTop: '3px solid #f0a500', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', overflow: 'hidden' }}>
      <Sidebar user={user} onCompose={() => setComposing(true)} />
      {message ? (
        <EmailView message={message} onBack={() => router.push('/mail/inbox')} onReply={(to, subject) => { setComposeDefaults({ to, subject }); setComposing(true) }} onRefresh={() => {}} />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a0b0' }}>Message not found</div>
      )}
      {composing && <ComposeWindow onClose={() => setComposing(false)} defaultTo={composeDefaults.to} defaultSubject={composeDefaults.subject} />}
    </div>
  )
}
