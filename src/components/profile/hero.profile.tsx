'use client'
import {
  Avatar,
  Box,
  Typography,
} from "@mui/material"

const user = {
  name: "John Doe",
  username: "johndoe",
  avatarUrl: "/placeholder.svg?height=100&width=100",
  trackCount: 15,
  followerCount: 1200,
}

const HeroProfile = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
      <Avatar src={user.avatarUrl} sx={{ width: 150, height: 150, mr: 3 }} />
      <Box>
        <Typography variant="h4">{user.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          @{user.username}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" component="span" mr={2}>
            {user.trackCount} tracks
          </Typography>
          <Typography variant="body2" component="span">
            {user.followerCount} followers
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default HeroProfile