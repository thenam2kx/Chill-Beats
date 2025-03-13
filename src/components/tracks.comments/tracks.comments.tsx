"use client";
import { fetchDefaultImage } from "@/utils/utils";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import WaveSurfer from "wavesurfer.js";
import { fetchAPIs } from "@/utils/fetchAPIs";
import useHasMounted from "@/hooks/useHasMounted";
dayjs.extend(relativeTime);

interface IProps {
  comments: ITrackComment[] | null;
  trackInfo: ITracksTop | null;
  wavesurfer: WaveSurfer | null;
}

const TracksComments = (props: IProps) => {
  const { comments, trackInfo, wavesurfer } = props;

  const hasMounted = useHasMounted()
  const router = useRouter();
  const [yourComment, setYourComment] = useState("");
  const { data: session } = useSession();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const handleSubmit = async () => {
    const res = await fetchAPIs<IBackendRes<ITrackComment>>({
      url: `http://localhost:8000/api/v1/comments`,
      method: "POST",
      body: {
        content: yourComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: trackInfo?._id,
      },

      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      setYourComment("");
      router.refresh();
    }
  };

  const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(moment / duration);
      wavesurfer.play();
    }
  };

  return (
    <Box>
      <Box style={{ marginTop: "50px", marginBottom: "25px" }}>
        {session?.user && (
          <TextField
            value={yourComment}
            onChange={(e) => setYourComment(e.target.value)}
            fullWidth
            label="Comments"
            variant="standard"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", gap: "10px" }}>
        <Box className="left" sx={{ width: "190px" }}>
          <Box
            component={'img'}
            sx={{
              height: 150,
              width: 150,
            }}
            src={`/${fetchDefaultImage(trackInfo?.uploader?.type as string)}`}
          />
          <Box>{trackInfo?.uploader?.email}</Box>
        </Box>
        <Box className="right" style={{ width: "calc(100% - 200px)" }}>
          {comments?.map((comment) => {
            return (
              <Box
                key={comment._id}
                sx={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "25px",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component={'img'}
                    sx={{
                      height: 40,
                      width: 40,
                    }}
                    src={`/${fetchDefaultImage(comment.user.type)}`}
                  />
                  <Box>
                    <Box sx={{ fontSize: "13px" }}>
                      {comment?.user?.name ?? comment?.user?.email} at
                      <Box component={'span'}
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleJumpTrack(comment.moment)}
                      >
                        &nbsp; {formatTime(comment.moment)}
                      </Box>
                    </Box>
                    <Box>{comment.content}</Box>
                  </Box>
                </Box>
                <Box sx={{ fontSize: "12px", color: "#999" }}>
                  {hasMounted ?? dayjs(comment.createdAt).fromNow()}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default TracksComments;
