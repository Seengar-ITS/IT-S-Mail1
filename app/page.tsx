import Link from 'next/link'
import { Mail, Shield, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  { icon: Mail, title: 'Smart Inbox', desc: 'AI-powered email organisation that keeps what matters at the top.' },
  { icon: Shield, title: 'Bank-Level Security', desc: 'End-to-end encrypted. Your data never leaves your control.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Built on modern infrastructure for instant, responsive performance.' },
  { icon: Globe, title: '999+ Services', desc: 'One account. Access everything in the IT-S Universe ecosystem.' },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', color: '#fff' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #2a2a4a', position: 'sticky', top: 0, background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(10px)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, background: '#f0a500', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={20} color="#0f0f1a" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>IT-S <span style={{ color: '#f0a500' }}>Mail1</span></span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login" style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #2a2a4a', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Sign In</Link>
          <Link href="/signup" style={{ padding: '10px 20px', borderRadius: 8, background: '#f0a500', color: '#0f0f1a', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Create Account</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 40px 80px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 20, padding: '6px 16px', marginBottom: 32, fontSize: 13, color: '#a0a0b0' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f0a500', display: 'inline-block' }} />
          Now live — your premium email experience
        </div>
        <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
          Email,<br /><span style={{ color: '#f0a500' }}>Reimagined.</span>
        </h1>
        <p style={{ fontSize: 20, color: '#a0a0b0', lineHeight: 1.6, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
          IT-S Mail1 is a world-class email platform built for the IT-S Universe. Get your own @its-mail.com address and experience email the way it should be.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 12, background: '#f0a500', color: '#0f0f1a', textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
            Get Your Free Account <ArrowRight size={18} />
          </Link>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 12, border: '1px solid #2a2a4a', color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}>
            Sign In
          </Link>
        </div>
        <div style={{ marginTop: 48, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['15 GB free storage', 'username@its-mail.com', 'No ads, ever'].map(text => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a0a0b0', fontSize: 14 }}>
              <CheckCircle size={16} color="#f0a500" /> {text}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 60 }}>Built for the <span style={{ color: '#f0a500' }}>IT-S Universe</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 16, padding: 32, transition: 'border-color 0.2s' }}>
              <div style={{ width: 48, height: 48, background: 'rgba(240,165,0,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon size={24} color="#f0a500" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
              <p style={{ color: '#a0a0b0', lineHeight: 1.6, fontSize: 14, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '60px 40px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, #16213e, #1a1a2e)', border: '1px solid #2a2a4a', borderRadius: 24, padding: '60px 40px' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Ready to upgrade your inbox?</h2>
          <p style={{ color: '#a0a0b0', fontSize: 16, marginBottom: 32 }}>Join IT-S Universe. Get your @its-mail.com address today.</p>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 12, background: '#f0a500', color: '#0f0f1a', textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2a2a4a', padding: '32px 40px', textAlign: 'center', color: '#a0a0b0', fontSize: 13 }}>
        <p style={{ margin: 0 }}>© 2026 IT-S Universe. All rights reserved. IT-S Mail1 — Email, Reimagined.</p>
      </footer>
    </div>
  )
}
