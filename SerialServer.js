// Constructor
class RadioServer {

    
    constructor(radioConfig, socketProvider) {
        var self = this;
        self.socketProvider = socketProvider;
        this.radioConfig = radioConfig;
		this.registerSocket();
		this.openSerialPort();
    }

    openSerialPort() {
		var self = this;
        var SerialPort = require('serialport');


        self.port = new SerialPort(self.radioConfig.port_local);

        self.port.on('error', function(err) {
            console.log('Error: ', err.message);
        });
        
        self.port.on('data', function (data) {
            self.sendMessageToUDP(data);
        });

    }


    registerSocket() {
		this.socketProvider.registerSocket(this.radioConfig, this.handleMessage);
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
        this.socketProvider.sendMessageToUDP(line, this.radioConfig.port_inbound, this.radioConfig.ip_host);
    }


}

module.exports = RadioServer;