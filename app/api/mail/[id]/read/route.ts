import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await supabaseAdmin.from('mail_messages').update({ is_read: true }).eq('id', params.id).eq('owner_id', session.id)
  return NextResponse.json({ success: true })
}
