import React, { useState, useEffect} from "react";
import DataComponent from './DataComponent';
import Button from '@mui/material/Button';
import GraphComponent from "./GraphComponent";
import PrisonerHistory from "./PrisonerHistory";

const p = [
  {
    Name: ".",
  },
  {
    Name: ".",
  }
];
const sD = {
  Temperature: 22,
  Humidity: 20,
  Pressure: 60,
  GasLevel: 30
};

const data = [
  { areaId: 1, temperature: 20, timestamp: "2024-02-17T08:01:00" },
  { areaId: 1, temperature: 22, timestamp: "2024-02-17T08:02:00" },
  { areaId: 2, temperature: 24, timestamp: "2024-02-17T08:04:00" },
  { areaId: 1, temperature: 20, timestamp: "2024-02-17T08:06:00" },
  { areaId: 1, temperature: 22, timestamp: "2024-02-17T08:07:00" },
  { areaId: 2, temperature: 24, timestamp: "2024-02-17T08:08:00" },
  { areaId: 1, temperature: 20, timestamp: "2024-02-17T08:09:00" },
  { areaId: 1, temperature: 22, timestamp: "2024-02-17T08:11:00" },
  { areaId: 2, temperature: 24, timestamp: "2024-02-17T08:14:00" },
  { areaId: 1, temperature: 30, timestamp: "2024-02-17T08:20:00" },
  { areaId: 1, temperature: 25, timestamp: "2024-02-17T09:20:00" },
  { areaId: 1, temperature: 28, timestamp: "2024-02-17T09:22:00" },
];



export default function PrisonerDataGrid(props) {
  
  const [selectedRoom, setSelectedRoom] = useState(props.roomName);
  const [peopleData, setPeopleData] = useState(p);
  const [serverData, setServerData] = useState(props.serverData);
  const [imgGallery, setImageData] = useState(null);
  const [historySwitch, setHistorySwitch] = useState("History");
  const [prisonerIDForHistory, setPrisonerID] = useState(null);
  const [areaid, setAreaID] = useState(props.areaid);
  const [emergencyText, setEmergencyText] = useState(null);
  const [emergencyType, setEmergencyType] = useState(0);
  const [extraText, setExtraText] = useState(null);



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
useEffect(() => {
  setAreaID(props.areaid)
}, [props.areaid]);


useEffect(() => {

  props.setTrackerID(prisonerIDForHistory)
}, [prisonerIDForHistory]);


useEffect(() => {
  setPrisonerID(null)
}, [historySwitch]);

const emergencyTags = ["Room Alarms", "Alert Staff", "Emergency", "TEMPERATURE WARNING", "HUMIDITY WARNING", "PRESSURE WARNING", "GAS LEVEL WARNING", "WARNING FROM STAFF"];

useEffect(() => {
  if (serverData !== null) {

    setPeopleData(getPeople(serverData));
    setRooms()

    if(serverData.alertdata.length !== 0)
    {
      alertData()
    }
    else
    {
      setEmergencyType(0)
      setEmergencyText(null)
    }
    /* 
    if(serverData.lastAlert.active === true)
    {
      setEmergencyType(serverData.lastAlert.alertType)
      setEmergencyText(emergencyTags[(serverData.lastAlert.alertType)-1])
    }
    else
    {
      setEmergencyType(0)
      setEmergencyText(null)
    }
*/

  }
}, [serverData]);




  function alertData()
  {
    try
    {
      setEmergencyType(serverData.alertdata[0].alertType);
      setEmergencyText(emergencyTags[(serverData.alertdata[0].alertType)-1])      
      setExtraText(serverData.alertdata[0].extraInfo)
    }
    catch
    {}

  }



useEffect(() => {
  setPeopleData(getPeople(serverData))
  setPrisonerID(null)
}, [selectedRoom]);


useEffect(() => {
  getImages()
}, [peopleData]);



useEffect(() => {
  setSelectedRoom(props.roomName);
}, [props.roomName]);

useEffect(() => {
  setServerData(props.serverData)
}, [props.serverData]);



  function getPeople(data) {

    if (data !== null && selectedRoom!== null) {

      
      let areaNum = roomToNumber(selectedRoom);

      let peopleInRoom = data.mvmtdata.filter(person => person.area === areaNum);

      let modifiedPeople = peopleInRoom.map(person => {
        const { area, ...personWithoutArea } = person;


        return personWithoutArea;
      });

      modifiedPeople.forEach(person => {
        person.entryTime = formatDate(person.entryTime);
        person.exitTime = formatDate(person.exitTime);
      });

      return modifiedPeople;
    }

    return p;
  }

  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-UK', options);
}



