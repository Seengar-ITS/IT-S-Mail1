'use client'
import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/mail/Sidebar'
import { ComposeWindow } from '@/components/mail/ComposeWindow'
import { SessionUser, MailContact } from '@/types'
import { Users, Plus, Search, Trash2, Mail, X } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactsPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [contacts, setContacts] = useState<MailContact[]>([])
  const [query, setQuery] = useState('')
  const [composing, setComposing] = useState(false)
  const [composeToEmail, setComposeToEmail] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const fetch_ = useCallback(async () => {
    const [u, c] = await Promise.all([fetch('/api/auth/me'), fetch('/api/contacts')])
    if (u.ok) { const d = await u.json(); setUser(d.user) }
    if (c.ok) { const d = await c.json(); setContacts(d.contacts || []) }
    setLoading(false)
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  const addContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContact.name || !newContact.email) return toast.error('Name and email required')
    setAdding(true)
    try {
      const res = await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newContact) })
      if (res.ok) { toast.success('Contact added'); setNewContact({ name: '', email: '' }); setShowAdd(false); fetch_() }
      else { const d = await res.json(); toast.error(d.error || 'Failed to add') }
    } finally { setAdding(false) }
  }

  const deleteContact = async (id: string) => {
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    setContacts(prev => prev.filter(c => c.id !== id))
    toast.success('Contact removed')
  }

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()))

  if (loading || !user) return <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 36, height: 36, border: '3px solid #2a2a4a', borderTop: '3px solid #f0a500', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', overflow: 'hidden' }}>
      <Sidebar user={user} onCompose={() => setComposing(true)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #2a2a4a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Users size={20} color="#f0a500" />
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Contacts</h1>
            <span style={{ background: '#2a2a4a', color: '#a0a0b0', fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>{contacts.length}</span>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 8, background: '#f0a500', color: '#0f0f1a', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
            <Plus size={15} /> Add Contact
          </button>
        </div>

        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a4a' }}>
          <div style={{ position: 'relative', maxWidth: 400 }}>
            <Search size={16} color="#a0a0b0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search contacts..." style={{ width: '100%', padding: '10px 14px 10px 38px', background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#a0a0b0', padding: 60 }}>
              <Users size={48} color="#2a2a4a" />
              <p style={{ fontSize: 15, margin: 0 }}>{query ? 'No contacts found' : 'No contacts yet'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, padding: 20 }}>
              {filtered.map(c => (
                <div key={c.id} style={{ background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `hsl(${c.name.charCodeAt(0) * 11 % 360}, 60%, 40%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: '#a0a0b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => { setComposeToEmail(c.email); setComposing(true) }} style={{ width: 30, height: 30, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#a0a0b0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={14} /></button>
                    <button onClick={() => deleteContact(c.id)} style={{ width: 30, height: 30, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6a6a8a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 16, padding: 32, width: '100%', maxWidth: 400 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Add Contact</h2>
              <button onClick={() => setShowAdd(false)} style={{ width: 30, height: 30, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#a0a0b0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <form onSubmit={addContact}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#a0a0b0', marginBottom: 8 }}>Full Name</label>
                <input value={newContact.name} onChange={e => setNewContact(n => ({ ...n, name: e.target.value }))} placeholder="John Doe" style={{ width: '100%', padding: '10px 14px', background: '#0f0f1a', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#a0a0b0', marginBottom: 8 }}>Email Address</label>
                <input value={newContact.email} onChange={e => setNewContact(n => ({ ...n, email: e.target.value }))} placeholder="john@example.com" type="email" style={{ width: '100%', padding: '10px 14px', background: '#0f0f1a', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '11px', borderRadius: 8, background: 'transparent', border: '1px solid #2a2a4a', color: '#a0a0b0', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
                <button type="submit" disabled={adding} style={{ flex: 1, padding: '11px', borderRadius: 8, background: '#f0a500', color: '#0f0f1a', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>{adding ? 'Adding...' : 'Add Contact'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {composing && <ComposeWindow onClose={() => { setComposing(false); setComposeToEmail('') }} defaultTo={composeToEmail} />}
    </div>
  )
}
