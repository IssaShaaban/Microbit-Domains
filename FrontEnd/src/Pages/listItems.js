import * as React from "react";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccessibilityIcon from "@mui/icons-material/Accessibility";

import GpsFixedIcon from '@mui/icons-material/GpsFixed';



export const mainListItems = (
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
);
