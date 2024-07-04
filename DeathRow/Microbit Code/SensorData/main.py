from microbit import *
from bme680 import *
import radio
import time
import music

""" Sends sensor alert information and alerts to main base microbit"""

DOMAIN = "P1"
AREA = None
b = bme680()
emergency_sound = [
    'C5:1', 'D5:1', 'E5:1', 'F5:1', 'G5:1', 'A5:1', 'B5:1', 'C6:1',
    'C6:1', 'B5:1', 'A5:1', 'G5:1', 'F5:1', 'E5:1', 'D5:1', 'C5:1',
]
alarm = ["C4:4", "D4:4", "E4:4", "F4:4", "G4:4", "A4:4", "B4:4", "C5:4"]
lock = ["C4:2", "G4:2", "C5:2", "G4:2", "C5:2", "G4:2", "C5:2", "G4:2", "C5:2", "G4:2", "C5:2", "G4:2", "C5:2", "G4:2", "C5:2", "G4:2"]

# Checks to see if there is a change in environment and alerts the frontend if there is
def alertData():
    global b

    temp = int(round(b.temperature(), 1) * 10)
    hum = int(round(b.humidity(), 1) * 10)
    press = int(round(b.pressure(), 1) * 10)
    gas = int(round(b.gas()/1000, 1) * 10)

    if temp > 300 or temp < 150:
        radio.config(channel=70)
        sendString = "ASNS:4," + str(AREA) +","+ str(temp) +","+DOMAIN
        sleep(5000)
        radio.send(sendString)
    elif hum > 700 or hum < 350:
        radio.config(channel=70)
        sendString = "ASNS:5," + str(AREA) +","+ str(hum)+","+DOMAIN
        radio.send(sendString)
        sleep(5000)
    elif press > 14000 or press < 7000:
        radio.config(channel=70)
        sendString = "ASNS:6," + str(AREA) +","+ str(press)+","+DOMAIN
        radio.send(sendString)
        sleep(5000)
    elif gas > 1000 or gas < 40:
        radio.config(channel=70)
        sendString = "ASNS:7," + str(AREA) +","+ str(gas)+","+DOMAIN
        radio.send(sendString)
        sleep(5000)
    
    radio.config(channel=71,power=7)

# Sends sensor data to the database
def sendData():
        global b
        radio.config(channel=70)
        
        temp = int(round(b.temperature(), 1) * 10)
        hum = int(round(b.humidity(), 1) * 10)
        press = int(round(b.pressure(), 1) * 10)
        gas = int(round(b.gas()/1000, 1) * 10)

        sendString = "SNSR:" + str(AREA) +","+ str(temp) +","+ str(hum) +","+ str(press) +","+ str(gas)+","+DOMAIN

        radio.send(sendString)
        radio.config(channel=71,power=7)


def awaitUser():
    global AREA
    global DOMAIN
    display.scroll(". . . ",wait=False,loop=True)
       
    while True:
        if(button_a.is_pressed()):
            if AREA != None:
                display.scroll(AREA,wait=False,loop=True)
            else:
                display.show(Image.NO)
            break
        radio.config(channel=70)
        radio.send("AREA")
        radio.config(channel=73)
        signalRecieved = radio.receive_full()# checks if any messages have been sent
       
        if signalRecieved != None :
            message, strength, timestamp = signalRecieved
            decoded_message = message.decode('utf-8')
            decoded_message = decoded_message[3:]
            decoded_message = decoded_message.split("/")
            if(strength > -30):
                if(int(decoded_message[0]) <=46 and decoded_message[1] == "H1" or int(decoded_message[0]) <=8 and decoded_message[1] == "P1"):
                    display.scroll(decoded_message[0])
                    AREA = int(decoded_message[0])
                    DOMAIN = decoded_message[1]
                    radio.config(channel=71,power=7)
                    display.scroll(AREA,wait=False,loop=True)
                    break
                else:
                    display.scroll("A 2 H")
                    display.scroll(". . . ",wait=False,loop=True)

        sleep(1000)
     

def startConnect():
    global AREA
    i = 6
    p = False
    while pin_logo.is_touched():
        p = True
        i = i -1
        display.show(i)
        if i == 0 :
             awaitUser()
        sleep(1000)
    if p == True and AREA != None:
        display.scroll(AREA,wait=False,loop=True)


def main():
    global AREA
    global DOMAIN
    radio.on()
    
    while(AREA == None):
        startConnect()
        sleep(100)
   
    #timer duration in seconds
    timerDuration = 10

    # Get the current time in microseconds
    startTime = time.ticks_us()
    

    while True:
        #alertData()
        # Calculate the elapsed time in seconds
        elapsedTime = time.ticks_diff(utime.ticks_us(), startTime) / 1000000
    
        startConnect()
        # Check if the timer has reached the specified duration
        if elapsedTime >= timerDuration:
            sendData()
            startTime = time.ticks_us()

        msg = radio.receive()
        if msg:
            msg = msg.decode()
            if "USER" in msg:
                radio.send("AREA:" + str(AREA))
            if "EMCY" in msg:
                if DOMAIN in msg:
                    count = 0
                    while count < 3:
                        display.show(Image.DIAMOND)
                        music.play(emergency_sound)
                        count += 1
            
            if AREA == 8 and DOMAIN == "P1":
                if "WAKE" in msg:
                    count = 0
                    while count < 2:
                        music.play(alarm)
                        count+= 1
                
                if "LOCK" in msg:
                    count = 0
                    while count < 2:
                        music.play(lock)
                        count+= 1
                    
        
        sleep(100)
 
main()
