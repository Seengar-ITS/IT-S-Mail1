'use client'
import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/mail/Sidebar'
import { EmailList } from '@/components/mail/EmailList'
import { EmailView } from '@/components/mail/EmailView'
import { ComposeWindow } from '@/components/mail/ComposeWindow'
import { MailMessage, SessionUser } from '@/types'
import { Star } from 'lucide-react'

export default function StarredPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [messages, setMessages] = useState<MailMessage[]>([])
  const [selected, setSelected] = useState<MailMessage | null>(null)
  const [composing, setComposing] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    const [u, m] = await Promise.all([fetch('/api/auth/me'), fetch('/api/mail/starred')])
    if (u.ok) { const d = await u.json(); setUser(d.user) }
    if (m.ok) { const d = await m.json(); setMessages(d.messages || []) }
    setLoading(false)
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  if (loading || !user) return <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 36, height: 36, border: '3px solid #2a2a4a', borderTop: '3px solid #f0a500', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', overflow: 'hidden' }}>
      <Sidebar user={user} onCompose={() => setComposing(true)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #2a2a4a' }}>
          <Star size={20} color="#f0a500" fill="#f0a500" />
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Starred</h1>
        </div>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: selected ? 380 : '100%', borderRight: selected ? '1px solid #2a2a4a' : 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <EmailList messages={messages} selectedId={selected?.id} onSelect={setSelected} onRefresh={fetch_} folder="starred" />
          </div>
          {selected && <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}><EmailView message={selected} onBack={() => setSelected(null)} onReply={() => setComposing(true)} onRefresh={fetch_} /></div>}
        </div>
      </div>
      {composing && <ComposeWindow onClose={() => setComposing(false)} />}
    </div>
  )
}
