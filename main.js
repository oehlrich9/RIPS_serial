
const fs = require('fs');
const RadioServer = require('./RadioServer');

var config = JSON.parse(fs.readFileSync('config.json'));
console.log(config.radios.length);
var radioServer = [];

config.radios.forEach(function(radio, id) {
    radioServer.push(new RadioServer(radio));
});