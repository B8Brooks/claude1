import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Protected routes
  const protectedPaths = ['/dashboard', '/tools']

  // Check if path is protected
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  )

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if logged in and accessing auth pages
  const authPaths = ['/login', '/register']
  const isAuthPath = authPaths.includes(pathname)

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/tools/:path*', '/login', '/register'],
}
