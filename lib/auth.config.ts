import type { NextAuthConfig } from 'next-auth'

/**
 * Edge-safe auth config — no Node-only modules (no TypeORM, no bcrypt).
 * Used by middleware which runs in the Edge Runtime.
 * The actual credentials authorize() lives in lib/auth.ts (Node runtime only).
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const pathname = request.nextUrl.pathname
      const isAuthPage = pathname.startsWith('/login')
      const isApiAuth = pathname.startsWith('/api/auth')
      if (isApiAuth) return true
      if (!isLoggedIn && !isAuthPage) return false
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}
