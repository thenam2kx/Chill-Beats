import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  secret: process.env.NO_SECRET!,

  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, user, profile, account, trigger }) {
      if (trigger === 'signIn' && account?.provider === 'github') {
        // token.address = 'thenam2kx'
      }
      return token
    },
    session({ session, token, user }) {
      // session.user.address = 'token.address as string'
      return session
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
