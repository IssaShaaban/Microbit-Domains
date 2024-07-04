const express= require('express');
const cors = require ('cors');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const path=require('path');
const reactApp = express();
const bcrypt = require("bcrypt");
const reactAppPort = process.env.PORT || 3001;

const app1port = 8081;
const app2port = 5056;

const app1 =express();
const app2 =express();
const alerts =express.Router(); 

app1.use(cors());
app2.use(cors());
app1.use(alerts);

app1.use(bodyParser.json());

const mysql = require ('mysql');
const { send } = require('process');
const { count } = require('console');

const connection  = mysql.createConnection({
    host: "smarttoolkit-db.chkqc68i2q1w.eu-west-2.rds.amazonaws.com",
    user: "admin",
    password: "SCC331DeathRow",
    database: "GenericSmartKit"
});

 

const sqlQuery = {
    columnNameQuery: function(tableName){
        let query = `
        SELECT COLUMN_NAME
        FROM information_schema.columns
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
    `;
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to database:', err);
                return;
            }
            console.log('Connected to the database');

            connection.query(query, [connection.config.database, tableName], (error, results) => {
                if (error) {
                    console.error('Error getting column names:', error);
                    return;
                }

                else if (results == "") {
                    console.error('No table named:', tableName);
                    return;
                }

                console.log(`Column Names for ${tableName}:`);
                results.forEach((row) => {
                    console.log(row.COLUMN_NAME);
                });
            });
        });

    },

    tableNamesQuery: function() {
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to database:', err);
                return;
            }
            console.log('Connected to the database');

            connection.query('SHOW TABLES', (error, results) => {
                if (error) {
                    console.error('Error getting table names:', error);
                    return;
            }
                
                console.log('Table Names:');
                results.forEach((row) => {
                console.log(row[`Tables_in_${connection.config.database}`]);
                });
            });
        });
    },

    SQLget: function(tableName, callback) {
        let query = `SELECT * FROM ${tableName}`;
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error selecting data from table:', error);
                callback(error, null);
                return;
            }
    
            const dataOut = results;
            callback(null, dataOut);
        });
    },

    SQLinsert: function (tableName, multipleData) {
        // Check if there is data to insert
        if (!multipleData || multipleData.length === 0) {
            console.log('No data to insert.');
            return;
        }
    
        // Check if all objects have the same structure
        const columns = Object.keys(multipleData[0]);
    
        if (columns.length === 0) {
            console.error('Objects in multipleData do not have a consistent structure.');
            return;
        }
    
        let query;
        let values;
    
        if (multipleData.length === 1) {
            // Single-row insert
            values = `(${columns.map(col => mysql.escape(multipleData[0][col])).join(', ')})`;
        } else {
            // Multiple-row insert
            values = multipleData.map(data => `(${columns.map(col => mysql.escape(data[col])).join(', ')})`).join(', ');
        }
    
        // Construct the full query
        query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values}`;
    
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
            } else {
                console.log('Data inserted successfully:', results);
            }
        });
    },

    SQLgetmvmt: function(environment, callback){
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }
        let query = `SELECT u.fname, u.sname, u.age, u.gender, u.entryTime, u.exitTime, s1.area, s1.userid, id.url, u.extra_info
        FROM ${placeholder}user_movement s1
        INNER JOIN ${placeholder}Users u ON s1.userid = u.userid
        INNER JOIN ${placeholder}idPhotos id on s1.userid = id.userid
        AND s1.timestamp = (
            SELECT MAX(s2.timestamp)
            FROM ${placeholder}user_movement s2
            WHERE s1.userid = s2.userid)
        ORDER BY u.userid, s1.timestamp;`;
            connection.query(query, (error, results) => {
                if (error) {
                    console.error('Error selecting data from table:', error);
                    callback(error,null);
                    return;
                }

                else if (results == "") {
                    console.error('No values found');
                    callback(error,[]);
                    return;
                }

        const dataOut = results;
        callback(null,dataOut);
            });
    },

    SQLgetsensorData: function(environment, callback){
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }
        let query = `SELECT zone_no,gas,humidity,pressure,temperature
        FROM ${placeholder}sensor_data s1
        WHERE timestamp = (SELECT MAX(timestamp) FROM ${placeholder}sensor_data s2 WHERE s1.zone_no = s2.zone_no)
        ORDER BY zone_no, timestamp;`;
            connection.query(query, (error, results) => {
                if (error) {
                    console.error('Error selecting data from table:', error);
                    callback(error,null);
                    return;
                }

                else if (results == "") {
                    console.error('No values found');
                    callback(error,[]);
                    return;
                }

        const dataOut = results;
        callback(null,dataOut);
            });
    },

    SQLgetaccessData: function(environment, callback){
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }
        let query = `SELECT userid, authorisation, door_no FROM ${placeholder}access_control
        ORDER BY timestamp DESC
        LIMIT 1;`;
            connection.query(query, (error, results) => {
                if (error) {
                    console.error('Error selecting data from table:', error);
                    callback(error,null);
                    return;
                }

                else if (results == "") {
                    console.error('No values found');
                    callback(error,[]);
                    return;
                }

        const dataOut = results;
        callback(null,dataOut);
            });
    },

    SQLget_mvmt_history: function(environment, callback){
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }
        let query = `SELECT u.fname, u.sname, u.age, u.gender, u.entryTime, u.exitTime, s1.area, s1.userid, s1.timestamp, id.url
        FROM ${placeholder}user_movement s1
        INNER JOIN ${placeholder}Users u ON s1.userid = u.userid
        INNER JOIN ${placeholder}idPhotos id ON u.userid = id.userid
        WHERE   s1.timestamp >= NOW() - INTERVAL 1 DAY;`;
            connection.query(query, (error, results) => {
                if (error) {
                    console.error('Error selecting data from table:', error);
                    callback(error,null);
                    return;
                }

                else if (results == "") {
                    console.error('No values found');
                    callback(error,[]);
                    return;
                }

        const dataOut = results;
        callback(null,dataOut);
            });
    },

    SQLgetsensorHistory: function(environment, callback){
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }
        let query = `SELECT zone_no,gas,humidity,pressure,temperature, timestamp
        FROM ${placeholder}sensor_data s1
        WHERE   s1.timestamp >= NOW() - INTERVAL 1 DAY
        ORDER BY zone_no, timestamp;`;
            connection.query(query, (error, results) => {
                if (error) {
                    console.error('Error selecting data from table:', error);
                    callback(error,null);
                    return;
                }

                else if (results == "") {
                    console.error('No values found');
                    callback(error,[]);
                    return;
                }

        const dataOut = results;
        callback(null,dataOut);
            });
    },

    SQLgetTimetabling: function(userid, environment, callback) {
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }

        let query = `SELECT * FROM ${placeholder}timetable WHERE userid = ${userid}`;
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error selecting data from table:', error);
                callback(error, null);
                return;
            }
    
            const dataOut = results;
            callback(null, dataOut);
        });
    },

    SQLgetAlerts: function(environment, callback) {
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }
        
        let query = `SELECT alertType, active, timeOccured, extraInfo 
        FROM ${placeholder}alerts WHERE active = "True" ORDER BY timeOccured DESC`;
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error selecting data from table:', error);
                callback(error, null);
                return;
            }
    
            const dataOut = results;
            callback(null, dataOut);
        });
    },

    SQLgetMap: function(domainName, callback) {
        let query = `SELECT * FROM domainMap WHERE domainName = "${domainName}"`;
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error selecting data from table:', error);
                callback(error, null);
                return;
            }
    
            const dataOut = results;
            callback(null, dataOut);
        });
    },
    
    SQLupdateAlerts: function(environment, callback) {
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }

        let query = `UPDATE ${placeholder}alerts
        SET active = 'False',
            timeResolved = '${new Date().toISOString().replace(/T/, ' ').split('.')[0]}'
        WHERE active = 'True'
        ORDER BY timeOccured DESC
        LIMIT 1;`;
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
            } else {
                console.log('Data updated successfully:', results);
            }
        });
    },

    SQLgetIncidentReport: function(environment ,callback) {
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }

        const query1 = `
            SELECT * FROM ${placeholder}alerts
            WHERE active = "False" AND timeOccured >= NOW() - INTERVAL 1 DAY
            ORDER BY timeOccured ASC;
        `;
    
        const query2 = `
            SELECT * FROM ${placeholder}Users
            WHERE entryTime >= NOW();
        `;
    
        const query3 = `
            SELECT ROUND(AVG(gas), 1) as avg_gas,
                   ROUND(AVG(humidity), 1) as avg_humidity,
                   ROUND(AVG(temperature), 1) as avg_temperature,
                   ROUND(AVG(pressure), 1) as avg_pressure,
                   zone_no
            FROM ${placeholder}sensor_data
            WHERE zone_no != 0
            GROUP BY zone_no
            ORDER BY zone_no ASC;
        `;

        const query4 = `
        SELECT
            alertType,
            COUNT(*) AS alertCount
        FROM
            ${placeholder}alerts
        WHERE
            DATE(timeOccured) = CURDATE()
        GROUP BY
            alertType;
        `;
    
        connection.query(query1, (error1, results1) => {
            if (error1) {
                console.error('Error retrieving alerts data:', error1);
                return callback(error1);
            }
    
            connection.query(query2, (error2, results2) => {
                if (error2) {
                    console.error('Error retrieving users data:', error2);
                    return callback(error2);
                }
    
                connection.query(query3, (error3, results3) => {
                    if (error3) {
                        console.error('Error retrieving sensor data:', error3);
                        return callback(error3);
                    }
                    connection.query(query4, (error4, results4) => {
                        if (error4) {
                            console.error('Error retrieving count data:', error4);
                            return callback(error4);
                        }
    
                            const allResults = [results1, results2, results3, results4];
                            console.log('Data retrieved successfully:', allResults);
            
                            // Process the results as needed
                            callback(null, allResults);
                    });
                });
            });
        });
    },

    SQLgetDomains: function(callback) {        
        let query = `SELECT domainName
        FROM domainMap`;
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error selecting data from table:', error);
                callback(error, null);
                return;
            }
    
            const dataOut = results;
            callback(null, dataOut);
        });
    },

    SQLdeleteEnvironment: function(environment, callback) {
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder = environment.toLowerCase()+"_";
        }        
        let queries = [`DROP TABLE IF EXISTS 
		${placeholder}user_movement,
        ${placeholder}timetable,
        ${placeholder}idPhotos,
        ${placeholder}sensor_data,
        ${placeholder}access_control,
        ${placeholder}alerts,
        ${placeholder}loginDetails,
        ${placeholder}area,
        ${placeholder}Users
        ;
         `
        ,
         `DELETE FROM domainMap WHERE domainName = "${environment}";
          `];
         let queryCount = 0;
    
         // Execute each query sequentially
         function executeNextQuery() {
             if (queryCount < queries.length) {
                 connection.query(queries[queryCount], (error, results) => {
                     if (error) {
                         console.error('Error executing query:', error);
                         callback(error, null);
                         return;
                     }
     
                     queryCount++;
                     executeNextQuery();
                 });
             } else {
                 callback(null, "All tables deleted successfully");
             }
         }
     
         // Start executing queries
         executeNextQuery();
    },


    SQLNewCreateTable: function(environment, callback) {
        var placeholder = "";
        if (environment !== "Prison"){
            var placeholder = environment.toLowerCase()+"_";
        }
        let queries = [
            `CREATE TABLE IF NOT EXISTS ${placeholder}Users(
                userid INT PRIMARY KEY,
                fname TEXT NOT NULL,
                sname TEXT NOT NULL,
                age INT NOT NULL,
                gender TEXT,
                entryTime DATE NOT NULL,
                exitTime DATE,
                extra_info TEXT
            );`,
            `CREATE TABLE IF NOT EXISTS ${placeholder}sensor_data(
                timestamp TIMESTAMP,
                gas INT,
                humidity INT,
                pressure INT,
                temperature INT,
                zone_no INT
            );`,
            `CREATE TABLE IF NOT EXISTS ${placeholder}access_control(
                authorisation TEXT,
                door_no INT,
                timestamp TIMESTAMP,
                userid INT,
                FOREIGN KEY (userid) REFERENCES ${placeholder}Users(userid)
            );`,
            `CREATE TABLE IF NOT EXISTS ${placeholder}alerts(
                alertType INT NOT NULL,
                active ENUM ("True", "False") NOT NULL,
                timeOccured TIMESTAMP NOT NULL,
                timeResolved TIMESTAMP,
                extraInfo TEXT
            );`,
            `CREATE TABLE IF NOT EXISTS ${placeholder}loginDetails(
                userid INT,
                passkey TEXT,
                FOREIGN KEY (userid) REFERENCES ${placeholder}Users(userid)
            );`,
            `CREATE TABLE IF NOT EXISTS ${placeholder}area(
                areaid INT PRIMARY KEY AUTO_INCREMENT,
                area TEXT NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS ${placeholder}user_movement(
                area INT,
                timestamp DATETIME NOT NULL,
                userid INT,
                FOREIGN KEY (userid) REFERENCES ${placeholder}Users(userid),
                FOREIGN KEY (area) REFERENCES ${placeholder}area(areaid)
            );`,
            `CREATE TABLE IF NOT EXISTS ${placeholder}timetable(
                userid INT,
                timetabledEvent TEXT,
                timestamp TIMESTAMP,
                FOREIGN KEY (userid) REFERENCES ${placeholder}Users(userid)
            );`,
            `CREATE TABLE IF NOT EXISTS ${placeholder}idPhotos(
                userid INT,
                url TEXT,
                FOREIGN KEY (userid) REFERENCES ${placeholder}Users(userid)
            );`,
            `INSERT INTO ${placeholder}Users 
            VALUES(100000,"Super User","Chan",20,"Both Genders","2024-03-01","3000-01-10","The developers only"
            );`
        ];
    
        let queryCount = 0;
    
        // Execute each query sequentially
        function executeNextQuery() {
            if (queryCount < queries.length) {
                connection.query(queries[queryCount], (error, results) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        callback(error, null);
                        return;
                    }
    
                    queryCount++;
                    executeNextQuery();
                });
            } else {
                // All queries executed successfully
                addNewUser(100000, "infolab", environment)
                callback(null, "All tables created successfully");
            }
        }
    
        // Start executing queries
        executeNextQuery();
    },

    

    close: function(){
        connection.end((err) => {
            if (err) {
                console.error('Error closing database connection:', err);
            } else {
                console.log('Connection closed');
            }
        });
    }
}

async function addNewUser(newid,plaintextPassword, environment) {
    var placeholder = "";
        if (environment !== "Prison"){
            var placeholder = environment.toLowerCase()+"_";
        }
    const hash = await bcrypt.hash(plaintextPassword, 10);
    sqlQuery.SQLinsert(`${placeholder}loginDetails`, [{userid: newid, passkey: hash}]);
}

async function comparePassword(incomingID, plaintextPassword, environment) {
    var placeholder = "";
        if (environment !== "Prison"){
            var placeholder= environment.toLowerCase()+"_";
        }
    try {
        const user = await new Promise((resolve, reject) => {
            sqlQuery.SQLget(`${placeholder}loginDetails`, (error, userdata) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!userdata || !Array.isArray(userdata)) {
                    console.log('No user data found.');
                    resolve(null);
                    return;
                }

                const foundUser = userdata.find(item => item.userid === parseInt(incomingID,10));
                resolve(foundUser);
            });
        });

        if (!user) {
            console.log('User not found.');
            return false;
        }

        const passCompare = user.passkey;

        if (!passCompare) {
            console.log('No passkey found for the user.');
            return false;
        }

        const result = await bcrypt.compare(plaintextPassword, passCompare);

        console.log('Password Match:', result);
        return result;
    } catch (error) {
        console.error('Error retrieving or comparing login data:', error);
        // Handle the error appropriately, for example, send an error response
        throw error; // Re-throw the error to propagate it
    }
}

function generateIncidentReport(alertsData, usersData, sensorDataByZone, alertCountData) {
    function formatUserTimestamp(timestamp) {
        const timestampDate = new Date(timestamp);
        return timestampDate.toLocaleString('en-US', { timeZone: 'GMT' });
    }

    const uniqueAlertTypes = alertCountData.map(entry => entry.alertType);
    const alertTypeCounts = alertCountData.map(entry => entry.alertCount);

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Incident Report</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 20px;
                }

                h1 {
                    color: #333;
                    text-align: center;
                }

                h2, h3 {
                    color: #666;
                    margin-top: 20px;
                    font-size: 18px;
                }

                table {
                    width: 100%;
                    max-width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    font-size: 14px;
                    page-break-inside: auto;
                }

                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }

                th {
                    background-color: #f2f2f2;
                }

                canvas {
                    margin-top: 20px;
                }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
            <h1>Incident Report</h1>
            
            <h2>Alerts Data</h2>
            ${alertsData.length > 0 ? `
                <table>
                    <tr>
                        <th>Alert Type</th>
                        <th>Time Occurred</th>
                        <th>Time Resolved</th>
                        <th>Extra Info</th>
                    </tr>
                    ${alertsData.map(alert => `
                        <tr>
                            <td>${alert.alertType}</td>
                            <td>${new Date(alert.timeOccured).toLocaleString()}</td>
                            <td>${alert.timeResolved ? new Date(alert.timeResolved).toLocaleString() : '-'}</td>
                            <td>${alert.extraInfo || '-'}</td>
                        </tr>
                    `).join('')}
                </table>
            ` : '<p>No new alerts</p>'}

            <!-- Pie Chart Section -->
        <h2>Alert Types Distribution</h2>
        <canvas id="alertTypesChart" width="350" height="350"></canvas>

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>

        <script>
            const uniqueAlertTypes = ${JSON.stringify(uniqueAlertTypes)};
            const alertTypeCounts = ${JSON.stringify(alertTypeCounts)};

            // Define 8 different colors
            const colors = [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(0, 128, 0, 0.8)', 
                'rgba(255, 0, 0, 0.8)',
            ];

            // Chart.js code to create a pie chart with numbers
            const ctx = document.getElementById('alertTypesChart').getContext('2d');
            const alertTypesChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: uniqueAlertTypes,
                    datasets: [{
                        data: alertTypeCounts,
                        backgroundColor: colors,
                    }],
                },
                options: {
                    responsive: false, // Disable chart responsiveness
                    maintainAspectRatio: false, // Disable maintaining aspect ratio
                    plugins: {
                        datalabels: {
                            color: '#fff',
                            anchor: 'end',
                            align: 'start',
                            offset: 5,
                            font: {
                                weight: 'bold',
                                size: 12,
                            },
                            formatter: (value) => value || '', // Display the value only if it's not zero
                        },
                    },
                },
            });
        </script>

            <h2>Users Data</h2>
            ${usersData.length > 0 ? `
                <table>
                    <tr>
                        <th>User ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Entry Time</th>
                    </tr>
                    ${usersData.map(user => `
                        <tr>
                            <td>${user.userid}</td>
                            <td>${user.fname}</td>
                            <td>${user.sname || '-'}</td>
                            <td>${formatUserTimestamp(user.entryTime)}</td>
                        </tr>
                    `).join('')}
                </table>
            ` : '<p>No new users</p>'}

            <h2>Sensor Data by Zone</h2>
            ${Object.entries(sensorDataByZone).map(([zone, zoneData]) => `
                <h3>ZONE ${zone} Sensor Data</h3>
                <table>
                    <tr>
                        <th>Measurement</th>
                        <th>Average Value</th>
                    </tr>
                    <tr>
                        <td>Average Gas</td>
                        <td>${(zoneData.avgGas)/10}hPa</td>
                    </tr>
                    <tr>
                        <td>Average Humidity</td>
                        <td>${(zoneData.avgHumidity)/10}%</td>
                    </tr>
                    <tr>
                        <td>Average Temperature</td>
                        <td>${(zoneData.avgTemperature)/10}°C</td>
                    </tr>
                    <tr>
                        <td>Average Pressure</td>
                        <td>${(zoneData.avgPressure)/10}Ω</td>
                    </tr>
                </table>
            `).join('')}

        </body>
        </html>
    `;

    return htmlContent;
}






