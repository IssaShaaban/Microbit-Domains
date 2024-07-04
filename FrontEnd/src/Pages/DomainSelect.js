import { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Drawer from "./Drawer.js"; 
import CssBaseline from "@mui/material/CssBaseline";
import { styled, createTheme, ThemeProvider} from "@mui/material/styles";
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";

import { Add } from '@mui/icons-material';
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});


export default function DomainSelect({ setDomainSelected }) {



  const fetchReport = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/selectEnvironment', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const responseData = await response.json();
      setDomains(responseData.map(item => item.domainName))

    } catch (error) {
      console.log("Error: " + error);
    }
  }


  useEffect(() => {
    fetchReport();
  }, []);




  const paperStyling = {
    padding: '20px',
    borderRadius: '20px',
    textAlign: 'center'
  };

  const navigate = useNavigate();
  const [domains, setDomains] = useState();


  const handleDomainSelection = (domain) => {
  


  if(domain === "add")
  {
    setDomainSelected(domain)
    navigate('/login');   
  }
  else
  {
    setDomainSelected(domain)
    navigate('/login');    
  }


  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, mt: 1, mb: 4 }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={12}>
                <Paper sx={paperStyling} elevation={10}>
                  <center>
                    <strong>
                      <font size="7">Select Domain</font>
                    </strong>
                  </center>
                  {domains && domains.map((domain, index) => (
                    <Button
                      key={index}
                      color="success"
                      size="extraLarge"
                      variant="contained"
                      onClick={() => handleDomainSelection(domain)}
                      sx={{
                        fontSize: '1.5rem',
                        padding: '40px 20px',
                        marginRight: '30px', 
                        backgroundColor: 'DeepSkyBlue', 
                        '&:hover': {
                          backgroundColor: 'DodgerBlue', 
                        },
                      }}
                    >
                      {domain}
                    </Button>
                  ))}
                  <Button
                    color="success"
                    size="extraLarge"
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleDomainSelection('add')}
                    sx={{
                      fontSize: '1.5rem', 
                      padding: '20px 10px',
                      marginRight: '30px', 
                      backgroundColor: 'DeepSkyBlue',
                      '&:hover': {
                        backgroundColor: 'DodgerBlue', 
                      },
                    }}
                  >
                    Add
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
