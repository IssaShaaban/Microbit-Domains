import React, { useState, useEffect } from "react";

export default function AlertComponent(props) {
    const [serverData, setServerData] = useState(props.serverData);

    useEffect(() => {
        setServerData(props.serverData)
      }, [props.serverData]);

    return (
    <div>ACACAC</div>
    );
}

