// Constructor
class RadioServer {

    
    constructor(radioConfig) {
		var self = this;
        this.radioConfig = radioConfig;
		this.registerSocket();
		this.openSerialPort();
    }


    openSocket() {
		var self = this;
        var dgram = require('dgram');

        self.client = dgram.createSocket('udp4');
        self.client.bind({
            port: self.radioConfig.port_multicast,
            exclusive: false
        });


        self.client.on('listening', function (item) {
            var address = self.client.address();
            console.log('UDP Client listening on ' + address.address + ":" + address.port);
            self.client.setBroadcast(true);
            self.client.setMulticastTTL(128); 
            self.client.addMembership(self.radioConfig.ip_multicast);
        });

        self.client.on('message', function (data, remote) {   
            console.log(Buffer.from(data, 'utf8').toString('hex'));
            self.handleMessage(data, remote);
        });
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

    handleMessage(data, remote) {
        console.log("getting Message from: "+remote.address);
        this.sendMessageToSerial(data);
    }

    sendMessageToSerial(line) {
        console.log("Writing from UDP to Serial: "+line);
        this.port.write(line);
    }
    
    sendMessageToUDP(line) {
        console.log("Writing from Serial to UDP:"+line);
        this.client.send(line, this.radioConfig.port_inbound, this.radioConfig.ip_host);
    }


}

module.exports = RadioServer;