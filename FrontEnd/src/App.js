import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrisonTracking from "./Pages/PrisonTracking/PrisonTrackingPage";
import Spare from "./Pages/Spare/SparePage";
import Spare2 from "./Pages/Spare2/SparePage2";
import Spare3 from "./Pages/Spare3/SparePage3";
import Spare4 from "./Pages/Spare4/SparePage4";
import DomainSelect from "./Pages/DomainSelect";

import { Navigate } from "react-router-dom";
import { useState } from 'react';

import Login from "./Pages/Login"


export const PrivateRoute = ({ isAuthenticated, children, domainSelected }) => {
  if (isAuthenticated && domainSelected) {
    return children;
  }
    console.log(isAuthenticated)
    console.log(domainSelected)

  return <Navigate to="/SelectDomain" />;
};

export const DomainSelectedLock = ({ domainSelected, children }) => {
  if (domainSelected) {
    return children;
  }
    
  return <Navigate to="/login" />;
};



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessLevel, setAccessLevel] = useState(0);
  const [userID, setUserID] = useState(0);
  const [domainSelected, setDomainSelected] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/tracking"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} domainSelected = {domainSelected}>
              <PrisonTracking userID = {userID} accessLevel = {accessLevel} domainSelected={domainSelected}/>
            </PrivateRoute>
          }
        />        
        
        <Route
          path="/EntryForm"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} domainSelected = {domainSelected}>
              <Spare userID = {userID} accessLevel = {accessLevel} domainSelected = {domainSelected}/>
            </PrivateRoute>
          }
        />        
        
        <Route
          path="/Timetable"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} domainSelected = {domainSelected}>
              <Spare2 userID = {userID} accessLevel = {accessLevel} domainSelected = {domainSelected}/>
            </PrivateRoute>
          }
        />   
        <Route
          path="/spare3"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} domainSelected = {domainSelected}>
              <Spare3 domainSelected = {domainSelected}/>
            </PrivateRoute>
          }
        /> 
          <Route
          path="/addDomain"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} domainSelected = {domainSelected}>
              <Spare4 isAuthenticated={isAuthenticated} domainSelected = {domainSelected}/>
            </PrivateRoute>
          }
        /> 
        <Route
          path="/SelectDomain"
          element={


              <DomainSelect setDomainSelected={setDomainSelected}/>


          }
        /> 

      <Route
          path="/*"
          element={
            <DomainSelect setDomainSelected={setDomainSelected}/>

          }
        /> 
        <Route path="/login" element={<Login      
              setIsAuthenticated={setIsAuthenticated} 
              setAccessLevel={setAccessLevel} 
              setUserID={setUserID}
              domainSelected={domainSelected}
              setDomainSelected={setDomainSelected}
                />} />
      </Routes>

      
    </Router>
  );
}

export default App;