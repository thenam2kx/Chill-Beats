'use client'
import { Container, Paper, Typography, TextField, Button, Link, Divider, IconButton, Box } from "@mui/material"
import Google from "@mui/icons-material/Google"
import { signIn } from "next-auth/react"
import GitHubIcon from '@mui/icons-material/GitHub';

const SigninAuth = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get('email') as string
    const password= data.get('password') as string
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
            <Link href="#" variant="body2">
              Dont have an account? Sign Up
            </Link>
          </Box>
        </form>
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>
        <Box display="flex" justifyContent="center" gap={2}>
          <IconButton color="primary" aria-label="sign in with Google">
            <Google />
          </IconButton>
          <IconButton color="primary" aria-label="sign in with GitHub" onClick={() => signIn('github')}>
            <GitHubIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  )
}

export default SigninAuth