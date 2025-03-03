import WaveTrack from "@/components/wave.track/wave.track"
import { fetchAPIs } from "@/utils/fetchAPIs"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
  const { slug }= await params
  const trackInfo = await fetchAPIs<IBackendRes<ITracksTop>>({
    url: `http://localhost:8000/api/v1/tracks/${slug}`,
    method: "GET",
  })

  return (
    <div>
      <WaveTrack trackInfo={trackInfo?.data ?? null} />
    </div>
  )
}

export default DetailTrackPage