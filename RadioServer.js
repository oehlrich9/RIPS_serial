// Constructor
class RadioServer {

    
    constructor(radioConfigs) {
		var self = this;
        this.radioConfigs = radioConfigs.radios;
        this.sockets= [];
		
		self.serial_ports = {};

		var dgram = require('dgram');
		this.outClient = dgram.createSocket('udp4');
		
		this.openSockets();
        this.openSerialPorts();
        
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
				var port = item;
                var address = client.address();
                console.log('UDP Client listening on ' + address.address + ":" + address.port);
                client.setBroadcast(true);
                client.setMulticastTTL(128);
				self.radioConfigs.forEach(item2 => {
                    if(item2.port_multicast == client.address().port){
                        client.addMembership(item2.ip_multicast);
                    }
                });
            });
            client.on('message', function (data, remote) {   
                self.handleMessage(data, remote);
            });
			//self.client = client;
            self.sockets.push(client);
        });	
    }

    openSerialPorts() {
		var SerialPort = require('serialport');
		
		var self = this;
		self.radioConfigs.forEach(item => {
                self.serial_ports[item.ip_host]= {
					port: item.port_local,
					ip_host: item.ip_host
				}
				var port = new SerialPort(item.port_local);

				port.on('error', function(err) {
					console.log('Error: ', err.message);
				});
        
				port.on('data', function (data) {
					self.sendMessageToUDP(data, item.ip_host, item.port_inbound);
				});
				
				self.serial_ports[item.ip_host].serial_port=port;
        });
    }

    handleMessage(data, remote) {
        //console.log("getting Message from: "+remote.address);
        this.sendMessageToSerial(data, this.serial_ports[remote.address].serial_port);
    }

    sendMessageToSerial(line, port) {
        //console.log("Writing from UDP to Serial: "+line);
        port.write(line);
    }
    
    sendMessageToUDP(line, address, port) {
        console.log("Writing from Serial to UDP:"+address+"with data "+line);
        this.outClient.send(line, port, address);
    }


}

module.exports = RadioServer;