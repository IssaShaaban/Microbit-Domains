package com.example.DeathRow;

/**
 * Defines the information of user access control history
 * @author Issa Shaaban
 */
public class AccessControl {
    
    private String domain; // Domain of the access control data
    private String sendData = "AccCon"; // Code for access control
    private int userID; // User ID of the user
    private int doorNo; // Number of the door accessed
    private String authorisation; // Authorisation
    private String timestamp; // Time of the user accessing the door

    public AccessControl(){}

    public String getDomain(){return domain;}
    public void setDomain(String domain){this.domain = domain;}

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public int getDoorNo() {
        return doorNo;
    }

    public String getData(){
        return sendData;
    }
    
    public void setDoorNo(int doorNo) {
        this.doorNo = doorNo;
    }

    public String getAuthorisation() {
        return authorisation;
    }

    public void setAuthorisation(String authorisation) {
        this.authorisation = authorisation;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

}
