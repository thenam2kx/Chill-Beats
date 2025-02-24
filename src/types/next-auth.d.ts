// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt"

interface IUser {
  _id: string,
  username: string,
  email: string,
  isVerify: boolean,
  type: string,
  role: string
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string
    refresh_token: string
    user: IUser
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token: string
    refresh_token: string
    user: IUser
  }
}