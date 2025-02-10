import Container from "@mui/material/Container";
import TracksSlider from "@/components/tracks.slider/tracks.slider";
import { sendRequest } from "@/utils/api";


export default async function HomePage() {

  const res = await sendRequest<IBackendRes<ITracksTop[]>>({
    url: 'http://localhost:8000/api/v1/tracks/top',
    method: 'POST',
    body: { category: 'CHILL', limit: 10 }
  })

  console.log('check res: ', await res)

  return (
    <Container>
      <TracksSlider title="Multiple tracks" TracksSliderStyle={{ margin: '20px 0' }} />
      <TracksSlider title="Multiple tracks" TracksSliderStyle={{ margin: '20px 0' }} />
    </Container>
  );
}
