'use client'
import { useRef } from "react";
import 'swiper/css';
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const sliderStyle: React.CSSProperties = {
  height: 'auto',
  width: '100%',
  overflow: 'hidden'
}

const sliderItemStyle: React.CSSProperties = {
  height: 'auto',
  cursor: 'pointer',
}

interface IProps {
  title: string
  TracksSliderStyle?: React.CSSProperties
  data: ITracksTop[]
}

const TracksSlider = (props: IProps) => {
  const { title, TracksSliderStyle, data } = props
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)

  return (
    <Box sx={{ ...TracksSliderStyle }}>
      <Typography variant="h4" sx={{
        fontSize: '24px',
        fontWeight: 500,
        mb: 2
      }}>
        {title}
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          modules={[Navigation]}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              if (swiper?.params && swiper?.params?.navigation && typeof swiper.params.navigation === "object") {
                swiper.params.navigation.prevEl = navigationPrevRef.current
                swiper.params.navigation.nextEl = navigationNextRef.current
              }
              // Re-init navigation
              swiper.navigation?.destroy()
              swiper.navigation?.init()
              swiper.navigation?.update()
            })
          }}
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
          style={sliderStyle}
        >
          {
            data.map(item => (
              <SwiperSlide style={sliderItemStyle} key={item._id}>
                <Box sx={{ width: '100%' }}>
                  <Box
                    component={'img'}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                    sx={{ width: '100%' }}
                  />
                  <Typography variant="h4" sx={{
                    fontSize: '16px',
                    fontWeight: 500,
                    mb: '4px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h5" sx={{
                    fontSize: '12px',
                    color: 'gray',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.category}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))
          }
        </Swiper>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            top: '40%',
            left: '-10px',
            zIndex: 9,
            width: 'calc(100% + 20px)',
            justifyContent: 'space-between'
          }}
        >
          <IconButton
            ref={navigationPrevRef}
            aria-label="left"
            color="primary"
            sx={{
              bgcolor: 'white',
              borderRadius: '6px',
              padding: '4px 2px',
              border: '1px solid',
              borderColor: 'transparent',
              '&:hover': { bgcolor: 'white', borderColor: '#2c3e50' }
            }}
          >
            <KeyboardArrowLeftIcon sx={{ color: '#2c3e50' }} />
          </IconButton>
          <IconButton
            ref={navigationNextRef}
            aria-label="right"
            color="primary"
            sx={{
              bgcolor: 'white',
              borderRadius: '6px',
              padding: '4px 2px',
              border: '1px solid',
              borderColor: 'transparent',
              '&:hover': { bgcolor: 'white', borderColor: '#2c3e50' }
            }}
          >
            <KeyboardArrowRightIcon sx={{ color: '#2c3e50' }} />
          </IconButton>
        </Stack>
      </Box>



      <Divider sx={{ mt: 2 }} />
    </Box>
  )
}

export default TracksSlider