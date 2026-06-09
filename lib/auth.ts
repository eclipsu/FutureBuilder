import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getRepositories } from './db/data-source'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        try {
          const { users: userRepo } = await getRepositories()
          const user = await userRepo.findOne({
            where: { username: credentials.username as string },
          })
          if (!user) return null
          const isValid = await bcrypt.compare(credentials.password as string, user.password)
          if (!isValid) return null
          return {
            id: String(user.id),
            name: user.name,
            email: user.username,
            role: user.role,
          }
        } catch (err) {
          console.error('Auth error:', err)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
  },
})
