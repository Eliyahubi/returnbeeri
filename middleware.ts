import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Protect admin routes
    if (pathname.startsWith('/admin') && token?.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Protect manager routes
    if (pathname.startsWith('/manager') && 
        !['SUPER_ADMIN', 'DOMAIN_MANAGER'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token
      }
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/manager/:path*',
    '/tasks/:path*',
    '/profile/:path*',
  ]
}
