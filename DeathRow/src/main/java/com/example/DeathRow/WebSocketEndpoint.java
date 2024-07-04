package com.example.DeathRow;
import com.google.gson.Gson;
import java.net.URI;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import jakarta.websocket.ClientEndpoint;
import jakarta.websocket.CloseReason;
import jakarta.websocket.ContainerProvider;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;

/**
 * Connects the spring boot server to the frontend express server
 * @author Issa Shaaban
 */
@Component
@ClientEndpoint
public class WebSocketEndpoint {

    private Session session; // Used to consume and produce messages
    private static final Logger logger = LogManager.getLogger(WebSocketEndpoint.class);

    /**
     * Ensures a connection is made with the correct URI
     */
    @PostConstruct
    public void connect() {
        try {
            URI uri = new URI("ws://localhost:5056/websocket-endpoint"); // Connection using the express server's URI
            ContainerProvider.getWebSocketContainer().connectToServer(this, uri);
            logger.info("Connected to WebSocket server");
        } catch (Exception e) {
            logger.error("Error connecting to WebSocket server: " + e.getMessage());
        }
    }

    /**
     * Looks for an open connection and stores the session when connected
     * @param session The current connection channel to send send and receive messages
     */
    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        logger.info("WebSocket connection opened");
        //sendMessage("Testing");
    }

    /**
     * Looks for incoming messages and forwards them to the serial reader
     * @param message The message received from the frontend
     */
    @OnMessage
    public void onMessage(String message) {
        
        // Ensures the message is within the correct format
        logger.info("Received message: " + message);
        String[] values = message.split(":");
        if (values.length >= 2) {
            SerialReaderInstance.getInstance().processMessage(message);
        } else {
            logger.error("Invalid message format: " + message);
        }
    }

    /**
     * Logs the reasons for any closures of a session
     * @param session The current connection channel
     * @param closeReason The reason for closing the connection
     */
    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        logger.info("WebSocket connection closed: " + closeReason);
    }

    /**
     * Logs any errors found with the socket connection
     * @param session The current connection channel
     * @param throwable The cause of the error
     */
    @OnError
    public void onError(Session session, Throwable throwable) {
        logger.info("WebSocket error: " + throwable.getMessage());
    }

    /**
     * Sends a specified message to the frontend server
     * @param object The object to be sent to the frontend
     */
    public void sendMessage(Object object) {
        if (session != null && session.isOpen()) {
            try {
                Gson gson = new Gson();
                String sendObject = gson.toJson(object);
                session.getBasicRemote().sendText(sendObject);
                logger.info("Message Sent!");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        else if (session == null) { connect(); logger.info("Null session");}
        else { logger.info("Session is not open"); }
    }
}