import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ComingSoonPage = () => {

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box>
        <Typography variant="h2" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          We&apos;re working hard to bring you something amazing. Stay tuned!
        </Typography>
      </Box>
    </Container>
  );
};

export default ComingSoonPage;
