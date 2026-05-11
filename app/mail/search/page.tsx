'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Sidebar } from '@/components/mail/Sidebar'
import { EmailList } from '@/components/mail/EmailList'
import { EmailView } from '@/components/mail/EmailView'
import { ComposeWindow } from '@/components/mail/ComposeWindow'
import { MailMessage, SessionUser } from '@/types'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MailMessage[]>([])
  const [selected, setSelected] = useState<MailMessage | null>(null)
  const [composing, setComposing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => d && setUser(d.user))
    inputRef.current?.focus()
  }, [])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return }
    setLoading(true); setSearched(true)
    try {
      const res = await fetch(`/api/mail/search?q=${encodeURIComponent(q)}`)
      if (res.ok) { const d = await res.json(); setResults(d.messages || []) }
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 400)
    return () => clearTimeout(t)
  }, [query, doSearch])

  if (!user) return <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 36, height: 36, border: '3px solid #2a2a4a', borderTop: '3px solid #f0a500', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', overflow: 'hidden' }}>
      <Sidebar user={user} onCompose={() => setComposing(true)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #2a2a4a' }}>
          <div style={{ position: 'relative', maxWidth: 600 }}>
            <Search size={18} color="#a0a0b0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search emails..." style={{ width: '100%', padding: '12px 16px 12px 44px', background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {searched && !loading && <p style={{ margin: '8px 0 0', fontSize: 13, color: '#a0a0b0' }}>{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</p>}
        </div>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: selected ? 380 : '100%', borderRight: selected ? '1px solid #2a2a4a' : 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#a0a0b0' }}>Searching...</div>
            ) : (
              <EmailList messages={results} selectedId={selected?.id} onSelect={setSelected} onRefresh={() => doSearch(query)} folder="search" />
            )}
          </div>
          {selected && <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}><EmailView message={selected} onBack={() => setSelected(null)} onReply={() => setComposing(true)} onRefresh={() => doSearch(query)} /></div>}
        </div>
      </div>
      {composing && <ComposeWindow onClose={() => setComposing(false)} />}
    </div>
  )
}
