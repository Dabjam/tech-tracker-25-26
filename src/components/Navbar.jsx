import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ThemeToggle from './ThemeToggle';

function Navbar({ userRole, onLogout }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Главная', path: '/technologies' },
    { label: 'Статистика', path: '/stats' },
    { label: 'Настройки', path: '/settings' },
  ];

  const adminLink = { label: 'Админка', path: '/admin' };

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box component="span" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          Меню
        </Box>
        <IconButton
          onClick={() => setMobileMenuOpen(false)}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={link.path}
              selected={isActive(link.path)}
              sx={{
                backgroundColor: isActive(link.path)
                  ? 'action.selected'
                  : 'transparent',
              }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}

        {userRole === 'admin' && (
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to={adminLink.path}
              selected={isActive(adminLink.path)}
              sx={{
                backgroundColor: isActive(adminLink.path)
                  ? 'action.selected'
                  : 'transparent',
              }}
            >
              <AdminPanelSettingsIcon sx={{ mr: 2 }} />
              <ListItemText primary={adminLink.label} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={() => {
            onLogout();
            setMobileMenuOpen(false);
          }}
        >
          Выход
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/technologies"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🚀 TechTracker
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: isActive(link.path) ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive(link.path) ? 600 : 500,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {userRole === 'admin' && (
                <Button
                  component={RouterLink}
                  to={adminLink.path}
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{
                    color: isActive(adminLink.path) ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive(adminLink.path) ? 600 : 500,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {adminLink.label}
                </Button>
              )}

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              <ThemeToggle />

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={onLogout}
                size="small"
              >
                Выход
              </Button>
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ThemeToggle />
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Navbar;