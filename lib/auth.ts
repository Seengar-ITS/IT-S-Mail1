import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { SessionUser } from '@/types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRETS || 'its-mail1-secret-key-change-in-production'
)

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET)
  return token
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.user as SessionUser
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('its_mail_token')?.value
  if (!token) return null
  return verifySession(token)
}

