import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/monitoring', '/docker', '/files', '/terminal', '/settings']
const publicPaths = ['/login', '/setup']
const apiProtectedPattern = /^\/api\/(?!auth\/|setup\/).*/

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isSetupPath = pathname.startsWith('/setup') || pathname.startsWith('/api/setup')
  const isLoginPath = pathname === '/login'

  const token = request.cookies.get('axius_session')?.value

  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p))
    || apiProtectedPattern.test(pathname)

  if (isSetupPath || isLoginPath) {
    return NextResponse.next()
  }

  if (isProtectedPath) {
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.svg).*)'],
}
