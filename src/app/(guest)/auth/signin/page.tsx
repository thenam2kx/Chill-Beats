// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SigninAuth from "@/components/auth/signin.auth"
import { authOptions } from "@/utils/auth.options"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"


const SigninPage = async () => {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  return (
    <>
      <SigninAuth />
    </>
  )
}

export default SigninPage