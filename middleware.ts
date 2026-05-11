import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRETS || 'its-mail1-secret-key-change-in-production'
)

const protectedPaths = ['/mail']
const authPaths = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('its_mail_token')?.value

  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  const isAuth = authPaths.some(p => pathname.startsWith(p))

  if (isProtected) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url))
    try {
      await jwtVerify(token, JWT_SECRET)
    } catch {
      const res = NextResponse.redirect(new URL('/login', request.url))
      res.cookies.delete('its_mail_token')
      return res
    }
  }

  if (isAuth && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.redirect(new URL('/mail', request.url))
    } catch {
      // invalid token, allow through
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
