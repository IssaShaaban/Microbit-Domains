package com.example.DeathRow;

/**
 * Defines the information for user movement
 * @author Issa Shaaban
 */
public class UserMvmt {

    private String domain; // Domain of the user
    private String sendData = "Movements"; // Code for user movement
    private int userID; // UserId of the user
    private int area; // Area of the user
    private String timestamp; // Time of user moving

    public UserMvmt(){}

    public int getUser(){return userID;}
    public int getArea(){return area;}
    public String getTime(){return timestamp;}
    public String getData(){return sendData;}
    
    public String getDomain(){return domain;}
    public void setDomain(String domain){this.domain = domain;}
    
    public void setUserID(int userID) {
        this.userID = userID;
    }

    public void setArea(int area) {
        this.area = area;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

}
