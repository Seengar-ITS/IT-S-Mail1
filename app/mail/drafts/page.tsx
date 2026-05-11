'use client'
import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/mail/Sidebar'
import { ComposeWindow } from '@/components/mail/ComposeWindow'
import { SessionUser, MailDraft } from '@/types'
import { FileText, Pencil, Trash2, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function DraftsPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [drafts, setDrafts] = useState<MailDraft[]>([])
  const [composing, setComposing] = useState(false)
  const [editDraft, setEditDraft] = useState<MailDraft | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    const [u, d] = await Promise.all([fetch('/api/auth/me'), fetch('/api/mail/drafts')])
    if (u.ok) { const ud = await u.json(); setUser(ud.user) }
    if (d.ok) { const dd = await d.json(); setDrafts(dd.messages || []) }
    setLoading(false)
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  const deleteDraft = async (id: string) => {
    await fetch(`/api/mail/${id}`, { method: 'DELETE' })
    setDrafts(prev => prev.filter(d => d.id !== id))
    toast.success('Draft deleted')
  }

  if (loading || !user) return <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 36, height: 36, border: '3px solid #2a2a4a', borderTop: '3px solid #f0a500', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', overflow: 'hidden' }}>
      <Sidebar user={user} draftCount={drafts.length} onCompose={() => { setEditDraft(null); setComposing(true) }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #2a2a4a' }}>
          <FileText size={20} color="#f0a500" />
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Drafts</h1>
          {drafts.length > 0 && <span style={{ background: '#2a2a4a', color: '#a0a0b0', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{drafts.length}</span>}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {drafts.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#a0a0b0', padding: 60 }}>
              <Mail size={48} color="#2a2a4a" /><p style={{ fontSize: 16, margin: 0 }}>No drafts</p>
            </div>
          ) : drafts.map(d => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #1a1a2e', cursor: 'pointer', transition: 'background 0.1s' }}
              onClick={() => { setEditDraft(d); setComposing(true) }}>
              <Pencil size={16} color="#a0a0b0" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{d.subject || '(no subject)'}</div>
                <div style={{ fontSize: 12, color: '#a0a0b0' }}>To: {d.to_addresses?.join(', ') || '(no recipient)'}</div>
              </div>
              <div style={{ fontSize: 12, color: '#6a6a8a' }}>{new Date(d.updated_at).toLocaleDateString()}</div>
              <button onClick={e => { e.stopPropagation(); deleteDraft(d.id) }} style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6a6a8a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      {composing && <ComposeWindow onClose={() => { setComposing(false); setEditDraft(null); fetch_() }} defaultTo={editDraft?.to_addresses?.join(', ')} defaultSubject={editDraft?.subject || ''} defaultBody={editDraft?.body_html || ''} draftId={editDraft?.id} />}
    </div>
  )
}
