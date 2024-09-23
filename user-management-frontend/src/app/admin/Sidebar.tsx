"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { List, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import { Dashboard, Person, Settings, ShoppingCart, LocationOn, Task, Menu as MenuIcon } from '@mui/icons-material'; // Import MenuIcon for burger menu
import { drawerWidth, drawerCollapsedWidth } from './constants'; // Adjust the import path as necessary

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })<{ open: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : drawerCollapsedWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  backgroundColor: 'rgb(31, 41, 55)', // Set background color to match .bg-gray-800
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : drawerCollapsedWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: 'rgb(31, 41, 55)', // Set background color to match .bg-gray-800
  },
}));

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: theme.spacing(1) }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => handleNavigation('/admin/dashboard')}
          sx={{ marginTop: 2 }} // Adjust margin from top
        >
          <ListItemIcon sx={{ color: 'white' }}><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/admin')}>
          <ListItemIcon sx={{ color: 'white' }}><Person /></ListItemIcon>
          <ListItemText primary="Manage Users" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/admin/service')}>
          <ListItemIcon sx={{ color: 'white' }}><Settings /></ListItemIcon>
          <ListItemText primary="Services" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/admin/customer')}>
          <ListItemIcon sx={{ color: 'white' }}><ShoppingCart /></ListItemIcon>
          <ListItemText primary="Customer" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/admin/site')}>
          <ListItemIcon sx={{ color: 'white' }}><LocationOn /></ListItemIcon> {/* Changed icon */}
          <ListItemText primary="Site" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/admin/task')}>
          <ListItemIcon sx={{ color: 'white' }}><Task /></ListItemIcon>
          <ListItemText primary="Task" sx={{ display: open ? 'block' : 'none', color: 'white' }} />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
