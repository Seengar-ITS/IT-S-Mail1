import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { createSession } from '@/lib/auth'

const schema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = schema.parse(await req.json())

    const isEmail = identifier.includes('@')
    const { data: user } = await supabaseAdmin
      .from('mail_users')
      .select('*')
      .eq(isEmail ? 'email' : 'username', isEmail ? identifier : identifier)
      .single()

    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = await createSession({ id: user.id, email: user.email, username: user.username, full_name: user.full_name, storage_used: user.storage_used, storage_limit: user.storage_limit })

    const res = NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, full_name: user.full_name } })
    res.cookies.set('its_mail_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' })
    return res
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors[0]?.message }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
