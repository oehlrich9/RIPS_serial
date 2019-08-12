console.log("Test");

var PORT = 10800;
var HOST = '226.0.0.11';
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var id = 0;

var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var port = new SerialPort('COM1');

var parser = new Readline();
port.pipe(parser);

parser.on('data', sendSerialData);




var lastHeaderType = null;
var lastHeaderMessage = null;

var serialBuffer = Buffer.alloc(0);


client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true)
    client.setMulticastTTL(128); 
    client.addMembership('226.0.0.11');
});

client.on('message', function (data, remote) {   
    //console.log('A: Epic Command Received. Preparing Relay.');
    serialBuffer = Buffer.concat([serialBuffer, data]);
    getMessages();
});




function getMessages(sdsMessage) {
    var lines = serialBuffer.toString().split(/(?:\r\n|\r|\n)/g);
    for(var i = 0; i < lines.length -1 ; i++) {
        serialBuffer = serialBuffer.slice(lines[i].length + 2);
        ProcessMessage(lines[i]);
    }   
}

function ProcessMessage(line) {
    sendMessageToSerial(line);
}

function sendMessageToSerial(line) {
    port.write(line);
}

function sendSerialData(line) {
    client.send(line);
}

client.bind(PORT);