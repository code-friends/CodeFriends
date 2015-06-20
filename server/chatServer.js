'use strict';

var config = require('config');
var WebSocketServer = require('ws').Server;
var http = require('http');
var connect = require('connect');
var Promise = require('bluebird');
//var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
//var _mongoClient = mongoClient.connectAsync(config.get('mongo'));
var r = require('./rethinkdb');

var chatApp = connect(),
  chatServer = http.createServer(chatApp),
  chatWS = new WebSocketServer({
    server: chatServer
  });

var userConnections = {};
var tables = {};

chatWS.on('connection', function (ws) {

  // Listen for new Tables as they're being created
  r.connect(config.get('rethinkdb'))
   .then(function (conn) {
      return r.db('rethinkdb').table('table_config')
       .filter({ db: config.get('rethinkdb').db })
       .changes()
       .run(conn)
       .then(function (cursor) {
         cursor.each(function (err, res) {
           tables[res.new_val.name] = res;
         });
         // Get all the tables
         return r.db('rethinkdb').table('table_config')
          .filter({ db: 'code_friends' })
          .coerceTo('array')
          .run(r.conn)
          .then(function (res) {
            res.forEach(function (table) {
              tables[table.name] = table;
            });
          });
       });
   });

  ws.on('message', function (msg) {
    var parsedMsg = JSON.parse(msg);
    var chatRoomName = parsedMsg.message.roomID;
    var username = parsedMsg.message.username;
    if (parsedMsg.message.type === 'message') {
      var message = parsedMsg.message.message;
      var createDate = parsedMsg.message.createdAt;
      r.ready
        .then(function () {
          if (tables[chatRoomName] === undefined) {
            return r.tableCreate(chatRoomName).run(r.conn);
          }
          return true;
        })
        .then(function () {
          return r.table(chatRoomName)
            .insert({
              roomID: chatRoomName,
              message: message,
              username: username,
              createdAt: createDate
            })
            .run(r.conn);
        });
      //_mongoClient
        //.then(function (db) {
          //var chatCollection = Promise.promisifyAll(db.collection(chatRoomName));
          //chatCollection.insertAsync({
            //roomID: chatRoomName,
            //message: message,
            //username: username,
            //createdAt: createDate
          //});
        //});
      //save message to the database.
      chatWS.broadcast(msg);
    }

    if (parsedMsg.message.type === 'joinRoom') {
      if (userConnections[chatRoomName] === undefined) {
        userConnections[chatRoomName] = {};
      }
      userConnections[chatRoomName][username] = {
        username: parsedMsg.message.username,
        githubAvatar: parsedMsg.message.githubAvatar
      };
      r.ready
        .then(function (conn) {
          return r.table(chatRoomName)
           .coerceTo('array')
           .run(conn)
           .then(function (results) {
              ws.send(JSON.stringify({
                roomID: chatRoomName,
                type: 'msgHistory',
                messages: results
              }));
              chatWS.broadcast(JSON.stringify({
                type: 'refresh users',
                userConnections: userConnections[chatRoomName],
                roomID: chatRoomName
              }));
           });
        })
        .catch(function (err) {
          console.log('Error writing');
        });
      //_mongoClient
        //.then(function (db) {
          //var chatCollection = Promise.promisifyAll(db.collection(chatRoomName));
          //chatCollection.find().toArray(function (err, results) {
            //ws.send(JSON.stringify({
              //roomID: chatRoomName,
              //type: 'msgHistory',
              //messages: results
            //}));
            //chatWS.broadcast(JSON.stringify({
              //type: 'refresh users',
              //userConnections: userConnections[chatRoomName],
              //roomID: chatRoomName
            //}));
          //});
        //});
    }

    if (parsedMsg.message.type === 'project structure changed') {
      var projectMsg = {
        type: 'refresh project'
      };
      chatWS.broadcast(JSON.stringify(projectMsg));
    }

    if (parsedMsg.message.type === 'remove this video') {
      var broadcastObj = {
        type: 'remove video broadcast',
        videoID: parsedMsg.message.videoID
      };

      chatWS.broadcast(JSON.stringify(broadcastObj));
    }

    if (parsedMsg.message.type === 'leave room') {
      for (var i in userConnections) {
        for (var j in userConnections[i]) {
          if (userConnections[i].hasOwnProperty(j)) {
            if (userConnections[i][j].username === parsedMsg.message.username) {
              delete userConnections[i][j];
              chatWS.broadcast(JSON.stringify({
                type: 'refresh users',
                userConnections: userConnections[i],
                roomID: i
              }));
            }
          }
        }
      }
    }

    if (parsedMsg.message.type === 'user present') {
      userConnections[chatRoomName][username] = {
        username: parsedMsg.message.username,
        githubAvatar: parsedMsg.message.githubAvatar
      };
      chatWS.broadcast(JSON.stringify({
        type: 'refresh users',
        userConnections: userConnections[chatRoomName],
        roomID: chatRoomName
      }));
    }
    ws.on('close', function () {
      userConnections[chatRoomName] = {};
      chatWS.broadcast(JSON.stringify({
        type: 'attendence check',
        roomID: chatRoomName
      }));
    });
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
