from microbit import *
import radio
import music

emergency_sound = [
    'C5:1', 'D5:1', 'E5:1', 'F5:1', 'G5:1', 'A5:1', 'B5:1', 'C6:1',
    'C6:1', 'B5:1', 'A5:1', 'G5:1', 'F5:1', 'E5:1', 'D5:1', 'C5:1',
]
DOMAIN ="P1"
doorno =0
def radioSend(message):# sends a message over radio to base station 
    radio.config(channel= 70,queue=1)
    print(message)
    radio.send(message)
    radio.config(channel=61, queue=1, power=7)

def OpenDoor(): # displays tick on display and play high pitch beep
    display.show(Image.YES)
    music.pitch(500,50)
    sleep(5000)
def LockDoor():# displays cross on microbit and play low pitch beep 
    display.show(Image.NO)
    music.pitch(200,50)
    sleep(5000)

def awaitUser():
    global doorno
    global DOMAIN
    display.scroll(". . . ",wait=False,loop=True)
    
    while True:
        if(button_a.is_pressed()):
            display.scroll(doorno,wait=False,loop=True)   
            break
        radio.config(channel=70)
        radio.send("KEY")
        radio.config(channel=74)
        signalRecieved = radio.receive_full()# checks if any messages have been sent
       
        if signalRecieved != None :
            message, strength, timestamp = signalRecieved
            decoded_message = message.decode('utf-8')
            decoded_message = decoded_message[3:]
            if(strength > -30):
                display.scroll(decoded_message)
                DOMAIN = decoded_message
                print(DOMAIN)
                doorno = 0
                display.scroll(doorno,wait=False,loop=True)   
                radio.config(channel=61, queue=1, power=7)
                break

        sleep(100)
     

def startConnect():
    i = 6
    p = False
    while pin_logo.is_touched():
        p = True
        i = i -1
        display.show(i)
        if i == 0 :
             awaitUser()
        sleep(1000)
    if p == True:
        display.scroll(doorno,wait=False,loop=True)


def main():

    global doorno 
    signalRecieved = None
    radio.on()
    # note: different channel used to not interfere
    radio.config(channel=61, queue=1, power=7)
    #prisoners and guards door access, A for Authroised, U for unauthroised 



    while (True):
        if DOMAIN == "P1":
            doors = 8
        elif DOMAIN == "H1":
            doors = 46
        elif DOMAIN == "S1":
            doors = 12
        startConnect()

        #lets you set the door number 
        if(button_a.get_presses() and doorno >0):
            doorno = doorno -1
            display.scroll(doorno,wait=False,loop=True)   
        if(button_b.get_presses() and doorno < doors):
            doorno = doorno +1 
            display.scroll(doorno,wait=False,loop=True)   
        
        
        # recieve messages and ping the senders
        signalRecieved = radio.receive_full()
        # if message recieved, append to list
        if (signalRecieved != None):
            message, strength, timestamp = signalRecieved
            decoded_message = message.decode('utf-8')
            print(decoded_message)
            print("strength = " +str(strength))
            mesSplit = decoded_message.split("/")
          
            # checks if the signal is coming from fob and if it is in range 
            if ("unlock" in decoded_message and strength > -30):
                # sends message to base station microbit 
                radioSend("unlockDoor"+str(doorno))
                #checks if fobs door is the door that is being scanned  
                if(mesSplit[1] == str(doorno)):
                    OpenDoor()
                else:
                    LockDoor()
            if "EMCY" in decoded_message:
                while True:
                    display.show(Image.DIAMOND)
                    music.play(emergency_sound)
                
                



        sleep(100)
        


main()