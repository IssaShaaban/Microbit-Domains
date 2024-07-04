import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Drawer from "../Drawer.js"; 
import PrisonTrackingComponent from "./PrisonTrackingComponent.js";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import VectorMap, {Layer,  Tooltip } from 'devextreme-react/vector-map';
import { parameter, floorplan, roomsdata } from "./data.js";
import Face5Icon from '@mui/icons-material/Face5';
import FaceIcon from '@mui/icons-material/Face';
import React, { useState, useEffect} from "react";
import DataGrid from 'devextreme-react/data-grid';
import PrisonerDataGrid from './PrisonerDataGrid.js';
import AlertComponent from './AlertComponent.js';
import { Alert } from "@mui/material";
import AlertBanners from "../../AlertBanners/AlertBanners.js";

import { useLocation } from 'react-router-dom'; 

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});


const ss = [
  {
    Name: ".",
  },
  {
    Name: ".",
  }
];




export default function PrisonTrackingPage(props) {
  const [userID, setUserID] = useState(props.userID);
  const [accessLevel, setAccessLevel] = useState(props.accessLevel);

  const [selectedRoom, setSelectedRoom] = useState("");



  const handleRoomSelection = (room) => {

    setSelectedRoom(room);
  };

  const paperStyling={
    p: 2,
    display: "flex",
    flexDirection: "column",
    width: 1100,
    margin:1
  }

  const [roomTags, setRoomTags] = useState();

  function setRooms() {
    const roomNames = serverData.areadata.map(item => item.area.replace(/"/g, '')); // Remove one set of speech marks
    setRoomTags(roomNames);
  }



  function roomToNumber(roomName) {
    const roomMapping = {};

    if (roomTags) {
        roomTags.forEach((tag, index) => {
            roomMapping[tag] = index + 1;
        });
    } else {
        console.error("roomTags is not initialized yet");
        return -1; // or handle this case according to your requirements
    }

    return roomMapping[roomName] !== undefined ? roomMapping[roomName] : -1;
}




  const [serverData, setServerData] = useState(null);
  const [sD, upSD] = useState(ss);

  const [trackingUserID, setTrackerID] = useState();

  useEffect(() => {

  }, [trackingUserID]);


  const fetchDataFromServer = async () => {

    try{
      const response = await fetch('http://localhost:8081/api/data',{
        method:'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({"domainName": props.domainSelected}),

      });

      const data = await response.json();
      console.log(data)
      setServerData(data);
  }
  catch(error){
      console.log("Error: "+error);
  }
  }







  useEffect(() => {

    fetchDataFromServer();

    const intervalId = setInterval(async () => {
      try {
        await fetchDataFromServer();
      } catch (error) {
        console.error('Error fetching and updating data:', error.message);
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);
  

  useEffect(() => {

    if (serverData !== null) {

      upSD(getPeople(serverData));
      setRooms();
    }
  }, [serverData]);


  function getPeople(serverData)
  {
    return serverData.accessdata
  }

  const [domainSpecifics, setDomainSpecifics] = useState([]);




  const fetchMapData = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/mapPull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "domainName": props.domainSelected }),
      });
  
      const responseData = await response.json();



      setDomainSpecifics(responseData[0]);

    } catch (error) {
      console.log("Error: " + error);
    }
  }


  useEffect(() => {

    fetchMapData()
  }, []);


//generalisation of data generalisation of data generalisation of data generalisation of data generalisation of data
  //trackingOn, domainName, alert1, alert2, alert3, role1, role2, role3, role4


//drawer, sidebar, alerts, room names, roles







  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Box sx={{ display: "flex" }}>
      <Drawer name={domainSpecifics.domainName+" Tracking"} userID={userID} domainSpecifics={domainSpecifics}/>
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: '150px', 
          mt: 1,
          mb: 4,
        }}
      >
        <Toolbar />
        <AlertBanners/>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={0} direction="row">
            {/* Chart */}
            <Grid item xs={12} md={8} lg={6}>
              <Paper sx={paperStyling} elevation={10}>
                {accessLevel >= 1 && <PrisonTrackingComponent trackerID={trackingUserID}onRoomSelect={handleRoomSelection} serverData={serverData} domainSpecifics={domainSpecifics} domainSelected={props.domainSelected}/>}
                {accessLevel >= 1 && <PrisonerDataGrid setTrackerID={setTrackerID} roomName={selectedRoom} serverData={serverData} areaid={roomToNumber(selectedRoom)} domainSpecifics={domainSpecifics} mapCoords={[]}/>}
              </Paper>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </Box>
  </ThemeProvider>
  );
}



/*                                    {accessLevel >= 3 && <text>Latest door access</text>}
{accessLevel >= 3 && <DataGrid
                    id="grid"
                    dataSource={sD}
                    showBorders={true}
                    showColumnLines={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    showRowLines={true}
                    columnHidingEnabled={true}
                    columnResizingMode="widget"
                  />} */


// outdoor area: [-110, 50]
// cafeteria: [16, 56]
// security room: [110, 13]
// solitary confinement: [126, -54]
// main room:[15, -50]
// cell block:[-118, -49]
// inside visitation: [14, -79]
// outside visitation: [15, -114]