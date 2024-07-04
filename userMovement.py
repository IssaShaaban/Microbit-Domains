from microbit import *
import radio

radio.on()
radio.config(channel=70,power=7)
userMovement = {}
highestStr = -255
highestArea = None
currentUser = "Issa"
currentHighest = None

def userMoving():
    global highestArea, highestStr, currentHighest
    radio.send("USER:"+ currentUser)
    fullMsg = radio.receive_full()
    if fullMsg:
            msg, rssi, timestamp = fullMsg
            if "AREA" in msg.decode():
                userMovement.update({msg.decode()[8:]:rssi})

    for loc,strtgh in userMovement.items():
        #print(loc + str(strtgh))
        if strtgh > highestStr:
            highestStr = strtgh
            highestArea = loc
    
    if currentHighest == None:
        currentHighest = highestArea
        radio.send("STRG:" + str(highestArea) + " USER:" + currentUser)
        print("Here")
    
    elif currentHighest != highestArea:
        currentHighest = highestArea
        radio.send("STRG:" + str(highestArea) + " USER:" + currentUser)
        print("Change")
    
def main():
    while True:
        if accelerometer.get_x() > 50 or accelerometer.get_x() < -50:
            userMoving()
        sleep(100)

main()