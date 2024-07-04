import React, { useState, useEffect } from "react";

export default function PrisonerHistory(props) {

    const [history, setHistory] = useState(null);
    const [serverData, setServerData] = useState(null);
    const [userid, setUserID] = useState(props.userid);
    const [person, setPersonData] = useState(null);
    const [oldServerData, setOld] = useState(props.serverData);


    const [roomTags, setRoomTags] = useState();

    function setRooms()
    {
      const roomNames = oldServerData.areadata.map(item => item.area); // No need to add a space

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
      setOld(props.serverData)
    }, [props.serverData]);

    useEffect(() => {
      if (oldServerData !== null) {
        setRooms();
      }
    }, [oldServerData]);

    

    useEffect(() => {
      if (serverData !== null)
      {


      }
      
    }, [roomTags]);



      useEffect(() => {
        if (serverData !== null)
        {
          findPrisonerMovement();
        }

    }, [serverData]);

      useEffect(() => {
        setUserID(props.userid)
    }, [props.userid]);

    useEffect(() => {
      findPrisonerMovement()
    }, [userid]);


    useEffect(() => {
        setUserID(props.userid)
    }, [props.userid]);



      const fetchHistoryFromServer = async () => {


        try { 
          const response = await fetch('http://localhost:8081/api/mvmtHistory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "domainName": props.domainSpecifics.domainName }),
          });
      
          const data = await response.json();
          if (typeof data === 'object' && data !== null) {
            setServerData(data);
            
          } else {
            console.error('Invalid JSON data received from the server:', data);
          }
        } catch (error) {
          console.error('Error fetching data from server:', error.message);
        }
      }






      useEffect(() => {

        fetchHistoryFromServer();
    
    
        const intervalId = setInterval(async () => {
          try {
            await fetchHistoryFromServer();
          } catch (error) {
            console.error('Error fetching and updating data:', error.message);
          }
        }, 7000);
    
        return () => clearInterval(intervalId);
      }, []);

    function findPrisonerMovement() {

        try
        {
          if(props.domainSpecifics.trackingOn === "1")
          {

            let history = [];

            let userEntries = serverData.filter(entry => entry.userid === userid);
            
            let prisoner = serverData.find(entry => entry.userid === userid);
            
            let role = prisoner.userid > 90000 ? "guard" : "prisoner";

            
            setPersonData({
                imageUrl: prisoner.url,
                name: prisoner.fname + " " + prisoner.sname[0],
                role: role
            });
            
            let timestamps = []
            for (let i = 0; i < userEntries.length; i++) {

                history.push(userEntries[i].area);

                const time = new Date(userEntries[i].timestamp);
                const formattedTime = time.toLocaleTimeString('en-US', {hour12: false});

                timestamps.push(formattedTime.slice(0, -3))
            }

            let text= "";
            for(let i = 0; i < history.length; i++)
            {   
                text += roomTags[history[i]-1] + " ("+timestamps[i] + ")→ "

              }
            text = text.slice(0, -2);
            setHistory(text) ;               
          }
          else
          {
            let prisoner = oldServerData.mvmtdata.find(entry => entry.userid === userid);
            let role = prisoner.userid > 90000 ? "guard" : "prisoner";
            setPersonData({
              imageUrl:prisoner.url,
              name: prisoner.fname + " " + prisoner.sname[0],
              role: role
          });
            setHistory("Tracking Not Permitted")
          }
         
        }
        catch{
          let prisoner = oldServerData.mvmtdata.find(entry => entry.userid === userid);
          let role = prisoner.userid > 90000 ? "guard" : "prisoner";
          setPersonData({
            imageUrl:prisoner.url,
            name: prisoner.fname + " " + prisoner.sname[0],
            role: role
        });
          setHistory("Empty Data")
        }


    }



    return (
    <div style={{ display: "flex", alignItems: "center" }}>
        {person !== null && (
            <>
                <div style={{ marginRight: '20px' }}>
                    <img 
                    src={person.imageUrl} 
                    alt={person.name} 
                    height="100" 
                    width="100" 
                    style={{ 
                        border: `4px solid ${person.role === "guard" ? "DodgerBlue" : "orange"}`,
                        marginTop: '20px' 
                    }} 
                    />          
                    <p style={{ textAlign: 'center', marginTop: '5px', marginBottom: '0' }}>{person.name}</p>
                </div>
                <div style={{ fontSize: '1.2em' }}>
                    {history}
                </div>
            </> 
        )}
    </div>
    );
    }
