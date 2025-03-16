import GithubProvider from "next-auth/providers/github"
import { NextAuthOptions } from "next-auth"
import { fetchAPIs } from "@/utils/fetchAPIs"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,

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
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const res = await fetchAPIs<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
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
          // return null
          throw new Error(res?.message as string)

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
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
          method: 'POST',
          body: { type: account?.provider?.toLocaleUpperCase(), username: user.email }
        })
        if (res.data) {
          token = res.data
          console.log('🚀 ~ jwt ~ res:', res)
        }
      }
      if (trigger === 'signIn' && account?.provider === 'credentials') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        token.access_token = user.access_token;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        token.refresh_token = user.refresh_token;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for check email message)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // }
}