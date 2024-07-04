import React, { useState, useEffect} from "react";
import VectorMap, { Layer, Tooltip, Label, Font } from 'devextreme-react/vector-map';
 //import { parameter, floorplan, roomsdata } from "./data.js";
import { parameter, floorplan, roomsdata , countPerRoom, setcountPerRoom, setfloorplan, setparameter, setroomsdata} from "./data2.js";
//import { parameter, floorplan, roomsdata , countPerRoom} from "./data.js";
import DataGrid from 'devextreme-react/data-grid';
import { orders } from './data.js';
import Gauges from './Gauges.js';
import 'devextreme/dist/css/dx.dark.css';

import axios from 'axios';

export default function PrisonTrackingComponent(props) {
  const [roomCountData, setRoomCountData] = useState(countPerRoom);
  const [serverData, setServerData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [emergencyType, setEmergencyType] = useState(0);

  function alertData()
  {
    try{
      setEmergencyType(serverData.alertdata[0].alertType);
    }
    catch{}
  }


  const [emergencyText, setEmergencyText] = useState(null);


  const [roomTags, setRoomTags] = useState();

  const projection = {
    to: ([l, lt]) => [l / 200, lt / 200],
    from: ([x, y]) => [x * 200, y * 200],
  };

  const roomCoordinates = [[-140, 50], [-10, 56], [155, 20], [186, -54], [-15, -45], [-150, -49], [-15, -80], [-10, -114]];



  const [data, setData] = useState(null);

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
      setData(responseData);

      setRoomTags(JSON.parse(responseData[0].misc).roomNames);
      setMapCoords(JSON.parse(data[0].misc).mapCenterCoordinates);
    } catch (error) {
      console.log("Error: " + error);
    }
  }
  
  useEffect(() => {
    if (data && roomTags.length > 0) {
      setMapCoords(JSON.parse(data[0].misc).mapCenterCoordinates);
      setcountPerRoom(JSON.parse(data[0].countPerRoom));
      setfloorplan(JSON.parse(data[0].floorplan));
      setparameter(JSON.parse(data[0].parameter));
      setroomsdata(JSON.parse(data[0].roomsdata));
      setTextLength(JSON.parse(data[0].misc).textLengthMax);

      setIconSize(JSON.parse(data[0].misc).iconSize);
      setTextSize(JSON.parse(data[0].misc).textSize);
      setSmallLabels(JSON.parse(data[0].misc).smallLabels);
      try{
        setLineCoordinates(JSON.parse(data[0].misc).roomCoordsTracking);

      }
      catch{}
      

    }
  }, [data, roomTags]);

  /** 
  { "x": 580, "y": 440 }, 
  { "x": 610, "y": 370 }, 
  { "x": 610, "y": 280 }, 
  { "x": 610, "y": 160 }, 
  { "x": 540, "y": 120 }, 
  { "x": 450, "y": 120 }, 
  { "x": 330, "y": 120 },
  { "x": 290, "y": 210 },


  { "x": 280, "y": 300 },
  { "x": 280, "y": 400 },
  { "x": 350, "y": 440 },
  { "x": 440, "y": 440 }

*/

  const [mapCoords, setMapCoords] = useState([-120,0]);



  const [textLength, setTextLength] = useState(10);




  useEffect(() => {

    fetchMapData()
  }, []);






  useEffect(() => {
    if (serverData !== null)
    {
      mapData();
      
    }
    
  }, [roomTags, serverData]);

  function mapData() {
    setMapCoords(JSON.parse(data[0].misc).mapCenterCoordinates)
    findPrisonerMovement();
    setRoomCountData((prevData) => {
      const newData = { ...prevData };
      let i = 0;

      let prisonersArray = getPrisonerCount(serverData.mvmtdata);
      let guardsArray = getGuardCount(serverData.mvmtdata);
      


      newData.features.forEach((feature) => {
        let tag = roomTags[i];
        let tagFormatted = "";
  
        if (tag) {
          if (tag.length > textLength) {
            let words = tag.split(" ");
            tagFormatted = words.map(word => word.charAt(0)).join("");
          } else {
            tagFormatted = tag;
          }
        }
  
        let prisonerCount = prisonersArray[i] !== undefined ? prisonersArray[i] : 0;
        let guardCount = guardsArray[i] !== undefined ? guardsArray[i] : 0;
  
        if(smallLabels === 1)
        {
          feature.properties.count = "<strong>" + tagFormatted + "</strong>" + "\n"+props.domainSpecifics.role1[0]+": " + prisonerCount + "\nS: " + guardCount;

        }
        else
        {
          feature.properties.count = "<strong>" + tagFormatted + "</strong>" + "\n"+props.domainSpecifics.role1+": " + prisonerCount + "\nStaff: " + guardCount;

        }

        setMapCoords(JSON.parse(data[0].misc).mapCenterCoordinates);
        i++;
      });
      return newData;
    });

    if (serverData.alertdata.length !== 0) {
      alertData();
    } else {
      setEmergencyType(0);
      setEmergencyText(null);
    }
  }
  




  useEffect(() => {
    if (serverData !== null) {
      mapData()
    }
  }, [serverData]);

  useEffect(() => {
    setServerData(props.serverData)
  }, [props.serverData]);

  function getPrisonerCount(jsonObjects) {
    const areaCounts = new Array(70).fill(0);
    jsonObjects.forEach(obj => {
      if(obj.userid <=90000) {
        const { area } = obj;
        areaCounts[area - 1]++;
      }
    });
    return areaCounts;
  }
  
  function getGuardCount(jsonObjects) {
    const areaCounts = new Array(70).fill(0);
    jsonObjects.forEach(obj => {
      if(obj.userid >=90000) {
        const { area } = obj;
        areaCounts[area - 1]++;
      }
    });
    return areaCounts;
  }

  function handleRoomClick(event) {
    setMapCoords(JSON.parse(data[0].misc).mapCenterCoordinates)
    if(event.target) {
      if(event.target.attribute('name') !== undefined)
      {
        setSelectedRoom(event.target.attribute('name'))
        props.onRoomSelect(event.target.attribute('name'));
      }

    }
  }
  const getColor = () => {
    switch (emergencyType) {
      case 0:
        return "#636363";
      case 1:
        return "#0096FF";
      case 2:
        return "orange";
      case 3:
        return "red";
      case 4:
        return "purple";
      case 5:
        return "purple";
      case 6:
        return "purple";
      case 7:
        return "purple";  
      case 8:
        return "yellow";      
        
      default:
        return "#3b3b3b";
    }
  };

  const getDarkColours = () => {
    switch (emergencyType) {
      case 0:
        return "#424242";
      case 1:
        return "#00008B";
      case 2:
        return "DarkOrange";
      case 3:
        return "#8B0000";
      case 4:
        return "#9932CC"; 
      case 5:
        return "#9932CC";
      case 6:
        return "#9932CC"; 
      case 7:
        return "#9932CC";   
      case 8:
        return "DarkGoldenRod";   
      default:
        return "#333333";
    }
};



