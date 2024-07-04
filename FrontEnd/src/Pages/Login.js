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


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});


export default function Login({ setIsAuthenticated,  setAccessLevel, setUserID, domainSelected, setDomainSelected}) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [drawerVariable, showDrawer] = useState(false);
  const [data, setData] = useState(null);
  const [textDisplay, setText] = useState();
  const [timeMultiplier, setMultiplier] = useState(1);

  const [loginText, setLoginText] = useState(null);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();


  const paperStyling={
    p: 2,
    display: "flex",
    flexDirection: "column",

    margin:1
  }



  

  useEffect(() => {
    if (failedAttempts >= 3) {
      setShowSubmitButton(false);
      setCountdown(10*timeMultiplier);
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            setShowSubmitButton(true);
            setFailedAttempts(2);
            setMultiplier(timeMultiplier*2)
            clearInterval(interval);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [failedAttempts]);


  const fetchLoginCheckFromServer = async () => {
    console.log(name); 
    console.log(password); 
    let x = domainSelected
    if(x === "add")
    {

      x = "Prison"
    }


    var attempt = {"loginID": name, "passkey": password, "domainName": x};
    try{
      const response = await fetch('http://localhost:8081/api/login',{
        method:'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(attempt),

      });
      console.log(JSON.stringify(attempt))

      const data = await response.json();
      console.log(data);
      setData(data)
  }
  catch(error){
      console.log("Error: "+error);
  }
  }

  useEffect(() => {
    if (data && data.success && name==="100000" && domainSelected ==="add")
    {

      setIsAuthenticated(true);
      showDrawer(true);
      setAccessLevel(data.accessTier);
      setUserID(name);
      setDomainSelected("Prison")
      navigate('/addDomain', { state: { domainSelected } });
    }



    else if (data && data.success)
    {
      setIsAuthenticated(true);
      showDrawer(true);
      setAccessLevel(data.accessTier);
      setUserID(name);
      navigate('/tracking', { state: { domainSelected } });
    }

    else if (data && data.message)
    {
      setText(data.message);
      setFailedAttempts(prevAttempts => prevAttempts + 1);
    }
  }, [data]);


  useEffect(() => {
    if(domainSelected === "add")
    {
      setLoginText("Death Row Add Domain")
    }
    else
    {
      setLoginText("Death Row " + domainSelected)
    }
    

  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(name);
    console.log(password);

  fetchLoginCheckFromServer()
    

  };

  useEffect(() => {
    

  }, [domainSelected]);


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
      {drawerVariable && <Drawer name="Prison Map"/>}
        <Box
          sx={{
            flexGrow: 1,
            mt: 1,
            mb: 4,
          }}
        >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={12}>
              <Paper sx={paperStyling} elevation={10}>
                <center ><strong><font  size="7">{loginText}
                                  
                                    <div>LOGIN</div> </font>
                                    <form onSubmit={handleSubmit}>
                  <label>
                    Name:
                    <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    <div></div>
                    Password:
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                  </label>
                  {showSubmitButton && <input type="submit" value="Submit" />}
                  {failedAttempts >= 3 && <div>Submit button will reappear in {countdown} seconds</div>}

                </form>
                  {textDisplay}
                </strong></center>
                

              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      </Box>

    </ThemeProvider>
  );
}
