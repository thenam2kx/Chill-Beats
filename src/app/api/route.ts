import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const audioUrl = url.searchParams.get('audio')

  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${audioUrl}`)
}