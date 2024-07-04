package com.example.DeathRow;

/**
 * Defines the information for an alert
 * @author Issa Shaaban
 */
public class Alert {
    
    private String domain; // Domain the alert is in
    private String sendData = "Alerts";
    private String timestamp; // Time of alert
    private int type; // Alert type eg "T" for temperature
    private int area; // Area of alert
    private int reading; // The number value of the data

    public Alert(){}

    public String getDomain(){return domain;}
    public void setDomain(String domain){this.domain = domain;}

    public int getType() {
        return type;
    }
    public void setType(int type) {
        this.type = type;
    }
    public int getArea() {
        return area;
    }
    public void setArea(int area) {
        this.area = area;
    }
    public int getReading() {
        return reading;
    }

    public String getData(){
        return sendData;
    }
    
    public void setReading(int reading) {
        this.reading = reading;
    }
    public String getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
