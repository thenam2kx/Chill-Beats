import Container from "@mui/material/Container";
import TracksSlider from "@/components/tracks.slider/tracks.slider";
import { fetchAPIs } from "@/utils/fetchAPIs";


export default async function HomePage() {

  const chills = await fetchAPIs<IBackendRes<ITracksTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: { category: 'CHILL', limit: 10 }
  })

  const workout = await fetchAPIs<IBackendRes<ITracksTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: { category: 'WORKOUT', limit: 10 }
  })

  const party = await fetchAPIs<IBackendRes<ITracksTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: { category: 'PARTY', limit: 10 }
  })


  return (
    <Container>
      <TracksSlider title="Chills tracks" TracksSliderStyle={{ margin: '20px 0' }} data={chills?.data ? chills?.data : []} />
      <TracksSlider title="Workout tracks" TracksSliderStyle={{ margin: '20px 0' }} data={workout?.data ? workout?.data : []} />
      <TracksSlider title="Party tracks" TracksSliderStyle={{ margin: '20px 0' }} data={party?.data ? party?.data : []} />
    </Container>
  );
}