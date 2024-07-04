package com.example.DeathRow;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.apache.logging.log4j.LogManager;
import com.fazecast.jSerialComm.SerialPort;
import com.fazecast.jSerialComm.SerialPortEvent;
import com.fazecast.jSerialComm.SerialPortMessageListener;

/**
 * Reads data coming from the serial port and alerts coming from the frontend
 * @author Issa Shaaban
 */
@Component
public class SerialReader implements ApplicationRunner{
    
    private SerialPort microbit; // Get whatever is connected to the serial port
    private static final Logger logger = LogManager.getLogger(SerialReader.class); // Log messages from this class

    public SerialReader(){}

    /**
     * Set the microbit
     * @param microbit The microbit connected to the serial port
     */
    public void setMicrobit(SerialPort microbit) {
        this.microbit = microbit;
    }

    /**
     * Opens the serial port
     */
    public void initializeSerialPort() {
        logger.info("Initialising serial port...");
        
        // List all the ports available
        for (SerialPort s : SerialPort.getCommPorts()) {
            logger.debug("Serial Port: {}", s.getDescriptivePortName());
        }

        // Get the appropriate port and open
        microbit = SerialPort.getCommPort("COM4");
        microbit.openPort();

        // Set the baud rate
        if (microbit.isOpen()) {
            logger.info("Initializing...");
            microbit.setBaudRate(115200);
        } else {
            logger.error("Port not found");
            return;
        }

        // Add data listener to the SerialPort
        microbit.addDataListener(new SerialPortMessageListener() {
            @Override
            public int getListeningEvents() {
                return SerialPort.LISTENING_EVENT_DATA_RECEIVED;
            }

            @Override
            public byte[] getMessageDelimiter() {
                return new byte[]{System.getProperty("line.separator").getBytes()[0]};
            }

            @Override
            public boolean delimiterIndicatesEndOfMessage() {
                return true;
            }

            @Override
            public void serialEvent(SerialPortEvent event) {
                logger.debug("Received data on serial port: {}", new String(event.getReceivedData()));

                // Code goes here for what to do with the data!
                byte[] delimitedMessage = event.getReceivedData();
                String message = new String(delimitedMessage);

                String[] parts = message.split(":"); // Split by ':'
                logger.info(message);
                if (parts.length == 2) {
                    String reference = parts[0].trim();
                    String data = parts[1];

                    logger.debug("Received message: {}", message);
                    logger.info("Ref: {}", reference);
                    logger.info(data);
                    
                    // Processes the incoming message based on the type of message
                    switch (reference) {
                        case "STRG":
                            processUserMvmt(data);
                            break;
                        case "SPVR":
                            processAccessCon(data);
                            break;
                        case "GURD":
                            processAccessCon(data);
                            break;
                        case "SNSR":
                            processSensorData(data);
                            break;
                        case "ASNS":
                            sendSensorAlert(data);
                            break;
                        case "DSTT":
                            displayTimetable(data);
                            break;
                        case "EMRG":
                            sendAlert(data);
                            break;
                        default:
                            logger.warn("Reference not recognized: {}", reference);
                            break;
                    }
                }
            }
        });
        logger.info("Serial port initialised.");
    }

    /**
     * Formats the incoming domain to its required mapping
     * @param domain The code for the domain
     * @return The name of the domain
     */
    public String domain(String domain)
    {
        // Add any new domains
        switch (domain) {
            case "P1":
                return "prison";
            case "H1":
                return "hotel";
            case "S1":
                return "school";
            default:
                return "unknown";
        }
    }

    /**
     * Sends an alert to the frontend and database
     * @param data The information of the alert
     */
    public void sendAlert(String data)
    {
        logger.info("Alert received");
        Alert alert = new Alert();
        String[] values = data.split(",");
        String time = getTime();
        String domain = domain(values[3].trim());
        int type = Integer.parseInt(values[0].trim());
        int userID = Integer.parseInt(values[2].trim());
        int area = Integer.parseInt(values[1].trim());

        alert.setDomain(domain);
        alert.setArea(area);
        alert.setReading(userID);
        alert.setTimestamp(time);
        alert.setType(type);
        WebSocketEndpointInstance.getEndpoint().sendMessage(alert);
    }

    /**
     * Sends a sensor alert to the frontend and database
     * @param data The information of the sensor alert
     */
    public void sendSensorAlert(String data)
    {
        String[] values = data.split(",");
        String time = getTime();
        Alert newAlert = new Alert();
        String domain = domain(values[3].trim());
        newAlert.setDomain(domain);
        newAlert.setType(Integer.parseInt(values[0].trim()));
        newAlert.setArea(Integer.parseInt(values[1].trim()));
        newAlert.setReading(Integer.parseInt(values[2].trim()));
        newAlert.setTimestamp(time);
        WebSocketEndpointInstance.getEndpoint().sendMessage(newAlert);
    }

