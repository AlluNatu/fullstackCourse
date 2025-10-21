import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import "../styles/header.css"
import { Avatar, Typography } from '@mui/material';
import React, { useEffect, useState } from "react";


export const Header = () => {

  // Simple function to handle logout, removes token and takes user to /login
  const handleLogOut = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  // Check if token is there
  const token: string | null = localStorage.getItem("token")


  // Check for token so knows what to return and to render

  if (token) {
    return (
      // AppBar
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {"Course appreciation app"}
            </Typography>
            {/* Buttons for different things such as change language and handle logout */}
              <Button onClick={handleLogOut} color="inherit">{"logout"}</Button>
          </Toolbar>
        </AppBar>
      </Box>
    )
  }

// No token, different return and render

  if (!token) {
    return (
      <Box sx={{ flexGrow: 2 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {"Course appreciation app"}
            </Typography>
              <Button component={Link} to="/login" color="inherit">{"login"}</Button>
              <Button component={Link} to="/signup" color="inherit">{"signup"}</Button>
          </Toolbar>
        </AppBar>
      </Box>
    )
  }
  }


export default Header