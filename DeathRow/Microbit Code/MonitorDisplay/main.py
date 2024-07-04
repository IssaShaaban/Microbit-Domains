from microbit import *
import radio

""" Sends a timetable user message to main base microbit """

emergency_sound = [
    'C5:1', 'D5:1', 'E5:1', 'F5:1', 'G5:1', 'A5:1', 'B5:1', 'C6:1',
    'C6:1', 'B5:1', 'A5:1', 'G5:1', 'F5:1', 'E5:1', 'D5:1', 'C5:1',
]

def main():
    radio.on()
    radio.config(channel=71)
    while True:
        fullMsg = radio.receive_full()
        if fullMsg:
            msg, rssi, timestamp = fullMsg
            msgDecoded = msg.decode('utf-8')
        
            if "DSTT" in msgDecoded and rssi >= -30:
                display.show(Image.HAPPY)
                radio.config(channel=70)
                radio.send(msgDecoded)
                sleep(3000)
                display.clear()
                radio.config(channel=71)
            
            if "EMCY" in msgDecoded:
                while True:
                    display.show(Image.DIAMOND)
                    music.play(emergency_sound)

main()