function getImages() {

  let imgArray = [];
  for (let i = 0; i < peopleData.length; i++) {
    let role = peopleData[i].userid > 90000 ? "guard" : "prisoner";
    try
    {
      imgArray.push({
        imageUrl: peopleData[i].url,
        name: peopleData[i].fname + " " + peopleData[i].sname[0],
        role: role
      });
    }
    catch
    {
    }
  }
  setImageData(imgArray);
}


  const handleSwitch = () => {
    setHistorySwitch(historySwitch === 'Tracking' ? 'History' : 'Tracking');
  };


  const handleButtonClick = async (e) => {
    console.log("SEND FALSE TO DATABASE");
  
    try {
      const requestBody = {
        message: "false",
        domainName: props.domainSpecifics.domainName
      };
  
      const response = await fetch('http://localhost:8081/api/cancelAlerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();

  
    } catch (error) {
      console.log("Error: " + error);
    }

  };
  const fetchReport = async () => {

    try {
      const response = await fetch('http://localhost:8081/api/incidentReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "domainName": props.domainSpecifics.domainName }),
      });
  
      const responseData = await response.text();


      const newWindow = window.open('', '_blank');
      newWindow.document.write(responseData);

    } catch (error) {
      console.log("Error: " + error);
    }
  }

  function showReport()
  {

    fetchReport()
    
  }

  return (
    <div>
    {emergencyType > 0 && <h1>{emergencyText+": "+extraText+" "}<Button variant="contained"onClick={handleButtonClick}>Abort</Button></h1>}



    <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{selectedRoom}</span>
      <div>
        <Button variant="outlined" onClick={showReport} style={{ marginRight: '8px' }}>Report</Button>
        <Button variant="contained" onClick={handleSwitch}>{historySwitch}</Button>
      </div>
    </h2>
    {historySwitch === "Tracking" && (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <GraphComponent areaid={areaid} serverData={serverData} sensorType={"temperature"}/>
        <GraphComponent areaid={areaid} serverData={serverData} sensorType={"humidity"}/>
        <GraphComponent areaid={areaid} serverData={serverData} sensorType={"pressure"}/>
        <GraphComponent areaid={areaid} serverData={serverData} sensorType={"gas"}/>
      </div>
    )}
        <DataComponent data={peopleData} setPrisonerID={setPrisonerID} domainSpecifics={props.domainSpecifics}/>

        {prisonerIDForHistory === null && 
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {imgGallery !== null && 
            imgGallery.map((person, index) => (
              <div key={index} style={{ marginRight: '20px' }}>
                <img 
                  src={person.imageUrl} 
                  height="100" 
                  width="100" 
                  style={{ 
                    border: `4px solid ${person.role === "guard" ? "DodgerBlue" : "orange"}`,
                    marginTop: '20px' 
                  }} 
                />          
                <p style={{ textAlign: 'center', marginTop: '5px', marginBottom: '0' }}>{person.name}</p>
              </div>
            ))
          }
        </div>
        }
        {prisonerIDForHistory !== null && 
          <PrisonerHistory serverData={serverData} userid={prisonerIDForHistory} domainSpecifics={props.domainSpecifics}/>
        
        }
  </div>
  )}
