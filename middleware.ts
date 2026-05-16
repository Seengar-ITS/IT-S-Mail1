// IT-S ID1 auth — deployed 2026-05-16T07:21:31Z
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('its_session')?.value

  if (!sessionToken) {
    const loginUrl = new URL('https://its-id1.vercel.app/login')
    loginUrl.searchParams.set('redirect', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|login|signup|forgot-password).*)']
}