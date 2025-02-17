import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { AuthOptions } from "next-auth"
import { fetchAPIs } from "@/utils/fetchAPIs"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  secret: process.env.NO_SECRET!,

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "exam@gmail.com" },
        password: { label: "Password", type: "password", placeholder: "******" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const res = await fetchAPIs<IBackendRes<JWT>>({
          url: 'http://localhost:8000/api/v1/auth/login',
          method: 'POST',
          body: {
            username: credentials?.username,
            password: credentials?.password
          }
        })

        if (res && res.data) {
          // Any object returned will be saved in `user` property of the JWT
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return res.data as any
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (trigger === 'signIn' && account?.provider !== 'credentials') {
        const res = await fetchAPIs<IBackendRes<JWT>>({
          url: 'http://localhost:8000/api/v1/auth/social-media',
          method: 'POST',
          body: { type: account?.provider?.toLocaleUpperCase(), username: user.email }
        })
        if (res.data) {
          token = res.data
          console.log('🚀 ~ jwt ~ res:', res)
        }
      }
      if (trigger === 'signIn' && account?.provider === 'credentials') {
        //@ts-ignore
        token.access_token = user.access_token;
        //@ts-ignore
        token.refresh_token = user.refresh_token;
        //@ts-ignore
        token.user = user.user;
      }
      return token
    },
    session({ session, token }) {
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
