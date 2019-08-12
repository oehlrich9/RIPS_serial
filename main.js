
const fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json'));

var radioServer = [];

config.radios.foreach(function(radio, id) {
    radioServer.push(new RadioServer(radio));
});