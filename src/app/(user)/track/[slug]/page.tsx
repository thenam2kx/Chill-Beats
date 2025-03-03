'use client'

import WaveTrack from "@/components/wave.track/wave.track"
import { useSearchParams } from "next/navigation"

const DetailTrackPage = () => {

  const searchParams = useSearchParams()
  const search = searchParams.get('audio')
  console.log('🚀 ~ DetailTrackPage ~ search:', search)

  return (
    <div>
      <WaveTrack />
    </div>
  )
}

export default DetailTrackPage