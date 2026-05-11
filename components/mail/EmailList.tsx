'use client'
import { useState } from 'react'
import { MailMessage } from '@/types'
import { Star, Trash2, Archive, Mail } from 'lucide-react'
import { toast } from 'sonner'

function timeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getInitial(addr: string) {
  return (addr.split('@')[0] || 'U').charAt(0).toUpperCase()
}

interface EmailListProps {
  messages: MailMessage[]
  selectedId?: string
  onSelect: (msg: MailMessage) => void
  onRefresh: () => void
  folder?: string
}

export function EmailList({ messages, selectedId, onSelect, onRefresh, folder = 'inbox' }: EmailListProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const bulkAction = async (action: 'trash' | 'read' | 'star' | 'spam') => {
    const ids = Array.from(selected)
    if (!ids.length) return
    await Promise.all(ids.map(id =>
      fetch(`/api/mail/${id}/${action === 'trash' ? 'trash' : action === 'spam' ? 'spam' : action}`, { method: 'PUT' })
    ))
    setSelected(new Set())
    onRefresh()
    toast.success(`${ids.length} email(s) updated`)
  }

  const toggleStar = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await fetch(`/api/mail/${id}/star`, { method: 'PUT' })
    onRefresh()
  }

  const deleteEmail = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await fetch(`/api/mail/${id}/trash`, { method: 'PUT' })
    onRefresh()
    toast.success('Moved to trash')
  }

  if (!messages.length) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#a0a0b0' }}>
        <Mail size={48} color="#2a2a4a" />
        <p style={{ fontSize: 16, margin: 0 }}>No messages in {folder}</p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Bulk toolbar */}
      {selected.size > 0 && (
        <div style={{ padding: '8px 16px', background: '#16213e', borderBottom: '1px solid #2a2a4a', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#a0a0b0', marginRight: 8 }}>{selected.size} selected</span>
          <button onClick={() => bulkAction('read')} style={{ padding: '6px 12px', borderRadius: 6, background: '#2a2a4a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}>Mark Read</button>
          <button onClick={() => bulkAction('star')} style={{ padding: '6px 12px', borderRadius: 6, background: '#2a2a4a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}>Star</button>
          <button onClick={() => bulkAction('spam')} style={{ padding: '6px 12px', borderRadius: 6, background: '#2a2a4a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}>Spam</button>
          <button onClick={() => bulkAction('trash')} style={{ padding: '6px 12px', borderRadius: 6, background: '#ff4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}>Delete</button>
          <button onClick={() => setSelected(new Set())} style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: 6, background: 'transparent', color: '#a0a0b0', border: '1px solid #2a2a4a', cursor: 'pointer', fontSize: 12 }}>Clear</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map(msg => {
          const isChecked = selected.has(msg.id)
          const isActive = selectedId === msg.id
          const isHovered = hoveredId === msg.id
          const displayAddr = folder === 'sent' ? msg.to_addresses[0] : msg.from_address
          return (
            <div
              key={msg.id}
              onClick={() => onSelect(msg)}
              onMouseEnter={() => setHoveredId(msg.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                cursor: 'pointer', borderBottom: '1px solid #1a1a2e',
                background: isActive ? '#1e2a3e' : isChecked ? 'rgba(240,165,0,0.05)' : isHovered ? '#16213e' : 'transparent',
                transition: 'background 0.1s',
                position: 'relative'
              }}
            >
              <div onClick={e => toggleSelect(e, msg.id)} style={{ width: 18, height: 18, border: `2px solid ${isChecked ? '#f0a500' : '#2a2a4a'}`, borderRadius: 4, background: isChecked ? '#f0a500' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                {isChecked && <span style={{ color: '#0f0f1a', fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>

              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${displayAddr.charCodeAt(0) * 11 % 360}, 60%, 40%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {getInitial(displayAddr)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: msg.is_read ? 400 : 700, color: msg.is_read ? '#a0a0b0' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayAddr.split('@')[0]}
                  </span>
                  <span style={{ fontSize: 12, color: '#a0a0b0', flexShrink: 0 }}>{timeAgo(msg.created_at)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                  <span style={{ fontSize: 13, fontWeight: msg.is_read ? 400 : 600, color: msg.is_read ? '#a0a0b0' : '#e0e0e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                    {msg.subject}
                  </span>
                  <span style={{ fontSize: 12, color: '#6a6a8a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    — {(msg.body_text || '').slice(0, 60)}
                  </span>
                </div>
              </div>

              {(isHovered || msg.is_starred) && (
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={e => toggleStar(e, msg.id)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: msg.is_starred ? '#f0a500' : '#6a6a8a' }}>
                    <Star size={15} fill={msg.is_starred ? '#f0a500' : 'none'} />
                  </button>
                  {isHovered && (
                    <button onClick={e => deleteEmail(e, msg.id)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6a6a8a' }}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              )}

              {!msg.is_read && !isChecked && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f0a500', flexShrink: 0 }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
