import { useState, forwardRef, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { Button } from "@mui/base/Button";
import data from "./Data.js";
import Stack from "@mui/material/Stack";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { IconButton } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from '@mui/icons-material/Close';


export default function SpareComponent3(props) {
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [openChild, setOpenChild] = useState(false);
  const [chosenButton, setChosenButton] = useState(null);
  const [confirmAction, setConfirmAction] = useState("");
  const [chosenAction, setChosenAction] = useState("");
  const [open, setOpen] = useState(false);
  const [alarmTypeSaved, setSavedAlarm] = useState();

  const handleOpen = (buttonIndex) => {
    setChosenButton(buttonIndex);
    setSavedAlarm(buttonIndex+1);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    if (confirmAction !== ''){
    setIsSnackbarVisible(true);
    }
  };
  const closeSnackbar = (event, reason) =>{
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarVisible(false);
    setChosenButton(null);
    setConfirmAction('');
  };

  const snackbarMessage =
  confirmAction === "Call police"
    ? "Call 123456789"
    : confirmAction === "Call fire department"
    ? "Call 123467421"
    : confirmAction === "Call ambulance"
    ? "Call 987655431"
    : confirmAction !== ""
    ? `Alert: ${confirmAction}`
    : "Alert cancelled";

    const mySnackbar = () => (
      <Fragment>
        <IconButton size="small" aria-label="close" onClick={closeSnackbar}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Fragment>
    );

  const ChildModal = () => {
    const handleOpenChild = (action) => {
      setOpenChild(true);
      setChosenAction(action);
    };
    


    const [domainSpecifics, setDomainSpecifics] = useState([]);








    const  handleCloseChild = async (confirm) => {
      console.log(props.domainSpecifics.domainName)
      setOpenChild(false);
      if (confirm === "Yes") {
        setConfirmAction(chosenAction);
        setIsSnackbarVisible(true);
        const alertPayload = {
          alertType: chosenAction,
          alertName: alarmTypeSaved,
          domainName:props.domainSpecifics.domainName
        };
  
        // Send the JSON payload to the server
        try {
          const response = await sendAlertToServer(alertPayload);

        } catch (error) {
          console.error("Error sending alert to the server:", error);
        }
      } else {
        setChosenAction("");
        setIsSnackbarVisible(true);
      }
      setOpen(false);
    };

    const sendAlertToServer = async (alertPayload) => {
      try {
        console.log("Sending alert payload:", alertPayload);

        const response = await fetch('http://localhost:5057/api/alerts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(alertPayload),
        });
    
        if (!response.ok) {
          // Handle non-successful HTTP responses (e.g., 4xx or 5xx)
          const errorMessage = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorMessage}`);
        }
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error sending alert to the server:", error);
        throw new Error("Error sending alert to the server");
      }
    };
    

    const buttons = 
      chosenButton === 0
        ? ["Wake up", "Lock up"]
        : chosenButton === 1
        ? (JSON.parse(props.domainSpecifics.misc).roomNames)
        : data.emergency;

    return (
      <Fragment>
        {buttons.map((button, index) => (
          <ModalButton key={index} onClick={() => handleOpenChild(button)}>
            {button}
          </ModalButton>
        ))}

        <Modal
          open={openChild}
          onClose={handleCloseChild}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={[style, { width: "240px" }]}>
            <h2 id="child-modal-title" className="modal-title">
              Are you sure?
            </h2>
            <ModalButton onClick={() => handleCloseChild("Yes")}>Yes</ModalButton>
            <ModalButton onClick={() => handleCloseChild("No")}>No</ModalButton>
          </ModalContent>
        </Modal>
      </Fragment>
    );
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
      {props.domainSpecifics.alert1Name !== "" && (
        <CellButton
          sx={{ width: 150, height: 40 }}

          onClick={() => handleOpen(0)}
        >
          <AccessAlarmIcon fontSize="small" />
          {props.domainSpecifics.alert1Name}

        </CellButton>
      )}
      {props.domainSpecifics.alert2Name !== "" && (

        <GuardsButton
          sx={{ width: 150, height: 40 }}
          onClick={() => handleOpen(1)}
        >
          <ShieldIcon fontSize="small"/>
          {props.domainSpecifics.alert2Name}
        </GuardsButton>
      )}
      {props.domainSpecifics.alert3Name !== "" && (

        <EmergencyButton
          sx={{ width: 150, height: 40 }}

          onClick={() => handleOpen(2)}
        >
          <LocalHospitalIcon fontSize="small"/>
          {props.domainSpecifics.alert3Name}
        </EmergencyButton>
      )}
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={style}>
          <h2 id="parent-modal-title" className="modal-title">
            Choose Action
          </h2>
          <ChildModal />
        </ModalContent>
      </Modal>
      <Snackbar
        open={isSnackbarVisible}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message={snackbarMessage}
        action={mySnackbar}
      />
    </div>
  );
}



const Backdrop = forwardRef((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ "base-Backdrop-open": open }, className)}
      ref={ref}
      {...other}
    />
  );
});

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const blue = {
  200: "#5C7EA1",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const red = {
  200: "#945353",
  700: "#961818",
};

const orange = {
  200: "#C78C65",
  700: "#D9661A",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

const CellButton = styled(Button)(
  ({ theme }) => `
    
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    color: black;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? blue[600] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? blue[200] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px ${
        theme.palette.mode === "dark" ? blue[300] : blue[200]
      };
      outline: none;
    }
  `
);

const GuardsButton = styled(Button)(
  ({ theme }) => `
    
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    color: black;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? orange[700] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? orange[200] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px ${
        theme.palette.mode === "dark" ? blue[300] : blue[200]
      };
      outline: none;
    }
  `
);

const EmergencyButton = styled(Button)(
  ({ theme }) => `
    
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    color: black;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? red[700] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? red[200] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px ${
        theme.palette.mode === "dark" ? blue[300] : blue[200]
      };
      outline: none;
    }
  `
);

const ModalButton = styled(Button)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${blue[500]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${blue[500]};
  box-shadow: 0 2px 1px ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(45, 45, 60, 0.2)"
  }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};

  &:hover {
    background-color: ${blue[600]};
  }

  &:active {
    background-color: ${blue[700]};
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? blue[300] : blue[200]
    };
    outline: none;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    &:hover {
      background-color: ${blue[500]};
    }
  }
`
);


// import React, { useState, useEffect } from "react";

// export default function SpareComponent3() {


//   return (
//     <div style={{ position: "relative" }}>


  
//     </div>
//   );
// }
