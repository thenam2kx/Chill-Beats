'use client'

import WaveTrack from "@/components/wave.track/wave.track"
import { useSearchParams } from "next/navigation"

const DetailTrackPage = ({ params }: { params: { slug: string } }) => {

  const searchParams = useSearchParams()
  const search = searchParams.get('audio')

  return (
    <div>
      <WaveTrack />
    </div>
  )
}

export default DetailTrackPage