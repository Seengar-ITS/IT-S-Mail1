import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = 50
  const offset = (page - 1) * limit
  const { data } = await supabaseAdmin.from('mail_messages').select('*').eq('owner_id', session.id).eq('is_draft', false).eq('is_deleted', false).eq('is_spam', false).eq('is_sent', false).order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  return NextResponse.json({ messages: data || [] })
}
