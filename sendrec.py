from microbit import *
from bme680 import *
from opt3001 import *
import radio

#Use this to send data
#Sends data
#Comment this out when your receiving data
def sendMsg():
    b = bme680()
    o = opt3001()
    room = "1,"
    temp = b.temperature()
    light = o.read_lux_float()
    sound = microbit.microphone.sound_level()
    varStr = room + str("{:.1f}".format(temp)) + "," + str("{:.1f}".format(light)) + "," + str("{:.1f}".format(sound))
    microbit.display.scroll("S")
    radio.send(varStr)

def main():
    radio.on()
    radio.config(channel=70)
    while True:
        sendMsg()

#Use this to receive data
#Receives data
#Comment this out when your sending data
def receiveMsg():
    msg = radio.receive()
    if msg:
        print(msg)
        microbit.display.scroll("Y")
    else:
        microbit.display.scroll("N")
    sleep(200)

def main():
    radio.on()
    radio.config(channel=70)
    while True:
        receiveMsg()
        microbit.display.show(microbit.Image.SILLY)

main()