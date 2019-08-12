class SocketProvider {
    constructor() {
        this.sockets = [];
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
            this.sockets[socketIndex].callbackfunc[radioConfig.ip_host] = callbackfunc;
        }
        else {
            var dgram = require('dgram');
            var socket =  dgram.createSocket('udp4')
            socket.bind({
                port: radioConfig.port_multicast,
                exclusive: false
            });
            socket.setBroadcast(true);
            socket.setMulticastTTL(128); 
            socket.callbackfunctions = {};
            socket.on('message', function (data, remote) {  
                if(callbackfunctions[remote.address] != undefined) {
                    callbackfunctions[remote.address](data, remote);
                } 
            });
            socket.callbackfunc[radioConfig.ip_host] = callbackfunc;
            this.sockets.push(this.socket);
        }
    }

    sendMessage(msg, port, ip) {
        console.log("Writing to UDP:"+msg);
        var socket =  dgram.createSocket('udp4')
        socket.send(msg, port, ip);
    }
}

module.exports=SocketProvider;