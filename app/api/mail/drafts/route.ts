import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('mail_drafts').select('*').eq('owner_id', session.id).order('updated_at', { ascending: false })
  return NextResponse.json({ messages: data || [] })
}
