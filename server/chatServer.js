'use strict';
var WebSocketServer = require('ws').Server;
var http = require('http');
var connect = require('connect');
var Promise = require('bluebird');
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);

var chatApp = connect(),
  chatServer = http.createServer(chatApp),
  chatWS = new WebSocketServer({
    server: chatServer
  });

chatWS.on('connection', function (ws) {
  console.log('Chat WS: New Connection Established');
  ws.on('message', function (msg) {
    var parsedMsg = JSON.parse(msg);
    var chatRoomName = parsedMsg.message.roomID;
    if (parsedMsg.message.type === 'message') {
      var message = parsedMsg.message.message;
      var username = parsedMsg.message.username;
      var createDate = parsedMsg.message.createdAt;
      mongoClient.connectAsync('mongodb://localhost:27017/codeFriends?auto_reconnect')
        .then(function (db) {
          var chatCollection = Promise.promisifyAll(db.collection(chatRoomName));
          chatCollection.insertAsync({
            roomID: chatRoomName,
            message: message,
            username: username,
            createdAt: createDate
          });
        });
      //save message to the database.
      chatWS.broadcast(msg);
    }

    if (parsedMsg.message.type === 'joinRoom') {
      mongoClient.connectAsync('mongodb://localhost:27017/codeFriends?auto_reconnect')
        .then(function (db) {
          var chatCollection = Promise.promisifyAll(db.collection(chatRoomName));
          chatCollection.find().toArray(function (err, results) {
            ws.send(JSON.stringify({
              roomID: chatRoomName,
              type: 'msgHistory',
              messages: results
            }));
          });
        });
    }

    if (parsedMsg.message.type === 'New File Created') {
      console.log('server will send message for all group in project to refresh project data');
      var projectMsg = {
        type: 'refresh project'
      };
      chatWS.broadcast(JSON.stringify(projectMsg));
    }
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