import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { createSession } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

const schema = z.object({
  full_name: z.string().min(2).max(100),
  username: z.string().min(2).max(30).regex(/^[a-z0-9._]+$/),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, username, password } = schema.parse(body)

    const email = `${username}@its-mail.com`

    const { data: existing } = await supabaseAdmin
      .from('mail_users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }

    const password_hash = await bcrypt.hash(password, 12)

    const { data: user, error } = await supabaseAdmin
      .from('mail_users')
      .insert({ full_name, username, email, password_hash })
      .select('id, email, username, full_name, storage_used, storage_limit')
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    await supabaseAdmin.from('mail_settings').insert({ owner_id: user.id })

    const token = await createSession({ id: user.id, email: user.email, username: user.username, full_name: user.full_name, storage_used: user.storage_used, storage_limit: user.storage_limit })

    sendWelcomeEmail(user.email, user.full_name, user.username).catch(() => {})

    const res = NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, full_name: user.full_name } }, { status: 201 })
    res.cookies.set('its_mail_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' })
    return res
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors[0]?.message }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