    /**
     * Sends timetable data to the frontend and database
     * @param data The timetable information to be displayed
     */
    public void displayTimetable(String data)
    {
        String time = getTime();
        int userID = Integer.parseInt(data.trim());
        DisplayTT displayTT = new DisplayTT();
        displayTT.setTimestamp(time);
        displayTT.setUserID(userID);
        WebSocketEndpointInstance.getEndpoint().sendMessage(displayTT);
    }

    /**
     * Sends the access control data to the frontend and database
     * @param data The information about the access control
     */
    public void processAccessCon(String data)
    {
        String[] values = data.split(",");
        String time = getTime();
        int userID = Integer.parseInt(values[0].trim());
        int doorNo = Integer.parseInt(values[1].trim());
        String authorisation = values[2].trim();
        AccessControl accessControl = new AccessControl();
        accessControl.setDomain("prison");
        accessControl.setUserID(userID);
        accessControl.setDoorNo(doorNo);
        accessControl.setAuthorisation(authorisation);
        accessControl.setTimestamp(time);
        WebSocketEndpointInstance.getEndpoint().sendMessage(accessControl);

        if (authorisation.equals("U"))
        {
            Alert alert = new Alert();
            alert.setDomain("prison");
            alert.setTimestamp(time);
            alert.setArea(doorNo);
            alert.setType(2);
            alert.setReading(-1);
            WebSocketEndpointInstance.getEndpoint().sendMessage(alert);
        }
    }

    /**
     * Sends the sensor data to the frontend & database
     * @param data The information about the sensor readings
     */
    public void processSensorData(String data)
    {
        String[] values = data.split(",");
        String time = getTime();
        int zoneNo = Integer.parseInt(values[0].trim());
        int temperature = Integer.parseInt(values[1].trim());
        int humidity = Integer.parseInt(values[2].trim());
        int pressure = Integer.parseInt(values[3].trim());
        int gas = Integer.parseInt(values[4].trim());
        String domain = domain(values[5].trim());
        SensorData sensorData = new SensorData();
        sensorData.setDomain(domain);
        sensorData.setTimestamp(time);
        sensorData.setZoneNo(zoneNo);
        sensorData.setTemperature(temperature);
        sensorData.setHumidity(humidity);
        sensorData.setPressure(pressure);
        sensorData.setGas(gas);
        WebSocketEndpointInstance.getEndpoint().sendMessage(sensorData);
    }

    /**
     * Sends the user movement data to the frontend and database
     * @param data The information about user movement
     */
    public void processUserMvmt(String data){
        
        String[] values = data.split(",");
        String time = getTime();
        String domain = domain(values[2].trim());
        int userID = Integer.parseInt(values[1].trim());
        int area = Integer.parseInt(values[0].trim());
        UserMvmt userMvmt = new UserMvmt();
        userMvmt.setDomain(domain);
        userMvmt.setArea(area);
        userMvmt.setTimestamp(time);
        userMvmt.setUserID(userID);
        WebSocketEndpointInstance.getEndpoint().sendMessage(userMvmt);
    }

    /**
     * Processes incoming messages to send to the serial port
     * @param message The message to be processed
     */
    public void processMessage(String message){
        
        if (microbit == null){
            initializeSerialPort();
        }

        if (microbit != null && microbit.isOpen()){


            String[] values = message.split(":");
            String data = values[1].trim();
            
            if (message.contains("Alarms")){
                
                switch (data){
                    case "Wake up":
                        sendMessage("WAKE");
                        break;
                    case "Lock up":
                        sendMessage("LOCK");
                        break;
                    default:
                        logger.info("Error with alarms: " + data);
                        break;
                }
            }

            if (message.contains("Emergency")){

                switch (data){
                    case "Hotel":
                        sendMessage("EMCYH1");
                        break;
                    case "School":
                        sendMessage("EMCYS1");
                        break;
                    case "Prison":
                        sendMessage("EMCYP1");
                    default:
                        logger.info("Error with alarms: " + data);
                        break;
                }
            }

            else if (message.contains("Alert")){

                message = "ALRT:" + data;
                sendMessage(message);
            }

            else if (message.contains("Start")){

                switch (data) {
                    case "Prison":
                        sendMessage("prison");
                        break;
                    case "Hotel":
                        sendMessage("hotel");
                    default:
                        logger.info("Error with: " + data);
                        break;
                }
            }

            else if (message.contains("User")){

                sendMessage("USER:"+data);
            }
        }

        else{
            logger.error("Port currently unavailable.");
        }
    }

    /**
     * Sends a message to the serial port
     * @param message The message to be sent to the serial reader
     */
    public void sendMessage(String message){

        message = message + message + message;
        microbit.writeBytes(message.getBytes(), message.length());
        logger.info("{} sent on serial port...", message);
    }

    /**
     * Used to get the current time
     */
    public String getTime() {
        Instant instantTimestamp = Instant.now();
        DateTimeFormatter timestampFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneId.of("Europe/London"));
        return timestampFormat.format(instantTimestamp);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {}
}
