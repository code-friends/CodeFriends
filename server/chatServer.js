'use strict';
var WebSocketServer = require('ws').Server;
var http = require('http');
var connect = require('connect');

var chatApp = connect(),
  chatServer = http.createServer(chatApp),
  chatWS = new WebSocketServer({
    server: chatServer
  });

chatWS.on('connection', function (ws) {
  ws.send('a user has connected');
  ws.on('message', function (msg) {
    console.log(msg);
    var chatRoomName = Object.keys(msg.message)[0];
    //save message to the database.
    chatWS.broadcast(msg);
  });
});

chatWS.broadcast = function broadcast(data) {
  for (var i in this.clients) {
    if (this.clients.hasOwnProperty(i)) {
      this.clients[i].send(data);
    }
  }
};

module.exports = chatServer;