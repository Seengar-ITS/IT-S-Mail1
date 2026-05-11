'use client'
import { useState, useEffect, useCallback } from 'react'
import { X, Minus, Maximize2, Minimize2, Paperclip, Send, Bold, Italic, Underline, List } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExt from '@tiptap/extension-underline'
import LinkExt from '@tiptap/extension-link'
import { toast } from 'sonner'

interface ComposeWindowProps {
  onClose: () => void
  defaultTo?: string
  defaultSubject?: string
  defaultBody?: string
  draftId?: string
}

export function ComposeWindow({ onClose, defaultTo = '', defaultSubject = '', defaultBody = '', draftId }: ComposeWindowProps) {
  const [to, setTo] = useState(defaultTo)
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [subject, setSubject] = useState(defaultSubject)
  const [showCc, setShowCc] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [sending, setSending] = useState(false)
  const [currentDraftId, setCurrentDraftId] = useState(draftId)

  const editor = useEditor({
    extensions: [StarterKit, UnderlineExt, LinkExt.configure({ openOnClick: false })],
    content: defaultBody || '<p></p>',
    editorProps: { attributes: { class: 'tiptap-editor-inner' } }
  })

  const saveDraft = useCallback(async () => {
    if (!editor) return
    const body = { to_addresses: to ? [to] : [], cc_addresses: cc ? [cc] : [], subject, body_html: editor.getHTML(), id: currentDraftId }
    const res = await fetch('/api/mail/draft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.id) setCurrentDraftId(data.id)
  }, [editor, to, cc, subject, currentDraftId])

  useEffect(() => {
    const interval = setInterval(saveDraft, 30000)
    return () => clearInterval(interval)
  }, [saveDraft])

  const handleSend = async () => {
    if (!to.trim()) return toast.error('Please add a recipient')
    if (!subject.trim()) return toast.error('Please add a subject')
    setSending(true)
    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_addresses: to.split(',').map((s: string) => s.trim()).filter(Boolean), cc_addresses: cc ? [cc] : [], bcc_addresses: bcc ? [bcc] : [], subject, body_html: editor?.getHTML() || '', body_text: editor?.getText() || '', draft_id: currentDraftId })
      })
      if (res.ok) { toast.success('Email sent!'); onClose() }
      else { const d = await res.json(); toast.error(d.error || 'Send failed') }
    } catch { toast.error('Failed to send email') }
    finally { setSending(false) }
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: 13, outline: 'none', padding: '10px 0' }

  const windowStyle: React.CSSProperties = maximized
    ? { position: 'fixed', inset: '60px 20px 20px', zIndex: 1000, background: '#16213e', borderRadius: 12, border: '1px solid #2a2a4a', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }
    : { position: 'fixed', bottom: 0, right: 24, width: 520, zIndex: 1000, background: '#16213e', borderRadius: '12px 12px 0 0', border: '1px solid #2a2a4a', borderBottom: 'none', display: minimized ? 'block' : 'flex', flexDirection: 'column', boxShadow: '0 -4px 30px rgba(0,0,0,0.4)' }

  return (
    <div style={windowStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#1a1a2e', borderRadius: minimized ? 12 : '12px 12px 0 0', cursor: 'pointer' }} onClick={() => minimized && setMinimized(false)}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>New Message</span>
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={saveDraft} style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#a0a0b0', fontSize: 11 }}>Draft</button>
          <button onClick={() => setMinimized(v => !v)} style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#a0a0b0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
          <button onClick={() => setMaximized(v => !v)} style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#a0a0b0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#a0a0b0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Fields */}
          <div style={{ borderBottom: '1px solid #2a2a4a', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #2a2a4a', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#a0a0b0', width: 24, flexShrink: 0 }}>To</span>
              <input value={to} onChange={e => setTo(e.target.value)} placeholder="Recipients" style={inputStyle} />
              <button onClick={() => setShowCc(v => !v)} style={{ fontSize: 12, color: '#a0a0b0', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>Cc Bcc</button>
            </div>
            {showCc && <>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #2a2a4a', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#a0a0b0', width: 24 }}>Cc</span>
                <input value={cc} onChange={e => setCc(e.target.value)} placeholder="Cc" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #2a2a4a', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#a0a0b0', width: 24 }}>Bcc</span>
                <input value={bcc} onChange={e => setBcc(e.target.value)} placeholder="Bcc" style={inputStyle} />
              </div>
            </>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#a0a0b0', width: 24 }}>Sub</span>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" style={{ ...inputStyle, fontWeight: 600 }} />
            </div>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 2, padding: '8px 12px', borderBottom: '1px solid #2a2a4a' }}>
            {[
              { label: <Bold size={14} />, action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
              { label: <Italic size={14} />, action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
              { label: <Underline size={14} />, action: () => editor?.chain().focus().toggleUnderline().run(), active: editor?.isActive('underline') },
              { label: <List size={14} />, action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
            ].map((btn, i) => (
              <button key={i} onClick={btn.action} style={{ width: 28, height: 28, borderRadius: 4, background: btn.active ? '#2a2a4a' : 'transparent', border: 'none', cursor: 'pointer', color: btn.active ? '#f0a500' : '#a0a0b0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {btn.label}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="tiptap-editor" style={{ flex: 1, padding: '12px 16px', overflow: 'auto', minHeight: maximized ? 300 : 160, maxHeight: maximized ? undefined : 220, color: '#fff', fontSize: 14 }}>
            <EditorContent editor={editor} />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderTop: '1px solid #2a2a4a' }}>
            <button onClick={handleSend} disabled={sending} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 20, background: sending ? '#8a6200' : '#f0a500', color: '#0f0f1a', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700 }}>
              <Send size={15} /> {sending ? 'Sending...' : 'Send'}
            </button>
            <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#a0a0b0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paperclip size={16} />
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6a6a8a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