app1.post('/api/login', async (req, res) => {
    var {loginID, passkey, domainName} = req.body;
    try {
        if (loginID > 89999) {
            const passwordMatch = await comparePassword(loginID, passkey, domainName);

            if (passwordMatch) {
                if (loginID<95000) (
                    res.json({ success: true, accessTier: 1 })
                )

                else if (loginID>95000 && loginID!= 99999) (
                    res.json({ success: true, accessTier: 2 })
                    )
                    
                else if (loginID=="99999") (
                    res.json({ success: true, accessTier: 3 })
                )
            } 
            else {
                res.json({ success: false, message: 'Incorrect Username or Password Provided' });
            }
        } 
        else {
            res.json({ success: false, message: 'SECURITY ID INCORRECT' });
        }
    } catch (error) {
        console.error('Error comparing passwords:', error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});

app1.post('/api/incidentReport', (req, res) =>{
    var {domainName} = req.body
    sqlQuery.SQLgetIncidentReport(domainName, (error, incidentData) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const [alerts, users, sensorData, alertCount] = incidentData;
        const alertsData = alerts.map(alert => ({ id: alert.id, alertType: alert.alertType, timeOccured: alert.timeOccured, timeResolved: alert.timeResolved, extraInfo: alert.extraInfo}));
        const usersData = users.map(user => ({ userid: user.userid, fname: user.fname, sname: user.sname, entryTime: user.entryTime }));
        const sensorDataByZone = sensorData.reduce((acc, sensor) => {
            const { avg_gas, avg_humidity, avg_temperature, avg_pressure, zone_no } = sensor;
            if (!acc[zone_no]) {
                acc[zone_no] = { avgGas: avg_gas, avgHumidity: avg_humidity, avgTemperature: avg_temperature, avgPressure: avg_pressure, zoneNo: zone_no };
            }
            return acc;
        }, {});
        const alertCountData = alertCount.map(alertCount => ({ alertType : alertCount.alertType, alertCount: alertCount.alertCount }));

        // Generate HTML content
        let htmlContent = generateIncidentReport(alertsData, usersData, sensorDataByZone, alertCountData);

        // Send the HTML response
        res.send(htmlContent);
    });
});


app1.post('/api/mvmtHistory', (req, res) =>{
    var {domainName} = req.body;
    sqlQuery.SQLget_mvmt_history(domainName, (error, mvmtHistorydata) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(mvmtHistorydata);
    });
})

