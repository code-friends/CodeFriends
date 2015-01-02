/*global angular:true */
'use strict';

angular.module('code.chat', ['ui.router', 'ngSanitize'])
  .controller('chatController', function ($scope, $state, ngSocket, $stateParams, Auth, $interval) {
    var roomID = $stateParams.projectName;
    var username = Auth.userName;
    var ws = ngSocket('ws://' + window.location.hostname + ':' + window.config.chat);

    $scope.roomID = roomID;
    $scope.messages = [];

    var updateTime = function () {
      for (var i = 0; i < $scope.messages.length; i = i + 1) {
        $scope.messages[i].timeAgo = moment($scope.messages[i].createdAt).fromNow();
      }
    };

    $interval(function () {
      updateTime();
    }, 5000);

    ws.onOpen(function () {
      ws.send({
        type: 'joinRoom',
        roomID: roomID
      });
    });

    ws.onMessage(function (msg) {
      msg = JSON.parse(msg.data);
      if (msg.roomID === roomID) {
        if (msg.type === 'msgHistory') {
          for (var i = 0; i < msg.messages.length; i++) {
            msg.messages[i].timeAgo = moment(msg.messages[i].createdAt).fromNow();
            $scope.messages.push(msg.messages[i]);
          }
        }
      }
      if (msg.hasOwnProperty('message')) {
        if (msg.message.roomID === roomID) {
          console.log(moment(msg.message.createdAt).fromNow());
          var theDate = moment(msg.message.createdAt).fromNow();
          $scope.messages.push({
            username: msg.message.username,
            roomID: msg.message.roomID,
            message: msg.message.message,
            createdAt: theDate
          });
        }
      }
    });
    $scope.sendChat = function () {
      var params = {
        type: 'message',
        username: username,
        roomID: roomID,
        message: $scope.chatMessage,
        createdAt: Date.now()
      };
      ws.send(params);
      $scope.chatMessage = '';
    };
  })
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });
          event.preventDefault();
        }
      });
    };
  });