import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

const schema = z.object({ name: z.string().min(1), email: z.string().email() })

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('mail_contacts').select('*').eq('owner_id', session.id).order('name')
  return NextResponse.json({ contacts: data || [] })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = schema.parse(await req.json())
    const { data, error } = await supabaseAdmin.from('mail_contacts').insert({ ...body, owner_id: session.id }).select().single()
    if (error) return NextResponse.json({ error: 'Failed to add contact' }, { status: 500 })
    return NextResponse.json({ contact: data }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors[0]?.message }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
