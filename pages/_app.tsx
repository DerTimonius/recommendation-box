import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SettingsIcon from '@mui/icons-material/Settings';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { Box, CssBaseline, List } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { blueGrey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  createTheme,
  CSSObject,
  styled,
  Theme,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AppProps } from 'next/app';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { User } from '../database/user';
import { customTheme } from '../styles/customTheme';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

/* const customTheme = createTheme({
  palette: {
    primary: blueGrey,
  },
}); */
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

function Anchor({ children, ...restProps }: any) {
  // to force a refresh of the page using an <a> tag instead of Link
  return <a {...restProps}>{children}</a>;
}
function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | undefined>();
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  function handleClick() {
    setOpen(!open);
  }

  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/user/');
    const profileResponseBody = await profileResponse.json();

    if ('errors' in profileResponseBody) {
      setUser(undefined);
    } else {
      setUser(profileResponseBody.user);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => console.log('fetch api failed'));
  }, [refreshUserProfile]);
  return (
    <ThemeProvider theme={customTheme}>
      <div>
        <Global
          styles={css`
            *,
            *::before,
            *::after {
              margin: 0;
              box-sizing: border-box;
            }
          `}
        />
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleClick}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Super duper recommendations
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleClick}>
                <ChevronLeftIcon />
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <Link href="/">
                <a data-test-id="navigation-home">
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <HomeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Home"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </a>
              </Link>
              <Link href="/movies">
                <a data-test-id="navigation-movies">
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <OndemandVideoIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Movies/TV shows"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </a>
              </Link>
              <Link href="/about">
                <a data-test-id="navigation-about">
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <LibraryBooksIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="How it works"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </a>
              </Link>
            </List>
            <Divider />
            <List>
              {user ? (
                <>
                  <Link href="/profile">
                    <a data-test-id="navigation-profile">
                      <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                            }}
                          >
                            <SettingsIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Your Profile"
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </a>
                  </Link>
                  <Anchor href="/logout" data-test-id="navigation-logout">
                    <ListItem disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Log Out"
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Anchor>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <a data-test-id="navigation-login">
                      <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                            }}
                          >
                            <LoginIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Log In"
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </a>
                  </Link>
                  <Link href="/register">
                    <a data-test-id="navigation-register">
                      <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                            }}
                          >
                            <SwitchAccountIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Sign Up"
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </a>
                  </Link>
                </>
              )}
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Component
              {...pageProps}
              className="main"
              refreshUserProfile={refreshUserProfile}
            />
            {/* <Footer /> */}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
