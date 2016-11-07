'use strict'

var debug = require('debug')('spaceInvaders.server');
var http = require('http');
var os = require('os');
var socketIO = require('socket.io');

var app = require('./app.js');

var Collection = require('./lib/collection.js');
var VirtualJoystickServer = require('./lib/virtualJoystickServer.js');

var httpServer = http.createServer(app);
var io = socketIO.listen(httpServer);

var serverIPaddress = new Collection();

// // Version YUN
// var broadsignControl = require('./lib/broadsign.js');
// var networkInterfaces = os.networkInterfaces();
// debug('NET ', networkInterfaces);
//
// for (var i in networkInterfaces) {
//     var subNet = networkInterfaces[i];
//     debug('SUB NET ' + i + ' : ' + JSON.stringify(subNet));
//     for (var j in subNet) {
//         debug('NET LIST -> ' + j + ' : '+ JSON.stringify(subNet[j]));
//         if ((subNet[j].family == 'IPv4') && (subNet[j].internal == false)) {
//             debug('NET ADD -> ' + i +' : ' + subNet[j].address);
//             serverIPaddress.add(i,subNet[j].address);
//         }
//     }
// }
//
// // Version YUN

//Version Bouchon
serverIPaddress.add('wlan0','192.168.10.166');
serverIPaddress.add('eth1','192.168.10.166');

//Version Bouchon

app.locals.netConfig = {
  address:serverIPaddress,
  port: app.settings.port
};

var serverJoystick = new VirtualJoystickServer(io, 45);
serverJoystick.init();
serverJoystick.Events.on("close_game", function () {
    debug("CLOSE GAME SPACE INVADERS EVENTS");
});

httpServer.listen(app.get('port'), function () {
  debug('Express server listening on port ' + httpServer.address().port);
});