app1.post('/api/timetables', (req, res) => {
    var {userInput, domainName} = req.body;
    sqlQuery.SQLgetTimetabling(userInput, domainName,(error, timetableData) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log(JSON.stringify(timetableData));
        res.json({
            timetableData: timetableData,
        });

    });
});

app1.post('/api/addTimetableEvent', (req, res) => {    
    var {newEventInfo, domainName} = req.body;
    let record = [{userid: newEventInfo.userInput, 
                timetabledEvent: newEventInfo.text,
                timestamp: newEventInfo.startDate
            }]
    var placeholder = "";
        if (domainName !== "Prison"){
            var placeholder= domainName.toLowerCase()+"_";
        }
    sqlQuery.SQLinsert(`${placeholder}timetable`, (record));
    res.json({success: true, message: "Added timetabled event."})
});


function getNewUserid(min, max, callback) {
    sqlQuery.SQLget("Users", (userError, userdata) => {
        if (userError) {
            console.error('Error retrieving user data:', userError);
            return callback({ error: 'Internal Server Error' });
        } else {
            min = Math.ceil(min);
            max = Math.floor(max);
            let generateID;

            do {
                generateID = Math.floor(Math.random() * (max - min + 1)) + min;
            } while (userdata.some(user => user.userid === generateID));

            return callback(null, generateID);
        }
    });
}
 
