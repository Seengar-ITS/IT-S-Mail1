import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await supabaseAdmin.from('mail_messages').delete().eq('id', params.id).eq('owner_id', session.id)
  await supabaseAdmin.from('mail_drafts').delete().eq('id', params.id).eq('owner_id', session.id)
  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('mail_messages').select('*').eq('id', params.id).eq('owner_id', session.id).single()
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ message: data })
}
