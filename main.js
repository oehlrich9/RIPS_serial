
const fs = require('fs');
const SerialServer = require('./SerialServer');
const SocketProvider = require('./SocketProvider');

var config = JSON.parse(fs.readFileSync('config.json'));
console.log(config.radios.length);
var serialServers = [];
var sockerProvider = new SockerProvider();

config.radios.forEach(function(radio, id) {
    serialServers.push(new SerialServer(radio, sockerProvider));
});