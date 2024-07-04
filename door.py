from PiicoDev_VL53L1X import PiicoDev_VL53L1X
from microbit import *
from time import sleep
import radio

distSensor = PiicoDev_VL53L1X()

# Main program
def main():
    radio.config(channel=70)
    radio.on()
    while True:
        dist = distSensor.read()/10
        
        if dist > 20 and dist < 195:
            radio.send("User Entered")
        else:
            sleep(0.5)
            radio.send(str(dist))
        
main()