app1.post('/api/form',(req,res)=>{
    var {age, entryTime, exitTime, extra_info, fname, gender, sname, password, url, inputtype, domainName} = req.body;
    
    if (!age || !entryTime || !exitTime || !extra_info || !fname || !gender || !sname || (!password && inputtype!==1) || !url || !inputtype)
    {
        res.json({success: false, message: "1 or more input fields are missing."})
    }
    else
    {
        var placeholder = "";
        if (domainName !== "Prison"){
            var placeholder= domainName.toLowerCase()+"_";
        }
        if (inputtype==3){
            getNewUserid(95000, 99998, async (error, newUserID) => {
                if (error) {
                    res.status(500).json(error);
                } 
                else {
                    const today = new Date();
                    const formattedDateTime = today.toISOString().replace(/T/, ' ').split('.')[0];
                    console.log('Generated User ID:', newUserID);
                    records = [{userid: newUserID, age: req.body.age, entryTime: req.body.entryTime,
                        exitTime: req.body.exitTime,extra_info: req.body.extra_info,
                        fname: req.body.fname, gender: req.body.gender, 
                        sname: req.body.sname}];
                    sqlQuery.SQLinsert(`${placeholder}Users`, (records));
                    sqlQuery.SQLinsert(`${placeholder}idPhotos`, ([{userid: newUserID, url: url}]));
                    sqlQuery.SQLinsert(`${placeholder}user_movement`, ([{ area: 3, userid: newUserID, timestamp: formattedDateTime}]));
                    await addNewUser(newUserID, password, domainName);
                    res.json({ success: true, message: `Data received and inputted successfully with id: ${newUserID}` });                    
                }        
            });
        }
        if (inputtype==1){
            getNewUserid(1, 90000, (error, newUserID) => {
                if (error) {
                    res.status(500).json(error);
                } 
                else {
                    const today = new Date();
                    const formattedDateTime = today.toISOString().replace(/T/, ' ').split('.')[0];
                    console.log('Generated User ID:', newUserID);
                    records = [{userid: newUserID, age: req.body.age, entryTime: req.body.entryTime,
                        exitTime: req.body.exitTime,extra_info: req.body.extra_info,
                        fname: req.body.fname, gender: req.body.gender, 
                        sname: req.body.sname}];
                    sqlQuery.SQLinsert(`${placeholder}Users`, (records));
                    sqlQuery.SQLinsert(`${placeholder}idPhotos`, ([{userid: newUserID, url: url}]));
                    sqlQuery.SQLinsert(`${placeholder}user_movement`, ([{ area: 6, userid: newUserID, timestamp: formattedDateTime}]));
                    res.json({ success: true, message: `Data received and inputted successfully with id: ${newUserID}` });                    
                }        
            });
        }
        if (inputtype==2){
            getNewUserid(90001, 94999, async (error, newUserID) => {
                if (error) {
                    res.status(500).json(error);
                } 
                else {
                    const today = new Date();
                    const formattedDateTime = today.toISOString().replace(/T/, ' ').split('.')[0];
                    console.log('Generated User ID:', newUserID);
                    records = [{userid: newUserID, age: req.body.age, entryTime: req.body.entryTime,
                        exitTime: req.body.exitTime,extra_info: req.body.extra_info,
                        fname: req.body.fname, gender: req.body.gender, 
                        sname: req.body.sname}];
                    sqlQuery.SQLinsert(`${placeholder}Users`, (records));
                    sqlQuery.SQLinsert(`${placeholder}idPhotos`, ([{userid: newUserID, url: url}]));
                    sqlQuery.SQLinsert(`${placeholder}user_movement`, ([{ area: 3, userid: newUserID, timestamp: formattedDateTime}]));
                    await addNewUser(newUserID, password, domainName);
                    res.json({ success: true, message: `Data received and inputted successfully with id: ${newUserID}` });                    
                }        
            });
        }
    }
})

