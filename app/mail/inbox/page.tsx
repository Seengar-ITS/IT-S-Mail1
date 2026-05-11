'use client'
import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/mail/Sidebar'
import { EmailList } from '@/components/mail/EmailList'
import { EmailView } from '@/components/mail/EmailView'
import { ComposeWindow } from '@/components/mail/ComposeWindow'
import { MailMessage, SessionUser } from '@/types'
import { RefreshCw, Inbox } from 'lucide-react'

export default function InboxPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [messages, setMessages] = useState<MailMessage[]>([])
  const [selected, setSelected] = useState<MailMessage | null>(null)
  const [composing, setComposing] = useState(false)
  const [composeDefaults, setComposeDefaults] = useState<{ to?: string; subject?: string }>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [draftCount, setDraftCount] = useState(0)

  const fetchUser = useCallback(async () => {
    const res = await fetch('/api/auth/me')
    if (res.ok) { const data = await res.json(); setUser(data.user) }
  }, [])

  const fetchMessages = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/mail/inbox')
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
        setUnreadCount((data.messages || []).filter((m: MailMessage) => !m.is_read).length)
      }
    } finally { setRefreshing(false); setLoading(false) }
  }, [])

  const fetchDraftCount = useCallback(async () => {
    const res = await fetch('/api/mail/drafts')
    if (res.ok) { const data = await res.json(); setDraftCount((data.messages || []).length) }
  }, [])

  useEffect(() => {
    fetchUser(); fetchMessages(); fetchDraftCount()
  }, [fetchUser, fetchMessages, fetchDraftCount])

  const handleSelect = async (msg: MailMessage) => {
    setSelected(msg)
    if (!msg.is_read) {
      await fetch(`/api/mail/${msg.id}/read`, { method: 'PUT' })
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
      setUnreadCount(c => Math.max(0, c - 1))
    }
  }

  const handleReply = (to: string, subject: string) => {
    setComposeDefaults({ to, subject })
    setComposing(true)
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 40, border: '3px solid #2a2a4a', borderTop: '3px solid #f0a500', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', overflow: 'hidden' }}>
      <Sidebar user={user} unreadCount={unreadCount} draftCount={draftCount} onCompose={() => { setComposeDefaults({}); setComposing(true) }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #2a2a4a', background: '#0f0f1a' }}>
          <Inbox size={20} color="#f0a500" />
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Inbox</h1>
          {unreadCount > 0 && (
            <span style={{ background: '#f0a500', color: '#0f0f1a', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{unreadCount}</span>
          )}
          <div style={{ flex: 1 }} />
          <button onClick={fetchMessages} disabled={refreshing} style={{ width: 34, height: 34, borderRadius: 8, background: 'transparent', border: '1px solid #2a2a4a', color: '#a0a0b0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: selected ? 380 : '100%', minWidth: selected ? 320 : undefined, borderRight: selected ? '1px solid #2a2a4a' : 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.2s' }}>
            <EmailList messages={messages} selectedId={selected?.id} onSelect={handleSelect} onRefresh={fetchMessages} folder="inbox" />
          </div>

          {selected && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <EmailView message={selected} onBack={() => setSelected(null)} onReply={handleReply} onRefresh={fetchMessages} />
            </div>
          )}
        </div>
      </div>

      {composing && (
        <ComposeWindow onClose={() => { setComposing(false); setComposeDefaults({}) }} defaultTo={composeDefaults.to} defaultSubject={composeDefaults.subject} />
      )}
    </div>
  )
}
