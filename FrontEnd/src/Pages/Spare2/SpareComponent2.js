import React, { useRef, useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.dark.css';
import Scheduler, { Resource, Editing } from 'devextreme-react/scheduler';
import { Button } from "@mui/material";
import { prisonersTimetable, guardsTimetable, prisonSupervisorsTimetable, prisonManagersTimetable, hotelEventsTimetable, staffsTimetable, hotelSupervisorsTimetable, hotelManagersTimetable, resourcesData, schoolTimetable } from './Data';
import Stack from '@mui/material/Stack';
import { set, values } from 'lodash';
import notify from 'devextreme/ui/notify';

const currentDate = new Date();

export default function SpareComponent2(props) {
  const [userID, setUserID] = useState(props.userID);
  const [userType, setUserType] = useState('');
  const schedulerRef = useRef(null);
  const [timetable, setTimetable] = useState(null);
  const [role1Button, setRole1Button] = useState(false);
  const [role2Button, setRole2Button] = useState(true);
  const [role3Button, setRole3Button] = useState(true);
  const [role4Button, setRole4Button] = useState(true);
  const [buttonClicked, setButtonClicked] = useState('');
  const [newEvent, setNewEvent] = useState({
    text: "",
    startDate: null,
    endDate: null
  });
  const [role1Timetable, setRole1Timetable] = useState(null);
  const [role2Timetable, setRole2Timetable] = useState(null);
  const [role3Timetable, setRole3Timetable] = useState(null);
  const [role4Timetable, setRole4Timetable] = useState(null);

  const showTimetable = (person) =>{

    setTimetable(person);
  }

  const updateTimetable = async() => {
    try {
      const response = await fetch('http://localhost:8081/api/timetables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: userID, domainName: props.domainSelected }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data.timetableData);

      const updatedTimetableSet = new Set();

for (const key in data.timetableData) {
  if (data.timetableData.hasOwnProperty(key)) {
    const value = data.timetableData[key];
    const dateObject = new Date(value.timestamp);
    const [datePart, timePart] = value.timestamp.split('T');
    const [hours, minutes, seconds] = timePart.split('.')[0].split(':');

    let currentStartDate = new Date(dateObject);
    currentStartDate.setDate(currentStartDate.getDate());

    let currentEventStartDate = new Date(currentStartDate);
    let currentEventEndDate = new Date(currentStartDate);

    currentEventStartDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    currentEventEndDate.setTime(currentEventStartDate.getTime() + 60 * 60 * 1000);

    const newEvent = {
      id: [4],
      text: value.timetabledEvent,
      startDate: currentEventStartDate,
      endDate: currentEventEndDate,
    };

    if (90000 < value.userid && value.userid < 95000) {
      if ([dateObject.getDay()].includes(dateObject.getDay())) {
        updatedTimetableSet.add(JSON.stringify(newEvent));
      }
    }

    if (95000 < value.userid && value.userid < 99999) {
      if ([dateObject.getDay()].includes(dateObject.getDay())) {
        updatedTimetableSet.add(JSON.stringify(newEvent));
      }
    }

    if (value.userid === 99999) {
      if ([dateObject.getDay()].includes(dateObject.getDay())) {
        updatedTimetableSet.add(JSON.stringify(newEvent));
      }
    }
  }
}

// Convert the Set back to an array
const updatedTimetable = Array.from(updatedTimetableSet).map((eventString) => JSON.parse(eventString));
        
        if (9000 < props.userID && props.userID < 95000) {
          setRole2Timetable((prev) => [...prev, ...updatedTimetable]);
        }
        if (95000 < props.userID && props.userID < 99999) {
          setRole3Timetable((prev) => [...prev, ...updatedTimetable]);
        }
        if (props.userID === 99999) {
          setRole4Timetable((prev) => [...prev, ...updatedTimetable]);
        }
    }

    catch(error) {
        console.error('Error fetching timetable data:', error);
    }
  }

  const renderDataCell = (data, index) => (
    <div style={{ width: '100%', height: 40, backgroundColor: 'rgba(208, 232, 247, 0.5)' }}></div>
  );

  const renderDateCell = (data, index) => (
    <b style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
      <p>{data.text}</p>
    </b>
  );

  const renderTimeCell = (data, index) => (
    <b style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
      <p>{data.text}</p>
    </b>
  );

  useEffect(() => {

    if(props.domainSelected == 'Hotel'){
      setRole1Timetable(hotelEventsTimetable);
      setRole2Timetable(staffsTimetable);
      setRole3Timetable(hotelSupervisorsTimetable);
      setRole4Timetable(hotelManagersTimetable);
    }

    if(props.domainSelected == 'Prison'){
      setRole1Timetable(prisonersTimetable);
      setRole2Timetable(guardsTimetable);
      setRole3Timetable(prisonSupervisorsTimetable);
      setRole4Timetable(prisonManagersTimetable);
    }

    if(props.domainSelected == 'School'){
      setRole1Timetable(schoolTimetable);
      setRole2Timetable(schoolTimetable);
      setRole3Timetable(schoolTimetable);
      setRole4Timetable(schoolTimetable);
    }

    if (schedulerRef.current) {
      schedulerRef.current.instance.scrollTo(currentDate); 
    }
    if(90000<userID && userID<95000){
      setRole1Button(false);
      setRole2Button(false);
      setUserType('Staff');
    }
    if(95000<userID && userID<99999){
      setRole1Button(false);
      setRole2Button(false);
      setRole3Button(false);
      setUserType('Supervisor');
    }
    if(userID==="99999"){
      setRole1Button(false);
      setRole2Button(false);
      setRole3Button(false);
      setRole4Button(false);
      setUserType('Manager');
    }

    
    if (role1Timetable !== null && timetable === null) {
      setTimetable(role1Timetable);
    }

    updateTimetable();
    console.log(props.domainSelected);
    console.log(newEvent);

  }, [userID, newEvent, timetable, role1Timetable]
  );

  const showToast = (event, value, type) => {
    notify(`${event} "${value}" task`, type, 800);
  };
  
  const showAddedToast = async(e) => {
      const newEventInfo = {
        text: e.appointmentData.text,
        startDate: e.appointmentData.startDate,
        endDate: e.appointmentData.endDate,
        userInput: userID,
      };
    
      setNewEvent(newEventInfo);
      showToast('Added', e.appointmentData.text, 'success');
      console.log(newEventInfo);
      try {
        const response = await fetch('http://localhost:8081/api/addTimetableEvent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newEventInfo: newEventInfo, domainName: props.domainSelected }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response received:', data.message);
      }
      catch(error) {
        console.error('Error sending timetable data:', error);
    }
      
  };

  const showDeletedToast = (e) =>{
    showToast('Deleted', e.appointmentData.text, 'warning');
  }

  return (
    <div style={{ position: 'relative' }}>
      <Stack spacing={25} direction="row">
      <Button
        color='success'
        disabled={role1Button}
        size='small'
        variant='contained'
        onClick={()=>{
          showTimetable(role1Timetable);
          setButtonClicked(()=>{
            if (props.domainSelected == "Hotel"){
              return 'Events Timetable'
            }
            if (props.domainSelected == "Prison"){
              return 'Prisoners Timetable'
            }
            if (props.domainSelected == "School"){
              return 'Students Timetable'
            }
          });
        }}
      >
        {props.domainSelected === 'Prison' ? 'Prisoners' : props.domainSelected === 'Hotel' ? 'Events' : props.domainSelected === 'School' ? 'Students' : 'Default Text'}
      </Button>
      <Button
        color='success'
        disabled={role2Button}
        size='small'
        variant='contained'
        onClick={()=>{
          showTimetable(role2Timetable);
          setButtonClicked(()=>{
            if (props.domainSelected == "Hotel"){
              return 'Hotel Staff Timetable'
            }
            if (props.domainSelected == "Prison"){
              return 'Guards Timetable'
            }
            if (props.domainSelected == "School"){
              return 'Cleaners Timetable'
            }
          });
        }}
      >
        {props.domainSelected === 'Prison' ? 'Guards' : props.domainSelected === 'Hotel' ? 'Staffs' : props.domainSelected === 'School' ? 'Cleaners' : 'Default Text'}
      </Button>
      <Button
        color='success'
        disabled={role3Button}
        size='small'
        variant='contained'
        onClick={()=>{
          showTimetable(role3Timetable);
          setButtonClicked(() =>{
            if (props.domainSelected == "Hotel"){
              return 'Hotel Supervisors Timetable'
            }
            if (props.domainSelected == "Prison"){
              return 'Prison Supervisors Timetable'
            }
            if (props.domainSelected == "School"){
              return 'Teachers Timetable'
            }
          });
        }}
      >
        {props.domainSelected === 'Prison' ? 'Supervisors' : props.domainSelected === 'Hotel' ? 'Supervisors' : props.domainSelected === 'School' ? 'Teachers' : 'Default Text'}
      </Button>
      <Button
        color='success'
        disabled={role4Button}
        size='small'
        variant='contained'
        onClick={()=>{
          setButtonClicked(() => {
            if (props.domainSelected == "Hotel"){
              return 'Hotel Managers Timetable'
            }
            if (props.domainSelected == "Prison"){
              return 'Prison Managers Timetable'
            }
            if (props.domainSelected == "School"){
              return 'Headmasters Timetable'
            }
          });
          showTimetable(role4Timetable);
        }}
      >
        {props.domainSelected === 'Prison' ? 'Managers' : props.domainSelected === 'Hotel' ? 'Managers' : props.domainSelected === 'School' ? 'Headmasters' : 'Default Text'}
      </Button>
      </Stack>
      <Stack spacing={75} direction='row'>
      <text>User: {userID} {userType}</text>
      <text>{buttonClicked}</text>
      </Stack>
      <Scheduler
        height={700}
        dataSource={timetable}
        defaultCurrentDate={currentDate}
        showAllDayPanel={false}
        dataCellRender={renderDataCell}
        dateCellRender={renderDateCell}
        timeCellRender={renderTimeCell}
        showCurrentTimeIndicator={true}
        shadeUntilCurrentTime={true}
        defaultCurrentView='week'
        ref={schedulerRef}
        visible={true}
        onAppointmentAdded={showAddedToast}
        onAppointmentDeleted={showDeletedToast}
      >
        <Editing
          allowAdding={true}
          allowDeleting={true}
        />
        <Resource
          dataSource={resourcesData}
          fieldExpr="id"
        />
      </Scheduler>
    </div>
  );
}



// import React, { useState, useEffect } from "react";

// export default function SpareComponent2() {


//   return (
//     <div style={{ position: "relative" }}>


  
//     </div>
//   );
// }
