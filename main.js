
const fs = require('fs');
const RadioServer = require('./RadioServer');

var config = JSON.parse(fs.readFileSync('config.json'));
console.log(config.radios.length);

var radioserver = new RadioServer(config);
