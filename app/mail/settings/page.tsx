'use client'
import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/mail/Sidebar'
import { ComposeWindow } from '@/components/mail/ComposeWindow'
import { SessionUser, MailSettings } from '@/types'
import { Settings, Save, User, Bell, Reply, Pen } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [settings, setSettings] = useState<Partial<MailSettings>>({})
  const [composing, setComposing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    const [u, s] = await Promise.all([fetch('/api/auth/me'), fetch('/api/settings')])
    if (u.ok) { const d = await u.json(); setUser(d.user) }
    if (s.ok) { const d = await s.json(); setSettings(d.settings || {}) }
    setLoading(false)
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
      if (res.ok) toast.success('Settings saved')
      else toast.error('Failed to save')
    } finally { setSaving(false) }
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: '#0f0f1a', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
  const sectionStyle: React.CSSProperties = { background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 24, marginBottom: 20 }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, color: '#a0a0b0', marginBottom: 8, fontWeight: 500 }

  if (loading || !user) return <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 36, height: 36, border: '3px solid #2a2a4a', borderTop: '3px solid #f0a500', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', overflow: 'hidden' }}>
      <Sidebar user={user} onCompose={() => setComposing(true)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #2a2a4a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Settings size={20} color="#f0a500" />
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Settings</h1>
          </div>
          <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 8, background: '#f0a500', color: '#0f0f1a', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, maxWidth: 720 }}>
          {/* Profile */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <User size={16} color="#f0a500" />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>Profile</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0a500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#0f0f1a' }}>{user.full_name.charAt(0)}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{user.full_name}</div>
                <div style={{ fontSize: 14, color: '#f0a500' }}>{user.username}@its-mail.com</div>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Pen size={16} color="#f0a500" />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>Email Signature</h2>
            </div>
            <label style={labelStyle}>Signature (appended to outgoing emails)</label>
            <textarea value={settings.signature || ''} onChange={e => setSettings(s => ({ ...s, signature: e.target.value }))} placeholder="e.g. Best regards, Seengar Ali" rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Notifications */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Bell size={16} color="#f0a500" />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>Notifications</h2>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div onClick={() => setSettings(s => ({ ...s, notifications_enabled: !s.notifications_enabled }))} style={{ width: 44, height: 24, borderRadius: 12, background: settings.notifications_enabled ? '#f0a500' : '#2a2a4a', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: settings.notifications_enabled ? 23 : 3, transition: 'left 0.2s' }} />
              </div>
              <span style={{ fontSize: 14, color: '#e0e0e0' }}>Email notifications enabled</span>
            </label>
          </div>

          {/* Auto Reply */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Reply size={16} color="#f0a500" />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>Auto Reply</h2>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 16 }}>
              <div onClick={() => setSettings(s => ({ ...s, auto_reply_enabled: !s.auto_reply_enabled }))} style={{ width: 44, height: 24, borderRadius: 12, background: settings.auto_reply_enabled ? '#f0a500' : '#2a2a4a', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: settings.auto_reply_enabled ? 23 : 3, transition: 'left 0.2s' }} />
              </div>
              <span style={{ fontSize: 14, color: '#e0e0e0' }}>Enable auto-reply</span>
            </label>
            {settings.auto_reply_enabled && (
              <div>
                <label style={labelStyle}>Auto-reply message</label>
                <textarea value={settings.auto_reply_message || ''} onChange={e => setSettings(s => ({ ...s, auto_reply_message: e.target.value }))} placeholder="I'm currently out of office..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            )}
          </div>
        </div>
      </div>
      {composing && <ComposeWindow onClose={() => setComposing(false)} />}
    </div>
  )
}
