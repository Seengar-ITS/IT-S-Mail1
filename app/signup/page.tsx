'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Eye, EyeOff, User, Lock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Special char', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ['#ff4444', '#ff8800', '#f0a500', '#00cc88']
  if (!password) return null
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < score ? colors[score - 1] : '#2a2a4a', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {checks.map(c => (
          <span key={c.label} style={{ fontSize: 11, color: c.pass ? '#00cc88' : '#a0a0b0', display: 'flex', alignItems: 'center', gap: 3 }}>
            <CheckCircle size={10} color={c.pass ? '#00cc88' : '#a0a0b0'} /> {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.name === 'username' ? e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '') : e.target.value
    setForm(f => ({ ...f, [e.target.name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.username || !form.password) return toast.error('All fields required')
    if (form.password.length < 8) return toast.error('Password must be 8+ characters')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Signup failed'); return }
      toast.success('Account created! Welcome to IT-S Mail1')
      router.push('/mail')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px 12px 44px', background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, color: '#a0a0b0', marginBottom: 8, fontWeight: 500 }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, background: '#f0a500', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={22} color="#0f0f1a" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>IT-S <span style={{ color: '#f0a500' }}>Mail1</span></span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Create your account</h1>
          <p style={{ color: '#a0a0b0', fontSize: 14, margin: 0 }}>Get your free @its-mail.com address</p>
        </div>

        <div style={{ background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 16, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#a0a0b0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Seengar Ali" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0a0b0', fontSize: 14 }}>@</span>
                <input name="username" value={form.username} onChange={handleChange} placeholder="seengar" style={{ ...inputStyle, paddingLeft: 36 }} />
              </div>
              {form.username && (
                <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(240,165,0,0.1)', border: '1px solid rgba(240,165,0,0.3)', borderRadius: 8 }}>
                  <span style={{ fontSize: 13, color: '#f0a500', fontWeight: 600 }}>{form.username}@its-mail.com</span>
                  <span style={{ fontSize: 12, color: '#a0a0b0', marginLeft: 8 }}>— your email address</span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#a0a0b0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Create a strong password" style={{ ...inputStyle, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0b0', padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 10, background: loading ? '#8a6200' : '#f0a500', color: '#0f0f1a', border: 'none', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#a0a0b0', margin: '24px 0 0' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#f0a500', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
