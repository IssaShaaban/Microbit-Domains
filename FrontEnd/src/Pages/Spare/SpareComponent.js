import React, { useState, useEffect } from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function SpareComponent(props) {
  const [inputType, setType] = useState(null);
  const [fail, setFail] = useState(null);
  const [userID, setUserID] = useState(props.userID);
  const [accessLevel, setAccessLevel] = useState(3);

  const [formData, setFormData] = useState({
    age: "",
    entryTime: "",
    exitTime: "",
    extra_info: "",
    fname: "",
    gender: "",
    sname: "",
    userid: "",
    password:"",
    url:""
  });

  
  const handleButton = (event, newType) => {
    setFail(null)
    setType(newType);
    setFormData({
      age: "",
      entryTime: "",
      exitTime: "",
      extra_info: "",
      fname: "",
      gender: "",
      sname: "",
      password: "",
      url:""
    });
  };





  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const [message, setMessage] = useState();

  const handleSubmit = async(e) => {
    e.preventDefault();
    formData.inputtype = inputType

    formData.domainName = props.domainSpecifics.domainName
    console.log(props.domainSpecifics.domainName)
    try{
        const response = await fetch('http://localhost:8081/api/form',{
          method:'POST',
          headers: {
            'Content-Type':'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        setMessage(data.message)
        if(data.success === false)
        {
          setFail(true);
        }
        else
        {
          setFail(false);
        }
    }
    catch(error){
        console.log("Error: "+error);
    }

    setFormData({
      age: "",
      entryTime: "",
      exitTime: "",
      extra_info: "",
      fname: "",
      gender: "",
      sname: "",
      password:"",
      url:""
    });

  };

  return (
    <div style={{ position: "relative", textAlign: "left" , fontSize: "1.2em" }}>
    <ToggleButtonGroup
      color="primary"
      value={inputType}
      exclusive
      onChange={handleButton}
      aria-label="Platform"
    >
      {(accessLevel === 3 || accessLevel === 2 || accessLevel === 1) && (
        <ToggleButton value={1}>{props.domainSpecifics.role1}</ToggleButton>
      )}
      {(accessLevel === 3 || accessLevel === 2) && (
        <ToggleButton value={2}>{props.domainSpecifics.role2}</ToggleButton>
      )}
      {accessLevel === 3 && (
        <ToggleButton value={3}>{props.domainSpecifics.role3}</ToggleButton>
      )}
    </ToggleButtonGroup>
      {inputType !== null && (<>
      <h2></h2>
      <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>
            First Name:
            <input type="text" name="fname" value={formData.fname} onChange={handleChange} />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>
            Last Name:
            <input type="text" name="sname" value={formData.sname} onChange={handleChange} />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>
            Gender:
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
          </label>
        </div>


        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>
            Age:
            <input type="number" name="age" value={formData.age} onChange={handleChange} />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>
            Entry Time:
            <input type="datetime-local" name="entryTime" value={formData.entryTime} onChange={handleChange} />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>
            Exit Time:
            <input type="datetime-local" name="exitTime" value={formData.exitTime} onChange={handleChange} />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>
            Extra Info:
            <input type="text" name="extra_info" value={formData.extra_info} onChange={handleChange} />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>
            Image:
            <input type="text" name="url" value={formData.url} onChange={handleChange} />
          </label>
        </div>
        {(inputType === 2 || inputType === 3) && (
<>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>
        </div>
        </>)}


        <button type="submit" style={{ backgroundColor: "DarkSlateBlue", color: "white", border: "none", padding: "10px 20px"}}>Submit</button>
      </form></>)}
      {fail &&
        <div>Submission Not Valid</div>
      }
      {fail === false &&
        <div>{message}</div>
      }
    </div>
  );
}
