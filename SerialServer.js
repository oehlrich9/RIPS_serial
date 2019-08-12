// Constructor
class RadioServer {

    
    constructor(radioConfig, socketProvider) {
        var self = this;
        self.socketProvider = socketProvider;
        this.radioConfig = radioConfig;
		this.registerSocket();
		this.openSerialPort();
    }


    registerSocket() {
		self.socketProvider.registerSocket(this.radioConfig, this.handleMessage);
    }

    handleMessage(data, remote) {
        console.log("getting Message from: "+remote.address);
        this.sendMessageToSerial(data);
    }

    sendMessageToSerial(line) {
        console.log("Writing from UDP to Serial: "+line);
        this.port.write(line);
    }
    
    sendMessageToUDP(line) {
        self.socketProvider.sendMessageToUDP(line, this.radioConfig.port_inbound, this.radioConfig.ip_host);
    }


}

module.exports = RadioServer;