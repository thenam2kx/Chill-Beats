'use client'
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import { Navigation } from 'swiper/modules';
// import 'swiper/css/navigation';

const sliderStyle: React.CSSProperties = {
  height: '220px',
  width: '100%',
}

const sliderItemStyle: React.CSSProperties = {
  height: 'auto',
  cursor: 'pointer',
  border: '1px solid #000'
}

interface IProps {
  title: string
  TracksSliderStyle?: React.CSSProperties
}

const TracksSlider = (props: IProps) => {
  const { title, TracksSliderStyle } = props

  return (
    <Box sx={{ ...TracksSliderStyle }}>
      <Typography variant="h4" sx={{
        fontSize: '24px',
        fontWeight: 500,
        mb: 2
      }}>
        {title}
      </Typography>

      <Swiper
      slidesPerView={1}
      spaceBetween={10}
      // navigation={true}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 10,
        },
      }}
      // modules={[Navigation]}
      style={sliderStyle}
    >
      <SwiperSlide style={sliderItemStyle}>Slide 1</SwiperSlide>
      <SwiperSlide style={sliderItemStyle}>Slide 2</SwiperSlide>
      <SwiperSlide style={sliderItemStyle}>Slide 3</SwiperSlide>
      <SwiperSlide style={sliderItemStyle}>Slide 4</SwiperSlide>
      <SwiperSlide style={sliderItemStyle}>Slide 5</SwiperSlide>
      <SwiperSlide style={sliderItemStyle}>Slide 6</SwiperSlide>
      <SwiperSlide style={sliderItemStyle}>Slide 7</SwiperSlide>
      <SwiperSlide style={sliderItemStyle}>Slide 8</SwiperSlide>
      <SwiperSlide style={sliderItemStyle}>Slide 9</SwiperSlide>
    </Swiper>

      <Divider sx={{ mt: 2 }} />
    </Box>
  )
}

export default TracksSlider