package com.example.DeathRow;

/**
 * Defines the information for a sensor data readings
 * @author Issa Shaaban
 */
public class SensorData {
    
    private String domain; // Domain the data is from
    private String sendData = "Sensor"; // Code for sensor data
    private String timestamp; // Time sensor readings were sent
    private int zoneNo; // Zone of the sensor data
    private int temperature; // Temperature reading of the zone
    private int humidity; // Humidity reading of the zone
    private int pressure; // Pressure reading of the zone
    private int gas; // Gas reading of the zone

    public SensorData(){}

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public int getZoneNo() {
        return zoneNo;
    }

    public void setZoneNo(int zoneNo) {
        this.zoneNo = zoneNo;
    }

    public int getTemperature() {
        return temperature;
    }

    public void setTemperature(int temperature) {
        this.temperature = temperature;
    }

    public int getHumidity() {
        return humidity;
    }

    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }

    public int getPressure() {
        return pressure;
    }

    public String getData(){
        return sendData;
    }

    public void setPressure(int pressure) {
        this.pressure = pressure;
    }

    public int getGas() {
        return gas;
    }

    public void setGas(int gas) {
        this.gas = gas;
    }

    public String getDomain(){return domain;}
    public void setDomain(String domain){this.domain = domain;}
}
