class SocketProvider {
    constructor() {
        this.sockets = [];
        this.callbackfunctions = {};
		this.ports = [];
    }

    registerSocket(radioConfig, callbackfunc) {
        var self = this;
        var socketFound = false;
        var socketIndex = -1;
		console.log(this.sockets);
		for(let index = 0; index < this.ports.length; index++){
			var item = this.ports[index];
			console.log(item);
            if(radioConfig.port_multicast == item) {
                socketFound = true;
                socketIndex = index;
                break;
            }
		}
        if(socketFound) {
            this.sockets[socketIndex].addMembership(radioConfig.ip_multicast);
            this.callbackfunctions[radioConfig.ip_host] = callbackfunc;
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
            this.ports.push(radioConfig.port_multicast);
            socket.on('message', function (data, remote) {
				console.log("Message received"+data);
				if(this.callbackfunctions[remote.address] != undefined) {
					this.callbackfunctions[remote.address](data, remote);
				} 
			});
            this.callbackfunctions[radioConfig.ip_host] = callbackfunc;
            this.sockets.push(socket);
        }
    }

    selectCallback(data, remote) {
		console.log("Message received"+data);
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