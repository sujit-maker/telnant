// Sidebar.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { List, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import { Dashboard, Person, Settings, ShoppingCart, LocationOn, Task, Menu as MenuIcon, DeviceHub, DeviceUnknown, Devices } from '@mui/icons-material';
import { drawerWidth, drawerCollapsedWidth } from './constants';

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })<{ open: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : drawerCollapsedWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  backgroundColor: 'rgb(31, 41, 55)',
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : drawerCollapsedWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: 'rgb(31, 41, 55)',
  },
}));

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false); 
  const router = useRouter();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Drawer variant="permanent" open={open} >
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: theme.spacing(1) }} >
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItemButton onClick={() => handleNavigation('/dashboard')}>
          <ListItemIcon sx={{ color: 'white' }}><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/admin')}>
          <ListItemIcon sx={{ color: 'white' }}><Person /></ListItemIcon>
          <ListItemText primary="Manage Users" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/service')}>
          <ListItemIcon sx={{ color: 'white' }}><Settings /></ListItemIcon>
          <ListItemText primary="Services" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/customer')}>
          <ListItemIcon sx={{ color: 'white' }}><ShoppingCart /></ListItemIcon>
          <ListItemText primary="Customer" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/site')}>
          <ListItemIcon sx={{ color: 'white' }}><LocationOn /></ListItemIcon>
          <ListItemText primary="Site" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/device')}>
          <ListItemIcon sx={{ color: 'white' }}><Devices /></ListItemIcon>
          <ListItemText primary="Devices" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/task')}>
          <ListItemIcon sx={{ color: 'white' }}><Task /></ListItemIcon>
          <ListItemText primary="Task" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
