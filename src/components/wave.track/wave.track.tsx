"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useWaveSurfer from "@/hooks/useWaveSurfer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { WaveSurferOptions } from "wavesurfer.js";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Tooltip from '@mui/material/Tooltip';
import { TrackContext } from "@/app/libs/track.wrapper";
import { fetchDefaultImage } from "@/utils/utils";
import TracksComments from "../tracks.comments/tracks.comments";
import LikeTrack from "../tracks.like/tracks.like";

const styleTime: React.CSSProperties = {
  position: "absolute",
  zIndex: 11,
  top: "50%",
  marginTop: "-1px",
  transform: "translateY(-50%)",
  fontSize: "11px",
  background: "rgba(0, 0, 0, 0.75)",
  padding: "2px",
  color: "#ddd",
};

const styleHover: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  zIndex: 10,
  pointerEvents: "none",
  height: "100%",
  width: 0,
  mixBlendMode: "overlay",
  background: "rgba(255, 255, 255, 0.5)",
  opacity: 0,
  transition: "opacity 0.2s ease",
};

const styleWaveOverlay: React.CSSProperties = {
  position: "absolute",
  height: "30px",
  width: "100%",
  bottom: "0",
  zIndex: 10,
  opacity: 0.5,
  background: "#2c3e50",
};

const styleImageComment: React.CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 1,
  objectFit: "cover",
  position: "absolute",
  bottom: "2px",
  left: "0",
  zIndex: 11,
};

interface IProps {
  trackInfo: ITracksTop | null;
  comments: ITrackComment[] | null;
}

const WaveTrack = (props: IProps) => {
  const { trackInfo, comments } = props;
  const waveRef = useRef<HTMLDivElement>(null);
  const waveHoverRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const audioUrl = searchParams.get("audio");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const { currentTrack, setCurrentTrack } = useContext(TrackContext) as ITrackContext

  // WaveSurfer options
  const optionMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
    let gradient, progressGradient;

    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      // Define the waveform gradient
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, "#656666"); // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
      gradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#B1B1B1"
      ); // Bottom color
      gradient.addColorStop(1, "#B1B1B1"); // Bottom color

      // Define the progress gradient
      progressGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 1.35
      );
      progressGradient.addColorStop(0, "#EE772F"); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7) / canvas.height,
        "#EB4926"
      ); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#F6B094"
      ); // Bottom color
      progressGradient.addColorStop(1, "#F6B094"); // Bottom color
    }

    return {
      waveColor: gradient,
      progressColor: progressGradient,
      barWidth: 3,
      barRadius: 6,
      height: 100,
      url: `/api?audio=${audioUrl}`,
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
    waveRef.current!.addEventListener("pointermove", (e) => {
      return (waveHoverRef.current!.style.width = `${e.offsetX}px`);
    });

    // Subscriptions
    const subscriptions = [
      waveSurfer.on("play", () => setIsPlaying(true)),
      waveSurfer.on("pause", () => setIsPlaying(false)),

      // Play audio on first interaction
      waveSurfer.once("interaction", () => {
        waveSurfer.play();
      }),

      // update duration and current time
      waveSurfer.on("decode", (duration) => setDuration(duration)),
      waveSurfer.on("timeupdate", (currentTime) => setCurrentTime(currentTime)),
    ];

    return () => {
      subscriptions.forEach((unSub) => unSub());
    };
  }, [waveSurfer]);

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  // Calculate comment current time
  const commentCurrentTime = (moment: number) => {
    const hardCodeDuration = waveSurfer?.getDuration() ?? 0
    const percent = (moment / hardCodeDuration) * 100;
    return `${percent}%`;
  };

  // useEffect(() => {
  //   if (trackInfo?._id === currentTrack._id && waveSurfer) {
  //     currentTrack.isPlaying ? waveSurfer.pause() : waveSurfer.play()
  //   }
  // }, [currentTrack])


  useEffect(() => {
    if (waveSurfer && currentTrack.isPlaying) {
      waveSurfer.pause()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack])

  useEffect(() => {
    if (trackInfo?._id && !currentTrack._id) {
      setCurrentTrack({ ...trackInfo, isPlaying: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackInfo])

  return (
    <>
      <Container>
        <Paper
          sx={{
            p: 2,
            bgcolor: "grey.900",
            color: "common.white",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            background:
              "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              {/* Play Button */}
              <IconButton
                onClick={() => {
                  onPlayPause();
                  if (trackInfo && waveSurfer) {
                    // setCurrentTrack({ ...trackInfo, isPlaying: !waveSurfer?.isPlaying() })
                    setCurrentTrack({ ...currentTrack, isPlaying: false })
                  }
                }}
                sx={{
                  bgcolor: "#ff5500",
                  color: "white",
                  "&:hover": { bgcolor: "#ff7700" },
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              {/* Track Info */}
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography
                    variant="caption"
                    color="grey.500"
                    sx={{ fontSize: "22px" }}
                  >
                    Related tracks:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '24px' }}>{trackInfo?.title}</Typography>
                  <LockIcon sx={{ fontSize: 16, color: "grey.500" }} />
                  <Typography variant="caption" color="grey.500">
                    Private
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="grey.500"
                  sx={{ fontSize: "16px" }}
                >
                  Made for {trackInfo?.uploader?.name}
                </Typography>
              </Box>
            </Box>

            {/* WaveSurfer */}
            <Box
              ref={waveRef}
              sx={{
                cursor: "pointer",
                position: "relative",
                "&:hover .waveHover": { opacity: 1 },
              }}
            >
              <Box sx={{ ...styleTime, left: 0 }}> {formatTime(currentTime)}</Box>
              <Box sx={{ ...styleTime, right: 0 }}>{formatTime(duration)}</Box>
              <Box className="waveHover" ref={waveHoverRef} sx={{ ...styleHover }} />
              <Box className="waveOverlay" sx={{ ...styleWaveOverlay }} />
              {/* Comments */}
              <Box sx={{}}>
                {
                  comments?.map((comment) => (
                    <Tooltip key={comment?._id} title={comment.content} placement="top" arrow>
                      <Box
                        component={"img"}
                        src={`/${fetchDefaultImage(comment.user.type)}`}
                        alt={comment.user.name}
                        onPointerMove={() => {
                          const hover = waveHoverRef.current!;
                          hover.style.width = commentCurrentTime(comment.moment + 3);
                        }}
                        sx={{ ...styleImageComment, left: commentCurrentTime(comment.moment) }}
                      />
                    </Tooltip>
                  ))
                }
              </Box>
            </Box>
          </Box>

          {/* Profile Image */}
          <Box
            sx={{
              width: { xs: "100%", md: 300 },
              height: { xs: 200, md: 300 },
              position: "relative",
            }}
          >
            <Box
              component={"img"}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${trackInfo?.imgUrl}`}
              alt="Profile"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          </Box>
        </Paper>

        <LikeTrack track={trackInfo} />
        <TracksComments comments={comments} trackInfo={trackInfo} wavesurfer={waveSurfer} />
      </Container>
    </>
  );
};

export default WaveTrack;
