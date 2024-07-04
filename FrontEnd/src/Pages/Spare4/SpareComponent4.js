import React, { useState, useEffect } from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function SpareComponent4(props) {
  const [inputType, setType] = useState(null);
  const [fail, setFail] = useState(null);
  const [userID, setUserID] = useState(props.userID);
  const [accessLevel, setAccessLevel] = useState(3);

  const [formData, setFormData] = useState({
    trackingOn: false, 
    domainName: "",
    alert1Name: "",
    alert2Name: "",
    alert3Name: "",
    role1: "",
    role2: "",
    role3: "",
    role4: "",
    jsonFile: null

  });


  const [jsonData, setJsonData] = useState(null);

  const handleButton = (event, newType) => {
    setFail(null)
    setType(newType);
    setFormData({
      trackingOn: false, 
      domainName: "",
      alert1Name: "",
      alert2Name: "",
      alert3Name: "",
      role1: "",
      role2: "",
      role3: "",
      role4: ""
    });
    console.log(inputType)
  };


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    // Check if files exist and if there's at least one file
    if (files && files.length > 0) {
      const file = files[0];
      console.log(file);
      const reader = new FileReader();
  
      reader.readAsText(file);
  
      reader.onload = () => {
        try {
          const parsedData = JSON.parse(reader.result);
          setJsonData(parsedData);

        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
    }

//got json through, figure out how to store json correctly

    setFormData((prevData) => ({
        ...prevData,
        [name]: (type === 'checkbox') ? e.target.checked :
                (type === 'file') ? files[0] : value
    }));
};

const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(jsonData);
    formData.jsonFile = JSON.stringify(jsonData);
    console.log(formData); 

    try {
        const response = await fetch('http://localhost:8081/startUp/domainMap',{
            method:'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log(data);
        if(data.success === false) {
            
            setFail(true);
        } else {
          navigate('/SelectDomain'); 
            setFail(false);
        }
    } catch(error) {
        console.log("Error: "+error);
    }

    // Reset form data
    setFormData({
        trackingOn: false, 
        domainName: "",
        alert1Name: "",
        alert2Name: "",
        alert3Name: "",
        role1: "",
        role2: "",
        role3: "",
        role4: "",
        jsonFile: null
    });
};

const deleteDomainFinal = async () => {
  console.log(props.domainSpecifics.domainName)
  try {
    const response = await fetch('http://localhost:8081/api/deleteEnvironment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "domainName": props.domainSpecifics.domainName }),
    });

    const responseData = await response.text();
    console.log(responseData)
    navigate('/SelectDomain');    
  } catch (error) {
    console.log("Error: " + error);
  }
}



const navigate = useNavigate();

function deleteDomain()
{
  deleteDomainFinal()
}


  return (
    <div style={{ position: "relative", textAlign: "left", fontSize: "1.2em" }}>
    <Button variant="outlined" onClick={() => {
        if (window.confirm(`Are you sure you want to delete ${props.domainSpecifics.domainName}?`)) {
          deleteDomain();
        }
      }} style={{ marginRight: '8px' }}>Delete Current Domain ({props.domainSpecifics.domainName})</Button>
    <h2>Settings</h2>

    <form onSubmit={handleSubmit}>
      <text style={{ fontSize: "1.2em" }}><strong>Domain Name</strong></text>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block" }}>
          Name:
          <input type="text" name="domainName" value={formData.domainName} onChange={handleChange} />
        </label>
      </div>
      <text style={{ fontSize: "1.2em" }}><strong>Alarms (Leave Empty To Remove)</strong></text>
      <div style={{}}>
        <label style={{ display: "block" }}>
          Wake Up Alert Name:
          <input type="text" name="alert1Name" value={formData.alert1Name} onChange={handleChange} />
        </label>
      </div>
      <div style={{}}>
        <label style={{ display: "block" }}>
          Room Alarm Name:
          <input type="text" name="alert2Name" value={formData.alert2Name} onChange={handleChange} />
        </label>
      </div>
      <div style={{}}>
        <label style={{ display: "block" }}>
          Emergency Alarm Name:
          <input type="text" name="alert3Name" value={formData.alert3Name} onChange={handleChange} />
        </label>
      </div>
      <text style={{ fontSize: "1.2em" }}><strong>User Roles</strong></text>
      <div style={{}}>
        <label style={{ display: "block" }}>
          Access Level 1 Role:
          <input type="text" name="role1" value={formData.role1} onChange={handleChange} />
        </label>
      </div>
      <div style={{}}>
        <label style={{ display: "block" }}>
          Access Level 2 Role:
          <input type="text" name="role2" value={formData.role2} onChange={handleChange} />
        </label>
      </div>
      <div style={{}}>
        <label style={{ display: "block" }}>
          Access Level 3 Role:
          <input type="text" name="role3" value={formData.role3} onChange={handleChange} />
        </label>
      </div>
      <div style={{}}>
        <label style={{ display: "block" }}>
          Access Level 4 Role:
          <input type="text" name="role4" value={formData.role4} onChange={handleChange} />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <FormControlLabel
          control={
            <Checkbox
              name="trackingOn"
              checked={formData.trackingOn}
              onChange={handleChange}
            />
          }
          label="User Tracking"
        />
      </div>
      <div style={{ marginTop: "20px" }}> <text style={{ fontSize: "1.2em" }}><strong>Upload Map JSON</strong></text>
        <div style={{ marginBottom: "10px" }}>
          <input type="file" name="jsonFile" accept=".json" onChange={handleChange} />
        </div>
      </div>
      <button type="submit" style={{ backgroundColor: "DarkSlateBlue", color: "white", border: "none", padding: "10px 20px" }}>Submit</button>
    </form>
    {fail &&
      <div>Submission Not Valid</div>
    }
    {fail === false &&
      <div>Success</div>
    }
  </div>
  );
}
