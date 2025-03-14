'use client'
import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useEffect, useState } from "react";
import { fetchAPIs } from "@/utils/fetchAPIs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface IProps {
  track: ITracksTop | null;
}
const LikeTrack = (props: IProps) => {
  const { track } = props;
  const [tracksLike, setTracksLike] = useState<ITracksLike[] | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  const fetchListLike = async () => {
    if (session?.access_token) {
      const res = await fetchAPIs<IBackendRes<IModelPaginate<ITracksLike>>>({
        url: `http://localhost:8000/api/v1/likes`,
        method: "GET",
        queryParams: {
          current: 1,
          pageSize: 100,
          sort: '-createdAt',
        },
        headers: { Authorization: `Bearer ${session?.access_token}`},
      });
      if (res.data?.result) {
        setTracksLike(res?.data?.result);
      }
    }
  }

  const handleLikeTrack = async () => {
    const res = await fetchAPIs<IBackendRes<IModelPaginate<ITracksLike>>>({
      url: `http://localhost:8000/api/v1/likes`,
      method: "POST",
      body: {
        track: track?._id,
        quantity: tracksLike?.some(t => t._id === track?._id) ? -1 : 1,
      },
      headers: { Authorization: `Bearer ${session?.access_token}`},
    });
    if (res.data) {
      fetchListLike()
      router.refresh();
    }
  }

  useEffect(() => {
    fetchListLike()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <div
      style={{
        margin: "20px 0",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Chip
        sx={{ borderRadius: "5px" }}
        size="medium"
        variant="outlined"
        color={tracksLike?.some(t => t._id === track?._id) ? "error" : "default"}
        clickable
        icon={<FavoriteIcon />}
        label="Like"
        onClick={handleLikeTrack}
      />
      <div
        style={{ display: "flex", width: "100px", gap: "20px", color: "#999" }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <PlayArrowIcon sx={{ fontSize: "20px" }} /> {track?.countPlay}
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FavoriteIcon sx={{ fontSize: "20px" }} /> {track?.countLike}
        </span>
      </div>
    </div>
  );
};

export default LikeTrack;
