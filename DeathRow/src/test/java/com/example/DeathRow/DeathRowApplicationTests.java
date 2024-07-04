package com.example.DeathRow;
import java.io.IOException;
import java.net.URI;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import com.fazecast.jSerialComm.SerialPort;
import jakarta.websocket.ContainerProvider;
import jakarta.websocket.Session;
import jakarta.websocket.WebSocketContainer;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest // Lets the application know this is a SpringBootTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase
@ExtendWith(MockitoExtension.class) // Load the Mock Extension kit
class DeathRowApplicationTests {

    @Autowired
    private SerialReader serialReader;
    @Mock
    private SerialPort serialPort; // Create a mock of the serial port
    private Session mockSession;
    private WebSocketEndpoint webSocketEndpoint;

    @Test
    // Ensuring the serial port is initialised
    public void initializePort()
    {
        SerialReader serialReader = new SerialReader();
        serialReader.setMicrobit(serialPort);
        serialReader.initializeSerialPort();
    }

    @Test
    public void sendDomainMessage() // Check different domain messages are reaching frontend
    {
        this.initializePort();
        WebSocketEndpointInstance.getEndpoint().sendMessage("H1:1,4");
    }

    @Test
    // Test to see data is being sent to microbits
    public void messageSent()
    {
        serialReader.setMicrobit(serialPort);
        String message = "Send This!";
        serialReader.sendMessage(message);
        verify(serialPort).writeBytes(message.getBytes(), message.length());
    }

    @Test
    // Test to ensure connection with web socket is working
    public void testConnect_Success() throws Exception
    {
        // Creates a container mock object, and then configures the behavious of the container
        WebSocketContainer container = mock(WebSocketContainer.class);
        try (MockedStatic<ContainerProvider> mockedProvider = Mockito.mockStatic(ContainerProvider.class)) {
            mockedProvider.when(ContainerProvider::getWebSocketContainer).thenReturn(container);
            WebSocketEndpoint webSocketEndpoint = new WebSocketEndpoint();
            webSocketEndpoint.connect();
            verify(container).connectToServer(webSocketEndpoint, new URI("ws://localhost:5056/websocket-endpoint")); // Uses the required websocket
        }
    }

    @Test
    // Test for ensuring messages are received from the frontend
    public void messageReceived() throws IOException
    {
        MockitoAnnotations.openMocks(this);
        webSocketEndpoint = new WebSocketEndpoint();
        webSocketEndpoint.onOpen(mockSession);

        String testMessage = "Alarms:Wake up"; // If the message is alert, do something (in this case ring the alarm on the microbits)
        webSocketEndpoint.onMessage(testMessage);

        verify(mockSession).getBasicRemote().sendText(any(String.class));
    }
}
