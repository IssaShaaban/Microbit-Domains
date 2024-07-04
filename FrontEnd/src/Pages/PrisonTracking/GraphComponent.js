import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function GraphComponent(props) {
  const [serverData, setServerData] = useState(props.serverData);
  const [areaid, setAreaID] = useState(props.areaid);
  const [interpData, setInterpData] = useState(null);


  useEffect(() => {
    setAreaID(props.areaid)
}, [props.areaid]);

  useEffect(() => {
    if (serverData !== null) {
      setInterpData(interpolateData());
    }

    
  }, [areaid]);


  useEffect(() => {
    setServerData(props.serverData)
  }, [props.serverData]);


  useEffect(() => {
    if (serverData !== null) {



        setInterpData(interpolateData());
    }
  }, [serverData]);


  



  function interpolateData () {
    const filteredData = serverData.historySensor.filter(item => item.zone_no === areaid);

    const formattedData = filteredData.map(item => ({
      ...item,
      temperature: item.temperature / 10,
      humidity: item.humidity / 10,
      pressure: item.pressure / 10,
      gas: item.gas * 100,
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    }));




    const interpolatedData = [];
    for (let i = 0; i < formattedData.length; i++) {
      interpolatedData.push(formattedData[i]);
      if (i < formattedData.length - 1) {
        const currentTime = new Date(formattedData[i].timestamp);
        const nextTime = new Date(formattedData[i + 1].timestamp);
        const diffMinutes = (nextTime - currentTime) / (60000);
        if (diffMinutes > 1) {
          for (let j = 1; j < diffMinutes; j++) {
            const missingTime = new Date(currentTime.getTime() + j * 60000);
            interpolatedData.push({
              ...formattedData[i],
              time: missingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
            });
          }
        }
      }
    }
    return interpolatedData;
  };





  return (
    <div style={{ position: "relative" }}>
      <LineChart width={250} height={150} data={interpData} >
        <XAxis dataKey="time" />
        <YAxis />
        <Legend />
        <Line type="monotone" dataKey={props.sensorType} stroke="#8884d8" dot={false} animationDuration={100}/>
      </LineChart>
    </div>
  );
}
