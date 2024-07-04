package com.example.DeathRow;

/**
 * Creates a single instance of Serial reader
 * @author Issa Shaaban
 */
public class SerialReaderInstance {
    
    private static SerialReader instance;
    public static SerialReader getInstance()
    {
        if (instance == null) {
            instance = new SerialReader();
        }
        return instance;
    }
}
