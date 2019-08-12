// Constructor
class RadioServer {

    
    constructor(radioConfigs) {
		var self = this;
        this.radioConfigs = radioConfigs;
        this.sockets= [];
		this.openSockets();
        this.openSerialPort();
        
    }


    openSockets() {
		var self = this;
        var dgram = require('dgram');

        var ports = [];
        console.log(this.radioConfigs);
        this.radioConfigs.forEach(function(item){
            if(!ports.includes(item.port_multicast)){
                ports.push(item.port_multicast);
            }
        });


        ports.forEach(function(item) {
            var client = dgram.createSocket('udp4');
            client.bind({
                port: item,
                exclusive: false
            });
    
    
            client.on('listening', function (item) {
                var address = self.client.address();
                console.log('UDP Client listening on ' + address.address + ":" + address.port);
                self.client.setBroadcast(true);
                self.client.setMulticastTTL(128);
                this.radioConfigs.forEach(function(item2){
                    if(item2.port_multicast == item){
                        self.client.addMembership(item2.ip_multicast);
                    }
                });
                
            });
            client.on('message', function (data, remote) {   
                self.handleMessage(data, remote);
            });

            this.sockets.push(client);
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
        //this.sendMessageToSerial(data);
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