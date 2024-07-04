from microbit import *
import radio

""" Main microbit base station. Sends data to and from serial port"""

radio.on()
radio.config(channel=70,power=7)
dom = ["P1","H1","S1"]
def sendInfo(message):
    radio.config(channel=71)
    radio.send(message)
    radio.config(channel=70)
def selectnum(nuID,multi,domi):
        global dom
        p = False # flag for printing the id
        if(button_a.get_presses()):#increases id 
            nuID = nuID -(1*multi)
            p = True
        if(button_b.get_presses()):# decreases id 
            nuID = nuID +(1*multi) 
            p = True
        if(pin_logo.is_touched()):# x1- to multiplier 
            
            multi = multi*10
            
            if multi > 10000:
                multi =1
            p = True
            sleep(100)
        if p == True:
            if nuID >= 100000 or nuID <0:
                nuID = 0
            select = ["-","-","-","-","-"]
            select[len(str(multi)) - 1] = "^"
            print('%0.5d'%nuID)
            for i in reversed(select): print(i,end="")
            print()
            display.scroll(nuID,wait=False,loop=True)
        if pin0.is_touched():
            domi +=1
            if (domi > len(dom)-1):
                domi = 0
            display.scroll(dom[domi], wait=False, loop=True)
            #print("new domain:"+dom[domi])
            sleep(500)
            

        return nuID,multi,domi

def main():
    nuID = 0
    multi = 1
    domi = 0
    
    
    while True:
        nuID,multi, domi = selectnum(nuID,multi,domi)
        #display.scroll(nuID,delay=150,wait=False)
        incoming = uart.read() # Reads any incoming requests from the frontend
        if incoming:
            incoming = incoming.decode('utf-8')
            if ('EMCY' in incoming):
                if "P1" in incoming:
                    first = incoming.find('P1')
                    message = incoming[first:first+2]
                    sendInfo("EMCYP1")
                
                if "H1" in incoming:
                    first = incoming.find('H1')
                    message = incoming[first:first+2]
                    sendInfo("EMCYH1")
            
                if "S1" in incoming:
                    first = incoming.find('S1')
                    message = incoming[first:first+2]
                    sendInfo("EMCYS1")
                
            elif ('LOCK' in incoming):
                sendInfo('LOCK')
            
            elif ('WAKE' in incoming):
                sendInfo('WAKE')
            
            elif ('ALRT' in incoming):
                first = incoming.find('ALRT')
                message = incoming[first:first+6]
                sendInfo(message)
            

            
        msg = radio.receive() # Sends data to database or frontend
        if msg:
            msg = msg.decode()
            if "STRG:" in msg or "SNSR:" in msg:
                print(msg)
            if "SPVR:" in msg or "GURD:" in msg:
                print(msg)
            if "ASNS:" in msg or "DSTT:" in msg:
                print(msg)
            if "EMRG:" in msg:
                print(msg)
                display.show(Image.YES)
                radio.config(channel=71)
                radio.send(msg)
                radio.config(channel=70)
                sleep(1000)
                display.clear()
            if "USER" in msg:
                radio.config(channel=72)
                radio.send(str(nuID)+"/"+dom[domi])
                radio.config(channel=70)
            if "AREA" in msg:
                radio.config(channel=73)
                radio.send(str(nuID)+"/"+dom[domi])
                radio.config(channel=70)
            if "KEY" in msg:
                radio.config(channel=74)
                radio.send(dom[domi])
                radio.config(channel=70)

                
        sleep(100)

main()