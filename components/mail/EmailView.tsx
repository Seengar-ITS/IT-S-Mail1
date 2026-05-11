'use client'
import { useState } from 'react'
import { MailMessage } from '@/types'
import { ArrowLeft, Reply, ReplyAll, Forward, Star, Trash2, MoreHorizontal, X } from 'lucide-react'
import { toast } from 'sonner'

interface EmailViewProps {
  message: MailMessage
  onBack: () => void
  onReply: (to: string, subject: string) => void
  onRefresh: () => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getInitial(addr: string) {
  return (addr.split('@')[0] || 'U').charAt(0).toUpperCase()
}

export function EmailView({ message, onBack, onReply, onRefresh }: EmailViewProps) {
  const [starred, setStarred] = useState(message.is_starred)

  const toggleStar = async () => {
    await fetch(`/api/mail/${message.id}/star`, { method: 'PUT' })
    setStarred(v => !v)
    onRefresh()
  }

  const moveToTrash = async () => {
    await fetch(`/api/mail/${message.id}/trash`, { method: 'PUT' })
    toast.success('Moved to trash')
    onBack()
    onRefresh()
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeIn 0.15s ease' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderBottom: '1px solid #2a2a4a', background: '#0f0f1a' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: 'transparent', border: '1px solid #2a2a4a', color: '#a0a0b0', cursor: 'pointer', fontSize: 13 }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={toggleStar} style={{ width: 34, height: 34, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: starred ? '#f0a500' : '#6a6a8a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Star size={17} fill={starred ? '#f0a500' : 'none'} />
        </button>
        <button onClick={moveToTrash} style={{ width: 34, height: 34, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6a6a8a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trash2 size={17} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        {/* Subject */}
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 24, lineHeight: 1.3 }}>{message.subject}</h1>

        {/* Sender info */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '20px', background: '#16213e', borderRadius: 12, marginBottom: 24, border: '1px solid #2a2a4a' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: `hsl(${message.from_address.charCodeAt(0) * 11 % 360}, 60%, 40%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {getInitial(message.from_address)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
              <div>
                <span style={{ fontWeight: 600, color: '#fff', fontSize: 15 }}>{message.from_address.split('@')[0]}</span>
                <span style={{ color: '#a0a0b0', fontSize: 13, marginLeft: 8 }}>&lt;{message.from_address}&gt;</span>
              </div>
              <span style={{ color: '#6a6a8a', fontSize: 12, flexShrink: 0 }}>{formatDate(message.created_at)}</span>
            </div>
            <div style={{ fontSize: 12, color: '#6a6a8a' }}>
              To: {message.to_addresses.join(', ')}
              {message.cc_addresses?.length ? ` · CC: ${message.cc_addresses.join(', ')}` : ''}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', background: '#16213e', borderRadius: 12, border: '1px solid #2a2a4a', marginBottom: 24, lineHeight: 1.7, color: '#e0e0e0', fontSize: 14 }}>
          {message.body_html ? (
            <div dangerouslySetInnerHTML={{ __html: message.body_html }} />
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', margin: 0 }}>{message.body_text}</pre>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { icon: Reply, label: 'Reply', action: () => onReply(message.from_address, `Re: ${message.subject}`) },
            { icon: ReplyAll, label: 'Reply All', action: () => onReply(message.from_address, `Re: ${message.subject}`) },
            { icon: Forward, label: 'Forward', action: () => onReply('', `Fwd: ${message.subject}`) },
          ].map(({ icon: Icon, label, action }) => (
            <button key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: '#16213e', border: '1px solid #2a2a4a', color: '#e0e0e0', cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'border-color 0.15s' }}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
