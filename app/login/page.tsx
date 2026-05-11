'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Eye, EyeOff, Lock } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ identifier: '', password: '', remember: false })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.identifier || !form.password) return toast.error('All fields required')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: form.identifier, password: form.password })
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Invalid credentials'); return }
      toast.success('Welcome back!')
      router.push('/mail')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px 12px 44px', background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, background: '#f0a500', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={22} color="#0f0f1a" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>IT-S <span style={{ color: '#f0a500' }}>Mail1</span></span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Welcome back</h1>
          <p style={{ color: '#a0a0b0', fontSize: 14, margin: 0 }}>Sign in to your IT-S Mail1 account</p>
        </div>

        <div style={{ background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 16, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#a0a0b0', marginBottom: 8, fontWeight: 500 }}>Email or Username</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#a0a0b0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.identifier} onChange={e => setForm(f => ({ ...f, identifier: e.target.value }))} placeholder="seengar or seengar@its-mail.com" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#a0a0b0', marginBottom: 8, fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#a0a0b0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Your password" style={{ ...inputStyle, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0b0', padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#a0a0b0' }}>
                <input type="checkbox" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} style={{ accentColor: '#f0a500' }} />
                Remember me
              </label>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 10, background: loading ? '#8a6200' : '#f0a500', color: '#0f0f1a', border: 'none', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#a0a0b0', margin: '24px 0 0' }}>
            New to IT-S Mail1?{' '}
            <Link href="/signup" style={{ color: '#f0a500', textDecoration: 'none', fontWeight: 600 }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
