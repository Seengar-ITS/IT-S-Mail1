export interface MailUser {
  id: string
  email: string
  username: string
  full_name: string
  password_hash?: string
  avatar_url?: string
  account_status: string
  email_verified: boolean
  storage_used: number
  storage_limit: number
  created_at: string
  updated_at: string
}

export interface MailMessage {
  id: string
  from_address: string
  to_addresses: string[]
  cc_addresses?: string[]
  bcc_addresses?: string[]
  subject: string
  body_text?: string
  body_html?: string
  is_read: boolean
  is_starred: boolean
  is_draft: boolean
  is_sent: boolean
  is_deleted: boolean
  is_spam: boolean
  folder: string
  thread_id?: string
  owner_id: string
  attachments?: Attachment[]
  created_at: string
  updated_at: string
}

export interface Attachment {
  name: string
  size: number
  type: string
  url?: string
}

export interface MailThread {
  id: string
  subject: string
  participants: string[]
  last_message_at: string
  owner_id: string
  is_read: boolean
  is_starred: boolean
  created_at: string
  messages?: MailMessage[]
}

export interface MailLabel {
  id: string
  name: string
  color: string
  owner_id: string
  created_at: string
}

export interface MailContact {
  id: string
  owner_id: string
  name: string
  email: string
  avatar_url?: string
  created_at: string
}

export interface MailDraft {
  id: string
  owner_id: string
  to_addresses?: string[]
  cc_addresses?: string[]
  subject?: string
  body_html?: string
  attachments?: Attachment[]
  updated_at: string
  created_at: string
}

export interface MailSettings {
  id: string
  owner_id: string
  signature?: string
  theme: string
  notifications_enabled: boolean
  auto_reply_enabled: boolean
  auto_reply_message?: string
  created_at: string
}

export interface SessionUser {
  id: string
  email: string
  username: string
  full_name: string
  avatar_url?: string
  storage_used: number
  storage_limit: number
}
