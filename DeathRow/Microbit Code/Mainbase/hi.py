from microbit import *
import radio

radio.on()
radio.config(channel=70,power=7)

def sendInfo(message):
    radio.config(channel=71)
    radio.send(message)
    radio.config(channel=70)

def main():
    nuID = 2000
    while True:
        incoming = uart.read() # Reads any incoming requests from the frontend
        if incoming:
            incoming = incoming.decode('utf-8')
            if ('EMCY' in incoming):
                sendInfo('EMCY')
            if ('OUTA' in incoming):
                sendInfo('OUTA')
            if ('CAFE' in incoming):
                sendInfo('CAFE')
            if ('SECR' in incoming):
                sendInfo('SECR')
            if ('SOLC' in incoming):
                sendInfo('SOLC')
            if ('MAIN' in incoming):
                sendInfo('EMCY')
            if ('CELL' in incoming):
                sendInfo('EMCY')
            if ('INSV' in incoming):
                sendInfo('EMCY')
            if ('OUTV' in incoming):
                sendInfo('EMCY')
            if ('LOCK' in incoming):
                sendInfo('EMCY')
            if ('WAKE' in incoming):
                sendInfo('EMCY')
            
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
                radio.send(str(nuID))
                radio.config(channel=70)

main()