import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { getUserName } from "../utils/storage";

const Header = () => {
  const userName: string = getUserName();

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="primary">
            Product Manager
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Avatar>{userName.charAt(0).toUpperCase()}</Avatar>
          <Typography variant="body1">{userName}</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
