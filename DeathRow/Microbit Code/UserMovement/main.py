from microbit import *
import radio
import music

""" Sends user movement and alerts to main base microbit"""

radio.on()
userMovement = {}
highestStr = -255
highestArea = 1 #Area with the strongest signal
currentUser = None # Current user linked to the microbit
currentHighest = None # Current area with the highest radio signal
emergency_sound = [
    'C5:1', 'D5:1', 'E5:1', 'F5:1', 'G5:1', 'A5:1', 'B5:1', 'C6:1',
    'C6:1', 'B5:1', 'A5:1', 'G5:1', 'F5:1', 'E5:1', 'D5:1', 'C5:1',
]
alert  = ['C5:2', 'E5:2', 'G5:2', 'C6:2', 'G5:2', 'E5:2', 'C5:2']
DOMAIN = "P1"

def radioSend(message):# sends a message over radio to base station
    radio.config(channel=70)
    radio.send(message+","+DOMAIN)
    radio.config(channel=71,power=7)

# Finds the area a user is in
def userMoving():
    radio.config(channel=71)
    global highestArea, highestStr, currentHighest, currentUser
    position = None

    """if currentUser >= 95000:
            display.show("S")
            position= "SPVR:"
    elif 90000 <= currentUser < 95000:
            display.show("G")
            position= "GURD:"
    elif currentUser < 10 :
        display.show(currentUser)
    else:
        display.scroll(currentUser)"""
        
    
    fullMsg = radio.receive_full()
    if fullMsg:
            msg, rssi, timestamp = fullMsg
            if "AREA" in msg.decode():
                userMovement.update({msg.decode()[8:]:rssi}) # Stores the users closest area

    for loc,strtgh in userMovement.items():
        #print(loc + str(strtgh))
        if strtgh > highestStr:
            highestStr = strtgh
            highestArea = loc
    
    # Sent to base station
    if currentHighest != highestArea:
        currentHighest = highestArea
        radioSend("STRG:" + str(highestArea) + "," + str(currentUser))

    if position != None:
        radio.send(position + str(currentUser))
    
    #radio.send("DSTT:" + str(currentUser))

def displayMessage(message):

    display.show(message[0])#alert type
    sleep(1000)
    display.scroll("IN")
    display.show("Z")
    sleep(1000)
    display.show(message[1])#area
    sleep(1000)
    display.clear()

def checkAlert():
    
    signalRecieved = radio.receive_full()# checks if any messages have been sent
       
    if signalRecieved != None :
        message, strength, timestamp = signalRecieved
        decoded_message = message.decode('utf-8')
        decoded_message = decoded_message[3:]
        print(decoded_message)
        if ('EMRG' in decoded_message):# checks if the message is an alert
            print(decoded_message)
            music.play(emergency_sound)
            messSplit = decoded_message.split(":")# splits message into 3 sections
            messSplit = messSplit[1].split(",")
            displayMessage(messSplit)


def sendGuadAlert():
    global currentUser
    if(button_b.is_pressed()):
        print("Sending")
        radioSend("EMRG:8,"+str(highestArea) + "," + str(currentUser))

def awaitUser():
    global currentUser
    global DOMAIN
    display.scroll(". . . ",wait=False,loop=True)
    radio.config(channel=72)
    while True:
        if(button_a.is_pressed()):
            if currentUser != None:
                display.scroll(currentUser,wait=False,loop=True)
            else:
                display.show(Image.NO)
            break
        radioSend("USER")
        radio.config(channel=72)
        signalRecieved = radio.receive_full()# checks if any messages have been sent
       
        if signalRecieved != None :
            message, strength, timestamp = signalRecieved
            decoded_message = message.decode('utf-8')
            decoded_message = decoded_message[3:]
            decoded_message = decoded_message.split("/")
            if(strength > -30):
                display.scroll(decoded_message[0])
                currentUser = int(decoded_message[0])
                DOMAIN = decoded_message[1]
                print(DOMAIN)
                break

        sleep(100)
     

def startConnect():
    global currentUser
    i = 6
    p = False
    while pin_logo.is_touched():
        p = True
        i = i -1
        display.show(i)
        if i == 0 :
             awaitUser()
        sleep(1000)
    if p == True and currentUser != None:
        display.scroll(currentUser,wait=False,loop=True)
        

def keyfob():
    global currentUser
    radio.config(channel=61,power=7)
    radio.send("unlock/"+ str(currentUser))
    radio.config(channel=71,power=7)
        

def main():
    radio.config(channel=71,power=7)
    while currentUser == None:
        startConnect()
        sleep(100)
    while True:
        if accelerometer.get_x() > 50 or accelerometer.get_x() < -50: # When the user starts moving, their location is tracked
            userMoving()
        
        msg = radio.receive()
        if msg:
            msg = msg.decode()
            if "EMCY" in msg:
                if DOMAIN in msg:
                    count = 0
                    while count < 3:
                        display.show(Image.DIAMOND)
                        music.play(emergency_sound)
                        count += 1
            
            if "CELL" in msg:
                music.play(alert)
                display.show(8)
                sleep(1000)
                display.clear()

        checkAlert()
        sendGuadAlert()
        startConnect()
        keyfob()
        sleep(1000)

main()