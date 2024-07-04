package com.example.DeathRow;

/**
 * Defines the information for the timetable
 * @author Issa Shaaban
 */
public class DisplayTT {
    
    private int userID; // UserID of the person viewing their timetable
    private String timestamp; // Time of the user viewing their timetable

    public DisplayTT(){}

    public int getUserID() {
        return userID;
    }
    public void setUserID(int userID) {
        this.userID = userID;
    }
    public String getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
