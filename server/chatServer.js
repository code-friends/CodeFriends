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
  ws.send("a user connected");
  ws.on('message', function (msg) {
    var parsedMsg = JSON.parse(msg);
    var chatRoomName = parsedMsg.message.roomID;
    console.log(parsedMsg);
    if (parsedMsg.message.type === 'message') {
      var message = parsedMsg.message.message;
      var username = parsedMsg.message.username;
      mongoClient.connectAsync('mongodb://localhost:27017/codeFriends?auto_reconnect')
        .then(function (db) {
          var chatCollection = Promise.promisifyAll(db.collection(chatRoomName));
          chatCollection.insertAsync({
            roomID: chatRoomName,
            message: message,
            username: username,
            createdAt: Date.now()
          });
        });
      //save message to the database.
      chatWS.broadcast(msg);
    }

    if (parsedMsg.message.type === 'joinRoom') {
      console.log('this is when we return the messages');
      mongoClient.connectAsync('mongodb://localhost:27017/codeFriends?auto_reconnect')
        .then(function (db) {
        console.log('chatRoomName');
          console.log(chatRoomName);
          var chatCollection = Promise.promisifyAll(db.collection(chatRoomName));
          chatCollection.find().toArray(function (err, results) {
            console.dir(results);
            ws.send(JSON.stringify({
              roomID: chatRoomName,
              type: "msgHistory",
              messages: results
            }))
          })
        })
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