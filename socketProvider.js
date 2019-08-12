class SocketProvider {
    constructor() {
        this.sockets = [];
    }

    registerSocket(radioConfig) {
        var self = this;
        var socketFound = false;
        var socketIndex = -1;
        this.sockets.forEach(function(item, index) {
            if(radioConfig.port_multicast == item.port) {
                socketFound = true;
                socketIndex = index;
                throw BreakException;
            }
        });
        if(socketFound) {
            this.registerToSocket(self.sockets[socketIndex], radioConfig);
        }
        else {
            var dgram = require('dgram');
            var socket = {
                socket: dgram.createSocket('udp4'),
                ports: [],
                ip_multicast: []
            }
            this.registerToSocket(socket, radioConfig);
            this.sockets.push(socket);
        }
    }

    registerToSocket(socket, radioConfig){

    }

    openSocket() {
        registerSocket() {
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
    }
}