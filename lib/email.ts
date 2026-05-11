import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'IT-S Mail1 <onboarding@resend.dev>'

const baseStyles = `font-family:Inter,sans-serif;background:#0f0f1a;color:#fff;padding:40px;max-width:600px;margin:0 auto;border-radius:12px;border:1px solid #2a2a4a;`
const logo = `<div style="text-align:center;margin-bottom:32px;"><h1 style="color:#f0a500;font-size:28px;margin:0;">IT-S <span style="color:#fff;">Mail1</span></h1><p style="color:#a0a0b0;margin:4px 0 0;font-size:13px;">Email, Reimagined.</p></div>`

export async function sendWelcomeEmail(email: string, fullName: string, username: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Welcome to IT-S Mail1 — Your inbox is ready',
    html: `<div style="${baseStyles}">${logo}
      <h2 style="color:#fff;font-size:22px;">Welcome, ${fullName}!</h2>
      <p style="color:#a0a0b0;line-height:1.6;">Your IT-S Mail1 account is ready. Your email address is:</p>
      <div style="background:#16213e;border:2px solid #f0a500;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
        <span style="font-size:20px;font-weight:700;color:#f0a500;">${username}@its-mail.com</span>
      </div>
      <p style="color:#a0a0b0;line-height:1.6;">You can now send and receive emails, manage your contacts, and enjoy a premium email experience.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/mail" style="background:#f0a500;color:#0f0f1a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">Open IT-S Mail1</a>
      </div>
      <hr style="border:1px solid #2a2a4a;margin:24px 0;">
      <p style="color:#a0a0b0;font-size:12px;text-align:center;">IT-S Mail1 — One Platform. Infinite Possibilities.</p>
    </div>`
  })
}

export async function sendNewMessageNotification(toEmail: string, fromAddress: string, subject: string, messageId: string) {
  return resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `New message from ${fromAddress}`,
    html: `<div style="${baseStyles}">${logo}
      <div style="background:#16213e;border-left:4px solid #f0a500;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
        <p style="margin:0;color:#a0a0b0;font-size:13px;">New Message</p>
        <p style="margin:4px 0 0;color:#fff;font-size:16px;font-weight:600;">${subject}</p>
        <p style="margin:4px 0 0;color:#a0a0b0;font-size:13px;">From: ${fromAddress}</p>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/mail/${messageId}" style="background:#f0a500;color:#0f0f1a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">View Message</a>
      </div>
      <hr style="border:1px solid #2a2a4a;margin:24px 0;">
      <p style="color:#a0a0b0;font-size:12px;text-align:center;">IT-S Mail1 — Email, Reimagined.</p>
    </div>`
  })
}
