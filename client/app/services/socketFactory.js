/*global angular:true, moment:true, _:true */
(function () {
  'use strict';

  angular.module('codeFriends.services')
    .factory('SocketFactory', ['AuthFactory', 'ngSocket', '$stateParams', function (AuthFactory, ngSocket, $stateParams) {
      var socketConnection = {};
      var locationName = window.location.hostname;
      var chatPort = window.config.ports.chat;
      var ws = ngSocket('ws://' + locationName + ':' + chatPort);
      var username = AuthFactory.userName;
      var avatar = AuthFactory.githubAvatarUrl;

      // Send joinedRoom message to the server
      ws.onOpen(function () {
        var connectionObj = {
          type: 'joinRoom',
          roomID: $stateParams.projectName,
          username: username,
          githubAvatar: avatar
        };
        ws.send(connectionObj);
      });

      ws.onMessage(function (msg) {
        msg = JSON.parse(msg.data);

        if (msg.roomID === $stateParams.projectName) {
          if (msg.type === 'attendence check') {
            ws.send({
              type: 'user present',
              roomID: $stateParams.projectName,
              username: username,
              githubAvatar: avatar
            });
          }
        }
      });

      socketConnection.usersOnline = function (callback, roomID) {
        ws.onMessage(function (msg) {
          msg = JSON.parse(msg.data);
          if (msg.roomID === roomID) {
            if (msg.type === 'refresh users') {
              callback(msg);
            }
          }
        });
      };

      socketConnection.onRefreshProject = function (callback) {
        ws.onMessage(function (msg) {
          var parsedMsg = JSON.parse(msg.data);
          if (parsedMsg.type === 'refresh project') {
            callback();
          }
        });
      };

      socketConnection.send = function (msg) {
        ws.send(msg);
      };

      socketConnection.onMessageHistory = function (messagecallback, roomID, usercallback) {
        ws.onMessage(function (msg) {
          msg = JSON.parse(msg.data);
          if (msg.roomID === roomID) {
            if (msg.type === 'msgHistory') {
              for (var i = 0; i < msg.messages.length; i++) {
                msg.messages[i].timeAgo = moment(msg.messages[i].createdAt).fromNow();
                messagecallback(msg.messages[i]);
              }
            }
          }
        });
      };

      socketConnection.onChat = function (callback, roomID) {
        ws.onMessage(function (msg) {
          var parsedMsg = JSON.parse(msg.data);
          if (parsedMsg.hasOwnProperty('message')) {
            if (parsedMsg.message.roomID === roomID) {
              var theDate = moment(parsedMsg.message.createdAt).fromNow();
              callback(parsedMsg.message);
            }
          }
        });
      };

      socketConnection.sendChat = function (chatParams) {
        ws.send(chatParams);
      };

      return socketConnection;
    }]);
})();