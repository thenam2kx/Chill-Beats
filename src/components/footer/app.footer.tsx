'use client'
import useHasMounted from '@/hooks/useHasMounted';
import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { TrackContext } from '@/app/libs/track.wrapper';


const Widget = styled('div')(({ theme }) => ({
  padding: '8px 0',
  borderRadius: 16,
  width: '100%',
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  backdropFilter: 'blur(40px)',
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(0,0,0,0.6)',
  }),
}));

const CoverImage = styled('div')({
  width: 40,
  height: 40,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});


const AppFooter = () => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(30);

  const { currentTrack, setCurrentTrack } = useContext(TrackContext) as ITrackContext

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMetadataLoaded = useCallback(() => {
    if (audioRef.current) {
      setDuration(Number(audioRef.current.duration))
    }
  }, [])

  const handleCurrentTime = (event: ChangeEvent<HTMLAudioElement>) => {
    if (audioRef.current) {
      setPosition(event.target.currentTime)
    }
  }

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (paused) {
      setCurrentTrack({ ...currentTrack, isPlaying: true })
      audio.play();
    } else {
      setCurrentTrack({ ...currentTrack, isPlaying: false })
      audio.pause();
    }
    setPaused(!paused);
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    if (audioRef.current) {
      const newPosition = value as number;
      audioRef.current.currentTime = newPosition;
      setPosition(newPosition);
    }
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = (value as number) / 100;
      setVolume(value as number);
    }
  };

  const formatDuration = (value: number) => {
    const minute = Math.floor(value / 60)
    const secondLeft = (value - minute * 60).toFixed(0)
    return `${minute}:${+secondLeft < 10 ? `0${secondLeft}` : secondLeft}`
  }

  useEffect(() => {
    if (currentTrack.isPlaying) {
      setPaused(false)
    } else {
      setPaused(true)
    }
  }, [currentTrack.isPlaying])


  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.src = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`;
    audioRef.current.load();

    if (currentTrack.isPlaying) {
      audioRef.current.play().catch((error) => console.error('Audio play error:', error));
      setPaused(false);
    } else {
      audioRef.current.pause();
      setPaused(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack.trackUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (paused) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => console.error('Audio play error:', error));
    }
  }, [paused]);

  const hasMounted = useHasMounted()
  if (!hasMounted) return <></>


  return (
    <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, bgcolor: '#34495e' }}>
      <Container sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
        <Box
          component={'audio'}
          onLoadedMetadata={handleMetadataLoaded}
          onTimeUpdate={handleCurrentTime}
          // onEnded={handleEndSong}
          ref={audioRef}
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
          hidden
        />

        <Widget sx={{ flexDirection: { xs: 'row-reverse', md: 'row' }, justifyContent: { xs: 'space-between', md: 'normal' } }}>
          {/* Control */}
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                color: '#000',
                ...theme.applyStyles('dark', {
                  color: '#fff',
                }),
              },
            })}
          >
            <IconButton aria-label="previous song" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <FastRewindRounded fontSize="medium" />
            </IconButton>
            <IconButton
              aria-label={paused ? 'play' : 'pause'}
              onClick={togglePlayPause}
            >
              {paused ? (
                <PlayArrowRounded fontSize="large" />
              ) : (
                <PauseRounded fontSize="large" />
              )}
            </IconButton>
            <IconButton aria-label="next song" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <FastForwardRounded fontSize="medium" />
            </IconButton>
          </Box>

          {/* Timeline */}
          <Box sx={{ flexGrow: 1, px: 3, display: { xs: 'none', md: 'flex', flexDirection: 'column', gap: '8px' } }}>
            <Slider
              aria-label="time-indicator"
              size="small"
              value={position}
              min={0}
              step={1}
              max={duration || 100}
              onChange={handleSliderChange}
              sx={(t) => ({
                color: 'rgba(0,0,0,0.87)',
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 8,
                  height: 8,
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                  '&::before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`,
                    ...t.applyStyles('dark', {
                      boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
                    }),
                  },
                  '&.Mui-active': {
                    width: 20,
                    height: 20,
                  },
                },
                '& .MuiSlider-rail': {
                  opacity: 0.28,
                },
                ...t.applyStyles('dark', {
                  color: '#fff',
                }),
              })}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: -2,
              }}
            >
              <TinyText>{formatDuration(position)}</TinyText>
              <TinyText>{`-${formatDuration(duration - position)}`}</TinyText>
            </Box>
          </Box>


          {/* Volume */}
          <Stack
            spacing={1}
            direction="row"
            sx={(theme) => ({
              mb: 1,
              mx: 3,
              minWidth: 180,
              '& > svg': {
                color: 'rgba(0,0,0,0.4)',
                ...theme.applyStyles('dark', {
                  color: 'rgba(255,255,255,0.4)',
                }),
              },
            })}
            alignItems="center"
            display={{ xs: 'none', md: 'flex' }}
          >
            <VolumeDownRounded />
            <Slider
              aria-label="Volume"
              defaultValue={volume}
              onChange={handleVolumeChange}
              sx={(t) => ({
                color: 'rgba(0,0,0,0.87)',
                '& .MuiSlider-track': {
                  border: 'none',
                },
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  backgroundColor: '#fff',
                  '&::before': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none',
                  },
                },
                ...t.applyStyles('dark', {
                  color: '#fff',
                }),
              })}
            />
            <VolumeUpRounded />
          </Stack>


          {/* Info */}
          {
            currentTrack && currentTrack.title &&
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CoverImage>
                <Box
                  component={'img'}
                  alt={currentTrack.title}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${currentTrack.imgUrl}`}
                />
              </CoverImage>
              <Box sx={{ ml: 1.5, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem' }}
                >
                  {currentTrack.title}
                </Typography>
                <Typography noWrap sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  <b>{currentTrack.uploader.name}</b>
                </Typography>
              </Box>
            </Box>
          }
        </Widget>
      </Container>
    </AppBar>
  )
}

export default AppFooter

