class SocketProvider {
    constructor() {
        this.sockets = [];
        this.callbackfunctions = {};
    }

    registerSocket(radioConfig, callbackfunc) {
        var self = this;
        var socketFound = false;
        var socketIndex = -1;
        this.sockets.forEach(function(item, index) {
            if(radioConfig.port_multicast == item.address().port) {
                socketFound = true;
                socketIndex = index;
                throw BreakException;
            }
        });
        if(socketFound) {
            this.sockets[socketIndex].addMembership(radioConfig.ip_multicast);
            this.callbackfunc[radioConfig.ip_host] = callbackfunc;
        }
        else {
            var dgram = require('dgram');
            
            var socket =  dgram.createSocket('udp4');
            socket.on('listening', function(){
                socket.setBroadcast(true);
                socket.setMulticastTTL(128); 
                socket.addMembership(radioConfig.ip_multicast);
            });
            
            socket.bind({
                port: radioConfig.port_multicast,
                exclusive: false
            });
            
            socket.on('message', self.selectCallback);
            this.callbackfunctions[radioConfig.ip_host] = callbackfunc;
            this.sockets.push(this.socket);
        }
    }

    selectCallback(data, remote) {
        if(this.callbackfunctions[remote.address] != undefined) {
            this.callbackfunctions[remote.address](data, remote);
        } 
    }

    sendMessage(msg, port, ip) {
        console.log("Writing to UDP:"+msg);
        var socket =  dgram.createSocket('udp4')
        socket.send(msg, port, ip);
    }
}

module.exports=SocketProvider;