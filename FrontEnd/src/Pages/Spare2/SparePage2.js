import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Drawer from "../Drawer.js"; 
import SpareComponent2 from "./SpareComponent2.js";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, createTheme, ThemeProvider} from "@mui/material/styles";
import AlertBanners from "../../AlertBanners/AlertBanners.js";
import React, { useState, useEffect} from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});


export default function SparePage2(props) {


  const paperStyling={
    p: 2,
    display: "flex",
    flexDirection: "column",
    height: 800,
    width: 1000,
    margin:1
  }

  const [domainSpecifics, setDomainSpecifics] = useState([]);

//generalisation of data generalisation of data generalisation of data generalisation of data generalisation of data
  //trackingOn, domainName, alert1, alert2, alert3, role1, role2, role3, role4
useEffect(() => {
  let specifics = {
    trackingOn: true,
    domainName: "Hotel",
    alert1Name: "",
    alert2Name: "Alert Room",
    alert3Name: "Emergency",
    role1: "Guest",
    role2: "Cleaner",
    role3: "Worker",
    role4: "Manager"
  };

  setDomainSpecifics(specifics);

  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
      <Drawer name="Information Form" userID={props.userID} domainSpecifics={domainSpecifics}/>
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
                  <text >Timetable</text>
                  <SpareComponent2 userID={props.userID} accessLevel={props.AccessLevel}
                  domainSelected={props.domainSelected}/>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
