import WaveTrack from "@/components/wave.track/wave.track"
import { fetchAPIs } from "@/utils/fetchAPIs"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DetailTrackPage = async ({ params }: { params: any }) => {
  const { slug }= await params
  const trackInfo = await fetchAPIs<IBackendRes<ITracksTop>>({
    url: `http://localhost:8000/api/v1/tracks/${slug}`,
    method: "GET",
    nextOption: { cache: 'no-store' }
  })

  const listComments = await fetchAPIs<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `http://localhost:8000/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 10,
      trackId: slug,
      sort: '-createdAt',
    }
  })

  return (
    <div>
      <WaveTrack trackInfo={trackInfo?.data ?? null} comments={listComments.data?.result ?? null} />
    </div>
  )
}

export default DetailTrackPage