from microbit import *
import radio
import music

emergency_sound = [
    'C5:1', 'D5:1', 'E5:1', 'F5:1', 'G5:1', 'A5:1', 'B5:1', 'C6:1',
    'C6:1', 'B5:1', 'A5:1', 'G5:1', 'F5:1', 'E5:1', 'D5:1', 'C5:1',
]

def radioSend(message):# sends a message over radio to base station
    radio.config(channel= 70,queue=1)
    print(message)
    radio.send(message)
    radio.config(channel=71, queue=1, power=7)

def OpenDoor(): # displays tick on display and play high pitch beep
    display.show(Image.YES)
    music.pitch(500,50)
    sleep(5000)
def LockDoor():# displays cross on microbit and play low pitch beep
    display.show(Image.NO)
    music.pitch(200,50)
    sleep(5000)

def main():
    doorno = 0
    signalRecieved = None
    radio.on()
    # note: different channel used to not interfere
    radio.config(channel=71, queue=1, power=7)
    #prisoners and guards door access, A for Authroised, U for unauthroised
    supervisorAccess = ['A','A','A','A','A','A','A','A']
    guardAccess = ['A','A','U','U','A','A','A','A']

    while (True):

        #lets you set the door number
        if(button_a.get_presses() and doorno >0):
            doorno = doorno -1
        if(button_b.get_presses() and doorno < 7):
            doorno = doorno +1
        display.show(doorno)
        # recieve messages and ping the senders
        signalRecieved = radio.receive_full()
        # if message recieved, append to list
        if signalRecieved != None:
            message, strength, timestamp = signalRecieved
            decoded_message = message.decode('utf-8')
            print(decoded_message)
            print("strength = " +str(strength))
          
            # checks if the signal is coming from a guard and if it is in range
            if ("GURD:" in decoded_message and strength > -30):
                # sends message to base station microbit
                radioSend(decoded_message + "," + str(doorno)+","+ guardAccess[doorno+1])
                #checks if guards have access to this door
                if(guardAccess[doorno] == "A"):
                    OpenDoor()
                else:
                    LockDoor()
                      
            #checks if the signal is coming from a supervisor and if it is in range
            if ("SPVR:" in decoded_message and strength > -30):
                #sends message to base station microbit
                radioSend(decoded_message + "," + str(doorno)+","+supervisorAccess[doorno+1])
                #checks if prisoners have access to this door
                if(supervisorAccess[doorno] == "A"):
                    OpenDoor()
                else:
                    LockDoor()
            
            if "EMCY" in message:
                while True:
                    display.show(Image.DIAMOND)
                    music.play(emergency_sound)
        sleep(100)
        
main()