const [lineCoordinates, setLineCoordinates] = useState(10);



  const lineCords = [
    { x: 300, y: 225 }, //outdoor
    { x: 500, y: 200 }, //cafeteria
    { x: 630, y: 280 }, //security room
    { x: 630, y: 380 }, //solitary confinement
    { x: 490, y: 365 }, //main room
    { x: 280, y: 370 }, //cell block
    { x: 490, y: 420 }, //prisoner visitation area
    { x: 490, y: 480 }, //visitation area
  ];




  
  const [history, setHistory] = useState(null);
  const [trackingUserID, setTrackingID] = useState(props.trackerID);
  const [newCoordinates, setCoordinates] = useState(null);

  useEffect(() => {
    findPrisonerMovement();
    
  }, [trackingUserID]);

  useEffect(() => {
    setTrackingID(props.trackerID)
    
  }, [props.trackerID]);

  
  useEffect(() => {
    createCoordinates()
  }, [history]);



  function createCoordinates() {
    if(props.domainSpecifics.trackingOn === "1")
    {
      if (!history) return []; 

      const coordinates = history.map((locationIndex) => lineCoordinates[locationIndex - 1]);

      setCoordinates(coordinates)

    }

}



  function findPrisonerMovement() {
      if(serverData !== null)
      {
              let history = [];

        let userEntries = serverData.mvmtHistory.filter(entry => entry.userid === trackingUserID);


        for (let i = 0; i < userEntries.length; i++) {

            history.push(userEntries[i].area);
        }
        setHistory(history) ;        
      }
  
    }

    
   
    useEffect(() => {
      const intervalId = setInterval(() => {
        try{
          setMapCoords(JSON.parse(data[0].misc).mapCenterCoordinates);
          
        }
        catch{}

      }, 100);
  

      return () => clearInterval(intervalId);
    }, []); 



    const [textSize, setTextSize] = useState(10);
    const [iconSize, setIconSize] = useState(10);
    const [smallLabels, setSmallLabels] = useState(0);



  return (
<div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%' }}>
  <VectorMap
    center={mapCoords}
    id='vector-map'
    maxZoomFactor={1}
    projection={projection}
    height={600} 
    width={1200} 
    onClick={handleRoomClick}
    panningEnabled={false}
    zoomingEnabled={false} 
  >
    {/* Layers */}
    <Layer dataSource={parameter} hoverEnabled={false} name="parameter" color={getColor()}></Layer>
    <Layer dataSource={floorplan} hoverEnabled={false} name="floorplan" color="#141414"></Layer>
    <Layer dataSource={roomsdata} hoverEnabled={true} name="rooms" borderWidth={1.5} color={getDarkColours()} borderColor="0"></Layer>

    <Layer
      dataSource={roomCountData}
      type="marker"
      elementType="image"
      dataField="url"
      size={iconSize}
      style={{ pointerEvents: 'none' }}
      >
      <Label dataField="count" style={{ pointerEvents: 'none' }}>
        <Font size={textSize} style={{ pointerEvents: 'none' }} />
      </Label>
    </Layer>
  </VectorMap>
  <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto" markerUnits="strokeWidth">
      <polygon points="0 0, 10 3.5, 0 7" fill="red" />
    </marker>
  </defs>
  {newCoordinates ? (
    <>{}
      <path
        d={newCoordinates.map((point, index) =>
          index === 0 ? `M${point.x} ${point.y}` : `L${point.x} ${point.y}`
        ).join(' ')}
        stroke="red" 
        strokeWidth="3" 
        fill="none"
        {...(newCoordinates.length > 1 && { markerEnd: "url(#arrowhead)" })}
      />
      {newCoordinates.length > 0 && (
        <circle cx={newCoordinates[0].x} cy={newCoordinates[0].y} r="4" fill="red" />
      )}
    </>
  ) : null}
</svg>


  <div style={{ flex: '1' }}>
    <Gauges roomName={selectedRoom} serverData={serverData}/>
  </div>
</div>

  );
}
