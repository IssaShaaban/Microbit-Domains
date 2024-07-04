import React, {useEffect, useState} from "react";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import { Button } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Face5Icon from "@mui/icons-material/Face5";
import { areaData, sensorUnit } from "./Data.js";
import hazardmp3 from "./hazard.mp3";

export default function AlertBanners() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [area, setArea] = useState(null);
  const [reading, setReading] = useState(null);

  const hazardAudio = new Audio(hazardmp3);

  const fetchAlertsData = async () => {
    // to be determined from backend
    // setType(character);
    // setArea(number);
    // setReading(number);
  }

  // useEffect(() => {
  //   fetchAlertsData();
  // }, []);

  const handleClose = () => {
    setOpen(false);
    setArea(null);
    setType('');
    setReading(null);
  };

  const handleOpen = () => {
    if (type !== '') {
      setOpen(true);
    }
  };

  useEffect(() => {
    const playAudio = () => {
      hazardAudio.loop = true;
      hazardAudio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
  };

    const stopAudio = () => {
      hazardAudio.loop = false;
    };

    if (open && type !== null) {
      playAudio();
    } else {
      stopAudio();
    }

    return () => {
      hazardAudio.pause();
    };
  }, [open, type]);

  const getSensorError = (type) => {
    const sensorData = sensorUnit.find(unit => unit.type === type);
  
    if (sensorData) {
      return `${sensorData.sensor} error `;
    } else {
      return 'Unknown error';
    }
  };

  const getArea = (id) => {
    const myArea = areaData.find(item => item.id === id);
  
    return myArea ? `at ${myArea.area}` : 'Unknown error';
  };

  const roomAlert = () => {
    if(type !== '' && area !== null && reading !== null){
      const message = `${getSensorError(type)} ${getArea(area)} with reading ${reading}`;
      return (
        <div>
          <Alert icon={<LocalFireDepartmentIcon/>} severity='error'>
            {message}
          </Alert>
        </div>
      );
    }

    if(type === '0' && area !== null && reading === null){
      const message = `Guards emergency ${getArea(area)}`;
      return (
        <div>
          <Alert icon={<Face5Icon/>} severity='error'>
            {message}
          </Alert>
        </div>
      );
    }
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        {type !== null && roomAlert()}
      </Backdrop>
    </div>
  );
}
