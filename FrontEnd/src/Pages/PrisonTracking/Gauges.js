import React, { useState, useEffect} from "react";
import DataGrid from 'devextreme-react/data-grid';
import DataComponent from './DataComponent';
import {
  CircularGauge,
  Scale,
  Label,
  RangeContainer,
  Range,
  Title,
  Font,
  Export,
} from 'devextreme-react/circular-gauge';


export default function Gauges(props) {


  const gaugeSize = { width: 150, height: 150 };
  
  const [selectedRoom, setSelectedRoom] = useState(props.roomName);
  const [sensorData, setSensorData] = useState({
    Temperature: 1000,
    Humidity: 1000,
    Pressure: 1000,
    GasLevel: 1000
  });
  const [serverData, setServerData] = useState(null);



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
    if (serverData !== null) {
      setRooms()
      setSensorData(getSensorData(serverData));
    }
  }, [serverData]);

  useEffect(() => {
    setSensorData(getSensorData(serverData));
  }, [selectedRoom]);

  useEffect(() => {
    setSelectedRoom(props.roomName);
  }, [props.roomName]);

  useEffect(() => {
    setServerData(props.serverData)
  }, [props.serverData]);



  function getSensorData(data) {
    if (data !== null && selectedRoom!== null)
    {

      let areaNum = roomToNumber(selectedRoom)
      let dataNew = data.sensordata.find(zone => zone.zone_no === areaNum);

      if(dataNew)
      {
        const sD = {
          Temperature: dataNew.temperature, 
          Humidity: dataNew.humidity, 
          Pressure: dataNew.pressure, 
          GasLevel: dataNew.gas
        };

      return sD;
      }
      if(!dataNew)
      {
        const sD = {
          Temperature: 0, 
          Humidity: 0, 
          Pressure: 0, 
          GasLevel: 0
        };

      return sD;
      }
    }
    else{
      return {
        Temperature: 50, 
        Humidity: 50, 
        Pressure: 50, 
        GasLevel: 50
      }
    }
  }



  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column' }}>
        <CircularGauge
          id="gauge1"
          value={sensorData.Temperature/10}
          size={gaugeSize}
        >
          {/* Gauge 1 */}
          <Scale
            startValue={-10}
            endValue={50}
            tickInterval={10}
          >
            <Label useRangeColors={true} />
          </Scale>
          <RangeContainer palette="Bright">
            <Range startValue={0} endValue={20} />
            <Range startValue={20} endValue={30} />
            <Range startValue={30} endValue={50} />
          </RangeContainer>
          <Title text="Temperature (°C)">
            <Font size={16} color="#FFFFFF"/>
          </Title>
        </CircularGauge>

        <CircularGauge
          id="gauge2"
          value={sensorData.Humidity/10}
          size={gaugeSize}
        >
          {/* Gauge 2 */}
          <Scale
            startValue={0}
            endValue={100}
            tickInterval={10}
          >
            <Label useRangeColors={true} />
          </Scale>
          <RangeContainer palette="Bright">
            <Range startValue={30} endValue={55} />
            <Range startValue={55} endValue={75} />
            <Range startValue={75} endValue={100} /> 
          </RangeContainer>
          <Title text="Humidity (%)">
            <Font size={16} color="#FFFFFF"/>
          </Title>
        </CircularGauge>

        <CircularGauge
          id="gauge3"
          value={sensorData.Pressure/10}
          size={gaugeSize}
        >
          {/* Gauge 3 */}
          <Scale
            startValue={0}
            endValue={5000}
            tickInterval={300}
          >
            <Label useRangeColors={true} />
          </Scale>
          <RangeContainer palette="Bright">
            <Range startValue={0} endValue={1500} />
            <Range startValue={1500} endValue={3000} />
            <Range startValue={3000} endValue={5000} />
          </RangeContainer>
          <Title text="Pressure (hPa)">
            <Font size={16} color="#FFFFFF"/>
          </Title>
        </CircularGauge>

        <CircularGauge
          id="gauge4"
          value={sensorData.GasLevel*100}
          size={gaugeSize}
        >
          {/* Gauge 4 */}
          <Scale
            startValue={0}
            endValue={50000}
            tickInterval={10000}
          >
            <Label useRangeColors={true} />
          </Scale>
          <RangeContainer palette="Bright">
            <Range startValue={3000} endValue={20000} />
            <Range startValue={20000} endValue={40000} />
            <Range startValue={40000} endValue={50000} />
          </RangeContainer>
          <Title text="Gas Levels (Ω)"> 
            <Font size={16} color="#FFFFFF"/>
          </Title>
        </CircularGauge>
      </div>
    </div>
  );
}
