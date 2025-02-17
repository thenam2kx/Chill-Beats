import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { AuthOptions } from "next-auth"
import { fetchAPIs } from "@/utils/fetchAPIs"
import { JWT } from "next-auth/jwt"

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
    async jwt({ token, user, profile, account, trigger }) {
      if (trigger === 'signIn' && account?.provider === 'github') {
        const res = await fetchAPIs<IBackendRes<JWT>>({
          url: 'http://localhost:8000/api/v1/auth/social-media',
          method: 'POST',
          body: { type: 'GITHUB', username: user.email }
        })
        if (res.data) {
          token = res.data
          console.log('🚀 ~ jwt ~ res:', res)
        }
      }
      return token
    },
    session({ session, token, user }) {
      if (token) {
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
      }
      return session
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
