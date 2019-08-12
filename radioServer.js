// Constructor
class RadioServer {

    

    constructor(radioConfig) {
        this.radioConfig = radioConfig;
    }


    openSocket() {
        var dgram = require('dgram');

        this.client = dgram.createSocket('udp4');
        client.bind({
            port: this.radioConfig.port_multicast,
            exclusive: false
        });


        client.on('listening', function () {
            var address = client.address();
            console.log('UDP Client listening on ' + address.address + ":" + address.port);
            client.setBroadcast(true);
            client.setMulticastTTL(128); 
            client.addMembership(HOST);
        });

        client.on('message', function (data, remote) {   
            console.log(Buffer.from(data, 'utf8').toString('hex'));
            this.handleMessage(data, remote);
        });
    }

    openSerialPort() {

        var SerialPort = require('serialport');


        this.port = new SerialPort(this.radioConfig.port_local);

        port.on('error', function(err) {
            console.log('Error: ', err.message);
        });
        
        port.on('data', function (data) {
            sendMessageToUDP(data);
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
        client.send(line, this.radioConfig.port_inbound, this.radioConfig.ip_host);
    }


}

module.exports = RadioServer;