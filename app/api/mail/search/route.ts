import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const q = req.nextUrl.searchParams.get('q') || ''
  if (!q.trim()) return NextResponse.json({ messages: [] })
  const { data } = await supabaseAdmin.from('mail_messages').select('*').eq('owner_id', session.id).eq('is_deleted', false).or(`subject.ilike.%${q}%,body_text.ilike.%${q}%,from_address.ilike.%${q}%`).order('created_at', { ascending: false }).limit(50)
  return NextResponse.json({ messages: data || [] })
}
