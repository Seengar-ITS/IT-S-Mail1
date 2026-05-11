import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()

  if (body.id) {
    const { data } = await supabaseAdmin.from('mail_drafts').update({ to_addresses: body.to_addresses, cc_addresses: body.cc_addresses, subject: body.subject, body_html: body.body_html, updated_at: new Date().toISOString() }).eq('id', body.id).eq('owner_id', session.id).select('id').single()
    return NextResponse.json({ id: data?.id })
  }

  const { data } = await supabaseAdmin.from('mail_drafts').insert({ owner_id: session.id, to_addresses: body.to_addresses, cc_addresses: body.cc_addresses, subject: body.subject, body_html: body.body_html }).select('id').single()
  return NextResponse.json({ id: data?.id })
}
