"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWaveSurfer from "@/hooks/useWaveSurfer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { WaveSurferOptions } from "wavesurfer.js";

const styleTime: React.CSSProperties = {
  position: 'absolute',
  zIndex: 11,
  top: '50%',
  marginTop: '-1px',
  transform: 'translateY(-50%)',
  fontSize: '11px',
  background: 'rgba(0, 0, 0, 0.75)',
  padding: '2px',
  color: '#ddd',
}

const styleHover: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 10,
  pointerEvents: 'none',
  height: '100%',
  width: 0,
  mixBlendMode: 'overlay',
  background: 'rgba(255, 255, 255, 0.5)',
  opacity: 0,
  transition: 'opacity 0.2s ease',
}

const WaveTrack = () => {
  const waveRef = useRef<HTMLDivElement>(null);
  const waveHoverRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const audioUrl = searchParams.get("audio");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // WaveSurfer options
  const optionMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
    let gradient, progressGradient;

    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // Define the waveform gradient
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
      gradient.addColorStop(0, '#656666') // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
      gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
      gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
      gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
      gradient.addColorStop(1, '#B1B1B1') // Bottom color

      // Define the progress gradient
      progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
      progressGradient.addColorStop(0, '#EE772F') // Top color
      progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
      progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
      progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
      progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
      progressGradient.addColorStop(1, '#F6B094') // Bottom color
    }


    return {
      waveColor: gradient,
      progressColor: progressGradient,
      barWidth: 3,
      barRadius: 6,
      height: 100,
      url: `/api?audio=${audioUrl}`
    };
  }, [audioUrl]);

  // Initialize WaveSurfer
  const waveSurfer = useWaveSurfer(waveRef, optionMemo);

  // Handle Play/Pause
  const onPlayPause = useCallback(() => {
    if (waveSurfer) {
      waveSurfer.playPause();
    }
  }, [waveSurfer]);

  // Handle Play/Pause state
  useEffect(() => {
    if (!waveSurfer) return;
    setIsPlaying(false);

    // Wave hover effect
    (waveRef.current!).addEventListener('pointermove', (e) => {
      return (waveHoverRef.current!).style.width = `${e.offsetX}px`
    })

    // Subscriptions
    const subscriptions = [
      waveSurfer.on("play", () => setIsPlaying(true)),
      waveSurfer.on("pause", () => setIsPlaying(false)),

      // update duration and current time
      waveSurfer.on('decode', (duration) => setDuration(duration)),
      waveSurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
    ];

    return () => {
      subscriptions.forEach((unSub) => unSub());
    };
  }, [waveSurfer]);

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.round(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
  }

  return (
    <>
      <Container>
        <Box ref={waveRef} sx={{
          cursor: 'pointer',
          position: 'relative',
          '&:hover .waveHover': { opacity: 1 }
        }}>
          <Box sx={{ ...styleTime, left: 0 }}>{formatTime(currentTime)}</Box>
          <Box sx={{ ...styleTime, right: 0 }}>{formatTime(duration)}</Box>
          <Box className='waveHover' ref={waveHoverRef} sx={{ ...styleHover }} />
        </Box>
        <Button variant="contained" onClick={onPlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </Container>
    </>
  );
};

export default WaveTrack;
