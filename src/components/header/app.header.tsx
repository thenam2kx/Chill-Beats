'use client'
import { useState } from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { pages, settings } from '@/utils/header.data';
import { signIn, signOut, useSession } from "next-auth/react";



const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const AppHeader = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { data: session } = useSession()
  console.log('🚀 ~ AppHeader ~ session:', session)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const menuId = 'menu-appbar-desktop';
  const renderMenu = (
    <Menu
      id={menuId}
      anchorEl={anchorElNav}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={Boolean(anchorElNav)}
      onClose={handleCloseNavMenu}
      sx={{ display: { xs: 'block', md: 'none' } }}
    >
      {pages.map((page) => (
        <MenuItem key={page.id} onClick={handleCloseNavMenu}>
          <Typography
            component={Link}
            href={page.href}
            sx={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
          >
            {page.title}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  )

  const menuIdMobile = 'menu-appbar-mobile';
  const renderMenuMobile = (
    <Menu
    sx={{ mt: '45px' }}
    id={menuIdMobile}
    anchorEl={anchorElUser}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    keepMounted
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    open={Boolean(anchorElUser)}
    onClose={handleCloseUserMenu}
  >
    {settings.map((setting) => (
      <MenuItem key={setting.id} onClick={handleCloseUserMenu}>
        <Typography
          component={Link}
          href={setting.href}
          sx={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
        >
          {setting.title}
        </Typography>
      </MenuItem>
    ))}
      <MenuItem onClick={() => { handleCloseUserMenu(); signOut() }}>
        <Typography
          component={Link}
          href={'#'}
          sx={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
        >
          Sign-out
        </Typography>
      </MenuItem>
  </Menu>
  )

  return (
    <AppBar position="static" sx={{ bgcolor: '#2c3e50' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ChillBeats
          </Typography>


          {/* Menu responsive */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Search sx={{ display: { xs: 'none', md: 'flex' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {/* Logo responsive */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ChillBeats
          </Typography>

          {/* Menu */}
          <Box component={'section'} sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-end',
            mx: '16px'
          }}>
            {
              session
              ?
              pages.map((page) => (
                <Button
                  key={page.id}
                  component={Link}
                  href={page.href}
                  onClick={handleCloseNavMenu}
                  sx={{ mx: 1, color: 'white', display: 'block' }}
                >
                  {page.title}
                </Button>
              ))
              :
              <Button
                component={Link}
                href={'#'}
                onClick={() => signIn()}
                sx={{ mx: 1, color: 'white', display: 'block' }}
              >
                Signin
              </Button>
            }
          </Box>

          {/* Account */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={"https://picsum.photos/200/200"} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
      {renderMenu}
      {renderMenuMobile}
    </AppBar>
  )
}

export default AppHeader