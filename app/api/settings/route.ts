import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('mail_settings').select('*').eq('owner_id', session.id).single()
  return NextResponse.json({ settings: data || {} })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { signature, theme, notifications_enabled, auto_reply_enabled, auto_reply_message } = body
  const { data: existing } = await supabaseAdmin.from('mail_settings').select('id').eq('owner_id', session.id).single()
  if (existing) {
    await supabaseAdmin.from('mail_settings').update({ signature, theme, notifications_enabled, auto_reply_enabled, auto_reply_message }).eq('owner_id', session.id)
  } else {
    await supabaseAdmin.from('mail_settings').insert({ owner_id: session.id, signature, theme, notifications_enabled, auto_reply_enabled, auto_reply_message })
  }
  return NextResponse.json({ success: true })
}
