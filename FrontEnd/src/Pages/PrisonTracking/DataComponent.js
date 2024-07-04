import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import Button from '@mui/material/Button';
import 'devextreme/dist/css/dx.dark.css';

function DataComponent({ data, setPrisonerID, domainSpecifics}) {

  const customizeUserId = (cellInfo) => {
    return cellInfo.value === 99999 ? domainSpecifics.role4 : cellInfo.value > 95000 ? domainSpecifics.role3 : cellInfo.value > 90000 ? domainSpecifics.role2 : domainSpecifics.role1;
  };
  const headerCellStyle = {
    fontWeight: 'bold', 
  };

  const handleButtonClick = (data) => {
    setPrisonerID(data.userid)
  };

  return (
    <DataGrid
    id="grid"
    dataSource={data}
    showBorders={true}
    showColumnLines={true}
    columnAutoWidth={true}
    wordWrapEnabled={true}
    showRowLines={true}
    columnHidingEnabled={true}
    columnResizingMode="widget"
    style={{ backgroundColor: 'darkgray' }}

  >
    <Column dataField="fname" caption="Forename" headerCellRender={() => <div style={headerCellStyle}>Name</div>} cellRender={({ data }) => (
      <div style={{ cursor: 'pointer', color: 'skyblue' }} onClick={() => handleButtonClick(data)}>
        {data.fname +" "+ data.sname}
      </div>
    )} />
    <Column dataField="extra_info" caption="Entry" headerCellRender={() => <div style={headerCellStyle}>Extra Info</div>} />

    <Column dataField="entryTime" caption="Entry" headerCellRender={() => <div style={headerCellStyle}>Entry</div>} />
    <Column dataField="exitTime" caption="Exit" headerCellRender={() => <div style={headerCellStyle}>Exit</div>} />
    <Column dataField="age" caption="Age" headerCellRender={() => <div style={headerCellStyle}>Age</div>} />
    <Column
      dataField="userid"
      caption="Role"
      customizeText={customizeUserId}
      headerCellRender={() => <div style={headerCellStyle}>Role</div>}
    />

  </DataGrid>
  );
}

export default DataComponent;
