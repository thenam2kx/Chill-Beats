// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import TrackProfile from "@/components/profile/track.profile"
import { authOptions } from "@/utils/auth.options"
import { fetchAPIs } from "@/utils/fetchAPIs"
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material"
import { getServerSession } from "next-auth"

const ProfilePage = async ({ params }: {params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const getId = (slug?.split('.html')[0])?.split('-') ?? []
  const id = getId[getId.length - 1]

  const session = await getServerSession(authOptions)

  const result = await fetchAPIs<IBackendRes<IModelPaginate<ITracksTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=50&sort=-createdAt`,
    method: 'POST',
    body: { id: id }
  })
  console.log('🚀 ~ ProfilePage ~ result:', result)



  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ mt: 4, mb: 4, p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar src={'user.avatarUrl'} sx={{ width: 150, height: 150, mr: 3 }} />
          <Box>
            <Typography variant="h4">{session?.user.email}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {session?.user.username ? `@${session?.user.username}` : ""}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" component="span" mr={2}>
                {result.data?.meta.total} tracks
              </Typography>
              <Typography variant="body2" component="span">
                15k followers
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Uploaded Tracks
        </Typography>

        <TrackProfile listTracks={result.data?.result ? result.data?.result : []} />
      </Paper>
    </Container>
  )
}

export default ProfilePage