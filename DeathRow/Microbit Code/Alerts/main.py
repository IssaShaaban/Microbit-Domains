from microbit import *
import radio

radio.on()
radio.config(channel=70,power=7)

""" Micro bit code used to imitate an alert"""

def main():
    DOMAIN = ["P1","H1","S1"]
    index = 0
    change = True
    while True:
        
        if button_b.is_pressed() and index != len(DOMAIN) - 1:
            index += 1
            if index == 0:
                display.show("P")

            elif index == 1:
                display.show("H")

            else:
                display.show("S")
            
            #print(str(index))
            sleep(1000)
        
        if button_a.is_pressed() and index != 0:
            index -= 1
            if index == 0:
                display.show("P")

            elif index == 1:
                display.show("H")

            else:
                display.show("S")
            
            #print(str(index))
            sleep(1000)

        if pin_logo.is_touched() and change == True:
            radio.send("ASNS:4,4,2000," + DOMAIN[index])
            change = False
            #("Send1")
            display.show("T")
            sleep(2000)

        elif pin_logo.is_touched() and change == False:
            radio.send("ASNS:5,5,500," + DOMAIN[index])
            change = True
            #print("Send2")
            display.show("G")
            sleep(2000)

        elif pin0.is_touched():
            radio.send("EMRG:8,1,93456,P1")
            display.show("A")
            sleep(2000)

        display.clear()
main()