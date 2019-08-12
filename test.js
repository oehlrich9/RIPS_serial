console.log("Test");

var PORT = 10800;
var PORT_OUT = 10801;
var HOST = '226.0.0.11';
var MYIP = '192.168.177.104';
var dgram = require('dgram');
var client = dgram.createSocket('udp4');


var serialBuffer = Buffer.alloc(0);

client.bind({
    port: PORT,
    exclusive: false
  }); 

client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true);
    client.setMulticastTTL(128); 
    client.addMembership(HOST);
    client.addMembership('226.0.0.12');
    client.addMembership('226.0.0.13');
	console.log(client);
});

client.on('message', function (data, remote) {   
    console.log(Buffer.from(data, 'utf8').toString('hex'));
    handleMessage(data, remote);
});

function handleMessage(data, remote) {
    console.log("getting Message from: "+remote.address);
}




function getMessages(sdsMessage) {
    var lines = serialBuffer.toString().split(/(?:\r\n|\r|\n)/g);
    for(var i = 0; i < lines.length -1 ; i++) {
        serialBuffer = serialBuffer.slice(lines[i].length + 2);
        ProcessMessage(lines[i]);
    }   
}

function ProcessMessage(line) {
    sendMessageToSerial(line+'\r\n');
}

function sendMessageToSerial(line) {
    console.log("Writing from UDP to Serial: "+line);
    port.write(line);
}

function sendSerialData(line) {
    console.log("Writing from Serial to UDP:"+line);

    client.send(line, PORT_OUT, HOST);
}