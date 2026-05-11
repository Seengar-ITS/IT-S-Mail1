import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  to_addresses: z.array(z.string().email()).min(1),
  cc_addresses: z.array(z.string()).optional(),
  bcc_addresses: z.array(z.string()).optional(),
  subject: z.string().min(1),
  body_html: z.string().optional(),
  body_text: z.string().optional(),
  draft_id: z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = schema.parse(await req.json())
    const fromAddress = `${session.username}@its-mail.com`

    const { data: message, error } = await supabaseAdmin.from('mail_messages').insert({
      from_address: fromAddress,
      to_addresses: body.to_addresses,
      cc_addresses: body.cc_addresses || [],
      bcc_addresses: body.bcc_addresses || [],
      subject: body.subject,
      body_html: body.body_html,
      body_text: body.body_text,
      is_sent: true,
      is_read: true,
      owner_id: session.id,
      folder: 'sent',
    }).select('id').single()

    if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 })

    // Deliver to internal recipients
    for (const addr of body.to_addresses) {
      if (addr.endsWith('@its-mail.com')) {
        const username = addr.split('@')[0]
        const { data: recipient } = await supabaseAdmin.from('mail_users').select('id').eq('username', username).single()
        if (recipient) {
          await supabaseAdmin.from('mail_messages').insert({
            from_address: fromAddress,
            to_addresses: body.to_addresses,
            subject: body.subject,
            body_html: body.body_html,
            body_text: body.body_text,
            owner_id: recipient.id,
            folder: 'inbox',
          })
        }
      } else {
        // External: send via Resend
        resend.emails.send({
          from: `${session.full_name} via IT-S Mail1 <onboarding@resend.dev>`,
          to: addr,
          subject: body.subject,
          html: body.body_html || body.body_text || '',
        }).catch(() => {})
      }
    }

    // Delete draft if editing one
    if (body.draft_id) {
      await supabaseAdmin.from('mail_drafts').delete().eq('id', body.draft_id).eq('owner_id', session.id)
    }

    return NextResponse.json({ id: message?.id, success: true })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors[0]?.message }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
