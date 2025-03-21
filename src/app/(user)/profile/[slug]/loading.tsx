import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}>
      <CircularProgress color="primary" />
    </Box>
  )
}

export default Loading;