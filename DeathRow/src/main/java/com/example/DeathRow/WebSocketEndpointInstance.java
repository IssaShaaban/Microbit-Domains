package com.example.DeathRow;

/**
 * Obtains a single instance of WebSocketEndpoint class
 * @author Issa Shaaban
 */
public class WebSocketEndpointInstance {
    
    private static WebSocketEndpoint instance;
    public static WebSocketEndpoint getEndpoint()
    {
        if (instance == null)
        {
            instance = new WebSocketEndpoint();
        }
        return instance;
    }
}
