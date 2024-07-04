import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alerts from "./Spare3/SpareComponent3.js"
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import { useState, useEffect } from 'react';

import GpsFixedIcon from '@mui/icons-material/GpsFixed';



const drawerWidth = 220;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer1 = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Drawer(props) {


  const [userID, setUserID] = useState();
  const [mainListItems, setMainListItem] = useState((
    <React.Fragment>
  
      <ListItemButton component={Link} to="/tracking">
        <ListItemIcon>
          <GpsFixedIcon />
        </ListItemIcon>
        <ListItemText primary="Tracking" />
      </ListItemButton>
      <ListItemButton component={Link} to="/EntryForm">
        <ListItemIcon>
          <GpsFixedIcon />
        </ListItemIcon>
        <ListItemText primary="Entry Form" />
      </ListItemButton>
      <ListItemButton component={Link} to="/Timetable">
        <ListItemIcon>
          <GpsFixedIcon />
        </ListItemIcon>
        <ListItemText primary="Timetable" />
      </ListItemButton>

    
      {/* <ListItemButton component={Link} to="/spare3">
        <ListItemIcon>
          <GpsFixedIcon />
        </ListItemIcon>
        <ListItemText primary="S" />
      </ListItemButton> */}
  
  
    </React.Fragment>
  ));


  useEffect(() => {
    setUserID(props.userID)

  }, []);

  useEffect(() => {

    if(props.userID === "100000")
    {
      setMainListItem((
        <React.Fragment>
      
          <ListItemButton component={Link} to="/tracking">
            <ListItemIcon>
              <GpsFixedIcon />
            </ListItemIcon>
            <ListItemText primary="Tracking" />
          </ListItemButton>
          <ListItemButton component={Link} to="/EntryForm">
            <ListItemIcon>
              <GpsFixedIcon />
            </ListItemIcon>
            <ListItemText primary="Entry Form" />
          </ListItemButton>
          <ListItemButton component={Link} to="/Timetable">
            <ListItemIcon>
              <GpsFixedIcon />
            </ListItemIcon>
            <ListItemText primary="Timetable" />
          </ListItemButton>
    
          <ListItemButton component={Link} to="/addDomain">
            <ListItemIcon>
              <GpsFixedIcon />
            </ListItemIcon>
            <ListItemText primary="Add Domain" />
          </ListItemButton>
        
          {/* <ListItemButton component={Link} to="/spare3">
            <ListItemIcon>
              <GpsFixedIcon />
            </ListItemIcon>
            <ListItemText primary="S" />
          </ListItemButton> */}
      
      
        </React.Fragment>
      )


      )      
    }

  }, [userID]);



  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={window.open}>
          <Toolbar>
            <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
            {props.name}
            </Typography>
              <Alerts domainSpecifics={props.domainSpecifics}></Alerts>
            <Typography variant="subtitle" color="inherit">
              {props.userID}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer1 variant="permanent" open={window.open}>
          <List component="nav">{mainListItems}</List>
        </Drawer1>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />

        </Box>
      </Box>
    </ThemeProvider>
  );
}