app1.post('/api/data', (req, res) => {
    var {domainName} = req.body;
    var placeholder = "";
    if (domainName !== "Prison"){
        var placeholder= domainName.toLowerCase()+"_";
    }
    sqlQuery.SQLgetmvmt(domainName, (error, mvmtdata) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Log SQLdata
        //console.log('SQL Data:', mvmtdata);

        // Call the next SQL query
        sqlQuery.SQLget(`${placeholder}Users`, (userError, userdata) => {
            if (userError) {
                console.error('Error retrieving user data:', userError);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            // Log userdata
            //console.log('User Data:', userdata);

            sqlQuery.SQLget(`${placeholder}area`,(error, areadata) => {
                if (error) {
                    console.error('Error retrieving data:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
        
                // Log SQLdata
                //console.log('SQL Data:', areadata);

                sqlQuery.SQLgetsensorData(domainName, (error, sensordata) => {
                    if (error) {
                        console.error('Error retrieving data:', error);
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }
            
                    // Log SQLdata
                    //console.log('SQL Data:', sensordata);

                    sqlQuery.SQLgetaccessData(domainName, (error, accessdata) => {
                        if (error) {
                            console.error('Error retrieving data:', error);
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                        }
                        
                        sqlQuery.SQLgetsensorHistory(domainName, (error, sensorHistory) => {
                            if (error) {
                                console.error('Error retrieving data:', error);
                                res.status(500).json({ error: 'Internal Server Error' });
                                return;
                            }
                            sqlQuery.SQLget_mvmt_history(domainName, (error, mvmtHistory) => {
                                if (error) {
                                    console.error('Error retrieving data:', error);
                                    res.status(500).json({ error: 'Internal Server Error' });
                                    return;
                                }
                                sqlQuery.SQLgetAlerts(domainName, (error, alertData) => {
                                    if (error) {
                                        console.error('Error retrieving data:', error);
                                        res.status(500).json({ error: 'Internal Server Error' });
                                        return;
                                    }
                                    const combinedData = {
                                        mvmtdata: mvmtdata,
                                        userdata: userdata,
                                        sensordata: sensordata,
                                        areadata: areadata,
                                        accessdata: accessdata,
                                        historySensor: sensorHistory,
                                        mvmtHistory: mvmtHistory,
                                        alertdata: alertData 
                                            };
                                    res.json(combinedData);
                                    return;
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

app1.listen(app1port, ()=>{
    console.log(`Port ${app1port}`)
    console.log(`server is running on ${app1port}`)
})


app1.listen(5057, ()=>{
    console.log(`Port 5057`)
    console.log(`Alerts server is running on 5057`)
})

app1.post('/api/cancelAlerts', (req, res) =>{
    var {domainName}= req.body;
    sqlQuery.SQLupdateAlerts(domainName, (error, alertUpdate) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ success: true, message: 'Current alert cancelled' });
    });
})

app1.post('/api/mapPull', (req, res) =>{
    var {domainName}= req.body;
    console.log(domainName);
    sqlQuery.SQLgetMap(domainName, (error, mapData) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(mapData);

    });
})

app1.post('/api/deleteEnvironment', (req, res) =>{
    var {domainName}= req.body;
    sqlQuery.SQLdeleteEnvironment(domainName, (error, domainData) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({success: true, message: `Deleted environment ${domainName}`});

    });
})

app1.get('/api/selectEnvironment', (req, res) =>{
    sqlQuery.SQLgetDomains((error, domainData) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(domainData);

    });
})

app1.post('/startUp/domainMap', (req, res) => {
    var { trackingOn, domainName, alert1Name, alert2Name, alert3Name, role1, role2, role3,
        role4, jsonFile} = req.body;

    if (!domainName || !role1 || !role2 || !role3 || !role4 || !jsonFile) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return; // Exit the function after sending the error response
    }

    // Use SQLget to check if domainName already exists
    sqlQuery.SQLget("domainMap", (error, data) => {
        if (error) {
            console.error('Error checking if domainName exists:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
            return;
        }

        const domainExists = data.some(item => item.domainName === domainName);

        if (domainExists) {
            res.json({ success: false, message: `Domain Name '${domainName}' already exists.` });
            return; // Exit the function after sending the response
        } else {
            try {
                var { misc, countPerRoom, parameter, floorplan, roomsdata } = JSON.parse(req.body.jsonFile);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                res.status(400).json({ success: false, message: 'Invalid JSON format' });
                return;
            }

            sqlQuery.SQLNewCreateTable(domainName, (error, result) => {
                if (error) {
                    console.error('Error creating tables:', error);
                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                    return;
                } else {
                    console.log('Tables created successfully:', result);
                    res.json({ success: true, message: 'Tables for new environment created.' });
                    
                    if (domainName !== "Prison") {
                        misc.roomNames.forEach(roomName => {
                            sqlQuery.SQLinsert(`${domainName.toLowerCase()}_area`, ([{
                                area: JSON.stringify(roomName)
                            }]), (insertError, insertResult) => {
                                if (insertError) {
                                    console.error('Error inserting data into table:', insertError);
                                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                                    return;
                                }
                            });
                        });
                    }

                    console.log(`Data inserted successfully for domainName '${domainName}'`);
                }
            });

            // Insert data into domainMap table
            sqlQuery.SQLinsert("domainMap", ([{
                domainName: domainName,
                trackingOn: trackingOn,
                alert1Name: alert1Name,
                alert2Name: alert2Name,
                alert3Name: alert3Name,
                role1: role1,
                role2: role2,
                role3: role3,
                role4: role4,
                countPerRoom: JSON.stringify(countPerRoom),
                parameter: JSON.stringify(parameter),
                floorplan: JSON.stringify(floorplan),
                roomsdata: JSON.stringify(roomsdata),
                misc: JSON.stringify(misc)
            }]), (insertError, insertResult) => {
                if (insertError) {
                    console.error('Error inserting data into table:', insertError);
                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                    return;
                }
                
                // Send success response if no errors occurred
                res.json({ success: true, message: 'Received Map and stored' });
            });
        }
    });
});


app1.post('/api/alerts', async (req, res) => {
    try {
      var { alertType, alertName, domainName} = req.body;
      var placeholder = "";
        if (domainName !== "Prison"){
            var placeholder= domainName.toLowerCase()+"_";
        }
      if (alertName==1){
        sendAlert("Alarms:"+ alertType, domainName);
        const today = new Date();
        const formattedDateTime = today.toISOString().replace(/T/, ' ').split('.')[0];
        sqlQuery.SQLinsert(`${placeholder}alerts`,([{alertType: alertName, active: "True", timeOccured: formattedDateTime, extraInfo: alertType}]));
      }
      else if (alertName==2){
        sendAlert("Alert:"+ alertType, domainName);
        const today = new Date();
        const formattedDateTime = today.toISOString().replace(/T/, ' ').split('.')[0];
        console.log(formattedDateTime);
        sqlQuery.SQLinsert(`${placeholder}alerts`,([{alertType: alertName, active: "True", timeOccured: formattedDateTime, extraInfo: alertType}]));
      }
      else if (alertName==3){
        sendAlert(alertType, domainName);
        const today = new Date();
        const formattedDateTime = today.toISOString().replace(/T/, ' ').split('.')[0];
        sqlQuery.SQLinsert(`${placeholder}alerts`,([{alertType: alertName, active: "True", timeOccured: formattedDateTime, extraInfo: alertType}]));
      }         
      res.json({ success: true, message: 'Alert Recieved' });
    } catch (error) {
      console.error("Error handling alert:", error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });  

reactApp.get('/start', (req, res) => {
    // Specify the directory where you want to run npm start
    const directoryPath = path.join(__dirname, '../../FrontEnd');
    
    const npmPath = path.join(__dirname, '../../nodejs', 'npm.cmd');
    // Spawn a new process to run npm start
    const npmProcess = spawn(npmPath, ['start'], { cwd: directoryPath });

    // Forward the output of the npm start process to the response
    npmProcess.stdout.pipe(res);
    npmProcess.stderr.pipe(res);

    console.log("React app now avaiable")
  
    // Handle process exit event
    npmProcess.on('exit', (code) => {
      res.end(`npm start process exited with code ${code}`);
    });
  });

reactApp.listen(reactAppPort, () => {
    console.log(`React App is running on port ${reactAppPort}`)
})

const backendConnector = app2.listen(app2port, ()=>{
    console.log(`server is running on ${app2port}`)
})

const webSocketServer = new WebSocket.Server({server: backendConnector});
webSocketServer.on('connection', handleWebSocketConnection);
const webSocketClient = new WebSocket('ws://localhost:5056/websocket-endpoint');

// Handle connection opened
webSocketClient.on('open', () => {
    console.log("WebSocket connection opened!");
});

// Handle received messages
webSocketClient.on('message', (message) => {
    console.log("Received message from WebSocket server:", message);

    // You can handle the received message as needed
});

// Handle WebSocket connection closed
webSocketClient.on('close', () => {
    console.log("WebSocket connection closed");
});

// Handle WebSocket errors
webSocketClient.on('error', (error) => {
    console.error("WebSocket error:", error);
});

// Updated sendAlert function
function sendAlert(type, environment) {
    // Simulate receiving an alert
    console.log("Received an alert!");
    
    // Check if the WebSocket connection is open
    var message = `${type}: ${environment}`;
    webSocketServer.clients.forEach (client => {
        if (client.readyState == WebSocket.OPEN){
            client.send(message);
        }
        else {
            // Reinitialize the WebSocket connection if it's not open
            initializeWebSocket();
        }
    });
}

// Function to handle WebSocket connections
function handleWebSocketConnection(webSocket) {
    console.log("WebSocket connection opened!");

    // Handle incoming messages from the client (Spring Boot server)
    webSocket.on('message', (message) => {
        // Parse the received JSON message
        try {
            const receivedJson = JSON.parse(message);
            console.log("Parsed JSON from Spring Boot server:", JSON.stringify(receivedJson));            
            if (webSocket !== webSocketClient) {
                // Send a response back to the Spring Boot server (optional)
                webSocket.send("Received your message!");
                console.log(JSON.stringify(receivedJson));
                // Process the received message as needed
                if(receivedJson.domain === "prison"){
                    if(receivedJson.sendData === "Alerts"){
                        sqlQuery.SQLinsert("alerts",([{alertType: receivedJson.type, active: "True", timeOccured: receivedJson.timestamp, extraInfo: receivedJson.reading}]));
                    }
                    else if(receivedJson.sendData === "Sensor"){
                        sqlQuery.SQLinsert("sensor_data",([{timestamp: receivedJson.timestamp, zone_no: receivedJson.zoneNo, temperature: receivedJson.temperature, humidity: receivedJson.humidity, pressure: receivedJson.pressure, gas: receivedJson.gas}]));
                    }
                    else if (receivedJson.sendData === "Movements"){
                        sqlQuery.SQLinsert("user_movement",([{timestamp: receivedJson.timestamp, area: receivedJson.area, userid: receivedJson.userID}]));
                    }
                    else if (receivedJson.sendData === "AccCon"){
                        sqlQuery.SQLinsert("access_control",([{timestamp: receivedJson.timestamp, area: receivedJson.area, userid: receivedJson.userID}]));
                    }
                }
                else{
                    if(receivedJson.sendData === "Alerts"){
                        sqlQuery.SQLinsert(`${receivedJson.domain}_alerts`,([{alertType: receivedJson.type, active: "True", timeOccured: receivedJson.timestamp, extraInfo: receivedJson.reading}]));
                    }
                    else if(receivedJson.sendData === "Sensor"){
                        sqlQuery.SQLinsert(`${receivedJson.domain}_sensor_data`,([{timestamp: receivedJson.timestamp, zone_no: receivedJson.zoneNo, temperature: receivedJson.temperature, humidity: receivedJson.humidity, pressure: receivedJson.pressure, gas: receivedJson.gas}]));
                    }
                    else if (receivedJson.sendData === "Movements"){
                        sqlQuery.SQLinsert(`${receivedJson.domain}_user_movement`,([{timestamp: receivedJson.timestamp, area: receivedJson.area, userid: receivedJson.userID}]));
                    }
                    else if (receivedJson.sendData === "AccCon"){
                        sqlQuery.SQLinsert(`${receivedJson.domain}_access_control`,([{timestamp: receivedJson.timestamp, area: receivedJson.area, userid: receivedJson.userID}]));
                    }
                }
            }
        } catch (error) {
            console.error("Error parsing JSON from Spring Boot server:", error);
        }
    });

    // Handle WebSocket connection closed
    webSocket.on('close', () => {
        console.log("WebSocket connection closed");
    });

    // Handle WebSocket errors
    webSocket.on('error', (error) => {
        console.error("WebSocket error:", error);
    });
}
