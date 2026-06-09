import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session
  const isAuthPage = nextUrl.pathname.startsWith('/login')

  if (!isLoggedIn && !isAuthPage) {
    return Response.redirect(new URL('/login', nextUrl))
  }
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL('/dashboard', nextUrl))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
