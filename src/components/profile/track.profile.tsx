'use client'
import { useContext } from "react"
import Grid from "@mui/material/Grid2"
import List from "@mui/material/List"
import IconButton from "@mui/material/IconButton"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItem from "@mui/material/ListItem"
import Typography from "@mui/material/Typography"
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import ListItemIcon from '@mui/material/ListItemIcon'
import { PlayArrow, Pause, Favorite, Share } from "@mui/icons-material"
import { deepOrange } from "@mui/material/colors"
import { TrackContext } from "@/app/libs/track.wrapper"

interface IProps {
  listTracks: ITracksTop[]
}

const TrackProfile = (props: IProps) => {
  const { listTracks } = props

  const { currentTrack, setCurrentTrack } = useContext(TrackContext) as ITrackContext


  return (
    <List>
      <Grid container spacing={2}>
      {listTracks && listTracks.length > 0 && listTracks.map((track) => (
        <Grid size={6} key={track._id} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <ListItem
            secondaryAction={
              <Stack spacing={2} direction="row">
                <IconButton edge="end" aria-label="like">
                  <Favorite />
                </IconButton>
                <IconButton edge="end" aria-label="share">
                  <Share />
                </IconButton>
              </Stack>
            }
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <ListItemIcon>
              {
                (track._id !== currentTrack._id ||
                track._id === currentTrack._id &&
                currentTrack.isPlaying === false) &&
                <IconButton onClick={() => setCurrentTrack({ ...track, isPlaying: true })}>
                  <PlayArrow />
                </IconButton>
              }
              {
                track._id === currentTrack._id &&
                currentTrack.isPlaying === true &&
                <IconButton onClick={() => setCurrentTrack({ ...track, isPlaying: false })}>
                  <Pause />
                </IconButton>
              }
            </ListItemIcon>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: deepOrange[500] }} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} variant="square"></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={track.title}
              secondary={
                <>
                  <Grid container spacing={1}>
                    <Grid>
                      <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                        {track.countPlay} plays
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                        {track.countLike} likes
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                        {track.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              }
            />
          </ListItem>
        </Grid>
      ))}
      </Grid>
    </List>
  )
}

export default TrackProfile