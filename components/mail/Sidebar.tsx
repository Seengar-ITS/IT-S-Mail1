'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mail, Inbox, Star, Send, FileText, AlertTriangle, Trash2, Search, Settings, Users, PenSquare, ChevronDown } from 'lucide-react'
import { SessionUser } from '@/types'
import { formatStorageDisplay } from '@/lib/auth'

interface SidebarProps {
  user: SessionUser
  unreadCount?: number
  draftCount?: number
  onCompose: () => void
}

const navItems = [
  { href: '/mail/inbox', label: 'Inbox', icon: Inbox, key: 'inbox' },
  { href: '/mail/starred', label: 'Starred', icon: Star, key: 'starred' },
  { href: '/mail/sent', label: 'Sent', icon: Send, key: 'sent' },
  { href: '/mail/drafts', label: 'Drafts', icon: FileText, key: 'drafts' },
  { href: '/mail/spam', label: 'Spam', icon: AlertTriangle, key: 'spam' },
  { href: '/mail/trash', label: 'Trash', icon: Trash2, key: 'trash' },
]

export function Sidebar({ user, unreadCount = 0, draftCount = 0, onCompose }: SidebarProps) {
  const pathname = usePathname()
  const storagePercent = Math.min((user.storage_used / user.storage_limit) * 100, 100)

  return (
    <div style={{ width: 240, minWidth: 240, height: '100vh', background: '#0f0f1a', borderRight: '1px solid #2a2a4a', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #2a2a4a' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#f0a500', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={18} color="#0f0f1a" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>IT-S <span style={{ color: '#f0a500' }}>Mail1</span></span>
        </Link>
      </div>

      {/* Compose */}
      <div style={{ padding: '16px 12px' }}>
        <button onClick={onCompose} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 24, background: '#f0a500', color: '#0f0f1a', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'background 0.2s' }}>
          <PenSquare size={18} /> Compose
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0 12px 12px' }}>
        <Link href="/mail/search" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, background: '#16213e', border: '1px solid #2a2a4a', color: '#a0a0b0', textDecoration: 'none', fontSize: 13 }}>
          <Search size={15} /> Search mail...
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {navItems.map(({ href, label, icon: Icon, key }) => {
          const active = pathname === href || (href === '/mail/inbox' && pathname === '/mail')
          const count = key === 'inbox' ? unreadCount : key === 'drafts' ? draftCount : 0
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
              background: active ? '#16213e' : 'transparent',
              color: active ? '#f0a500' : '#a0a0b0',
              textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400,
              marginBottom: 2, transition: 'all 0.15s',
              borderLeft: active ? '3px solid #f0a500' : '3px solid transparent'
            }}>
              <Icon size={18} />
              <span style={{ flex: 1 }}>{label}</span>
              {count > 0 && (
                <span style={{ background: key === 'inbox' ? '#f0a500' : '#2a2a4a', color: key === 'inbox' ? '#0f0f1a' : '#a0a0b0', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 10, minWidth: 20, textAlign: 'center' }}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          )
        })}

        <div style={{ borderTop: '1px solid #2a2a4a', margin: '12px 0', padding: '12px 0 0' }}>
          <div style={{ padding: '8px 14px', fontSize: 11, color: '#a0a0b0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>More</div>
          <Link href="/mail/contacts" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, color: pathname === '/mail/contacts' ? '#f0a500' : '#a0a0b0', background: pathname === '/mail/contacts' ? '#16213e' : 'transparent', textDecoration: 'none', fontSize: 14, marginBottom: 2 }}>
            <Users size={18} /> Contacts
          </Link>
          <Link href="/mail/settings" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, color: pathname === '/mail/settings' ? '#f0a500' : '#a0a0b0', background: pathname === '/mail/settings' ? '#16213e' : 'transparent', textDecoration: 'none', fontSize: 14, marginBottom: 2 }}>
            <Settings size={18} /> Settings
          </Link>
        </div>
      </nav>

      {/* Storage */}
      <div style={{ padding: '16px', borderTop: '1px solid #2a2a4a' }}>
        <div style={{ fontSize: 12, color: '#a0a0b0', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>Storage</span>
          <span>{formatStorageDisplay(user.storage_used)} / {formatStorageDisplay(user.storage_limit)}</span>
        </div>
        <div style={{ height: 4, background: '#2a2a4a', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${storagePercent}%`, background: storagePercent > 80 ? '#ff4444' : '#f0a500', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0a500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#0f0f1a' }}>
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name}</div>
            <div style={{ fontSize: 11, color: '#a0a0b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}@its-mail.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
