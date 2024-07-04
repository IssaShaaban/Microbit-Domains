import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Drawer from "../Drawer.js"; 
import SpareComponent from "./SpareComponent.js";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, createTheme, ThemeProvider} from "@mui/material/styles";
import AlertBanners from "../../AlertBanners/AlertBanners.js";
import React, { useState, useEffect } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});



export default function SparePage(props) {
  const [userID, setUserID] = useState(props.userID);
  const [accessLevel, setAccessLevel] = useState(props.accessLevel);

  const paperStyling={
    p: 2,
    display: "flex",
    flexDirection: "column",
    height: 550,
    width: 350,
    margin:1
  }

  const [domainSpecifics, setDomainSpecifics] = useState([]);

  //generalisation of data generalisation of data generalisation of data generalisation of data generalisation of data
    //trackingOn, domainName, alert1, alert2, alert3, role1, role2, role3, role4
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Drawer name="Information Form" userID={userID} domainSpecifics={domainSpecifics}/>
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
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={12}>
                <Paper sx={paperStyling} elevation={10}>
                  <SpareComponent userID = {userID} accessLevel = {accessLevel} domainSpecifics={domainSpecifics}/>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
