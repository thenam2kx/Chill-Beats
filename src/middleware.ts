import { withAuth } from 'next-auth/middleware';
// export { default } from "next-auth/middleware"

// redirect to singin page if user is not authenticated
export default withAuth({
  pages: {
    signIn: '/auth/signin',
  }
})

export const config = { matcher: ["/playlist", "/track/upload", "/like", "/profile/:path"] }
