import Container from "@mui/material/Container";
import TracksSlider from "@/components/tracks.slider/tracks.slider";

export default function Home() {


  return (
    <Container>
      <TracksSlider title="Multiple tracks" TracksSliderStyle={{ margin: '20px 0' }} />
      <TracksSlider title="Multiple tracks" TracksSliderStyle={{ margin: '20px 0' }} />
    </Container>
  );
}
